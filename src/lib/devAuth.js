// TEMPORARY dev-only login bypass, so pages can be built without a Supabase
// project. Remove once everyone has Supabase set up locally.
//
// It only runs under `npm run dev`: import.meta.env.DEV is false in production
// builds, so this can never reach the live site.

export const DEV_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "dev@pivotfit.local",
  created_at: "2026-01-01T00:00:00.000Z",
};

export const DEV_SESSION = { user: DEV_USER };

const DEV_MESSAGE = "Disabled in dev mode (login is skipped).";

async function disabled() {
  return { data: { session: null, user: null }, error: { message: DEV_MESSAGE } };
}

// Stands in for the Supabase client: every call fails with a clear message
// instead of crashing or hitting a real backend with a fake user.
export const devSupabaseStub = {
  auth: {
    signInWithPassword: disabled,
    signUp: disabled,
    signOut: disabled,
    resetPasswordForEmail: disabled,
    updateUser: disabled,
  },
  rpc: disabled,
};
