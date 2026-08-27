import { useLocation } from "react-router-dom";
import Clock from "./Clock";
import NavBrandSection from "./navbar/NavBrandSection";
import PokedexNavLinks from "./navbar/PokedexNavLinks";
import HomeNavLinks from "./navbar/HomeNavLinks";

export default function Navbar() {
  const location = useLocation();
  const isPokedex = location.pathname === "/pokedex";

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-defense-border bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left Section: Action Icon + Brand Name (abi.) stacked above status */}
        <NavBrandSection />

        {/* Center Section: Dynamic Controls */}
        <div className="flex-1 flex justify-center">
          {isPokedex ? <PokedexNavLinks /> : <HomeNavLinks />}
        </div>

        {/* Right Section: Clock */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <Clock />
          </div>
        </div>
      </div>
    </nav>
  );
}
