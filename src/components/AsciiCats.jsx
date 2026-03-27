import { useState, useMemo, useEffect } from 'react';

const eyesList = ['-', 'o', '>', '<'];

function Cat({ initialN1, initialN2, isRandomlyActive }) {
  const [isHovered, setIsHovered] = useState(false);
  const [n1, setN1] = useState(initialN1);
  const [n2, setN2] = useState(initialN2);

  const invert = (e) => {
    if (e === 'o') return 'o';
    if (e === '-') return '-';
    if (e === '>') return '<';
    if (e === '<') return '>';
    return e;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    let h1 = invert(n1);
    let h2 = invert(n2);

    // wink chance
    if (Math.random() < 0.9) {
      if (Math.random() < 0.5) h1 = eyesList[Math.floor(Math.random() * eyesList.length)];
      else h2 = eyesList[Math.floor(Math.random() * eyesList.length)];
    }

    setN1(h1);
    setN2(h2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Text color override for active cat, rest remain green defense-accent
  const colorClass = isRandomlyActive
    ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] relative z-20 cursor-pointer"
    : "text-defense-accent opacity-70 relative z-10 cursor-grab";

  return (
    <div
      className={`flex flex-col items-center justify-center transition-all duration-300 whitespace-pre ${colorClass}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="leading-[1.2]">{" /\\_/\\ "}</div>
      <div className="leading-[1.2]">{`( ${n1}.${n2} )`}</div>
      <div className="leading-[1.2]">{" > ^ < "}</div>
    </div>
  );
}

export default function AsciiCats() {
  const [gridSize, setGridSize] = useState({ rows: 5, cols: 6 });
  const [activeRandomCat, setActiveRandomCat] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGridSize({ rows: 3, cols: 7 });
      } else {
        setGridSize({ rows: 5, cols: 6 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial grid generated based on size
  const initialGrid = useMemo(() => {
    let grid = [];
    for (let r = 0; r < gridSize.rows; r++) {
      let row = [];
      for (let c = 0; c < gridSize.cols; c++) {
        let n1 = eyesList[Math.floor(Math.random() * eyesList.length)];
        let n2 = Math.random() < 0.75 ? n1 : eyesList[Math.floor(Math.random() * eyesList.length)];
        row.push({ n1, n2, key: `${r}-${c}` });
      }
      grid.push(row);
    }
    return grid;
  }, [gridSize.rows, gridSize.cols]);

  const handleMouseEnterCard = () => {
    const randomR = Math.floor(Math.random() * gridSize.rows);
    const randomC = Math.floor(Math.random() * gridSize.cols);
    setActiveRandomCat(`${randomR}-${randomC}`);
  };

  const handleMouseLeaveCard = () => {
    setActiveRandomCat(null);
  };

  return (
    <div
      className="glass-panel md:col-span-4 relative flex flex-col items-center justify-center py-6 px-1 sm:p-6 overflow-hidden min-h-[160px] group border border-defense-border hover:border-defense-accent transition-colors cursor-grab"
      onMouseEnter={handleMouseEnterCard}
      onMouseLeave={handleMouseLeaveCard}
    >
      <div className="absolute inset-0 bg-[#060f09] opacity-80 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-2 font-mono text-[12px] sm:text-[10px]">
        {initialGrid.map((row, r) => (
          <div key={`row-${r}`} className="flex flex-row gap-3 sm:gap-3">
            {row.map((cat) => (
              <Cat
                key={cat.key}
                initialN1={cat.n1}
                initialN2={cat.n2}
                isRandomlyActive={activeRandomCat === cat.key}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-20 pointer-events-none opacity-40"></div>
    </div>
  );
}
