export default function DartboardIcon({
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
