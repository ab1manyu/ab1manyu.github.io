import { X, Delete, Check } from "lucide-react";

export default function TypeInModal({
  isOpen,
  value,
  onChange,
  onSubmit,
  onClose,
  activeTheme,
}) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-black border border-gray-800 rounded-3xl p-6 max-w-xs w-full shadow-2xl space-y-4 font-mono"
      >
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            ENTER ROUND SCORE
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Readout */}
        <div className="h-14 bg-black border border-gray-800 rounded-2xl flex items-center justify-end px-4 text-3xl font-extrabold text-white tracking-widest">
          {value || "0"}
        </div>

        {/* Numbers-only Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => {
                if (value.length < 3) onChange((prev) => prev + n);
              }}
              className="h-14 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-xl font-bold text-white transition-colors"
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => onChange("")}
            className="h-14 bg-red-950/60 border border-red-800 text-red-400 rounded-xl text-xs font-bold"
          >
            CLEAR
          </button>

          <button
            onClick={() => {
              if (value.length < 3) onChange((prev) => prev + "0");
            }}
            className="h-14 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-xl font-bold text-white transition-colors"
          >
            0
          </button>

          <button
            onClick={() => onChange((prev) => prev.slice(0, -1))}
            className="h-14 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={value === ""}
          className={`w-full h-12 ${
            activeTheme?.bgBtn || "bg-emerald-500 text-black"
          } font-extrabold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40`}
        >
          <Check className="w-5 h-5" /> SUBTRACT SCORE
        </button>
      </div>
    </div>
  );
}
