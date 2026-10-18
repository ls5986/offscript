import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";
import {
  activities,
  activityById,
  categories,
  topics,
} from "../../src/domain/content";
import {
  SessionSettingsSchema,
  UserPreferencesSchema,
} from "../../src/domain/contracts";
import { emptyPrompt, generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import {
  chooseNextActivity,
  currentRound,
  eligibleActivities,
  exposure,
  makeSession,
  prepareRound,
  restoreSession,
  SessionSnapshotSchema,
  transitionRound,
} from "../../src/domain/session";
const prefs = UserPreferencesSchema.parse({ matureOptIn: true });
function context(s: ReturnType<typeof makeSession>) {
  return {
    now: new Date().toISOString(),
    rng: seededRng(42),
    id: randomUUID,
    session: s,
  };
}
function session(id = "G2", n = id === "G2" ? 3 : 2, seed = 42) {
  return makeSession(n, "surprise", prefs, randomUUID, seed, [], id);
}
describe("catalog and real activity lifecycle", () => {
  for (const a of activities)
    test(`${a.id} ${a.title}: prepare, play, finish, replay`, () => {
      const s = session(a.id, a.minPlayers);
      let r = currentRound(s);
      expect(new Set([...r.performerIds, ...r.supportingPlayerIds]).size).toBe(
        r.performerIds.length + r.supportingPlayerIds.length,
      );
      r = transitionRound(r, { type: "READY" }, context(s));
      while (r.status === "private_reveal")
        r = transitionRound(r, { type: "HIDE_PRIVATE_REVEAL" }, context(s));
      expect(r.status).toBe("ready");
      r = transitionRound(r, { type: "START" }, context(s));
      r = transitionRound(r, { type: "TICK", deltaMs: 1000 }, context(s));
      expect(r.elapsedMs).toBe(1000);
      r = transitionRound(r, { type: "FINISH" }, context(s));
      expect(r.status).toBe("review");
      r = transitionRound(r, { type: "COMPLETE" }, context(s));
      expect(r.status).toBe("complete");
      s.rounds = [r];
      const replay = prepareRound(s, a, randomUUID, new Date().toISOString());
      expect(replay.ordinal).toBe(1);
      expect(replay.activityId).toBe(a.id);
      expect(
        SessionSnapshotSchema.safeParse({ ...s, rounds: [r, replay] }).success,
      ).toBe(true);
    });
  test("all clean counts and hard gates remain valid", () => {
    for (const n of [2, 3, 6, 12])
      for (let seed = 0; seed < 50; seed++) {
        const settings = SessionSettingsSchema.parse({
          mode: "surprise",
          playerCount: n,
          rngSeed: seed,
        });
        const a = chooseNextActivity(
          settings,
          UserPreferencesSchema.parse({}),
          [],
          seededRng(seed),
        );
        expect(a.minPlayers).toBeLessThanOrEqual(n);
        expect(a.maxPlayers).toBeGreaterThanOrEqual(n);
        expect(a.contentRating).toBe("clean");
      }
    expect(
      eligibleActivities(
        SessionSettingsSchema.parse({
          mode: "just_us",
          playerCount: 2,
          rngSeed: 1,
        }),
        prefs,
      ).every((a) => a.minPlayers === 2),
    ).toBe(true);
  });
  test("classroom beats mature opt-in and saved session rating", () => {
    const settings = SessionSettingsSchema.parse({
      mode: "surprise",
      playerCount: 6,
      rngSeed: 1,
      contentRating: "mature_suggestive",
    });
    expect(
      eligibleActivities(settings, { ...prefs, classroomDefault: true }).some(
        (a) => a.id === "P2",
      ),
    ).toBe(false);
    expect(() =>
      chooseNextActivity(
        { ...settings, playerCount: 2 },
        prefs,
        [],
        seededRng(1),
      ),
    ).not.toThrow();
  });
  test("distinct actor and support roles", () => {
    for (const id of ["G7", "T3"]) {
      const r = currentRound(session(id, 6));
      expect(r.supportingPlayerIds).toHaveLength(1);
      expect(r.performerIds).not.toContain(r.supportingPlayerIds[0]);
    }
    const r = currentRound(session("T3", 6));
    expect(new Set(r.secrets.map((s) => s.id)).size).toBe(r.secrets.length);
    expect(
      r.secrets.some((x) => r.supportingPlayerIds.includes(x.playerId)),
    ).toBe(false);
  });
  test("skip before start has no fairness cost; restore pauses", () => {
    let s = session();
    let r = currentRound(s);
    r = transitionRound(r, { type: "SKIP" }, context(s));
    s.rounds = [r];
    expect(exposure(s.players[0].id, s.rounds).rounds).toBe(0);
    s = session();
    r = transitionRound(currentRound(s), { type: "READY" }, context(s));
    r = transitionRound(r, { type: "START" }, context(s));
    s.rounds = [r];
    expect(currentRound(restoreSession(s)).status).toBe("paused");
  });
  test("fair pair selection across 50 six-person sessions", () => {
    for (let seed = 0; seed < 50; seed++) {
      const s = session("G2", 6, seed);
      s.rounds = [];
      for (let i = 0; i < 10; i++) {
        const r = prepareRound(
          s,
          activityById("G2"),
          randomUUID,
          new Date().toISOString(),
        );
        r.startedAt = new Date().toISOString();
        r.status = "complete";
        r.elapsedMs = 60000;
        s.rounds.push(r);
      }
      const rounds = s.players.map((p) => exposure(p.id, s.rounds).rounds);
      expect(Math.max(...rounds) - Math.min(...rounds)).toBeLessThanOrEqual(2);
    }
  });
  test("timer pause, manual cue suppression, cue bank types", () => {
    for (const id of ["G2", "G3", "G4", "G9", "S5"]) {
      const s = session(id);
      const ctx = context(s);
      let r = transitionRound(currentRound(s), { type: "READY" }, ctx);
      r = transitionRound(r, { type: "START" }, ctx);
      r = transitionRound(r, { type: "CALL_CUE" }, ctx);
      expect(r.cue?.type).toBe(activityById(id).cueTypes[0]);
      const before = r.remainingMs;
      r = transitionRound(r, { type: "PAUSE" }, ctx);
      r = transitionRound(r, { type: "TICK", deltaMs: 1000 }, ctx);
      expect(r.remainingMs).toBe(before);
      r = transitionRound(r, { type: "RESUME" }, ctx);
      s.settings.cuePreference = "manual";
      r.cue = null;
      for (let i = 0; i < 40; i++)
        r = transitionRound(r, { type: "TICK", deltaMs: 1000 }, context(s));
      expect(r.cue).toBe(null);
    }
  });
  test("Half-Life never runs through segment transitions", () => {
    const s = session("G10");
    let r = transitionRound(currentRound(s), { type: "READY" }, context(s));
    r = transitionRound(r, { type: "START" }, context(s));
    for (let i = 0; i < 60; i++)
      r = transitionRound(r, { type: "TICK", deltaMs: 1000 }, context(s));
    expect(r.segment).toBe(1);
    expect(r.segmentReady).toBe(true);
    expect(r.remainingMs).toBe(30000);
    r = transitionRound(r, { type: "TICK", deltaMs: 1000 }, context(s));
    expect(r.remainingMs).toBe(30000);
    r = transitionRound(r, { type: "NEXT_SEGMENT" }, context(s));
    expect(r.segmentReady).toBe(false);
  });
  test("freeze and relay preserve distinct cue meanings", () => {
    for (const [id, text] of [
      ["G5", "NEW"],
      ["T4", "SAME"],
    ]) {
      const s = session(id, 6);
      let r = transitionRound(currentRound(s), { type: "READY" }, context(s));
      r = transitionRound(r, { type: "START" }, context(s));
      const previous = r.performerIds;
      r = transitionRound(r, { type: "ROTATE" }, context(s));
      expect(r.cue?.text).toContain(text);
      expect(r.performerIds).not.toEqual(previous);
    }
  });
  test("irregular plurals are authored", () => {
    expect(topics.find((t) => t.word === "goose")?.plural).toBe("geese");
    expect(topics.find((t) => t.word === "mouse")?.plural).toBe("mice");
  });
});
describe("Studio", () => {
  test("all ten categories work alone and together for 2–12", () => {
    for (let n = 2; n <= 12; n++) {
      for (const c of categories) {
        const { snapshot } = generatePrompt(
          { categories: [c], count: n, style: "independent" },
          seededRng(n),
        );
        expect(Object.keys(snapshot.entries)).toEqual([c]);
        if (c === "relationship")
          expect(snapshot.relationship?.assignments).toHaveLength(n);
      }
      const { snapshot } = generatePrompt(
        { categories: [...categories], count: n, style: "coherent" },
        seededRng(n),
      );
      expect(Object.keys(snapshot.entries)).toHaveLength(10);
    }
  });
  test("locks stay exact; single reroll leaves every other value untouched", () => {
    let { snapshot } = generatePrompt(
      { categories: [...categories], count: 2, style: "coherent" },
      seededRng(1),
    );
    snapshot.entries.location.locked = true;
    const locked = structuredClone(snapshot.entries.location);
    const next = generatePrompt(
      {
        categories: [...categories],
        count: 2,
        style: "coherent",
        previous: snapshot,
      },
      seededRng(2),
    ).snapshot;
    expect(next.entries.location).toEqual(locked);
    const reroll = generatePrompt(
      {
        categories: [...categories],
        count: 2,
        style: "coherent",
        previous: next,
        only: "emotion",
      },
      seededRng(3),
    ).snapshot;
    for (const c of categories.filter((c) => c !== "emotion"))
      expect(reroll.entries[c]).toEqual(next.entries[c]);
    expect(reroll.entries.emotion.id).not.toBe(next.entries.emotion.id);
  });
  test("usage exhausts without freezing or repeating early", () => {
    let usage = {};
    const ids: string[] = [];
    for (let i = 0; i < 30; i++) {
      const result = generatePrompt(
        { categories: ["genre"], count: 2, style: "independent", usage },
        seededRng(i),
      );
      usage = result.usage;
      ids.push(result.snapshot.entries.genre.id);
    }
    expect(new Set(ids.slice(0, 25)).size).toBe(25);
    expect(ids[25]).not.toBe(ids[24]);
  });
  test("deliberately empty prompt is valid", () => {
    expect(
      generatePrompt(
        { categories: [], count: 2, style: "coherent" },
        seededRng(1),
      ).snapshot,
    ).toEqual({ ...emptyPrompt(), generationStyle: "coherent" });
  });
});
