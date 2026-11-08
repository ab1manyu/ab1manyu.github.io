import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { createDiya, COLORS } from "./diyaEngine";
import { createAudio } from "./audio";

const FONT = '"Share Tech Mono", ui-monospace, monospace';

export default function DiyaCard() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [run, setRun] = useState(0);
  const [size, setSize] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef(null);
  const soundRef = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => setSize(Math.round(el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // song: (re)starts on enable and on replay, fades out on disable/unmount
  useEffect(() => {
    soundRef.current = soundOn;
    if (!soundOn) return;
    audioRef.current ??= createAudio();
    audioRef.current?.start();
    return () => audioRef.current?.stop();
  }, [soundOn, run]);

  useEffect(
    () => () => {
      audioRef.current?.destroy();
      audioRef.current = null;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!size || !canvas) return;
    const fontPx = size < 520 ? 10 : 13;
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontPx}px ${FONT}`;
    const cw = ctx.measureText("M").width || fontPx * 0.6;
    const lh = cw * 2;
    const W = Math.max(30, Math.floor(size / cw));
    const H = Math.max(14, Math.floor((size * (size < 640 ? 1.0 : 0.62)) / lh));
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * cw * dpr;
    canvas.height = H * lh * dpr;
    canvas.style.width = `${W * cw}px`;
    canvas.style.height = `${H * lh}px`;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const frame = createDiya(W, H, { seed: 7 });
    let raf;
    let start = performance.now();
    let last = start;
    let visible = true;
    let prevT = 0;
    let prevBurst = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = performance.now();
    });
    io.observe(canvas);

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      // reduced motion: skip straight to the finished artwork
      const t = reduced ? 20 + (now - start) / 4000 : (now - start) / 1000;
      const { glyphs, colors, burst } = frame(t, dt);
      const sfx = soundRef.current ? audioRef.current : null;
      if (sfx) {
        if (prevT < 8.5 && t >= 8.5) sfx.ignite();
        if (t >= 15 && Math.random() < dt * 3) sfx.pop();
        if (burst > 0.97 && prevBurst <= 0.97) sfx.sparkle();
      }
      prevT = t;
      prevBurst = burst;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W * cw, H * lh);
      ctx.font = `${fontPx}px ${FONT}`;
      ctx.textBaseline = "middle";
      let cur = -1;
      for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
          const i = r * W + c;
          const g = glyphs[i];
          if (!g) continue;
          if (colors[i] !== cur) {
            cur = colors[i];
            ctx.fillStyle = COLORS[cur];
          }
          ctx.fillText(g, c * cw, r * lh + lh / 2);
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [size, run]);

  const replay = useCallback(() => setRun((n) => n + 1), []);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-orange-500/30 bg-black/70 backdrop-blur p-4 sm:p-6 shadow-[0_0_60px_rgba(255,120,10,0.15)]">
      <div ref={wrapRef} className="w-full flex justify-center">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Animated ASCII art of a glowing Diwali diya"
          className="block"
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="font-mono text-orange-200/90 text-sm sm:text-base">
          Shubh Deepavali, Harini ✦
        </p>
        <button
          type="button"
          onClick={() => setSoundOn((v) => !v)}
          aria-pressed={soundOn}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-orange-500/40 px-3 py-1.5 font-mono text-xs text-orange-200 hover:bg-orange-500/10 cursor-pointer"
        >
          {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
          {soundOn ? "Sound on" : "Sound off"}
        </button>
        <button
          type="button"
          onClick={replay}
          className="inline-flex items-center gap-2 rounded-lg border border-orange-500/40 px-3 py-1.5 font-mono text-xs text-orange-200 hover:bg-orange-500/10 cursor-pointer"
        >
          <RotateCcw size={14} /> Replay
        </button>
      </div>
    </div>
  );
}
