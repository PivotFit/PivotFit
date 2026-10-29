import { useState } from "react";
import { Link } from "react-router-dom";
import { CAPTCHA_ENABLED } from "../lib/captcha";
import { supabase } from "../lib/supabaseClient";
import AuthLayout from "../components/AuthLayout";
import Captcha from "../components/Captcha";
import SpamFolderNote from "../components/SpamFolderNote";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaReset, setCaptchaReset] = useState(0);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
      captchaToken: captchaToken ?? undefined,
    });

    setSubmitting(false);
    setCaptchaReset((n) => n + 1); // tokens are single-use
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`If an account exists for ${email}, we sent a link to reset your password.`}
      >
        <SpamFolderNote />
        <div className="auth-links">
          <Link to="/login">Back to log in</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {CAPTCHA_ENABLED && <Captcha onToken={setCaptchaToken} resetSignal={captchaReset} />}

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button" disabled={submitting || (CAPTCHA_ENABLED && !captchaToken)}>
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/login">Back to log in</Link>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
