import { RotateCcw, Play, Pause } from "lucide-react";

export default function GameHeader({
  startScore,
  onStartScoreChange,
  onOpenCustomScore,
  numPlayers,
  onPlayerCountChange,
  isTimerRunning,
  onToggleTimer,
  onResetMatch,
}) {
  const isCustomStart = ![101, 301, 501, 701].includes(startScore);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-2 w-full">
      {/* Left Group: Start Score Options & Players Count */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full">
        <div className="flex bg-black/60 border border-gray-800 rounded-xl p-1 text-xs shrink-0">
          {[101, 301, 501, 701].map((sc) => {
            const isHiddenOnMobile = sc === 501 || sc === 701;
            return (
              <button
                key={sc}
                onClick={() => onStartScoreChange(sc)}
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
            onClick={onOpenCustomScore}
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
              onClick={() => onPlayerCountChange(count)}
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
          onClick={onToggleTimer}
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
          onClick={onResetMatch}
          className="p-2 sm:px-3 sm:py-1.5 bg-red-950/40 border border-red-800/80 hover:bg-red-900/60 text-red-400 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
          title="Reset Game"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESET</span>
        </button>
      </div>
    </div>
  );
}
