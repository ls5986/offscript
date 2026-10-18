/**
 * OFF SCRIPT v1 canonical domain contracts.
 * Copy this file to src/domain/contracts.ts in the generated Expo app.
 * All seed data, persistence adapters, UI views and game engines must pass these validators.
 * Runtime dependency: zod.
 */
import { z } from "zod";

export const ModeSchema = z.enum([
  "surprise",
  "party_night",
  "just_us",
  "game_show",
  "scene_lab",
  "improv_gym",
]);
export const CatalogModeSchema = z.enum([
  "party_night",
  "just_us",
  "game_show",
  "scene_lab",
  "improv_gym",
]);
export const FamilySchema = z.enum([
  "punchline",
  "performance",
  "scene",
  "drill",
  "social",
]);
export const EngineSchema = z.enum([
  "rapid_fire",
  "scene_open",
  "scene_cued",
  "story_turn",
  "movement",
  "role_reveal",
  "interview",
  "hot_seat",
  "scene_rotation",
  "short_challenge",
]);
export const PromptCategorySchema = z.enum([
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
]);
export const RatingSchema = z.enum(["clean", "spicy", "mature_suggestive"]);
export const EnergySchema = z.enum([
  "seated",
  "light_movement",
  "full_movement",
]);
export const CueTypeSchema = z.enum([
  "new_choice",
  "emotion_change",
  "genre_change",
  "surprise_line",
  "rotation",
  "status_shift",
  "countdown",
  "stop",
]);
export const PlayPatternSchema = z.enum([
  "take_turns",
  "open_mic",
  "pair",
  "ensemble",
  "rotating",
  "volunteer",
]);

export const ActivitySchema = z
  .object({
    id: z.string().regex(/^[PGSWT][0-9]{1,2}$/),
    title: z.string().min(3),
    family: FamilySchema,
    modes: z.array(CatalogModeSchema).min(1),
    engine: EngineSchema,
    minPlayers: z.number().int().min(2).max(12),
    maxPlayers: z.number().int().min(2).max(12),
    minPerformers: z.number().int().min(1).max(12),
    maxPerformers: z.number().int().min(1).max(12),
    playPattern: PlayPatternSchema,
    defaultDurationSec: z.number().int().min(20).max(600),
    timerMode: z.enum(["countdown", "stopwatch", "optional"]),
    energy: EnergySchema,
    contentRating: RatingSchema,
    requiresPrivateReveal: z.boolean(),
    cueTypes: z.array(CueTypeSchema),
    promptCategories: z.array(PromptCategorySchema),
    focusSkills: z.array(z.string().min(2)).min(1),
    summary: z.string().min(20),
    howTo: z.string().min(50),
    example: z.string().min(20),
    coachTip: z.string().min(25),
    reflection: z.string().min(15),
    variants: z
      .array(
        z.enum(["standard", "take_turns", "open_mic", "battle", "teacher_led"]),
      )
      .min(1),
    voteEligible: z.boolean(),
    version: z.literal(1),
  })
  .superRefine((a, ctx) => {
    if (a.minPlayers > a.maxPlayers)
      ctx.addIssue({
        code: "custom",
        path: ["minPlayers"],
        message: "minPlayers exceeds maxPlayers",
      });
    if (a.minPerformers > a.maxPerformers || a.maxPerformers > a.maxPlayers)
      ctx.addIssue({
        code: "custom",
        path: ["maxPerformers"],
        message: "Invalid performer range",
      });
    if (a.minPerformers > a.minPlayers)
      ctx.addIssue({
        code: "custom",
        path: ["minPerformers"],
        message: "Not playable with stated minimum player count",
      });
    if (a.modes.includes("just_us") && a.minPlayers > 2)
      ctx.addIssue({
        code: "custom",
        path: ["modes"],
        message: "Just Us must support two players",
      });
  });
export type Activity = z.infer<typeof ActivitySchema>;

export const PromptEntrySchema = z
  .object({
    id: z.string().regex(/^prompt_[a-z_]+_[0-9]{3,4}$/),
    category: PromptCategorySchema,
    text: z.string().min(3).max(280),
    tags: z.array(z.string()).default([]),
    flavor: z.enum(["playful", "grounded"]).default("grounded"),
    relationshipTemplateId: z.string().optional(),
    domains: z.array(z.string()).default([]),
    compositionForm: z
      .enum(["place", "people", "gerund", "clause", "condition", "noun"])
      .optional(),
    contentRating: RatingSchema.default("clean"),
    minPlayers: z.number().int().min(2).max(12).default(2),
    maxPlayers: z.number().int().min(2).max(12).default(12),
    version: z.number().int().positive(),
  })
  .refine((p) => p.minPlayers <= p.maxPlayers, "Invalid player range");
export type PromptEntry = z.infer<typeof PromptEntrySchema>;

export const RelationshipTemplateSchema = z
  .object({
    id: z.string().min(3),
    premise: z.string().min(3),
    minPlayers: z.number().int().min(2).max(12),
    maxPlayers: z.number().int().min(2).max(12),
    // Fixed slot roles, assigned without duplication.
    namedRoles: z.array(z.string().min(4)).min(2),
    // Required if more participants than namedRoles can participate.
    expandableRole: z.string().min(4).nullable(),
    tags: z.array(z.string()),
    contentRating: RatingSchema,
    version: z.number().int().positive(),
  })
  .superRefine((r, ctx) => {
    if (r.maxPlayers < r.minPlayers)
      ctx.addIssue({
        code: "custom",
        message: "Invalid relationship player range",
      });
    if (r.namedRoles.length > r.minPlayers)
      ctx.addIssue({
        code: "custom",
        message: "More fixed roles than minimum scene participants",
      });
    if (r.maxPlayers > r.namedRoles.length && !r.expandableRole)
      ctx.addIssue({
        code: "custom",
        message: "Missing expandable role for ensemble",
      });
  });
export type RelationshipTemplate = z.infer<typeof RelationshipTemplateSchema>;

export const JokeTopicSchema = z.object({
  id: z.string().regex(/^topic_[0-9]{3,4}$/),
  word: z.string().min(2).max(45),
  plural: z.string().min(2).max(55).optional(), // Mandatory for P3-compatible words.
  tags: z.array(z.string()),
  contentRating: RatingSchema.default("clean"),
  version: z.literal(1),
});
export type JokeTopic = z.infer<typeof JokeTopicSchema>;

export const SessionSettingsSchema = z
  .object({
    mode: ModeSchema,
    playIntent: z.enum(["riff", "practice"]).default("riff"),
    playFlow: z.enum(["rounds", "free"]).default("rounds"),
    playerCount: z.number().int().min(2).max(12),
    vibe: z
      .enum(["surprise", "silly", "connection", "practice", "flirty"])
      .default("surprise"),
    experience: z.enum(["beginner", "mixed", "experienced"]).default("mixed"),
    energy: EnergySchema.default("seated"),
    excludeMovement: z.boolean().default(false),
    pacing: z.enum(["short", "balanced", "relaxed"]).default("balanced"),
    classroomClean: z.boolean().default(false),
    contentRating: RatingSchema.default("clean"),
    cuePreference: z
      .enum(["sound_and_visual", "visual_only", "manual"])
      .default("sound_and_visual"),
    coaching: z.enum(["concise", "detailed", "hidden"]).default("concise"),
    scoring: z.enum(["off", "individual", "teams"]).default("off"),
    preferredMinutes: z.number().int().min(0).max(180).nullable().default(null),
    autoHost: z.boolean().default(true),
    namesOptional: z.boolean().default(true),
    rngSeed: z.number().int().nonnegative(),
  })
  .superRefine((s, ctx) => {
    if (s.mode === "just_us" && s.playerCount !== 2)
      ctx.addIssue({
        code: "custom",
        path: ["playerCount"],
        message: "Just Us requires exactly two people",
      });
    if (s.classroomClean && s.contentRating !== "clean")
      ctx.addIssue({
        code: "custom",
        path: ["contentRating"],
        message: "Classroom mode must be clean",
      });
  });
export type SessionSettings = z.infer<typeof SessionSettingsSchema>;

export const PlayerSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1).max(40),
  isSittingOut: z.boolean().default(false),
  seatIndex: z.number().int().min(0).max(11),
});
export type Player = z.infer<typeof PlayerSchema>;

export const SceneCompositionSchema = z.object({
  version: z.literal(1),
  text: z.string(),
  includedCategories: z.array(PromptCategorySchema),
  remainingCategories: z.array(PromptCategorySchema),
  signature: z.string(),
  templateId: z.string(),
  contentPackVersion: z.string(),
});
export type SceneComposition = z.infer<typeof SceneCompositionSchema>;

export const PromptSnapshotSchema = z.object({
  compositionEnabled: z.boolean().optional(),
  composition: SceneCompositionSchema.optional(),
  flavor: z.enum(["playful", "grounded"]).default("grounded"),
  entries: z
    .record(
      z.string(),
      z.object({
        id: z.string(),
        text: z.string(),
        locked: z.boolean(),
        sourceVersion: z.number().int().positive().optional(),
        sourcePackVersion: z.string().optional(),
        contentRating: RatingSchema.optional(),
        openingHint: z.string().min(3).max(220).optional(),
      }),
    )
    .refine(
      (r) =>
        Object.keys(r).every((k) => PromptCategorySchema.safeParse(k).success),
      "Invalid category key",
    ),
  relationship: z
    .object({
      templateId: z.string(),
      premise: z.string(),
      assignments: z.array(
        z.object({ playerId: z.string(), roleText: z.string() }),
      ),
    })
    .nullable(),
  jokeTopic: z
    .object({
      id: z.string(),
      word: z.string(),
      contentRating: RatingSchema.optional(),
    })
    .nullable(),
  generationStyle: z.enum(["independent", "coherent"]),
  contentPackVersion: z.string(),
});
export type PromptSnapshot = z.infer<typeof PromptSnapshotSchema>;

export const PromptNavigationSchema = z
  .object({
    context: z.string(),
    snapshots: z.array(PromptSnapshotSchema).min(1).max(30),
    index: z.number().int().nonnegative(),
  })
  .refine(
    (value) => value.index < value.snapshots.length,
    "Invalid prompt history position.",
  );
export type PromptNavigation = z.infer<typeof PromptNavigationSchema>;

export const RoundStatusSchema = z.enum([
  "intro",
  "private_reveal",
  "ready",
  "live",
  "paused",
  "review",
  "complete",
  "skipped",
]);
export const SessionStatusSchema = z.enum([
  "setup",
  "active",
  "paused",
  "finished",
]);

export const RoundStateSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  ordinal: z.number().int().nonnegative(),
  activityId: z.string().min(2),
  status: RoundStatusSchema,
  performerIds: z.array(z.string().uuid()),
  supportingPlayerIds: z.array(z.string().uuid()),
  promptSnapshot: PromptSnapshotSchema,
  promptNavigation: PromptNavigationSchema.optional(),
  // Timer persisted as remaining time on pause; wall-clock timestamps used only while active.
  remainingMs: z.number().int().nonnegative(),
  timerStartedAtEpochMs: z.number().nullable(),
  cueIndex: z.number().int().nonnegative(),
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
});
export type RoundState = z.infer<typeof RoundStateSchema>;

export const StudioStateSchema = z.object({
  contentLevel: z.enum(["clean", "spicy", "18_plus"]).optional(),
  promptNavigation: PromptNavigationSchema.optional(),
  composeResult: z.boolean().optional(),
  flavor: z.enum(["playful", "grounded"]).default("grounded"),
  playerCount: z.number().int().min(2).max(12),
  categories: z.array(PromptCategorySchema),
  generationStyle: z.enum(["independent", "coherent"]),
  result: PromptSnapshotSchema.nullable(),
});
export type StudioState = z.infer<typeof StudioStateSchema>;

export const TeamSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  displayName: z.string().min(1).max(40),
  playerIds: z.array(z.string().uuid()).min(1),
});
export type Team = z.infer<typeof TeamSchema>;

export const VoteSchema = z
  .object({
    id: z.string().uuid(),
    roundId: z.string().uuid(),
    voterPlayerId: z.string().uuid(),
    targetPlayerId: z.string().uuid().nullable(),
    targetTeamId: z.string().uuid().nullable(),
  })
  .refine(
    (v) =>
      Number(Boolean(v.targetPlayerId)) + Number(Boolean(v.targetTeamId)) === 1,
    "Vote must target exactly one player or team",
  );
export type Vote = z.infer<typeof VoteSchema>;

export const ScoreAwardSchema = z
  .object({
    id: z.string().uuid(),
    roundId: z.string().uuid(),
    targetPlayerId: z.string().uuid().nullable(),
    targetTeamId: z.string().uuid().nullable(),
    points: z.number().int().min(1).max(10),
    reason: z.string().max(80),
  })
  .refine(
    (v) =>
      Number(Boolean(v.targetPlayerId)) + Number(Boolean(v.targetTeamId)) === 1,
    "Points require exactly one target",
  );
export type ScoreAward = z.infer<typeof ScoreAwardSchema>;

export const PartyGameSelectionSchema = z
  .array(z.string().min(1))
  .refine(
    (ids) => new Set(ids).size === ids.length,
    "Choose each game only once.",
  )
  .nullable()
  .default(null);
export const PartyComfortSchema = z.object({
  rotation: z.enum(["stay", "shuffle"]).default("stay"),
  movement: z.boolean().default(false),
  includeScenes: z.boolean().default(true),
  pacing: z.enum(["quick", "balanced", "relaxed"]).default("balanced"),
  automaticCues: z.boolean().default(true),
  sound: z.boolean().default(false),
  teams: z.boolean().default(false),
});
export const UserPreferencesSchema = z.object({
  lastPartyOptions: PartyComfortSchema.optional(),
  selectedPartyActivityIds: PartyGameSelectionSchema,
  playIntent: z.enum(["riff", "practice"]).default("riff"),
  lastPlayerCount: z.number().int().min(2).max(12).default(2),
  lastPlayerNames: z.array(z.string().max(40)).max(12).default([]),
  lastPartyGroup: z
    .object({
      count: z.number().int().min(2).max(12),
      names: z.array(z.string().max(40)).max(12),
    })
    .nullable()
    .default(null),
  lastPlayFlow: z.enum(["rounds", "free"]).default("rounds"),
  soundEnabled: z.boolean().default(true),
  hapticsEnabled: z.boolean().default(true),
  reducedMotion: z.boolean().default(false),
  useLargeText: z.boolean().default(false),
  matureOptIn: z.boolean().default(false),
  matureConfirmedAt: z.string().datetime().nullable().default(null),
  classroomDefault: z.boolean().default(false),
  lastSessionSettings: SessionSettingsSchema.optional(),
});
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
