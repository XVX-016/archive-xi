import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

import { StaticPageLayout } from "@/components/StaticPageLayout";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ARCHIVE XI" },
      {
        name: "description",
        content: "Get in touch with ARCHIVE XI — questions about orders, sizing, or sourcing.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      setLoading(false);
      setError(
        "Contact form is not configured yet. Email us directly at hello@archivexi.com.",
      );
      return;
    }

    const { error: insertError } = await getSupabase().from("contact_messages").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    setLoading(false);

    if (insertError) {
      setError("Something went wrong sending your message. Please try again or email us directly.");
      return;
    }

    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <StaticPageLayout activeNav="contact">
      <article className="static-page-content static-page-content-wide">
        <p className="static-page-kicker">Contact</p>
        <h1>Get in touch</h1>
        <p className="static-page-lead">
          Questions about an order, sizing, or a piece in the edit? Send a message below or email{" "}
          <a href="mailto:hello@archivexi.com" className="static-page-inline-link">
            hello@archivexi.com
          </a>
          .
        </p>

        {sent ? (
          <div className="contact-success" role="status">
            <p>Thank you — your message has been received. We&apos;ll get back to you as soon as we can.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {error && (
              <div className="contact-error" role="alert">
                {error}
              </div>
            )}

            <div className="contact-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>

            <button type="submit" className="contact-submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="auth-spinner" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                "Send message"
              )}
            </button>
          </form>
        )}
      </article>
    </StaticPageLayout>
  );
}
