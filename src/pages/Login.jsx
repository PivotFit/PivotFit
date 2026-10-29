import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRememberMe, setRememberMe } from "../lib/authStorage";
import { CAPTCHA_ENABLED } from "../lib/captcha";
import { supabase } from "../lib/supabaseClient";
import AuthLayout from "../components/AuthLayout";
import Captcha from "../components/Captcha";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(getRememberMe);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaReset, setCaptchaReset] = useState(0);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    // Must be set before signing in: it decides where the session is saved.
    setRememberMe(remember);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken: captchaToken ?? undefined },
    });

    setSubmitting(false);
    setCaptchaReset((n) => n + 1); // tokens are single-use
    if (error) {
      setError(error.message);
      return;
    }

    navigate(location.state?.from?.pathname ?? "/", { replace: true });
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to keep your training on track.">
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

        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>
            Remember me
            <span className="checkbox-hint">
              {remember
                ? "Stay signed in on this device."
                : "You'll be signed out when you close the browser."}
            </span>
          </span>
        </label>

        {CAPTCHA_ENABLED && <Captcha onToken={setCaptchaToken} resetSignal={captchaReset} />}

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button" disabled={submitting || (CAPTCHA_ENABLED && !captchaToken)}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/forgot-password">Forgot password?</Link>
        <span>
          New to PivotFit? <Link to="/signup">Create an account</Link>
        </span>
      </div>
    </AuthLayout>
  );
}

export default Login;
