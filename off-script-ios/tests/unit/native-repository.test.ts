import {
  makePartySession,
  editPartyRoster,
  appendPartyCard,
  rerollPartyPrompt,
  navigatePartyPrompt,
} from "../../src/domain/party";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import { randomUUID } from "node:crypto";
import { expect, test, vi } from "vitest";
import { generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import {
  currentRound,
  makeSession,
  transitionRound,
} from "../../src/domain/session";
import { initialData } from "../../src/storage/model";
import { NativeRepository } from "../../src/storage/repository.native";
vi.mock("expo-sqlite", async () => {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(":memory:");
  return {
    openDatabaseAsync: async () => ({
      execAsync: async (sql: string) => db.exec(sql),
      getFirstAsync: async (sql: string, ...args: (string | number | null)[]) =>
        db.prepare(sql).get(...args),
      runAsync: async (sql: string, ...args: (string | number | null)[]) =>
        db.prepare(sql).run(...args),
      withTransactionAsync: async (fn: () => Promise<void>) => {
        db.exec("BEGIN");
        try {
          await fn();
          db.exec("COMMIT");
        } catch (e) {
          db.exec("ROLLBACK");
          throw e;
        }
      },
    }),
  };
});
test("native migration is idempotent, transactional writes roundtrip, and deletion removes data", async () => {
  const repo = new NativeRepository();
  await repo.initialize();
  const d = initialData();
  const s = makeSession(
    6,
    "surprise",
    d.preferences,
    randomUUID,
    10,
    ["Sam"],
    "G2",
  );
  d.sessions = [s];
  d.studio.result = generatePrompt(
    {
      categories: ["relationship", "location", "situation"],
      count: 6,
      style: "coherent",
    },
    seededRng(22),
  ).snapshot;
  d.studio.result.entries.location.locked = true;
  expect(d.studio.result.composition?.text).toBeTruthy();
  d.favorites = ["G2"];
  d.hasPlayed = true;
  const context = {
    now: new Date().toISOString(),
    id: randomUUID,
    rng: seededRng(1),
    session: s,
  };
  s.rounds[0] = transitionRound(currentRound(s), { type: "READY" }, context);
  s.rounds[0] = transitionRound(currentRound(s), { type: "START" }, context);
  s.rounds[0] = transitionRound(
    currentRound(s),
    { type: "TICK", deltaMs: 1250.4 },
    context,
  );
  d.savedPrompts = [
    {
      id: randomUUID(),
      label: "Exact scene",
      createdAt: new Date().toISOString(),
      snapshot: s.rounds[0].promptSnapshot,
      playerCount: 2,
    },
  ];
  d.preferences.selectedPartyActivityIds = ["W1"];
  d.sessions.push(
    makePartySession(
      4,
      d.preferences,
      ["Alex", "Sam"],
      PartyOptionsSchema.parse({ selectedActivityIds: ["W1"] }),
      randomUUID,
      22,
    ),
  );
  d.feedback.push({
    id: randomUUID(),
    activityId: "W1",
    roundId: d.sessions.at(-1)!.rounds[0].id,
    rating: "fun",
    createdAt: new Date().toISOString(),
  });
  await repo.write(d);
  await repo.initialize();
  expect(await repo.read()).toEqual(d);
  s.scores = [
    {
      id: randomUUID(),
      roundId: currentRound(s).id,
      targetPlayerId: null,
      targetTeamId: s.teams[0].id,
      points: 1,
      reason: "Human point",
    },
  ];
  await repo.write(d);
  await repo.write(d);
  expect((await repo.read()).sessions[0].scores).toEqual(s.scores);
  const party = d.sessions[1];
  const archived = structuredClone(party.rounds[0]);
  d.sessions[1] = editPartyRoster(
    party,
    [
      { id: party.players[0].id, name: "Renamed Alex" },
      { id: party.players[2].id, name: "Sam" },
      { name: "New person" },
    ],
    randomUUID,
    new Date().toISOString(),
  );
  await repo.write(d);
  await repo.write(d);
  expect((await repo.read()).sessions[1]).toEqual(d.sessions[1]);
  expect((await repo.read()).sessions[1].rounds[0].promptSnapshot).toEqual(
    archived.promptSnapshot,
  );
  expect((await repo.read()).sessions[1].party!.archivedPlayers).toHaveLength(
    2,
  );
  await repo.resetAllLocalData();
  expect(await repo.read()).toEqual(initialData());
});

test("invalid native saves cannot replace the previous aggregate", async () => {
  const repo = new NativeRepository();
  await repo.initialize();
  await repo.resetAllLocalData();
  const original = initialData();
  original.favorites = ["G2"];
  original.sessions = [
    makeSession(3, "surprise", original.preferences, randomUUID, 17, [], "G2"),
  ];
  await repo.write(original);
  const invalid = structuredClone(original);
  invalid.sessions[0].rounds = [];
  await expect(repo.write(invalid)).rejects.toThrow();
  expect(await repo.read()).toEqual(original);
});

test("native aggregate restores prompt browsing without regenerating historical words", async () => {
  const repo = new NativeRepository();
  await repo.initialize();
  await repo.resetAllLocalData();
  const data = initialData();
  const first = makePartySession(
    2,
    data.preferences,
    [],
    PartyOptionsSchema.parse({
      selectedActivityIds: ["P4"],
    }),
    randomUUID,
    42,
  );
  const next = rerollPartyPrompt(first);
  data.sessions = [next];
  data.studio.result = structuredClone(currentRound(next).promptSnapshot);
  data.studio.promptNavigation = structuredClone(
    currentRound(next).promptNavigation,
  );
  await repo.write(data);
  const reopened = new NativeRepository();
  await reopened.initialize();
  const restored = await reopened.read();
  expect(restored.studio.promptNavigation).toEqual(
    data.studio.promptNavigation,
  );
  expect(
    currentRound(navigatePartyPrompt(restored.sessions[0], -1)).promptSnapshot,
  ).toEqual(currentRound(first).promptSnapshot);
});

test("native saves preserve portable Party roles when a prompt is reused with a new cast", async () => {
  const repo = new NativeRepository();
  await repo.initialize();
  await repo.resetAllLocalData();
  const data = initialData();
  const party = appendPartyCard(
    makePartySession(
      4,
      data.preferences,
      [],
      PartyOptionsSchema.parse({}),
      randomUUID,
      17,
    ),
    randomUUID,
    new Date().toISOString(),
    { recipeId: "g1_clean" },
  );
  const prompt = structuredClone(currentRound(party).promptSnapshot);
  data.sessions = [
    makeSession(
      2,
      "scene_lab",
      data.preferences,
      randomUUID,
      17,
      ["Nora", "Kai"],
      "S1",
      prompt,
    ),
  ];
  await repo.write(data);
  expect((await repo.read()).sessions[0].rounds[0].promptSnapshot).toEqual(
    prompt,
  );
});
