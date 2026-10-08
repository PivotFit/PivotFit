import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthProvider from "./auth/AuthProvider";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import { DEV_SKIP_AUTH, supabase } from "./lib/supabaseClient";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Plan from "./pages/Plan";
import Privacy from "./pages/Privacy";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import Terms from "./pages/Terms";
import Workout from "./pages/Workout";

function App() {
  if (!supabase) {
    return (
      <div className="app config-error">
        <h1>Supabase is not configured</h1>
        <p>
          Copy <code>.env.example</code> to <code>.env.local</code>, fill in
          your Supabase project URL and publishable key, then restart the dev
          server.
        </p>
      </div>
    );
  }

  return (
    <AuthProvider>
      {DEV_SKIP_AUTH && (
        <div className="dev-banner" role="status">
          Dev mode: login skipped, signed in as a fake user. Account actions
          are disabled.
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/workout/:day" element={<Workout />} />
            </Route>
          </Route>

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
