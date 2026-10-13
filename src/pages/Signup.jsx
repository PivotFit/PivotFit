import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { TERMS_VERSION } from "../lib/legal";
import AuthLayout from "../components/AuthLayout";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { terms_version: TERMS_VERSION, age_confirmed: ageConfirmed },
      },
    });
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    // With email confirmation on, there is no session until the link is clicked.
    // When a session exists, PublicOnlyRoute redirects to the dashboard.
    if (!data.session) {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle={`We sent a confirmation link to ${email}. Click it to finish creating your account.`}
      >
        <div className="auth-links">
          <Link to="/login">Back to log in</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Adapt instead of abandon.">
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
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          Confirm password
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            required
            checked={ageConfirmed}
            onChange={(e) => setAgeConfirmed(e.target.checked)}
          />
          <span>I am at least 13 years old.</span>
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <span>
            I agree to the{" "}
            <Link to="/terms" target="_blank">Terms of Service</Link> and{" "}
            <Link to="/privacy" target="_blank">Privacy Policy</Link>, and I
            understand PivotFit does not provide medical advice and I exercise
            at my own risk.
          </span>
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button className="primary-button" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="auth-links">
        <span>
          Already have an account? <Link to="/login">Log in</Link>
        </span>
      </div>
    </AuthLayout>
  );
}

export default Signup;
