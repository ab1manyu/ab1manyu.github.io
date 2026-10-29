import { useEffect } from "react";

/** Disables page scrolling while `locked` is true; restores it on unlock/unmount. */
export function useBodyScrollLock(locked) {
  useEffect(() => {
    document.body.style.overflow = locked ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [locked]);
}
