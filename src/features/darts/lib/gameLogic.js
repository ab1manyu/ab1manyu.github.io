/**
 * Pure darts game rules. No React, no side effects: everything here is
 * deterministic so it can be unit tested in isolation.
 */

export const MAX_THEME_COUNT = 4;

export function createPlayer(index, startScore) {
  return {
    id: index + 1,
    name: `PLAYER ${index + 1}`,
    themeIndex: index % MAX_THEME_COUNT,
    score: startScore,
    legs: 0,
    totalScored: 0,
    dartsThrown: 0,
    lastTurn: 0,
    history: [],
    timeSeconds: 0,
  };
}

export function createPlayers(count, startScore) {
  return Array.from({ length: count }, (_, i) => createPlayer(i, startScore));
}

/**
 * Builds a thrown-dart record from a board number (0-20, 25) and the active
 * multiplier. Returns null for impossible throws (a triple bull).
 */
export function buildDart(num, multiplier) {
  let value = num * multiplier;
  let isDouble = multiplier === 2;
  let isTriple = multiplier === 3;

  if (num === 25) {
    if (multiplier === 3) return null;
    if (multiplier === 2) {
      value = 50;
      isDouble = true;
      isTriple = false;
    } else {
      value = 25;
      isDouble = false;
      isTriple = false;
    }
  } else if (num === 0) {
    value = 0;
    isDouble = false;
    isTriple = false;
  }

  return { num, label: `${value}`, value, multiplier, isDouble, isTriple };
}

export function sumDarts(darts) {
  return darts.reduce((total, dart) => total + dart.value, 0);
}

/** Wraps a typed-in turn total as a single synthetic dart record. */
export function buildTypedInTurn(points) {
  return [
    {
      label: `${points}`,
      value: points,
      multiplier: 1,
      isDouble: false,
      isTriple: false,
    },
  ];
}

export function isBust(remaining, doubleOut = true) {
  if (remaining < 0) return true;
  return doubleOut && remaining === 1;
}

/**
 * Applies one completed turn for `players[activeIndex]`.
 *
 * Returns the next players array plus the outcome:
 *   - "bust":  score unchanged, turn recorded as a bust
 *   - "win":   leg won; every player's score resets to `startScore`
 *   - "score": score reduced by `points`
 */
export function applyTurn(
  players,
  activeIndex,
  { points, dartsCount, darts, startScore, doubleOut = true }
) {
  const active = players[activeIndex];
  const remaining = active.score - points;

  if (isBust(remaining, doubleOut)) {
    return {
      outcome: "bust",
      players: players.map((p, idx) =>
        idx === activeIndex
          ? {
              ...p,
              dartsThrown: p.dartsThrown + dartsCount,
              lastTurn: 0,
              history: [
                ...p.history,
                { score: 0, bust: true, prevScore: p.score, darts },
              ],
            }
          : p
      ),
    };
  }

  const scored = (p) => ({
    ...p,
    totalScored: p.totalScored + points,
    dartsThrown: p.dartsThrown + dartsCount,
    lastTurn: points,
    history: [
      ...p.history,
      { score: points, bust: false, prevScore: p.score, darts },
    ],
  });

  if (remaining === 0) {
    const legs = active.legs + 1;
    return {
      outcome: "win",
      legs,
      players: players.map((p, idx) =>
        idx === activeIndex
          ? { ...scored(p), score: startScore, legs }
          : { ...p, score: startScore }
      ),
    };
  }

  return {
    outcome: "score",
    players: players.map((p, idx) =>
      idx === activeIndex ? { ...scored(p), score: remaining } : p
    ),
  };
}
