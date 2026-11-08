import { useEffect, useRef } from "react";

const CELL = 20; // matches the 20px dot grid in DotGrid.module.css
const OFFSET = CELL / 2; // dots are centred in each tile
const PALETTE = [
  [255, 140, 20],
  [255, 214, 80],
  [255, 70, 70],
  [60, 220, 255],
  [255, 90, 220],
  [90, 255, 150],
  [190, 130, 255],
];

const TAU = Math.PI * 2;
const rand = (a, b) => a + Math.random() * (b - a);
const easeOut = (t) => 1 - (1 - t) ** 3;

/** Each pattern returns {x, y} offsets (in grid cells) the burst expands to. */
const PATTERNS = {
  ring(R) {
    return Array.from({ length: 28 }, (_, i) => ({
      x: Math.cos((i / 28) * TAU) * R,
      y: Math.sin((i / 28) * TAU) * R,
    }));
  },
  sphere(R) {
    const pts = [];
    for (let r = 2; r <= R; r += 2)
      for (let i = 0; i < r * 4; i++)
        pts.push({
          x: Math.cos((i / (r * 4)) * TAU) * r,
          y: Math.sin((i / (r * 4)) * TAU) * r,
        });
    return pts;
  },
  heart(R) {
    const s = R / 17;
    return Array.from({ length: 48 }, (_, i) => {
      const t = (i / 48) * TAU;
      return {
        x: 16 * Math.sin(t) ** 3 * s,
        y:
          -(
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
          ) * s,
      };
    });
  },
  star(R) {
    const pts = [];
    for (let k = 0; k < 5; k++) {
      const a0 = (k / 5) * TAU - Math.PI / 2;
      const a1 = ((k + 2) / 5) * TAU - Math.PI / 2;
      for (let j = 0; j < 10; j++) {
        const f = j / 10;
        pts.push({
          x: (Math.cos(a0) + (Math.cos(a1) - Math.cos(a0)) * f) * R,
          y: (Math.sin(a0) + (Math.sin(a1) - Math.sin(a0)) * f) * R,
        });
      }
    }
    return pts;
  },
  spiral(R) {
    const pts = [];
    for (let arm = 0; arm < 3; arm++)
      for (let j = 0; j < 16; j++) {
        const f = (j + 1) / 16;
        const a = (arm / 3) * TAU + f * 3.2;
        pts.push({ x: Math.cos(a) * R * f, y: Math.sin(a) * R * f });
      }
    return pts;
  },
  cross(R) {
    const pts = [];
    for (let j = 1; j <= R; j++)
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [0.7, 0.7],
        [-0.7, 0.7],
        [0.7, -0.7],
        [-0.7, -0.7],
      ])
        pts.push({ x: dx * j, y: dy * j });
    return pts;
  },
  willow(R) {
    return Array.from({ length: 36 }, (_, i) => ({
      x: Math.cos((i / 36) * TAU) * R * rand(0.6, 1),
      y: Math.sin((i / 36) * TAU) * R * rand(0.6, 1),
      fall: true,
    }));
  },
};
const NAMES = Object.keys(PATTERNS);

export default function FireworksLayer() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let W = 0;
    let H = 0;
    let raf = 0;
    let works = [];
    const timers = new Set();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const px = (g) => g * CELL + OFFSET;

    const launch = () => {
      const cols = Math.floor(W / CELL);
      const rows = Math.floor(H / CELL);
      const R = Math.round(rand(5, 9));
      const gx = Math.round(rand(R + 2, cols - R - 2));
      const gy = Math.round(rand(R + 5, rows * 0.55));
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const alt = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      works.push({
        gx,
        gy,
        rows,
        color,
        alt,
        pts: PATTERNS[name](R),
        born: performance.now(),
        rise: rand(600, 900),
        life: 1700,
      });
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const dot = (x, y, [r, g, b], a, size = 1) => {
      if (a <= 0.01) return;
      ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.25})`;
      ctx.beginPath();
      ctx.arc(x, y, 5 * size, 0, TAU);
      ctx.fill();
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.beginPath();
      ctx.arc(x, y, 2 * size, 0, TAU);
      ctx.fill();
    };

    function tick(now) {
      ctx.clearRect(0, 0, W, H);
      works = works.filter((w) => now - w.born < w.rise + w.life);
      for (const w of works) {
        const age = now - w.born;
        if (age < w.rise) {
          // rocket: a lit dot climbing the column, leaving a fading dotted trail
          const p = age / w.rise;
          const head = Math.round(w.rows - (w.rows - w.gy) * easeOut(p));
          for (let k = 0; k < 6; k++)
            dot(px(w.gx), px(head + k), w.color, (1 - k / 6) * 0.9);
        } else {
          const p = (age - w.rise) / w.life;
          const e = easeOut(Math.min(1, p * 1.4));
          const fade = (1 - p) ** 1.3;
          dot(px(w.gx), px(w.gy), [255, 255, 255], Math.max(0, 1 - p * 5), 1.4);
          for (const pt of w.pts) {
            const fall = pt.fall ? p * p * 7 : 0;
            const gx = Math.round(w.gx + pt.x * e);
            const gy = Math.round(w.gy + pt.y * e + fall);
            const twinkle = 0.75 + 0.25 * Math.sin(now / 60 + pt.x * 3 + pt.y);
            dot(px(gx), px(gy), p > 0.55 ? w.alt : w.color, fade * twinkle);
          }
        }
      }
      raf = works.length ? requestAnimationFrame(tick) : 0;
      if (!works.length) ctx.clearRect(0, 0, W, H);
    }

    const later = (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };

    // click on the sparkles icon: a volley of different patterns
    const volley = () => {
      for (let i = 0; i < 6; i++) later(launch, i * 260 + rand(0, 120));
    };
    window.addEventListener("diwali-fireworks", volley);

    // ambient: random dots light up and burst every so often
    let ambient;
    if (!reduced) {
      const loop = () => {
        launch();
        ambient = setTimeout(loop, rand(1100, 2600));
      };
      ambient = setTimeout(loop, 600);
    }

    return () => {
      clearTimeout(ambient);
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("diwali-fireworks", volley);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: -1 }}
    />
  );
}
