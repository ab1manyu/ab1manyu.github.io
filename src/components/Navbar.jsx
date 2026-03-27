import { useEffect, useState } from 'react';
import { SatelliteDish } from 'lucide-react';
import { Link } from 'react-router-dom';
import Clock from './Clock';

export default function Navbar() {
  const [radarStatus, setRadarStatus] = useState('SYS_ONLINE');

  useEffect(() => {
    const handleScanning = () => setRadarStatus('SCANNING...');
    const handleRevealed = () => {
      setRadarStatus(prev => {
        if (prev === 'SCANNING...') return '1 PLANE';
        const count = parseInt(prev.split(' ')[0]) || 0;
        return `${count + 1} PLANES`;
      });
    };
    const handleComplete = () => setRadarStatus('SYS_ONLINE');

    window.addEventListener('radar-scanning', handleScanning);
    window.addEventListener('bogey-revealed', handleRevealed);
    window.addEventListener('radar-complete', handleComplete);

    return () => {
      window.removeEventListener('radar-scanning', handleScanning);
      window.removeEventListener('bogey-revealed', handleRevealed);
      window.removeEventListener('radar-complete', handleComplete);
    };
  }, []);

  const handleScrollToHash = (e, hash) => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      e.preventDefault();
      window.history.pushState(null, '', `/${hash}`);
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 112; // 112px = scroll-mt-28
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-defense-border bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-10 h-10">
            <div id="radar-pulse" className="absolute w-full h-full border border-defense-accent rounded-full opacity-0 scale-0 pointer-events-none"></div>
            <button id="radar-trigger" className="relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer group" onClick={(e) => {
              e.currentTarget.previousElementSibling.classList.remove("radar-active");
              void e.currentTarget.previousElementSibling.offsetWidth;
              e.currentTarget.previousElementSibling.classList.add("radar-active");
              window.dispatchEvent(new Event('radar-ping'));
            }}>
              <SatelliteDish className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col leading-none min-w-[5.5rem]">
            <span className="font-mono text-sm tracking-widest uppercase font-bold text-white">abi.</span>
            <span id="radar-status" className={`font-mono text-[10px] ${radarStatus === 'SYS_ONLINE' ? 'text-gray-500' : 'text-defense-accent'}`}>{radarStatus}</span>
          </div>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-mono tracking-wider text-defense-muted">
          <Link to="/#about" onClick={(e) => handleScrollToHash(e, '#about')} className="nav-item hover:text-white transition-colors py-1">01_INTEL</Link>
          <Link to="/#skills" onClick={(e) => handleScrollToHash(e, '#skills')} className="nav-item hover:text-white transition-colors py-1">02_OPS</Link>
          <Link to="/#contact" onClick={(e) => handleScrollToHash(e, '#contact')} className="nav-item hover:text-white transition-colors py-1">03_LINK</Link>
        </div>

        <Clock />
      </div>
    </nav>
  );
}
