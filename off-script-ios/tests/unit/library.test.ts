import { expect, test } from "vitest";
import { prompts, PACK } from "../../src/domain/content";
import { generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import { gamePromptOptions } from "../../src/domain/game-prompts";
import {
  libraryPrompts,
  librarySnapshot,
  promptRecipes,
  savedPromptLevel,
  studioSnapshotAllowed,
} from "../../src/domain/library";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import {
  makeSession,
  currentRound,
  transitionRound,
} from "../../src/domain/session";
import { randomUUID } from "node:crypto";

test("saved prompt levels retain their ratings while visibility follows Classroom and adult consent", () => {
  const clean = UserPreferencesSchema.parse({});
  const adult = librarySnapshot(["prompt_action_4527"], 2, "18_plus", {
    ...clean,
    matureOptIn: true,
  });
  const cheeky = librarySnapshot(["prompt_action_4500"], 2, "spicy", clean);
  expect(savedPromptLevel(adult)).toBe("18_plus");
  expect(savedPromptLevel(cheeky)).toBe("spicy");
  expect(studioSnapshotAllowed(adult, clean)).toBe(false);
  expect(studioSnapshotAllowed(adult, { ...clean, matureOptIn: true })).toBe(
    true,
  );
  expect(studioSnapshotAllowed(cheeky, clean)).toBe(true);
  expect(
    studioSnapshotAllowed(cheeky, { ...clean, classroomDefault: true }),
  ).toBe(false);
  expect(adult.entries.action.contentRating).toBe("mature_suggestive");
});

test("Cheeky action generation can deal the requested dark-comic action without extra ingredients", () => {
  const action = prompts.find(
    (entry) => entry.category === "action" && entry.text === "Scattering ashes",
  );
  expect(action).toBeDefined();
  expect(action?.contentRating).toBe("spicy");
  const result = generatePrompt(
    {
      categories: ["action"],
      count: 2,
      contentLevel: "spicy",
      style: "independent",
      pool: action ? [action] : [],
    },
    seededRng(1),
  ).snapshot;
  expect(Object.keys(result.entries)).toEqual(["action"]);
  expect(result.entries.action.text).toBe("Scattering ashes");
  expect(result.entries.action.sourcePackVersion).toBe(PACK);
  expect(result.relationship).toBeNull();
});

test("opening one library ingredient does not select a recipe or extra categories", () => {
  const snapshot = librarySnapshot(
    ["prompt_action_4500"],
    2,
    "spicy",
    UserPreferencesSchema.parse({}),
  );
  expect(Object.keys(snapshot.entries)).toEqual(["action"]);
  expect(snapshot.entries.action.text).toBe("Scattering ashes");
  expect(snapshot.composition).toBeUndefined();
  expect(snapshot.relationship).toBeNull();
});

test("library selection cannot bypass content settings, count compatibility or category boundaries", () => {
  const clean = UserPreferencesSchema.parse({});
  expect(() =>
    librarySnapshot(["prompt_action_4527"], 2, "18_plus", clean),
  ).toThrow(/hidden/);
  expect(() =>
    librarySnapshot(["prompt_action_4500"], 2, "spicy", {
      ...clean,
      classroomDefault: true,
    }),
  ).toThrow(/hidden/);
  expect(() =>
    librarySnapshot(["prompt_relationship_044"], 2, "clean", clean),
  ).toThrow(/roles/);
  expect(() =>
    librarySnapshot(
      ["prompt_action_4500", "prompt_action_4501"],
      2,
      "spicy",
      clean,
    ),
  ).toThrow(/one ingredient/);
  expect(() => librarySnapshot(["missing"], 2, "clean", clean)).toThrow(
    /no longer/,
  );
});

test("authored recipe snapshots contain exactly the visible referenced ingredients at every compatible cast size", () => {
  const preferences = UserPreferencesSchema.parse({ matureOptIn: true });
  expect(promptRecipes.length).toBeGreaterThanOrEqual(12);
  for (const recipe of promptRecipes)
    for (let count = recipe.minPlayers; count <= recipe.maxPlayers; count++) {
      const snapshot = librarySnapshot(
        recipe.ingredientIds,
        count,
        recipe.level,
        preferences,
        true,
      );
      expect(
        Object.values(snapshot.entries)
          .map((entry) => entry.id)
          .sort(),
      ).toEqual(recipe.ingredientIds.slice().sort());
      if (snapshot.relationship)
        expect(snapshot.relationship.assignments).toHaveLength(count);
      expect(recipe.ingredients.map((entry) => entry.text)).toEqual(
        recipe.ingredientIds.map(
          (id) => prompts.find((entry) => entry.id === id)!.text,
        ),
      );
    }
});

test("a Cheeky standalone action stays Cheeky through Act out and New Prompt instead of switching to Clean or adult", () => {
  const preferences = UserPreferencesSchema.parse({});
  const snapshot = librarySnapshot(
    ["prompt_action_4500"],
    2,
    "spicy",
    preferences,
  );
  const session = makeSession(
    2,
    "scene_lab",
    preferences,
    randomUUID,
    31,
    [],
    "S1",
    snapshot,
  );
  expect(session.settings.contentRating).toBe("spicy");
  const round = transitionRound(
    currentRound(session),
    { type: "REROLL_PROMPT" },
    {
      session,
      now: new Date().toISOString(),
      rng: seededRng(32),
      id: randomUUID,
    },
  );
  expect(Object.keys(round.promptSnapshot.entries)).toEqual(["action"]);
  expect(round.promptSnapshot.entries.action.contentRating).toBe("spicy");
});

test("library search is category-specific, cast-safe and returns actual selected-rating content", () => {
  const rows = libraryPrompts({
    category: "action",
    search: "ashes",
    level: "spicy",
    count: 2,
  });
  expect(rows.map((entry) => entry.text)).toEqual(["Scattering ashes"]);
  expect(
    libraryPrompts({
      category: "action",
      search: "ashes",
      level: "clean",
      count: 2,
    }),
  ).toEqual([]);
  expect(
    libraryPrompts({
      category: "relationship",
      level: "clean",
      count: 4,
    }).every((entry) => entry.minPlayers <= 4 && entry.maxPlayers >= 4),
  ).toBe(true);
});

test("Cheeky and adult versions have distinct authored action pools instead of silently reusing Clean", () => {
  const cheeky = prompts.filter(
    (entry) => entry.category === "action" && entry.contentRating === "spicy",
  );
  const adult = prompts.filter(
    (entry) =>
      entry.category === "action" &&
      entry.contentRating === "mature_suggestive",
  );
  expect(cheeky.length).toBeGreaterThanOrEqual(20);
  expect(adult.length).toBeGreaterThanOrEqual(10);
  for (const [level, expected] of [
    ["clean", "clean"],
    ["spicy", "spicy"],
    ["18_plus", "mature_suggestive"],
  ] as const) {
    const options = gamePromptOptions("G7", "riff", level);
    for (let seed = 0; seed < 30; seed++) {
      const snapshot = generatePrompt(
        { ...options, count: 2, style: "coherent", contentLevel: level },
        seededRng(seed),
      ).snapshot;
      expect(snapshot.entries.action.contentRating).toBe(expected);
    }
  }
});
