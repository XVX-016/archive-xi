import { createFileRoute } from "@tanstack/react-router";

import { StaticPageLayout } from "@/components/StaticPageLayout";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns — ARCHIVE XI" },
      {
        name: "description",
        content: "Shipping timelines, delivery, returns and refunds for ARCHIVE XI orders.",
      },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <StaticPageLayout>
      <article className="static-page-content static-page-prose">
        <p className="static-page-kicker">Policies</p>
        <h1>Shipping &amp; Returns</h1>

        <section>
          <h2>Delivery timeline</h2>
          <p>
            ARCHIVE XI sources pieces from independent makers and suppliers, primarily in China.
            Orders are shipped via international freight directly to India. Please allow{" "}
            <strong>3–5 weeks</strong> from order confirmation for delivery. Timelines may vary
            slightly depending on customs processing and carrier schedules.
          </p>
          <p>
            Complimentary all-India shipping applies to orders over ₹12,000. Import duties and
            customs clearance for eligible orders are handled as part of our Sourced Freight service
            — no separate duty payment should be required at delivery for standard orders.
          </p>
        </section>

        <section>
          <h2>Order processing</h2>
          <p>
            Once payment is confirmed, your order enters processing. You will receive an order
            reference by email (or at checkout for guest orders). Tracking details are shared when
            the shipment is dispatched from origin.
          </p>
        </section>

        <section>
          <h2>Returns</h2>
          <p>
            We accept returns on unworn items in original condition with all tags attached, within{" "}
            <strong>14 days</strong> of delivery in India. Items showing wear, washing, or damage
            are not eligible.
          </p>
          <p>
            To initiate a return, contact{" "}
            <a href="mailto:hello@archivexi.com" className="static-page-inline-link">
              hello@archivexi.com
            </a>{" "}
            with your order reference. Return shipping costs are deducted from the refund unless
            the return is due to our error or a defective item.
          </p>
        </section>

        <section>
          <h2>Refunds</h2>
          <p>
            Approved refunds are processed to the original payment method within 7–10 business days
            after we receive and inspect the returned item. Partial refunds may apply where return
            shipping is deducted.
          </p>
        </section>

        <section>
          <h2>Exchanges</h2>
          <p>
            Exchanges for a different size are subject to availability. Contact us before returning
            an item — we may advise placing a new order if stock is limited.
          </p>
        </section>

        <section>
          <h2>Lost or damaged parcels</h2>
          <p>
            If your order arrives damaged or does not arrive within the stated window, contact us
            promptly with photos where applicable. We will work with the carrier to resolve the
            issue.
          </p>
        </section>

        <p className="static-page-updated">Last updated: September 2026</p>
      </article>
    </StaticPageLayout>
  );
}
