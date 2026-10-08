import { createClient } from "@supabase/supabase-js";
import { devSupabaseStub } from "./devAuth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const realClient =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Dev only: skip login when Supabase isn't configured yet, or when
// VITE_SKIP_AUTH=true is set in .env.local.
export const DEV_SKIP_AUTH =
  import.meta.env.DEV &&
  (import.meta.env.VITE_SKIP_AUTH === "true" || !realClient);

// Null in production when env vars are missing, so the app can show a setup
// message instead of crashing on a blank screen.
export const supabase = DEV_SKIP_AUTH ? devSupabaseStub : realClient;
