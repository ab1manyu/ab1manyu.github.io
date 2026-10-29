import { describe, it, expect } from "vitest";
import {
  createPlayers,
  buildDart,
  sumDarts,
  isBust,
  applyTurn,
} from "./gameLogic";

describe("createPlayers", () => {
  it("creates numbered players with the starting score", () => {
    const players = createPlayers(3, 501);
    expect(players).toHaveLength(3);
    expect(players.map((p) => p.name)).toEqual([
      "PLAYER 1",
      "PLAYER 2",
      "PLAYER 3",
    ]);
    expect(players.every((p) => p.score === 501 && p.legs === 0)).toBe(true);
  });

  it("cycles theme indexes every four players", () => {
    const players = createPlayers(5, 301);
    expect(players.map((p) => p.themeIndex)).toEqual([0, 1, 2, 3, 0]);
  });
});

describe("buildDart", () => {
  it("multiplies the board number", () => {
    expect(buildDart(20, 3)).toMatchObject({ value: 60, isTriple: true });
    expect(buildDart(20, 2)).toMatchObject({ value: 40, isDouble: true });
    expect(buildDart(20, 1)).toMatchObject({ value: 20 });
  });

  it("handles the bull", () => {
    expect(buildDart(25, 1)).toMatchObject({ value: 25, isDouble: false });
    expect(buildDart(25, 2)).toMatchObject({ value: 50, isDouble: true });
  });

  it("rejects a triple bull", () => {
    expect(buildDart(25, 3)).toBeNull();
  });

  it("scores a miss as zero regardless of multiplier", () => {
    expect(buildDart(0, 3)).toMatchObject({
      value: 0,
      isDouble: false,
      isTriple: false,
    });
  });
});

describe("sumDarts", () => {
  it("adds dart values", () => {
    expect(sumDarts([{ value: 20 }, { value: 40 }, { value: 0 }])).toBe(60);
  });
});

describe("isBust", () => {
  it("busts on negative remaining", () => {
    expect(isBust(-1)).toBe(true);
  });
  it("busts on 1 when double-out is required", () => {
    expect(isBust(1, true)).toBe(true);
    expect(isBust(1, false)).toBe(false);
  });
  it("does not bust on 0 or positive remaining", () => {
    expect(isBust(0)).toBe(false);
    expect(isBust(2)).toBe(false);
  });
});

describe("applyTurn", () => {
  const base = () => createPlayers(2, 301);
  const turn = (points, extra = {}) => ({
    points,
    dartsCount: 3,
    darts: [],
    startScore: 301,
    ...extra,
  });

  it("reduces the active player's score and records history", () => {
    const { outcome, players } = applyTurn(base(), 0, turn(100));
    expect(outcome).toBe("score");
    expect(players[0]).toMatchObject({
      score: 201,
      totalScored: 100,
      dartsThrown: 3,
      lastTurn: 100,
    });
    expect(players[0].history).toHaveLength(1);
    expect(players[1].score).toBe(301);
  });

  it("does not mutate the input players", () => {
    const players = base();
    applyTurn(players, 0, turn(100));
    expect(players[0].score).toBe(301);
    expect(players[0].history).toHaveLength(0);
  });

  it("records a bust without changing the score", () => {
    const players = base();
    players[0].score = 40;
    const result = applyTurn(players, 0, turn(41));
    expect(result.outcome).toBe("bust");
    expect(result.players[0]).toMatchObject({
      score: 40,
      lastTurn: 0,
      dartsThrown: 3,
    });
    expect(result.players[0].history[0]).toMatchObject({
      bust: true,
      prevScore: 40,
    });
  });

  it("busts when leaving exactly 1 under double-out", () => {
    const players = base();
    players[0].score = 40;
    expect(applyTurn(players, 0, turn(39)).outcome).toBe("bust");
  });

  it("wins the leg on exactly zero and resets every score", () => {
    const players = base();
    players[0].score = 40;
    players[1].score = 120;
    const result = applyTurn(players, 0, turn(40));
    expect(result.outcome).toBe("win");
    expect(result.legs).toBe(1);
    expect(result.players[0]).toMatchObject({ score: 301, legs: 1 });
    expect(result.players[1]).toMatchObject({ score: 301, legs: 0 });
  });
});
