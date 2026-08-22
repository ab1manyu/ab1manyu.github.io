import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import AboutSection from "../components/sections/AboutSection";
import SkillsSection from "../components/sections/SkillsSection";
import ContactSection from "../components/sections/ContactSection";

export default function Home() {
  const location = useLocation();
  const isFirstMount = useRef(true);

  useLayoutEffect(() => {
    const isFirst = isFirstMount.current;
    if (isFirst) {
      isFirstMount.current = false;
    }

    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        if (isFirst) {
          // Instantly jump to the layout position before first paint
          const y = element.getBoundingClientRect().top + window.scrollY - 112;
          window.scrollTo({ top: y, behavior: "auto" });
        } else {
          // Smooth scroll for subsequent in-page hash changes
          setTimeout(() => {
            const y =
              element.getBoundingClientRect().top + window.scrollY - 112;
            window.scrollTo({ top: y, behavior: "smooth" });
          }, 50);
        }
      }
    } else if (isFirst) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  useEffect(() => {
    // 2. Intersection Observer for glass-panels
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

    // Note: Since child components may render slightly after the effect runs
    // we wait a tiny bit to make sure `.glass-panel`s are mounted.
    setTimeout(() => {
      document.querySelectorAll(".glass-panel").forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition =
          "opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease";
        observer.observe(el);
      });
    }, 0);

    // 3. Scroll Spy for Navbar
    const navLinks = document.querySelectorAll(".nav-item");
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.remove("text-white", "text-defense-accent");
              link.classList.add("text-defense-muted");
            });
            const activeLink = document.querySelector(
              `.nav-item[href="#${id}"]`
            );
            if (activeLink) {
              activeLink.classList.remove("text-defense-muted");
              activeLink.classList.add("text-white");
            }
          }
        });
      },
      { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    setTimeout(() => {
      document
        .querySelectorAll("section")
        .forEach((section) => spyObserver.observe(section));
    }, 0);

    return () => {
      observer.disconnect();
      spyObserver.disconnect();
    };
  }, []);

  return (
    <>
      <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto relative z-10 transition-opacity duration-500">
        <AboutSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </>
  );
}
