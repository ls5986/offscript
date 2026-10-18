import { z } from "zod";
import catalog from "../content/v1/activities.json";
import firstBank from "../content/v1/prompts.json";
import firstPlayfulBank from "../content/v1/playful-prompts.json";
import secretGoals from "../content/v1/goals.json";
import bank from "../content/v2/ingredients.json";
import partyIngredients from "../content/v2/party-ingredients.json";
import partyExpansion from "../content/v2/party-expansion-2.6.json";
import rels from "../content/v2/relationships.json";
import curated from "../content/v2/curated-scenes.json";
import historicalAliases from "../content/v2/ingredient-aliases.json";
import atomicBank from "../content/v2/atomic-ingredients-2.7.json";
import atomicRelationships from "../content/v2/atomic-relationships-2.7.json";
import atomicAliases from "../content/v2/atomic-aliases-2.7.json";
import atomicArchive from "../content/v2/atomic-archive-2.7.json";
import libraryPack from "../content/v2/library-pack-2.8.json";
import guestQuirks from "../content/v1/quirks.json";
import words from "../content/v1/topics.json";
import {
  ActivitySchema,
  CueTypeSchema,
  JokeTopicSchema,
  PromptEntrySchema,
  type PromptSnapshot,
  RatingSchema,
  RelationshipTemplateSchema,
} from "./contracts";
export const SecretGoalSchema = z.object({
  id: z.string(),
  text: z.string().min(10),
  tags: z.array(z.string()),
  rating: RatingSchema,
  version: z.literal(1),
});
export const GuestQuirkSchema = SecretGoalSchema;
export const TimedCueSchema = z.object({
  id: z.string(),
  type: CueTypeSchema,
  text: z.string(),
  atElapsedMs: z.number().nonnegative(),
  displayDurationMs: z.number().positive(),
  spokenText: z.string().optional(),
});
export type TimedCue = z.infer<typeof TimedCueSchema>;
export const activities = z.array(ActivitySchema).parse(catalog);
export const sourcePrompts = z
  .array(PromptEntrySchema)
  .parse([...bank, ...partyIngredients, ...partyExpansion]);
const initialRatings = z
  .array(
    z.object({
      id: z.string(),
      text: z.string(),
      contentRating: RatingSchema,
    }),
  )
  .parse([...firstBank, ...firstPlayfulBank]);
export const advicePrompts = sourcePrompts.filter((entry) =>
  entry.tags.includes("party_advice"),
);
export const sourceRelationships = z
  .array(RelationshipTemplateSchema)
  .parse(rels);
export const libraryExpansionPrompts = z.array(PromptEntrySchema).parse(
  libraryPack.groups.flatMap((group) =>
    group.entries.map((entry) => ({
      ...entry,
      category: group.category,
      contentRating: group.contentRating,
      compositionForm: group.compositionForm,
      flavor: "playful",
      tags: ["atomic", "comic_28"],
      domains: [],
      minPlayers: 2,
      maxPlayers: 12,
      version: 1,
    })),
  ),
);
export const prompts = z
  .array(PromptEntrySchema)
  .parse([...atomicBank, ...libraryExpansionPrompts]);
export const relationships = z
  .array(RelationshipTemplateSchema)
  .parse(atomicRelationships);
const historicalIngredientAliases: Readonly<Record<string, string>> =
  historicalAliases;
export const ingredientAliases: Record<string, string> = {
  ...historicalIngredientAliases,
  ...atomicAliases,
};
export function resolveIngredientId(id: string): string {
  const seen = new Set<string>();
  let current = id;
  while (ingredientAliases[current] && ingredientAliases[current] !== current) {
    if (seen.has(current)) throw Error(`Ingredient alias cycle: ${id}`);
    seen.add(current);
    current = ingredientAliases[current];
  }
  return current;
}
export const topics = z.array(JokeTopicSchema).parse(words);
export const goals = z.array(SecretGoalSchema).parse(secretGoals);
export const quirks = z.array(GuestQuirkSchema).parse(guestQuirks);
export const activityById = (id: string) => {
  const a = activities.find((x) => x.id === id);
  if (!a) throw Error("This game is not in the current content pack.");
  return a;
};
export const PACK = libraryPack.version;
export const categories = [
  "relationship",
  "location",
  "profession",
  "role",
  "emotion",
  "action",
  "situation",
  "object",
  "genre",
  "opening_line",
] as const;
export type Category = (typeof categories)[number];
export const categoryLabels: Record<Category, string> = {
  relationship: "Relationship",
  location: "Location",
  profession: "Profession",
  role: "Character role",
  emotion: "Emotion",
  action: "Action",
  situation: "Situation",
  object: "Object",
  genre: "Genre",
  opening_line: "Opening line",
};
export const modes = [
  {
    id: "party_night",
    label: "Party Night",
    sub: "Games from the mixed Party Night deck: quick jokes and short scenes.",
    icon: "party",
  },
  {
    id: "just_us",
    label: "Two-player games",
    sub: "Games that work with just two people. No audience needed.",
    icon: "people",
  },
  {
    id: "game_show",
    label: "Jokes & challenges",
    sub: "Quick responses, playful challenges and imaginary game-show moments.",
    icon: "mic",
  },
  {
    id: "scene_lab",
    label: "Act out scenes",
    sub: "Make up scenes with invented characters, places and situations.",
    icon: "theater",
  },
  {
    id: "improv_gym",
    label: "Practice exercises",
    sub: "Try a specific skill, such as listening, storytelling or working with a partner.",
    icon: "practice",
  },
] as const;

export const CuratedSceneSchema = z.object({
  id: z.string(),
  originalText: z.string(),
  source: z.object({
    id: z.string(),
    category: z.string(),
    version: z.number().int(),
    packVersion: z.string(),
  }),
  ingredients: z.array(
    z.object({
      category: z.string(),
      id: z.string(),
      version: z.number().int(),
    }),
  ),
  originalRoles: z.array(z.string()).optional(),
  originalExpandableRole: z.string().nullable().optional(),
});
export const curatedScenes = z.array(CuratedSceneSchema).parse(
  [...curated, ...atomicArchive].map((original) => ({
    ...original,
    ingredients: original.ingredients.map((reference) => {
      const current = prompts.find(
        (entry) => entry.id === resolveIngredientId(reference.id),
      );
      if (!current || current.category !== reference.category)
        throw Error(
          `An archived ingredient cannot be resolved: ${original.id}/${reference.id}`,
        );
      return { ...reference, id: current.id, version: current.version };
    }),
  })),
);

export function ingredientRating(entry: PromptSnapshot["entries"][string]) {
  if (entry.contentRating) return entry.contentRating;
  const current = prompts.find(
    (source) => source.id === resolveIngredientId(entry.id),
  );
  const historical = sourcePrompts.find(
    (source) =>
      source.id === (historicalIngredientAliases[entry.id] ?? entry.id),
  );
  const historicalMatch =
    historical &&
    (historical.text === entry.text ||
      curatedScenes.some(
        (original) =>
          original.source.id === entry.id &&
          original.originalText === entry.text,
      ));
  const canonicalProvenance =
    entry.sourcePackVersion === "2.7.0" || entry.sourcePackVersion === PACK;
  if (historicalMatch && !canonicalProvenance)
    return historical.contentRating;
  const initial = initialRatings.find(
    (source) => source.id === entry.id && source.text === entry.text,
  );
  if (initial && !canonicalProvenance) return initial.contentRating;
  if (current?.text === entry.text) return current.contentRating;
  if (historicalMatch) return historical.contentRating;
  return initial?.contentRating;
}
