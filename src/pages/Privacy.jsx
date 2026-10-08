import { Link } from "react-router-dom";
import LegalLayout from "../components/LegalLayout";
import { CONTACT_EMAIL } from "../lib/legal";

function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        This Privacy Policy explains what information PivotFit collects, how
        we use it, and the choices you have. It applies to the PivotFit web
        application (the "Service") and should be read together with our{" "}
        <Link to="/terms">Terms of Service</Link>.
      </p>

      <section className="legal-callout">
        <h2>The short version</h2>
        <ul>
          <li>We collect only what we need to run your account and track your workouts.</li>
          <li>We do not sell your data or use it for advertising.</li>
          <li>We do not use third-party advertising or tracking cookies.</li>
          <li>You can delete your account and all of your data at any time from your Profile page.</li>
        </ul>
      </section>

      <h2>1. Information we collect</h2>
      <p>
        <strong>Account information:</strong> your email address and
        password. Passwords are stored only in hashed form by our
        authentication provider, and we cannot see them.
      </p>
      <p>
        <strong>Consent records:</strong> the date you accepted our Terms and
        Privacy Policy, which version you accepted, and your confirmation
        that you are at least 13 years old.
      </p>
      <p>
        <strong>Fitness information you enter:</strong> workouts, exercises,
        sets, reps, weights, workout history, available equipment and time,
        and related progress information.
      </p>
      <p>
        <strong>Technical information:</strong> our hosting and
        authentication providers automatically process information such as
        IP address, browser type, and login timestamps to deliver the
        Service, keep it secure, and prevent abuse.
      </p>

      <h2>2. How we use your information</h2>
      <ul>
        <li>to create and secure your account and keep you signed in;</li>
        <li>
          to store your workouts, suggest exercise substitutions, and show
          your progress;
        </li>
        <li>
          to send account emails such as signup confirmation and password
          resets;
        </li>
        <li>to maintain, debug, and improve the Service;</li>
        <li>to comply with legal obligations.</li>
      </ul>
      <p>
        We do not sell your personal information, share it for cross-context
        behavioral advertising, or use it to make decisions that have legal
        or similarly significant effects on you.
      </p>

      <h2>3. Health-related information</h2>
      <p>
        Some workout and fitness information may be considered "consumer
        health data" under certain state laws, such as Washington's My Health
        My Data Act. We collect and use this information only to provide the
        Service you request. We do not sell it or share it with third parties
        except the service providers listed below, who process it on our
        behalf. By creating an account and entering fitness information, you
        consent to this collection and use. You may withdraw consent at any
        time by deleting your account.
      </p>

      <h2>4. Service providers</h2>
      <p>
        We use the following providers to operate PivotFit. They process data
        on our behalf and under their own security and privacy commitments:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong>: authentication, account emails, and
          database storage.
        </li>
        <li>
          <strong>Vercel</strong>: website hosting and delivery.
        </li>
      </ul>
      <p>
        We may also disclose information if required by law or to protect the
        rights, safety, or security of our users or others.
      </p>

      <h2>5. Cookies and local storage</h2>
      <p>
        PivotFit stores your login session in your browser's local storage so
        you stay signed in. This is strictly necessary for the Service to
        work. We do not use advertising or cross-site tracking cookies.
      </p>

      <h2>6. Data retention and deletion</h2>
      <p>
        We keep your information for as long as your account is active. You
        can permanently delete your account at any time from your Profile
        page. This immediately deletes your account and all associated
        workout data from our database. Copies may remain in our providers'
        encrypted backups for a limited period until those backups expire.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access,
        correct, delete, or receive a copy of your personal information, and
        to withdraw consent. You can delete your account directly in the app.
        For any other request, email {CONTACT_EMAIL}. We will not
        discriminate against you for exercising these rights.
      </p>

      <h2>8. Security</h2>
      <p>
        We use industry-standard measures, including encrypted connections
        (HTTPS), hashed passwords, and database access rules that let each
        user access only their own data. No system is perfectly secure. If a
        breach affects your information, we will notify you as required by
        law.
      </p>

      <h2>9. Children</h2>
      <p>
        PivotFit is not intended for children under 13, and we do not
        knowingly collect personal information from them. If you believe a
        child under 13 has created an account, contact us at {CONTACT_EMAIL}{" "}
        and we will delete it.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. If we make material
        changes, we will notify you in the app or by email before they take
        effect.
      </p>

      <h2>11. Contact</h2>
      <p>Questions about your privacy? Email us at {CONTACT_EMAIL}.</p>
    </LegalLayout>
  );
}

export default Privacy;
