import { expect, test } from "vitest";
import {
  libraryInventory,
  libraryRecords,
  livePromptCount,
  libraryRecipeCount,
  queryLibrary,
  recipeInputGroups,
  libraryInputCount,
} from "../../src/domain/library-catalog";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import { eligiblePromptPool } from "../../src/domain/prompts";
import { gamePromptOptions } from "../../src/domain/game-prompts";
import { partyRecipes } from "../../src/domain/party-recipes";

const preferences = UserPreferencesSchema.parse({ matureOptIn: true });
test("the full catalog indexes every real runtime bank and distinguishes live inputs from archived copies", () => {
  expect(
    Object.fromEntries(libraryInventory.map((bank) => [bank.id, bank.count])),
  ).toEqual({
    ingredients: 1214,
    prompt_recipes: 14,
    game_recipes: 43,
    advice: 60,
    topics: 160,
    goals: 60,
    quirks: 40,
    relationships: 60,
    games: 39,
    source_prompts: 1326,
    source_relationships: 96,
    archives: 1347,
  });
  expect(livePromptCount).toBe(1534);
  expect(libraryRecipeCount).toBe(57);
  expect(libraryRecords).toHaveLength(4459);
  expect(new Set(libraryRecords.map((entry) => entry.key)).size).toBe(4459);
  expect(libraryRecords.every((entry) => entry.rating !== undefined)).toBe(
    true,
  );
});
test("all roles/all levels reveal the entire current ingredient bank when adult consent permits", () => {
  expect(queryLibrary({ bank: "ingredients", preferences })).toHaveLength(1214);
  expect(
    queryLibrary({
      bank: "ingredients",
      category: "relationship",
      preferences,
    }),
  ).toHaveLength(60);
  expect(
    queryLibrary({
      bank: "ingredients",
      category: "relationship",
      count: 2,
      preferences,
    }).length,
  ).toBeLessThan(60);
  expect(queryLibrary({ bank: "all", preferences })).toHaveLength(4459);
});
test("filters and full-bank sorts are stable and do not mutate the catalog", () => {
  const original = libraryRecords.map((entry) => entry.key);
  const az = queryLibrary({ bank: "ingredients", preferences, sort: "az" });
  const za = queryLibrary({ bank: "ingredients", preferences, sort: "za" });
  const titles = az.map((entry) => entry.title);
  expect(titles).toEqual(
    [...titles].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base", numeric: true }),
    ),
  );
  expect(za[0].title).toBe(az.at(-1)!.title);
  expect(
    queryLibrary({
      bank: "ingredients",
      preferences,
      search: "prompt_action_4500",
    }).map((entry) => entry.title),
  ).toEqual(["Scattering ashes"]);
  expect(libraryRecords.map((entry) => entry.key)).toEqual(original);
});
test("game recipes can be sorted by the number of actual eligible inputs, not arbitrary weights or combinations", () => {
  const rows = queryLibrary({
    bank: "game_recipes",
    preferences,
    sort: "most_inputs",
  });
  const counts = rows.map(libraryInputCount);
  expect(counts).toEqual([...counts].sort((a, b) => b - a));
  expect(counts[0]).toBe(402);
  expect(
    libraryInputCount(rows.find((entry) => entry.id === "p1_clean")!),
  ).toBe(160);
  const reversed = queryLibrary({
    bank: "game_recipes",
    preferences,
    sort: "fewest_inputs",
  }).map(libraryInputCount);
  expect(reversed).toEqual([...counts].sort((a, b) => a - b));
});
test("adult consent and classroom gates apply to every bank including raw historical metadata", () => {
  const classroom = queryLibrary({
    bank: "all",
    preferences: { ...preferences, classroomDefault: true },
  });
  const withoutAdult = queryLibrary({
    bank: "all",
    preferences: { ...preferences, matureOptIn: false },
  });
  expect(classroom.every((entry) => entry.rating === "clean")).toBe(true);
  expect(
    withoutAdult.every((entry) => entry.rating !== "mature_suggestive"),
  ).toBe(true);
  expect(
    queryLibrary({
      bank: "all",
      preferences: { ...preferences, classroomDefault: true },
      search: "Practicing dirty talk",
    }),
  ).toEqual([]);
  expect(
    queryLibrary({
      bank: "archives",
      preferences: { ...preferences, classroomDefault: true },
    }).length,
  ).toBeLessThan(1347);
});
test("recipe input counts use the exact same compatible highest-rating pool as generation", () => {
  for (const recipe of partyRecipes) {
    const inventory = recipeInputGroups(recipe.id);
    const options = gamePromptOptions(recipe.activityId, "riff", recipe.level);
    for (const group of inventory.groups.filter((group) =>
      ["ingredients", "advice"].includes(group.bank),
    )) {
      const category = recipe.categories.find((category) =>
        eligiblePromptPool(
          options.pool,
          category,
          Math.max(2, inventory.actors),
          recipe.level,
        ).some((entry) => entry.id === group.ids[0]),
      );
      expect(category, recipe.id).toBeDefined();
      if (!category) throw new Error(`Missing recipe category: ${recipe.id}`);
      expect(group.ids).toEqual(
        eligiblePromptPool(
          options.pool,
          category,
          Math.max(2, inventory.actors),
          recipe.level,
        ).map((entry) => entry.id),
      );
    }
  }
  expect(recipeInputGroups("p5_clean").groups[0].ids).toHaveLength(16);
  expect(recipeInputGroups("p1_clean").groups[0].ids).toHaveLength(160);
  expect(recipeInputGroups("g2_spicy").actors).toBe(2);
});
