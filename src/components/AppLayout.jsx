import { NavLink, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function navClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

function AppLayout() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <span className="brand-mark">P</span>
          <span>PivotFit</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/plan" className={navClass}>
            Workouts
          </NavLink>
          <button className="nav-link">Progress</button>
          <NavLink to="/profile" className={navClass}>
            Profile
          </NavLink>
          <button className="nav-link" onClick={() => supabase.auth.signOut()}>
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
