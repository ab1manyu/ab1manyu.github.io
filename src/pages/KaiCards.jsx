import { useRef, useMemo } from "react";
import { generateKaiCards, TOTAL_CARDS } from "./kai/kaiCardsData";
import { useCardDeckSwipe } from "./kai/useCardDeckSwipe";
import KaiCard from "./kai/components/KaiCard";
import styles from "./KaiCards.module.css";

export default function KaiCards() {
  const cardsRef = useRef([]);
  const cardsData = useMemo(() => generateKaiCards(TOTAL_CARDS), []);

  useCardDeckSwipe(cardsRef, TOTAL_CARDS);

  return (
    <div
      id="kaicards-container"
      className={`min-h-screen w-full flex items-center justify-center pt-16 pb-8 touch-none select-none ${styles.kaicardsContainer}`}
    >
      {/* Bottom glow */}
      <div className={styles.bottomGlow} />

      {/* Card stack viewport */}
      <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[5/7] flex items-center justify-center">
        {cardsData.map((card, idx) => (
          <KaiCard
            key={card.id}
            card={card}
            innerRef={(el) => (cardsRef.current[idx] = el)}
            totalCards={TOTAL_CARDS}
          />
        ))}
      </div>
    </div>
  );
}
