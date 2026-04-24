import { useState, useMemo, useEffect } from "react";
import { UNOVA_POKEMON } from "../data/unovaPokemon";
import PokemonCard from "./PokemonCard";
import PokemonDetail from "./PokemonDetail";
import styles from "./PokedexScreen.module.css";

export default function PokedexScreen({ caughtIds }) {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', "#8b51f7ff");
    document.documentElement.style.setProperty('--theme-color-rgb', "6, 15, 9");
  }, []);
  const filters = ["all", "caught", "???"];

  const filtered = useMemo(() => {
    if (filter === "caught") return UNOVA_POKEMON.filter((p) => caughtIds.has(p.id));
    if (filter === "uncaught") return UNOVA_POKEMON.filter((p) => !caughtIds.has(p.id));
    return UNOVA_POKEMON;
  }, [filter, caughtIds]);

  const caughtCount = caughtIds.size;
  const total = UNOVA_POKEMON.length;
  const uncaughtCount = total - caughtCount;

  return (
    <div className={styles.screen}>
      <div className={styles.matrixGrid} aria-hidden="true" />
      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div style={{ display: "flex", gap: "8px", flex: "1" }}>
          <button
            id="filter-caught"
            className={`${styles.filterBtn} ${filter === "caught" ? styles.filterActive : ""}`}
            onClick={() => setFilter("caught")}
          >
            CAUGHT <span className={styles.filterCount}>{caughtCount}</span>
          </button>
          <button
            id="filter-uncaught"
            className={`${styles.filterBtn} ${filter === "uncaught" ? styles.filterActive : ""}`}
            onClick={() => setFilter("uncaught")}
          >
            ??? <span className={styles.filterCount}>{uncaughtCount}</span>
          </button>
          <button
            id="filter-all"
            className={`${styles.filterBtn} ${filter === "all" ? styles.filterActive : ""}`}
            onClick={() => setFilter("all")}
          >
            ALL <span className={styles.filterCount}>{total}</span>
          </button>
        </div>
        <button
          className={styles.filterBtn}
          onClick={() => setViewMode(prev => prev === "card" ? "list" : "card")}
        >
          {viewMode === "card" ? (
             <><span className={styles.viewIcon}>≡</span> <span className={styles.viewText}>LIST</span></>
          ) : (
             <><span className={styles.viewIcon}>☷</span> <span className={styles.viewText}>GRID</span></>
          )}
        </button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && filter === "caught" && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>◉</span>
          <p className={styles.emptyText}>No Pokémon caught yet!</p>
          <p className={styles.emptySubtext}>Head to the Battle screen to start catching.</p>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <div className={`${styles.grid} ${viewMode === "list" ? styles.listView : ""}`} role="list" aria-label="Pokédex entries">
          {filtered.map((pokemon) => (
            <div role="listitem" key={pokemon.id}>
              <PokemonCard
                pokemon={pokemon}
                isCaught={caughtIds.has(pokemon.id)}
                onClick={setSelectedPokemon}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      )}

      {/* Detail Panel */}
      {selectedPokemon && (
        <PokemonDetail
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}
