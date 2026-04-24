import { useState, useRef, useEffect } from "react";
import { TYPE_COLORS } from "../data/unovaPokemon";
import styles from "./PokemonCard.module.css";

const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

export default function PokemonCard({ pokemon, isCaught, onClick, viewMode = "card" }) {
  const [isVisible, setIsVisible] = useState(viewMode !== "list");
  const cardRef = useRef(null);

  useEffect(() => {
    if (viewMode !== "list") {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [viewMode]);

  const spriteUrl = `${SPRITE_BASE}${pokemon.id}.png`;

  const typeName = pokemon.types && pokemon.types[0];
  const typeColor = (isCaught && typeName) ? TYPE_COLORS[typeName] : null;

  return (
    <button
      ref={cardRef}
      id={`card-${pokemon.id}`}
      className={`${styles.card} ${isCaught ? styles.cardCaught : styles.cardUncaught} ${viewMode === "list" ? styles.cardList : ""} ${viewMode === "list" && !isVisible ? styles.hiddenCard : ""} ${viewMode === "list" && isVisible ? styles.animateIn : ""}`}
      onClick={() => isCaught && onClick(pokemon)}
      aria-label={isCaught ? `View ${pokemon.name}` : `#${pokemon.id} — not yet caught`}
      aria-disabled={!isCaught}
      tabIndex={isCaught ? 0 : -1}
      style={typeColor ? { '--card-theme': typeColor } : {}}
    >
      <div className={styles.dexNum}>#{String(pokemon.id).padStart(3, "0")}</div>
      <div className={styles.imgWrap}>
        <img
          src={spriteUrl}
          alt={isCaught ? pokemon.name : "silhouette"}
          className={`${styles.img} ${isCaught ? styles.imgCaught : styles.imgSilhouette}`}
          loading="lazy"
          draggable={false}
        />
        {!isCaught && (
          <div className={styles.unknownOverlay} aria-hidden="true">?</div>
        )}
      </div>
      <div className={styles.name}>
        {isCaught ? capitalize(pokemon.name) : "???"}
      </div>
      {viewMode === "list" && isCaught && pokemon.types && (
        <div className={styles.typeRow}>
          {pokemon.types.map(t => (
            <span key={t} className={styles.typePill} style={{ background: TYPE_COLORS[t] }}>
              {t.substring(0,3).toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
