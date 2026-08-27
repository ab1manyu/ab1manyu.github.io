import { Calculator, Undo2 } from "lucide-react";
import DartboardIcon from "./DartboardIcon";

export default function ActiveTurnPanel({
  activePlayer,
  activeTheme,
  currentDarts,
  multiplier,
  setMultiplier,
  isProcessingTurn,
  onAddDart,
  onOpenTypeIn,
  onUndo,
  canUndo,
  onSubtractScore,
}) {
  const turnTotal = currentDarts.reduce((a, b) => a + b.value, 0);
  const ActiveIcon = activeTheme?.icon;

  return (
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
            {ActiveIcon && (
              <ActiveIcon
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 fill-current"
                fill="currentColor"
              />
            )}
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
                      className={`text-[10px] sm:text-xs font-medium ${
                        isMiss
                          ? "text-gray-600"
                          : isBull
                            ? "text-red-300"
                            : "text-gray-400"
                      }`}
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

      {/* 1. Multiplier Selection */}
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

      {/* 2. Target Buttons */}
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
                onClick={() => onAddDart(num)}
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
              onClick={() => onAddDart(25)}
              disabled={isProcessingTurn}
              className="col-span-1 h-12 rounded-xl text-xs sm:text-sm font-extrabold border transition-all bg-red-950/80 text-red-300 border-red-800/80 hover:bg-red-900"
            >
              {multiplier === 2 ? "50" : "25"}
            </button>
          )}

          <button
            onClick={() => onAddDart(0)}
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

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-gray-800 flex items-center justify-between gap-2 w-full">
        <button
          onClick={onOpenTypeIn}
          className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>TYPE SCORE</span>
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-[0.5] sm:flex-[0.6] h-12 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors disabled:opacity-40"
        >
          <Undo2 className="w-4 h-4" />
          <span>UNDO</span>
        </button>

        <button
          onClick={() => onSubtractScore()}
          disabled={currentDarts.length === 0 || isProcessingTurn}
          className={`flex-1 h-12 ${activeTheme.bgBtn} font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center transition-all tracking-wider disabled:opacity-40`}
        >
          SUBTRACT {turnTotal > 0 ? `(${turnTotal})` : ""}
        </button>
      </div>
    </div>
  );
}
