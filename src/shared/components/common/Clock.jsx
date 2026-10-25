import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const GLITCH_CHARS = "!<>-_\\\\/[]{}—=+*^?#________";

export default function Clock() {
  const [timeStr, setTimeStr] = useState("00:00:00 MST");
  const [isUTC, setIsUTC] = useState(false);

  const timeStrRef = useRef("00:00:00 MST");
  const isAnimatingRef = useRef(false);
  const gsapTweenRef = useRef(null);

  // Keep ref in sync
  useEffect(() => {
    timeStrRef.current = timeStr;
  }, [timeStr]);

  useEffect(() => {
    const updateClock = () => {
      if (isAnimatingRef.current) return;

      const now = new Date();
      const newTimeString = isUTC
        ? now.toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }) + " UTC"
        : now.toLocaleTimeString("en-US", {
            timeZone: "America/Denver",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }) + " MST";

      setTimeStr(newTimeString);
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, [isUTC]);

  const handleMouseEnter = () => {
    if (isUTC === true && !isAnimatingRef.current) return;
    animateTo(true);
  };

  const handleMouseLeave = () => {
    if (isUTC === false && !isAnimatingRef.current) return;
    animateTo(false);
  };

  const animateTo = (targetIsUTC) => {
    if (gsapTweenRef.current) {
      gsapTweenRef.current.kill();
    }

    isAnimatingRef.current = true;
    setIsUTC(targetIsUTC);

    const now = new Date();
    const targetStr = targetIsUTC
      ? now.toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " UTC"
      : now.toLocaleTimeString("en-US", {
          timeZone: "America/Denver",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " MST";

    const oldStr = timeStrRef.current;
    const targetLength = Math.max(oldStr.length, targetStr.length);

    // Create dummy object to animate
    const obj = { p: 0 };

    gsapTweenRef.current = gsap.to(obj, {
      p: 1,
      duration: 0.5, // Faster on hover
      ease: "power2.inOut",
      onUpdate: () => {
        let currentString = "";
        const progress = obj.p;

        for (let i = 0; i < targetLength; i++) {
          const charStart = (i / targetLength) * 0.5;
          const charEnd = charStart + 0.3;

          if (progress < charStart) {
            currentString += oldStr[i] || "";
          } else if (progress > charEnd) {
            currentString += targetStr[i] || "";
          } else {
            currentString +=
              GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          }
        }
        setTimeStr(currentString);
      },
      onComplete: () => {
        setTimeStr(targetStr);
        isAnimatingRef.current = false;
        gsapTweenRef.current = null;
      },
    });
  };

  return (
    <div
      className="sm:block font-mono text-xs text-defense-muted cursor-default hover:text-white transition-colors select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {timeStr}
    </div>
  );
}
