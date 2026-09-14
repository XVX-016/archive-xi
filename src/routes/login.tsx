import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";

import xiMark from "@/assets/xi-mark.png";
import { supabase } from "@/lib/supabase";

// ── Search params schema ──────────────────────────────────────────────────────
type LoginSearchParams = {
  redirect?: string | undefined;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearchParams => ({
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign In — ARCHIVE XI" },
      { name: "description", content: "Sign in to your ARCHIVE XI account." },
    ],
  }),
  component: LoginPage,
});

type Mode = "password" | "magic";

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });

  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate({ to: (redirect as "/account") ?? "/account" });
    }
  };

  const handleMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        shouldCreateUser: false, // login only; signup goes through /signup
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMagicSent(true);
    }
  };

  return (
    <div className="auth-page">
      {/* Background brand mark */}
      <div className="auth-bg-mark" aria-hidden="true">
        <img src={xiMark} alt="" width={420} height={420} />
      </div>

      <div className="auth-card">
        {/* Brand */}
        <Link to="/" className="auth-brand" aria-label="ARCHIVE XI home">
          <span>ARCHIVE</span>
          <img src={xiMark} alt="" width={32} height={32} />
        </Link>

        {magicSent ? (
          <div className="auth-magic-sent">
            <Mail size={36} strokeWidth={1} />
            <h1>Check your email</h1>
            <p>
              We sent a sign-in link to <strong>{email}</strong>. Click it to
              access your account.
            </p>
            <button
              type="button"
              className="auth-text-btn"
              onClick={() => { setMagicSent(false); setError(null); }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <h1>Sign in</h1>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="auth-link">
                  Create one
                </Link>
              </p>
            </div>

            {/* Mode toggle */}
            <div className="auth-mode-toggle" role="group" aria-label="Sign-in method">
              <button
                type="button"
                className={mode === "password" ? "auth-mode-btn auth-mode-active" : "auth-mode-btn"}
                onClick={() => { setMode("password"); setError(null); }}
              >
                Password
              </button>
              <button
                type="button"
                className={mode === "magic" ? "auth-mode-btn auth-mode-active" : "auth-mode-btn"}
                onClick={() => { setMode("magic"); setError(null); }}
              >
                Magic link
              </button>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            {mode === "password" ? (
              <form className="auth-form" onSubmit={handlePasswordLogin} noValidate>
                <div className="auth-field">
                  <label htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="auth-field">
                  <div className="auth-label-row">
                    <label htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      className="auth-text-btn"
                      onClick={async () => {
                        if (!email) { setError("Enter your email first."); return; }
                        setError(null);
                        setLoading(true);
                        const { error } = await supabase.auth.resetPasswordForEmail(email, {
                          redirectTo: `${window.location.origin}/account`,
                        });
                        setLoading(false);
                        if (error) setError(error.message);
                        else setError("Password reset link sent — check your inbox.");
                      }}
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="auth-pw-wrap">
                    <input
                      id="login-password"
                      type={showPw ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="auth-pw-toggle"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>
                <button
                  id="login-submit-btn"
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 size={16} className="auth-spinner" />
                  ) : (
                    <>Sign in <ArrowRight size={14} strokeWidth={2} /></>
                  )}
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleMagicLink} noValidate>
                <p className="auth-mode-desc">
                  We'll email you a one-click link — no password needed.
                </p>
                <div className="auth-field">
                  <label htmlFor="magic-email">Email</label>
                  <input
                    id="magic-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <button
                  id="magic-link-btn"
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 size={16} className="auth-spinner" />
                  ) : (
                    <>Send magic link <ArrowRight size={14} strokeWidth={2} /></>
                  )}
                </button>
              </form>
            )}

            <div className="auth-footer-note">
              <Lock size={11} strokeWidth={1.5} />
              Secured by Supabase Auth
            </div>
          </>
        )}
      </div>
    </div>
  );
}
