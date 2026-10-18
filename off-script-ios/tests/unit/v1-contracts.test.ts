import { expect, test } from "vitest";
import {
  PromptSnapshotSchema,
  StudioStateSchema,
  UserPreferencesSchema,
} from "../../src/domain/contracts";
import { emptyPrompt } from "../../src/domain/prompts";
import { initialData } from "../../src/storage/model";

test("an ingredients-only saved snapshot retains its explicit display choice", () => {
  const snapshot = PromptSnapshotSchema.parse({
    ...emptyPrompt(),
    compositionEnabled: false,
  });

  expect(snapshot).toMatchObject({ compositionEnabled: false });
});

test("remembered party preferences exclude group-specific adult consent", () => {
  const preferences = UserPreferencesSchema.parse({
    lastPartyOptions: {
      rotation: "shuffle",
      movement: true,
      includeScenes: false,
      pacing: "quick",
      automaticCues: false,
      sound: true,
      teams: true,
      level: "18_plus",
      adultsConfirmedAt: "2026-10-17T20:00:00.000Z",
    },
  });
  expect(preferences).toMatchObject({
    lastPartyOptions: {
      rotation: "shuffle",
      movement: true,
      sound: true,
      teams: true,
    },
  });
  expect(preferences.lastPartyOptions).not.toHaveProperty("level");
  expect(preferences.lastPartyOptions).not.toHaveProperty("adultsConfirmedAt");
});

test("fresh Studio uses ingredients-only output without rewriting legacy choices", () => {
  expect(initialData().studio).toMatchObject({ composeResult: false });
  const legacy = StudioStateSchema.parse({
    flavor: "grounded",
    playerCount: 2,
    categories: ["relationship", "location"],
    generationStyle: "coherent",
    result: emptyPrompt(),
  });
  expect(legacy).not.toHaveProperty("composeResult");
  expect(legacy.result).not.toHaveProperty("compositionEnabled");
});
