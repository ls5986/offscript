import "fake-indexeddb/auto";
import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { prompts, topics } from "../../src/domain/content";
import {
  makePartySession,
  editPartyRoster,
  appendPartyCard,
} from "../../src/domain/party";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import {
  emptyPrompt,
  generatePrompt,
  snapshotIsClean,
  resolvePromptPlayerId,
} from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import { currentRound, makeSession } from "../../src/domain/session";
import {
  AppDataSchema,
  initialData,
  type AppData,
} from "../../src/storage/model";
import { WebRepository } from "../../src/storage/repository.web";

function fixture() {
  const data = initialData();
  data.sessions = [
    makeSession(3, "surprise", data.preferences, randomUUID, 17, [], "G2"),
  ];
  return data;
}
const invalid: {
  name: string;
  path: string;
  change: (data: AppData) => void;
}[] = [
  {
    name: "foreign UUID relationship actor outside an imported scene",
    path: "sessions.0.rounds.0.promptSnapshot.relationship.assignments.0.playerId",
    change: (data) => {
      currentRound(
        data.sessions[0],
      ).promptSnapshot.relationship!.assignments[0].playerId = randomUUID();
    },
  },
  {
    name: "missing rounds",
    path: "sessions.0.rounds",
    change: (d) => {
      d.sessions[0].rounds = [];
    },
  },
  {
    name: "unknown game",
    path: "sessions.0.rounds.0.activityId",
    change: (d) => {
      currentRound(d.sessions[0]).activityId = "missing_game";
    },
  },
  {
    name: "foreign performer",
    path: "sessions.0.rounds.0.performerIds.0",
    change: (d) => {
      currentRound(d.sessions[0]).performerIds[0] = randomUUID();
    },
  },
  {
    name: "duplicate cast role",
    path: "sessions.0.rounds.0.supportingPlayerIds.0",
    change: (d) => {
      currentRound(d.sessions[0]).supportingPlayerIds = [
        currentRound(d.sessions[0]).performerIds[0],
      ];
    },
  },
  {
    name: "duplicate player",
    path: "sessions.0.players.3.id",
    change: (d) => {
      d.sessions[0].players.push({ ...d.sessions[0].players[0], seatIndex: 3 });
      d.sessions[0].settings.playerCount = 4;
    },
  },
  {
    name: "duplicate seat",
    path: "sessions.0.players.1.seatIndex",
    change: (d) => {
      d.sessions[0].players[1].seatIndex = d.sessions[0].players[0].seatIndex;
    },
  },
  {
    name: "duplicate round ordinal",
    path: "sessions.0.rounds.1.ordinal",
    change: (d) => {
      d.sessions[0].rounds.push({
        ...structuredClone(currentRound(d.sessions[0])),
        id: randomUUID(),
      });
    },
  },
  {
    name: "foreign session reference",
    path: "sessions.0.rounds.0.sessionId",
    change: (d) => {
      currentRound(d.sessions[0]).sessionId = randomUUID();
    },
  },
  {
    name: "foreign relationship actor",
    path: "sessions.0.rounds.0.promptSnapshot.relationship.assignments.0.playerId",
    change: (d) => {
      currentRound(
        d.sessions[0],
      ).promptSnapshot.relationship!.assignments[0].playerId = "not-a-player";
    },
  },
  {
    name: "wrong active count",
    path: "sessions.0.settings.playerCount",
    change: (d) => {
      d.sessions[0].settings.playerCount = 12;
    },
  },
  {
    name: "invalid timestamp",
    path: "sessions.0.createdAt",
    change: (d) => {
      d.sessions[0].createdAt = "not-a-date";
    },
  },
  {
    name: "duplicate session",
    path: "sessions.1.id",
    change: (d) => {
      d.sessions.push(structuredClone(d.sessions[0]));
    },
  },
  {
    name: "duplicate team member",
    path: "sessions.0.teams.0.playerIds.1",
    change: (d) => {
      d.sessions[0].teams[0].playerIds = [
        d.sessions[0].players[0].id,
        d.sessions[0].players[0].id,
      ];
    },
  },
  {
    name: "foreign passed player",
    path: "sessions.0.party.passedPlayerIds.0",
    change: (d) => {
      d.sessions = [
        makePartySession(
          3,
          d.preferences,
          [],
          PartyOptionsSchema.parse({}),
          randomUUID,
          17,
        ),
      ];
      d.sessions[0].party!.passedPlayerIds = [randomUUID()];
    },
  },
  {
    name: "duplicate voter",
    path: "sessions.0.votes.1.voterPlayerId",
    change: (d) => {
      const s = d.sessions[0];
      const vote = {
        id: randomUUID(),
        roundId: currentRound(s).id,
        voterPlayerId: s.players[0].id,
        targetPlayerId: s.players[1].id,
        targetTeamId: null,
      };
      s.votes = [vote, { ...vote, id: randomUUID() }];
    },
  },
];

test.each(invalid)(
  "saved data rejects $name at its actionable location",
  ({ path, change }) => {
    const data = fixture();
    change(data);
    const result = AppDataSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success)
      expect(
        result.error.issues.some((issue) => issue.path.join(".") === path),
      ).toBe(true);
  },
);

test("archived Party actors remain valid references without rewriting old rounds", () => {
  const data = initialData();
  const session = makePartySession(
    4,
    data.preferences,
    ["Alex", "Bea", "Sam", "Jo"],
    PartyOptionsSchema.parse({}),
    randomUUID,
    17,
  );
  const original = structuredClone(session.rounds);
  const edited = editPartyRoster(
    session,
    [
      { id: session.players[0].id, name: "Alex" },
      { id: session.players[2].id, name: "Sam" },
      { name: "New person" },
    ],
    randomUUID,
    new Date().toISOString(),
  );
  data.sessions = [edited];
  const parsed = AppDataSchema.parse(data);
  expect(
    parsed.sessions[0].rounds
      .slice(0, original.length)
      .map((round) => round.promptSnapshot),
  ).toEqual(original.map((round) => round.promptSnapshot));
  expect(
    parsed.sessions[0].party!.archivedPlayers.map((player) => player.id),
  ).toContain(session.players[1].id);
});

test("legacy Studio role placeholders and legacy competitive saves remain readable", () => {
  const data = initialData();
  const prompt = generatePrompt(
    { categories: ["relationship"], count: 2, style: "coherent" },
    seededRng(17),
  ).snapshot;
  const session = makeSession(
    2,
    "scene_lab",
    data.preferences,
    randomUUID,
    17,
    [],
    "S1",
    prompt,
  );
  currentRound(session).variant = "battle";
  data.sessions = [session];
  expect(
    AppDataSchema.parse(data).sessions[0].rounds[0].promptSnapshot,
  ).toEqual(prompt);
  expect(prompt.relationship!.assignments[0].playerId).toBe("Player 1");
});

test("an invalid IndexedDB save is rejected without replacing the previous saved data", async () => {
  const repository = new WebRepository();
  await repository.initialize();
  const original = fixture();
  original.favorites = ["G2"];
  await repository.write(original);
  const invalid = structuredClone(original);
  invalid.sessions[0].rounds = [];
  await expect(repository.write(invalid)).rejects.toThrow();
  expect(await repository.read()).toEqual(original);
});

test("new generated ingredients retain their content classification", () => {
  const snapshot = generatePrompt(
    { categories: ["location"], count: 2, style: "coherent" },
    seededRng(17),
  ).snapshot;
  expect(snapshot.entries.location).toMatchObject({ contentRating: "clean" });
});

test("saved classification takes precedence over a later catalog interpretation", () => {
  const source = prompts.find(
    (prompt) =>
      prompt.category === "location" && prompt.contentRating === "clean",
  )!;
  const snapshot = {
    ...emptyPrompt(),
    entries: {
      location: {
        id: source.id,
        text: source.text,
        locked: true,
        contentRating: "spicy" as const,
      },
    },
  };
  expect(snapshotIsClean(snapshot)).toBe(false);
});

test("unknown unclassified ingredients are not silently treated as classroom-clean", () => {
  const snapshot = {
    ...emptyPrompt(),
    entries: {
      location: { id: "unknown", text: "Saved original", locked: true },
    },
  };
  expect(snapshotIsClean(snapshot)).toBe(false);
});

test("known legacy aliases stay usable without rewriting their saved text", () => {
  const snapshot = {
    ...emptyPrompt(),
    entries: {
      location: {
        id: "prompt_location_078",
        text: "The kitchen of a restaurant that only serves toast",
        locked: true,
      },
    },
  };
  const original = structuredClone(snapshot);
  expect(snapshotIsClean(snapshot)).toBe(true);
  expect(snapshot).toEqual(original);
});

test("joke words are classified too, including unknown historical words", () => {
  const source = topics.find((topic) => topic.contentRating === "clean")!;
  expect(
    snapshotIsClean({
      ...emptyPrompt(),
      jokeTopic: { id: source.id, word: source.word },
    }),
  ).toBe(true);
  expect(
    snapshotIsClean({
      ...emptyPrompt(),
      jokeTopic: { id: "unknown", word: "Saved original" },
    }),
  ).toBe(false);
});

function importedPartyPrompt() {
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
  for (const entry of Object.values(prompt.entries)) delete entry.contentRating;
  const scene = makeSession(
    2,
    "scene_lab",
    data.preferences,
    randomUUID,
    17,
    ["Nora", "Kai"],
    "S1",
    prompt,
  );
  data.sessions = [scene];
  data.savedPrompts = [
    {
      id: "party-original",
      label: "Saved original",
      createdAt: new Date().toISOString(),
      snapshot: structuredClone(prompt),
      playerCount: 2,
    },
  ];
  return { data, prompt, scene };
}

test("a saved Party prompt can start a new scene without rewriting its portable role identities", () => {
  const { data, prompt, scene } = importedPartyPrompt();
  const parsed = AppDataSchema.parse(data);
  expect(parsed.sessions[0].rounds[0].promptSnapshot).toEqual(prompt);
  expect(parsed.savedPrompts[0].snapshot).toEqual(prompt);
  expect(parsed.sessions[0].players.map((player) => player.id)).not.toContain(
    prompt.relationship!.assignments[0].playerId,
  );
  expect(
    prompt.relationship!.assignments.map((role, index) =>
      resolvePromptPlayerId(
        role.playerId,
        index,
        scene.players,
        currentRound(scene).performerIds,
      ),
    ),
  ).toEqual(currentRound(scene).performerIds);
});

test("a previously stored Party-to-scene handoff remains readable on reopening IndexedDB", async () => {
  const { data, prompt } = importedPartyPrompt();
  const repository = new WebRepository();
  await repository.initialize();
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("off-script", 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction("state", "readwrite");
      transaction.objectStore("state").put(data, "app");
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    db.close();
  }
  const reopened = new WebRepository();
  await reopened.initialize();
  const restored = await reopened.read();
  expect(restored.sessions[0].rounds[0].promptSnapshot).toEqual(prompt);
  expect(restored.savedPrompts[0].snapshot).toEqual(prompt);
});
