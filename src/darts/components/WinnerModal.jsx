export default function WinnerModal({ winner, onNextLeg }) {
  if (!winner) return null;

  const WinnerIcon = winner.icon || winner.theme?.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6">
        <div
          className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto ${winner.theme?.badge}`}
        >
          {WinnerIcon && <WinnerIcon className="w-8 h-8" fill="currentColor" />}
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
          onClick={onNextLeg}
          className={`w-full py-3.5 ${winner.theme.bgBtn} font-extrabold rounded-xl transition-all`}
        >
          NEXT LEG
        </button>
      </div>
    </div>
  );
}
