import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

import xiMark from "@/assets/xi-mark.png";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — ARCHIVE XI" },
      { name: "description", content: "Create your ARCHIVE XI account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, // saved to auth.users.raw_user_meta_data
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmation is enabled in Supabase dashboard, identities will be
    // empty until the user clicks the link. Show confirmation prompt.
    if (data.user && data.user.identities?.length === 0) {
      // User already exists
      setError("An account with this email already exists. Try signing in.");
      return;
    }

    if (data.session) {
      // Email confirmation is OFF — user is immediately signed in
      // The DB trigger auto-creates the profiles row; we just update full_name.
      if (fullName.trim()) {
        await supabase
          .from("profiles")
          .update({ full_name: fullName.trim() })
          .eq("id", data.user!.id);
      }
      navigate({ to: "/account" });
    } else {
      // Email confirmation is ON
      setConfirming(true);
    }
  };

  if (confirming) {
    return (
      <div className="auth-page">
        <div className="auth-bg-mark" aria-hidden="true">
          <img src={xiMark} alt="" width={420} height={420} />
        </div>
        <div className="auth-card">
          <Link to="/" className="auth-brand" aria-label="ARCHIVE XI home">
            <span>ARCHIVE</span>
            <img src={xiMark} alt="" width={32} height={32} />
          </Link>
          <div className="auth-magic-sent">
            <Mail size={36} strokeWidth={1} />
            <h1>Confirm your email</h1>
            <p>
              We sent a confirmation link to <strong>{email}</strong>. Click it
              to activate your account.
            </p>
            <Link to="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-mark" aria-hidden="true">
        <img src={xiMark} alt="" width={420} height={420} />
      </div>

      <div className="auth-card">
        <Link to="/" className="auth-brand" aria-label="ARCHIVE XI home">
          <span>ARCHIVE</span>
          <img src={xiMark} alt="" width={32} height={32} />
        </Link>

        <div className="auth-header">
          <h1>Create account</h1>
          <p>
            Already have one?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSignup} noValidate>
          <div className="auth-field">
            <label htmlFor="signup-name">Full name</label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="signup-password">Password</label>
            <div className="auth-pw-wrap">
              <input
                id="signup-password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
              <button
                type="button"
                className="auth-pw-toggle"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <EyeOff size={15} strokeWidth={1.5} />
                ) : (
                  <Eye size={15} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
          <button
            id="signup-submit-btn"
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="auth-spinner" />
            ) : (
              <>
                Create account <ArrowRight size={14} strokeWidth={2} />
              </>
            )}
          </button>
        </form>

        <p className="auth-legal">
          By creating an account you agree to our{" "}
          <a href="#terms" className="auth-link">
            Terms
          </a>{" "}
          and{" "}
          <a href="#privacy" className="auth-link">
            Privacy Policy
          </a>
          .
        </p>

        <div className="auth-footer-note">
          <Lock size={11} strokeWidth={1.5} />
          Secured by Supabase Auth
        </div>
      </div>
    </div>
  );
}
