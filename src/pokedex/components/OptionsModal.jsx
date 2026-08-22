import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  resetRun,
  exportData,
  importData,
  getLastCaughtTime,
} from "../db/pokemonDB";
import {
  getEarnedBadges,
  TYPE_COLORS,
  getTypeTotals,
  GENERATIONS,
} from "../data/pokemonData";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./OptionsModal.module.css";

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
      <div>
        {d
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          .toUpperCase()}
      </div>
      <div>
        {d
          .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          .toUpperCase()}
      </div>
    </>
  );
}

export default function OptionsModal({
  caughtIds,
  runStart,
  onClose,
  onReset,
  generation,
  generationData,
  setGeneration,
}) {
  const caughtCount = caughtIds.size;
  const total = generationData.length;
  const targetProgress =
    total > 0 ? Math.round((caughtCount / total) * 100) : 0;
  const [displayProgress, setDisplayProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  const earnedBadges = useMemo(
    () => getEarnedBadges(generationData, caughtIds),
    [generationData, caughtIds]
  );
  const typeTotals = useMemo(
    () => getTypeTotals(generationData),
    [generationData]
  );
  const isFairyGen = ["kalos", "alola", "galar", "paldea"].includes(generation);
  const typesWithBadges = Object.keys(TYPE_COLORS).filter((t) => {
    if (t === "fairy" && !isFairyGen) return false;
    return typeTotals[t];
  });

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
  const [isClosing, setIsClosing] = useState(false);
  const [completeTime, setCompleteTime] = useState(null);
  const fileInputRef = useRef(null);
  const overlayRef = useRef(null);

  const triggerClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  }, [isClosing, onClose]);

  // live elapsed timer
  useEffect(() => {
    let id;
    if (total > 0 && caughtCount >= total) {
      getLastCaughtTime(generation).then((lastTime) => {
        if (lastTime) {
          setCompleteTime(lastTime - runStart);
          setElapsed(lastTime - runStart);
        }
      });
    } else {
      setCompleteTime(null);
      id = setInterval(() => setElapsed(Date.now() - runStart), 1000);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [runStart, caughtCount, total, generation]);

  // close on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) triggerClose();
  };

  // close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") triggerClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [triggerClose]);

  const switchGeneration = (dir) => {
    const currentIndex = GENERATIONS.indexOf(generation);
    const nextIndex =
      (currentIndex + dir + GENERATIONS.length) % GENERATIONS.length;
    setGeneration(GENERATIONS[nextIndex]);
  };

  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = async () => {
    await resetRun(generation);
    setConfirmReset(false);
    onReset();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      await importData(generation, ev.target.result);
      onReset();
    };
    reader.readAsText(file);
  };

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div
        className={`${styles.modal} ${isClosing ? styles.closing : ""}`}
        role="dialog"
        aria-label="Run Statistics"
      >
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.headerLabel}>OPTIONS</span>
        </div>

        {/* Generation Switcher */}
        <div className={styles.genSwitcher}>
          <button
            className={styles.genBtn}
            onClick={() => switchGeneration(-1)}
          >
            <ChevronDown />
          </button>
          <span className={styles.genLabel}>
            {generation.toUpperCase()} POKÉDEX
          </span>
          <button className={styles.genBtn} onClick={() => switchGeneration(1)}>
            <ChevronUp />
          </button>
        </div>

        {/* % Slider */}
        <div className={styles.section}>
          <div className={styles.sliderRow}>
            <span className={styles.sliderValue}>{displayProgress}%</span>
            <div
              className={styles.sliderTrack}
              role="progressbar"
              aria-valuenow={displayProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={styles.sliderFill}
                style={{ width: `${mounted ? targetProgress : 0}%` }}
              />
              {targetProgress < 100 && (
                <div
                  className={styles.sliderGlow}
                  style={{ left: `${mounted ? targetProgress : 0}%` }}
                />
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
              {caughtCount}
              <span className={styles.statOf}>/{total}</span>
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>REMAINING</span>
            <span className={styles.statValue}>
              {Math.max(0, total - caughtCount)}
            </span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>STARTED</span>
            <span className={styles.statValueSm}>{formatDate(runStart)}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>RUN TIME</span>
            <span
              className={styles.statValue}
              style={
                completeTime !== null
                  ? {
                      color: "var(--yellow)",
                      textShadow: "0 0 10px rgba(249, 199, 79, 0.4)",
                    }
                  : {}
              }
            >
              {formatDuration(elapsed)}
            </span>
          </div>
        </div>

        {/* Badges Area */}
        <div className={styles.badgesSection}>
          <p className={styles.badgeSectionTitle}>TYPE BADGES</p>
          <div className={styles.badgesGrid}>
            {typesWithBadges.map((type) => {
              const isEarned = earnedBadges.includes(type);
              const color = TYPE_COLORS[type];
              return (
                <div
                  key={type}
                  className={`${styles.badgeSlot} ${isEarned ? styles.badgeEarned : ""}`}
                  title={`${type.toUpperCase()} TYPE`}
                  style={
                    isEarned
                      ? {
                          "--badge-color": color,
                          boxShadow: `0 0 12px ${color}80`,
                        }
                      : {}
                  }
                >
                  <span
                    className={styles.badgeText}
                    style={isEarned ? { color: "#fff" } : {}}
                  >
                    {type.substring(0, 3).toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            id="stats-export-btn"
            className={styles.actionBtn}
            onClick={() => exportData(generation)}
          >
            EXPORT
          </button>
          <button
            id="stats-import-btn"
            className={styles.actionBtn}
            onClick={() => fileInputRef.current?.click()}
          >
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
            <button
              id="stats-reset-btn"
              className={`${styles.actionBtn} ${styles.resetBtn}`}
              onClick={() => setConfirmReset(true)}
            >
              RESET
            </button>
          ) : (
            <div className={styles.confirmRow}>
              <span className={styles.confirmLabel}>CONFIRM RESET?</span>
              <button
                className={`${styles.actionBtn} ${styles.confirmYes}`}
                onClick={handleReset}
              >
                YES
              </button>
              <button
                className={styles.actionBtn}
                onClick={() => setConfirmReset(false)}
              >
                NO
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
