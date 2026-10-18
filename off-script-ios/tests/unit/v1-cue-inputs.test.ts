import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { activityById, prompts } from "../../src/domain/content";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import { seededRng } from "../../src/domain/random";
import {
  currentRound,
  generateCueSchedule,
  makeSession,
  transitionRound,
} from "../../src/domain/session";

test("casual Emotion Remote uses beginner cues both automatically and from the manual button", () => {
  for (let seed = 0; seed < 40; seed++) {
    const schedule = generateCueSchedule(
      activityById("G3"),
      seededRng(seed),
      "playful",
    );
    for (const cue of schedule)
      expect(
        prompts.find((prompt) => prompt.text === cue.text)?.tags,
      ).toContain("beginner_emotion");
    const session = makeSession(
      2,
      "surprise",
      UserPreferencesSchema.parse({}),
      randomUUID,
      seed,
      [],
      "G3",
    );
    const round = { ...currentRound(session), status: "live" as const };
    const manual = transitionRound(
      round,
      { type: "CALL_CUE" },
      {
        session,
        now: "2026-10-17T20:00:00.000Z",
        id: randomUUID,
        rng: seededRng(seed),
      },
    );
    expect(
      prompts.find((prompt) => prompt.text === manual.cue?.text)?.tags,
    ).toContain("beginner_emotion");
  }
});

test("practice retains nuanced emotion choices rather than deleting the advanced pool", () => {
  const seen = new Set<string>();
  for (let seed = 0; seed < 40; seed++)
    for (const cue of generateCueSchedule(
      activityById("G3"),
      seededRng(seed),
      "grounded",
    ))
      seen.add(cue.text);
  expect(
    [...seen].some(
      (text) =>
        !prompts
          .find((prompt) => prompt.text === text)
          ?.tags.includes("beginner_emotion"),
    ),
  ).toBe(true);
});
