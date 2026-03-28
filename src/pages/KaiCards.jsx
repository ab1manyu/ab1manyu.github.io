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

const totalCards = 20;

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

const cardsData = Array.from({ length: totalCards }, (_, i) => {
  const shuffledMoves = [...moves].sort(() => 0.5 - Math.random());
  const type = shuffledMoves[0].type;

  return {
    id: i,
    name: `Kai`,
    hp: Math.floor(Math.random() * 800 + 100) % 10 * 10 + 40,
    type,
    image: images[i % images.length],
    attack1: shuffledMoves[0],
    attack2: shuffledMoves[1],
    flavor: 'A mysterious entity discovered deep within the archives. Its origins remain unknown.'
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
    // Velocity tracking
    let lastEventY = 0;
    let lastEventTime = 0;
    let velocity = 0;

    const N = totalCards;

    const updateCards = () => {
      const p = progressRef.current;

      cardsRef.current.forEach((el, idx) => {
        if (!el) return;

        const v = ((idx - p) % N + N) % N;

        let zIndex = 0;
        let scale = 1;
        let opacity = 1;
        let transformY = 0;
        let rotate = 0;

        if (v >= N - 1) {
          const peel = N - v;
          zIndex = 1000;
          scale = 1 + (peel * 0.5);
          transformY = -(peel * 600);
          const angleDir = idx % 2 === 0 ? -1 : 1;
          rotate = peel * 12 * angleDir;
          opacity = 1 - peel;
        } else {
          zIndex = Math.floor(N - v);
          scale = 1 - (v * 0.04);
          transformY = -(v * 25);
          rotate = 0;

          if (v > N - 2) {
            opacity = N - 1 - v;
          } else {
            opacity = 1;
          }
        }

        if (opacity < 0.01) {
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
        } else {
          el.style.visibility = 'visible';
          el.style.pointerEvents = 'auto';
          el.style.transform = `translateY(${transformY}px) scale(${scale}) rotate(${rotate}deg)`;
          el.style.opacity = opacity.toString();
          el.style.zIndex = zIndex.toString();
        }
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
        progressRef.current = start + distance * easeOut(progress);
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

    const scheduleSnap = () => {
      if (snapTimeout) clearTimeout(snapTimeout);
      snapTimeout = setTimeout(() => {
        // Use velocity to decide direction
        const target = velocity > 0
          ? Math.ceil(progressRef.current)
          : Math.floor(progressRef.current);
        if (Math.abs(progressRef.current - target) > 0.01) {
          snapTo(target);
        }
        velocity = 0;
      }, 120);
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
      const dy = e.clientY - dragStartY;
      // 200px drag = 1 card step; negative = scroll forward (next card)
      progressRef.current = dragStartProgress - dy / 200;
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
      scheduleSnap();
    };

    // ── Wheel (desktop scroll) ───────────────────────────────────────────────
    const onWheel = (e) => {
      e.preventDefault();
      if (snapRAF) { cancelAnimationFrame(snapRAF); snapRAF = null; }
      progressRef.current += e.deltaY / 400;
      velocity = e.deltaY > 0 ? 1 : -1;
      requestUpdate();
      scheduleSnap();
    };

    const container = document.getElementById('kaicards-container');
    if (container) {
      container.addEventListener('pointerdown', onPointerDown);
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerup', onPointerUp);
      container.addEventListener('pointercancel', onPointerUp);
      container.addEventListener('wheel', onWheel, { passive: false });
    }

    // Initial paint
    updateCards();

    return () => {
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
      className="bg-defense-base min-h-screen w-full flex items-center justify-center pt-16 pb-8 touch-none select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <style>{`
        #kaicards-container { cursor: grab; }
        #kaicards-container:active { cursor: grabbing; }
      `}</style>

      <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[5/7] flex items-center justify-center">
        {cardsData.map((card, idx) => (
          <div
            key={card.id}
            ref={el => cardsRef.current[idx] = el}
            className="absolute inset-0 border border-defense-border rounded-xl flex flex-col overflow-hidden shadow-2xl pointer-events-auto bg-[#060f09] text-defense-accent font-mono"
            style={{
              willChange: 'transform, opacity',
              visibility: 'hidden'
            }}
          >
            <div className="flex-1 w-full h-full flex flex-col p-1 sm:p-2 rounded-sm bg-[#060f09]">

              {/* Header */}
              <div className="flex justify-between items-center mb-1 px-1">
                <div className="font-extrabold text-sm sm:text-base leading-none tracking-tight">{card.name}</div>
                <div className="flex items-center gap-1 text-defense-accent font-bold leading-none">
                  <span className="text-[8px] sm:text-[10px] mr-[2px]">HP</span>
                  <span className="text-sm sm:text-base">{card.hp}</span>
                  <div className="w-4 h-4 rounded-full border border-defense-border bg-[#0a1a10] flex items-center justify-center p-[2px] ml-1">
                    <card.type.icon className="w-full h-full" style={{ color: card.type.color }} />
                  </div>
                </div>
              </div>

              {/* Picture Frame */}
              <div className="w-full aspect-[4/3] border rounded-[6px] border-defense-border bg-black overflow-hidden relative mb-1">
                <img src={card.image} alt={card.name} className="w-full h-full object-cover" draggable={false} />
              </div>

              {/* Sub Metadata Bar */}
              <div className="w-full bg-[#0a1a10] text-[7px] sm:text-[8px] font-bold italic text-center py-[2px] sm:py-1 mb-1 sm:mb-2 border-y border-defense-border text-defense-accent">
                NO. {card.id.toString().padStart(3, '0')} Kitty Cat Length: 2&apos;0,  Weight: 10lbs
              </div>

              {/* Moves / Stats */}
              <div className="flex-1 flex flex-col px-1 sm:px-2 z-10 relative bg-[#08120b] rounded-lg border-defense-border p-1">
                <div className="flex items-center justify-between border-b border-defense-border pb-1 sm:pb-2 mb-1 sm:mb-2 text-defense-accent">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-defense-border bg-[#0a1a10] flex items-center justify-center p-[2px]">
                      <card.attack1.type.icon className="w-full h-full" style={{ color: card.attack1.type.color }} />
                    </div>
                    <span className="font-bold text-xs sm:text-sm tracking-tight">{card.attack1.name}</span>
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm">{card.attack1.dmg}</span>
                </div>

                <div className="flex items-center justify-between pb-1 sm:pb-2 mb-1 text-defense-accent">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex gap-[2px]">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-defense-border bg-[#0a1a10] flex items-center justify-center p-[2px]">
                        <card.attack2.type.icon className="w-full h-full" style={{ color: card.attack2.type.color }} />
                      </div>
                    </div>
                    <span className="font-bold text-xs sm:text-sm tracking-tight">{card.attack2.name}</span>
                  </div>
                  <span className="font-extrabold text-xs sm:text-sm">{card.attack2.dmg}</span>
                </div>
              </div>

              {/* Footer small stats */}
              <div className="mt-auto">
                <div className="flex justify-between text-[6px] sm:text-[8px] font-bold border-t border-defense-border py-1 mb-1 px-1">
                  <div className="text-center text-[#2d8a4e]">weakness<br /><span className="text-xs text-defense-accent">x0</span></div>
                  <div className="text-center text-[#2d8a4e]">resistance<br /><span className="text-xs text-defense-accent">-30</span></div>
                  <div className="text-center text-[#2d8a4e]">retreat cost<br /><span className="text-xs tracking-widest text-defense-accent">* *</span></div>
                </div>
                <div className="text-[7px] sm:text-[9px] italic border-t border-defense-border pt-1 px-1 leading-tight text-center font-mono text-[#2d8a4e]">
                  {card.flavor}
                </div>
                <div className="flex justify-between items-center mt-1 px-1 text-[6px] sm:text-[7px] font-bold text-[#1f6036]">
                  <span>Illus. Abimanyu</span>
                  <span>{card.id + 1}/{totalCards} ⋆</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
