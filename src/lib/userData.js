// Per-user data saved in the browser (localStorage) until the Supabase tables
// exist. Keys are namespaced by user id so accounts on one browser stay apart.
//
// Stored names: "profile", "history", "ratings", "activeSession".

const PREFIX = "pivotfit";

function storageKey(userId, name) {
  return `${PREFIX}:${userId}:${name}`;
}

export function loadUserData(userId, name, fallback) {
  try {
    const raw = localStorage.getItem(storageKey(userId, name));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveUserData(userId, name, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(storageKey(userId, name));
    } else {
      localStorage.setItem(storageKey(userId, name), JSON.stringify(value));
    }
  } catch {
    // Storage full or blocked (e.g. private browsing): keep working in memory.
  }
}

export function clearUserData(userId) {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(`${PREFIX}:${userId}:`))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
