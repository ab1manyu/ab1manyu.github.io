export const TYPE_COLORS = {
  normal: "#9a9a7b",
  fire: "#e8622a",
  water: "#4d90d5",
  grass: "#78c850",
  electric: "#f0c030",
  ice: "#74cec0",
  fighting: "#c03028",
  poison: "#a040a0",
  ground: "#e0c068",
  flying: "#9096f0",
  psychic: "#f85888",
  bug: "#a8b820",
  rock: "#b8a038",
  ghost: "#705898",
  dragon: "#7038f8",
  dark: "#705848",
  steel: "#b8b8d0",
  fairy: "#ee99ac"
};

export function getPokemonByName(pokemonList, name) {
  return pokemonList.find(
    (p) => p.name.toLowerCase() === name.toLowerCase().trim()
  );
}

export function getRandomPokemon(pokemonList, excludeIds = []) {
  const pool = pokemonList.filter((p) => !excludeIds.includes(p.id));
  if (pool.length === 0) return pokemonList[Math.floor(Math.random() * pokemonList.length)];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getTypeTotals(pokemonList) {
  return pokemonList.reduce((acc, p) => {
    if (p.types) {
      for (const t of p.types) {
        acc[t] = (acc[t] || 0) + 1;
      }
    }
    return acc;
  }, {});
}

export function getEarnedBadges(pokemonList, caughtIds) {
  const typeTotals = getTypeTotals(pokemonList);
  const caughtCounts = {};
  for (const id of caughtIds) {
    const p = pokemonList.find(x => x.id === id);
    if (!p || !p.types) continue;
    for (const t of p.types) {
      caughtCounts[t] = (caughtCounts[t] || 0) + 1;
    }
  }
  const earned = [];
  for (const t of Object.keys(TYPE_COLORS)) {
    if (typeTotals[t] && caughtCounts[t] === typeTotals[t]) {
      earned.push(t);
    }
  }
  return earned;
}
