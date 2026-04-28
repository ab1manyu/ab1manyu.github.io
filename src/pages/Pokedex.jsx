import { useLayoutEffect } from 'react';
import PokedexCore from '../pokedex/PokedexCore';

export default function Pokedex() {
  useLayoutEffect(() => {
    const footer = document.querySelector('footer');
    
    const updateFooterVisibility = () => {
      if (footer) {
        if (window.innerWidth <= 768) {
          footer.style.display = 'none';
        } else {
          footer.style.display = 'block';
        }
      }
    };

    updateFooterVisibility();
    window.addEventListener('resize', updateFooterVisibility);
    window.scrollTo(0, 0);
    
    return () => {
      window.removeEventListener('resize', updateFooterVisibility);
      if (footer) footer.style.display = 'block';
    };
  }, []);

  return (
    <div className="w-full min-h-screen pt-16 flex flex-col items-center">
      <PokedexCore />
    </div>
  );
}
