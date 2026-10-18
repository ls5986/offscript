import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { activityById, type Category } from "../../src/domain/content";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import { generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import {
  currentRound,
  makeSession,
  prepareRound,
  transitionRound,
} from "../../src/domain/session";

for (const categories of [
  ["location"],
  ["relationship"],
  ["location", "relationship"],
  ["location", "relationship", "situation"],
  ["profession", "genre"],
  [],
] satisfies Category[][]) {
  test(`Open Scene preserves the selected ingredients ${categories.join(", ") || "wide open"} on handoff, reroll and another round`, () => {
    const prompt = generatePrompt(
      {
        categories,
        count: 2,
        style: "coherent",
        compositionEnabled: false,
      },
      seededRng(3),
    ).snapshot;
    const session = makeSession(
      2,
      "scene_lab",
      UserPreferencesSchema.parse({}),
      randomUUID,
      12,
      [],
      "S1",
      prompt,
      "practice",
    );
    const original = structuredClone(prompt);
    expect(currentRound(session).promptSnapshot).toEqual(original);
    const context = {
      session,
      now: session.createdAt,
      id: randomUUID,
      rng: seededRng(4),
    };
    const rerolled = transitionRound(
      currentRound(session),
      { type: "REROLL_PROMPT" },
      context,
    );
    expect(Object.keys(rerolled.promptSnapshot.entries).sort()).toEqual(
      [...categories].sort(),
    );
    expect(rerolled.promptSnapshot.compositionEnabled).toBe(false);
    const another = prepareRound(
      session,
      activityById("S1"),
      randomUUID,
      session.createdAt,
    );
    expect(Object.keys(another.promptSnapshot.entries).sort()).toEqual(
      [...categories].sort(),
    );
    expect(another.promptSnapshot.compositionEnabled).toBe(false);
    expect(prompt).toEqual(original);
  });
}
