import { useLayoutEffect } from "react";
import PokedexCore from "../pokedex/PokedexCore";

export default function Pokedex() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen pt-16 flex flex-col items-center">
      <PokedexCore />
    </div>
  );
}
