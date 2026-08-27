import { Sparkle, BookUser, RectangleEllipsis } from "lucide-react";

export default function PokedexNavLinks() {
  const pokedexAction = (action, value) => {
    window.dispatchEvent(
      new CustomEvent("pokedex-action", { detail: { action, value } })
    );
  };

  return (
    <div className="flex gap-4 md:gap-8">
      <button
        onClick={() => pokedexAction("view", "battle")}
        className="flex items-center gap-2 font-mono text-sm text-defense-muted hover:text-white transition-all group px-4 py-2"
      >
        <span className="nav-item hidden sm:inline">BATTLE</span>
        <span className="sm:hidden">
          <Sparkle />
        </span>
      </button>
      <button
        onClick={() => pokedexAction("view", "pokedex")}
        className="flex items-center gap-2 font-mono text-sm text-defense-muted hover:text-white transition-all group px-4 py-2"
      >
        <span className="nav-item hidden sm:inline">POKÉDEX</span>
        <span className="sm:hidden">
          <BookUser />
        </span>
      </button>
      <button
        onClick={() => pokedexAction("stats", true)}
        className="flex items-center gap-2 font-mono text-sm text-defense-muted hover:text-white transition-all group px-4 py-2"
      >
        <span className="nav-item hidden sm:inline">SETTINGS</span>
        <span className="sm:hidden">
          <RectangleEllipsis />
        </span>
      </button>
    </div>
  );
}
