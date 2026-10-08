import { Link } from "react-router-dom";
import LegalLayout from "../components/LegalLayout";
import { CONTACT_EMAIL, GOVERNING_STATE } from "../lib/legal";

function Terms() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        These Terms of Service ("Terms") govern your use of PivotFit, an
        adaptive workout and fitness tracking web application (the "Service").
        By creating an account or using the Service, you agree to these Terms
        and to our <Link to="/privacy">Privacy Policy</Link>. If you do not
        agree, do not use the Service.
      </p>

      <section className="legal-callout">
        <h2>1. Not medical advice: please read</h2>
        <p>
          PivotFit provides general fitness information, workout tracking, and
          exercise substitution suggestions. <strong>It is not medical
          advice</strong> and is not a substitute for guidance from a
          physician, physical therapist, or certified trainer. Exercise
          suggestions are generated from general criteria such as muscle
          group, movement pattern, and equipment. They do not account for
          your health, injuries, medical conditions, or fitness level.
        </p>
        <p>
          Consult a qualified healthcare professional before starting any
          exercise program or trying a new exercise, especially if you are
          pregnant, have a medical condition, or have been injured. Stop
          exercising immediately and seek medical help if you feel pain,
          dizziness, shortness of breath, or discomfort.
        </p>
      </section>

      <h2>2. Assumption of risk</h2>
      <p>
        Physical exercise carries an inherent risk of injury. You choose
        whether, how, and with what weight to perform any exercise, including
        any substitution PivotFit suggests. To the fullest extent permitted by
        law, you voluntarily assume all risks of injury, illness, or damage
        arising from exercise you perform while using the Service.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 13 years old to use PivotFit. If you are under
        18, you may use the Service only with the permission of a parent or
        legal guardian, who agrees to these Terms on your behalf.
      </p>

      <h2>4. Your account</h2>
      <p>
        You are responsible for keeping your login credentials secure and for
        all activity under your account. Provide accurate information, and
        tell us promptly at {CONTACT_EMAIL} if you believe your account has
        been accessed without authorization. You can delete your account at
        any time from your Profile page.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          access or attempt to access other users' accounts or data;
        </li>
        <li>
          interfere with, disrupt, or attempt to bypass the security of the
          Service;
        </li>
        <li>
          use automated means to scrape, overload, or abuse the Service;
        </li>
        <li>use the Service for any unlawful purpose.</li>
      </ul>

      <h2>6. Your content</h2>
      <p>
        You own the workout data and other content you enter into PivotFit.
        You give us a limited license to store, process, and display that
        content solely to operate and provide the Service to you. We do not
        sell your data.
      </p>

      <h2>7. Changes to the Service</h2>
      <p>
        PivotFit is under active development. We may add, change, or remove
        features, or suspend or discontinue the Service, at any time. We will
        make reasonable efforts to give notice before discontinuing the
        Service so you can export or delete your data.
      </p>

      <h2>8. Termination</h2>
      <p>
        You may stop using the Service and delete your account at any time.
        We may suspend or terminate accounts that violate these Terms.
      </p>

      <h2>9. Disclaimer of warranties</h2>
      <p>
        The Service is provided "as is" and "as available," without
        warranties of any kind, express or implied, including warranties of
        merchantability, fitness for a particular purpose, accuracy, and
        non-infringement. We do not warrant that the Service will be
        uninterrupted, error-free, or that data will never be lost.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, the PivotFit team will not be
        liable for any indirect, incidental, special, consequential, or
        punitive damages, or for any personal injury, loss of data, or loss
        of profits, arising from or related to your use of the Service. Some
        jurisdictions do not allow certain limitations, so some of these may
        not apply to you.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of {GOVERNING_STATE},
        without regard to its conflict-of-law rules.
      </p>

      <h2>12. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. If we make material
        changes, we will notify you in the app or by email and ask you to
        accept the updated Terms before continuing to use the Service.
      </p>

      <h2>13. Contact</h2>
      <p>Questions about these Terms? Email us at {CONTACT_EMAIL}.</p>
    </LegalLayout>
  );
}

export default Terms;
