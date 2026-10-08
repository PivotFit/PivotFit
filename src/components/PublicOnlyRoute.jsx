import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { DEV_SKIP_AUTH } from "../lib/supabaseClient";

// Login/signup pages: send already-signed-in users to the dashboard.
function PublicOnlyRoute() {
  const { session, loading } = useAuth();

  // Dev mode: keep these pages viewable even though a fake user is signed in.
  if (DEV_SKIP_AUTH) {
    return <Outlet />;
  }

  if (loading) {
    return <p className="loading">Loading…</p>;
  }

  return session ? <Navigate to="/" replace /> : <Outlet />;
}

export default PublicOnlyRoute;
