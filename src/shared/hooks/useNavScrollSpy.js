import { useEffect } from "react";

/**
 * Highlights the navbar link (`.nav-item[href="#id"]`) whose `<section id>`
 * crosses the middle of the viewport.
 */
export function useNavScrollSpy() {
  useEffect(() => {
    const navLinks = document.querySelectorAll(".nav-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.remove("text-white", "text-defense-accent");
            link.classList.add("text-defense-muted");
          });
          const activeLink = document.querySelector(
            `.nav-item[href$="#${id}"]`
          );
          if (activeLink) {
            activeLink.classList.remove("text-defense-muted");
            activeLink.classList.add("text-white");
          }
        });
      },
      { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    const timer = setTimeout(() => {
      document
        .querySelectorAll("section")
        .forEach((section) => observer.observe(section));
    }, 0);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
