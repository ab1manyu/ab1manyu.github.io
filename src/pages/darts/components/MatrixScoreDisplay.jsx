import { useState, useEffect, useRef } from "react";

export default function MatrixScoreDisplay({
  score,
  colorClass = "text-emerald-400",
}) {
  const [displayDigits, setDisplayDigits] = useState(String(score).split(""));
  const [scramblingIndices, setScramblingIndices] = useState([]);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (prevScoreRef.current === score) return;

    const oldStr = String(prevScoreRef.current);
    const newStr = String(score);
    prevScoreRef.current = score;

    const targetDigits = newStr.split("");
    const changedIndices = [];

    for (let i = 0; i < targetDigits.length; i++) {
      if (oldStr[i] !== newStr[i]) {
        changedIndices.push(i);
      }
    }

    if (changedIndices.length === 0) {
      setDisplayDigits(targetDigits);
      return;
    }

    setScramblingIndices(changedIndices);
    let frame = 0;
    const totalFrames = 9;

    const interval = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayDigits(targetDigits);
        setScramblingIndices([]);
      } else {
        setDisplayDigits(
          targetDigits.map((d, i) => {
            if (changedIndices.includes(i)) {
              return String(Math.floor(Math.random() * 10));
            }
            return d;
          })
        );
      }
    }, 40);

    return () => clearInterval(interval);
  }, [score]);

  return (
    <span className="font-mono">
      {displayDigits.map((char, i) => (
        <span
          key={i}
          className={
            scramblingIndices.includes(i)
              ? `${colorClass} animate-pulse inline-block`
              : "inline-block"
          }
        >
          {char}
        </span>
      ))}
    </span>
  );
}
