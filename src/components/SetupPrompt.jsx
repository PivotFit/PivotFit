import { Link } from "react-router-dom";

// Shown wherever a plan is needed but the user hasn't finished onboarding.
function SetupPrompt() {
  return (
    <section className="workout-card setup-prompt">
      <p className="eyebrow">GET STARTED</p>
      <h2>Let's build your plan</h2>
      <p className="muted">
        Tell us your experience, where you train, and when you're free. We'll
        build a weekly plan with backup exercises ready for when things change.
      </p>
      <Link to="/onboarding" className="primary-button">
        Set up my plan
      </Link>
    </section>
  );
}

export default SetupPrompt;
