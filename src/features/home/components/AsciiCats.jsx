import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CatCell from "./CatCell";
import styles from "./AsciiCats.module.css";

const eyesList = ["-", "o", ">", "<"];

const generateGrid = (rows, cols) => {
  let grid = [];
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      let n1 = eyesList[Math.floor(Math.random() * eyesList.length)];
      let n2 =
        Math.random() < 0.75
          ? n1
          : eyesList[Math.floor(Math.random() * eyesList.length)];
      row.push({ n1, n2, key: `${r}-${c}` });
    }
    grid.push(row);
  }
  return grid;
};

export default function AsciiCats() {
  const [gridSize, setGridSize] = useState({ rows: 4, cols: 5 });
  const [litCats, setLitCats] = useState(new Set());
  const [sweeping, setSweeping] = useState(false);
  const [initialGrid, setInitialGrid] = useState(() => generateGrid(4, 5));
  const timeoutRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timeouts = timeoutRefs.current;
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setGridSize({ rows: 3, cols: 4 });
      } else {
        setGridSize({ rows: 4, cols: 4 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setInitialGrid(generateGrid(gridSize.rows, gridSize.cols));
    setLitCats(new Set());
  }, [gridSize.rows, gridSize.cols]);

  const totalCats = gridSize.rows * gridSize.cols;
  const maxDiagonal = gridSize.rows - 1 + (gridSize.cols - 1);
  const sweepStepMs = 60;
  const sweepDuration = maxDiagonal * sweepStepMs + 200;

  const handleCatClick = (key) => {
    setLitCats((prev) => {
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
        `${rows - 1}-${cols - 1}`,
      ];

      const middleCats = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (r > 0 && r < rows - 1 && c > 0 && c < cols - 1) {
            middleCats.push(`${r}-${c}`);
          }
        }
      }

      // Check if corners are lit
      const allCornersLit = corners.every((c) => next.has(c));
      const allMiddleLit =
        middleCats.length > 0 && middleCats.every((c) => next.has(c));

      // 4 Corners lit -> Pokedex
      if (allCornersLit && next.size === 4) {
        const t1 = setTimeout(() => {
          setSweeping(true);
          const t2 = setTimeout(
            () => navigate("/pokedex"),
            sweepDuration + 100
          );
          timeoutRefs.current.push(t2);
        }, 150);
        timeoutRefs.current.push(t1);
      }

      // Middle cats lit -> Game Score Darts Counter (/darts)
      if (allMiddleLit && next.size === middleCats.length) {
        const t1 = setTimeout(() => {
          setSweeping(true);
          const t2 = setTimeout(() => navigate("/darts"), sweepDuration + 100);
          timeoutRefs.current.push(t2);
        }, 150);
        timeoutRefs.current.push(t1);
      }

      // All cats lit -> Kai
      if (next.size === totalCats) {
        const t1 = setTimeout(() => {
          setSweeping(true);
          const t2 = setTimeout(() => navigate("/kai"), sweepDuration + 100);
          timeoutRefs.current.push(t2);
        }, 150);
        timeoutRefs.current.push(t1);
      }
      return next;
    });
  };

  return (
    <div className="glass-panel md:col-span-4 relative flex flex-col items-center justify-center py-6 px-1 sm:p-6 overflow-hidden min-h-[160px] group border border-defense-border hover:border-defense-accent transition-colors cursor-default select-none">
      <div
        className={`absolute inset-0 opacity-80 pointer-events-none ${styles.container}`}
      ></div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-3 sm:gap-2 font-mono text-[12px] sm:text-[10px]">
        {initialGrid.map((row, r) => (
          <div key={`row-${r}`} className="flex flex-row gap-3 sm:gap-3">
            {row.map((cat, c) => (
              <CatCell
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
      <div className={styles.scanlineOverlay}></div>
    </div>
  );
}
