import { useState } from "react";
import styles from "./AsciiCats.module.css";

const eyesList = ["-", "o", ">", "<"];

export default function CatCell({
  initialN1,
  initialN2,
  isLit,
  onClick,
  sweeping,
  sweepDelay,
  hidden,
  hideDelay,
  hideFadeMs,
  returnDelay,
  returning,
}) {
  const [n1, setN1] = useState(initialN1);
  const [n2, setN2] = useState(initialN2);

  const invert = (e) => {
    if (e === "o") return "o";
    if (e === "-") return "-";
    if (e === ">") return "<";
    if (e === "<") return ">";
    return e;
  };

  const handleMouseEnter = () => {
    let h1 = invert(n1);
    let h2 = invert(n2);
    if (Math.random() < 0.9) {
      if (Math.random() < 0.5) {
        h1 = eyesList[Math.floor(Math.random() * eyesList.length)];
      } else {
        h2 = eyesList[Math.floor(Math.random() * eyesList.length)];
      }
    }
    setN1(h1);
    setN2(h2);
  };

  const handleMouseLeave = () => {
    setN1(initialN1);
    setN2(initialN2);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 whitespace-pre ${
        isLit ? styles.catLit : styles.catNormal
      } ${sweeping ? styles.catSweeping : ""} ${
        returning && !hidden
          ? isLit
            ? styles.catReturnLit
            : styles.catReturn
          : ""
      }`}
      style={
        hidden
          ? {
              opacity: 0,
              transitionDelay: `${hideDelay}ms`,
              transitionDuration: `${hideFadeMs}ms`,
            }
          : sweeping
            ? { transitionDelay: `${sweepDelay}ms` }
            : returning
              ? { animationDelay: `${returnDelay}ms` }
              : undefined
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      <div className="leading-[1.2]">{" /\\_/\\ "}</div>
      <div className="leading-[1.2]">{`( ${n1}.${n2} )`}</div>
      <div className="leading-[1.2]">{" > ^ < "}</div>
    </div>
  );
}
