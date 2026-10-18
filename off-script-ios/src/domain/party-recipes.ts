import { z } from "zod";
import { activities, activityById } from "./content";
import { PromptCategorySchema } from "./contracts";
import { CardPatternSchema, PartyLevelSchema } from "./party-contracts";
export const PartyRecipeSchema = z.object({
  id: z.string(),
  activityId: z.string(),
  version: z.number().int().positive(),
  pattern: CardPatternSchema,
  level: PartyLevelSchema,
  categories: z.array(PromptCategorySchema),
  performers: z.union([z.number().int().min(1).max(12), z.literal("everyone")]),
  durationSec: z.number().int().min(0).max(120),
  weight: z.number().positive(),
  curatedSituation: z.boolean().default(false),
});
export type PartyRecipe = z.infer<typeof PartyRecipeSchema>;
type RecipeInput = z.input<typeof PartyRecipeSchema>;
const recipe = (
  activityId: string,
  pattern: PartyRecipe["pattern"],
  categories: PartyRecipe["categories"],
  performers: PartyRecipe["performers"],
  durationSec = 0,
  weight = 1,
): RecipeInput => ({
  id: `${activityId.toLowerCase()}_clean`,
  activityId,
  version: 1,
  pattern,
  categories,
  performers,
  durationSec,
  weight,
  level: "clean",
});
const clean: RecipeInput[] = [
  recipe("P1", "ALL_PLAY", [], "everyone", 0, 3),
  recipe("P3", "ALL_PLAY", [], "everyone", 0, 1),
  { ...recipe("P4", "ALL_PLAY", ["profession"], "everyone", 0, 3), version: 2 },
  {
    ...recipe("P5", "OPEN_MIC", ["situation"], "everyone", 0, 3),
    curatedSituation: true,
  },
  recipe("P6", "OPEN_MIC", ["location"], "everyone", 0, 2),
  recipe("G1", "TIMED_SCENE", ["relationship"], 2, 60),
  { ...recipe("G2", "CUED_SCENE", ["relationship"], 3, 60, 2), version: 2 },
  recipe("G3", "CUED_SCENE", ["relationship", "emotion"], 2, 60),
  recipe("G4", "CUED_SCENE", ["location", "genre"], 2, 60),
  recipe("G8", "PAIR", ["profession"], 2, 60),
  recipe("G11", "SMALL_GROUP", ["object"], 3, 60),
  recipe("S4", "PRIVATE_ROLE", ["relationship"], 2, 60, 0.6),
  recipe("S6", "PAIR", ["relationship"], 2, 0, 1.5),
  {
    ...recipe("W1", "TURN_BASED", ["situation"], "everyone", 0, 2),
    curatedSituation: true,
  },
  recipe("W2", "TURN_BASED", [], "everyone", 0, 2),
  recipe("W3", "TURN_BASED", ["opening_line"], "everyone", 0, 2),
  {
    ...recipe("W4", "TURN_BASED", ["situation"], "everyone", 0, 3),
    curatedSituation: true,
  },
  recipe("W6", "TURN_BASED", ["object"], "everyone", 0, 2),
  recipe("W8", "TURN_BASED", ["relationship"], "everyone"),
  recipe("T1", "PAIR", ["relationship"], 2, 60),
  recipe("T2", "SINGLE_PLAYER", ["profession"], 1),
  recipe("W5", "PAIR", [], 2, 0, 0.7),
];
const spicy: RecipeInput[] = ["P5", "W1", "W4", "G2", "T1"].map((id) => ({
  ...clean.find((r) => r.activityId === id)!,
  id: `${id.toLowerCase()}_spicy`,
  level: "spicy",
  categories:
    id === "G2" || id === "T1" ? ["relationship", "situation"] : ["situation"],
  curatedSituation: true,
  weight: 3,
}));
for (const id of ["P4", "P6", "G8", "T2", "W3"])
  spicy.push({
    ...clean.find((r) => r.activityId === id)!,
    id: `${id.toLowerCase()}_spicy`,
    level: "spicy",
    weight: 2,
  });
const adult: RecipeInput[] = [
  {
    ...recipe("P2", "ALL_PLAY", [], "everyone", 0, 4),
    id: "p2_adult",
    level: "18_plus",
  },
];
for (const variant of spicy)
  adult.push({
    ...variant,
    id: `${variant.activityId.toLowerCase()}_adult`,
    level: "18_plus",
    version: 1,
  });
export const partyRecipes = z
  .array(PartyRecipeSchema)
  .parse([...clean, ...spicy, ...adult]);
export const recipeById = (id: string) => partyRecipes.find((r) => r.id === id);
export function preferredPartyVariants(
  recipes: readonly PartyRecipe[],
  level: PartyRecipe["level"],
): PartyRecipe[] {
  const permitted =
    level === "clean"
      ? ["clean"]
      : level === "spicy"
        ? ["clean", "spicy"]
        : ["clean", "spicy", "18_plus"];
  const selected = new Map<string, PartyRecipe>();
  for (const candidate of recipes) {
    const rank = permitted.indexOf(candidate.level);
    if (rank < 0) continue;
    const previous = selected.get(candidate.activityId);
    if (!previous || rank > permitted.indexOf(previous.level))
      selected.set(candidate.activityId, candidate);
  }
  return [...selected.values()];
}
export const partyActivities = activities.filter((activity) =>
  partyRecipes.some((recipe) => recipe.activityId === activity.id),
);
export const defaultPartyActivityIds = ["P1", "P4", "P5", "P6"];
export const partyDefaultActivityIds = (
  level: "clean" | "spicy" | "18_plus",
) =>
  level === "18_plus"
    ? [...defaultPartyActivityIds, "P2"]
    : defaultPartyActivityIds;
const advanced = new Set([
  "G5",
  "G6",
  "G9",
  "G10",
  "S5",
  "S8",
  "S9",
  "T3",
  "T4",
  "T5",
]);
// Every activity has explicit experience metadata, even when absent from the casual deck.
export const activityExperiences = Object.fromEntries(
  activities.map((a) => [
    a.id,
    {
      casualParty: partyRecipes.some((r) => r.activityId === a.id),
      twoPerson: a.minPlayers <= 2,
      instructorPractice: a.contentRating === "clean",
      advancedPractice: advanced.has(a.id),
      movement: a.energy,
      contentLevels: partyRecipes
        .filter((r) => r.activityId === a.id)
        .map((r) => r.level),
      host: ["G2", "G5", "T3", "T4"].includes(a.id) ? "player" : "app",
    },
  ]),
);
for (const r of partyRecipes) {
  const a = activityById(r.activityId);
  if (r.categories.some((c) => !a.promptCategories.includes(c)))
    throw Error(`Recipe ${r.id} requests unsupported ingredients.`);
  if (a.contentRating !== "clean" && r.level !== "18_plus")
    throw Error(`Adult activity ${a.id} requires an adult recipe.`);
}
