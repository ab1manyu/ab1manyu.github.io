document.addEventListener("DOMContentLoaded", () => {
  injectNavbar();
  injectFooter();
  lucide.createIcons();
  initRadar();
  initLoader();
  initScrollSpy();
  initMatrixRain();
  initFadeTransitions();
  initGalleryModal();
});

function injectNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  const isGallery = window.location.pathname.includes("gallery.html");
  const linkPrefix = isGallery ? "index.html" : "";
  const radarId = isGallery ? "" : 'id="radar-trigger"';
  const radarCursor = isGallery ? "cursor-default" : "cursor-pointer";
  const radarIcon = isGallery ? "aperture" : "satellite-dish";

  // Only rotate on gallery page
  const rotateClass = isGallery ? "transition-transform duration-700 group-hover:rotate-180" : "";

  container.innerHTML = `
	<nav class="fixed top-0 w-full z-50 border-b border-defense-border bg-black/80 backdrop-blur-md">
		<div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="relative flex items-center justify-center w-10 h-10">
					<div id="radar-pulse"
						class="absolute w-full h-full border border-defense-accent rounded-full opacity-0 scale-0 pointer-events-none">
					</div>

					<button ${radarId}
						class="relative z-10 text-defense-accent hover:text-white transition-colors outline-none ${radarCursor} group">
						<i data-lucide="${radarIcon}" class="w-6 h-6 ${rotateClass}"></i>
					</button>
				</div>

				<div class="flex flex-col leading-none">
					<span class="font-mono text-sm tracking-widest uppercase font-bold text-white">abi.</span>
					<span id="radar-status" class="font-mono text-[10px] text-gray-500">SYS_ONLINE</span>
				</div>
			</div>

			<div class="hidden md:flex gap-8 text-sm font-mono tracking-wider text-defense-muted">
				<a href="${linkPrefix}#about" class="nav-item hover:text-white transition-colors py-1">01_INTEL</a>
				<a href="${linkPrefix}#skills" class="nav-item hover:text-white transition-colors py-1">02_OPS</a>
				<a href="${linkPrefix}#contact" class="nav-item hover:text-white transition-colors py-1">03_LINK</a>
			</div>

			<div class="sm:block font-mono text-xs text-gray-500" id="military-clock">
				00:00:00 MST
			</div>
		</div>
	</nav>
  `;
}

function injectFooter() {
  const container = document.getElementById("footer-container");
  if (!container) return;

  container.innerHTML = `
	<footer class="border-t border-defense-border bg-black py-8">
		<div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
			<div class="font-mono text-xs text-gray-600">
				SYS_ID: 2026-PORTFOLIO<br />
				LOC: UNKNOWN
			</div>
			<div class="flex gap-1">
				<div class="w-2 h-2 bg-[#333] rounded-full"></div>
				<div class="w-2 h-2 bg-[#333] rounded-full"></div>
				<div class="w-2 h-2 bg-defense-accent rounded-full"></div>
			</div>
			<div class="font-mono text-xs text-gray-600 text-right">
				&copy; 2026 UYNAMI<br />
				ALL RIGHTS RESERVED
			</div>
		</div>
	</footer>
  `;
}

function initGalleryModal() {
  const modal = document.getElementById("gallery-modal");
  if (!modal) return;

  const overlay = document.getElementById("modal-overlay");
  const closeBtn = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalDate = document.getElementById("modal-date");
  const modalDesc = document.getElementById("modal-desc");

  // Open Modal
  const items = document.querySelectorAll(".gallery-item");
  items.forEach(item => {
    item.addEventListener("click", () => {
      // 1. Populate Data
      const title = item.getAttribute("data-title");
      const date = item.getAttribute("data-date");
      const desc = item.getAttribute("data-desc");
      const imageSrc = item.getAttribute("data-image");
      const location = item.getAttribute("data-location");

      const modalLocation = document.getElementById("modal-location");

      if (modalTitle) modalTitle.textContent = title;
      if (modalDate) modalDate.textContent = date;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalLocation && location) modalLocation.textContent = location;

      // Handle Image vs Icon
      const imageContainer = document.querySelector("#modal-card > div:first-child");
      if (imageContainer) {
        // 1. Remove existing image, icon (i), or lucide svg
        const existingImg = imageContainer.querySelector("img");
        const existingIcon = imageContainer.querySelector("i");
        const existingSvg = imageContainer.querySelector("svg");

        if (existingImg) existingImg.remove();
        if (existingIcon) existingIcon.remove();
        if (existingSvg) existingSvg.remove();

        // 2. Append new content
        if (imageSrc) {
          const img = document.createElement("img");
          img.src = imageSrc;
          img.className = "w-full h-full object-contain max-h-[90%] fade-in cursor-zoom-in transition-transform duration-300 origin-center";

          // Zoom Logic
          let zoomLevel = 0; // 0: None, 1: 2.5x, 2: 5x
          let animFrame = null;
          let imgRect = null; // Cache rect to avoid layout thrashing

          const updateZoom = (clientX, clientY) => {
            if (!imgRect) return;
            const x = ((clientX - imgRect.left) / imgRect.width) * 100;
            const y = ((clientY - imgRect.top) / imgRect.height) * 100;
            img.style.transformOrigin = `${x}% ${y}%`;
          };

          img.addEventListener("click", (e) => {
            e.stopPropagation();

            // Cycle Zoom: 0 -> 1 -> 2 -> 0
            zoomLevel = (zoomLevel + 1) % 3;

            // Cache rect only when entering zoom state or changing levels
            if (zoomLevel > 0) {
              imgRect = img.getBoundingClientRect();
            }

            // Apply Zoom Classes/Styles
            img.classList.remove("scale-[1]", "scale-[2.5]", "scale-[5]");

            if (zoomLevel === 0) {
              img.style.transform = "scale(1)";
              img.classList.remove("cursor-zoom-out");
              img.classList.add("cursor-zoom-in");
              img.style.transformOrigin = "center center"; // Reset position
              imgRect = null; // Clear cache
            } else if (zoomLevel === 1) {
              img.style.transform = "scale(2.5)";

              // Center zoom initially on click point
              updateZoom(e.clientX, e.clientY);
            } else if (zoomLevel === 2) {
              img.style.transform = "scale(5)";
              // Center zoom on click point for the deeper zoom too
              img.classList.remove("cursor-zoom-in");
              img.classList.add("cursor-zoom-out");
              updateZoom(e.clientX, e.clientY);
            }
          });

          img.addEventListener("mousemove", (e) => {
            if (zoomLevel === 0) return;

            // Optimize: Use requestAnimationFrame and cached rect
            if (animFrame) cancelAnimationFrame(animFrame);

            animFrame = requestAnimationFrame(() => {
              updateZoom(e.clientX, e.clientY);
            });
          });

          // Reset on leave
          img.addEventListener("mouseleave", () => {
            if (zoomLevel > 0) {
              zoomLevel = 0;
              img.style.transform = "scale(1)";
              img.classList.remove("cursor-zoom-out");
              img.classList.add("cursor-zoom-in");
              img.style.transformOrigin = "center center";
              imgRect = null;
            }
          });

          imageContainer.insertBefore(img, imageContainer.firstChild);
        } else {
          const icon = document.createElement("i");
          icon.setAttribute("data-lucide", "image");
          icon.className = "w-32 h-32 text-gray-700";
          imageContainer.insertBefore(icon, imageContainer.firstChild);
          lucide.createIcons();
        }
      }

      // New Camera Specs
      const cam = item.getAttribute("data-cam") || "UNKNOWN";
      const lens = item.getAttribute("data-lens") || "UNKNOWN";
      const settings = item.getAttribute("data-settings") || "UNKNOWN";

      const modalCam = document.getElementById("modal-cam");
      const modalLens = document.getElementById("modal-lens");
      const modalSettings = document.getElementById("modal-settings");

      if (modalCam) modalCam.textContent = cam;
      if (modalLens) modalLens.textContent = lens;
      if (modalSettings) modalSettings.textContent = settings;

      // 2. Show Modal
      modal.classList.remove("hidden");
      // Small delay to allow display:flex to apply before opacity transition
      setTimeout(() => {
        modal.classList.add("active");
      }, 10);

      // 3. Lock Scroll
      document.body.style.overflow = "hidden";
    });
  });

  // Close Modal Function
  const closeModal = () => {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 300); // Match CSS duration
  };

  // Close Triggers
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", closeModal);

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

function initFadeTransitions() {
  const overlay = document.getElementById("transition-overlay");
  if (!overlay) return;

  // 1. FADE IN ON LOAD
  // Small delay to ensure browser paints black first
  setTimeout(() => {
    overlay.classList.add("faded-out");
  }, 50);

  // 2. FADE OUT ON NAVIGATE
  // Intercept all clicks on standard links (including nav-items that change page)
  const links = document.querySelectorAll("a"); // Catch all links

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Ignore:
      // 1. Hash links (anchors on same page)
      // 2. Target blank (new tabs)
      // 3. Javascript: links
      if (!href || href.startsWith("#") || href.startsWith("javascript:") || link.target === "_blank") return;

      e.preventDefault();

      // Start Fade Out (Black Screen)
      overlay.classList.remove("faded-out");

      // Wait for transition (400ms match css) then go
      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  });
}

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
                <span class="text-[8px] font-mono text-defense-accent bg-black/80 px-1 border border-defense-accent">BOGEY_0${i + 1
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

  // Check if already booted this session
  if (sessionStorage.getItem("booted")) {
    if (loader) loader.remove();
    body.style.overflow = "auto";

    // Still trigger the name scramble immediately
    setTimeout(() => {
      const el = document.querySelector("#hero-name");
      if (el) {
        const fx = new TextScramble(el);
        fx.setText("abimanyu ananthu");
      }
    }, 100);
    return;
  }

  // Mark as booted for next time
  sessionStorage.setItem("booted", "true");

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

  // Run animation at ~30FPS using requestAnimationFrame
  let lastTime = 0;
  const fps = 30;
  const interval = 1000 / fps;

  const animate = (currentTime) => {
    if (!lastTime) lastTime = currentTime;
    const elapsed = currentTime - lastTime;

    if (elapsed > interval) {
      draw();
      lastTime = currentTime - (elapsed % interval);
    }
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}
