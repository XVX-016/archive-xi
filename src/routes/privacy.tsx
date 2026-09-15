import { createFileRoute } from "@tanstack/react-router";

import { StaticPageLayout } from "@/components/StaticPageLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ARCHIVE XI" },
      { name: "description", content: "Privacy Policy for ARCHIVE XI." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <StaticPageLayout>
      <article className="static-page-content static-page-prose">
        <p className="static-page-kicker">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="static-page-draft-note">
          <strong>First draft.</strong> This document is placeholder copy pending legal review. Do
          not treat as final before launch.
        </p>

        <section>
          <h2>1. What we collect</h2>
          <p>We may collect the following when you use our site:</p>
          <ul>
            <li>Account details: name, email, phone (when you register or checkout)</li>
            <li>Order &amp; shipping information: delivery address, order history</li>
            <li>Payment references: transaction IDs from our payment processor (we do not store full card or UPI credentials)</li>
            <li>Contact form submissions: name, email, message</li>
            <li>Technical data: browser type, device, and basic usage logs for security and performance</li>
          </ul>
        </section>

        <section>
          <h2>2. How we use your information</h2>
          <p>We use personal data to:</p>
          <ul>
            <li>Process and fulfil orders</li>
            <li>Communicate about orders, returns, and customer support</li>
            <li>Maintain your account and saved addresses</li>
            <li>Respond to contact form enquiries</li>
            <li>Comply with legal and tax obligations</li>
          </ul>
        </section>

        <section>
          <h2>3. Sharing with third parties</h2>
          <p>
            We share data only as needed with service providers — including Supabase (hosting and
            database), our payment processor, and delivery partners. We do not sell your personal
            information.
          </p>
        </section>

        <section>
          <h2>4. Data retention</h2>
          <p>
            Order and account records are retained as long as needed for business, legal, and tax
            purposes. Contact form messages are retained until handled and may be archived or
            deleted thereafter.
          </p>
        </section>

        <section>
          <h2>5. Your rights</h2>
          <p>
            You may request access, correction, or deletion of your personal data where applicable
            under Indian law. Contact{" "}
            <a href="mailto:hello@archivexi.com" className="static-page-inline-link">
              hello@archivexi.com
            </a>{" "}
            to exercise these rights.
          </p>
        </section>

        <section>
          <h2>6. Security</h2>
          <p>
            We use industry-standard measures including encrypted connections (HTTPS) and
            access-controlled databases. No method of transmission over the internet is fully
            secure.
          </p>
        </section>

        <section>
          <h2>7. Changes</h2>
          <p>
            We may update this policy from time to time. Material changes will be posted on this
            page with an updated date.
          </p>
        </section>

        <p className="static-page-updated">Last updated: September 2026</p>
      </article>
    </StaticPageLayout>
  );
}
