import { useEffect, useState } from 'react';
import { SatelliteDish, Camera, Sparkle, BookUser, RectangleEllipsis, Croissant, Target } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Clock from './Clock';

const PokeballIcon = ({ className }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
  </svg>
);

export default function Navbar() {
  const location = useLocation();
  const isGallery = location.pathname === '/gallery' || location.pathname === '/gallery.html';
  const isPokedex = location.pathname === '/pokedex';
  const isKai = location.pathname === '/kai';
  const isScore = location.pathname === '/darts';

  const [radarStatus, setRadarStatus] = useState('SYS_ONLINE');
  const [shutterStatus, setShutterStatus] = useState('SYS_ONLINE');
  const [pokedexStatus, setPokedexStatus] = useState('SYS_ONLINE');
  const [catStatus, setCatStatus] = useState('SYS_ONLINE');
  const [bullseyeActive, setBullseyeActive] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleDartsClick = () => {
    if (isScore) {
      setBullseyeActive(true);
      window.dispatchEvent(new Event('darts-spiral'));
      setTimeout(() => {
        setBullseyeActive(false);
      }, 1500);
    }
  };

  useEffect(() => {
    const handleScanning = () => setRadarStatus('SCANNING...');
    const handleRevealed = () => {
      setRadarStatus(prev => {
        if (prev === 'SCANNING...') return '1 TARGET';
        const count = parseInt(prev.split(' ')[0]) || 0;
        return `${count + 1} TARGETS`;
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
        const y = element.getBoundingClientRect().top + window.scrollY - 112;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleCameraClick = () => {
    setShutterStatus('CLICK!');
    window.dispatchEvent(new Event('camera-flash'));
    setTimeout(() => setShutterStatus('SYS_ONLINE'), 900);
  };

  const handlePokeballClick = () => {
    setIsShaking(true);
    setPokedexStatus("GOTTA CATCH EM ALL!");
    setTimeout(() => {
      setIsShaking(false);
      setPokedexStatus('SYS_ONLINE');
    }, 750);
  };

  const handleCatClick = () => {
    setIsShaking(true);
    setCatStatus("MIAU!");
    setTimeout(() => {
      setIsShaking(false);
      setCatStatus('SYS_ONLINE');
    }, 750);
  };

  // Pokedex specific controls
  const pokedexAction = (action, value) => {
    window.dispatchEvent(new CustomEvent('pokedex-action', { detail: { action, value } }));
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-defense-border bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-10 h-10">
            <div id="radar-pulse" className="absolute w-full h-full border border-defense-accent rounded-full opacity-0 scale-0 pointer-events-none"></div>

            {isGallery ? (
              <button
                className="relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer"
                onClick={handleCameraClick}
              >
                <Camera className="w-6 h-6" />
              </button>
            ) : isPokedex ? (
              <button
                onClick={handlePokeballClick}
                className={`relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer ${isShaking ? 'pokeball-shake' : ''}`}
              >
                <PokeballIcon className="w-6 h-6" />
              </button>
            ) : isKai ? (
              <button
                onClick={handleCatClick}
                className={`relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer ${isShaking ? 'spin-once' : ''}`}
              >
                <Croissant className="w-6 h-6" />
              </button>
            ) : isScore ? (
              <button
                onClick={handleDartsClick}
                className="relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer active:scale-90"
                title="Bullseye!"
              >
                <Target className={`w-6 h-6 transition-all duration-300 ${bullseyeActive ? 'text-emerald-400 scale-125 rotate-45' : 'text-defense-accent'}`} />
              </button>
            ) : (
              <button
                id="radar-trigger"
                className="relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer group"
                onClick={(e) => {
                  e.currentTarget.previousElementSibling.classList.remove('radar-active');
                  void e.currentTarget.previousElementSibling.offsetWidth;
                  e.currentTarget.previousElementSibling.classList.add('radar-active');
                  window.dispatchEvent(new Event('radar-ping'));
                }}
              >
                <SatelliteDish className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="flex flex-col leading-none min-w-[110px]">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-mono text-sm tracking-widest uppercase font-bold text-white transition-colors"
            >abi.</Link>
            {isGallery ? (
              <span className={`font-mono text-[10px] transition-colors duration-200 whitespace-nowrap ${shutterStatus === 'SYS_ONLINE' ? 'text-gray-500' : 'text-defense-accent'}`}>
                {shutterStatus}
              </span>
            ) : isPokedex ? (
              <span className={`font-mono text-[10px] transition-colors duration-200 whitespace-nowrap ${pokedexStatus === 'SYS_ONLINE' ? 'text-gray-500' : 'text-defense-accent'}`}>
                {pokedexStatus}
              </span>
            ) : isKai ? (
              <span className={`font-mono text-[10px] transition-colors duration-200 whitespace-nowrap ${catStatus === 'SYS_ONLINE' ? 'text-gray-500' : 'text-defense-accent'}`}>
                {catStatus}
              </span>
            ) : isScore ? (
              <span className={`font-mono text-[10px] whitespace-nowrap transition-colors duration-200 ${bullseyeActive ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
                {bullseyeActive ? 'BULLSEYE!' : 'DARTS_COUNTER'}
              </span>
            ) : (
              <span id="radar-status" className={`font-mono text-[10px] whitespace-nowrap ${radarStatus === 'SYS_ONLINE' ? 'text-gray-500' : 'text-defense-accent'}`}>
                {radarStatus}
              </span>
            )}
          </div>
        </div>

        {/* Center Section: Dynamic controls */}
        <div className="flex-1 flex justify-center">
          {isPokedex ? (
            <div className="flex gap-4 md:gap-8">
              <button
                onClick={() => pokedexAction('view', 'battle')}
                className="flex items-center gap-2 font-mono text-sm text-defense-muted hover:text-white transition-all group px-4 py-2"
              >
                <span className="nav-item hidden sm:inline">01_BATTLE</span>
                <span className="sm:hidden"><Sparkle /></span>
              </button>
              <button
                onClick={() => pokedexAction('view', 'pokedex')}
                className="flex items-center gap-2 font-mono text-sm text-defense-muted hover:text-white transition-all group px-4 py-2"
              >
                <span className="nav-item hidden sm:inline">02_POKÉDEX</span>
                <span className="sm:hidden"><BookUser /></span>
              </button>
              <button
                onClick={() => pokedexAction('stats', true)}
                className="flex items-center gap-2 font-mono text-sm text-defense-muted hover:text-white transition-all group px-4 py-2"
              >
                <span className="nav-item hidden sm:inline">03_OPTIONS</span>
                <span className="sm:hidden"><RectangleEllipsis /></span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex gap-8 text-sm font-mono tracking-wider text-defense-muted">
              <Link to="/#about" onClick={(e) => handleScrollToHash(e, '#about')} className="nav-item hover:text-white transition-colors py-1">01_INTEL</Link>
              <Link to="/#skills" onClick={(e) => handleScrollToHash(e, '#skills')} className="nav-item hover:text-white transition-colors py-1">02_OPS</Link>
              <Link to="/#contact" onClick={(e) => handleScrollToHash(e, '#contact')} className="nav-item hover:text-white transition-colors py-1">03_LINK</Link>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <Clock />
          </div>
        </div>
      </div>
    </nav>
  );
}
