import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import logo from "../assets/logo.svg";

function navClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // While the menu is open, close it on Escape or on a click anywhere outside it.
  useEffect(() => {
    if (!menuOpen) return;

    function handleKey(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    }

    function handlePointer(event) {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    }

    document.addEventListener("keydown", handleKey);
    document.addEventListener("pointerdown", handlePointer);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("pointerdown", handlePointer);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand" aria-label="PivotFit home">
          <img className="brand-mark" src={logo} alt="" />
          <span>PivotFit</span>
        </Link>

        <div className="nav-menu" ref={menuRef}>
          <button
            ref={buttonRef}
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true">☰</span>
            Menu
          </button>

          {menuOpen && (
            <nav id="main-nav" className="nav-links" aria-label="Main">
              <NavLink to="/" end className={navClass} onClick={closeMenu}>
                Home
              </NavLink>
              <NavLink to="/plan" className={navClass} onClick={closeMenu}>
                Workouts
              </NavLink>
              <NavLink to="/progress" className={navClass} onClick={closeMenu}>
                Progress
              </NavLink>
              <NavLink to="/profile" className={navClass} onClick={closeMenu}>
                Profile
              </NavLink>
              <button className="nav-link nav-logout" onClick={() => supabase.auth.signOut()}>
                Log out
              </button>
            </nav>
          )}
        </div>
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