import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { activities, activityById } from "../../src/domain/content";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import { seededRng } from "../../src/domain/random";
import {
  currentRound,
  eligibleActivities,
  makeSession,
  restoreSession,
  transitionRound,
} from "../../src/domain/session";

const prefs = UserPreferencesSchema.parse({});
test("free play never counts down, emits automatic cues, or ends a game", () => {
  for (const activity of activities.filter(
    (a) => a.contentRating === "clean" && a.id !== "G10",
  )) {
    const session = makeSession(
      activity.minPlayers,
      "surprise",
      prefs,
      randomUUID,
      42,
      ["Alex", "Bea"],
      activity.id,
      undefined,
      "riff",
      "free",
    );
    const ctx = {
      session,
      now: new Date().toISOString(),
      id: randomUUID,
      rng: seededRng(17),
    };
    let game = transitionRound(currentRound(session), { type: "READY" }, ctx);
    while (game.status === "private_reveal")
      game = transitionRound(game, { type: "HIDE_PRIVATE_REVEAL" }, ctx);
    game = transitionRound(game, { type: "START" }, ctx);
    for (let i = 0; i < 150; i++)
      game = transitionRound(game, { type: "TICK", deltaMs: 2000 }, ctx);
    expect(game.status, activity.id).toBe("live");
    expect(game.elapsedMs).toBe(300000);
    expect(game.remainingMs).toBe(0);
    expect(game.schedule).toEqual([]);
    expect(game.cue).toBeNull();
  }
});
test("free play preserves names and play style through restore; manual cues still work", () => {
  const session = makeSession(
    3,
    "surprise",
    prefs,
    randomUUID,
    42,
    ["Alex", "Bea", "Cam"],
    "G2",
    undefined,
    "riff",
    "free",
  );
  const ctx = {
    session,
    now: new Date().toISOString(),
    id: randomUUID,
    rng: seededRng(17),
  };
  let game = transitionRound(currentRound(session), { type: "READY" }, ctx);
  game = transitionRound(game, { type: "START" }, ctx);
  game = transitionRound(game, { type: "CALL_CUE" }, ctx);
  expect(game.cue?.text).toBe("NEW CHOICE!");
  const restored = restoreSession({ ...session, rounds: [game] });
  expect(restored.settings.playFlow).toBe("free");
  expect(restored.players.map((p) => p.displayName)).toEqual([
    "Alex",
    "Bea",
    "Cam",
  ]);
  expect(currentRound(restored).status).toBe("paused");
  expect(eligibleActivities(restored.settings, prefs)).not.toContain(
    activityById("G10"),
  );
});
test("legacy saved sessions default to rounds", () => {
  const session = makeSession(2, "surprise", prefs, randomUUID, 42);
  const old = JSON.parse(JSON.stringify(session));
  delete old.settings.playFlow;
  expect(restoreSession(old).settings.playFlow).toBe("rounds");
});
