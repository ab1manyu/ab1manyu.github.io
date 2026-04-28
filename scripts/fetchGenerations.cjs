const fs = require('fs');
const path = require('path');

const GENS = {
  kanto: { id: 1 },
  johto: { id: 2 },
  hoenn: { id: 3 },
  sinnoh: { id: 4 },
  unova: { id: 5 },
  kalos: { id: 6 },
  alola: { id: 7 },
  galar: { id: 8 },
  paldea: { id: 9 }
};

const BATCH_SIZE = 20;

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function fetchGeneration(genName, genId) {
  console.log(`Fetching generation ${genName}...`);
  const genData = await fetchWithRetry(`https://pokeapi.co/api/v2/generation/${genId}`);
  
  // Sort pokemon species by ID (extracted from URL) since the API does not guarantee order
  const speciesList = genData.pokemon_species.map(s => {
    const urlParts = s.url.split('/').filter(Boolean);
    const id = parseInt(urlParts[urlParts.length - 1], 10);
    return { name: s.name, id };
  }).sort((a, b) => a.id - b.id);

  console.log(`Found ${speciesList.length} species for ${genName}. Fetching types...`);

  const pokemonList = [];
  
  for (let i = 0; i < speciesList.length; i += BATCH_SIZE) {
    const batch = speciesList.slice(i, i + BATCH_SIZE);
    
    const batchResults = await Promise.all(batch.map(async (species) => {
      // Fetch the default variety types
      try {
        const pkmnData = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${species.id}`);
        return {
          id: species.id,
          name: species.name, // using species name
          types: pkmnData.types.sort((a,b) => a.slot - b.slot).map(t => t.type.name)
        };
      } catch (e) {
        console.error(`Error fetching ${species.name} (${species.id}):`, e.message);
        return {
          id: species.id,
          name: species.name,
          types: ["normal"] // fallback
        };
      }
    }));
    
    pokemonList.push(...batchResults);
    process.stdout.write(`\rProgress: ${pokemonList.length}/${speciesList.length}`);
  }

  console.log(`\nFinished ${genName}.`);
  return {
    name: genName,
    pokemon: pokemonList
  };
}

async function main() {
  const dataDir = path.join(__dirname, '../src/pokedex/data/generations');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  for (const [genName, info] of Object.entries(GENS)) {
    const data = await fetchGeneration(genName, info.id);
    const filePath = path.join(dataDir, `${genName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data.pokemon, null, 2));
    console.log(`Saved ${filePath}`);
  }
}

main().catch(console.error);
