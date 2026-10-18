import {
  activities,
  advicePrompts,
  categories,
  categoryLabels,
  curatedScenes,
  goals,
  ingredientRating,
  PACK,
  prompts,
  quirks,
  relationships,
  sourcePrompts,
  sourceRelationships,
  topics,
  type Category,
} from "./content";
import type { UserPreferences } from "./contracts";
import { adviceRequests } from "./party-advice";
import { gamePromptOptions } from "./game-prompts";
import { partyRecipes } from "./party-recipes";
import type { PartyLevel } from "./party-contracts";
import { eligiblePromptPool } from "./prompts";
import { promptRecipes } from "./library";

export const libraryBanks = [
  { id: "ingredients", label: "Ingredients", historical: false },
  { id: "prompt_recipes", label: "Prompt recipes", historical: false },
  { id: "game_recipes", label: "Game recipes", historical: false },
  { id: "advice", label: "Advice problems", historical: false },
  { id: "topics", label: "Joke topics", historical: false },
  { id: "goals", label: "Secret goals", historical: false },
  { id: "quirks", label: "Guest quirks", historical: false },
  { id: "relationships", label: "Relationship templates", historical: false },
  { id: "games", label: "Games", historical: false },
  { id: "source_prompts", label: "Historical ingredients", historical: true },
  {
    id: "source_relationships",
    label: "Historical relationships",
    historical: true,
  },
  { id: "archives", label: "Archived originals", historical: true },
] as const;
export type LibraryBank = (typeof libraryBanks)[number]["id"];
export type LibraryLevelFilter = PartyLevel | "all";
export const librarySorts = [
  ["source", "Source order"],
  ["az", "A–Z"],
  ["za", "Z–A"],
  ["category", "By category"],
  ["rating", "By level"],
  ["id", "By ID"],
  ["most_inputs", "Most inputs"],
  ["fewest_inputs", "Fewest inputs"],
] as const;
export type LibrarySort = (typeof librarySorts)[number][0];
type Rating = "clean" | "spicy" | "mature_suggestive";
export function ratingLevel(rating: Rating): PartyLevel {
  return rating === "mature_suggestive" ? "18_plus" : rating;
}
export type LibraryRecord = {
  key: string;
  id: string;
  bank: LibraryBank;
  title: string;
  description?: string;
  category?: Category;
  rating: Rating | undefined;
  minPlayers: number;
  maxPlayers: number;
  data: object;
  ingredientIds?: string[];
  gameId?: string;
};
function record(
  bank: LibraryBank,
  id: string,
  title: string,
  rating: Rating | undefined,
  data: object,
  rest: Partial<
    Pick<
      LibraryRecord,
      | "category"
      | "description"
      | "minPlayers"
      | "maxPlayers"
      | "ingredientIds"
      | "gameId"
    >
  > = {},
): LibraryRecord {
  return {
    key: `${bank}:${id}`,
    bank,
    id,
    title,
    rating,
    data,
    minPlayers: 2,
    maxPlayers: 12,
    ...rest,
  };
}
export const libraryRecords: LibraryRecord[] = [
  ...prompts.map((entry) =>
    record(
      "ingredients",
      entry.id,
      entry.text,
      entry.contentRating,
      entry,
      entry,
    ),
  ),
  ...promptRecipes.map((entry) =>
    record(
      "prompt_recipes",
      entry.id,
      entry.title,
      entry.level === "18_plus" ? "mature_suggestive" : entry.level,
      entry,
      entry,
    ),
  ),
  ...partyRecipes.map((entry) => {
    const game = activities.find(
      (activity) => activity.id === entry.activityId,
    );
    if (!game) throw new Error(`Library recipe has no game: ${entry.id}`);
    return record(
      "game_recipes",
      entry.id,
      game.title,
      entry.level === "18_plus" ? "mature_suggestive" : entry.level,
      entry,
      {
        description: game.summary,
        minPlayers: Math.max(
          game.minPlayers,
          typeof entry.performers === "number" ? entry.performers : 2,
        ),
        maxPlayers: game.maxPlayers,
        gameId: game.id,
      },
    );
  }),
  ...advicePrompts.map((entry) =>
    record(
      "advice",
      entry.id,
      entry.text,
      entry.contentRating,
      { ...entry, ...adviceRequests[entry.id] },
      { ...entry, gameId: "P5" },
    ),
  ),
  ...topics.map((entry) =>
    record("topics", entry.id, entry.word, entry.contentRating, entry),
  ),
  ...goals.map((entry) =>
    record("goals", entry.id, entry.text, entry.rating, entry),
  ),
  ...quirks.map((entry) =>
    record("quirks", entry.id, entry.text, entry.rating, entry),
  ),
  ...relationships.map((entry) =>
    record(
      "relationships",
      entry.id,
      entry.premise,
      entry.contentRating,
      entry,
      { ...entry, category: "relationship" },
    ),
  ),
  ...activities.map((entry) =>
    record("games", entry.id, entry.title, entry.contentRating, entry, {
      ...entry,
      description: entry.summary,
      gameId: entry.id,
    }),
  ),
  ...sourcePrompts.map((entry) =>
    record(
      "source_prompts",
      entry.id,
      entry.text,
      entry.contentRating,
      entry,
      entry,
    ),
  ),
  ...sourceRelationships.map((entry) =>
    record(
      "source_relationships",
      entry.id,
      entry.premise,
      entry.contentRating,
      entry,
      { ...entry, category: "relationship" },
    ),
  ),
  ...curatedScenes.map((entry) =>
    record(
      "archives",
      entry.id,
      entry.originalText,
      ingredientRating({
        id: entry.source.id,
        text: entry.originalText,
        sourceVersion: entry.source.version,
        sourcePackVersion: entry.source.packVersion,
        locked: false,
      }),
      entry,
      {
        category: categories.find(
          (category) => category === entry.source.category,
        ),
      },
    ),
  ),
];
export const libraryInventory = libraryBanks.map((bank) => ({
  ...bank,
  count: libraryRecords.filter((entry) => entry.bank === bank.id).length,
}));
export const livePromptCount =
  prompts.length +
  advicePrompts.length +
  topics.length +
  goals.length +
  quirks.length;
export const libraryRecipeCount = promptRecipes.length + partyRecipes.length;
export const ingredientCategoryTotals = categories.map((category) => ({
  category,
  count: prompts.filter((entry) => entry.category === category).length,
}));
export function catalogAllowsRating(
  rating: Rating | undefined,
  preferences: Pick<UserPreferences, "classroomDefault" | "matureOptIn">,
) {
  if (preferences.classroomDefault) return rating === "clean";
  return (
    (rating !== "mature_suggestive" && rating !== undefined) ||
    preferences.matureOptIn
  );
}
const ranks = { clean: 0, spicy: 1, mature_suggestive: 2 };
export function queryLibrary({
  bank,
  search = "",
  category,
  count,
  level = "all",
  sort = "source",
  inputKeys,
  preferences,
}: {
  bank: LibraryBank | "all";
  search?: string;
  category?: Category;
  count?: number;
  level?: LibraryLevelFilter;
  sort?: LibrarySort;
  inputKeys?: string[];
  preferences: Pick<UserPreferences, "classroomDefault" | "matureOptIn">;
}) {
  const query = search.trim().toLocaleLowerCase();
  const result = libraryRecords.filter(
    (entry) =>
      (bank === "all" || entry.bank === bank) &&
      catalogAllowsRating(entry.rating, preferences) &&
      (level === "all" ||
        (entry.rating !== undefined && ratingLevel(entry.rating) === level)) &&
      (!category || entry.category === category) &&
      (count === undefined ||
        (entry.minPlayers <= count && entry.maxPlayers >= count)) &&
      (!inputKeys || inputKeys.includes(entry.key)) &&
      (!query ||
        `${entry.id} ${entry.title} ${entry.description ?? ""} ${JSON.stringify(entry.data)}`
          .toLocaleLowerCase()
          .includes(query)),
  );
  const compare = (a: string, b: string) =>
    a.localeCompare(b, "en", { sensitivity: "base", numeric: true });
  const inputCounts =
    sort === "most_inputs" || sort === "fewest_inputs"
      ? new Map(result.map((entry) => [entry.key, libraryInputCount(entry)]))
      : undefined;
  if (sort !== "source")
    result.sort((a, b) => {
      if (inputCounts)
        return (
          ((inputCounts.get(a.key) ?? 0) - (inputCounts.get(b.key) ?? 0)) *
            (sort === "most_inputs" ? -1 : 1) || compare(a.title, b.title)
        );
      if (sort === "id") return compare(a.id, b.id) || compare(a.key, b.key);
      if (sort === "category")
        return (
          compare(
            a.category ? categoryLabels[a.category] : a.bank,
            b.category ? categoryLabels[b.category] : b.bank,
          ) || compare(a.title, b.title)
        );
      if (sort === "rating")
        return (
          (a.rating ? ranks[a.rating] : 3) - (b.rating ? ranks[b.rating] : 3) ||
          compare(a.title, b.title)
        );
      return (
        compare(a.title, b.title) * (sort === "za" ? -1 : 1) ||
        compare(a.key, b.key)
      );
    });
  return result;
}
export function libraryInputCount(entry: LibraryRecord) {
  if (entry.bank === "game_recipes") {
    const input = recipeInputGroups(entry.id);
    return new Set(
      input.groups.flatMap((group) =>
        group.ids.map((id) => `${group.bank}:${id}`),
      ),
    ).size;
  }
  if (entry.bank === "prompt_recipes") return entry.ingredientIds?.length ?? 0;
  return ["ingredients", "advice", "topics", "goals", "quirks"].includes(
    entry.bank,
  )
    ? 1
    : 0;
}
export function recipeInputGroups(recipeId: string) {
  const recipe = partyRecipes.find((entry) => entry.id === recipeId);
  if (!recipe) throw new Error("This game recipe is not in the catalog.");
  const game = activities.find((entry) => entry.id === recipe.activityId);
  if (!game) throw new Error("This recipe's game is not in the catalog.");
  const groupCount = Math.max(
    game.minPlayers,
    typeof recipe.performers === "number" ? recipe.performers : 2,
  );
  const actors =
    game.id === "G2"
      ? Math.min(4, groupCount - 1)
      : recipe.performers === "everyone"
        ? groupCount
        : recipe.performers;
  const options = gamePromptOptions(game.id, "riff", recipe.level);
  const groups: { bank: LibraryBank; label: string; ids: string[] }[] = [];
  for (const category of recipe.categories) {
    const entries = eligiblePromptPool(
      options.pool,
      category,
      Math.max(2, actors),
      recipe.level,
    );
    groups.push({
      bank: game.id === "P5" ? "advice" : "ingredients",
      label: categoryLabels[category],
      ids: entries.map((entry) => entry.id),
    });
  }
  if (["P1", "P2", "P3"].includes(game.id))
    groups.push({
      bank: "topics",
      label: "Joke topics",
      ids: topics
        .filter((entry) => entry.contentRating === "clean")
        .map((entry) => entry.id),
    });
  if (game.requiresPrivateReveal)
    groups.push({
      bank: game.id === "T3" ? "quirks" : "goals",
      label: game.id === "T3" ? "Guest quirks" : "Secret goals",
      ids: (game.id === "T3" ? quirks : goals).map((entry) => entry.id),
    });
  return {
    groupCount,
    actors,
    groups,
    recipeVersion: recipe.version,
    pack: PACK,
  };
}
