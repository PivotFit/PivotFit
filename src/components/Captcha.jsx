import { useEffect, useRef, useState } from "react";
import { CAPTCHA_SITE_KEY, loadTurnstile } from "../lib/captcha";

// Turnstile's normal widget needs at least this much width; narrower forms
// (very small phones) get the compact square version instead.
const MIN_FLEXIBLE_WIDTH = 300;

// Renders the Turnstile check and reports its token (null when expired or
// reset). Tokens are single-use, so forms bump `resetSignal` after each
// submit to get a fresh one.
function Captcha({ onToken, resetSignal = 0 }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);
  const onTokenRef = useRef(onToken);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    onTokenRef.current = onToken;
  });

  useEffect(() => {
    let cancelled = false;

    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetId.current = turnstile.render(containerRef.current, {
          sitekey: CAPTCHA_SITE_KEY,
          theme: "dark",
          size: containerRef.current.clientWidth < MIN_FLEXIBLE_WIDTH ? "compact" : "flexible",
          callback: (token) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(null),
          "error-callback": () => onTokenRef.current(null),
        });
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
      if (widgetId.current !== null) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetSignal > 0 && widgetId.current !== null) {
      window.turnstile.reset(widgetId.current);
      onTokenRef.current(null);
    }
  }, [resetSignal]);

  if (loadFailed) {
    return (
      <p className="form-error" role="alert">
        The security check couldn't load. Check your connection or turn off
        content blockers for this site, then reload the page.
      </p>
    );
  }

  return <div ref={containerRef} className="captcha" />;
}

export default Captcha;
