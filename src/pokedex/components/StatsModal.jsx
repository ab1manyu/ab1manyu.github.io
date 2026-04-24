import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { resetRun, exportData, importData, getLastCaughtTime } from "../db/pokemonDB";
import { UNOVA_POKEMON, TYPE_COLORS, getEarnedBadges, TYPE_TOTALS } from "../data/unovaPokemon";
import styles from "./StatsModal.module.css";

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function formatDate(ms) {
  const d = new Date(ms);
  return (
    <>
      <div>{d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }).toUpperCase()}</div>
      <div>{d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }).toUpperCase()}</div>
    </>
  );
}

export default function StatsModal({ caughtIds, runStart, onClose, onReset }) {
  const caughtCount = caughtIds.size;
  const total = UNOVA_POKEMON.length;
  const targetProgress = total > 0 ? Math.round((caughtCount / total) * 100) : 0;
  const [displayProgress, setDisplayProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  const earnedBadges = useMemo(() => getEarnedBadges(caughtIds), [caughtIds]);
  const typesWithBadges = Object.keys(TYPE_COLORS).filter(t => TYPE_TOTALS[t]);

  useEffect(() => {
    setMounted(true);
    let start = null;
    const duration = 600;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayProgress(Math.round(easeOutQuart * targetProgress));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [targetProgress]);


  const [elapsed, setElapsed] = useState(Date.now() - runStart);
  const [completeTime, setCompleteTime] = useState(null);
  const fileInputRef = useRef(null);
  const overlayRef = useRef(null);

  // live elapsed timer
  useEffect(() => {
    let id;
    if (caughtCount >= total) {
      getLastCaughtTime().then(lastTime => {
        if (lastTime) {
          setCompleteTime(lastTime - runStart);
          setElapsed(lastTime - runStart);
        }
      });
    } else {
      id = setInterval(() => setElapsed(Date.now() - runStart), 1000);
    }
    return () => { if (id) clearInterval(id); };
  }, [runStart, caughtCount, total]);

  // close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    await resetRun();
    setConfirmReset(false);
    onReset();
    onClose();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      await importData(ev.target.result);
      onReset();
      onClose();
    };
    reader.readAsText(file);
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-label="Run Statistics">

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerLabel}>STATS</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* % Slider */}
        <div className={styles.section}>
          <div className={styles.sliderRow}>
            <span className={styles.sliderValue}>{displayProgress}%</span>
            <div className={styles.sliderTrack} role="progressbar" aria-valuenow={displayProgress} aria-valuemin={0} aria-valuemax={100}>
              <div className={styles.sliderFill} style={{ width: `${mounted ? targetProgress : 0}%` }} />
              {targetProgress < 100 && (
                <div className={styles.sliderGlow} style={{ left: `${mounted ? targetProgress : 0}%` }} />
              )}
            </div>
          </div>
          <p className={styles.sliderSublabel}>DEX COMPLETION</p>
        </div>

        {/* Stats grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>CAUGHT</span>
            <span className={styles.statValue}>
              {caughtCount}<span className={styles.statOf}>/{total}</span>
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>REMAINING</span>
            <span className={styles.statValue}>{total - caughtCount}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>STARTED</span>
            <span className={styles.statValueSm}>{formatDate(runStart)}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>RUN TIME</span>
            <span className={styles.statValue} style={completeTime !== null ? { color: 'var(--yellow)', textShadow: '0 0 10px rgba(249, 199, 79, 0.4)' } : {}}>
              {formatDuration(elapsed)}
            </span>
          </div>
        </div>

        {/* Badges Area */}
        <div className={styles.badgesSection}>
          <p className={styles.badgeSectionTitle}>TYPE BADGES</p>
          <div className={styles.badgesGrid}>
            {typesWithBadges.map(type => {
              const isEarned = earnedBadges.includes(type);
              const color = TYPE_COLORS[type];
              return (
                <div 
                  key={type} 
                  className={`${styles.badgeSlot} ${isEarned ? styles.badgeEarned : ''}`}
                  title={`${type.toUpperCase()} TYPE`}
                  style={isEarned ? { '--badge-color': color, boxShadow: `0 0 12px ${color}80` } : {}}
                >
                  <span 
                    className={styles.badgeText}
                    style={isEarned ? { color: '#fff' } : {}}
                  >
                    {type.substring(0,3).toUpperCase()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button id="stats-export-btn" className={styles.actionBtn} onClick={exportData}>
            EXPORT
          </button>
          <button id="stats-import-btn" className={styles.actionBtn} onClick={() => fileInputRef.current?.click()}>
            IMPORT
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: "none" }}
            onChange={handleImport}
          />

          {!confirmReset ? (
            <button id="stats-reset-btn" className={`${styles.actionBtn} ${styles.resetBtn}`} onClick={() => setConfirmReset(true)}>
              RESET
            </button>
          ) : (
             <div className={styles.confirmRow}>
              <span className={styles.confirmLabel}>CONFIRM RESET?</span>
              <button className={`${styles.actionBtn} ${styles.confirmYes}`} onClick={handleReset}>YES</button>
              <button className={styles.actionBtn} onClick={() => setConfirmReset(false)}>NO</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
