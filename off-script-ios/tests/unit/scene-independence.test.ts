import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { activityById, prompts } from "../../src/domain/content";
import { composeScene } from "../../src/domain/composer";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import { emptyPrompt, generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import {
  currentRound,
  makeSession,
  prepareRound,
  SessionSnapshotSchema,
} from "../../src/domain/session";

test.each([
  "Colleagues",
  "Friends",
  "Volunteers",
  "Classmates",
  "Coworkers",
  "Partners",
])(
  "combined %s remain a group rather than receiving a singular article",
  (relationship) => {
    const snapshot = {
      ...emptyPrompt(),
      entries: {
        relationship: {
          id: "custom_relationship",
          text: relationship,
          locked: false,
        },
        location: {
          id: "custom_location",
          text: "Costume shop",
          locked: false,
        },
      },
    };
    expect(composeScene(snapshot)?.text).toBe(
      `${relationship} in a costume shop.`,
    );
  },
);

test.each([
  "I started a book club but haven't read the book.",
  "My neighbor keeps reviewing my parking.",
  "You and your partner have different plans.",
])(
  "personal narration stays a separate ingredient instead of being attached after where: %s",
  (text) => {
    const snapshot = {
      ...emptyPrompt(),
      entries: {
        location: { id: "custom_location", text: "Bookstore", locked: false },
        situation: { id: "custom_situation", text, locked: false },
      },
    };
    const before = structuredClone(snapshot);
    const scene = composeScene(snapshot)!;
    expect(scene.includedCategories).not.toContain("situation");
    expect(scene.remainingCategories).toContain("situation");
    expect(scene.text).not.toMatch(/where i|where my|where you/i);
    expect(snapshot).toEqual(before);
  },
);

test.each([4, 6, 12])(
  "a %i-person Studio ensemble survives replay and serialization",
  (count) => {
    const prompt = generatePrompt(
      {
        categories: ["relationship", "location"],
        count,
        style: "coherent",
        compositionEnabled: false,
      },
      seededRng(4),
    ).snapshot;
    const session = makeSession(
      count,
      "scene_lab",
      UserPreferencesSchema.parse({}),
      randomUUID,
      12,
      [],
      "S1",
      prompt,
      "practice",
    );
    const restored = SessionSnapshotSchema.parse(
      JSON.parse(JSON.stringify(session)),
    );
    const next = prepareRound(
      restored,
      activityById("S1"),
      randomUUID,
      session.createdAt,
    );
    expect(next.performerIds).toHaveLength(count);
    expect(next.promptSnapshot.relationship?.assignments).toHaveLength(count);
    expect(Object.keys(next.promptSnapshot.entries).sort()).toEqual([
      "location",
      "relationship",
    ]);
    expect(next.promptSnapshot.compositionEnabled).toBe(false);
    expect(currentRound(restored).promptSnapshot).toEqual(prompt);
  },
);

test("an explicitly enlarged Studio scene keeps all active people on the next setup", () => {
  const prompt = generatePrompt(
    { categories: ["location"], count: 2, style: "coherent" },
    seededRng(1),
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
  const players = [
    ...session.players,
    ...[2, 3].map((seatIndex) => ({
      id: randomUUID(),
      displayName: `Player ${seatIndex + 1}`,
      seatIndex,
      isSittingOut: false,
    })),
  ];
  const next = prepareRound(
    {
      ...session,
      players,
      settings: { ...session.settings, playerCount: 4 },
    },
    activityById("S1"),
    randomUUID,
    session.createdAt,
  );
  expect(next.performerIds).toEqual(players.map((player) => player.id));
  expect(Object.keys(next.promptSnapshot.entries)).toEqual(["location"]);
});

test("ordinary Open Scene still casts a pair rather than changing its normal game format", () => {
  const session = makeSession(
    4,
    "scene_lab",
    UserPreferencesSchema.parse({}),
    randomUUID,
    12,
    [],
    "S1",
  );
  expect(currentRound(session).performerIds).toHaveLength(2);
  const next = prepareRound(
    session,
    activityById("S1"),
    randomUUID,
    session.createdAt,
  );
  expect(next.performerIds).toHaveLength(2);
});

test("a generic transitive action binds the selected Object instead of inventing its old prop", () => {
  const action = prompts.find(
    (entry) => entry.category === "action" && entry.text === "Repairing",
  )!;
  const object = prompts.find(
    (entry) => entry.category === "object" && entry.text === "A whistle",
  )!;
  const snapshot = generatePrompt(
    {
      categories: ["action", "object"],
      count: 2,
      style: "coherent",
      pool: [action, object],
      compositionEnabled: true,
    },
    seededRng(1),
  ).snapshot;
  const scene = composeScene(snapshot)!;
  expect(scene.text).toBe("Repairing a whistle.");
  expect(scene.includedCategories).toEqual(["action", "object"]);
  expect(scene.remainingCategories).toEqual([]);
  expect(Object.keys(snapshot.entries).sort()).toEqual(["action", "object"]);
});

test("Backstage remains an adverbial place rather than becoming a backstage", () => {
  const snapshot = {
    ...emptyPrompt(),
    entries: {
      location: { id: "custom_location", text: "Backstage", locked: false },
      situation: {
        id: "custom_situation",
        text: "Plans have changed.",
        locked: false,
      },
    },
  };
  expect(composeScene(snapshot)?.text).toBe(
    "Backstage, where plans have changed.",
  );
});
