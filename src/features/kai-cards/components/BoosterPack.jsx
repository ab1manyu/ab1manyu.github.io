import { useCallback, useEffect, useRef, useState } from "react";
import { PACK_SIZE } from "../data/kaiCardsData";
import styles from "../styles/BoosterPack.module.css";

const SEAM = 14; // % of pack height where the top strip is torn off
const RIP_MS = 900;
const STEPS = 28;

// Fixed jitter so the torn edge looks the same every frame (and every pack)
const JAG = Array.from({ length: STEPS + 1 }, (_, i) => {
  const r = Math.sin(i * 12.9898) * 43758.5453;
  return (r - Math.floor(r) - 0.5) * 2.4;
});

const easeInOut = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function PackArt({ pack }) {
  const c = pack.colors;
  return (
    <div
      className={styles.art}
      style={{
        "--bg1": c.bg1,
        "--bg2": c.bg2,
        "--bg3": c.bg3,
        "--crimp1": c.crimp1,
        "--crimp2": c.crimp2,
        "--text": c.text,
        "--accent": c.accent,
        "--deep": c.deep,
      }}
    >
      <div className={`${styles.crimp} ${styles.crimpTop}`} />
      <div className={styles.face}>
        <div className={styles.brand}>
          <span>KAI</span>
          <small>{pack.name}</small>
        </div>
        <div className={styles.window}>
          <img src={pack.cover} alt="" draggable={false} />
        </div>
        <div className={styles.footer}>
          <span>booster pack</span>
          <span>{PACK_SIZE} cards</span>
        </div>
        <div className={styles.sheen} />
      </div>
      <div className={`${styles.crimp} ${styles.crimpBottom}`} />
    </div>
  );
}

/**
 * Sealed pack. Click to rip it open left → right.
 * `onRipped` fires once the tear reaches the right edge.
 */
export default function BoosterPack({ pack, onSelect, onRipped, disabled }) {
  const [rip, setRip] = useState(0); // 0..1 tear progress
  const [state, setState] = useState("sealed"); // sealed | ripping | gone
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const start = useCallback(() => {
    if (state !== "sealed" || disabled) return;
    setState("ripping");
    onSelect?.(pack);
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / RIP_MS);
      setRip(easeInOut(p));
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setState("gone");
        onRipped?.(pack);
      }
    };
    raf.current = requestAnimationFrame(tick);
  }, [state, disabled, pack, onSelect, onRipped]);

  // Polygons: the jagged boundary only exists left of the tear head
  const pts = [];
  for (let i = 0; i <= STEPS; i++) {
    const x = (i / STEPS) * 100;
    if (x <= rip * 100) pts.push([x, SEAM + JAG[i]]);
  }
  const head = rip * 100;
  const edge = pts.map(([x, y]) => `${x}% ${y}%`);
  const edgeRev = [...edge].reverse();

  const body = `polygon(0% 100%, ${edge.length ? edge.join(", ") + "," : ""} ${head}% ${SEAM}%, 100% ${SEAM}%, 100% 100%)`;
  const torn = `polygon(0% 0%, ${head}% 0%, ${head}% ${SEAM}%${edgeRev.length ? ", " + edgeRev.join(", ") : ""})`;
  const stay = `polygon(${head}% 0%, 100% 0%, 100% ${SEAM}%, ${head}% ${SEAM}%)`;

  const lift = Math.min(1, rip * 2.5);

  return (
    <div
      className={`${styles.pack} ${state === "sealed" ? styles.interactive : ""} ${
        state === "gone" ? styles.gone : ""
      }`}
      onClick={start}
    >
      {/* Empty button carries the accessible name; the artwork is decorative text */}
      <button
        type="button"
        aria-label={`Rip open ${pack.name} booster pack`}
        tabIndex={state === "sealed" ? 0 : -1}
        disabled={state !== "sealed"}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 5,
          background: "none",
          border: 0,
          cursor: "pointer",
        }}
      />
      <div className={styles.body} style={{ clipPath: body }}>
        <PackArt pack={pack} />
      </div>
      <div className={styles.stay} style={{ clipPath: stay }}>
        <PackArt pack={pack} />
      </div>
      <div
        className={styles.torn}
        style={{
          clipPath: torn,
          transformOrigin: `${head}% ${SEAM}%`,
          transform: `rotate(${-16 * lift}deg) translateY(${-6 * lift}px)`,
        }}
      >
        <PackArt pack={pack} />
      </div>
    </div>
  );
}
