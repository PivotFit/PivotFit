import { Link, NavLink, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo.svg";

function navClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

function AppLayout() {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand" aria-label="PivotFit home">
          <img className="brand-mark" src={logo} alt="" />
          <span>PivotFit</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/plan" className={navClass}>
            Workouts
          </NavLink>
          <NavLink to="/progress" className={navClass}>
            Progress
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            Profile
          </NavLink>
          <button className="nav-link nav-logout" onClick={() => supabase.auth.signOut()}>
            Log out
          </button>
        </nav>
      </header>

      <Outlet />

      <footer className="site-footer">
        <NavLink to="/terms">Terms of Service</NavLink>
        <NavLink to="/privacy">Privacy Policy</NavLink>
      </footer>
    </div>
  );
}

export default AppLayout;
