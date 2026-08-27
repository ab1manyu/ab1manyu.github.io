import { useState, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { PLAYER_THEMES } from "./dartsThemes";
import GameHeader from "./components/GameHeader";
import PlayerCard from "./components/PlayerCard";
import ActiveTurnPanel from "./components/ActiveTurnPanel";
import CustomScoreModal from "./components/CustomScoreModal";
import TypeInModal from "./components/TypeInModal";
import WinnerModal from "./components/WinnerModal";

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

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 select-none font-mono">
      {/* Floating Header Controls */}
      <GameHeader
        startScore={startScore}
        onStartScoreChange={handleStartScoreChange}
        onOpenCustomScore={() => setShowCustomScoreModal(true)}
        numPlayers={numPlayers}
        onPlayerCountChange={handlePlayerCountChange}
        isTimerRunning={isTimerRunning}
        onToggleTimer={() => setIsTimerRunning((prev) => !prev)}
        onResetMatch={() => resetMatch()}
      />

      {/* Players Cards */}
      <div className="flex flex-row gap-1 sm:gap-3 mb-4 w-full items-stretch justify-center overflow-hidden px-1 sm:px-0">
        {players.map((p, idx) => (
          <PlayerCard
            key={`${p.id}-${numPlayers}-${startScore}`}
            player={p}
            isActive={idx === activePlayerIndex}
            theme={PLAYER_THEMES[p.themeIndex]}
            idx={idx}
            onSelect={() => setActivePlayerIndex(idx)}
          />
        ))}
      </div>

      {/* Bust Alert Floating Toast */}
      {bustAlert && (
        <div className="fixed top-4 sm:top-6 inset-x-0 mx-auto w-max max-w-[90vw] z-50 bg-red-950/95 border border-red-500 text-red-100 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 sm:gap-2.5 shadow-2xl shadow-red-950/80 backdrop-blur-md animate-bounce text-center">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>BUST!</span>
        </div>
      )}

      {/* Active Turn Scoring Panel */}
      <ActiveTurnPanel
        activePlayer={activePlayer}
        activeTheme={activeTheme}
        currentDarts={currentDarts}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        isProcessingTurn={isProcessingTurn}
        onAddDart={handleAddDart}
        onOpenTypeIn={() => setShowTypeInModal(true)}
        onUndo={handleUndo}
        canUndo={canUndo}
        onSubtractScore={handleSubtractScore}
      />

      {/* Custom Start Score Modal */}
      <CustomScoreModal
        isOpen={showCustomScoreModal}
        value={customStartInput}
        onChange={setCustomStartInput}
        onSubmit={handleCustomScoreSubmit}
        onClose={() => {
          setCustomStartInput("");
          setShowCustomScoreModal(false);
        }}
      />

      {/* Numbers-only Type-in Modal */}
      <TypeInModal
        isOpen={showTypeInModal}
        value={typeInValue}
        onChange={setTypeInValue}
        onSubmit={handleTypeInSubmit}
        onClose={() => {
          setTypeInValue("");
          setShowTypeInModal(false);
        }}
        activeTheme={activeTheme}
      />

      {/* Winner Modal */}
      <WinnerModal winner={winner} onNextLeg={() => setWinner(null)} />
    </div>
  );
}
