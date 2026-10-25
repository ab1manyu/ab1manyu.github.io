import { describe, it, expect } from "vitest";
import { TextScramble } from "./textScramble";

describe("TextScramble", () => {
  it("can be constructed with an element", () => {
    const el = document.createElement("span");
    const scrambler = new TextScramble(el);
    expect(scrambler).toBeInstanceOf(TextScramble);
  });
});
