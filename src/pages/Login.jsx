import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);
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

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button" disabled={submitting}>
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
