import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { activityById } from "../../src/domain/content";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import {
  appendPartyCard,
  makePartySession,
  passPartyTurn,
  rerollPartyPrompt,
} from "../../src/domain/party";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import { seededRng } from "../../src/domain/random";
import {
  currentRound,
  makeSession,
  prepareRound,
  restoreSession,
  transitionRound,
} from "../../src/domain/session";

const prefs = UserPreferencesSchema.parse({});
const now = "2026-10-17T20:00:00.000Z";
const make = (count = 3) =>
  makeSession(count, "surprise", prefs, randomUUID, 42, [], "G2");
const context = (session: ReturnType<typeof make>) => ({
  session,
  now,
  id: randomUUID,
  rng: seededRng(17),
});

test("New Choice needs two actors and a separate caller, not a two-person scene", () => {
  expect(() => make(2)).toThrow(/3|caller/i);
  for (const [count, actors] of [
    [3, 2],
    [4, 3],
    [5, 4],
    [12, 4],
  ]) {
    const s = make(count);
    const r = currentRound(s);
    expect(r.performerIds).toHaveLength(actors);
    expect(r.supportingPlayerIds).toHaveLength(1);
    expect(r.performerIds).not.toContain(r.supportingPlayerIds[0]);
    expect(
      r.promptSnapshot.relationship?.assignments.map((a) => a.playerId).sort(),
    ).toEqual([...r.performerIds].sort());
  }
});

test("the separate caller rotates fairly without receiving a character", () => {
  const s = make(6);
  s.rounds = [];
  for (let i = 0; i < 12; i++) {
    const r = prepareRound(s, activityById("G2"), randomUUID, now);
    r.startedAt = now;
    r.status = "complete";
    r.elapsedMs = 60000;
    s.rounds.push(r);
  }
  for (const player of s.players)
    expect(
      s.rounds.filter((r) => r.supportingPlayerIds.includes(player.id)),
    ).toHaveLength(2);
});

test("New Choice never interrupts automatically, including captured legacy schedules", () => {
  const s = make();
  let r = currentRound(s);
  expect(r.schedule).toEqual([]);
  r = transitionRound(r, { type: "READY" }, context(s));
  r = transitionRound(r, { type: "START" }, context(s));
  r.schedule = [
    {
      id: "legacy-automatic",
      type: "new_choice",
      text: "NEW CHOICE!",
      atElapsedMs: 1000,
      displayDurationMs: 6000,
    },
  ];
  r = transitionRound(r, { type: "TICK", deltaMs: 2000 }, context(s));
  expect(r.cue).toBeNull();
  const original = structuredClone(r.promptSnapshot);
  const actors = [...r.performerIds];
  r = transitionRound(r, { type: "CALL_CUE" }, context(s));
  expect(r.cue?.text).toBe("NEW CHOICE!");
  expect(r.cue?.type).toBe("new_choice");
  expect(r.promptSnapshot).toEqual(original);
  expect(r.performerIds).toEqual(actors);
});

test("captured two-person New Choice saves load paused unchanged but cannot resume without a caller", () => {
  const s = makeSession(2, "surprise", prefs, randomUUID, 42, [], "G1");
  const captured = currentRound(s);
  captured.activityId = "G2";
  captured.status = "live";
  const original = structuredClone(captured.promptSnapshot);
  const restored = restoreSession(s);
  expect(currentRound(restored).status).toBe("paused");
  expect(currentRound(restored).promptSnapshot).toEqual(original);
  expect(() =>
    transitionRound(
      currentRound(restored),
      { type: "RESUME" },
      context(restored),
    ),
  ).toThrow(/caller.*add.*player.*change.*game/i);
});

test("four actors cannot resume after the caller passes, even though the total cast exceeds three", () => {
  const options = PartyOptionsSchema.parse({ selectedActivityIds: ["G2"] });
  let s = makePartySession(6, prefs, [], options, randomUUID, 42);
  const r = currentRound(s);
  r.status = "live";
  const caller = r.supportingPlayerIds[0];
  s = passPartyTurn(s, caller);
  expect(currentRound(s).performerIds).toHaveLength(4);
  expect(currentRound(s).supportingPlayerIds).toEqual([]);
  expect(() =>
    transitionRound(currentRound(s), { type: "RESUME" }, context(s)),
  ).toThrow(/caller/i);
});

test("Party requires three total humans and generates characters for actors only", () => {
  const options = PartyOptionsSchema.parse({ selectedActivityIds: ["G2"] });
  expect(() =>
    makePartySession(2, prefs, [], options, randomUUID, 42),
  ).toThrow();
  let s = makePartySession(6, prefs, [], options, randomUUID, 42);
  for (let i = 0; i < 6; i++) {
    const r = currentRound(s);
    expect(r.performerIds).toHaveLength(4);
    expect(r.supportingPlayerIds).toHaveLength(1);
    expect(r.performerIds).not.toContain(r.supportingPlayerIds[0]);
    expect(
      r.promptSnapshot.relationship?.assignments.map((a) => a.playerId).sort(),
    ).toEqual([...r.performerIds].sort());
    expect(r.schedule).toEqual([]);
    s.rounds[s.rounds.length - 1] = {
      ...r,
      startedAt: now,
      status: "complete",
    };
    if (i < 5) s = appendPartyCard(s, randomUUID, now);
  }
  for (const player of s.players)
    expect(
      s.rounds.filter((r) => r.supportingPlayerIds.includes(player.id)),
    ).toHaveLength(1);
});

test("rerolling a Party New Choice scene never gives the caller a character", () => {
  const s = makePartySession(
    6,
    prefs,
    [],
    PartyOptionsSchema.parse({ selectedActivityIds: ["G2"] }),
    randomUUID,
    42,
  );
  const original = currentRound(s);
  const next = currentRound(rerollPartyPrompt(s));
  expect(next.performerIds).toEqual(original.performerIds);
  expect(next.supportingPlayerIds).toEqual(original.supportingPlayerIds);
  expect(
    next.promptSnapshot.relationship?.assignments.map((a) => a.playerId).sort(),
  ).toEqual([...original.performerIds].sort());
});
