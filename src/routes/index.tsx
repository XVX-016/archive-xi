import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronDown,
  CircleUserRound,
  Headphones,
  Instagram,
  LockKeyhole,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import concreteImage from "@/assets/arcchive-concrete.jpg";
import heroImage from "@/assets/arcchive-hero.jpg";
import productsImage from "@/assets/arcchive-products.jpg";
import wornByLook1 from "@/assets/worn-by/look-1.jpg";
import wornByLook2 from "@/assets/worn-by/look-2.jpg";
import wornByLook3 from "@/assets/worn-by/look-3.jpg";
import wornByLook4 from "@/assets/worn-by/look-4.mp4";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARCCHIVE XI — Curated Clothing" },
      {
        name: "description",
        content: "ARCCHIVE XI sources considered clothing and hard-to-find pieces from independent makers across China.",
      },
      { property: "og:title", content: "ARCCHIVE XI — Curated Clothing" },
      {
        property: "og:description",
        content: "Considered silhouettes, sourced in limited numbers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Product = {
  name: string;
  price: string;
  soldOut: boolean;
  image: string;
  video?: string;
  slug?: string;
};

type WornByItem = {
  type: "image" | "video";
  src: string;
  poster?: string;
  handle: string;
  alt: string;
};

const products: Product[] = [
  { name: "Washed Utility Jacket", price: "$118.00", soldOut: false, image: productsImage, slug: "washed-utility-jacket" },
  { name: "Structured Knit Pullover", price: "$84.00", soldOut: true, image: productsImage },
  { name: "Multi-Pocket Wide Trouser", price: "$96.00", soldOut: false, image: productsImage },
  { name: "Faded Weight Hoodie", price: "$78.00", soldOut: true, image: productsImage },
];

const wornByLooks: WornByItem[] = [
  { type: "image", src: wornByLook1, handle: "arcchivexi", alt: "ARCCHIVE XI look worn by @arcchivexi" },
  { type: "image", src: wornByLook2, handle: "studio.north", alt: "ARCCHIVE XI look worn by @studio.north" },
  { type: "image", src: wornByLook3, handle: "mina.walks", alt: "ARCCHIVE XI look worn by @mina.walks" },
  { type: "video", src: wornByLook4, poster: wornByLook3, handle: "kai.in.layer", alt: "ARCCHIVE XI look worn by @kai.in.layer" },
];

function Mark({ large = false }: { large?: boolean }) {
  return (
    <span className={large ? "xi-mark xi-mark-large" : "xi-mark"} aria-hidden="true">
      <span>XI</span>
    </span>
  );
}

function ItemMedia({ image, video, alt, width, height }: { image?: string; video?: string | undefined; alt: string; width: number; height: number }) {
  if (video) {
    return <video src={video} aria-label={alt} width={width} height={height} muted playsInline loop autoPlay />;
  }

  return <img src={image} alt={alt} width={width} height={height} loading="lazy" />;
}

function ProductCard({ product }: { product: Product }) {
  const content = (
    <>
      <div className="product-media">
        <div className="product-crop">
          <ItemMedia image={product.image} video={product.video} alt={product.name} width={900} height={1200} />
        </div>
        {product.soldOut && <span className="sold-badge">Sold out</span>}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    </>
  );

  return (
    <article className="product-card">
      {product.slug ? (
        <Link to={`/products/${product.slug}` as "/products/washed-utility-jacket"} aria-label={`View ${product.name}`}>
          {content}
        </Link>
      ) : (
        <a href="#new" aria-label={`View ${product.name}`}>
          {content}
        </a>
      )}
    </article>
  );
}

function WornByCard({ look }: { look: WornByItem }) {
  const [controls, setControls] = useState(false);
  const profileHref = `https://www.instagram.com/${look.handle}/`;

  return (
    <article className="social-crop" onMouseEnter={() => setControls(true)} onMouseLeave={() => setControls(false)}>
      {look.type === "video" ? (
        <video src={look.src} poster={look.poster} aria-label={look.alt} width={800} height={800} muted autoPlay loop playsInline preload="metadata" controls={controls} />
      ) : (
        <img src={look.src} alt={look.alt} width={800} height={800} loading="lazy" />
      )}
      <span className="social-overlay">
        <a href={profileHref} aria-label={`View @${look.handle} on Instagram`}>
          <Instagram size={20} strokeWidth={1.5} />
          <span>@{look.handle}</span>
        </a>
      </span>
    </article>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateHeader = () => {
      const hero = heroRef.current;
      const desktop = window.matchMedia("(min-width: 761px)").matches;
      setPastHero(Boolean(desktop && hero && window.scrollY >= hero.offsetHeight));
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, []);

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className={pastHero ? "site-header site-header-solid" : "site-header"}>
        <div className="utility-bar">
          <button className="utility-select" type="button">USD / US <ChevronDown size={12} /></button>
          <p>COMPLIMENTARY SHIPPING OVER $150</p>
          <div className="header-icons">
            <a href="#search" aria-label="Search"><Search /></a>
            <a href="#account" aria-label="Account"><CircleUserRound /></a>
            <a href="#cart" aria-label="Shopping bag"><ShoppingBag /></a>
          </div>
        </div>

        <div className="brand-row">
          <button className="mobile-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
            {menuOpen ? <X /> : <Menu />}
          </button>
          <a className="brand-lockup" href="#top" aria-label="ARCCHIVE XI home">
            <Mark />
            <span>ARCCHIVE</span>
          </a>
          <a className="mobile-bag" href="#cart" aria-label="Shopping bag"><ShoppingBag /></a>
        </div>
        <nav className={menuOpen ? "primary-nav primary-nav-open" : "primary-nav"} aria-label="Main navigation">
          <a href="#top">Home</a>
          <Link to="/shop">Shop</Link>
          <a href="#story">About us</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section id="top" className="hero" ref={heroRef}>
        <img src={heroImage} alt="Model wearing the ARCCHIVE XI seasonal edit" width={1920} height={1200} fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p>Edition 01 · Autumn / Winter</p>
          <h1>Selected for the way you move.</h1>
          <Link to="/shop" className="shop-button">Shop now</Link>
        </div>
      </section>

      <section id="new" className="product-section">
        <div className="section-heading">
          <p>Limited selection</p>
          <h2>New arrivals</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard product={product} key={product.name} />)}
        </div>
        <Link to="/shop" className="view-all">View all pieces <span aria-hidden="true">→</span></Link>
      </section>

      <section aria-labelledby="community-title" className="community-section">
        <div className="community-heading">
          <h2 id="community-title">Worn by you</h2>
          <a href="#follow">@ARCCHIVEXI</a>
        </div>
        <div className="social-grid">{wornByLooks.map((look) => <WornByCard look={look} key={look.handle} />)}</div>
      </section>

      <section id="story" className="story-section">
        <div className="story-image">
          <img src={concreteImage} alt="Raw concrete texture" width={1200} height={1200} loading="lazy" />
          <Mark large />
        </div>
        <div className="story-copy">
          <p className="story-kicker">The source</p>
          <h2>Found, not fabricated.</h2>
          <p>ARCCHIVE XI is a considered edit of clothing sourced from independent makers and specialist suppliers across China.</p>
          <p>We choose for construction, silhouette and staying power—then release each piece in limited numbers. No manufactured mythology. Just good clothes, found with intent.</p>
          <a href="#story">Our approach <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="trust-row" aria-label="Shopping assurances">
        <div><LockKeyhole /><span><strong>Secure checkout</strong><small>Your details stay protected</small></span></div>
        <div><Headphones /><span><strong>Personal service</strong><small>Real help, when you need it</small></span></div>
        <div><ShieldCheck /><span><strong>Trusted payments</strong><small>Major payment methods accepted</small></span></div>
      </section>

      <footer id="contact" className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand"><div className="brand-lockup footer-lockup"><Mark /><span>ARCCHIVE</span></div><p>Curated clothing.<br />Sourced with intent.</p></div>
          <div><h2>Explore</h2><Link to="/shop">Shop</Link><Link to="/shop">New arrivals</Link><a href="#story">About us</a></div>
          <div id="follow"><h2>Follow us</h2><a href="#instagram">Instagram</a><a href="#tiktok">TikTok</a><a href="mailto:hello@arcchivexi.com">hello@arcchivexi.com</a></div>
          <div className="newsletter"><h2>Stay in the loop</h2><p>First access to new edits and limited restocks.</p>{subscribed ? <p className="success">You're on the list.</p> : <form onSubmit={subscribe}><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" required placeholder="EMAIL ADDRESS" /><button type="submit" aria-label="Subscribe">→</button></form>}</div>
        </div>
        <div className="footer-bottom"><p>© 2026 ARCCHIVE XI</p><div><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></div>
      </footer>
    </main>
  );
}
