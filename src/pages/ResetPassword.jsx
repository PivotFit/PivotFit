import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthContext";
import AuthLayout from "../components/AuthLayout";

// Landing page for the emailed reset link. Supabase signs the user in from
// the link's token, then they choose a new password here.
function ResetPassword() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }
    navigate("/", { replace: true });
  }

  if (loading) {
    return <p className="loading">Loading…</p>;
  }

  if (!session) {
    return (
      <AuthLayout
        title="Link expired"
        subtitle="This reset link is invalid or has expired. Request a new one."
      >
        <div className="auth-links">
          <Link to="/forgot-password">Send a new link</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Choose a new password">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          New password
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          Confirm new password
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button" disabled={submitting}>
          {submitting ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
