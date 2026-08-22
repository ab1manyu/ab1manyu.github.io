import { useEffect, useRef } from "react";
import { Terminal, ArrowUpRight } from "lucide-react";
import CardMatrixRain from "../CardMatrixRain";
import AsciiCats from "../AsciiCats";
import { TextScramble } from "../../utils/textScramble";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  const heroNameRef = useRef(null);

  useEffect(() => {
    const initScramble = () => {
      if (heroNameRef.current) {
        const fx = new TextScramble(heroNameRef.current);
        fx.setText("abimanyu ananthu");
      }
    };

    if (sessionStorage.getItem("booted")) {
      setTimeout(initScramble, 100);
    } else {
      window.addEventListener("loader-finished", initScramble);
    }

    return () => {
      window.removeEventListener("loader-finished", initScramble);
    };
  }, []);

  return (
    <section
      id="about"
      className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-24 scroll-mt-28"
    >
      <div className="glass-panel md:col-span-8 p-6 md:p-8 relative overflow-hidden group">
        <CardMatrixRain />
        <div className="absolute top-4 right-4 font-mono text-xs text-gray-600 z-10">
          0067
        </div>
        <h1
          className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 uppercase text-white relative z-10"
          id="hero-name"
          ref={heroNameRef}
        >
          uynami
        </h1>
        <h2 className="font-mono text-xl md:text-2xl text-gray-400 mb-6 flex items-center gap-2 relative z-10">
          <Terminal className="w-5 h-5" />
          CLEARED SOFTWARE ENGINEER
        </h2>
        <p className="max-w-lg text-gray-400 leading-relaxed text-sm md:text-base relative z-10">
          Specializing in full-stack software development and mission-critical
          software architecture. <br />
          <br />
          Building resilient solutions for defense and aerospace sectors.
        </p>
      </div>

      <AsciiCats />

      <div className="glass-panel md:col-span-3 p-6 flex flex-col justify-center items-center text-center gap-2">
        <span className="font-mono text-6xl font-bold text-white">3+</span>
        <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">
          YEARS OF EXPERIENCE
        </span>
      </div>

      <div className="glass-panel md:col-span-5 p-6 flex flex-col gap-6">
        <div>
          <div className="font-mono text-xs text-gray-500 mb-2">
            PRIMARY_DOMAINS
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`${styles.domainTag} ${styles.domainPython}`}>
              Python
            </span>
            <span className={`${styles.domainTag} ${styles.domainReact}`}>
              ReactJS
            </span>
            <span className={`${styles.domainTag} ${styles.domainJava}`}>
              Java
            </span>
            <span className={`${styles.domainTag} ${styles.domainMatlab}`}>
              MATLAB
            </span>
          </div>
        </div>
        <div>
          <div className="font-mono text-xs text-gray-500 mb-2">
            SECONDARY_DOMAINS
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`${styles.domainTag} ${styles.domainUIUX}`}>
              UI / UX
            </span>
            <span className={`${styles.domainTag} ${styles.domainAI}`}>AI</span>
            <span className={`${styles.domainTag} ${styles.domainData}`}>
              Data Science
            </span>
          </div>
        </div>
      </div>

      <a
        href="resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={`glass-panel md:col-span-4 p-6 flex items-center justify-between cursor-pointer ${styles.resumeCard}`}
      >
        <div>
          <div className="font-mono text-xs text-defense-accent mb-1">
            MORE_DOMAINS
          </div>
          <div className="text-xl font-bold text-white">Resume</div>
        </div>
        <div
          className={`w-10 h-10 rounded-full border border-defense-border flex items-center justify-center ${styles.resumeIconWrap}`}
        >
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </a>
    </section>
  );
}
