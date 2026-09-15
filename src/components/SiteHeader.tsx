import { Link, useLocation } from "@tanstack/react-router";
import { CircleUserRound, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import xiMark from "@/assets/xi-mark.png";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

type SiteHeaderProps = {
  activeNav?: "home" | "shop" | "about" | "contact";
};

export function SiteHeader({ activeNav }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  const isShop =
    activeNav === "shop" ||
    location.pathname === "/shop" ||
    location.pathname.startsWith("/products");

  return (
    <header className="site-header">
      <div className="utility-bar">
        <p>COMPLIMENTARY ALL-INDIA SHIPPING OVER ₹12,000 · DELIVERED IN 3–5 WEEKS</p>
        <div className="header-icons">
          <a href="#search" aria-label="Search">
            <Search />
          </a>

          {/* Account: links to /account if signed in, /login if not */}
          <Link
            to={user ? "/account" : "/login"}
            aria-label={user ? "Your account" : "Sign in"}
            className={user ? "header-account-active" : undefined}
          >
            <CircleUserRound />
          </Link>

          {/* Cart trigger */}
          <button
            id="header-cart-btn"
            type="button"
            className="cart-trigger"
            onClick={openDrawer}
            aria-label={
              totalItems > 0
                ? `Shopping bag, ${totalItems} item${totalItems === 1 ? "" : "s"}`
                : "Shopping bag"
            }
          >
            <ShoppingBag />
            {totalItems > 0 && (
              <span className="cart-badge" aria-hidden="true">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="brand-row">
        <button
          className="mobile-menu"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <Link className="brand-lockup" to="/" aria-label="ARCHIVE XI home">
          <span>ARCHIVE</span>
          <img className="brand-lockup-mark" src={xiMark} alt="" width={44} height={44} />
        </Link>
        {/* Mobile bag */}
        <button
          type="button"
          className="mobile-bag cart-trigger"
          onClick={openDrawer}
          aria-label={
            totalItems > 0
              ? `Shopping bag, ${totalItems} item${totalItems === 1 ? "" : "s"}`
              : "Shopping bag"
          }
        >
          <ShoppingBag />
          {totalItems > 0 && (
            <span className="cart-badge cart-badge-mobile" aria-hidden="true">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </button>
      </div>

      <nav
        className={menuOpen ? "primary-nav primary-nav-open" : "primary-nav"}
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className={activeNav === "home" ? "nav-active" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/shop"
          className={isShop ? "nav-active" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          Shop
        </Link>
        <Link
          to="/about"
          className={activeNav === "about" ? "nav-active" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          About us
        </Link>
        <Link
          to="/contact"
          className={activeNav === "contact" ? "nav-active" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
