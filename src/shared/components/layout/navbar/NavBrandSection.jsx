import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { SatelliteDish, Camera, Croissant, Target } from "lucide-react";
import PokeballIcon from "../../icons/PokeballIcon";
import styles from "./Navbar.module.css";

export default function NavBrandSection() {
  const location = useLocation();
  const isGallery = location.pathname === "/gallery";
  const isPokedex = location.pathname === "/pokedex";
  const isKai = location.pathname === "/kai";
  const isScore = location.pathname === "/darts";

  const [radarStatus, setRadarStatus] = useState("SYS_ONLINE");
  const [shutterStatus, setShutterStatus] = useState("SYS_ONLINE");
  const [pokedexStatus, setPokedexStatus] = useState("SYS_ONLINE");
  const [catStatus, setCatStatus] = useState("SYS_ONLINE");
  const [bullseyeActive, setBullseyeActive] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const radarPulseRef = useRef(null);

  useEffect(() => {
    const handleScanning = () => setRadarStatus("SCANNING...");
    const handleRevealed = () => {
      setRadarStatus((prev) => {
        if (prev === "SCANNING...") return "1 TARGET";
        const count = parseInt(prev.split(" ")[0]) || 0;
        return `${count + 1} TARGETS`;
      });
    };
    const handleComplete = () => setRadarStatus("SYS_ONLINE");

    window.addEventListener("radar-scanning", handleScanning);
    window.addEventListener("bogey-revealed", handleRevealed);
    window.addEventListener("radar-complete", handleComplete);

    return () => {
      window.removeEventListener("radar-scanning", handleScanning);
      window.removeEventListener("bogey-revealed", handleRevealed);
      window.removeEventListener("radar-complete", handleComplete);
    };
  }, []);

  const handleCameraClick = () => {
    setShutterStatus("CLICK!");
    window.dispatchEvent(new Event("camera-flash"));
    setTimeout(() => setShutterStatus("SYS_ONLINE"), 900);
  };

  const handlePokeballClick = () => {
    setIsShaking(true);
    setPokedexStatus("GOTTA CATCH EM ALL!");
    setTimeout(() => {
      setIsShaking(false);
      setPokedexStatus("SYS_ONLINE");
    }, 750);
  };

  const handleCatClick = () => {
    setIsShaking(true);
    setCatStatus("MIAU!");
    setTimeout(() => {
      setIsShaking(false);
      setCatStatus("SYS_ONLINE");
    }, 750);
  };

  const handleDartsClick = () => {
    if (isScore) {
      setBullseyeActive(true);
      window.dispatchEvent(new Event("darts-spiral"));
      setTimeout(() => {
        setBullseyeActive(false);
      }, 1500);
    }
  };

  const handleRadarClick = () => {
    if (radarPulseRef.current) {
      radarPulseRef.current.classList.remove(styles.radarActive);
      void radarPulseRef.current.offsetWidth;
      radarPulseRef.current.classList.add(styles.radarActive);
    }
    window.dispatchEvent(new Event("radar-ping"));
  };

  return (
    <div className="flex items-center gap-4">
      {/* Action Icon Button */}
      <div className="relative flex items-center justify-center w-10 h-10">
        <div
          ref={radarPulseRef}
          className="absolute w-full h-full border border-defense-accent rounded-full opacity-0 scale-0 pointer-events-none"
        ></div>

        {isGallery ? (
          <button
            className="relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer"
            onClick={handleCameraClick}
            aria-label="Camera shutter"
          >
            <Camera className="w-6 h-6" />
          </button>
        ) : isPokedex ? (
          <button
            onClick={handlePokeballClick}
            className={`relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer ${
              isShaking ? styles.pokeballShake : ""
            }`}
            aria-label="Pokeball action"
          >
            <PokeballIcon className="w-6 h-6" />
          </button>
        ) : isKai ? (
          <button
            onClick={handleCatClick}
            className={`relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer ${
              isShaking ? styles.spinOnce : ""
            }`}
            aria-label="Cat spin"
          >
            <Croissant className="w-6 h-6" />
          </button>
        ) : isScore ? (
          <button
            onClick={handleDartsClick}
            className="relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer active:scale-90"
            title="Bullseye!"
            aria-label="Bullseye target"
          >
            <Target
              className={`w-6 h-6 transition-all duration-300 ${
                bullseyeActive
                  ? "text-emerald-400 scale-125 rotate-45"
                  : "text-defense-accent"
              }`}
            />
          </button>
        ) : (
          <button
            id="radar-trigger"
            className="relative z-10 text-defense-accent hover:text-white transition-colors outline-none cursor-pointer group"
            onClick={handleRadarClick}
            aria-label="Radar scan"
          >
            <SatelliteDish className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Brand Title (abi.) on TOP of changing status text */}
      <div className="flex flex-col leading-none min-w-[110px]">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-mono text-sm tracking-widest uppercase font-bold text-white transition-colors"
        >
          abi.
        </Link>
        {isGallery ? (
          <span
            className={`font-mono text-[10px] transition-colors duration-200 whitespace-nowrap ${
              shutterStatus === "SYS_ONLINE"
                ? "text-gray-500"
                : "text-defense-accent"
            }`}
          >
            {shutterStatus}
          </span>
        ) : isPokedex ? (
          <span
            className={`font-mono text-[10px] transition-colors duration-200 whitespace-nowrap ${
              pokedexStatus === "SYS_ONLINE"
                ? "text-gray-500"
                : "text-defense-accent"
            }`}
          >
            {pokedexStatus}
          </span>
        ) : isKai ? (
          <span
            className={`font-mono text-[10px] transition-colors duration-200 whitespace-nowrap ${
              catStatus === "SYS_ONLINE"
                ? "text-gray-500"
                : "text-defense-accent"
            }`}
          >
            {catStatus}
          </span>
        ) : isScore ? (
          <span
            className={`font-mono text-[10px] whitespace-nowrap transition-colors duration-200 ${
              bullseyeActive ? "text-emerald-400 font-bold" : "text-gray-500"
            }`}
          >
            {bullseyeActive ? "BULLSEYE!" : "DARTS_COUNTER"}
          </span>
        ) : (
          <span
            id="radar-status"
            className={`font-mono text-[10px] whitespace-nowrap ${
              radarStatus === "SYS_ONLINE"
                ? "text-gray-500"
                : "text-defense-accent"
            }`}
          >
            {radarStatus}
          </span>
        )}
      </div>
    </div>
  );
}
