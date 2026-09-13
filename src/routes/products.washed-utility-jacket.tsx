import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, CircleUserRound, Menu, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import productsImage from "@/assets/arcchive-products.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/products/washed-utility-jacket")({
  head: () => ({
    meta: [
      { title: "Washed Utility Jacket — ARCCHIVE XI" },
      { name: "description", content: "Discover the Washed Utility Jacket, a structured cotton layer sourced by ARCCHIVE XI in Guangzhou." },
      { property: "og:title", content: "Washed Utility Jacket — ARCCHIVE XI" },
      { property: "og:description", content: "A limited structured cotton layer, sourced for its softened finish and relaxed fit." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://arc-xi-threads.lovable.app/products/washed-utility-jacket" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://arc-xi-threads.lovable.app/products/washed-utility-jacket" }],
  }),
  component: ProductDetailPage,
});

const galleryMedia = [productsImage, productsImage, productsImage, productsImage];

const relatedProducts = [
  { name: "Structured Knit Pullover", price: "$84.00", soldOut: true, image: productsImage },
  { name: "Multi-Pocket Wide Trouser", price: "$96.00", soldOut: false, image: productsImage },
  { name: "Faded Weight Hoodie", price: "$78.00", soldOut: true, image: productsImage },
  { name: "Raw Hem Work Jacket", price: "$126.00", soldOut: false, image: productsImage },
];

function Mark() {
  return <span className="xi-mark" aria-hidden="true"><span>XI</span></span>;
}

function ProductMedia({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    <div className="product-crop">
      <img src={src} alt={alt} width={900} height={1200} loading={eager ? "eager" : "lazy"} />
    </div>
  );
}

function ProductDetailPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    setAdded(true);
  };

  return (
    <main className="product-page min-h-screen bg-background text-foreground">
      <header className="bg-background">
        <div className="utility-bar">
          <button className="utility-select" type="button">USD / US <ChevronDown size={12} /></button>
          <p>COMPLIMENTARY SHIPPING OVER $150</p>
          <div className="header-icons"><a href="#search" aria-label="Search"><Search /></a><a href="#account" aria-label="Account"><CircleUserRound /></a><a href="#cart" aria-label="Shopping bag"><ShoppingBag /></a></div>
        </div>
        <div className="brand-row">
          <button className="mobile-menu" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
          <Link className="brand-lockup" to="/" aria-label="ARCCHIVE XI home"><Mark /><span>ARCCHIVE</span></Link>
          <a className="mobile-bag" href="#cart" aria-label="Shopping bag"><ShoppingBag /></a>
        </div>
        <nav className={menuOpen ? "primary-nav primary-nav-open" : "primary-nav"} aria-label="Main navigation">
          <Link to="/">Home</Link><Link to="/shop">Shop</Link><Link to="/" hash="story">About us</Link><Link to="/" hash="contact">Contact</Link>
        </nav>
      </header>

      <div className="product-detail">
        <section className="product-gallery" aria-label="Washed Utility Jacket images">
          <div className="product-main-image"><ProductMedia src={galleryMedia[activeImage]} alt={`Washed Utility Jacket view ${activeImage + 1}`} eager /></div>
          <div className="product-thumbnails" aria-label="Choose product image">
            {galleryMedia.map((src, index) => (
              <button key={`${src}-${index}`} type="button" className={activeImage === index ? "product-thumbnail product-thumbnail-active" : "product-thumbnail"} onClick={() => setActiveImage(index)} aria-label={`Show image ${index + 1}`} aria-pressed={activeImage === index}>
                <ProductMedia src={src} alt="" />
              </button>
            ))}
          </div>
        </section>

        <section className="product-summary" aria-labelledby="product-title">
          <p className="product-kicker">Sourced edit · No. 01</p>
          <h1 id="product-title">Washed Utility Jacket</h1>
          <p className="product-price">$118.00</p>
          <p className="product-description">Sourced in Guangzhou from a small independent maker, this structured utility jacket is cut from washed midweight cotton. A relaxed, slightly cropped fit and softened finish make it an easy everyday layer; each piece has subtle tonal variation from the wash process.</p>

          <fieldset className="size-selector">
            <legend>Size <span>{size}</span></legend>
            <div>{["S", "M", "L", "XL"].map((option) => <Button key={option} type="button" variant="outline" className={size === option ? "size-option size-option-active" : "size-option"} onClick={() => { setSize(option); setAdded(false); }} aria-pressed={size === option}>{option}</Button>)}</div>
          </fieldset>

          <div className="purchase-row">
            <div className="quantity-control" aria-label="Quantity selector">
              <Button type="button" variant="ghost" size="icon" onClick={() => { setQuantity((current) => Math.max(1, current - 1)); setAdded(false); }} aria-label="Decrease quantity" disabled={quantity === 1}><Minus /></Button>
              <output aria-live="polite" aria-label={`Quantity ${quantity}`}>{quantity}</output>
              <Button type="button" variant="ghost" size="icon" onClick={() => { setQuantity((current) => current + 1); setAdded(false); }} aria-label="Increase quantity"><Plus /></Button>
            </div>
            <Button type="button" className="add-to-cart" onClick={addToCart}>{added ? "Added to cart" : "Add to cart"}</Button>
          </div>
          <p className="cart-status" aria-live="polite">{added ? `${quantity} × size ${size} added to your bag.` : ""}</p>

          <Accordion className="product-accordion" type="single" collapsible>
            <AccordionItem value="shipping"><AccordionTrigger>Shipping</AccordionTrigger><AccordionContent>Orders are dispatched within 2–3 business days. Complimentary tracked shipping applies to orders over $150.</AccordionContent></AccordionItem>
            <AccordionItem value="returns"><AccordionTrigger>Returns</AccordionTrigger><AccordionContent>Unworn pieces may be returned within 14 days of delivery, with original tags attached. Return shipping is deducted from the refund.</AccordionContent></AccordionItem>
            <AccordionItem value="details"><AccordionTrigger>Fabric and care</AccordionTrigger><AccordionContent>100% cotton shell. Cold wash separately and air dry to preserve the washed finish.</AccordionContent></AccordionItem>
          </Accordion>
        </section>
      </div>

      <section className="related-section" aria-labelledby="related-title">
        <div className="related-heading"><p>Continue the edit</p><h2 id="related-title">You may also like</h2></div>
        <div className="product-grid">
          {relatedProducts.map((product) => (
            <article className="product-card" key={product.name}>
              <Link to="/shop" aria-label={`View ${product.name}`}>
                <div className="product-media"><ProductMedia src={product.image} alt={product.name} />{product.soldOut && <span className="sold-badge">Sold out</span>}</div>
                <div className="product-info"><h3>{product.name}</h3><p>{product.price}</p></div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}