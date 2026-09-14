import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import productsImage from "@/assets/2.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart-context";

export const Route = createFileRoute("/products/washed-utility-jacket")({
  head: () => ({
    meta: [
      { title: "Washed Utility Jacket — ARCHIVE XI" },
      { name: "description", content: "Discover the Washed Utility Jacket, a structured cotton layer sourced by ARCHIVE XI in Guangzhou." },
      { property: "og:title", content: "Washed Utility Jacket — ARCHIVE XI" },
      { property: "og:description", content: "A limited structured cotton layer, sourced for its softened finish and relaxed fit." },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "https://arc-xi-threads.lovable.app/products/washed-utility-jacket" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://arc-xi-threads.lovable.app/products/washed-utility-jacket" }],
  }),
  component: ProductDetailPage,
});

const galleryMedia: string[] = [productsImage, productsImage, productsImage, productsImage];

const relatedProducts = [
  { name: "Structured Knit Pullover", price: "₹6,900", soldOut: true, image: productsImage },
  { name: "Multi-Pocket Wide Trouser", price: "₹7,900", soldOut: false, image: productsImage },
  { name: "Faded Weight Hoodie", price: "₹6,500", soldOut: true, image: productsImage },
  { name: "Raw Hem Work Jacket", price: "₹10,500", soldOut: false, image: productsImage },
];

function ProductMedia({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    <div className="product-crop">
      <img src={src} alt={alt} width={900} height={1200} loading={eager ? "eager" : "lazy"} />
    </div>
  );
}

function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, openDrawer } = useCart();

  const addToCart = () => {
    addItem({
      product_id: "washed-utility-jacket", // static; real product_id comes from DB
      name: "Washed Utility Jacket",
      price: 980000, // 9,800 rupees in paise
      image: productsImage,
      quantity,
      slug: "washed-utility-jacket",
    });
    setAdded(true);
    openDrawer();
  };

  return (
    <main className="product-page min-h-screen bg-background text-foreground">
      <SiteHeader activeNav="shop" />

      <div className="product-detail">
        <section className="product-gallery" aria-label="Washed Utility Jacket images">
          <div className="product-main-image"><ProductMedia src={galleryMedia[activeImage] ?? productsImage} alt={`Washed Utility Jacket view ${activeImage + 1}`} eager /></div>
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
          <p className="product-price">₹9,800</p>
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
            <AccordionItem value="shipping"><AccordionTrigger>Shipping</AccordionTrigger><AccordionContent>All orders ship directly from our suppliers in China and are delivered India-wide in 3–5 weeks. All import duties are handled by us. Complimentary shipping on orders over ₹12,000.</AccordionContent></AccordionItem>
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