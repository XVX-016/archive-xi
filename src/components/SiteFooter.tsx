import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

import xiMark from "@/assets/xi-mark.png";

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer id="contact" className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand-lockup footer-lockup">
            <span>ARCHIVE</span>
            <img className="brand-lockup-mark" src={xiMark} alt="" width={36} height={36} />
          </div>
          <p>
            Curated clothing.
            <br />
            Sourced with intent across China.
            <br />
            Delivered India-wide in 3–5 weeks.
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          <Link to="/shop">Shop</Link>
          <Link to="/shop">New arrivals</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div id="follow">
          <h2>Follow us</h2>
          <a href="#instagram">Instagram</a>
          <a href="#tiktok">TikTok</a>
          <a href="mailto:hello@archivexi.com">hello@archivexi.com</a>
        </div>
        <div className="newsletter">
          <h2>Stay in the loop</h2>
          <p>First access to new edits and limited restocks.</p>
          {subscribed ? (
            <p className="success">You&apos;re on the list.</p>
          ) : (
            <form onSubmit={subscribe}>
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input id="footer-email" type="email" required placeholder="EMAIL ADDRESS" />
              <button type="submit" aria-label="Subscribe">
                →
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © 2026 ARCHIVE XI · Sourced Freight: All orders ship directly to India in 3–5 weeks with all
          import duties handled.
        </p>
        <div>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/shipping">Shipping</Link>
        </div>
      </div>
    </footer>
  );
}
