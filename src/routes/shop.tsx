import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import productsImage from "@/assets/2.jpg";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Curated Clothing — ARCHIVE XI" },
      { name: "description", content: "Shop ARCHIVE XI's current edit of limited clothing sourced from independent makers across China." },
      { property: "og:title", content: "Shop Curated Clothing — ARCHIVE XI" },
      { property: "og:description", content: "Explore considered silhouettes and limited sourced pieces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

type Product = {
  name: string;
  price: number;
  category: "Outerwear" | "Tops" | "Bottoms";
  soldOut: boolean;
  image: string;
  video?: string;
  slug?: string;
};

const catalog: Product[] = [
  { name: "Washed Utility Jacket", price: 9800, category: "Outerwear", soldOut: false, image: productsImage, slug: "washed-utility-jacket" },
  { name: "Structured Knit Pullover", price: 6900, category: "Tops", soldOut: true, image: productsImage },
  { name: "Multi-Pocket Wide Trouser", price: 7900, category: "Bottoms", soldOut: false, image: productsImage },
  { name: "Faded Weight Hoodie", price: 6500, category: "Tops", soldOut: true, image: productsImage },
  { name: "Raw Hem Work Jacket", price: 10500, category: "Outerwear", soldOut: false, image: productsImage },
  { name: "Undyed Knit Set", price: 8500, category: "Tops", soldOut: false, image: productsImage },
  { name: "Double Cargo Trouser", price: 8900, category: "Bottoms", soldOut: false, image: productsImage },
  { name: "Ash Oversized Hoodie", price: 6800, category: "Tops", soldOut: false, image: productsImage },
  { name: "Charcoal Zip Blouson", price: 11000, category: "Outerwear", soldOut: true, image: productsImage },
  { name: "Cloud Rib Pullover", price: 7400, category: "Tops", soldOut: false, image: productsImage },
  { name: "Utility Volume Pant", price: 9200, category: "Bottoms", soldOut: false, image: productsImage },
  { name: "Heavy Wash Hood", price: 7200, category: "Tops", soldOut: false, image: productsImage },
];


function ProductCard({ product }: { product: Product }) {
  const content = (
    <>
      <div className="product-media">
        <div className="product-crop">
          {product.video ? (
            <video src={product.video} aria-label={product.name} width={900} height={1200} muted playsInline loop autoPlay />
          ) : (
            <img src={product.image} alt={product.name} width={900} height={1200} loading="lazy" />
          )}
        </div>
        {product.soldOut && <span className="sold-badge">Sold out</span>}
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        <p>₹{product.price.toLocaleString("en-IN")}</p>
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
        <a href="#collection" aria-label={`View ${product.name}`}>
          {content}
        </a>
      )}
    </article>
  );
}

function ShopPage() {
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [price, setPrice] = useState("All");
  const [sort, setSort] = useState("Featured");
  const [visible, setVisible] = useState(8);

  const products = useMemo(() => {
    const filtered = catalog.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const availabilityMatch = availability === "All" || (availability === "In stock" ? !product.soldOut : product.soldOut);
      const priceMatch = price === "All" || (price === "Under ₹8,000" ? product.price < 8000 : product.price >= 8000);
      return categoryMatch && availabilityMatch && priceMatch;
    });
    return [...filtered].sort((a, b) => sort === "Price low" ? a.price - b.price : sort === "Price high" ? b.price - a.price : 0);
  }, [availability, category, price, sort]);

  return (
    <main className="shop-page min-h-screen bg-background text-foreground">
      <SiteHeader activeNav="shop" />

      <section className="collection-head">
        <p>Current collection</p>
        <h1>Shop all</h1>
        <span>{products.length} pieces</span>
      </section>

      <section className="filter-bar" aria-label="Product filters">
        <div className="filter-group">
          <label>Category<select value={category} onChange={(event) => { setCategory(event.target.value); setVisible(8); }}><option>All</option><option>Outerwear</option><option>Tops</option><option>Bottoms</option></select></label>
          <label>Size<select defaultValue="All"><option>All</option><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option></select></label>
          <label>Price<select value={price} onChange={(event) => { setPrice(event.target.value); setVisible(8); }}><option>All</option><option>Under ₹8,000</option><option>₹8,000 and over</option></select></label>
          <label>Availability<select value={availability} onChange={(event) => { setAvailability(event.target.value); setVisible(8); }}><option>All</option><option>In stock</option><option>Sold out</option></select></label>
        </div>
        <label className="sort-control">Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option>Featured</option><option>Price low</option><option>Price high</option></select></label>
      </section>

      <section className="collection-body" aria-live="polite">
        {products.length ? <div className="product-grid shop-grid">
          {products.slice(0, visible).map((product, index) => (
            <ProductCard product={product} key={`${product.name}-${index}`} />
          ))}
        </div> : <p className="empty-results">No pieces match these filters.</p>}
        {visible < products.length && <button className="load-more" type="button" onClick={() => setVisible((count) => count + 4)}>Load more <span>{visible} / {products.length}</span></button>}
      </section>
    </main>
  );
}