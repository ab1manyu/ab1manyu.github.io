import { useLayoutEffect } from "react";

/** Scrolls the window to the top once, before first paint, on mount. */
export function useScrollToTop() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}
