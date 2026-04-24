import { openDB } from "idb";

const DB_NAME = "pokedex-db";
const DB_VERSION = 2;
const STORE_CAUGHT = "caught";
const STORE_META   = "meta";

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (!db.objectStoreNames.contains(STORE_CAUGHT)) {
          db.createObjectStore(STORE_CAUGHT, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORE_META)) {
          const metaStore = db.createObjectStore(STORE_META, { keyPath: "key" });
          // seed run start on first creation
          metaStore.put({ key: "runStart", value: Date.now() });
        }
      },
    });
  }
  return dbPromise;
}

/* ── Caught helpers ───────────────────────────────────────────── */

export async function getCaughtIds() {
  const db = await getDB();
  const all = await db.getAll(STORE_CAUGHT);
  return new Set(all.map((entry) => entry.id));
}

export async function catchPokemon(id) {
  const db = await getDB();
  await db.put(STORE_CAUGHT, { id, caughtAt: Date.now() });
}

export async function releasePokemon(id) {
  const db = await getDB();
  await db.delete(STORE_CAUGHT, id);
}

export async function isCaught(id) {
  const db = await getDB();
  const entry = await db.get(STORE_CAUGHT, id);
  return !!entry;
}

export async function getCaughtCount() {
  const db = await getDB();
  return db.count(STORE_CAUGHT);
}

export async function getLastCaughtTime() {
  const db = await getDB();
  const all = await db.getAll(STORE_CAUGHT);
  if (all.length === 0) return null;
  return Math.max(...all.map(entry => entry.caughtAt || 0));
}

/* ── Run-meta helpers ─────────────────────────────────────────── */

export async function getRunStart() {
  const db = await getDB();
  const entry = await db.get(STORE_META, "runStart");
  return entry ? entry.value : Date.now();
}

export async function getSeenBadges() {
  const db = await getDB();
  const entry = await db.get(STORE_META, "seen_badges");
  return entry ? entry.value : [];
}

export async function addSeenBadge(badge) {
  const db = await getDB();
  const tx = db.transaction(STORE_META, "readwrite");
  const store = tx.objectStore(STORE_META);
  const entry = await store.get("seen_badges");
  const list = entry ? entry.value : [];
  if (!list.includes(badge)) {
    list.push(badge);
    await store.put({ key: "seen_badges", value: list });
  }
  await tx.done;
}

export async function resetRun() {
  const db = await getDB();
  const tx = db.transaction([STORE_CAUGHT, STORE_META], "readwrite");
  await tx.objectStore(STORE_CAUGHT).clear();
  await tx.objectStore(STORE_META).put({ key: "runStart", value: Date.now() });
  await tx.objectStore(STORE_META).put({ key: "seen_badges", value: [] });
  await tx.done;
  // invalidate the cached promise so getDB() re-opens fresh
  dbPromise = null;
}

/* ── Export ───────────────────────────────────────────────────── */

export async function exportData() {
  const db = await getDB();
  const caught = await db.getAll(STORE_CAUGHT);
  const meta   = await db.getAll(STORE_META);
  const blob = new Blob(
    [JSON.stringify({ caught, meta }, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `unovadx-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Import ───────────────────────────────────────────────────── */

export async function importData(jsonString) {
  const { caught, meta } = JSON.parse(jsonString);
  const db = await getDB();
  const tx = db.transaction([STORE_CAUGHT, STORE_META], "readwrite");
  await tx.objectStore(STORE_CAUGHT).clear();
  for (const entry of caught) await tx.objectStore(STORE_CAUGHT).put(entry);
  for (const entry of meta)   await tx.objectStore(STORE_META).put(entry);
  await tx.done;
  dbPromise = null;
}
