import { useEffect, useState, useRef } from "react";
import { Plane } from "lucide-react";

export default function BackgroundElements() {
  const [fadedOut, setFadedOut] = useState(false);
  const [bogeys, setBogeys] = useState([]);
  const [radarActive, setRadarActive] = useState(false);
  const sweepTimeoutRef = useRef(null);
  const revealTimeoutsRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadedOut(true);
    }, 50);

    const handleRadarPing = () => {
      setRadarActive(false);
      setTimeout(() => setRadarActive(true), 10);

      if (sweepTimeoutRef.current) clearTimeout(sweepTimeoutRef.current);
      revealTimeoutsRef.current.forEach(clearTimeout);
      revealTimeoutsRef.current = [];

      const targetCount = Math.floor(Math.random() * 4) + 2;
      const newBogeys = [];
      const placedJets = [];
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      for (let i = 0; i < targetCount; i++) {
        let isLeft, verticalPos, horizontalOffset;
        let attempts = 0;
        let collision = true;

        while (collision && attempts < 20) {
          isLeft = Math.random() > 0.5;
          verticalPos = Math.floor(Math.random() * 70) + 15;
          horizontalOffset = Math.floor(Math.random() * 15) + 2;

          collision = placedJets.some((jet) => {
            if (jet.isLeft === isLeft) {
              return Math.abs(jet.top - verticalPos) < 15;
            }
            return false;
          });
          attempts++;
        }

        if (collision) continue;
        placedJets.push({ isLeft, top: verticalPos });

        const rotation = isLeft
          ? 45 + Math.random() * 45
          : -45 - Math.random() * 45;

        const xPct = isLeft ? horizontalOffset : 100 - horizontalOffset;
        const yPct = verticalPos;
        const xPix = (xPct / 100) * vw;
        const yPix = (yPct / 100) * vh;
        const dx = xPix - 25;
        const dy = yPix - 25;
        const distancePix = Math.sqrt(dx * dx + dy * dy);
        const delay = distancePix / (2500 / 1.5);

        newBogeys.push({
          id: Math.random().toString(36).substr(2, 9),
          index: i,
          top: verticalPos,
          left: isLeft ? horizontalOffset : null,
          right: !isLeft ? horizontalOffset : null,
          rotation,
          delay,
        });
      }

      setBogeys(newBogeys);

      window.dispatchEvent(new Event("radar-scanning"));

      newBogeys.forEach((bogey) => {
        const t = setTimeout(() => {
          window.dispatchEvent(new Event("bogey-revealed"));
        }, bogey.delay * 1000);
        revealTimeoutsRef.current.push(t);
      });

      sweepTimeoutRef.current = setTimeout(() => {
        setBogeys([]);
        window.dispatchEvent(new Event("radar-complete"));
      }, 4800);
    };

    window.addEventListener("radar-ping", handleRadarPing);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("radar-ping", handleRadarPing);
      if (sweepTimeoutRef.current) clearTimeout(sweepTimeoutRef.current);
      revealTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);
  return (
    <>
      <div
        id="radar-screen-sweep"
        className={`fixed top-0 left-0 w-[50px] h-[50px] rounded-full border-2 border-defense-accent pointer-events-none z-0 ${radarActive ? "full-sweep-active" : "opacity-0"}`}
      ></div>

      {bogeys.map((bogey) => {
        return (
          <div
            key={bogey.id}
            className="fighter-jet-dynamic fixed z-0 flex flex-col items-center gap-1 pointer-events-none"
            style={{
              top: `${bogey.top}%`,
              ...(bogey.left !== null ? { left: `${bogey.left}%` } : {}),
              ...(bogey.right !== null ? { right: `${bogey.right}%` } : {}),
              animation: `fadeInOut 4s ease-in-out ${bogey.delay.toFixed(2)}s both`,
            }}
          >
            <Plane
              className="w-6 h-6 text-defense-accent"
              style={{ transform: `rotate(${bogey.rotation}deg)` }}
            />
            <span className="text-[8px] font-mono text-defense-accent bg-black/80 px-1 border border-defense-accent">
              BOGEY_0{bogey.index + 1}
            </span>
          </div>
        );
      })}

      {/* PAGE TRANSITION OVERLAY */}
      <div
        id="transition-overlay"
        className={fadedOut ? "faded-out" : ""}
      ></div>
    </>
  );
}
