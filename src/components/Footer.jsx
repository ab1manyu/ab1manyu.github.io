import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

const ACCENT = '#10b981';
const INACTIVE_GRAY = '#4b5563'; // rgb(75 85 99)
const WHITE = '#ffffff';

export default function Footer() {
  const location = useLocation();
  const isLocked = location.pathname === '/kai';

  const dotsRef = useRef(null);

  const triggerGlitch = () => {
    window.dispatchEvent(new CustomEvent('grid-pulse'));

    const dots = dotsRef.current?.querySelectorAll('.glitch-dot');
    if (!dots) return;

    dots.forEach((dot, i) => {
      gsap.killTweensOf(dot);

      gsap.timeline({ delay: i * 0.06 })
        // brief flicker to white
        .to(dot, {
          backgroundColor: WHITE,
          scale: 1.4,
          duration: 0.06,
          ease: 'none',
        })
        // snap to accent
        .to(dot, {
          backgroundColor: ACCENT,
          scale: 0.8,
          duration: 0.06,
          ease: 'none',
        })
        // tiny x-jitter
        .to(dot, {
          x: 3,
          duration: 0.04,
          ease: 'none',
        })
        .to(dot, {
          x: -2,
          duration: 0.04,
          ease: 'none',
        })
        // settle back
        .to(dot, {
          backgroundColor: i === 2 ? '#333333' : ACCENT,
          scale: 1,
          x: 0,
          duration: 0.18,
          ease: 'power2.out',
        });
    });
  };

  return (
    <footer
      className={`hidden md:block border-t border-defense-border bg-black py-8 ${isLocked ? 'fixed bottom-0 w-full z-50' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="font-mono text-xs text-gray-600">
          ︽︽︽︽︽︽︽<br />
          SYS_ID: 0.1.1
        </div>

        {/* 3 dots */}
        <div
          ref={dotsRef}
          onClick={triggerGlitch}
          className="flex gap-1 cursor-select select-none"
        >
          {/* <div className="glitch-dot w-2 h-2 bg-defense-accent rounded-full" /> */}
          <div className="glitch-dot w-2 h-2 bg-gray-600 rounded-full" />
          <div className="glitch-dot w-2 h-2 bg-gray-600 rounded-full" />
        </div>

        <div className="font-mono text-xs text-gray-600 text-right">
          ®	2026 UYNAMI<br />
          ︾︾︾︾︾︾︾
        </div>
      </div>
    </footer>
  );
}
