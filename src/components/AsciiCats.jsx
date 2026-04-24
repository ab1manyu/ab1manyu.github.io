import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const eyesList = ['-', 'o', '>', '<'];

function Cat({ initialN1, initialN2, isLit, onClick, sweeping, sweepDelay }) {
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
    let h1 = invert(n1);
    let h2 = invert(n2);
    if (Math.random() < 0.9) {
      if (Math.random() < 0.5) h1 = eyesList[Math.floor(Math.random() * eyesList.length)];
      else h2 = eyesList[Math.floor(Math.random() * eyesList.length)];
    }
    setN1(h1);
    setN2(h2);
  };

  const handleMouseLeave = () => {
    setN1(initialN1);
    setN2(initialN2);
  };

  const colorClass = isLit
    ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)] relative z-20 cursor-pointer'
    : 'text-defense-accent opacity-70 relative z-10 cursor-pointer';

  const sweepStyle = sweeping
    ? {
      transitionProperty: 'color, filter, opacity',
      transitionDuration: '180ms',
      transitionDelay: `${sweepDelay}ms`,
      color: '#4ade80',
      filter: 'drop-shadow(0 0 10px #4ade80)',
      opacity: 0.5,
    }
    : {};

  return (
    <div
      className={`flex flex-col items-center justify-center transition-all duration-300 whitespace-pre ${colorClass}`}
      style={sweepStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="leading-[1.2]">{" /\\_/\\ "}</div>
      <div className="leading-[1.2]">{`( ${n1}.${n2} )`}</div>
      <div className="leading-[1.2]">{" > ^ < "}</div>
    </div>
  );
}

export default function AsciiCats() {
  const [gridSize, setGridSize] = useState({ rows: 4, cols: 5 });
  const [litCats, setLitCats] = useState(new Set());
  const [sweeping, setSweeping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGridSize({ rows: 3, cols: 4 });
      } else {
        setGridSize({ rows: 4, cols: 4 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const totalCats = gridSize.rows * gridSize.cols;
  const maxDiagonal = (gridSize.rows - 1) + (gridSize.cols - 1);
  const sweepStepMs = 60;
  const sweepDuration = maxDiagonal * sweepStepMs + 200;

  const handleCatClick = (key) => {
    setLitCats(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      const rows = gridSize.rows;
      const cols = gridSize.cols;
      const corners = [
        `0-0`,
        `0-${cols - 1}`,
        `${rows - 1}-0`,
        `${rows - 1}-${cols - 1}`
      ];

      // Check if corners are lit
      const allCornersLit = corners.every(c => next.has(c));
      
      // If corners are lit and possibly some others, but let's make it more specific:
      // Pattern: Only corners lit or Corners + something else?
      // "corners being highlighted" usually means the 4 corners.
      // I'll trigger it if the 4 corners are lit, even if others are too.
      if (allCornersLit && next.size === 4) {
         setTimeout(() => {
          setSweeping(true);
          setTimeout(() => navigate('/pokedex'), sweepDuration + 100);
        }, 150);
      }

      if (next.size === totalCats) {
        setTimeout(() => {
          setSweeping(true);
          setTimeout(() => navigate('/kai'), sweepDuration + 100);
        }, 150);
      }
      return next;
    });
  };

  return (
    <div className="glass-panel md:col-span-4 relative flex flex-col items-center justify-center py-6 px-1 sm:p-6 overflow-hidden min-h-[160px] group border border-defense-border hover:border-defense-accent transition-colors cursor-default">
      <div className="absolute inset-0 bg-[#060f09] opacity-80 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-2 font-mono text-[12px] sm:text-[10px]">
        {initialGrid.map((row, r) => (
          <div key={`row-${r}`} className="flex flex-row gap-3 sm:gap-3">
            {row.map((cat, c) => (
              <Cat
                key={cat.key}
                initialN1={cat.n1}
                initialN2={cat.n2}
                isLit={litCats.has(cat.key)}
                onClick={() => handleCatClick(cat.key)}
                sweeping={sweeping}
                sweepDelay={(r + c) * sweepStepMs}
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
