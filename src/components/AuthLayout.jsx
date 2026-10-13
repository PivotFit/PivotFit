import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="app auth-page">
      <main className="auth-card">
        <Link to="/" className="brand auth-brand">
          <img className="brand-mark" src={logo} alt="" />
          <span>PivotFit</span>
        </Link>
        <h1>{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;
