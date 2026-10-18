import { z } from "zod";
import pack from "../content/v2/library-pack-2.8.json";
import { ingredientRating, prompts, type Category } from "./content";
import {
  type PromptEntry,
  type PromptSnapshot,
  type UserPreferences,
} from "./contracts";
import { generatePrompt, snapshotIsClean } from "./prompts";
import { seededRng } from "./random";
import type { PartyLevel } from "./party-contracts";

export const contentLevelLabels: Record<PartyLevel, string> = {
  clean: "Clean",
  spicy: "Cheeky",
  "18_plus": "18+",
};
const ratingRank = { clean: 0, spicy: 1, mature_suggestive: 2 };
const levelRank = { clean: 0, spicy: 1, "18_plus": 2 };
export function studioContentLevel(
  level: PartyLevel | undefined,
  preferences: Pick<UserPreferences, "classroomDefault" | "matureOptIn">,
): PartyLevel {
  if (preferences.classroomDefault) return "clean";
  if (level === "18_plus" && !preferences.matureOptIn) return "clean";
  return level ?? "clean";
}
export function savedPromptLevel(snapshot: PromptSnapshot): PartyLevel {
  const ratings = Object.values(snapshot.entries).map(ingredientRating);
  return ratings.includes("mature_suggestive")
    ? "18_plus"
    : ratings.includes("spicy")
      ? "spicy"
      : "clean";
}
export function studioSnapshotAllowed(
  snapshot: PromptSnapshot,
  preferences: Pick<UserPreferences, "classroomDefault" | "matureOptIn">,
) {
  return (
    (!preferences.classroomDefault || snapshotIsClean(snapshot)) &&
    (preferences.matureOptIn || savedPromptLevel(snapshot) !== "18_plus")
  );
}

const RecipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  ingredientIds: z.array(z.string()).min(2),
});
export const promptRecipes = RecipeSchema.array()
  .parse(pack.recipes)
  .map((recipe) => {
    const ingredients = recipe.ingredientIds.map((id) => {
      const entry = prompts.find((prompt) => prompt.id === id);
      if (!entry)
        throw new Error(
          `Recipe ${recipe.id} references an unknown ingredient: ${id}`,
        );
      return entry;
    });
    if (
      new Set(ingredients.map((entry) => entry.category)).size !==
      ingredients.length
    )
      throw new Error(`Recipe ${recipe.id} repeats an ingredient category.`);
    const minPlayers = Math.max(
      ...ingredients.map((entry) => entry.minPlayers),
    );
    const maxPlayers = Math.min(
      ...ingredients.map((entry) => entry.maxPlayers),
    );
    if (minPlayers > maxPlayers)
      throw new Error(`Recipe ${recipe.id} has incompatible roles.`);
    const rank = Math.max(
      ...ingredients.map((entry) => ratingRank[entry.contentRating]),
    );
    const level: PartyLevel =
      rank === 2 ? "18_plus" : rank === 1 ? "spicy" : "clean";
    return { ...recipe, ingredients, minPlayers, maxPlayers, level };
  });
export type PromptRecipe = (typeof promptRecipes)[number];

export function libraryPrompts({
  category,
  search = "",
  level,
  count,
}: {
  category?: Category;
  search?: string;
  level: PartyLevel;
  count: number;
}) {
  const query = search.trim().toLocaleLowerCase();
  return prompts.filter(
    (entry) =>
      (!category || entry.category === category) &&
      entry.minPlayers <= count &&
      entry.maxPlayers >= count &&
      ratingRank[entry.contentRating] === levelRank[level] &&
      entry.text.toLocaleLowerCase().includes(query),
  );
}

export function librarySnapshot(
  ingredientIds: string[],
  count: number,
  level: PartyLevel,
  preferences: Pick<UserPreferences, "classroomDefault" | "matureOptIn">,
  compose = false,
) {
  if (!ingredientIds.length)
    throw new Error("Choose at least one library ingredient.");
  const permittedLevel = studioContentLevel(level, preferences);
  const entries: PromptEntry[] = ingredientIds.map((id) => {
    const entry = prompts.find((candidate) => candidate.id === id);
    if (!entry) throw new Error("This ingredient is no longer in the library.");
    if (entry.minPlayers > count || entry.maxPlayers < count)
      throw new Error("This recipe does not fit the selected number of roles.");
    if (ratingRank[entry.contentRating] > levelRank[permittedLevel])
      throw new Error("This prompt is hidden by your content settings.");
    return entry;
  });
  if (new Set(entries.map((entry) => entry.category)).size !== entries.length)
    throw new Error("Choose only one ingredient from each category.");
  return generatePrompt(
    {
      categories: entries.map((entry) => entry.category),
      count,
      style: "independent",
      flavor: "playful",
      contentLevel: permittedLevel,
      pool: entries,
      compositionEnabled: compose,
    },
    seededRng(1),
  ).snapshot;
}
