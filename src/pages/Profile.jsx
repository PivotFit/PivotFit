import { useState } from "react";
import { Link } from "react-router-dom";
import { LOCATIONS } from "../data/exercises";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../auth/AuthContext";
import { useUserData } from "../hooks/useUserData";
import { DAYS, EXPERIENCE_LEVELS } from "../lib/training";
import { clearUserData } from "../lib/userData";

function Profile() {
  const { user } = useAuth();
  const [profile] = useUserData("profile", null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Delete your PivotFit account? This permanently removes your account and all of your workout data. This cannot be undone.",
    );
    if (!confirmed) return;

    setError("");
    setDeleting(true);

    // Runs the delete_account() database function (see supabase/migrations).
    const { error } = await supabase.rpc("delete_account");

    if (error) {
      setDeleting(false);
      setError(error.message);
      return;
    }

    // The account no longer exists, so clear the plan and history saved in
    // this browser, then the local session.
    clearUserData(user.id);
    await supabase.auth.signOut({ scope: "local" });
  }

  return (
    <main className="dashboard">
      <section className="welcome">
        <p className="eyebrow">PROFILE</p>
        <h1>Your account</h1>
      </section>

      <section className="workout-card">
        <p className="eyebrow">EMAIL</p>
        <h2 className="profile-value">{user.email}</h2>

        <p className="eyebrow">MEMBER SINCE</p>
        <p className="profile-value">
          {new Date(user.created_at).toLocaleDateString()}
        </p>

        <button
          className="secondary-button"
          onClick={() => supabase.auth.signOut()}
        >
          Log out
        </button>
      </section>

      <section className="workout-card profile-section">
        <p className="eyebrow">TRAINING PREFERENCES</p>
        {profile ? (
          <dl className="pref-list">
            <div>
              <dt>Experience</dt>
              <dd>
                {EXPERIENCE_LEVELS[profile.experience].label} (
                {EXPERIENCE_LEVELS[profile.experience].years})
              </dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>{LOCATIONS[profile.location].label}</dd>
            </div>
            <div>
              <dt>Training days</dt>
              <dd>
                {DAYS.filter((d) => profile.schedule[d.key])
                  .map((d) => `${d.short} (${profile.schedule[d.key].minutes} min)`)
                  .join(", ")}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="muted">You haven't set up your plan yet.</p>
        )}
        <Link to="/onboarding" className="secondary-button">
          {profile ? "Edit preferences" : "Set up my plan"}
        </Link>
      </section>

      <section className="workout-card danger-zone">
        <p className="eyebrow">DELETE ACCOUNT</p>
        <p>
          Permanently delete your account and all workout data associated with
          it.
        </p>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button
          className="danger-button"
          onClick={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting ? "Deleting…" : "Delete my account"}
        </button>
      </section>
    </main>
  );
}

export default Profile;
