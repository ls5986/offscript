import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import * as party from "../../src/domain/party";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import {
  PromptNavigationSchema,
  UserPreferencesSchema,
} from "../../src/domain/contracts";
import { currentRound, SessionSnapshotSchema } from "../../src/domain/session";
import { AppDataSchema, initialData } from "../../src/storage/model";

const now = "2026-10-17T22:00:00.000Z";
const make = (activity = "P4", count = 2) =>
  party.makePartySession(
    count,
    UserPreferencesSchema.parse({}),
    [],
    PartyOptionsSchema.parse({ selectedActivityIds: [activity] }),
    randomUUID,
    42,
  );

test("quick-game rerolls retain a bounded exact prompt timeline in the current round", () => {
  const session = make();
  const first = structuredClone(currentRound(session).promptSnapshot);
  const next = party.rerollPartyPrompt(session);
  expect(currentRound(next)).toMatchObject({
    promptNavigation: {
      index: 1,
      snapshots: [first, currentRound(next).promptSnapshot],
    },
  });
  expect(currentRound(session).promptSnapshot).toEqual(first);
  expect(currentRound(next).id).toBe(currentRound(session).id);
});

test("back and forward restore exact quick-game words without undoing round progress or the deck cursor", () => {
  expect(party).toHaveProperty("navigatePartyPrompt");
  const first = make();
  const second = party.rerollPartyPrompt(first);
  currentRound(second).turn = 3;
  currentRound(second).elapsedMs = 3456;
  const back = party.navigatePartyPrompt(second, -1);
  expect(currentRound(back).promptSnapshot).toEqual(
    currentRound(first).promptSnapshot,
  );
  expect(currentRound(back)).toMatchObject({ turn: 3, elapsedMs: 3456 });
  expect(back.party!.cursor).toBe(second.party!.cursor);
  expect(back.scores).toEqual(second.scores);
  expect(back.party!.cards).toEqual(second.party!.cards);
  const forward = party.navigatePartyPrompt(back, 1);
  expect(currentRound(forward).promptSnapshot).toEqual(
    currentRound(second).promptSnapshot,
  );
  expect(forward.party!.cursor).toBe(second.party!.cursor);
  SessionSnapshotSchema.parse(forward);
});

test("an explicit reroll after going back branches the timeline, capped at thirty exact snapshots", () => {
  expect(party).toHaveProperty("navigatePartyPrompt");
  let session = make();
  for (let index = 0; index < 35; index++)
    session = party.rerollPartyPrompt(session);
  expect(currentRound(session).promptNavigation!.snapshots).toHaveLength(30);
  expect(currentRound(session).promptNavigation!.index).toBe(29);
  const back = party.navigatePartyPrompt(session, -1);
  const branched = party.rerollPartyPrompt(back);
  expect(currentRound(branched).promptNavigation!.index).toBe(29);
  expect(currentRound(branched).promptNavigation!.snapshots).toHaveLength(30);
});

test("material, roster and game changes cannot restore a stale or ineligible browsing context", () => {
  expect(party).toHaveProperty("navigatePartyPrompt");
  const session = party.rerollPartyPrompt(make());
  session.party!.options.level = "spicy";
  expect(() => party.navigatePartyPrompt(session, -1)).toThrow(
    /previous|history|prompt/i,
  );
  const roster = party.rerollPartyPrompt(make());
  roster.players[0].displayName = "Renamed";
  expect(() => party.navigatePartyPrompt(roster, -1)).toThrow(
    /previous|history|prompt/i,
  );
  const changed = party.appendPartyCard(
    party.rerollPartyPrompt(make()),
    randomUUID,
    now,
    { recipeId: "p4_clean" },
  );
  expect(() => party.navigatePartyPrompt(changed, -1)).toThrow(
    /previous|history|prompt/i,
  );
});

test("scenes and private/caller games never acquire quick-game browsing", () => {
  expect(party).toHaveProperty("navigatePartyPrompt");
  for (const activity of ["G1", "G2", "S4"]) {
    const session = party.rerollPartyPrompt(make(activity, 3));
    expect(currentRound(session).promptNavigation).toBeUndefined();
    expect(() => party.navigatePartyPrompt(session, -1)).toThrow(
      /quick|brows|prompt/i,
    );
  }
});

test("optional navigation remains compatible with old saves and round-trips through the aggregate", () => {
  const data = initialData();
  data.sessions = [party.rerollPartyPrompt(make())];
  const restored = AppDataSchema.parse(JSON.parse(JSON.stringify(data)));
  expect(currentRound(restored.sessions[0])).toHaveProperty("promptNavigation");
  const old = JSON.parse(JSON.stringify(data));
  delete old.sessions[0].rounds[0].promptNavigation;
  delete old.studio.promptNavigation;
  expect(() => AppDataSchema.parse(old)).not.toThrow();
});

test("invalid positions and unbounded imported histories are rejected rather than rendering arbitrary entries", () => {
  const snapshot = currentRound(make()).promptSnapshot;
  expect(
    PromptNavigationSchema.safeParse({
      context: "context",
      snapshots: [snapshot],
      index: 1,
    }).success,
  ).toBe(false);
  expect(
    PromptNavigationSchema.safeParse({
      context: "context",
      snapshots: [],
      index: 0,
    }).success,
  ).toBe(false);
  expect(
    PromptNavigationSchema.safeParse({
      context: "context",
      snapshots: Array(31).fill(snapshot),
      index: 0,
    }).success,
  ).toBe(false);
});

test("old detailed words and locks are not regenerated when browsing back", () => {
  const session = make();
  currentRound(session).promptSnapshot.entries.profession.text =
    "An exact saved professional from an older pack";
  currentRound(session).promptSnapshot.entries.profession.sourcePackVersion =
    "2.3.0";
  const original = structuredClone(currentRound(session).promptSnapshot);
  const next = party.rerollPartyPrompt(session);
  const back = party.navigatePartyPrompt(next, -1);
  expect(currentRound(back).promptSnapshot).toEqual(original);
});
