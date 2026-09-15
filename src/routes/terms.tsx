import { createFileRoute, Link } from "@tanstack/react-router";

import { StaticPageLayout } from "@/components/StaticPageLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ARCHIVE XI" },
      { name: "description", content: "Terms of Service for ARCHIVE XI." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <StaticPageLayout>
      <article className="static-page-content static-page-prose">
        <p className="static-page-kicker">Legal</p>
        <h1>Terms of Service</h1>
        <p className="static-page-draft-note">
          <strong>First draft.</strong> This document is placeholder copy pending legal review,
          including India-specific e-commerce and Consumer Protection requirements. Do not treat as
          final before launch.
        </p>

        <section>
          <h2>1. Overview</h2>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of the ARCHIVE XI website and
            purchase of products offered through it. By placing an order or creating an account, you
            agree to these Terms.
          </p>
        </section>

        <section>
          <h2>2. Seller information</h2>
          <p>
            ARCHIVE XI operates as an online retailer sourcing curated clothing for delivery within
            India. Business and grievance contact details will be published here prior to launch.
            For enquiries:{" "}
            <a href="mailto:hello@archivexi.com" className="static-page-inline-link">
              hello@archivexi.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2>3. Products &amp; pricing</h2>
          <p>
            Product descriptions, images, and prices are provided in good faith. Limited-stock items
            may sell out. All prices are shown in Indian Rupees (INR) unless stated otherwise.
            Applicable taxes and duties are handled as described at checkout and in our Shipping
            Policy.
          </p>
        </section>

        <section>
          <h2>4. Orders &amp; payment</h2>
          <p>
            An order is confirmed only after successful payment. We reserve the right to cancel or
            refuse orders in cases of pricing errors, suspected fraud, or stock unavailability.
            Payment is processed via our authorised payment partner (Razorpay or equivalent).
          </p>
        </section>

        <section>
          <h2>5. Shipping</h2>
          <p>
            Delivery timelines, international sourcing freight, and import handling are described in
            our{" "}
            <Link to="/shipping" className="static-page-inline-link">
              Shipping Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2>6. Returns &amp; refunds</h2>
          <p>
            Return and refund eligibility is set out in the Shipping Policy. Unworn items with
            original tags may be returned within the stated window, subject to inspection and
            deduction of return shipping where applicable.
          </p>
        </section>

        <section>
          <h2>7. Limitation of liability</h2>
          <p>
            To the extent permitted by applicable law, ARCHIVE XI is not liable for indirect or
            consequential losses arising from use of the site or delayed delivery beyond our
            reasonable control.
          </p>
        </section>

        <section>
          <h2>8. Governing law</h2>
          <p>
            These Terms are governed by the laws of India. Disputes shall be subject to the
            jurisdiction of courts in India, unless mandatory consumer protection law provides
            otherwise.
          </p>
        </section>

        <p className="static-page-updated">Last updated: September 2026</p>
      </article>
    </StaticPageLayout>
  );
}
