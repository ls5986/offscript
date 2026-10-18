import { z } from "zod";
import {
  PartyComfortSchema,
  PartyGameSelectionSchema,
  PlayerSchema,
} from "./contracts";
export const PartyLevelSchema = z.enum(["clean", "spicy", "18_plus"]);
export type PartyLevel = z.infer<typeof PartyLevelSchema>;
export const CardPatternSchema = z.enum([
  "ALL_PLAY",
  "SINGLE_PLAYER",
  "PAIR",
  "SMALL_GROUP",
  "TURN_BASED",
  "OPEN_MIC",
  "TIMED_SCENE",
  "CUED_SCENE",
  "PRIVATE_ROLE",
]);
export type CardPattern = z.infer<typeof CardPatternSchema>;
export const PartyOptionsSchema = PartyComfortSchema.extend({
  selectedActivityIds: PartyGameSelectionSchema,
  level: PartyLevelSchema.default("clean"),
  adultsConfirmedAt: z.string().datetime().nullable().default(null),
});
export type PartyOptions = z.infer<typeof PartyOptionsSchema>;
export const PartyCardSchema = z.object({
  roundId: z.string().uuid(),
  recipeId: z.string(),
  recipeVersion: z.number().int().positive(),
  contentPackVersion: z.string(),
  pattern: CardPatternSchema,
  level: PartyLevelSchema,
  teamId: z.string().uuid().optional(),
  playerNames: z.record(z.string(), z.string()).optional(),
  disposition: z.enum(["current", "played", "skipped"]),
});
export const PartyStateSchema = z.object({
  version: z.literal(1),
  options: PartyOptionsSchema,
  cards: z.array(PartyCardSchema).min(1),
  cursor: z.number().int().nonnegative(),
  archivedPlayers: z.array(PlayerSchema).default([]),
  turnPlayerId: z.string().uuid().optional(),
  // One-card passes; separate from durable sit-outs and creative content.
  passedPlayerIds: z.array(z.string().uuid()).default([]),
});
export type PartyState = z.infer<typeof PartyStateSchema>;
