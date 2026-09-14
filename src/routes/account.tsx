import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, Loader2, LogOut, Package, Plus, Star, Trash2, User, X } from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import { supabase, type Address, type Order, type OrderItem, type Profile } from "@/lib/supabase";
import { formatINR } from "@/lib/cart-context";
import xiMark from "@/assets/xi-mark.png";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — ARCHIVE XI" },
      { name: "description", content: "Manage your ARCHIVE XI account, orders and addresses." },
    ],
  }),
  component: AccountPage,
});

// ── Address form ──────────────────────────────────────────────────────────────

type AddressFormValues = {
  full_name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

const blankAddress: AddressFormValues = {
  full_name: "", phone: "", line1: "", line2: "",
  city: "", state: "", pincode: "", is_default: false,
};

function AddressForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: AddressFormValues;
  onSave: (v: AddressFormValues) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [v, setV] = useState(initial);
  const set = (k: keyof AddressFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setV((p) => ({ ...p, [k]: k === "is_default" ? e.target.checked : e.target.value }));

  return (
    <form
      className="address-form"
      onSubmit={(e) => { e.preventDefault(); onSave(v); }}
    >
      <div className="address-form-grid">
        <div className="af-field af-full">
          <label htmlFor="af-name">Full name *</label>
          <input id="af-name" required value={v.full_name} onChange={set("full_name")} placeholder="Recipient name" />
        </div>
        <div className="af-field">
          <label htmlFor="af-phone">Phone *</label>
          <input id="af-phone" required type="tel" value={v.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
        </div>
        <div className="af-field af-full">
          <label htmlFor="af-line1">Address line 1 *</label>
          <input id="af-line1" required value={v.line1} onChange={set("line1")} placeholder="House / flat, street" />
        </div>
        <div className="af-field af-full">
          <label htmlFor="af-line2">Address line 2</label>
          <input id="af-line2" value={v.line2} onChange={set("line2")} placeholder="Area, landmark (optional)" />
        </div>
        <div className="af-field">
          <label htmlFor="af-city">City *</label>
          <input id="af-city" required value={v.city} onChange={set("city")} />
        </div>
        <div className="af-field">
          <label htmlFor="af-state">State *</label>
          <input id="af-state" required value={v.state} onChange={set("state")} />
        </div>
        <div className="af-field">
          <label htmlFor="af-pincode">PIN code *</label>
          <input id="af-pincode" required value={v.pincode} onChange={set("pincode")} placeholder="110001" maxLength={6} />
        </div>
        <div className="af-field af-checkbox">
          <label>
            <input type="checkbox" checked={v.is_default} onChange={set("is_default")} />
            Set as default address
          </label>
        </div>
      </div>
      <div className="af-actions">
        <button type="button" className="af-cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="af-save" disabled={saving}>
          {saving ? <Loader2 size={14} className="auth-spinner" /> : "Save address"}
        </button>
      </div>
    </form>
  );
}

// ── Order item row ────────────────────────────────────────────────────────────

function OrderRow({ order }: { order: Order & { items?: OrderItem[] } }) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<OrderItem[]>(order.items ?? []);
  const [loading, setLoading] = useState(false);

  const statusLabel: Record<Order["status"], string> = {
    pending_payment: "Awaiting payment",
    paid: "Paid",
    fulfilled: "Fulfilled",
    cancelled: "Cancelled",
    payment_failed: "Payment failed",
  };

  const loadItems = async () => {
    if (items.length > 0) { setExpanded((e) => !e); return; }
    setLoading(true);
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);
    if (data) setItems(data);
    setLoading(false);
    setExpanded(true);
  };

  return (
    <div className="order-row">
      <button type="button" className="order-header-btn" onClick={loadItems}>
        <div className="order-meta">
          <span className="order-id">#{order.id.slice(0, 8).toUpperCase()}</span>
          <span className="order-date">{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
        <div className="order-right">
          <span className={`order-status order-status-${order.status}`}>
            {statusLabel[order.status]}
          </span>
          <span className="order-total">{formatINR(order.total)}</span>
          <ChevronDown size={14} className={`order-chevron${expanded ? " order-chevron-open" : ""}`} />
        </div>
      </button>

      {expanded && (
        <div className="order-items">
          {loading ? (
            <div className="order-items-loading"><Loader2 size={14} className="auth-spinner" /> Loading items…</div>
          ) : items.map((item) => (
            <div key={item.id} className="order-item-row">
              <span className="order-item-name">{item.name_snapshot}</span>
              <span className="order-item-qty">× {item.quantity}</span>
              <span className="order-item-price">{formatINR(item.price_snapshot * item.quantity)}</span>
            </div>
          ))}
          <div className="order-shipping-addr">
            <strong>Ship to:</strong>{" "}
            {order.shipping_address.full_name},{" "}
            {order.shipping_address.line1},{" "}
            {order.shipping_address.city},{" "}
            {order.shipping_address.state} —{" "}
            {order.shipping_address.pincode}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Tab = "profile" | "orders" | "addresses";

function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("profile");

  // Profile
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addrSaving, setAddrSaving] = useState(false);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/account" } });
    }
  }, [user, authLoading, navigate]);

  // ── Load profile ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setFullName(data.full_name ?? "");
          setPhone(data.phone ?? "");
        }
      });
  }, [user]);

  // ── Load addresses ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== "addresses" || !user) return;
    setAddrLoading(true);
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at")
      .then(({ data }) => {
        if (data) setAddresses(data);
        setAddrLoading(false);
      });
  }, [tab, user]);

  // ── Load orders ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== "orders" || !user) return;
    setOrdersLoading(true);
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
        setOrdersLoading(false);
      });
  }, [tab, user]);

  // ── Profile save ────────────────────────────────────────────────────────────
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileSaving(true);
    await supabase
      .from("profiles")
      .update({ full_name: fullName.trim() || null, phone: phone.trim() || null })
      .eq("id", user.id);
    setProfileSaving(false);
    setProfileSaved(true);
    clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setProfileSaved(false), 2500);
  };

  // ── Address save ─────────────────────────────────────────────────────────────
  const saveAddress = async (values: ReturnType<typeof Object.assign>) => {
    if (!user) return;
    setAddrSaving(true);

    // If marking as default, clear current default first
    if (values.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    if (editingAddress) {
      const { data } = await supabase
        .from("addresses")
        .update({ ...values })
        .eq("id", editingAddress.id)
        .select()
        .single();
      if (data) setAddresses((prev) => prev.map((a) => a.id === editingAddress.id ? data : (values.is_default ? { ...a, is_default: false } : a)));
    } else {
      const { data } = await supabase
        .from("addresses")
        .insert({ ...values, user_id: user.id })
        .select()
        .single();
      if (data) {
        setAddresses((prev) => {
          const updated = values.is_default ? prev.map((a) => ({ ...a, is_default: false })) : prev;
          return [...updated, data];
        });
      }
    }

    setAddrSaving(false);
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  const deleteAddress = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  // ── Loading / not authed ─────────────────────────────────────────────────────
  if (authLoading || !user) {
    return (
      <div className="account-loading">
        <Loader2 size={24} className="auth-spinner" />
      </div>
    );
  }

  return (
    <div className="account-page">
      {/* Sidebar */}
      <aside className="account-sidebar">
        <Link to="/" className="auth-brand account-brand" aria-label="ARCHIVE XI home">
          <span>ARCHIVE</span>
          <img src={xiMark} alt="" width={28} height={28} />
        </Link>

        <div className="account-user-info">
          <div className="account-avatar" aria-hidden="true">
            {(fullName || user?.email || "?")[0]?.toUpperCase()}
          </div>
          <div>
            <p className="account-user-name">{fullName || "Account"}</p>
            <p className="account-user-email">{user?.email ?? ""}</p>
          </div>
        </div>

        <nav className="account-nav" aria-label="Account sections">
          {(["profile", "orders", "addresses"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`account-nav-btn${tab === t ? " account-nav-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t === "profile" && <User size={14} strokeWidth={1.5} />}
              {t === "orders" && <Package size={14} strokeWidth={1.5} />}
              {t === "addresses" && <Star size={14} strokeWidth={1.5} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>

        <button type="button" className="account-signout-btn" onClick={handleSignOut}>
          <LogOut size={14} strokeWidth={1.5} /> Sign out
        </button>
      </aside>

      {/* Main panel */}
      <main className="account-main">
        {/* ── Profile tab ──────────────────────────────────────────────────── */}
        {tab === "profile" && (
          <section aria-labelledby="profile-heading">
            <h1 id="profile-heading" className="account-section-title">Profile</h1>
            <p className="account-section-sub">Manage your personal details.</p>
            <form className="profile-form" onSubmit={saveProfile}>
              <div className="af-field">
                <label htmlFor="profile-name">Full name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="af-field">
                <label htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={user.email ?? ""}
                  readOnly
                  className="af-readonly"
                  title="Email cannot be changed here"
                />
              </div>
              <div className="af-field">
                <label htmlFor="profile-phone">Phone</label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <button
                id="profile-save-btn"
                type="submit"
                className="af-save"
                disabled={profileSaving}
              >
                {profileSaving ? (
                  <Loader2 size={14} className="auth-spinner" />
                ) : profileSaved ? (
                  <><Check size={14} /> Saved</>
                ) : (
                  "Save changes"
                )}
              </button>
            </form>
          </section>
        )}

        {/* ── Orders tab ───────────────────────────────────────────────────── */}
        {tab === "orders" && (
          <section aria-labelledby="orders-heading">
            <h1 id="orders-heading" className="account-section-title">Orders</h1>
            <p className="account-section-sub">Your order history.</p>
            {ordersLoading ? (
              <div className="account-loading-inline">
                <Loader2 size={18} className="auth-spinner" /> Loading orders…
              </div>
            ) : orders.length === 0 ? (
              <div className="account-empty">
                <Package size={36} strokeWidth={1} />
                <p>No orders yet.</p>
                <Link to="/shop" className="af-save" style={{ textDecoration: "none" }}>
                  Shop now
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order as Order & { items?: OrderItem[] }} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Addresses tab ────────────────────────────────────────────────── */}
        {tab === "addresses" && (
          <section aria-labelledby="addresses-heading">
            <div className="account-section-header">
              <div>
                <h1 id="addresses-heading" className="account-section-title">Addresses</h1>
                <p className="account-section-sub">Saved shipping addresses.</p>
              </div>
              {!showAddressForm && (
                <button
                  id="add-address-btn"
                  type="button"
                  className="af-save"
                  onClick={() => { setEditingAddress(null); setShowAddressForm(true); }}
                >
                  <Plus size={13} /> Add address
                </button>
              )}
            </div>

            {showAddressForm && (
              <div className="address-form-wrap">
                <h2 className="address-form-title">
                  {editingAddress ? "Edit address" : "New address"}
                </h2>
                <AddressForm
                  initial={
                    editingAddress
                      ? { ...editingAddress, line2: editingAddress.line2 ?? "" }
                      : blankAddress
                  }
                  onSave={saveAddress}
                  onCancel={() => { setShowAddressForm(false); setEditingAddress(null); }}
                  saving={addrSaving}
                />
              </div>
            )}

            {addrLoading ? (
              <div className="account-loading-inline">
                <Loader2 size={18} className="auth-spinner" /> Loading addresses…
              </div>
            ) : addresses.length === 0 && !showAddressForm ? (
              <div className="account-empty">
                <p>No saved addresses.</p>
              </div>
            ) : (
              <div className="addresses-list">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`address-card${addr.is_default ? " address-card-default" : ""}`}>
                    {addr.is_default && <span className="address-default-badge">Default</span>}
                    <p className="address-name">{addr.full_name}</p>
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                    <p>{addr.phone}</p>
                    <div className="address-card-actions">
                      <button
                        type="button"
                        className="addr-action-btn"
                        onClick={() => { setEditingAddress(addr); setShowAddressForm(true); }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="addr-action-btn addr-delete-btn"
                        onClick={() => deleteAddress(addr.id)}
                        aria-label={`Delete ${addr.full_name} address`}
                      >
                        <Trash2 size={12} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
