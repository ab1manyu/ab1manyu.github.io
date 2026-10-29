import { useEffect } from "react";

/**
 * Fades/slides matching elements in the first time they enter the viewport.
 * Elements are discovered after mount (deferred one tick) so children rendered
 * in the same commit are included.
 */
export function useRevealOnScroll(selector = ".glass-panel") {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition =
          "opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease";
        observer.observe(el);
      });
    }, 0);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [selector]);
}
