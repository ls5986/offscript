import { z } from "zod";
import {
  PromptSnapshotSchema,
  StudioStateSchema,
  UserPreferencesSchema,
} from "../domain/contracts";
import { SessionSnapshotSchema } from "../domain/session";
export const SavedPromptSchema = z.object({
  id: z.string(),
  label: z.string(),
  createdAt: z.string().datetime(),
  snapshot: PromptSnapshotSchema,
  playerCount: z.number().int().min(2).max(12),
});
export const PresetSchema = z.object({
  id: z.string(),
  label: z.string(),
  state: StudioStateSchema,
});
export const AppDataSchema = z
  .object({
    version: z.literal(1),
    preferences: UserPreferencesSchema,
    hasPlayed: z.boolean(),
    sessions: z.array(SessionSnapshotSchema),
    favorites: z.array(z.string()),
    savedPrompts: z.array(SavedPromptSchema),
    promptHistory: z.array(SavedPromptSchema),
    presets: z.array(PresetSchema),
    studio: StudioStateSchema,
    feedback: z
      .array(
        z.object({
          id: z.string(),
          activityId: z.string(),
          roundId: z.string(),
          recipeId: z.string().optional(),
          targetType: z.enum(["activity", "prompt"]).optional(),
          snapshot: PromptSnapshotSchema.optional(),
          rating: z.enum(["fun", "easy", "too_hard", "not_for_us"]),
          issue: z.enum(["unclear", "weak_prompt", "bug"]).optional(),
          note: z.string().max(500).optional(),
          createdAt: z.string().datetime(),
        }),
      )
      .default([]),
    usage: z.record(z.string(), z.array(z.string())),
  })
  .superRefine((data, ctx) => {
    for (const field of [
      "sessions",
      "savedPrompts",
      "promptHistory",
      "presets",
      "feedback",
    ] as const) {
      const ids = new Set<string>();
      data[field].forEach((record, index) => {
        if (ids.has(record.id))
          ctx.addIssue({
            code: "custom",
            path: [field, index, "id"],
            message: `Duplicate saved ${field} ID.`,
          });
        ids.add(record.id);
      });
    }
  });
export type AppData = z.infer<typeof AppDataSchema>;
export const initialData = (): AppData => ({
  version: 1,
  preferences: UserPreferencesSchema.parse({}),
  hasPlayed: false,
  sessions: [],
  favorites: [],
  savedPrompts: [],
  promptHistory: [],
  presets: [],
  studio: {
    composeResult: false,
    flavor: "grounded",
    playerCount: 2,
    categories: ["location"],
    generationStyle: "coherent",
    result: null,
  },
  feedback: [],
  usage: {},
});
export interface OffScriptRepository {
  initialize(): Promise<void>;
  read(): Promise<AppData>;
  write(data: AppData): Promise<void>;
  resetAllLocalData(): Promise<void>;
}
