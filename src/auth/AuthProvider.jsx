import { useEffect, useState } from "react";
import { DEV_SESSION } from "../lib/devAuth";
import { DEV_SKIP_AUTH, supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
  const [session, setSession] = useState(DEV_SKIP_AUTH ? DEV_SESSION : null);
  const [loading, setLoading] = useState(!DEV_SKIP_AUTH);

  useEffect(() => {
    if (DEV_SKIP_AUTH) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
