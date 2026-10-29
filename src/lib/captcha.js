// Cloudflare Turnstile bot protection for signup, login and password reset.
//
// Enabled only when VITE_TURNSTILE_SITE_KEY is set. Supabase verifies the token
// once captcha is turned on under Authentication → Attack Protection. Deploy the
// site key first, then enable it in Supabase: if Supabase requires captcha
// before the site sends tokens, every login fails.

export const CAPTCHA_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
export const CAPTCHA_ENABLED = Boolean(CAPTCHA_SITE_KEY);

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loading = null;

// Loads Cloudflare's script once and resolves with window.turnstile.
export function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile unavailable"));
    script.onerror = () => {
      loading = null; // allow a retry on the next mount
      script.remove();
      reject(new Error("Could not load Turnstile"));
    };
    document.head.appendChild(script);
  });
  return loading;
}
