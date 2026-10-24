import MatrixScoreDisplay from "./MatrixScoreDisplay";
import { formatTime } from "../data/dartsThemes";
import styles from "../DartScoreCore.module.css";

export default function PlayerCard({ player, isActive, theme, idx, onSelect }) {
  const ppd =
    player.dartsThrown > 0
      ? ((player.totalScored / player.dartsThrown) * 3).toFixed(1)
      : "0.0";

  const PlayerIcon = theme?.icon;

  return (
    <div
      onClick={onSelect}
      style={{ animationDelay: `${idx * 70}ms` }}
      className={`flex-1 min-w-0 rounded-2xl px-1 py-2.5 sm:p-4 transition-all duration-300 ease-out cursor-pointer border flex flex-col justify-between items-center text-center ${styles.cardGrow} ${
        isActive
          ? `${theme.border} ${theme.bgActive} shadow-xl ring-1 ${theme.borderActive}`
          : `bg-black border-gray-800/80 opacity-60 hover:opacity-90`
      }`}
    >
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full mb-1">
        {PlayerIcon && (
          <PlayerIcon
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-all ${
              isActive ? `${theme.text} fill-current` : "text-gray-500"
            }`}
            fill={isActive ? "currentColor" : "none"}
          />
        )}
        <span
          className={`hidden sm:inline text-xs font-bold truncate ${
            isActive ? "text-white" : "text-gray-400"
          }`}
        >
          {player.name}
        </span>
        <span
          className={`text-[9px] sm:text-xs font-bold flex-shrink-0 ${
            isActive ? "text-amber-400" : "text-gray-500"
          }`}
        >
          {formatTime(player.timeSeconds)}
        </span>
      </div>

      {/* Big Score Display */}
      <div
        className={`text-xl sm:text-5xl font-extrabold tracking-tight my-0.5 sm:my-2 text-center w-full ${
          isActive ? "text-white" : "text-gray-300"
        }`}
      >
        <MatrixScoreDisplay score={player.score} colorClass={theme.text} />
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
            {player.lastTurn}
          </strong>
        </span>
      </div>
    </div>
  );
}
