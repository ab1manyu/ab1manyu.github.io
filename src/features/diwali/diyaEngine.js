/**
 * Animated ASCII Diwali diya — JavaScript port of the original Python/numpy
 * terminal animation. `createDiya(W, H, opts)` returns `frame(t, dt)` which
 * yields per-cell glyph + colour indices for a W x H character grid.
 */
const TAU = Math.PI * 2;

const FIRE_STOPS = [
  [0.0, [24, 2, 2]],
  [0.14, [92, 6, 8]],
  [0.3, [160, 22, 10]],
  [0.46, [214, 62, 8]],
  [0.62, [255, 112, 10]],
  [0.76, [255, 168, 24]],
  [0.88, [255, 218, 70]],
  [1.0, [255, 248, 214]],
];
const ACCENT_STOPS = [
  [0.0, [0, 24, 80]],
  [0.4, [0, 96, 235]],
  [0.75, [0, 215, 255]],
  [1.0, [200, 255, 255]],
];
const FIRE_STEPS = 48;
const ACCENT_STEPS = 20;
const ACCENT_BASE = 1 + FIRE_STEPS;
const LEVEL_GROUPS = [".,", ":;", "+*", "xX#", "%@"];
const LEVEL_EDGES = [0.07, 0.2, 0.36, 0.58, 0.8];
const EDGE_MIN = LEVEL_EDGES[0];

function buildRamp(stops, steps) {
  const out = [];
  for (let i = 0; i < steps; i++) {
    const x = i / (steps - 1);
    let j = 0;
    while (j < stops.length - 2 && x > stops[j + 1][0]) j++;
    const [p0, c0] = stops[j];
    const [p1, c1] = stops[j + 1];
    const f = Math.min(1, Math.max(0, (x - p0) / (p1 - p0)));
    out.push(c0.map((v, k) => Math.round(v + (c1[k] - v) * f)));
  }
  return out;
}
/** index 0 = blank, 1..48 fire, 49..68 accent */
export const COLORS = [
  "#000",
  ...buildRamp(FIRE_STOPS, FIRE_STEPS).map((c) => `rgb(${c})`),
  ...buildRamp(ACCENT_STOPS, ACCENT_STEPS).map((c) => `rgb(${c})`),
];

// ---- helpers --------------------------------------------------------------
const clip = (x, a, b) => (x < a ? a : x > b ? b : x);
function smoothstep(e0, e1, x) {
  const t = clip((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
function flow(a, b, t) {
  return (
    (Math.sin(a * 1.7 + b * 1.1 + t * 1.9) +
      Math.sin(a * 3.3 - b * 2.1 - t * 2.7 + 1.3) +
      Math.sin(a * 5.9 + b * 3.7 + t * 3.9 + 2.1)) /
    3
  );
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeRng(seed) {
  const r = mulberry32(seed);
  return {
    random: r,
    uniform: (a, b) => a + (b - a) * r(),
    normal: (m = 0, s = 1) =>
      m + s * Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(TAU * r()),
    int: (n) => Math.floor(r() * n),
    poisson: (l) => {
      const L = Math.exp(-l);
      let k = 0;
      let p = 1;
      do {
        k++;
        p *= r();
      } while (p > L && k < 50);
      return k - 1;
    },
  };
}

function shade(h, k, accent) {
  let lvl = 0;
  while (lvl < 5 && h >= LEVEL_EDGES[lvl]) lvl++;
  let glyph = "";
  if (lvl > 0) {
    const g = LEVEL_GROUPS[lvl - 1];
    glyph = g[k % g.length];
  }
  const col = accent
    ? ACCENT_BASE + Math.floor(clip(h * 1.15, 0, 1) * (ACCENT_STEPS - 1) + 0.5)
    : 1 + Math.floor(clip(h, 0, 1) * (FIRE_STEPS - 1) + 0.5);
  return [glyph, col];
}

// ---- diya geometry --------------------------------------------------------
const Y_RIM = -0.2;
const R = 0.78;
const D = 0.46;
const P = 2.1;
const RIM_B = 0.1;
const FOOT_TOP = -0.64;
const FOOT_BOT = -0.77;
const Y_WICK = Y_RIM + 0.02;

function evaluate(X, Y) {
  const ax = Math.abs(X);
  const below = Y <= Y_RIM;
  const g = (ax / R) ** P + (Math.max(Y_RIM - Y, 0) / D) ** 2;
  const body = below && g <= 1;
  const ell = (ax / (0.98 * R)) ** 1.8 + ((Y - Y_RIM) / RIM_B) ** 2;
  const rim = ell <= 1;
  const footT = clip((FOOT_TOP - Y) / (FOOT_TOP - FOOT_BOT), 0, 1);
  const footHw = 0.22 + 0.15 * footT ** 1.6;
  const foot = Y <= FOOT_TOP && Y >= FOOT_BOT && ax <= footHw;
  const inside = body || rim || foot;

  const ybot = Y_RIM - D;
  const v = clip((Y - ybot) / D, 0, 1);
  let heat = 0.4 + 0.34 * v ** 1.2 + 0.12 * v * Math.exp(-((X / 0.5) ** 2));
  const hl1 = Math.exp(
    -(((X + 0.42 * R) / 0.22) ** 2 + ((Y - (Y_RIM - 0.14)) / 0.06) ** 2)
  );
  const hl2 = Math.exp(
    -(((X - 0.5 * R) / 0.15) ** 2 + ((Y - (Y_RIM - 0.2)) / 0.045) ** 2)
  );
  heat += 0.4 * hl1 + 0.18 * hl2;
  const yb = Y_RIM - 0.21;
  const m = (((X / 0.105) % 1) + 1) % 1;
  if (Math.abs(Y - yb) < 0.026 && Math.abs(m - 0.5) < 0.21 && g < 0.72)
    heat = 0.92;
  if (Math.abs(Y - (yb + 0.075)) < 0.011 && g < 0.85) heat *= 0.55;
  if (foot && !body) heat = 0.3 + 0.28 * (1 - footT);
  if (rim && ell > 0.6) heat = below ? 0.9 : 0.55;
  const oil = rim && ell <= 0.6;
  if (oil) heat = 0.8 + 0.18 * Math.exp(-((X / 0.2) ** 2));

  const edgeB = below ? Math.exp(-(((g - 0.93) / 0.14) ** 2)) : 0;
  const edgeE = Math.exp(-(((ell - 0.85) / 0.2) ** 2));
  const weight = inside
    ? 0.3 + 0.7 * Math.max(edgeB, edgeE, foot ? 0.6 : 0)
    : 0;
  return { inside, heat: inside ? heat : 0, oil, weight };
}

class DiyaShape {
  constructor(W, H, rng) {
    this.W = W;
    this.H = H;
    this.unit = Math.max(4, Math.min(H / 2, W / 4)) * 0.97;
    this.cx = (W - 1) / 2;
    this.cy = (H - 1) / 2;
    const N = W * H;
    this.X = new Float64Array(N);
    this.Y = new Float64Array(N);
    this.r1 = new Float64Array(N);
    this.r2 = new Float64Array(N);
    this.r3 = new Float64Array(N);
    this.phase = new Float64Array(N);
    this.rate = new Float64Array(N);
    this.rate2 = new Float64Array(N);
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const i = r * W + c;
        this.X[i] = ((c - this.cx) * 0.5) / this.unit;
        this.Y[i] = (this.cy - r) / this.unit;
      }
    }
    for (let i = 0; i < N; i++) this.r1[i] = rng.random();
    for (let i = 0; i < N; i++) this.r2[i] = rng.random();
    for (let i = 0; i < N; i++) this.r3[i] = rng.random();
    for (let i = 0; i < N; i++) this.phase[i] = rng.uniform(0, TAU);
    for (let i = 0; i < N; i++) this.rate[i] = rng.uniform(1.5, 7);
    for (let i = 0; i < N; i++) this.rate2[i] = rng.uniform(0.7, 3.2);

    this.inside = new Uint8Array(N);
    const heat = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const e = evaluate(this.X[i], this.Y[i]);
      this.inside[i] = e.inside ? 1 : 0;
      heat[i] = e.heat;
    }
    this.buildEdges();
    this.bowlHeat = new Float64Array(N);
    this.glow = new Float64Array(N);
    this.rv = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      this.bowlHeat[i] = this.inside[i]
        ? this.edge[i]
          ? 0.24 + 0.36 * heat[i]
          : heat[i]
        : 0;
      const X = this.X[i];
      const Y = this.Y[i];
      this.glow[i] = Math.exp(-((X / 0.8) ** 2 + ((Y - 0.1) / 0.85) ** 2));
      const dist = Math.hypot(X * 0.85, Y + 0.15) / 1.05;
      this.rv[i] = 0.65 * clip(dist, 0, 1.3) + 0.35 * this.r1[i];
    }
  }

  buildEdges() {
    const { W, H, inside } = this;
    const at = (a, r, c) =>
      r < 0 || c < 0 || r >= H || c >= W ? 0 : a[r * W + c];
    this.edge = new Uint8Array(W * H);
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        if (!inside[r * W + c]) continue;
        const eroded =
          at(inside, r - 1, c) &&
          at(inside, r + 1, c) &&
          at(inside, r, c - 1) &&
          at(inside, r, c + 1);
        this.edge[r * W + c] = eroded ? 0 : 1;
      }
    }
    const blur = (a) => {
      const o = new Float64Array(W * H);
      for (let r = 0; r < H; r++) {
        for (let c = 0; c < W; c++) {
          o[r * W + c] =
            (4 * at(a, r, c) +
              2 *
                (at(a, r - 1, c) +
                  at(a, r + 1, c) +
                  at(a, r, c - 1) +
                  at(a, r, c + 1)) +
              (at(a, r - 1, c - 1) +
                at(a, r - 1, c + 1) +
                at(a, r + 1, c - 1) +
                at(a, r + 1, c + 1))) /
            16;
        }
      }
      return o;
    };
    const s = blur(blur(Float64Array.from(inside)));
    const grad = (r, c, dr, dc) => {
      const r0 = r - dr;
      const c0 = c - dc;
      const r1 = r + dr;
      const c1 = c + dc;
      const lo = r0 < 0 || c0 < 0;
      const hi = r1 >= H || c1 >= W;
      const a = lo ? r : r0;
      const b = lo ? c : c0;
      const a2 = hi ? r : r1;
      const b2 = hi ? c : c1;
      const span = a2 - a + (b2 - b);
      return span === 0 ? 0 : (s[a2 * W + b2] - s[a * W + b]) / span;
    };
    this.edgeGlyph = new Array(W * H).fill("|");
    this.edgeSel = new Uint8Array(W * H);
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const i = r * W + c;
        const gy = grad(r, c, 1, 0);
        const gx = grad(r, c, 0, 1);
        const th = ((Math.atan2(2 * gx, gy) % Math.PI) + Math.PI) % Math.PI;
        const top = gy > 0;
        let g = "|";
        if (th < Math.PI / 8 || th >= (7 * Math.PI) / 8) g = top ? "-" : "_";
        else if (th < (3 * Math.PI) / 8) g = "/";
        else if (th >= (5 * Math.PI) / 8) g = "\\";
        this.edgeGlyph[i] = g;
        this.edgeSel[i] = this.edge[i] && this.r3[i] < 0.88 ? 1 : 0;
      }
    }
  }

  toCell(X, Y) {
    return [
      Math.round(this.cy - this.unit * Y),
      Math.round(this.cx + 2 * this.unit * X),
    ];
  }

  sampleBowl(n, rng) {
    const xs = [];
    const ys = [];
    const hs = [];
    while (xs.length < n) {
      const X = rng.uniform(-R * 1.02, R * 1.02);
      const Y = rng.uniform(FOOT_BOT, Y_RIM + RIM_B);
      const e = evaluate(X, Y);
      if (rng.random() < e.weight) {
        xs.push(X);
        ys.push(Y);
        hs.push(e.heat);
      }
    }
    return [xs, ys, hs];
  }
}

// ---- flame ----------------------------------------------------------------
class Fire {
  constructor() {
    this.H0 = 0.98;
    this.W0 = 0.2;
    this.y0 = Y_WICK;
    this.burst = 0;
  }
  height(t, grow) {
    const f =
      1 +
      0.055 * Math.sin(TAU * 1.9 * t + 0.5) +
      0.04 * Math.sin(TAU * 3.7 * t + 1.7) +
      0.025 * Math.sin(TAU * 7.3 * t + 0.2);
    return this.H0 * grow * f * (1 + 0.1 * this.burst);
  }
  sway(s, t, grow) {
    const sc = clip(s, 0, 1);
    return (
      grow *
      sc ** 1.5 *
      (0.05 * Math.sin(TAU * 0.55 * t + 2.4 * sc) +
        0.032 * Math.sin(TAU * 1.35 * t + 4.3 * sc + 1) +
        0.016 * Math.sin(TAU * 3.1 * t + 7 * sc + 2))
    );
  }
  halfWidth(s, t, grow) {
    const sc = clip(s, 0, 1);
    const body = Math.max(Math.sin(Math.PI * sc ** 0.62), 0) ** 0.9;
    const wob = 1 + 0.14 * flow(sc * 3, 0, t * 2.3);
    return Math.max(this.W0 * grow ** 0.8 * body * wob, 0.01);
  }
  profile(u, s) {
    const sc = clip(s, 0, 1);
    const body = Math.exp(-((u / 0.98) ** 4));
    const halo = Math.exp(-((u / 1.7) ** 2));
    const core = Math.exp(-((u / 0.5) ** 2)) * (1 - 0.75 * sc);
    return (0.74 * body + 0.2 * halo + 0.34 * core) * (1 - 0.25 * sc ** 2);
  }
  place(s, u, t, grow) {
    return [
      this.sway(s, t, grow) + u * this.halfWidth(s, t, grow),
      this.y0 + s * this.height(t, grow),
    ];
  }
  field(sh, t, grow, energy, out) {
    const hf = Math.max(this.height(t, grow), 1e-3);
    for (let i = 0; i < out.length; i++) {
      const X = sh.X[i];
      const Y = sh.Y[i];
      const s = (Y - this.y0) / hf;
      const sc = clip(s, 0, 1);
      const w = this.halfWidth(sc, t, grow);
      let u = Math.abs(X - this.sway(sc, t, grow)) / w;
      u *= 1 + 0.22 * flow(X * 6, Y * 6.5 - t * 2.6, t * 1.3);
      const heat = this.profile(u, sc);
      const env = smoothstep(-0.03, 0.1, s) * (1 - smoothstep(0.93, 1.12, s));
      const bands = 0.88 + 0.12 * flow(X * 4.5, Y * 9 - t * 4.2, t * 0.7);
      out[i] = clip(heat * env * bands * energy, 0, 1);
    }
  }
}

// ---- particles ------------------------------------------------------------
class Particles {
  constructor(shape, fire, opts, rng) {
    this.shape = shape;
    this.fire = fire;
    this.rng = rng;
    const cells = shape.W * shape.H;
    const d = Math.max(opts.density, 0.05);
    const nA = Math.floor(0.14 * cells * d);
    const nB = Math.floor(0.1 * cells * d);
    const nC = Math.floor(0.3 * cells * d);
    const nS = Math.floor(0.045 * cells * d) + 24;
    const n = nA + nB + nC;
    this.n = n;
    this.nS = nS;
    this.nA = nA;
    this.nB = nB;
    this.nC = nC;
    const arr = (f) => Array.from({ length: n }, f);
    this.scx = arr(() => clip(rng.normal(), -2.4, 2.4) * 0.75);
    this.scy = arr(() => clip(rng.normal(), -2.4, 2.4) * 0.55);
    this.appear = arr(() => rng.random());
    this.delay = arr(() => rng.random());
    this.intensity = arr(() => 0.55 + 0.45 * rng.random());
    this.flick = arr(() => rng.uniform(1.5, 9));
    this.phase = arr(() => rng.uniform(0, TAU));
    this.accent = new Array(n).fill(false);

    [this.bowlHx, this.bowlHy, this.bowlHeat] = shape.sampleBowl(nA, rng);
    for (let i = 0; i < nA; i++)
      this.accent[i] = rng.random() < 0.02 * opts.accent;

    this.fs = [];
    this.fu = [];
    while (this.fs.length < nB) {
      const c = rng.random();
      if (rng.random() < Math.sqrt(Math.max(Math.sin(Math.PI * c ** 0.62), 0)))
        this.fs.push(c);
    }
    for (let i = 0; i < nB; i++) {
      const u = clip(rng.normal(0, 0.55), -1.5, 1.5);
      this.fu.push(u);
      this.accent[nA + i] =
        Math.abs(u) > 1 && rng.random() < 0.35 * opts.accent;
    }

    this.ambHx = [];
    this.ambHy = [];
    this.beh = [];
    this.behRate = [];
    for (let i = 0; i < nC; i++) {
      const r = Math.abs(rng.normal()) * 0.44;
      const a = rng.uniform(0, TAU);
      this.ambHx.push(r * Math.cos(a) * 1.35);
      this.ambHy.push(0.06 + r * Math.sin(a) * 0.95);
      this.beh.push(rng.int(4));
      this.behRate.push(rng.uniform(0.08, 0.35));
      this.accent[nA + nB + i] = rng.random() < 0.09 * opts.accent;
    }

    this.opts = opts;
    const z = () => new Float64Array(nS);
    this.sx = z();
    this.sy = z();
    this.svx = z();
    this.svy = z();
    this.sLife = z();
    this.sMax = new Float64Array(nS).fill(1);
    this.sInt = new Float64Array(nS).fill(1);
    this.sAcc = new Array(nS).fill(false);
    this.sRate = Float64Array.from({ length: nS }, () => rng.uniform(2, 8));
    this.sPh = Float64Array.from({ length: nS }, () => rng.uniform(0, TAU));
    this.sparkRate = nS / 1.8;
  }

  emitSparks(count, t, grow, strength = 1) {
    const rng = this.rng;
    let done = 0;
    for (let i = 0; i < this.nS && done < count; i++) {
      if (this.sLife[i] > 0) continue;
      done++;
      const [x, y] = this.fire.place(
        rng.uniform(0.05, 0.7),
        rng.normal(0, 0.55),
        t,
        grow
      );
      const life = rng.uniform(0.9, 2.8) * (0.8 + 0.4 * strength);
      this.sx[i] = x;
      this.sy[i] = y;
      this.svx[i] = rng.normal(0, 0.035 * strength);
      this.svy[i] = rng.uniform(0.1, 0.5) * strength;
      this.sLife[i] = life;
      this.sMax[i] = life;
      this.sInt[i] = rng.uniform(0.75, 1);
      this.sAcc[i] = rng.random() < 0.07 * this.opts.accent;
    }
  }

  updateSparks(t, dt, ctl) {
    for (let i = 0; i < this.nS; i++) {
      this.sLife[i] = Math.max(this.sLife[i] - dt, -1);
      this.sx[i] +=
        (this.svx[i] +
          0.045 * Math.sin(TAU * this.sRate[i] * t + this.sPh[i])) *
        dt;
      this.sy[i] += this.svy[i] * dt;
      this.svx[i] *= Math.max(0, 1 - 0.25 * dt);
    }
    if (ctl.stage >= 4 && ctl.flameGrow > 0.3) {
      const n = this.rng.poisson(this.sparkRate * ctl.flameGrow ** 2 * dt);
      if (n) this.emitSparks(n, t, ctl.flameGrow);
    }
  }

  render(t, dt, ctl, heatBuf, varBuf, accBuf) {
    const sh = this.shape;
    const { W, H } = sh;
    heatBuf.fill(0);
    varBuf.fill(0);
    accBuf.fill(false);
    if (ctl.stage < 2) return;
    this.updateSparks(t, dt, ctl);

    const { nA, nB, nC } = this;
    const put = (X, Y, h, v, a) => {
      if (h <= EDGE_MIN) return;
      const [r, c] = sh.toCell(X, Y);
      if (r < 0 || r >= H || c < 0 || c >= W) return;
      const i = r * W + c;
      if (h >= heatBuf[i]) {
        heatBuf[i] = h;
        varBuf[i] = v;
        accBuf[i] = a;
      }
    };

    const accOn = ctl.accentGain > 0.5;
    for (let p = 0; p < this.n; p++) {
      const ph = this.phase[p];
      const k = smoothstep(
        0,
        1,
        clip((ctl.structure - 0.6 * this.delay[p]) / 0.4, 0, 1)
      );
      const sx =
        this.scx[p] * ctl.radius + 0.006 * Math.sin(TAU * 0.7 * t + ph);
      const sy =
        this.scy[p] * ctl.radius + 0.006 * Math.cos(TAU * 0.6 * t + ph);
      const d = Math.hypot(sx, sy * 1.3);
      const scat =
        (0.1 +
          ctl.coreHeat * Math.exp(-((d / (0.22 + 0.55 * ctl.radius)) ** 2))) *
        this.intensity[p];

      let hx;
      let hy;
      let home;
      if (p < nA) {
        hx =
          this.bowlHx[p] +
          0.01 * Math.sin(TAU * 0.31 * t + 3.1 * this.bowlHy[p] + ph);
        hy = this.bowlHy[p] + 0.006 * Math.cos(TAU * 0.27 * t + ph);
        home =
          this.bowlHeat[p] *
          (0.8 + 0.2 * Math.sin(TAU * this.flick[p] * 0.4 * t + ph));
      } else if (p < nA + nB) {
        const j = p - nA;
        [hx, hy] = this.fire.place(this.fs[j], this.fu[j], t, ctl.flameGrow);
        home =
          this.fire.profile(Math.abs(this.fu[j]), this.fs[j]) *
          (0.8 + 0.2 * this.intensity[p]);
      } else {
        const j = p - nA - nB;
        const beh = this.beh[j];
        const br = this.behRate[j];
        const risePh = (((t * br * 0.5 + ph / TAU) % 1) + 1) % 1;
        const drift = beh === 1 ? 0.07 * Math.sin(TAU * br * t + ph) : 0;
        const rise = beh === 2 ? risePh * 0.55 : 0;
        hx =
          this.ambHx[j] +
          0.014 * Math.sin(TAU * 0.31 * t + 3.1 * this.ambHy[j] + ph) +
          drift;
        hy =
          this.ambHy[j] +
          0.011 * Math.cos(TAU * 0.27 * t + 2.3 * this.ambHx[j] + ph) +
          rise;
        const illum = Math.exp(-((hx / 0.95) ** 2 + ((hy - 0.12) / 0.9) ** 2));
        let mod = 1;
        if (beh === 2) mod = (1 - risePh) ** 0.7 * smoothstep(0, 0.06, risePh);
        else if (beh === 3)
          mod = 0.25 + 0.75 * Math.max(0, Math.sin(TAU * br * t + ph)) ** 3;
        home =
          (0.14 + 0.52 * illum) *
          this.intensity[p] *
          mod *
          (0.4 + 0.6 * ctl.glowGain);
      }
      void nC;

      const x = sx * (1 - k) + hx * k;
      const y = sy * (1 - k) + hy * k;
      let heat = scat * (1 - k) + home * k;
      const vis = clip((ctl.gain - this.appear[p]) * 20, 0, 1);
      const raw = 0.5 + 0.5 * Math.sin(TAU * this.flick[p] * t + ph);
      const fl =
        1 - ctl.flickDepth + ctl.flickDepth * smoothstep(0.15, 0.4, raw);
      heat *= vis * fl;
      const v = Math.floor(t * this.flick[p] * 0.35 + ph) & 3;
      put(x, y, heat, v, this.accent[p] && accOn);
    }

    for (let i = 0; i < this.nS; i++) {
      if (this.sLife[i] <= 0) continue;
      const shp = clip(this.sLife[i] / this.sMax[i], 0, 1) ** 0.85;
      const h =
        this.sInt[i] *
        shp *
        (0.82 + 0.18 * Math.sin(TAU * this.sRate[i] * t + this.sPh[i]));
      const v = Math.floor(t * this.sRate[i] * 0.5 + this.sPh[i]) & 3;
      put(this.sx[i], this.sy[i], h, v, this.sAcc[i]);
    }
  }
}

// ---- controller -----------------------------------------------------------
const STAGE_ENDS = [1, 4, 8.5, 15];

function controls(bounds, t) {
  const [b0, b1, b2, b3] = bounds;
  const c = {
    stage: 1,
    gain: 0,
    radius: 0.05,
    structure: 0,
    flameGrow: 0.12,
    fieldGain: 0,
    glowGain: 0,
    accentGain: 0,
    coreHeat: 0.55,
    flickDepth: 0.95,
    alive: false,
  };
  if (t < b0) return c;
  if (t < b1) {
    const e = smoothstep(0, 1, (t - b0) / (b1 - b0));
    c.stage = 2;
    c.gain = 0.002 + 0.028 * e;
    c.radius = 0.05 + 0.1 * e;
    c.coreHeat = 0.5 + 0.12 * e;
  } else if (t < b2) {
    const p = (t - b1) / (b2 - b1);
    const e = smoothstep(0, 1, p);
    c.stage = 3;
    c.gain = 0.03 + 0.72 * p ** 1.5;
    c.radius = 0.15 + 0.85 * e;
    c.structure = 0.34 * e;
    c.coreHeat = 0.62 + 0.3 * e;
    c.glowGain = 0.3 * smoothstep(0.4, 1, p);
    c.accentGain = p;
    c.flickDepth = 0.95 - 0.1 * p;
  } else if (t < b3) {
    const p = (t - b2) / (b3 - b2);
    const e = smoothstep(0, 1, p);
    c.stage = 4;
    c.gain = 0.75 + 0.25 * e;
    c.radius = 1;
    c.structure = 0.34 + 0.8 * e;
    c.flameGrow = 0.12 + 0.88 * smoothstep(0.05, 0.95, p);
    c.fieldGain = smoothstep(0.25, 1, p);
    c.glowGain = 0.3 + 0.7 * e;
    c.accentGain = 1;
    c.coreHeat = 0.95;
    c.flickDepth = 0.85 - 0.5 * e;
  } else {
    Object.assign(c, {
      stage: 5,
      gain: 1,
      radius: 1,
      structure: 1.14,
      flameGrow: 1,
      fieldGain: 1,
      glowGain: 1,
      accentGain: 1,
      coreHeat: 0.95,
      flickDepth: 0.35,
      alive: true,
    });
  }
  return c;
}

/**
 * @param {number} W grid columns
 * @param {number} H grid rows
 * @param {{seed?:number,intro?:number,density?:number,glow?:number,accent?:number}} [options]
 * @returns {(t:number, dt:number) => {glyphs:string[], colors:Uint8Array, burst:number}}
 */
export function createDiya(W, H, options = {}) {
  const opts = {
    intro: 1,
    density: 1,
    glow: 1,
    accent: 1,
    seed: 1,
    ...options,
  };
  const rng = makeRng(opts.seed);
  const bounds = STAGE_ENDS.map((e) => e * Math.max(opts.intro, 0.05));
  const shape = new DiyaShape(W, H, rng);
  const fire = new Fire();
  const parts = new Particles(shape, fire, opts, rng);
  const N = W * H;
  const flame = new Float64Array(N);
  const hp = new Float64Array(N);
  const vp = new Int32Array(N);
  const ap = new Array(N).fill(false);
  const glyphs = new Array(N).fill("");
  const colors = new Uint8Array(N);
  let burst = 0;

  return function frame(t, dt) {
    const ctl = controls(bounds, t);
    glyphs.fill("");
    colors.fill(0);
    if (ctl.stage < 2) return { glyphs, colors, burst };

    burst *= Math.exp(-dt / 0.55);
    if (ctl.alive && rng.random() < 0.3 * dt) {
      burst = 1;
      parts.emitSparks(
        Math.max(8, Math.floor(0.1 * parts.nS)),
        t,
        ctl.flameGrow,
        1.5
      );
    }
    fire.burst = burst;
    const energy = 1 + 0.16 * burst;
    const flick =
      0.9 +
      0.05 * Math.sin(TAU * 3.3 * t + 1) +
      0.03 * Math.sin(TAU * 7.9 * t) +
      0.02 * Math.sin(TAU * 13.1 * t + 2);
    fire.field(shape, t, ctl.flameGrow, energy, flame);
    const light = clip(flick + 0.1 * burst, 0.8, 1.15);
    parts.render(t, dt, ctl, hp, vp, ap);

    for (let i = 0; i < N; i++) {
      const shimmer =
        0.84 + 0.16 * Math.sin(t * shape.rate[i] + shape.phase[i]);
      const bowl = shape.bowlHeat[i] * light * shimmer;
      const rev = clip((ctl.fieldGain * 1.35 - shape.rv[i]) / 0.22, 0, 1);
      let field = Math.max(flame[i], bowl) * rev;
      field *=
        0.92 + 0.08 * Math.sin(t * shape.rate[i] * 1.3 + shape.phase[i] * 2);

      const g =
        shape.glow[i] *
        ctl.glowGain *
        opts.glow *
        (0.82 + 0.18 * flick + 0.25 * burst);
      const tw = 0.5 + 0.5 * Math.sin(t * shape.rate2[i] + shape.phase[i]);
      const glowH =
        shape.r2[i] < clip(g * 1.25, 0, 1) ? g * 0.4 * (0.4 + 0.75 * tw) : 0;
      field = Math.max(field, glowH);

      const accF =
        shape.r3[i] > 1 - 0.02 * opts.accent &&
        g > 0.1 &&
        tw > 0.8 &&
        field < 0.3;
      if (accF) field = 0.3 + 0.5 * tw;

      const varF = Math.floor(t * shape.rate[i] + shape.phase[i] * 2) & 3;
      const useP = hp[i] > field;
      const heat = useP ? hp[i] : field;
      const [gl, col] = shade(heat, useP ? vp[i] : varF, useP ? ap[i] : accF);
      let ch = gl;
      if (shape.edgeSel[i] && !useP && rev > 0.5 && ch !== "")
        ch = shape.edgeGlyph[i];
      glyphs[i] = ch;
      colors[i] = ch ? col : 0;
    }
    return { glyphs, colors, burst };
  };
}
