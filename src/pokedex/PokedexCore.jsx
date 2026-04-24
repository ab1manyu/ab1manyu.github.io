import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { getCaughtIds, getRunStart, getSeenBadges, addSeenBadge } from "./db/pokemonDB";
import { UNOVA_POKEMON, getEarnedBadges } from "./data/unovaPokemon";
import BattleScreen from "./components/BattleScreen";
import PokedexScreen from "./components/PokedexScreen";
import StatsModal from "./components/StatsModal";
import styles from "./PokedexCore.module.css";
import "./pokedex-global.css";

export default function PokedexCore() {
  const [view, setView] = useState("battle"); // battle | pokedex
  const [caughtIds, setCaughtIds] = useState(new Set());
  const [runStart, setRunStart] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [toasts, setToasts] = useState([]); // [{id, type, title, sub}]

  const refreshData = useCallback(async () => {
    const ids = await getCaughtIds();
    const start = await getRunStart();
    setCaughtIds(ids);
    setRunStart(start);
    setLoading(false);
  }, []);

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
    if (loading) return;
    const earned = getEarnedBadges(caughtIds);
    getSeenBadges().then(seen => {
      const newlyEarned = earned.filter(badge => !seen.includes(badge));
      newlyEarned.forEach(badge => {
        addSeenBadge(badge);
        addToast("badge", "NEW BADGE!", `${badge.toUpperCase()} TYPE MASTERED`);
      });
    });
  }, [caughtIds, loading]);

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
    const ids = await getCaughtIds();
    setCaughtIds(ids);
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <span className={styles.pokeballSpinner} />
        <p className={styles.loadingText}>ESTABLISHING CONNECTION…</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {/* Navbar is now external, so we just render the main content */}
      <main className={styles.main}>
        {view === "battle" ? (
          <BattleScreen caughtIds={caughtIds} onCatch={handleCatch} />
        ) : (
          <PokedexScreen caughtIds={caughtIds} />
        )}
      </main>

      {showStats && (
        <StatsModal
          caughtIds={caughtIds}
          runStart={runStart}
          onClose={() => setShowStats(false)}
          onReset={refreshData}
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
