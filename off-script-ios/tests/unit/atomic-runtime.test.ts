import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { categories, prompts } from "../../src/domain/content";
import { generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import { gamePromptOptions } from "../../src/domain/game-prompts";
import { makePartySession } from "../../src/domain/party";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import { currentRound } from "../../src/domain/session";

test("atomic generation does not contain complete advice requests", () => {
  expect(
    prompts.filter((entry) => entry.tags.includes("party_advice")),
  ).toHaveLength(0);
  expect(
    gamePromptOptions("S1", "practice").pool.some((entry) =>
      entry.tags.includes("party_advice"),
    ),
  ).toBe(false);
});

test("full advice problems remain available to the advice game itself", () => {
  const pool = gamePromptOptions("P5", "riff", "clean").pool;
  expect(pool.length).toBeGreaterThan(0);
  expect(pool.every((entry) => entry.tags.includes("party_advice"))).toBe(true);
  expect(
    pool.some(
      (entry) =>
        entry.text === "I clapped when the plane landed. Everyone knows.",
    ),
  ).toBe(true);
});

test("independent situations do not contain the audited bundled partner, prop or first-meeting premises", () => {
  const situations = prompts.filter((entry) => entry.category === "situation");
  for (const text of [
    "You and a casual partner both pretend not to have left a toothbrush behind.",
    "Everyone is meeting for the first time",
    "The train is imaginary",
    "Two neighbors are both sure the plant belongs to them",
  ])
    expect(
      situations.some((entry) => entry.text === text),
      text,
    ).toBe(false);
  expect(
    situations.some(
      (entry) =>
        entry.text ===
        "Something was left behind. Nobody will admit it's theirs.",
    ),
  ).toBe(true);
});

test("New Choice no longer supplies a second romantic relationship inside the situation", () => {
  for (let seed = 0; seed < 50; seed++) {
    const session = makePartySession(
      3,
      UserPreferencesSchema.parse({}),
      [],
      PartyOptionsSchema.parse({
        selectedActivityIds: ["G2"],
        level: "18_plus",
        adultsConfirmedAt: "2026-10-17T20:00:00.000Z",
      }),
      randomUUID,
      seed,
    );
    const round = currentRound(session);
    expect(round.performerIds).toHaveLength(2);
    expect(round.supportingPlayerIds).toHaveLength(1);
    expect(round.promptSnapshot.entries.situation.text).not.toMatch(
      /^You and (?:a casual partner|your partner|your ex|an ex)\b/,
    );
  }
});

test.each([0, 12, 19, 21])(
  "Connected Playful does not lose its one requested twist to old associations at seed %i",
  (seed) => {
    const snapshot = generatePrompt(
      {
        categories: [...categories],
        count: 2,
        style: "coherent",
        flavor: "playful",
      },
      seededRng(seed),
    ).snapshot;
    const playful = Object.values(snapshot.entries).filter(
      (entry) =>
        prompts.find((source) => source.id === entry.id)?.flavor === "playful",
    );

    expect(playful).toHaveLength(1);
  },
);

test.each([
  ["P4", "profession"],
  ["G8", "profession"],
  ["T2", "profession"],
  ["W3", "opening_line"],
] as const)(
  "the adult %s version has genuinely adult input in its own %s slot",
  (activityId, category) => {
    const session = makePartySession(
      2,
      UserPreferencesSchema.parse({}),
      [],
      PartyOptionsSchema.parse({
        selectedActivityIds: [activityId],
        level: "18_plus",
        adultsConfirmedAt: "2026-10-17T20:00:00.000Z",
      }),
      randomUUID,
      42,
    );
    const snapshot = currentRound(session).promptSnapshot;
    expect(snapshot.entries[category].contentRating).toBe("mature_suggestive");
    expect(snapshot.entries).not.toHaveProperty("situation");
    expect(snapshot.relationship).toBeNull();
  },
);
