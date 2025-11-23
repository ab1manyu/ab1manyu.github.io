document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initRadar();
  initLoader();
  initScrollSpy();
  initMatrixRain();
});

function updateClock() {
  const now = new Date();

  // This forces the time to Mountain Time (Denver)
  const timeString = now.toLocaleTimeString("en-US", {
    timeZone: "America/Denver",
    hour12: false, // Keeps 24-hour military format
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const clockEl = document.getElementById("military-clock");
  if (clockEl) clockEl.textContent = timeString + " MST";
}
setInterval(updateClock, 1000);
updateClock();

function initRadar() {
  const radarBtn = document.getElementById("radar-trigger");
  const radarPulse = document.getElementById("radar-pulse");
  const radarScreenSweep = document.getElementById("radar-screen-sweep");
  const radarStatus = document.getElementById("radar-status");

  if (!radarBtn) return;

  radarBtn.addEventListener("click", (e) => {
    // 1. Reset Animations
    radarPulse.classList.remove("radar-active");
    void radarPulse.offsetWidth;
    radarPulse.classList.add("radar-active");

    radarScreenSweep.classList.remove("full-sweep-active");
    void radarScreenSweep.offsetWidth;
    radarScreenSweep.classList.add("full-sweep-active");

    // 2. Clear old jets
    const oldJets = document.querySelectorAll(".fighter-jet-dynamic");
    oldJets.forEach((el) => el.remove());

    // 3. Randomize Targets (2 to 5)
    const targetCount = Math.floor(Math.random() * 4) + 2;
    const newJetsDOM = [];

    // Store position data to check for overlaps: { isLeft: boolean, top: number }
    const placedJets = [];

    for (let i = 0; i < targetCount; i++) {
      let isLeft, verticalPos, horizontalOffset;
      let attempts = 0;
      let collision = true;

      // Collision Detection Loop (Try up to 20 times to find a clear spot)
      while (collision && attempts < 20) {
        isLeft = Math.random() > 0.5;
        verticalPos = Math.floor(Math.random() * 70) + 15; // 15% to 85% down
        horizontalOffset = Math.floor(Math.random() * 15) + 2; // 2% to 17% from edge

        // Check against existing jets
        collision = placedJets.some((jet) => {
          // If on the same side, ensure at least 15% vertical distance
          if (jet.isLeft === isLeft) {
            return Math.abs(jet.top - verticalPos) < 15;
          }
          return false;
        });
        attempts++;
      }

      // If we couldn't find a spot after 20 tries, skip this jet to prevent overlap
      if (collision) continue;

      // Save valid position
      placedJets.push({ isLeft, top: verticalPos });

      // Create DOM Element
      const jet = document.createElement("div");
      jet.className =
        "fighter-jet-dynamic fixed z-[45] opacity-0 transition-opacity duration-500 flex flex-col items-center gap-1 pointer-events-none";

      jet.style.top = `${verticalPos}%`;
      if (isLeft) {
        jet.style.left = `${horizontalOffset}%`;
      } else {
        jet.style.right = `${horizontalOffset}%`;
      }

      // Rotate based on side
      const rotation = isLeft
        ? 45 + Math.random() * 45
        : -45 - Math.random() * 45;

      jet.innerHTML = `
                <i data-lucide="plane" class="w-6 h-6 text-defense-accent" style="transform: rotate(${rotation}deg)"></i>
                <span class="text-[8px] font-mono text-defense-accent bg-black/80 px-1 border border-defense-accent">BOGEY_0${
                  i + 1
                }</span>
            `;

      document.body.appendChild(jet);
      newJetsDOM.push(jet);
    }

    lucide.createIcons();

    // 4. Update Status Text
    if (radarStatus) {
      radarStatus.textContent = "SCANNING...";
      radarStatus.style.color = "#10b981";

      setTimeout(() => {
        radarStatus.textContent = `${newJetsDOM.length} TARGETS`; // Show actual placed count
      }, 800);

      setTimeout(() => {
        radarStatus.textContent = "SYS_ONLINE";
        radarStatus.style.color = "";
      }, 4000);
    }

    // 5. Reveal Animation
    setTimeout(() => {
      newJetsDOM.forEach((jet) => {
        jet.classList.remove("opacity-0");
        jet.classList.add("opacity-100");
      });

      setTimeout(() => {
        newJetsDOM.forEach((jet) => {
          jet.classList.remove("opacity-100");
          jet.classList.add("opacity-0");
        });

        setTimeout(() => {
          newJetsDOM.forEach((jet) => jet.remove());
        }, 1000);
      }, 4000);
    }, 500);
  });
}

function initLoader() {
  const loader = document.getElementById("loader");
  const counter = document.getElementById("loader-counter");
  const bar = document.getElementById("loader-bar");
  const log = document.getElementById("loader-log");
  const body = document.body;

  const logs = [
    "> MEMORY_TEST... PASS",
    "> ENCRYPTION_KEYS... LOADED",
    "> UPLINK_ESTABLISHED... OK",
    "> LOADING_INTERFACE... 100%",
  ];
  let progress = 0;
  let logIndex = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1;
    if (progress > 100) progress = 100;

    if (counter) counter.textContent = progress.toString().padStart(3, "0");
    if (bar) bar.style.width = `${progress}%`;

    if (progress > (logIndex + 1) * 25 && logIndex < logs.length) {
      if (log) {
        log.innerHTML += `${logs[logIndex]}<br>`;
        log.scrollTop = log.scrollHeight;
      }
      logIndex++;
    }

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (loader) {
          loader.classList.add("loader-hidden");
          setTimeout(() => loader.remove(), 1000);
        }
        body.style.overflow = "auto";
        setTimeout(() => {
          const el = document.querySelector("#hero-name");
          if (el) {
            const fx = new TextScramble(el);
            fx.setText("abimanyu ananthu");
          }
        }, 500);
      }, 500);
    }
  }, 30);
}

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 5);
      const end = i * 8 + 20;
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="text-gray-600">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-item");
  const observerOptions = {
    root: null,
    rootMargin: "-50% 0px -50% 0px",
    threshold: 0,
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.remove("text-white", "text-defense-accent");
          link.classList.add("text-defense-muted");
        });
        const activeLink = document.querySelector(`.nav-item[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.remove("text-defense-muted");
          activeLink.classList.add("text-white");
        }
      }
    });
  }, observerOptions);
  sections.forEach((section) => {
    if (section.id) observer.observe(section);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".glass-panel").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition =
    "opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease";
  observer.observe(el);
});

function initMatrixRain() {
  const canvas = document.getElementById("matrix-rain");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Set canvas to full screen
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Configuration
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  // Array to track the y coordinate of each column
  const drops = Array(columns).fill(1);

  const draw = () => {
    // 1. Draw a semi-transparent black rectangle to create the "trail" effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Set text style
    ctx.fillStyle = "#10b981"; // Your Defense Accent Green
    ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

    // 3. Loop through drops
    for (let i = 0; i < drops.length; i++) {
      // Randomly print 0 or 1
      const text = Math.random() > 0.5 ? "abi" : "abi";

      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      // 4. Reset drop to top randomly after it crosses screen
      // Math.random() > 0.975 adds randomness so they don't all reset at once
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      // 5. Move drop down
      drops[i]++;
    }
  };

  // Run animation at 30FPS
  setInterval(draw, 33);
}
