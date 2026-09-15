import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Headphones, LockKeyhole, ShieldCheck, Truck } from "lucide-react";
import { useRef } from "react";

import wornImg1 from "@/assets/worn-by/1.png";
import wornImg2 from "@/assets/worn-by/2.png";
import wornImg3 from "@/assets/worn-by/3.png";
import wornImg4 from "@/assets/worn-by/4.png";
import wornImg5 from "@/assets/worn-by/5.png";
import wornImg6 from "@/assets/worn-by/6.png";
import heroImage from "@/assets/2.jpg";
import storyImage from "@/assets/3.jpg";
import productsImage from "@/assets/2.jpg";
import xiMark from "@/assets/xi-mark.png";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARCHIVE XI — Curated Clothing" },
      {
        name: "description",
        content: "ARCHIVE XI sources considered clothing and hard-to-find pieces from independent makers across China.",
      },
      { property: "og:title", content: "ARCHIVE XI — Curated Clothing" },
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

type WornByLook = {
  image: string;
  handle: string;
  location: string;
  quote: string;
  rating: number;
};

const products: Product[] = [
  { name: "Washed Utility Jacket", price: "₹9,800", soldOut: false, image: productsImage, slug: "washed-utility-jacket" },
  { name: "Structured Knit Pullover", price: "₹6,900", soldOut: true, image: productsImage },
  { name: "Multi-Pocket Wide Trouser", price: "₹7,900", soldOut: false, image: productsImage },
  { name: "Faded Weight Hoodie", price: "₹6,500", soldOut: true, image: productsImage },
];

const wornByLooks: WornByLook[] = [
  {
    image: wornImg1,
    handle: "@kai.in.layer",
    location: "Mumbai",
    rating: 5,
    quote: "The silhouette is unmatched. Structured shoulders with a drape that holds its shape.",
  },
  {
    image: wornImg2,
    handle: "@studio.north",
    location: "Delhi",
    rating: 4.5,
    quote: "Clean cuts, durable stitching, and great proportion. Fits slightly oversized as noted.",
  },
  {
    image: wornImg3,
    handle: "@mina.walks",
    location: "Bangalore",
    rating: 5,
    quote: "Understated minimalism at its best. The wash gives it that authentic archival feel.",
  },
  {
    image: wornImg4,
    handle: "@arjun.m",
    location: "Pune",
    rating: 4.5,
    quote: "Quality well above high-street alternatives. Arrived safely with all duties handled.",
  },
  {
    image: wornImg5,
    handle: "@priya.k",
    location: "Hyderabad",
    rating: 5,
    quote: "Subtle details make this piece stand out. Heavy, comfortable, and easy to layer.",
  },
  {
    image: wornImg6,
    handle: "@dev.r",
    location: "Jaipur",
    rating: 4.5,
    quote: "Worth every day of the freight wait. Sizing is spot on and the fit is remarkable.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="worn-by-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const isFull = rating >= starIndex;
        const isHalf = !isFull && rating >= starIndex - 0.5;

        return (
          <span key={starIndex} className="star-wrapper">
            <svg className="star-icon star-empty" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {isFull && (
              <svg className="star-icon star-full" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            {isHalf && (
              <span className="star-half-wrap">
                <svg className="star-icon star-full" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
            )}
          </span>
        );
      })}
    </div>
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

function WornByCard({ look }: { look: WornByLook }) {
  return (
    <article className="worn-by-card">
      <div className="worn-by-photo">
        <img src={look.image} alt="ARCHIVE XI look" width={640} height={800} loading="lazy" />
      </div>
      <div className="worn-by-content">
        <div className="worn-by-meta">
          <Stars rating={look.rating} />
        </div>
        <blockquote className="worn-by-quote">
          <p>"{look.quote}"</p>
        </blockquote>
      </div>
    </article>
  );
}

function Index() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollLooks = (dir: -1 | 1) => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector<HTMLElement>(".worn-by-card");
    const step = card ? card.offsetWidth + 20 : 320;
    trackRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader activeNav="home" />

      <section id="top" className="hero">
        <img src={heroImage} alt="Model wearing the ARCHIVE XI seasonal edit" width={1920} height={1200} fetchPriority="high" />
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
          <div>
            <p className="community-eyebrow">Customer styling & reviews</p>
            <h2 id="community-title">Worn by you</h2>
          </div>
          <a href="#follow">@ARCHIVEXI</a>
        </div>
        <div className="worn-by-track-wrapper">
          <button
            className="worn-by-arrow worn-by-arrow-prev"
            type="button"
            onClick={() => scrollLooks(-1)}
            aria-label="Scroll looks left"
          >
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>
          <div className="worn-by-track" ref={trackRef} role="list">
            {wornByLooks.map((look) => (
              <div role="listitem" key={look.handle} className="worn-by-slide">
                <WornByCard look={look} />
              </div>
            ))}
          </div>
          <button
            className="worn-by-arrow worn-by-arrow-next"
            type="button"
            onClick={() => scrollLooks(1)}
            aria-label="Scroll looks right"
          >
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </section>

      <section id="story" className="story-section" aria-label="About ARCHIVE XI">
        <div className="story-image">
          <img src={storyImage} alt="Raw concrete interior" width={1200} height={1200} loading="lazy" />
          <img className="xi-mark-large" src={xiMark} alt="" width={300} height={300} />
        </div>
        <div className="story-copy">
          <p className="story-kicker">The source</p>
          <h2>Found, not fabricated.</h2>
          <p>ARCHIVE XI is a considered edit of clothing sourced from independent makers and specialist suppliers across China.</p>
          <p>We choose for construction, silhouette and staying power—then release each piece in limited numbers. No manufactured mythology. Just good clothes, found with intent.</p>
          <a href="#story">Our approach <span aria-hidden="true">→</span></a>
        </div>
      </section>


      <section className="trust-row" aria-label="Shopping assurances">
        <div><Truck /><span><strong>All-India delivery</strong><small>3–5 weeks sourced freight timeline</small></span></div>
        <div><LockKeyhole /><span><strong>Secure checkout</strong><small>Your details stay protected</small></span></div>
        <div><Headphones /><span><strong>Personal service</strong><small>Real help, when you need it</small></span></div>
        <div><ShieldCheck /><span><strong>Trusted payments</strong><small>UPI, cards & netbanking</small></span></div>
      </section>

      <SiteFooter />
    </main>
  );
}
