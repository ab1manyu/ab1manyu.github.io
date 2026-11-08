/**
 * Procedural Web Audio for the diya: a gentle pentatonic (raag Bhoopali style)
 * melody over a tanpura-like drone, plus sound effects. Everything is
 * synthesised, so no audio assets are needed.
 */
const SCALE = [0, 2, 4, 7, 9]; // C D E G A
const BASE = 261.63; // C4
const BPM = 66;
const EIGHTH = 60 / BPM / 2;

const PHRASES = [
  [5, 6, 5, 3, 4, 3, 1, null, 2, 1, 0, 1, 3, null, null, null],
  [5, 6, 7, 6, 5, 3, 5, null, 4, 3, 1, 2, 0, null, null, null],
  [3, 5, 6, 8, 7, 6, 5, 6, 5, 3, 4, 3, 1, 0, null, null],
  [5, 6, 5, 3, 4, 3, 1, null, 3, 1, 0, -1, 0, null, null, null],
];
const ORDER = [0, 0, 1, 0, 2, 2, 1, 3];

const freqOf = (deg) => {
  const oct = Math.floor(deg / 5);
  const idx = ((deg % 5) + 5) % 5;
  return BASE * 2 ** (oct + SCALE[idx] / 12);
};

export function createAudio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // cheap synthetic reverb
  const verb = ctx.createConvolver();
  const len = ctx.sampleRate * 2.6;
  const ir = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  }
  verb.buffer = ir;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  verb.connect(wet).connect(master);
  const bus = ctx.createGain();
  bus.connect(master);
  bus.connect(verb);

  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  const tone = (type, freq, when, dur, vol, dest = bus, lp = 3000) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    o.type = type;
    o.frequency.value = freq;
    f.type = "lowpass";
    f.frequency.value = lp;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vol, when + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(f).connect(g).connect(dest);
    o.start(when);
    o.stop(when + dur + 0.05);
  };

  const pluck = (freq, when, vol = 0.16) => {
    tone("triangle", freq, when, 1.6, vol, bus, 2600);
    tone("sine", freq * 2, when, 0.9, vol * 0.4);
    tone("sine", freq * 3.01, when, 0.4, vol * 0.15);
  };
  const droneNote = (freq, when) => {
    for (const det of [-4, 4]) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const f = ctx.createBiquadFilter();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.detune.value = det;
      f.type = "lowpass";
      f.frequency.value = 700;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(0.045, when + 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 4.2);
      o.connect(f).connect(g).connect(bus);
      o.start(when);
      o.stop(when + 4.3);
    }
  };

  let timer = null;
  let nextTime = 0;
  let step = 0; // eighth-note counter
  let droneAt = 0;
  let droneN = 0;
  const DRONE = [freqOf(-3) / 2, freqOf(-5), freqOf(-5), freqOf(-5)]; // Pa Sa Sa Sa

  const schedule = () => {
    while (nextTime < ctx.currentTime + 0.4) {
      const phrase = PHRASES[ORDER[Math.floor(step / 16) % ORDER.length]];
      const deg = phrase[step % 16];
      if (deg !== null) pluck(freqOf(deg), nextTime);
      if (step % 16 === 15) {
        // bell at the end of each phrase
        tone("sine", freqOf(10), nextTime + EIGHTH, 2.5, 0.05);
        tone("sine", freqOf(10) * 2.76, nextTime + EIGHTH, 1.2, 0.02);
      }
      nextTime += EIGHTH;
      step++;
    }
    while (droneAt < ctx.currentTime + 0.4) {
      droneNote(DRONE[droneN % 4], droneAt);
      droneAt += 1.7;
      droneN++;
    }
  };

  const onVis = () => (document.hidden ? ctx.suspend() : ctx.resume());
  document.addEventListener("visibilitychange", onVis);

  return {
    /** (Re)start the song with a fade-in. */
    start() {
      ctx.resume();
      clearInterval(timer);
      step = 0;
      droneN = 0;
      nextTime = droneAt = ctx.currentTime + 0.3;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 3);
      timer = setInterval(schedule, 100);
      schedule();
    },
    stop() {
      clearInterval(timer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    },
    destroy() {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
      ctx.close();
    },
    /** Flame catching: rising whoosh with a low thump. */
    ignite() {
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noise;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.Q.value = 0.8;
      f.frequency.setValueAtTime(250, t);
      f.frequency.exponentialRampToValueAtTime(2400, t + 1.4);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.35, t + 0.9);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      src.connect(f).connect(g).connect(bus);
      src.start(t);
      src.stop(t + 2.3);
      tone("sine", 70, t, 1.2, 0.3);
    },
    /** Tiny ember crackle. */
    pop() {
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = noise;
      const f = ctx.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = 1500 + Math.random() * 3000;
      const g = ctx.createGain();
      const v = 0.04 + Math.random() * 0.06;
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(
        0.0001,
        t + 0.03 + Math.random() * 0.04
      );
      src.connect(f).connect(g).connect(bus);
      src.start(t, Math.random() * 1.5, 0.12);
    },
    /** Glowing burst: sparkle chime. */
    sparkle() {
      const t = ctx.currentTime;
      [0, 2, 4, 5, 7].forEach((d, i) =>
        tone("sine", freqOf(d + 10), t + i * 0.06, 1.4, 0.05)
      );
    },
  };
}
