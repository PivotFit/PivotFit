import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { loadUserData, saveUserData } from "../lib/userData";

// Like useState, but persisted per signed-in user. Pass null to delete.
export function useUserData(name, fallback) {
  const { user } = useAuth();
  const [value, setValue] = useState(() => loadUserData(user.id, name, fallback));

  function update(next) {
    setValue(next);
    saveUserData(user.id, name, next);
  }

  return [value ?? fallback, update];
}
