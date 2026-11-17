import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo.svg";
import { BoltIcon, ChartIcon, DumbbellIcon, HomeIcon, LogoutIcon, UserIcon } from "./Icons";

const MAIN_LINKS = [
  { to: "/", label: "Home", icon: HomeIcon, end: true },
  { to: "/plan", label: "Workouts", icon: DumbbellIcon },
  { to: "/progress", label: "Progress", icon: ChartIcon },
];
const ACCOUNT_LINKS = [{ to: "/profile", label: "Profile", icon: UserIcon }];

function navClass({ isActive }) {
  return isActive ? "side-link active" : "side-link";
}

function tabClass({ isActive }) {
  return isActive ? "tab-link active" : "tab-link";
}

function SideLinks({ links }) {
  return links.map(({ to, label, icon: Icon, end }) => (
    <li key={to}>
      <NavLink to={to} end={end} className={navClass}>
        <Icon />
        <span>{label}</span>
      </NavLink>
    </li>
  ));
}

function AppLayout() {
  const { user } = useAuth();
  const initial = (user?.email?.[0] ?? "P").toUpperCase();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="app app-shell">
      <aside className="sidebar" aria-label="Main">
        <Link to="/" className="sidebar-brand" aria-label="PivotFit home">
          <img className="brand-mark" src={logo} alt="" />
          <span>
            <strong>PivotFit</strong>
            <small>Adaptive training</small>
          </span>
        </Link>

        <nav className="sidebar-nav">
          <p className="sidebar-label" id="nav-general">General</p>
          <ul aria-labelledby="nav-general">
            <SideLinks links={MAIN_LINKS} />
          </ul>

          <p className="sidebar-label" id="nav-account">Account</p>
          <ul aria-labelledby="nav-account">
            <SideLinks links={ACCOUNT_LINKS} />
            <li>
              <button type="button" className="side-link" onClick={() => supabase.auth.signOut()}>
                <LogoutIcon />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </nav>

        <Link to="/plan" className="sidebar-cta">
          <BoltIcon size={18} />
          Start a workout
        </Link>
      </aside>

      <div className="shell-main">
        <header className="topbar">
          <Link to="/" className="topbar-brand" aria-label="PivotFit home">
            <img className="brand-mark" src={logo} alt="" />
            <span>PivotFit</span>
          </Link>
          <p className="topbar-date">{today}</p>
          <Link to="/profile" className="avatar" aria-label="Your profile" title={user?.email}>
            {initial}
          </Link>
        </header>

        <Outlet />

        <footer className="site-footer">
          <NavLink to="/terms">Terms of Service</NavLink>
          <NavLink to="/privacy">Privacy Policy</NavLink>
        </footer>
      </div>

      {/* Phones: bottom tab bar replaces the sidebar. Log out lives on Profile. */}
      <nav className="tab-bar" aria-label="Main">
        {[...MAIN_LINKS, ...ACCOUNT_LINKS].map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={tabClass}>
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AppLayout;