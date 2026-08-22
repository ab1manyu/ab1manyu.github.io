import { useState, useEffect, useRef } from "react";
import {
  RotateCcw,
  Undo2,
  Zap,
  AlertTriangle,
  Calculator,
  X,
  Delete,
  Check,
  Play,
  Pause,
  Wand,
  Cake,
  Flame,
  Droplet,
  Leaf,
} from "lucide-react";
import styles from "./DartScoreCore.module.css";

const PLAYER_THEMES = [
  {
    id: 0,
    name: "GREEN",
    element: "leaf",
    icon: Leaf,
    colorHex: "#10b981",
    border: styles.themeGreenBorder,
    borderActive: styles.themeGreenBorderActive,
    bgActive: styles.themeGreenBgActive,
    bgSubtle: styles.themeGreenBgSubtle,
    bgBtn: styles.themeGreenBgBtn,
    text: styles.themeGreenText,
    dot: styles.themeGreenDot,
    badge: styles.themeGreenBadge,
  },
  {
    id: 1,
    name: "RED",
    element: "fire",
    icon: Flame,
    colorHex: "#ef4444",
    border: styles.themeRedBorder,
    borderActive: styles.themeRedBorderActive,
    bgActive: styles.themeRedBgActive,
    bgSubtle: styles.themeRedBgSubtle,
    bgBtn: styles.themeRedBgBtn,
    text: styles.themeRedText,
    dot: styles.themeRedDot,
    badge: styles.themeRedBadge,
  },
  {
    id: 2,
    name: "YELLOW",
    element: "electric",
    icon: Zap,
    colorHex: "#eab308",
    border: styles.themeYellowBorder,
    borderActive: styles.themeYellowBorderActive,
    bgActive: styles.themeYellowBgActive,
    bgSubtle: styles.themeYellowBgSubtle,
    bgBtn: styles.themeYellowBgBtn,
    text: styles.themeYellowText,
    dot: styles.themeYellowDot,
    badge: styles.themeYellowBadge,
  },
  {
    id: 3,
    name: "BLUE",
    element: "water",
    icon: Droplet,
    colorHex: "#3b82f6",
    border: styles.themeBlueBorder,
    borderActive: styles.themeBlueBorderActive,
    bgActive: styles.themeBlueBgActive,
    bgSubtle: styles.themeBlueBgSubtle,
    bgBtn: styles.themeBlueBgBtn,
    text: styles.themeBlueText,
    dot: styles.themeBlueDot,
    badge: styles.themeBlueBadge,
  },
];

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function DartboardIcon({
  type = "single",
  active = false,
  className = "w-16 h-16 sm:w-20 sm:h-20",
}) {
  const isSingle = type === "single" || type === 1;
  const isDouble = type === "double" || type === 2;
  const isTriple = type === "triple" || type === 3;

  const singleColor = active ? "#064e3b" : "#10b981";
  const doubleColor = active ? "#78350f" : "#eab308";
  const tripleColor = active ? "#7f1d1d" : "#ef4444";

  const ringDefaultStroke = active
    ? "rgba(0, 0, 0, 0.2)"
    : "rgba(255, 255, 255, 0.12)";
  const wireStroke = active
    ? "rgba(0, 0, 0, 0.35)"
    : "rgba(255, 255, 255, 0.2)";
  const spokeStroke = active
    ? "rgba(0, 0, 0, 0.18)"
    : "rgba(255, 255, 255, 0.12)";

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} pointer-events-none select-none transition-all`}
    >
      {/* 20 Spoke radial wire lines */}
      <g stroke={spokeStroke} strokeWidth="0.5">
        {[0, 18, 36, 54, 72, 90, 108, 126, 144, 162].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={(32 - 30 * Math.cos(rad)).toFixed(2)}
              y1={(32 - 30 * Math.sin(rad)).toFixed(2)}
              x2={(32 + 30 * Math.cos(rad)).toFixed(2)}
              y2={(32 + 30 * Math.sin(rad)).toFixed(2)}
            />
          );
        })}
      </g>

      {/* Outer Double Ring (width 4) - Highlighted Yellow for Double */}
      <circle
        cx="32"
        cy="32"
        r="28"
        fill="none"
        stroke={isDouble ? doubleColor : ringDefaultStroke}
        strokeWidth="4"
      />

      {/* Outer Single Bed (width 8, between double and triple) - Highlighted Green for Single */}
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke={isSingle ? singleColor : ringDefaultStroke}
        strokeWidth="8"
      />

      {/* Middle Triple Ring (width 4) - Highlighted Red for Triple */}
      <circle
        cx="32"
        cy="32"
        r="16"
        fill="none"
        stroke={isTriple ? tripleColor : ringDefaultStroke}
        strokeWidth="4"
      />

      {/* Inner Single Bed (width 8, between triple and bull) - Highlighted Green for Single */}
      <circle
        cx="32"
        cy="32"
        r="10"
        fill="none"
        stroke={isSingle ? singleColor : ringDefaultStroke}
        strokeWidth="8"
      />

      {/* Concentric Wire Boundary Circles */}
      <circle cx="32" cy="32" r="30" stroke={wireStroke} strokeWidth="0.75" />
      <circle cx="32" cy="32" r="26" stroke={wireStroke} strokeWidth="0.5" />
      <circle cx="32" cy="32" r="18" stroke={wireStroke} strokeWidth="0.5" />
      <circle cx="32" cy="32" r="14" stroke={wireStroke} strokeWidth="0.5" />
      <circle cx="32" cy="32" r="6" stroke={wireStroke} strokeWidth="0.75" />

      {/* Bullseye Center */}
      <circle
        cx="32"
        cy="32"
        r="6"
        fill={active ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.08)"}
      />
      <circle
        cx="32"
        cy="32"
        r="2.5"
        fill={active ? "rgba(0, 0, 0, 0.35)" : "rgba(255, 255, 255, 0.25)"}
      />
    </svg>
  );
}

function MatrixScoreDisplay({ score, colorClass = "text-emerald-400" }) {
  const [displayDigits, setDisplayDigits] = useState(String(score).split(""));
  const [scramblingIndices, setScramblingIndices] = useState([]);
  const prevScoreRef = useRef(score);

  useEffect(() => {
    if (prevScoreRef.current === score) return;

    const oldStr = String(prevScoreRef.current);
    const newStr = String(score);
    prevScoreRef.current = score;

    const targetDigits = newStr.split("");
    const changedIndices = [];

    for (let i = 0; i < targetDigits.length; i++) {
      if (oldStr[i] !== newStr[i]) {
        changedIndices.push(i);
      }
    }

    if (changedIndices.length === 0) {
      setDisplayDigits(targetDigits);
      return;
    }

    setScramblingIndices(changedIndices);
    let frame = 0;
    const totalFrames = 9;

    const interval = setInterval(() => {
      frame++;
      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayDigits(targetDigits);
        setScramblingIndices([]);
      } else {
        setDisplayDigits(
          targetDigits.map((d, i) => {
            if (changedIndices.includes(i)) {
              return String(Math.floor(Math.random() * 10));
            }
            return d;
          })
        );
      }
    }, 40);

    return () => clearInterval(interval);
  }, [score]);

  return (
    <span className="font-mono">
      {displayDigits.map((char, i) => (
        <span
          key={i}
          className={
            scramblingIndices.includes(i)
              ? `${colorClass} animate-pulse inline-block`
              : "inline-block"
          }
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default function DartScoreCore() {
  const [startScore, setStartScore] = useState(301);
  const [numPlayers, setNumPlayers] = useState(2);
  const [doubleOut] = useState(true);

  // Timer running state
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Custom score modal state
  const [showCustomScoreModal, setShowCustomScoreModal] = useState(false);
  const [customStartInput, setCustomStartInput] = useState("");

  // Player state
  const [players, setPlayers] = useState([
    {
      id: 1,
      name: "PLAYER 1",
      themeIndex: 0,
      score: 301,
      legs: 0,
      totalScored: 0,
      dartsThrown: 0,
      lastTurn: 0,
      history: [],
      timeSeconds: 0,
    },
    {
      id: 2,
      name: "PLAYER 2",
      themeIndex: 1,
      score: 301,
      legs: 0,
      totalScored: 0,
      dartsThrown: 0,
      lastTurn: 0,
      history: [],
      timeSeconds: 0,
    },
  ]);

  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  // Current turn input
  const [currentDarts, setCurrentDarts] = useState([]);
  const [multiplier, setMultiplier] = useState(1);

  // Per-move state undo stack
  const [undoStack, setUndoStack] = useState([]);

  const pushUndoState = () => {
    setUndoStack((prev) => [
      ...prev,
      {
        players: JSON.parse(JSON.stringify(players)),
        activePlayerIndex,
        currentDarts: [...currentDarts],
        multiplier,
        winner,
      },
    ]);
  };
  const [bustAlert, setBustAlert] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);

  // Keypad Modal state
  const [showTypeInModal, setShowTypeInModal] = useState(false);
  const [typeInValue, setTypeInValue] = useState("");

  useEffect(() => {
    if (!isTimerRunning || winner) return;

    const interval = setInterval(() => {
      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === activePlayerIndex) {
            return { ...p, timeSeconds: p.timeSeconds + 1 };
          }
          return p;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, activePlayerIndex, winner]);

  const resetMatch = (newStartScore = startScore, count = numPlayers) => {
    const newPlayers = Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `PLAYER ${i + 1}`,
      themeIndex: i % 4,
      score: newStartScore,
      legs: 0,
      totalScored: 0,
      dartsThrown: 0,
      lastTurn: 0,
      history: [],
      timeSeconds: 0,
    }));
    setPlayers(newPlayers);
    setActivePlayerIndex(0);
    setCurrentDarts([]);
    setMultiplier(1);
    setBustAlert(false);
    setWinner(null);
    setTypeInValue("");
    setIsProcessingTurn(false);
    setIsTimerRunning(true);
    setUndoStack([]);
  };

  const handleStartScoreChange = (score) => {
    setStartScore(score);
    resetMatch(score, numPlayers);
  };

  const handleCustomScoreSubmit = () => {
    const parsed = parseInt(customStartInput, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 9999) {
      setStartScore(parsed);
      resetMatch(parsed, numPlayers);
      setShowCustomScoreModal(false);
      setCustomStartInput("");
    }
  };

  const handlePlayerCountChange = (count) => {
    setNumPlayers(count);
    resetMatch(startScore, count);
  };

  const activePlayer = players[activePlayerIndex];
  const activeTheme = PLAYER_THEMES[activePlayer?.themeIndex ?? 0];
  const turnTotal = currentDarts.reduce((a, b) => a + b.value, 0);
  const canUndo = undoStack.length > 0 && !isProcessingTurn;

  const handleKeyDownRef = useRef();
  handleKeyDownRef.current = (e) => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

    if (e.key >= "0" && e.key <= "9") {
      if (!showTypeInModal && !showCustomScoreModal) {
        setShowTypeInModal(true);
        setTypeInValue(e.key);
      } else if (showTypeInModal) {
        setTypeInValue((prev) => (prev.length < 3 ? prev + e.key : prev));
      } else if (showCustomScoreModal) {
        setCustomStartInput((prev) => (prev.length < 4 ? prev + e.key : prev));
      }
    } else if (showTypeInModal) {
      if (e.key === "Backspace") {
        setTypeInValue((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const parsed = parseInt(typeInValue, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 180) {
          handleSubtractScore(parsed, 3);
          setTypeInValue("");
          setShowTypeInModal(false);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setTypeInValue("");
        setShowTypeInModal(false);
      }
    } else if (showCustomScoreModal) {
      if (e.key === "Backspace") {
        setCustomStartInput((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleCustomScoreSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setCustomStartInput("");
        setShowCustomScoreModal(false);
      }
    } else if (e.key === "Backspace" && canUndo) {
      e.preventDefault();
      handleUndo();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => handleKeyDownRef.current?.(e);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAddDart = (num) => {
    if (!activePlayer || currentDarts.length >= 3 || isProcessingTurn) return;

    pushUndoState();

    let value = num * multiplier;
    let isDouble = multiplier === 2;
    let isTriple = multiplier === 3;

    if (num === 25) {
      if (multiplier === 3) return;
      if (multiplier === 2) {
        value = 50;
        isDouble = true;
        isTriple = false;
      } else {
        value = 25;
        isDouble = false;
        isTriple = false;
      }
    } else if (num === 0) {
      value = 0;
      isDouble = false;
      isTriple = false;
    }

    const label = `${value}`;
    const dartObj = { num, label, value, multiplier, isDouble, isTriple };
    const nextDarts = [...currentDarts, dartObj];
    setCurrentDarts(nextDarts);
    setMultiplier(1);

    if (nextDarts.length === 3) {
      setIsProcessingTurn(true);
      setTimeout(() => {
        const sum = nextDarts.reduce((a, b) => a + b.value, 0);
        applyTurnScore(sum, 3, nextDarts);
        setIsProcessingTurn(false);
      }, 750);
    }
  };

  const handleSubtractScore = (scoreToSubtract = null, dartsCount = 3) => {
    if (isProcessingTurn) return;
    pushUndoState();
    let pts = scoreToSubtract;
    let dartArray = currentDarts;

    if (pts === null) {
      if (currentDarts.length > 0) {
        pts = currentDarts.reduce((a, b) => a + b.value, 0);
        dartsCount = currentDarts.length;
      } else {
        return;
      }
    } else {
      dartArray = [
        {
          label: `${pts}`,
          value: pts,
          multiplier: 1,
          isDouble: false,
          isTriple: false,
        },
      ];
    }

    applyTurnScore(pts, dartsCount, dartArray);
  };

  const handleTypeInSubmit = () => {
    const parsed = parseInt(typeInValue, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 180) {
      handleSubtractScore(parsed, 3);
      setTypeInValue("");
      setShowTypeInModal(false);
    }
  };

  const applyTurnScore = (pts, dartsCount, dartArray) => {
    if (!activePlayer) return;

    const remaining = activePlayer.score - pts;

    let isBust = false;
    if (doubleOut) {
      if (remaining < 0 || remaining === 1) isBust = true;
    } else {
      if (remaining < 0) isBust = true;
    }

    if (isBust) {
      setBustAlert(true);
      setTimeout(() => setBustAlert(false), 2200);

      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === activePlayerIndex) {
            return {
              ...p,
              dartsThrown: p.dartsThrown + dartsCount,
              lastTurn: 0,
              history: [
                ...p.history,
                { score: 0, bust: true, prevScore: p.score, darts: dartArray },
              ],
            };
          }
          return p;
        })
      );
    } else if (remaining === 0) {
      const newLegs = activePlayer.legs + 1;
      setWinner({
        name: activePlayer.name,
        legs: newLegs,
        theme: activeTheme,
        icon: activeTheme.icon,
      });

      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === activePlayerIndex) {
            return {
              ...p,
              score: startScore,
              legs: newLegs,
              totalScored: p.totalScored + pts,
              dartsThrown: p.dartsThrown + dartsCount,
              lastTurn: pts,
              history: [
                ...p.history,
                {
                  score: pts,
                  bust: false,
                  prevScore: p.score,
                  darts: dartArray,
                },
              ],
            };
          }
          return { ...p, score: startScore };
        })
      );
    } else {
      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === activePlayerIndex) {
            return {
              ...p,
              score: remaining,
              totalScored: p.totalScored + pts,
              dartsThrown: p.dartsThrown + dartsCount,
              lastTurn: pts,
              history: [
                ...p.history,
                {
                  score: pts,
                  bust: false,
                  prevScore: p.score,
                  darts: dartArray,
                },
              ],
            };
          }
          return p;
        })
      );
    }

    setCurrentDarts([]);
    setMultiplier(1);
    setActivePlayerIndex((activePlayerIndex + 1) % players.length);
  };

  const handleUndo = () => {
    if (!canUndo || undoStack.length === 0) return;

    const lastState = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));

    setPlayers(
      lastState.players.map((p, idx) => ({
        ...p,
        timeSeconds: players[idx]?.timeSeconds ?? p.timeSeconds,
      }))
    );
    setActivePlayerIndex(lastState.activePlayerIndex);
    setCurrentDarts(lastState.currentDarts);
    setMultiplier(lastState.multiplier ?? 1);
    setWinner(lastState.winner ?? null);
    setBustAlert(false);
    setIsProcessingTurn(false);
  };

  const isCustomStart = ![101, 301, 501, 701].includes(startScore);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 select-none font-mono">
      {/* FLOATING HEADER CONTROLS */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 w-full">
        {/* Left Group: Start Score Options & Players Count */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full">
          <div className="flex bg-black/60 border border-gray-800 rounded-xl p-1 text-xs shrink-0">
            {[101, 301, 501, 701].map((sc) => {
              const isHiddenOnMobile = sc === 501 || sc === 701;
              return (
                <button
                  key={sc}
                  onClick={() => handleStartScoreChange(sc)}
                  className={`px-2 sm:px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                    isHiddenOnMobile ? "hidden sm:inline-block" : ""
                  } ${
                    startScore === sc
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {sc}
                </button>
              );
            })}
            <button
              onClick={() => setShowCustomScoreModal(true)}
              className={`px-2 sm:px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                isCustomStart
                  ? "bg-emerald-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {isCustomStart ? startScore : "CUSTOM"}
            </button>
          </div>

          <div className="flex bg-black/60 border border-gray-800 rounded-xl p-1 text-xs shrink-0">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => handlePlayerCountChange(count)}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  numPlayers === count
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {count}P
              </button>
            ))}
          </div>
        </div>

        {/* Right Group: Pause & Reset Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          <button
            onClick={() => setIsTimerRunning((prev) => !prev)}
            className={`group p-2 sm:w-[84px] sm:py-1.5 shrink-0 flex items-center justify-center gap-1 rounded-xl border text-xs font-bold transition-all ${
              isTimerRunning
                ? "bg-gray-900/90 text-gray-300 border-gray-800 hover:bg-gray-800 hover:text-white"
                : "bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900"
            }`}
            title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
          >
            {isTimerRunning ? (
              <Pause className="w-3.5 h-3.5 text-gray-400 group-hover:text-white group-hover:fill-current transition-all" />
            ) : (
              <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:fill-current transition-all" />
            )}
            <span className="hidden sm:inline">
              {isTimerRunning ? "PAUSE" : "RESUME"}
            </span>
          </button>

          <button
            onClick={() => resetMatch()}
            className="p-2 sm:px-3 sm:py-1.5 bg-red-950/40 border border-red-800/80 hover:bg-red-900/60 text-red-400 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
            title="Reset Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>
      </div>

      {/* PLAYERS CARDS */}
      <div className="flex flex-row gap-1 sm:gap-3 mb-4 w-full items-stretch justify-center overflow-hidden px-1 sm:px-0">
        {players.map((p, idx) => {
          const isActive = idx === activePlayerIndex;
          const theme = PLAYER_THEMES[p.themeIndex];
          const ppd =
            p.dartsThrown > 0
              ? ((p.totalScored / p.dartsThrown) * 3).toFixed(1)
              : "0.0";

          return (
            <div
              key={`${p.id}-${numPlayers}-${startScore}`}
              onClick={() => setActivePlayerIndex(idx)}
              style={{ animationDelay: `${idx * 70}ms` }}
              className={`flex-1 min-w-0 rounded-2xl px-1 py-2.5 sm:p-4 transition-all duration-300 ease-out cursor-pointer border flex flex-col justify-between items-center text-center ${styles.cardGrow} ${
                isActive
                  ? `${theme.border} ${theme.bgActive} shadow-xl ring-1 ${theme.borderActive}`
                  : `bg-black border-gray-800/80 opacity-60 hover:opacity-90`
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full mb-1">
                {(() => {
                  const PlayerIcon = theme?.icon;
                  return PlayerIcon ? (
                    <PlayerIcon
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-all ${
                        isActive
                          ? `${theme.text} fill-current`
                          : "text-gray-500"
                      }`}
                      fill={isActive ? "currentColor" : "none"}
                    />
                  ) : null;
                })()}
                <span
                  className={`hidden sm:inline text-xs font-bold truncate ${isActive ? "text-white" : "text-gray-400"}`}
                >
                  {p.name}
                </span>
                <span
                  className={`text-[9px] sm:text-xs font-bold flex-shrink-0 ${isActive ? "text-amber-400" : "text-gray-500"}`}
                >
                  {formatTime(p.timeSeconds)}
                </span>
              </div>

              {/* Big Score Display */}
              <div
                className={`text-xl sm:text-5xl font-extrabold tracking-tight my-0.5 sm:my-2 text-center w-full ${isActive ? "text-white" : "text-gray-300"}`}
              >
                <MatrixScoreDisplay score={p.score} colorClass={theme.text} />
              </div>

              {/* Stats Footer */}
              <div className="flex items-center justify-center gap-1 sm:gap-3 w-full pt-1 text-[8px] sm:text-[10px] text-gray-400 whitespace-nowrap">
                <span>
                  AVG:{" "}
                  <strong className={isActive ? theme.text : "text-gray-400"}>
                    {ppd}
                  </strong>
                </span>
                <span>
                  LAST:{" "}
                  <strong className={isActive ? "text-white" : "text-gray-400"}>
                    {p.lastTurn}
                  </strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* BUST ALERT FLOATING TOAST */}
      {bustAlert && (
        <div className="fixed top-4 sm:top-6 inset-x-0 mx-auto w-max max-w-[90vw] z-50 bg-red-950/95 border border-red-500 text-red-100 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 sm:gap-2.5 shadow-2xl shadow-red-950/80 backdrop-blur-md animate-bounce text-center">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>BUST!</span>
        </div>
      )}

      {/* ACTIVE TURN SCORING PANEL */}
      <div className="bg-black border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md transition-all">
        {/* Active Player Header Banner */}
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 mb-4 border-b border-gray-800">
          <div className="flex flex-col justify-center">
            <span className="text-[9px] sm:text-[10px] text-gray-500 tracking-wider font-bold">
              THROWING
            </span>
            <h2
              className={`text-xs sm:text-base font-extrabold whitespace-nowrap flex items-center gap-1.5 ${activeTheme.text}`}
            >
              {(() => {
                const ActiveIcon = activeTheme?.icon;
                return ActiveIcon ? (
                  <ActiveIcon
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 fill-current"
                    fill="currentColor"
                  />
                ) : null;
              })()}
              <span>{activePlayer?.name}</span>
            </h2>
          </div>

          {/* Darts Throw Slots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden sm:inline text-xs text-gray-500 mr-1">
              DARTS:
            </span>
            {[0, 1, 2].map((i) => {
              const d = currentDarts[i];
              const isMiss = d && d.value === 0;
              const isBull = d && d.num === 25;

              return (
                <div
                  key={i}
                  className={`w-14 sm:w-20 h-10 sm:h-11 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    d
                      ? isMiss
                        ? "bg-gray-900/50 border-gray-800 text-gray-500"
                        : isBull
                          ? "bg-red-950/80 border-red-500 text-red-300 font-bold"
                          : d.isDouble
                            ? "bg-amber-950/80 border-amber-500 text-amber-300 font-bold"
                            : d.isTriple
                              ? "bg-red-950/80 border-red-500 text-red-300 font-bold"
                              : "bg-emerald-950/80 border-emerald-500 text-white font-bold"
                      : "bg-black/60 border-gray-800 text-gray-600"
                  }`}
                >
                  {d ? (
                    <div className="flex items-center justify-center gap-1 font-mono">
                      <span
                        className={`text-[10px] sm:text-xs font-medium ${isMiss ? "text-gray-600" : isBull ? "text-red-300" : "text-gray-400"}`}
                      >
                        {d.num !== undefined ? d.num : d.value}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-600">
                        |
                      </span>
                      <span
                        className={`text-xs sm:text-base font-black tracking-tight ${
                          isMiss
                            ? "text-gray-500"
                            : isBull
                              ? "text-red-400"
                              : d.multiplier === 1
                                ? "text-emerald-400"
                                : d.multiplier === 2
                                  ? "text-amber-400"
                                  : "text-red-400"
                        }`}
                      >
                        {d.value}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">-</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Multiplier Selection */}
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            1. Select Multiplier
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setMultiplier(1)}
              className={`relative overflow-hidden h-12 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center ${
                multiplier === 1
                  ? "bg-emerald-500 text-black border-emerald-400 shadow-md hover:bg-emerald-400"
                  : "bg-black/60 text-gray-300 border-gray-800 hover:border-gray-700"
              }`}
            >
              <span className="relative z-10">SINGLE (1x)</span>
              <div
                className={`absolute -top-4 -right-[50px] sm:-top-3 sm:-right-[50px] pointer-events-none transition-opacity ${
                  multiplier === 1 ? "opacity-40" : "opacity-25"
                }`}
              >
                <DartboardIcon
                  type="single"
                  active={multiplier === 1}
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
              </div>
            </button>
            <button
              onClick={() => setMultiplier(2)}
              className={`relative overflow-hidden h-12 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center ${
                multiplier === 2
                  ? "bg-amber-500 text-black border-amber-400 shadow-md"
                  : "bg-black/60 text-amber-400 border-amber-900/60 hover:border-amber-700"
              }`}
            >
              <span className="relative z-10">DOUBLE (2x)</span>
              <div
                className={`absolute -top-4 -right-[50px] sm:-top-3 sm:-right-[50px] pointer-events-none transition-opacity ${
                  multiplier === 2 ? "opacity-40" : "opacity-25"
                }`}
              >
                <DartboardIcon
                  type="double"
                  active={multiplier === 2}
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
              </div>
            </button>
            <button
              onClick={() => setMultiplier(3)}
              className={`relative overflow-hidden h-12 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center ${
                multiplier === 3
                  ? "bg-red-500 text-black border-red-400 shadow-md"
                  : "bg-black/60 text-red-400 border-red-900/60 hover:border-red-700"
              }`}
            >
              <span className="relative z-10">TRIPLE (3x)</span>
              <div
                className={`absolute -top-4 -right-[50px] sm:-top-3 sm:-right-[50px] pointer-events-none transition-opacity ${
                  multiplier === 3 ? "opacity-40" : "opacity-25"
                }`}
              >
                <DartboardIcon
                  type="triple"
                  active={multiplier === 3}
                  className="w-20 h-20 sm:w-24 sm:h-24"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Target Buttons */}
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>2. Tap Target Score</span>
            {multiplier === 2 && (
              <span className="text-amber-400 font-bold text-[10px]">
                DOUBLED SCORES ACTIVE
              </span>
            )}
            {multiplier === 3 && (
              <span className="text-red-400 font-bold text-[10px]">
                TRIPLED SCORES ACTIVE
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
            {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
              const isDbl = multiplier === 2;
              const isTrp = multiplier === 3;
              const scoreVal = num * multiplier;

              return (
                <button
                  key={num}
                  onClick={() => handleAddDart(num)}
                  disabled={isProcessingTurn}
                  className={`h-12 rounded-xl font-bold text-sm sm:text-base border transition-all active:scale-95 ${
                    isDbl
                      ? "bg-amber-950/60 text-amber-300 border-amber-500/80 hover:bg-amber-900/80 shadow-sm shadow-amber-950"
                      : isTrp
                        ? "bg-red-950/50 text-red-300 border-red-500/80 hover:bg-red-900/80"
                        : "bg-black/70 text-white border-gray-800 hover:border-gray-600 hover:bg-gray-900"
                  }`}
                >
                  {scoreVal}
                </button>
              );
            })}

            {multiplier !== 3 && (
              <button
                onClick={() => handleAddDart(25)}
                disabled={isProcessingTurn}
                className="col-span-1 h-12 rounded-xl text-xs sm:text-sm font-extrabold border transition-all bg-red-950/80 text-red-300 border-red-800/80 hover:bg-red-900"
              >
                {multiplier === 2 ? "50" : "25"}
              </button>
            )}

            <button
              onClick={() => handleAddDart(0)}
              disabled={isProcessingTurn}
              className={`h-12 rounded-xl text-xs sm:text-sm font-bold bg-black/60 text-gray-400 border border-gray-800 hover:bg-gray-800 transition-colors ${
                multiplier === 3
                  ? "col-span-5 sm:col-span-7"
                  : "col-span-4 sm:col-span-7"
              }`}
            >
              MISS (0)
            </button>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="pt-4 border-t border-gray-800 flex items-center justify-between gap-2 w-full">
          <button
            onClick={() => setShowTypeInModal(true)}
            className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>TYPE SCORE</span>
          </button>

          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="flex-[0.5] sm:flex-[0.6] h-12 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-40"
          >
            <Undo2 className="w-4 h-4" />
            <span>UNDO</span>
          </button>

          <button
            onClick={() => handleSubtractScore()}
            disabled={currentDarts.length === 0 || isProcessingTurn}
            className={`flex-1 h-12 ${activeTheme.bgBtn} font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center transition-all tracking-wider disabled:opacity-40`}
          >
            SUBTRACT {turnTotal > 0 ? `(${turnTotal})` : ""}
          </button>
        </div>
      </div>

      {/* CUSTOM START SCORE MODAL WITH KEYPAD */}
      {showCustomScoreModal && (
        <div
          onClick={() => {
            setCustomStartInput("");
            setShowCustomScoreModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-black border border-gray-800 rounded-3xl p-6 max-w-xs w-full shadow-2xl space-y-4 font-mono"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                CUSTOM START SCORE
              </span>
              <button
                onClick={() => {
                  setCustomStartInput("");
                  setShowCustomScoreModal(false);
                }}
                className="text-gray-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Display Readout */}
            <div className="h-14 bg-black border border-gray-800 rounded-2xl flex items-center justify-end px-4 text-3xl font-extrabold text-white tracking-widest">
              {customStartInput || "0"}
            </div>

            {/* On-Screen Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    if (customStartInput.length < 4)
                      setCustomStartInput((prev) => prev + n);
                  }}
                  className="h-14 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-xl font-bold text-white transition-colors"
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setCustomStartInput("")}
                className="h-14 bg-red-950/60 border border-red-800 text-red-400 rounded-xl text-xs font-bold"
              >
                CLEAR
              </button>

              <button
                onClick={() => {
                  if (customStartInput.length < 4)
                    setCustomStartInput((prev) => prev + "0");
                }}
                className="h-14 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-xl font-bold text-white transition-colors"
              >
                0
              </button>

              <button
                onClick={() => setCustomStartInput((prev) => prev.slice(0, -1))}
                className="h-14 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl flex items-center justify-center"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleCustomScoreSubmit}
              disabled={!customStartInput}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Check className="w-5 h-5" /> SET CUSTOM SCORE
            </button>
          </div>
        </div>
      )}

      {/* NUMBERS-ONLY TYPE-IN MODAL */}
      {showTypeInModal && (
        <div
          onClick={() => {
            setTypeInValue("");
            setShowTypeInModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-black border border-gray-800 rounded-3xl p-6 max-w-xs w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                ENTER ROUND SCORE
              </span>
              <button
                onClick={() => {
                  setTypeInValue("");
                  setShowTypeInModal(false);
                }}
                className="text-gray-500 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Display Readout */}
            <div className="h-14 bg-black border border-gray-800 rounded-2xl flex items-center justify-end px-4 text-3xl font-extrabold text-white tracking-widest">
              {typeInValue || "0"}
            </div>

            {/* Numbers-only Keypad */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    if (typeInValue.length < 3)
                      setTypeInValue((prev) => prev + n);
                  }}
                  className="h-14 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-xl font-bold text-white transition-colors"
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setTypeInValue("")}
                className="h-14 bg-red-950/60 border border-red-800 text-red-400 rounded-xl text-xs font-bold"
              >
                CLEAR
              </button>

              <button
                onClick={() => {
                  if (typeInValue.length < 3)
                    setTypeInValue((prev) => prev + "0");
                }}
                className="h-14 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-xl font-bold text-white transition-colors"
              >
                0
              </button>

              <button
                onClick={() => setTypeInValue((prev) => prev.slice(0, -1))}
                className="h-14 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl flex items-center justify-center"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleTypeInSubmit}
              disabled={typeInValue === ""}
              className={`w-full h-12 ${activeTheme.bgBtn} font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40`}
            >
              <Check className="w-5 h-5" /> SUBTRACT SCORE
            </button>
          </div>
        </div>
      )}

      {/* WINNER MODAL */}
      {winner && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black border border-gray-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6">
            <div
              className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto ${winner.theme?.badge}`}
            >
              {(() => {
                const WinnerIcon = winner.icon || winner.theme?.icon;
                return WinnerIcon ? (
                  <WinnerIcon className="w-8 h-8" fill="currentColor" />
                ) : null;
              })()}
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-wider">
                CONGRATULATIONS!
              </h3>
              <p className={`text-xl font-extrabold ${winner.theme.text} mt-2`}>
                {winner.name}
              </p>
              <p
                className={`text-sm font-extrabold ${winner.theme.text} opacity-40`}
              >
                TOTAL GAMES WON: {winner.legs}
              </p>
            </div>
            <button
              onClick={() => setWinner(null)}
              className={`w-full py-3.5 ${winner.theme.bgBtn} font-extrabold rounded-xl transition-all`}
            >
              NEXT LEG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
