import styles from "../KaiCard.module.css";

export default function KaiCard({ card, innerRef, totalCards }) {
  const isLegendary = card.isLegendary;
  const TypeIcon = card.type.icon;
  const Attack1Icon = card.attack1.type.icon;
  const Attack2Icon = card.attack2.type.icon;

  return (
    <div
      ref={innerRef}
      className={`${styles.cardBase} ${
        isLegendary ? styles.legendaryCard : styles.standardCard
      }`}
    >
      <div
        className={`flex-1 w-full h-full flex flex-col p-1 sm:p-2 rounded-sm ${
          isLegendary ? styles.innerLegendary : styles.innerStandard
        }`}
      >
        {/* Header: Name, HP & Type */}
        <div className="flex justify-between items-center mb-1 px-1">
          <div
            className={`font-extrabold text-sm sm:text-base leading-none tracking-tight ${
              isLegendary ? styles.legendaryName : ""
            }`}
          >
            {card.name}
          </div>
          <div
            className="flex items-center gap-1 font-bold leading-none"
            style={{ color: isLegendary ? "#f0c040" : undefined }}
          >
            <span className="text-[8px] sm:text-[10px] mr-[2px]">HP</span>
            <span className="text-sm sm:text-base">{card.hp}</span>
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center p-[2px] ml-1 ${
                isLegendary ? styles.badgeLegendary : styles.badgeStandard
              }`}
            >
              <TypeIcon
                className="w-full h-full"
                style={{
                  color: isLegendary ? "#f0c040" : card.type.color,
                }}
              />
            </div>
          </div>
        </div>

        {/* Picture Frame */}
        <div
          className={`w-full aspect-[4/3] rounded-[6px] bg-black overflow-hidden relative mb-1 ${
            isLegendary ? styles.frameLegendary : styles.frameStandard
          }`}
        >
          <img
            src={card.image}
            alt={card.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {isLegendary && (
            <div
              className={`absolute inset-0 pointer-events-none ${styles.legendaryShimmer}`}
            />
          )}
        </div>

        {/* Sub Metadata Bar */}
        <div
          className={`w-full text-[7px] sm:text-[8px] font-bold italic text-center py-[2px] sm:py-1 mb-1 sm:mb-2 ${
            isLegendary ? styles.metaLegendary : styles.metaStandard
          }`}
        >
          {isLegendary
            ? "✦ LEGENDARY ✦"
            : `NO. ${card.id.toString().padStart(3, "0")} Kitty Cat Length: 2'0,  Weight: 10lbs`}
        </div>

        {/* Moves / Stats */}
        <div
          className={`flex-1 flex flex-col px-1 sm:px-2 z-10 relative rounded-lg p-1 ${
            isLegendary ? styles.movesLegendary : styles.movesStandard
          }`}
        >
          {/* Attack 1 */}
          <div
            className={`flex items-center justify-between pb-1 sm:pb-2 mb-1 sm:mb-2 ${
              isLegendary
                ? styles.moveBorderLegendary
                : styles.moveBorderStandard
            }`}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center p-[2px] ${
                  isLegendary ? styles.badgeLegendary : styles.badgeStandard
                }`}
              >
                <Attack1Icon
                  className="w-full h-full"
                  style={{
                    color: isLegendary ? "#f0c040" : card.attack1.type.color,
                  }}
                />
              </div>
              <span className="font-bold text-xs sm:text-sm tracking-tight">
                {card.attack1.name}
              </span>
            </div>
            <span className="font-extrabold text-xs sm:text-sm">
              {card.attack1.dmg}
            </span>
          </div>

          {/* Attack 2 */}
          <div
            className="flex items-center justify-between pb-1 sm:pb-2 mb-1"
            style={{ color: isLegendary ? "#f0c040" : undefined }}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <div
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center p-[2px] ${
                  isLegendary ? styles.badgeLegendary : styles.badgeStandard
                }`}
              >
                <Attack2Icon
                  className="w-full h-full"
                  style={{
                    color: isLegendary ? "#f0c040" : card.attack2.type.color,
                  }}
                />
              </div>
              <span className="font-bold text-xs sm:text-sm tracking-tight">
                {card.attack2.name}
              </span>
            </div>
            <span className="font-extrabold text-xs sm:text-sm">
              {card.attack2.dmg}
            </span>
          </div>
        </div>

        {/* Footer Small Stats */}
        <div className="mt-auto">
          <div
            className={`flex justify-between text-[6px] sm:text-[8px] font-bold py-1 mb-1 px-1 ${
              isLegendary
                ? styles.footerBorderLegendary
                : styles.footerBorderStandard
            }`}
          >
            <div className="text-center">
              weakness
              <br />
              <span
                className="text-xs"
                style={{ color: isLegendary ? "#f0c040" : undefined }}
              >
                x0
              </span>
            </div>
            <div className="text-center">
              resistance
              <br />
              <span
                className="text-xs"
                style={{ color: isLegendary ? "#f0c040" : undefined }}
              >
                -30
              </span>
            </div>
            <div className="text-center">
              retreat cost
              <br />
              <span
                className="text-xs tracking-widest"
                style={{ color: isLegendary ? "#f0c040" : undefined }}
              >
                * *
              </span>
            </div>
          </div>

          <div
            className={`text-[7px] sm:text-[9px] italic pt-1 px-1 leading-tight text-center font-mono ${
              isLegendary ? styles.flavorLegendary : styles.flavorStandard
            }`}
          >
            {card.flavor}
          </div>

          <div
            className={`flex justify-between items-center mt-1 px-1 text-[6px] sm:text-[7px] font-bold ${
              isLegendary
                ? styles.bottomInfoLegendary
                : styles.bottomInfoStandard
            }`}
          >
            <span>Illus. Abimanyu</span>
            <span>
              {isLegendary ? "★ LEGENDARY ★" : `${card.id + 1}/${totalCards} ⋆`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
