import {
  Flame,
  Droplet,
  Zap,
  Wind,
  HandFist,
  Skull,
  Mountain,
  Leaf,
} from "lucide-react";

const TYPES = [
  { name: "Fire", icon: Flame, color: "#ef4444" },
  { name: "Water", icon: Droplet, color: "#3b82f6" },
  { name: "Electric", icon: Zap, color: "#eab308" },
  { name: "Grass", icon: Leaf, color: "#22c55e" },
  { name: "Fighting", icon: HandFist, color: "#ce773e" },
  { name: "Ground", icon: Mountain, color: "#f97316" },
  { name: "Psychic", icon: Wind, color: "#a855f7" },
  { name: "Dark", icon: Skull, color: "#9ca3af" },
];

const IMAGES = [
  "/kai/kai.jpg",
  "/kai/kai2.jpg",
  "/kai/kai3.jpg",
  "/kai/kai4.jpg",
  "/kai/kai5.jpg",
  "/kai/kai6.jpg",
  "/kai/kai7.jpg",
  "/kai/kai8.jpg",
  "/kai/kai9.jpg",
  "/kai/kai10.jpg",
];

export const TOTAL_CARDS = 20;
const LEGENDARY_CHANCE = 0.15; // 15%

const MOVES = [
  {
    name: "Earthquake",
    dmg: 100,
    type: TYPES.find((t) => t.name === "Ground"),
  },
  {
    name: "Thunderbolt",
    dmg: 90,
    type: TYPES.find((t) => t.name === "Electric"),
  },
  { name: "Flamethrower", dmg: 90, type: TYPES.find((t) => t.name === "Fire") },
  { name: "Hydro Pump", dmg: 110, type: TYPES.find((t) => t.name === "Water") },
  { name: "Solar Beam", dmg: 120, type: TYPES.find((t) => t.name === "Grass") },
  { name: "Psychic", dmg: 90, type: TYPES.find((t) => t.name === "Psychic") },
  { name: "Crunch", dmg: 80, type: TYPES.find((t) => t.name === "Dark") },
  {
    name: "Close Combat",
    dmg: 120,
    type: TYPES.find((t) => t.name === "Fighting"),
  },
  { name: "Fire Blast", dmg: 110, type: TYPES.find((t) => t.name === "Fire") },
  { name: "Surf", dmg: 90, type: TYPES.find((t) => t.name === "Water") },
  { name: "Thunder", dmg: 110, type: TYPES.find((t) => t.name === "Electric") },
  { name: "Leaf Storm", dmg: 130, type: TYPES.find((t) => t.name === "Grass") },
];

const LEGENDARY_MOVES = [
  {
    name: "Kai Mega Punch ",
    dmg: 250,
    type: TYPES.find((t) => t.name === "Fighting"),
  },
  {
    name: "Kai Blast",
    dmg: 200,
    type: TYPES.find((t) => t.name === "Fighting"),
  },
];

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function generateKaiCards(total = TOTAL_CARDS) {
  const shuffledImages = shuffle(IMAGES);

  return Array.from({ length: total }, (_, i) => {
    const shuffledMoves = [...MOVES].sort(() => 0.5 - Math.random());
    const shuffledLegendaryMoves = [...LEGENDARY_MOVES].sort(
      () => 0.5 - Math.random()
    );
    const type = shuffledMoves[0].type;
    const isLegendary = Math.random() < LEGENDARY_CHANCE;

    return {
      id: i,
      name: isLegendary ? `✦ Kai ✦` : `Kai`,
      hp: isLegendary
        ? (Math.floor(Math.random() * 200 + 250) % 10) * 10 + 200
        : (Math.floor(Math.random() * 800 + 100) % 10) * 10 + 40,
      type,
      isLegendary,
      image: isLegendary
        ? "/kai/kaiLegendary.jpg"
        : shuffledImages[i % shuffledImages.length],
      attack1: isLegendary
        ? {
            ...shuffledLegendaryMoves[0],
            dmg: shuffledLegendaryMoves[0].dmg + 40,
          }
        : shuffledMoves[0],
      attack2: isLegendary
        ? {
            ...shuffledLegendaryMoves[1],
            dmg: shuffledLegendaryMoves[1].dmg + 40,
          }
        : shuffledMoves[1],
      flavor: isLegendary
        ? "An ancient being of immeasurable power. Long thought to be a myth — now undeniable."
        : "A mysterious entity discovered deep within the archives. Its origins remain unknown.",
    };
  });
}
