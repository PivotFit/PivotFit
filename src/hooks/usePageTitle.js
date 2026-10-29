import { useEffect } from "react";

// Sets the browser tab title, e.g. "Progress · PivotFit". Screen readers
// announce it on navigation, so every page needs its own (WCAG 2.4.2).
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · PivotFit` : "PivotFit";
  }, [title]);
}
