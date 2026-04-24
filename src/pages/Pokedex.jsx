import { useLayoutEffect } from 'react';
import PokedexCore from '../pokedex/PokedexCore';

export default function Pokedex() {
  useLayoutEffect(() => {
    // Hide footer on this page
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    
    window.scrollTo(0, 0);
    
    return () => {
      if (footer) footer.style.display = 'block';
    };
  }, []);

  return (
    <div className="w-full min-h-screen pt-16 flex flex-col items-center">
      <PokedexCore />
    </div>
  );
}
