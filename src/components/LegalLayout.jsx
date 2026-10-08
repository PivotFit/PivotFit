import { Link } from "react-router-dom";
import { LEGAL_LAST_UPDATED } from "../lib/legal";

function LegalLayout({ title, children }) {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand">
          <span className="brand-mark">P</span>
          <span>PivotFit</span>
        </Link>
      </header>

      <main className="legal">
        <p className="eyebrow">LEGAL</p>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {LEGAL_LAST_UPDATED}</p>
        {children}
      </main>
    </div>
  );
}

export default LegalLayout;
