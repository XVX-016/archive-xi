import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { formatINR, useCart } from "@/lib/cart-context";

export function CartDrawer() {
  const { items, drawerOpen, removeItem, updateQty, subtotalPaise, closeDrawer } =
    useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drawerOpen, closeDrawer]);

  // Move focus into drawer when it opens
  useEffect(() => {
    if (drawerOpen) drawerRef.current?.focus();
  }, [drawerOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop${drawerOpen ? " cart-backdrop-visible" : ""}`}
        aria-hidden="true"
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`cart-drawer${drawerOpen ? " cart-drawer-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingBag size={16} strokeWidth={1.4} />
            <span>
              Your bag
              {items.length > 0 && (
                <em className="cart-drawer-count">
                  {items.reduce((a, i) => a + i.quantity, 0)}
                </em>
              )}
            </span>
          </div>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={closeDrawer}
            aria-label="Close bag"
          >
            <X size={18} strokeWidth={1.4} />
          </button>
        </div>

        {/* Body */}
        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={40} strokeWidth={1} />
            <p>Your bag is empty.</p>
            <button type="button" className="cart-continue-btn" onClick={closeDrawer}>
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-items-list" aria-label="Cart items">
              {items.map((item) => (
                <li key={item.product_id} className="cart-item">
                  {/* Thumbnail */}
                  <div className="cart-item-thumb">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={107}
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <div>
                        {item.slug ? (
                          <Link
                            to={
                              `/products/${item.slug}` as "/products/washed-utility-jacket"
                            }
                            className="cart-item-name"
                            onClick={closeDrawer}
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <span className="cart-item-name">{item.name}</span>
                        )}
                        <p className="cart-item-price">
                          {formatINR(item.price * item.quantity)}
                          {item.quantity > 1 && (
                            <span className="cart-item-unit-price">
                              {" "}
                              ({formatINR(item.price)} each)
                            </span>
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => removeItem(item.product_id)}
                        aria-label={`Remove ${item.name} from bag`}
                      >
                        <X size={13} strokeWidth={1.6} />
                      </button>
                    </div>

                    {/* Qty controls */}
                    <div className="cart-item-qty" aria-label="Quantity">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() =>
                          updateQty(item.product_id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={11} strokeWidth={2} />
                      </button>
                      <output
                        aria-live="polite"
                        aria-label={`Quantity ${item.quantity}`}
                      >
                        {item.quantity}
                      </output>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() =>
                          updateQty(item.product_id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Footer */}
            <div className="cart-drawer-footer">
              <div className="cart-subtotal-row">
                <span>Subtotal</span>
                <span>{formatINR(subtotalPaise)}</span>
              </div>
              <p className="cart-pricing-note">
                Final pricing confirmed at checkout. Shipping calculated at order
                time.
              </p>
              <Link
                to="/checkout"
                className="cart-checkout-btn"
                onClick={closeDrawer}
              >
                Proceed to checkout
              </Link>
              <button
                type="button"
                className="cart-continue-link"
                onClick={closeDrawer}
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
