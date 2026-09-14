import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, CheckCircle2, ChevronRight, Loader2, Lock, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import xiMark from "@/assets/xi-mark.png";
import { useAuth } from "@/lib/auth-context";
import { formatINR, useCart } from "@/lib/cart-context";
import { supabase, type Address, type ShippingAddress } from "@/lib/supabase";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — ARCHIVE XI" },
      { name: "description", content: "Complete your order with ARCHIVE XI." },
    ],
  }),
  component: CheckoutPage,
});

type CheckoutStep = "details" | "review" | "confirmed";

export function CheckoutPage() {
  const { items, totalItems, subtotalPaise, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<CheckoutStep>("details");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address book for authenticated users
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");

  // Shipping details form state
  const [guestEmail, setGuestEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [saveToAccount, setSaveToAccount] = useState(false);

  // Order confirmed state
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Load saved addresses if user is authenticated
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    const fetchAddresses = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (isMounted && data && data.length > 0) {
        setSavedAddresses(data);
        // Default to the first (default) address
        setSelectedAddressId(data[0].id);
        const def = data[0];
        setFullName(def.full_name);
        setPhone(def.phone);
        setLine1(def.line1);
        setLine2(def.line2 ?? "");
        setCity(def.city);
        setState(def.state);
        setPincode(def.pincode);
      }
      if (isMounted) setLoading(false);
    };

    fetchAddresses();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // When selecting an existing address
  const handleSelectAddress = (id: string | "new") => {
    setSelectedAddressId(id);
    setError(null);
    if (id === "new") {
      setFullName("");
      setPhone("");
      setLine1("");
      setLine2("");
      setCity("");
      setState("");
      setPincode("");
    } else {
      const match = savedAddresses.find((a) => a.id === id);
      if (match) {
        setFullName(match.full_name);
        setPhone(match.phone);
        setLine1(match.line1);
        setLine2(match.line2 ?? "");
        setCity(match.city);
        setState(match.state);
        setPincode(match.pincode);
      }
    }
  };

  const handleProceedToReview = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user && !guestEmail.trim()) {
      setError("Please enter your email address for order updates.");
      return;
    }
    if (!fullName.trim() || !phone.trim() || !line1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setError("Please fill in all required address fields.");
      return;
    }

    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const shippingAddress: ShippingAddress = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      };

      // If authenticated user chose to save a new address
      if (user && selectedAddressId === "new" && saveToAccount) {
        await supabase.from("addresses").insert({
          user_id: user.id,
          full_name: shippingAddress.full_name,
          phone: shippingAddress.phone,
          line1: shippingAddress.line1,
          line2: shippingAddress.line2 ?? null,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          is_default: savedAddresses.length === 0,
        });
      }

      // Prepare items for create_order RPC: [{ product_id, quantity }]
      const rpcItems = items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      }));

      // Fixed contract call: create_order RPC
      const { data, error: rpcError } = await supabase.rpc("create_order", {
        p_items: rpcItems,
        p_shipping_address: shippingAddress,
        p_guest_email: user ? null : guestEmail.trim(),
      });

      if (rpcError) {
        throw new Error(rpcError.message || "Failed to create order. Please try again.");
      }

      // create_order returns the created order record (or order_id)
      const orderId = typeof data === "object" && data !== null && "id" in data ? (data as { id: string }).id : String(data);

      setPlacedOrderId(orderId);
      clearCart();
      setStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong creating your order.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  // If cart is empty and not on confirmed step
  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="checkout-page">
        <header className="checkout-topbar">
          <Link to="/" className="auth-brand" aria-label="ARCHIVE XI home">
            <span>ARCHIVE</span>
            <img src={xiMark} alt="" width={28} height={28} />
          </Link>
        </header>
        <main className="checkout-empty">
          <ShoppingBag size={38} strokeWidth={1} />
          <h2>Your bag is empty</h2>
          <p>Add items from our collection before proceeding to checkout.</p>
          <Link to="/shop" className="af-save checkout-empty-btn">
            Explore Collection
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Top minimalistic header */}
      <header className="checkout-topbar">
        <Link to="/" className="auth-brand" aria-label="ARCHIVE XI home">
          <span>ARCHIVE</span>
          <img src={xiMark} alt="" width={28} height={28} />
        </Link>
        <div className="checkout-security-badge">
          <Lock size={12} strokeWidth={1.5} />
          <span>Encrypted Checkout</span>
        </div>
      </header>

      {/* Progress Steps */}
      <nav className="checkout-stepper" aria-label="Checkout steps">
        <div className={`checkout-step-tab ${step === "details" ? "step-active" : step === "review" || step === "confirmed" ? "step-done" : ""}`}>
          <span className="step-num">1</span>
          <span className="step-text">Details</span>
        </div>
        <ChevronRight size={14} className="step-divider" />
        <div className={`checkout-step-tab ${step === "review" ? "step-active" : step === "confirmed" ? "step-done" : ""}`}>
          <span className="step-num">2</span>
          <span className="step-text">Review</span>
        </div>
        <ChevronRight size={14} className="step-divider" />
        <div className={`checkout-step-tab ${step === "confirmed" ? "step-active" : ""}`}>
          <span className="step-num">3</span>
          <span className="step-text">Confirmation</span>
        </div>
      </nav>

      <main className="checkout-container">
        {error && (
          <div className="auth-error checkout-alert" role="alert">
            {error}
          </div>
        )}

        {/* ── STEP 1: Details ────────────────────────────────────────── */}
        {step === "details" && (
          <div className="checkout-grid">
            <section className="checkout-main-col" aria-labelledby="shipping-details-heading">
              <h1 id="shipping-details-heading" className="checkout-title">Shipping & Contact</h1>

              {!user && !authLoading && (
                <div className="checkout-auth-banner">
                  <span>Already have an ARCHIVE XI account?</span>
                  <Link to="/login" search={{ redirect: "/checkout" }} className="checkout-login-link">
                    Sign in for faster checkout
                  </Link>
                </div>
              )}

              <form id="checkout-form" onSubmit={handleProceedToReview} className="checkout-form">
                {/* Contact section */}
                <div className="checkout-section">
                  <h2 className="checkout-section-subhead">Contact Information</h2>
                  {user ? (
                    <div className="checkout-user-badge">
                      <span>Logged in as <strong>{user.email}</strong></span>
                    </div>
                  ) : (
                    <div className="af-field af-full">
                      <label htmlFor="guest-email">Email address *</label>
                      <input
                        id="guest-email"
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                      <span className="checkout-field-hint">We'll send order confirmations and receipt here.</span>
                    </div>
                  )}
                </div>

                {/* Saved addresses for logged in users */}
                {user && savedAddresses.length > 0 && (
                  <div className="checkout-section">
                    <h2 className="checkout-section-subhead">Select Delivery Address</h2>
                    <div className="checkout-saved-addresses">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`checkout-addr-radio ${selectedAddressId === addr.id ? "selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name="address-choice"
                            checked={selectedAddressId === addr.id}
                            onChange={() => handleSelectAddress(addr.id)}
                          />
                          <div className="checkout-addr-body">
                            <div className="checkout-addr-header">
                              <strong>{addr.full_name}</strong>
                              {addr.is_default && <span className="address-default-badge">Default</span>}
                            </div>
                            <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                            <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                            <p className="checkout-addr-phone">{addr.phone}</p>
                          </div>
                        </label>
                      ))}

                      <label className={`checkout-addr-radio ${selectedAddressId === "new" ? "selected" : ""}`}>
                        <input
                          type="radio"
                          name="address-choice"
                          checked={selectedAddressId === "new"}
                          onChange={() => handleSelectAddress("new")}
                        />
                        <div className="checkout-addr-body">
                          <strong>Deliver to a new address</strong>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Address Form (if new address or guest) */}
                {(!user || selectedAddressId === "new") && (
                  <div className="checkout-section">
                    <h2 className="checkout-section-subhead">
                      {user ? "Enter New Address" : "Shipping Address"}
                    </h2>
                    <div className="address-form-grid">
                      <div className="af-field af-full">
                        <label htmlFor="chk-fullname">Full name *</label>
                        <input
                          id="chk-fullname"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Recipient name"
                          autoComplete="name"
                        />
                      </div>
                      <div className="af-field">
                        <label htmlFor="chk-phone">Mobile phone *</label>
                        <input
                          id="chk-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          autoComplete="tel"
                        />
                      </div>
                      <div className="af-field af-full">
                        <label htmlFor="chk-line1">Street address *</label>
                        <input
                          id="chk-line1"
                          required
                          value={line1}
                          onChange={(e) => setLine1(e.target.value)}
                          placeholder="House / flat no., building, street"
                          autoComplete="address-line1"
                        />
                      </div>
                      <div className="af-field af-full">
                        <label htmlFor="chk-line2">Apartment / Landmark</label>
                        <input
                          id="chk-line2"
                          value={line2}
                          onChange={(e) => setLine2(e.target.value)}
                          placeholder="Apartment, suite, unit, landmark (optional)"
                          autoComplete="address-line2"
                        />
                      </div>
                      <div className="af-field">
                        <label htmlFor="chk-city">City *</label>
                        <input
                          id="chk-city"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          autoComplete="address-level2"
                        />
                      </div>
                      <div className="af-field">
                        <label htmlFor="chk-state">State *</label>
                        <input
                          id="chk-state"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          autoComplete="address-level1"
                        />
                      </div>
                      <div className="af-field">
                        <label htmlFor="chk-pincode">PIN Code *</label>
                        <input
                          id="chk-pincode"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="110001"
                          maxLength={6}
                          autoComplete="postal-code"
                        />
                      </div>
                      {user && (
                        <div className="af-field af-checkbox">
                          <label>
                            <input
                              type="checkbox"
                              checked={saveToAccount}
                              onChange={(e) => setSaveToAccount(e.target.checked)}
                            />
                            Save this address to my account
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="checkout-actions">
                  <button type="submit" className="af-save checkout-cta-btn">
                    Continue to Review <ChevronRight size={14} />
                  </button>
                </div>
              </form>
            </section>

            {/* Sidebar Summary */}
            <aside className="checkout-sidebar-col" aria-label="Order summary">
              <div className="checkout-summary-card">
                <h2 className="summary-title">Order Summary ({totalItems})</h2>
                <div className="summary-items-preview">
                  {items.map((item) => (
                    <div key={item.product_id} className="summary-item-row">
                      <div className="summary-item-thumb">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="summary-item-info">
                        <p className="summary-item-name">{item.name}</p>
                        <p className="summary-item-qty">Qty: {item.quantity}</p>
                      </div>
                      <span className="summary-item-price">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotalPaise)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="summary-free-badge">Complimentary</span>
                  </div>
                  <div className="summary-row summary-total-row">
                    <span>Estimated Total</span>
                    <span className="summary-total-val">{formatINR(subtotalPaise)}</span>
                  </div>
                </div>
                <p className="summary-disclaimer">
                  Authoritative pricing & tax confirmed upon order placement.
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* ── STEP 2: Review ─────────────────────────────────────────── */}
        {step === "review" && (
          <div className="checkout-grid">
            <section className="checkout-main-col" aria-labelledby="review-order-heading">
              <button
                type="button"
                className="checkout-back-link"
                onClick={() => setStep("details")}
              >
                <ArrowLeft size={13} /> Edit shipping details
              </button>

              <h1 id="review-order-heading" className="checkout-title">Review Your Order</h1>

              <div className="review-card">
                <div className="review-section">
                  <div className="review-header-row">
                    <h2>Shipping To</h2>
                    <button type="button" className="review-edit-btn" onClick={() => setStep("details")}>
                      Change
                    </button>
                  </div>
                  <p className="review-recipient"><strong>{fullName}</strong></p>
                  <p>{line1}</p>
                  {line2 && <p>{line2}</p>}
                  <p>{city}, {state} — {pincode}</p>
                  <p className="review-phone">{phone}</p>
                  <p className="review-email">{user ? user.email : guestEmail}</p>
                </div>

                <div className="review-section">
                  <div className="review-header-row">
                    <h2>Items ({totalItems})</h2>
                  </div>
                  <div className="review-items-list">
                    {items.map((item) => (
                      <div key={item.product_id} className="review-item">
                        <img src={item.image} alt="" className="review-item-img" />
                        <div className="review-item-details">
                          <span className="review-item-title">{item.name}</span>
                          <span className="review-item-meta">Quantity: {item.quantity}</span>
                        </div>
                        <span className="review-item-subtotal">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-section review-payment-notice">
                  <div className="review-payment-header">
                    <ShieldCheck size={16} />
                    <strong>Verified Direct Placement</strong>
                  </div>
                  <p>
                    Your order will be reserved and confirmed immediately through our backend order engine.
                  </p>
                </div>

                <div className="checkout-actions">
                  <button
                    id="place-order-btn"
                    type="button"
                    className="af-save checkout-cta-btn"
                    disabled={submitting}
                    onClick={handlePlaceOrder}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="auth-spinner" /> Reserving Order Stock…
                      </>
                    ) : (
                      <>Place Order ({formatINR(subtotalPaise)})</>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Sidebar Summary */}
            <aside className="checkout-sidebar-col" aria-label="Order review summary">
              <div className="checkout-summary-card">
                <h2 className="summary-title">Summary</h2>
                <div className="summary-totals">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotalPaise)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="summary-free-badge">Complimentary</span>
                  </div>
                  <div className="summary-row summary-total-row">
                    <span>Total Due</span>
                    <span className="summary-total-val">{formatINR(subtotalPaise)}</span>
                  </div>
                </div>

                <div className="checkout-assurances">
                  <div>
                    <Truck size={14} />
                    <span>Express insured transit across India</span>
                  </div>
                  <div>
                    <ShieldCheck size={14} />
                    <span>Direct maker provenance guaranteed</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ── STEP 3: Confirmed ──────────────────────────────────────── */}
        {step === "confirmed" && (
          <div className="checkout-confirmed-card">
            <div className="confirmed-icon-wrap">
              <CheckCircle2 size={44} strokeWidth={1.5} />
            </div>
            <h1 className="confirmed-title">Order Confirmed</h1>
            <p className="confirmed-subtitle">
              Thank you for acquiring from ARCHIVE XI. Your order has been placed and stock reserved.
            </p>

            <div className="confirmed-details-box">
              <div className="confirmed-detail-row">
                <span>Order Reference</span>
                <strong className="confirmed-order-id">
                  #{placedOrderId ? placedOrderId.slice(0, 8).toUpperCase() : "PENDING"}
                </strong>
              </div>
              <div className="confirmed-detail-row">
                <span>Confirmation Sent To</span>
                <strong>{user ? user.email : guestEmail}</strong>
              </div>
              <div className="confirmed-detail-row">
                <span>Delivery Destination</span>
                <span>{city}, {state} — {pincode}</span>
              </div>
            </div>

            <div className="confirmed-actions">
              <Link to="/shop" className="af-save confirmed-btn">
                Continue Browsing
              </Link>
              {user && (
                <Link to="/account" className="af-cancel confirmed-btn-sec">
                  View in My Orders
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
