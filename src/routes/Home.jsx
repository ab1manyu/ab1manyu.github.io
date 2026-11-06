import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useRevealOnScroll, useNavScrollSpy } from "@/shared/hooks";
import { AboutSection, SkillsSection, ContactSection } from "@/features/home";

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

  useRevealOnScroll();
  useNavScrollSpy();

  return (
    <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto relative z-10 transition-opacity duration-500">
      <AboutSection />
      <SkillsSection />
      <ContactSection />
    </main>
  );
}
