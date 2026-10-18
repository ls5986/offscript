import "fake-indexeddb/auto";
import {
  makePartySession,
  navigatePartyPrompt,
  rerollPartyPrompt,
} from "../../src/domain/party";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import { currentRound, makeSession } from "../../src/domain/session";
import { initialData } from "../../src/storage/model";
import { WebRepository } from "../../src/storage/repository.web";
test("versioned IndexedDB roundtrips aggregates across adapter reopening and resets", async () => {
  const repo = new WebRepository();
  await repo.initialize();
  await repo.resetAllLocalData();
  const d = initialData();
  d.hasPlayed = true;
  d.favorites = ["G2"];
  d.sessions = [
    makeSession(6, "surprise", d.preferences, randomUUID, 52, ["Alex"], "G2"),
  ];
  d.studio.result = generatePrompt(
    { categories: ["relationship", "location"], count: 6, style: "coherent" },
    seededRng(7),
  ).snapshot;
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
  const second = new WebRepository();
  await second.initialize();
  expect(await second.read()).toEqual(d);
  const invalid = { ...d, version: 2 };
  await expect(second.write(invalid as typeof d)).rejects.toThrow();
  await second.resetAllLocalData();
  expect(await repo.read()).toEqual(initialData());
});

// Runs the production native repository against a real SQLite SQL engine.
// This verifies migration/SQL contracts; it does not substitute for iOS device tests.

test("browser aggregate restores prompt history with exact backward and forward words", async () => {
  const repo = new WebRepository();
  await repo.initialize();
  await repo.resetAllLocalData();
  const data = initialData();
  const first = makePartySession(
    2,
    data.preferences,
    [],
    PartyOptionsSchema.parse({
      selectedActivityIds: ["P1"],
    }),
    randomUUID,
    42,
  );
  const next = rerollPartyPrompt(first);
  data.sessions = [navigatePartyPrompt(next, -1)];
  await repo.write(data);
  const reopened = new WebRepository();
  await reopened.initialize();
  const restored = await reopened.read();
  expect(currentRound(restored.sessions[0]).promptSnapshot).toEqual(
    currentRound(first).promptSnapshot,
  );
  expect(
    currentRound(navigatePartyPrompt(restored.sessions[0], 1)).promptSnapshot,
  ).toEqual(currentRound(next).promptSnapshot);
});
