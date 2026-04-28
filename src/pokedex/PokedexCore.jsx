import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getCaughtIds, getRunStart, getSeenBadges, addSeenBadge } from "./db/pokemonDB";
import { getEarnedBadges } from "./data/pokemonData";
import BattleScreen from "./components/BattleScreen";
import PokedexScreen from "./components/PokedexScreen";
import OptionsModal from "./components/OptionsModal";
import styles from "./PokedexCore.module.css";
import "./pokedex-global.css";

export const GENERATIONS = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea'];

export default function PokedexCore() {
  const [view, setView] = useState("battle"); // battle | pokedex
  const [currentGeneration, setCurrentGeneration] = useState("unova");
  const [generationData, setGenerationData] = useState([]);

  const [caughtIds, setCaughtIds] = useState(new Set());
  const [runStart, setRunStart] = useState(Date.now());
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [toasts, setToasts] = useState([]); // [{id, type, title, sub}]

  const refreshData = useCallback(async () => {
    setDataLoaded(false);
    try {
      const ids = await getCaughtIds(currentGeneration);
      const start = await getRunStart(currentGeneration);
      setCaughtIds(ids);
      setRunStart(start);

      const module = await import(`./data/generations/${currentGeneration}.json`);
      setGenerationData(module.default || module);
    } catch (e) {
      console.error(e);
    } finally {
      setDataLoaded(true);
    }
  }, [currentGeneration]);

  useEffect(() => {
    refreshData();

    // Listen for navbar actions
    const handleAction = (e) => {
      const { action, value } = e.detail;
      if (action === 'view') setView(value);
      if (action === 'stats') setShowStats(value);
    };

    window.addEventListener('pokedex-action', handleAction);
    return () => window.removeEventListener('pokedex-action', handleAction);
  }, [refreshData]);

  // Achievement checking
  useEffect(() => {
    if (!dataLoaded || generationData.length === 0) return;
    const earned = getEarnedBadges(generationData, caughtIds);
    const isFairyGen = ['kalos', 'alola', 'galar', 'paldea'].includes(currentGeneration);
    getSeenBadges(currentGeneration).then(seen => {
      const newlyEarned = earned.filter(badge => {
        if (badge === 'fairy' && !isFairyGen) return false;
        return !seen.includes(badge);
      });
      newlyEarned.forEach(badge => {
        addSeenBadge(currentGeneration, badge);
        addToast("badge", "NEW BADGE!", `${badge.toUpperCase()} TYPE MASTERED`);
      });
    });
  }, [caughtIds, dataLoaded, currentGeneration, generationData]);

  const addToast = (type, title, sub) => {
    const id = Date.now() + Math.random();
    setToasts(prev => {
      const next = [...prev, { id, type, title, sub }];
      if (next.length > 3) return next.slice(1);
      return next;
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const handleCatch = async () => {
    const ids = await getCaughtIds(currentGeneration);
    setCaughtIds(ids);
  };

  if (!dataLoaded) {
    return (
      <div className={styles.loadingScreen}>
        <span className={styles.pokeballSpinner} />
        <p className={styles.loadingText}>ESTABLISHING CONNECTION…</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        {view === "battle" ? (
          <BattleScreen
            caughtIds={caughtIds}
            onCatch={handleCatch}
            generation={currentGeneration}
            generationData={generationData}
          />
        ) : (
          <PokedexScreen
            caughtIds={caughtIds}
            generation={currentGeneration}
            generationData={generationData}
          />
        )}
      </main>

      {showStats && (
        <OptionsModal
          caughtIds={caughtIds}
          runStart={runStart}
          onClose={() => setShowStats(false)}
          onReset={refreshData}
          generation={currentGeneration}
          generationData={generationData}
          setGeneration={setCurrentGeneration}
        />
      )}

      {/* Toasts */}
      <div className={styles.toastContainer}>
        {toasts.map(t => (
          <div key={t.id} className={styles.toast}>
            <div className={styles.toastIcon} style={{ background: "var(--theme-color)" }}>◉</div>
            <div className={styles.toastText}>
              <h4 className={styles.toastTitle}>{t.title}</h4>
              <p className={styles.toastSub}>{t.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
