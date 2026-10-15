// Where Supabase keeps the login session, based on "Remember me":
//   remembered     -> localStorage: survives closing the browser
//   not remembered -> sessionStorage: cleared when the browser (tab) closes
//
// The choice itself is saved in localStorage so it applies on the next visit.
// Defaults to remembered, which matches the app's original behavior.

const REMEMBER_KEY = "pivotfit:rememberMe";

function safe(fn, fallback = null) {
  try {
    return fn();
  } catch {
    // Storage blocked (e.g. some private browsing modes).
    return fallback;
  }
}

export function getRememberMe() {
  return safe(() => localStorage.getItem(REMEMBER_KEY) !== "false", true);
}

export function setRememberMe(remember) {
  safe(() => localStorage.setItem(REMEMBER_KEY, String(remember)));
}

// Values that must be readable from another tab (an emailed link opens a new
// one) always go to localStorage. Only the PKCE flow uses this key.
function needsSharedStorage(key) {
  return key.endsWith("-code-verifier");
}

export const authStorage = {
  getItem(key) {
    return safe(() => localStorage.getItem(key) ?? sessionStorage.getItem(key));
  },
  setItem(key, value) {
    safe(() => {
      if (getRememberMe() || needsSharedStorage(key)) {
        localStorage.setItem(key, value);
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
      }
    });
  },
  removeItem(key) {
    safe(() => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  },
};
