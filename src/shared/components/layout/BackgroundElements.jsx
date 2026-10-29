import { useEffect, useState, useRef } from "react";
import { Plane } from "lucide-react";
import styles from "./BackgroundElements.module.css";

export default function BackgroundElements() {
  const [fadedOut, setFadedOut] = useState(false);
  const [bogeys, setBogeys] = useState([]);
  const [radarActive, setRadarActive] = useState(false);
  const [radarOrigin, setRadarOrigin] = useState({ x: 44, y: 32 });
  const sweepTimeoutRef = useRef(null);
  const revealTimeoutsRef = useRef([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadedOut(true);
    }, 50);

    const handleRadarPing = () => {
      setRadarActive(false);

      const triggerEl = document.getElementById("radar-trigger");
      let ox = 44;
      let oy = 32;
      if (triggerEl) {
        const rect = triggerEl.getBoundingClientRect();
        ox = rect.left + rect.width / 2;
        oy = rect.top + rect.height / 2;
      }
      setRadarOrigin({ x: ox, y: oy });

      setTimeout(() => setRadarActive(true), 10);

      if (sweepTimeoutRef.current) clearTimeout(sweepTimeoutRef.current);
      revealTimeoutsRef.current.forEach(clearTimeout);
      revealTimeoutsRef.current = [];

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sweepDuration = 1.6; // duration of fullSweep animation in seconds
      const maxRadius = Math.max(vw, vh) * 1.4; // 140vmax radius from 280vmax diameter
      const waveSpeed = maxRadius / sweepDuration; // pixels per second

      // Stagger target bogeys across distinct distance zones from the radar origin
      // so each target is hit and revealed sequentially as the 12px wave expands
      const zones = [
        { isLeft: true, xMin: 5, xMax: 12, yMin: 18, yMax: 30 }, // Left Upper (near)
        { isLeft: true, xMin: 6, xMax: 15, yMin: 52, yMax: 72 }, // Left Lower (mid-near)
        {
          isLeft: false,
          xMin: vw < 768 ? 8 : 22,
          xMax: vw < 768 ? 18 : 34,
          yMin: 18,
          yMax: 34,
        }, // Right Upper / Mid (mid-far)
        { isLeft: false, xMin: 5, xMax: 14, yMin: 62, yMax: 84 }, // Right Lower (far)
      ];

      // Spawn 3 or 4 bogeys across the zones
      const count = Math.random() > 0.35 ? 4 : 3;
      const selectedZones =
        count === 3 ? [zones[0], zones[1], zones[3]] : zones;

      const newBogeys = selectedZones.map((z) => {
        const xPct = z.isLeft
          ? z.xMin + Math.random() * (z.xMax - z.xMin)
          : 100 - (z.xMin + Math.random() * (z.xMax - z.xMin));
        const yPct = z.yMin + Math.random() * (z.yMax - z.yMin);

        const xPix = (xPct / 100) * vw;
        const yPix = (yPct / 100) * vh;
        const dist = Math.hypot(xPix - ox, yPix - oy);
        // Delay is the exact arrival time of the wave leading edge at this target
        const delay = Math.max(0.08, dist / waveSpeed);

        return {
          id: Math.random().toString(36).slice(2, 11),
          index: 0,
          top: yPct,
          left: z.isLeft ? xPct : null,
          right: !z.isLeft ? 100 - xPct : null,
          rotation: z.isLeft
            ? 45 + Math.random() * 45
            : -45 - Math.random() * 45,
          delay,
        };
      });

      // Sort by delay so BOGEY_01 is always first revealed, then 02, 03, etc.
      newBogeys.sort((a, b) => a.delay - b.delay);
      newBogeys.forEach((b, idx) => {
        b.index = idx;
      });

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
        className={`${styles.radarSweep} ${
          radarActive ? styles.fullSweepActive : "opacity-0"
        }`}
        style={{
          top: `${radarOrigin.y}px`,
          left: `${radarOrigin.x}px`,
        }}
      />

      {bogeys.map((bogey) => (
        <div
          key={bogey.id}
          className={`${styles.fighterJet} ${styles.bogeyVisible}`}
          style={{
            top: `${bogey.top}%`,
            ...(bogey.left !== null ? { left: `${bogey.left}%` } : {}),
            ...(bogey.right !== null ? { right: `${bogey.right}%` } : {}),
            animationDelay: `${bogey.delay.toFixed(2)}s`,
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
      ))}

      {/* Page Transition Overlay */}
      <div
        id="transition-overlay"
        className={`${styles.transitionOverlay} ${
          fadedOut ? styles.fadedOut : ""
        }`}
      ></div>
    </>
  );
}
