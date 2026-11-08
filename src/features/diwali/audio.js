/**
 * Diwali page audio:
 * - Music (`start` / `stop`): plays a compressed, 8-bit / pixelated clip of
 *   "Mere Tumhare Sabke Liye Happy Diwali", controlled by the Volume button.
 * - Fireworks (`boom`): plays a random explosion effect from `./firework/`,
 *   routed independently of the music volume toggle.
 */
const SONG_URL = "/diwali/happy-diwali.mp3";
const FIREWORK_URLS = Object.values(
  import.meta.glob("./firework/*", {
    eager: true,
    query: "?url",
    import: "default",
  })
);

/** Build a stair-step quantization curve for an 8-bit / pixelated crunch. */
function makeBitcrushCurve(steps = 24) {
  const n = 4096;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / (n - 1) - 1;
    curve[i] = Math.round(x * steps) / steps;
  }
  return curve;
}

/** Quantize sample rate (sample-and-hold) in-place for pixelated time steps. */
function pixelateBuffer(buffer, holdSamples = 3, steps = 32) {
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    let held = 0;
    for (let i = 0; i < data.length; i++) {
      if (i % holdSamples === 0) {
        held = Math.round(data[i] * steps) / steps;
      }
      data[i] = held;
    }
  }
  return buffer;
}

export function createAudio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  ctx.resume().catch(() => {});

  // Music master gain (controlled by Volume ON / OFF)
  const musicMaster = ctx.createGain();
  musicMaster.gain.value = 0;
  musicMaster.connect(ctx.destination);

  // Separate SFX bus for firework explosions (always audible, independent of music toggle)
  const sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.9;
  sfxBus.connect(ctx.destination);

  // 8-bit / chiptune speaker chain for the song clip
  const songShaper = ctx.createWaveShaper();
  songShaper.curve = makeBitcrushCurve(24);
  songShaper.oversample = "none";

  const songHp = ctx.createBiquadFilter();
  songHp.type = "highpass";
  songHp.frequency.value = 180;

  const songLp = ctx.createBiquadFilter();
  songLp.type = "lowpass";
  songLp.frequency.value = 4200;

  const songGain = ctx.createGain();
  songGain.gain.value = 0.65;
  songShaper
    .connect(songHp)
    .connect(songLp)
    .connect(songGain)
    .connect(musicMaster);

  let songBuffer = null;
  let songPromise = null;
  let songSrc = null;
  let playing = false;
  let stopTimer = null;

  const fireworkBuffers = [];
  for (const url of FIREWORK_URLS) {
    fetch(url)
      .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject()))
      .then((arr) => ctx.decodeAudioData(arr))
      .then((buf) => fireworkBuffers.push(buf))
      .catch(() => {});
  }

  const loadSong = () => {
    if (songBuffer) return Promise.resolve(songBuffer);
    songPromise ??= fetch(SONG_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${SONG_URL}`);
        return res.arrayBuffer();
      })
      .then((arr) => ctx.decodeAudioData(arr))
      .then((buf) => {
        songBuffer = pixelateBuffer(buf, 3, 32);
        return songBuffer;
      })
      .catch(() => null);
    return songPromise;
  };

  const stopSource = () => {
    if (!songSrc) return;
    try {
      songSrc.stop();
      songSrc.disconnect();
    } catch {
      // ignore if already stopped
    }
    songSrc = null;
  };

  const UNLOCK_EVENTS = ["pointerdown", "click", "keydown", "touchstart"];
  const unlock = () => {
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
  };
  for (const ev of UNLOCK_EVENTS) {
    window.addEventListener(ev, unlock, { capture: true, passive: true });
  }

  const onVis = () => (document.hidden ? ctx.suspend() : ctx.resume());
  document.addEventListener("visibilitychange", onVis);

  return {
    /** (Re)start the song with a fade-in. */
    start() {
      unlock();
      playing = true;
      clearTimeout(stopTimer);
      stopSource();
      musicMaster.gain.cancelScheduledValues(ctx.currentTime);
      musicMaster.gain.setValueAtTime(0.0001, ctx.currentTime);
      musicMaster.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.2);
      loadSong().then((buf) => {
        if (!playing || !buf || songSrc || ctx.state === "closed") return;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        src.connect(songShaper);
        src.start(0);
        songSrc = src;
      });
    },
    stop() {
      playing = false;
      clearTimeout(stopTimer);
      musicMaster.gain.cancelScheduledValues(ctx.currentTime);
      musicMaster.gain.setValueAtTime(musicMaster.gain.value, ctx.currentTime);
      musicMaster.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      stopTimer = setTimeout(stopSource, 320);
    },
    destroy() {
      playing = false;
      clearTimeout(stopTimer);
      stopSource();
      for (const ev of UNLOCK_EVENTS) {
        window.removeEventListener(ev, unlock, { capture: true });
      }
      document.removeEventListener("visibilitychange", onVis);
      ctx.close();
    },
    /** Play a random firework explosion sound from `./firework/`. pan -1..1 */
    boom(pan = 0) {
      if (ctx.state === "closed") return;
      if (ctx.state !== "running") {
        unlock();
        if (
          navigator.userActivation &&
          !navigator.userActivation.hasBeenActive
        ) {
          return;
        }
      }
      if (fireworkBuffers.length > 0) {
        const buf =
          fireworkBuffers[Math.floor(Math.random() * fireworkBuffers.length)];
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const out = ctx.createStereoPanner();
        out.pan.value = Math.max(-1, Math.min(1, pan));
        src.connect(out).connect(sfxBus);
        src.start(0);
      } else if (FIREWORK_URLS.length > 0) {
        const url =
          FIREWORK_URLS[Math.floor(Math.random() * FIREWORK_URLS.length)];
        const el = new Audio(url);
        el.volume = 0.9;
        el.play().catch(() => {});
      }
    },
  };
}
