import { useScrollToTop } from "@/shared/hooks";
import { PokedexCore } from "@/features/pokedex";

export default function Pokedex() {
  useScrollToTop();

  return (
    <div className="w-full min-h-screen pt-16 flex flex-col items-center">
      <PokedexCore />
    </div>
  );
}
