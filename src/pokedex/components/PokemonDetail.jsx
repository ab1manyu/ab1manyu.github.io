import { useState, useEffect, useCallback } from "react";
import { TYPE_COLORS } from "../data/unovaPokemon";
import styles from "./PokemonDetail.module.css";

const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

const STAT_MAX = {
  hp: 255, attack: 181, defense: 230,
  "special-attack": 194, "special-defense": 230, speed: 180,
};

const STAT_LABELS = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "SPD",
};

export default function PokemonDetail({ pokemon, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resPokemon, resSpecies] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`)
      ]);

      if (!resPokemon.ok || !resSpecies.ok) throw new Error("Failed to fetch");

      const jsonPokemon = await resPokemon.json();
      const jsonSpecies = await resSpecies.json();

      const flavorEntry = jsonSpecies.flavor_text_entries.find(e => e.language.name === "en");
      const description = flavorEntry ? flavorEntry.flavor_text.replace(/\f/g, ' ') : "No description available.";
      const growthRate = jsonSpecies.growth_rate ? jsonSpecies.growth_rate.name : "Unknown";

      setData({ ...jsonPokemon, description, growthRate });
    } catch (err) {
      setError("Could not load data. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [pokemon.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 400); // Wait for slide-out CSS animation
  }, [onClose]);

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget && !isClosing) handleClose();
  };

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayOut : ""}`}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${pokemon.name}`}
    >
      <div className={`${styles.panel} ${isClosing ? styles.slideOut : ""}`}>
        {loading && (
          <div className={styles.loadingState}>
            <span className={styles.spinner} />
            <p>Loading data…</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button className={styles.retryBtn} onClick={fetchData}>Retry</button>
          </div>
        )}

        {data && !loading && (
          <>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <span className={styles.dexNum}>#{String(pokemon.id).padStart(3, "0")}</span>
                <h2 className={styles.pokeName}>{capitalize(data.name)}</h2>
                <div className={styles.types}>
                  {data.types.map(({ type }) => (
                    <span
                      key={type.name}
                      className={styles.typeBadge}
                      style={{ background: TYPE_COLORS[type.name] ?? "#888" }}
                    >
                      {type.name.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.spriteWrap}>
                <img
                  src={`${SPRITE_BASE}${pokemon.id}.png`}
                  alt={capitalize(data.name)}
                  className={styles.sprite}
                />
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>POKÉDEX ENTRY</h3>
              <div className={styles.descriptionBox}>
                <p className={styles.descriptionText}>{data.description}</p>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>BASE STATS</h3>
              <div className={styles.stats}>
                {data.stats.map((s) => {
                  const name = s.stat.name;
                  const val = s.base_stat;
                  const pct = Math.min(100, Math.round((val / (STAT_MAX[name] || 200)) * 100));
                  const barColor = pct < 35 ? "#e53935" : pct < 65 ? "#f9c74f" : "#43d47d";
                  return (
                    <div key={name} className={styles.statRow}>
                      <span className={styles.statLabel}>{STAT_LABELS[name] ?? name}</span>
                      <span className={styles.statVal}>{val}</span>
                      <div className={styles.statBar}>
                        <div
                          className={styles.statFill}
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>TOTAL</span>
                  <span className={styles.totalVal}>
                    {data.stats.reduce((a, s) => a + s.base_stat, 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>INFO</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Height</span>
                  <span className={styles.infoVal}>{(data.height / 10).toFixed(1)} m</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Weight</span>
                  <span className={styles.infoVal}>{(data.weight / 10).toFixed(1)} kg</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Leveling Group</span>
                  <span className={styles.infoVal}>{capitalize(data.growthRate.replace("-", " "))}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Abilities</span>
                  <span className={styles.infoVal}>
                    {data.abilities
                      .filter((a) => !a.is_hidden)
                      .map((a) => capitalize(a.ability.name.replace("-", " ")))
                      .join(", ")}
                  </span>
                </div>
              </div>
            </div>


          </>
        )}
      </div>
    </div>
  );
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
