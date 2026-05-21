import { useRef, useEffect } from 'react';
import { Flame, Droplet, Zap, Wind, Mountain, Skull, Leaf } from 'lucide-react';

const types = [
  { name: 'Fire', icon: Flame, color: '#ef4444' },
  { name: 'Water', icon: Droplet, color: '#3b82f6' },
  { name: 'Electric', icon: Zap, color: '#eab308' },
  { name: 'Grass', icon: Leaf, color: '#22c55e' },
  { name: 'Fighting', icon: Mountain, color: '#f97316' },
  { name: 'Psychic', icon: Wind, color: '#a855f7' },
  { name: 'Dark', icon: Skull, color: '#9ca3af' }
];

const images = [
  '/kai/kai.jpg',
  '/kai/kai2.jpg',
  '/kai/kai3.jpg',
  '/kai/kai4.jpg',
  '/kai/kai5.jpg',
  '/kai/kai6.jpg',
  '/kai/kai7.jpg',
  '/kai/kai8.jpg',
  '/kai/kai9.jpg',
  '/kai/kai10.jpg',
];

const totalCards = 100;
const LEGENDARY_CHANCE = 0.15; // 15%

const moves = [
  { name: 'Earthquake', dmg: 100, type: types.find(t => t.name === 'Fighting') },
  { name: 'Thunderbolt', dmg: 90, type: types.find(t => t.name === 'Electric') },
  { name: 'Flamethrower', dmg: 90, type: types.find(t => t.name === 'Fire') },
  { name: 'Hydro Pump', dmg: 110, type: types.find(t => t.name === 'Water') },
  { name: 'Solar Beam', dmg: 120, type: types.find(t => t.name === 'Grass') },
  { name: 'Psychic', dmg: 90, type: types.find(t => t.name === 'Psychic') },
  { name: 'Crunch', dmg: 80, type: types.find(t => t.name === 'Dark') },
  { name: 'Close Combat', dmg: 120, type: types.find(t => t.name === 'Fighting') },
  { name: 'Fire Blast', dmg: 110, type: types.find(t => t.name === 'Fire') },
  { name: 'Surf', dmg: 90, type: types.find(t => t.name === 'Water') },
  { name: 'Thunder', dmg: 110, type: types.find(t => t.name === 'Electric') },
  { name: 'Leaf Storm', dmg: 130, type: types.find(t => t.name === 'Grass') }
];

const legendaryMoves = [
  { name: 'Kai Mega Punch ', dmg: 250, type: types.find(t => t.name === 'Fighting') },
  { name: 'Kai Blast', dmg: 200, type: types.find(t => t.name === 'Fighting') },
];

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const shuffledImages = shuffle(images);

const cardsData = Array.from({ length: totalCards }, (_, i) => {
  const shuffledMoves = [...moves].sort(() => 0.5 - Math.random());
  const shuffledLegendaryMoves = [...legendaryMoves].sort(() => 0.5 - Math.random());
  const type = shuffledMoves[0].type;
  const isLegendary = Math.random() < LEGENDARY_CHANCE;

  return {
    id: i,
    name: isLegendary ? `✦ Kai ✦` : `Kai`,
    hp: isLegendary
      ? Math.floor(Math.random() * 200 + 250) % 10 * 10 + 200// 250–450 for legendary
      : Math.floor(Math.random() * 800 + 100) % 10 * 10 + 40,
    type,
    isLegendary,
    image: isLegendary ? '/kai/kaiLegendary.jpg' : shuffledImages[i % shuffledImages.length],
    attack1: isLegendary
      ? { ...shuffledLegendaryMoves[0], dmg: shuffledLegendaryMoves[0].dmg + 40 }
      : shuffledMoves[0],
    attack2: isLegendary
      ? { ...shuffledLegendaryMoves[1], dmg: shuffledLegendaryMoves[1].dmg + 40 }
      : shuffledMoves[1],
    flavor: isLegendary
      ? 'An ancient being of immeasurable power. Long thought to be a myth — now undeniable.'
      : 'A mysterious entity discovered deep within the archives. Its origins remain unknown.'
  };
});

export default function KaiCards() {
  const cardsRef = useRef([]);
  // Virtual progress: each integer = one full card step
  const progressRef = useRef(0);

  useEffect(() => {
    let ticking = false;
    let snapRAF = null;
    let snapTimeout = null;

    // Drag state
    let isDragging = false;
    let dragStartY = 0;
    let dragStartProgress = 0;

    // Optimization state
    const hiddenState = new Array(totalCards).fill(true);

    // Velocity tracking
    let lastEventY = 0;
    let lastEventTime = 0;
    let velocity = 0;

    const N = totalCards;

    const updateCards = () => {
      const p = progressRef.current;
      const VISIBLE_CARDS = 8;

      cardsRef.current.forEach((el, idx) => {
        if (!el) return;

        const v = idx - p;

        let zIndex = 0;
        let scale = 1;
        let opacity = 1;
        let transformY = 0;
        let rotate = 0;

        if (v < 0) {
          const peel = -v;
          zIndex = 1000 + idx;
          scale = 1 + (peel * 0.5);
          transformY = -(peel * 600);
          const angleDir = idx % 2 === 0 ? -1 : 1;
          rotate = peel * 12 * angleDir;
          opacity = Math.max(0, 1 - peel);
        } else if (v <= VISIBLE_CARDS) {
          zIndex = 40 - idx;
          scale = 1 - (v * 0.05);
          transformY = -(v * 30);
          rotate = 0;

          if (v > VISIBLE_CARDS - 1) {
            opacity = Math.max(0, VISIBLE_CARDS - v);
          } else {
            opacity = 1;
          }
        } else {
          opacity = 0;
        }

        // Buffer: 2 cards behind (peeled), 4 cards ahead (stack)
        const isWarm = v >= -2 && v <= VISIBLE_CARDS + 4;

        if (!isWarm) {
          if (!hiddenState[idx]) {
            el.style.visibility = 'hidden';
            el.style.willChange = 'auto'; // free VRAM
            el.style.pointerEvents = 'none';
            hiddenState[idx] = true;
          }
          return;
        }

        if (hiddenState[idx]) {
          el.style.visibility = 'visible';
          el.style.willChange = 'transform, opacity'; // warm up GPU layer
          hiddenState[idx] = false;
        }

        el.style.transform = `translate3d(0, ${transformY}px, 0) scale(${scale}) rotate(${rotate}deg)`;
        el.style.opacity = opacity.toString();
        el.style.zIndex = zIndex.toString();
        el.style.pointerEvents = opacity <= 0.01 ? 'none' : 'auto';
      });

      ticking = false;
    };

    const requestUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateCards);
        ticking = true;
      }
    };

    // Smooth snap to nearest integer progress
    const snapTo = (target) => {
      if (snapRAF) cancelAnimationFrame(snapRAF);
      const start = progressRef.current;
      const distance = target - start;
      const startTime = performance.now();
      const duration = 250;

      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let p = start + distance * easeOut(progress);
        p = Math.max(0, Math.min(N - 1, p));
        progressRef.current = p;
        requestUpdate();
        if (progress < 1) {
          snapRAF = window.requestAnimationFrame(animate);
        } else {
          progressRef.current = target;
          snapRAF = null;
          requestUpdate();
        }
      };

      snapRAF = window.requestAnimationFrame(animate);
    };

    const doSnap = () => {
      let target = velocity > 0
        ? Math.ceil(progressRef.current)
        : Math.floor(progressRef.current);

      target = Math.max(0, Math.min(N - 1, target));

      if (Math.abs(progressRef.current - target) > 0.01) {
        snapTo(target);
      }
      velocity = 0;
    };

    const scheduleSnap = () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(doSnap, 150);
    };

    // ── Pointer events (mouse + touch via pointer API) ──────────────────────
    const onPointerDown = (e) => {
      if (snapRAF) { cancelAnimationFrame(snapRAF); snapRAF = null; }
      isDragging = true;
      dragStartY = e.clientY;
      dragStartProgress = progressRef.current;
      lastEventY = e.clientY;
      lastEventTime = performance.now();
      velocity = 0;
      e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const dy = e.clientY - dragStartY;
      // 250px drag = 1 card step; negative = scroll forward (next card)
      let p = dragStartProgress - dy / 250;
      p = Math.max(0, Math.min(N - 1, p));
      progressRef.current = p;
      requestUpdate();

      const now = performance.now();
      const dt = now - lastEventTime;
      if (dt > 0) {
        velocity = (lastEventY - e.clientY) / dt; // px/ms, positive = drag up = next card
      }
      lastEventY = e.clientY;
      lastEventTime = now;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      if (snapTimeout) clearTimeout(snapTimeout);
      doSnap();
    };

    // ── Wheel (desktop scroll) ───────────────────────────────────────────────
    const onWheel = (e) => {
      e.preventDefault();
      if (snapRAF) { cancelAnimationFrame(snapRAF); snapRAF = null; }
      let p = progressRef.current + e.deltaY / 600;
      p = Math.max(0, Math.min(N - 1, p));
      progressRef.current = p;
      velocity = e.deltaY > 0 ? 1 : -1;
      requestUpdate();
      scheduleSnap();
    };

    // ── Keyboard (arrows) ────────────────────────────────────────────────────
    const onKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const target = Math.max(0, Math.round(progressRef.current) + 1);
        snapTo(target);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const target = Math.min(N - 1, Math.round(progressRef.current) - 1);
        snapTo(target);
      }
    };

    const container = document.getElementById('kaicards-container');
    if (container) {
      container.addEventListener('pointerdown', onPointerDown);
      container.addEventListener('pointermove', onPointerMove, { passive: false });
      container.addEventListener('pointerup', onPointerUp);
      container.addEventListener('pointercancel', onPointerUp);
      container.addEventListener('wheel', onWheel, { passive: false });
    }
    window.addEventListener('keydown', onKeyDown);

    // Initial paint
    updateCards();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (container) {
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointercancel', onPointerUp);
        container.removeEventListener('wheel', onWheel);
      }
      if (snapTimeout) clearTimeout(snapTimeout);
      if (snapRAF) cancelAnimationFrame(snapRAF);
    };
  }, []);

  return (
    <div
      id="kaicards-container"
      className="min-h-screen w-full flex items-center justify-center pt-16 pb-8 touch-none select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <style>{`
        #kaicards-container { cursor: grab; }
        #kaicards-container:active { cursor: grabbing; }
      `}</style>

      {/* Bottom glow — only on /kai */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0"
        style={{
          height: '45vh',
          background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(16,185,129,0.13) 0%, rgba(16,185,129,0.05) 45%, transparent 100%)',
        }}
      />

      <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[5/7] flex items-center justify-center">
        {cardsData.map((card, idx) => (
          <div
            key={card.id}
            ref={el => cardsRef.current[idx] = el}
            className="absolute inset-0 rounded-xl flex flex-col overflow-hidden shadow-2xl pointer-events-auto font-mono"
            style={{
              willChange: 'auto',
              visibility: 'hidden',
              opacity: 0,
              pointerEvents: 'none',
              border: card.isLegendary ? '1.5px solid #c8960c' : '1px solid var(--border-color)',
              color: card.isLegendary ? '#f0c040' : 'var(--accent-solid)',
              boxShadow: card.isLegendary ? '0 0 24px rgba(200,150,12,0.35), 0 4px 32px rgba(0,0,0,0.8)' : undefined,
            }}
          >
            <div
              className="flex-1 w-full h-full flex flex-col p-1 sm:p-2 rounded-sm"
              style={{ background: card.isLegendary ? '#16100a' : '#060f09' }}
            >

              {/* Header */}
              <div className="flex justify-between items-center mb-1 px-1">
                <div
                  className="font-extrabold text-sm sm:text-base leading-none tracking-tight"
                  style={card.isLegendary ? { color: '#f0c040', textShadow: '0 0 8px rgba(240,192,64,0.6)' } : {}}
                >{card.name}</div>
                <div className="flex items-center gap-1 font-bold leading-none" style={{ color: card.isLegendary ? '#f0c040' : undefined }}>
                  <span className="text-[8px] sm:text-[10px] mr-[2px]">HP</span>
                  <span className="text-sm sm:text-base">{card.hp}</span>
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center p-[2px] ml-1"
                    style={{
                      border: card.isLegendary ? '1px solid #c8960c' : '1px solid var(--border-color)',
                      background: card.isLegendary ? '#231808' : '#0a1a10',
                    }}
                  >
                    <card.type.icon className="w-full h-full" style={{ color: card.isLegendary ? '#f0c040' : card.type.color }} />
                  </div>
                </div>
              </div>

              {/* Picture Frame */}
              <div
                className="w-full aspect-[4/3] rounded-[6px] bg-black overflow-hidden relative mb-1"
                style={{ border: card.isLegendary ? '1px solid #c8960c' : '1px solid var(--border-color)' }}
              >
                <img src={card.image} alt={card.name} loading="lazy" decoding="async" className="w-full h-full object-cover" draggable={false} />
                {card.isLegendary && (
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(200,150,12,0.08) 0%, transparent 40%)' }} />
                )}
              </div>

              {/* Sub Metadata Bar */}
              <div
                className="w-full text-[7px] sm:text-[8px] font-bold italic text-center py-[2px] sm:py-1 mb-1 sm:mb-2"
                style={{
                  background: card.isLegendary ? '#1a1000' : '#0a1a10',
                  borderTop: card.isLegendary ? '1px solid #c8960c' : '1px solid var(--border-color)',
                  borderBottom: card.isLegendary ? '1px solid #c8960c' : '1px solid var(--border-color)',
                  color: card.isLegendary ? '#c8960c' : undefined,
                }}
              >
                {card.isLegendary ? '✦ LEGENDARY ✦' : `NO. ${card.id.toString().padStart(3, '0')} Kitty Cat Length: 2'0,  Weight: 10lbs`}
              </div>

              {/* Moves / Stats */}
              <div
                className="flex-1 flex flex-col px-1 sm:px-2 z-10 relative rounded-lg p-1"
                style={{ background: card.isLegendary ? '#110c00' : '#08120b' }}
              >
                <div
                  className="flex items-center justify-between pb-1 sm:pb-2 mb-1 sm:mb-2"
                  style={{
                    borderBottom: card.isLegendary ? '1px solid #c8960c' : '1px solid var(--border-color)',
                    color: card.isLegendary ? '#f0c040' : undefined,
                  }}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center p-[2px]"
                      style={{
                        border: card.isLegendary ? '1px solid #c8960c' : '1px solid var(--border-color)',
                        background: card.isLegendary ? '#231808' : '#0a1a10',
                      }}
                    >
                      <card.attack1.type.icon className="w-full h-full" style={{ color: card.isLegendary ? '#f0c040' : card.attack1.type.color }} />
                    </div>
                    <span className="font-bold text-xs sm:text-sm tracking-tight">{card.attack1.name}</span>
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm">{card.attack1.dmg}</span>
                </div>

                <div
                  className="flex items-center justify-between pb-1 sm:pb-2 mb-1"
                  style={{ color: card.isLegendary ? '#f0c040' : undefined }}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center p-[2px]"
                      style={{
                        border: card.isLegendary ? '1px solid #c8960c' : '1px solid var(--border-color)',
                        background: card.isLegendary ? '#231808' : '#0a1a10',
                      }}
                    >
                      <card.attack2.type.icon className="w-full h-full" style={{ color: card.isLegendary ? '#f0c040' : card.attack2.type.color }} />
                    </div>
                    <span className="font-bold text-xs sm:text-sm tracking-tight">{card.attack2.name}</span>
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm">{card.attack2.dmg}</span>
                </div>
              </div>

              {/* Footer small stats */}
              <div className="mt-auto">
                <div
                  className="flex justify-between text-[6px] sm:text-[8px] font-bold py-1 mb-1 px-1"
                  style={{
                    borderTop: card.isLegendary ? '1px solid #c8960c' : '1px solid var(--border-color)',
                    color: card.isLegendary ? '#8a6a00' : '#2d8a4e',
                  }}
                >
                  <div className="text-center">weakness<br /><span className="text-xs" style={{ color: card.isLegendary ? '#f0c040' : undefined }}>x0</span></div>
                  <div className="text-center">resistance<br /><span className="text-xs" style={{ color: card.isLegendary ? '#f0c040' : undefined }}>-30</span></div>
                  <div className="text-center">retreat cost<br /><span className="text-xs tracking-widest" style={{ color: card.isLegendary ? '#f0c040' : undefined }}>* *</span></div>
                </div>
                <div
                  className="text-[7px] sm:text-[9px] italic pt-1 px-1 leading-tight text-center font-mono"
                  style={{
                    borderTop: card.isLegendary ? '1px solid #c8960c' : '1px solid var(--border-color)',
                    color: card.isLegendary ? '#a07820' : '#2d8a4e',
                  }}
                >
                  {card.flavor}
                </div>
                <div
                  className="flex justify-between items-center mt-1 px-1 text-[6px] sm:text-[7px] font-bold"
                  style={{ color: card.isLegendary ? '#6a4800' : '#1f6036' }}
                >
                  <span>Illus. Abimanyu</span>
                  <span>{card.isLegendary ? '★ LEGENDARY ★' : `${card.id + 1}/${totalCards} ⋆`}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
