import { expect, test } from "vitest";
import {
  emptyPrompt,
  generatePrompt,
  promptText,
} from "../../src/domain/prompts";
import { prompts, resolveIngredientId } from "../../src/domain/content";
import { seededRng } from "../../src/domain/random";
import { PromptSnapshotSchema } from "../../src/domain/contracts";

test("new story prompts no longer capture an opening hint", () => {
  const source = prompts.find(
    (entry) => entry.id === resolveIngredientId("prompt_situation_2023"),
  )!;
  const snapshot = generatePrompt(
    {
      categories: ["situation"],
      count: 2,
      style: "coherent",
      pool: [source],
    },
    seededRng(1),
  ).snapshot;
  expect(snapshot.entries.situation.text).toBe(
    "A representative has been appointed without consultation.",
  );
  expect(snapshot.entries.situation.openingHint).toBeUndefined();
});

test("old saved hints remain readable data without leaking into prompt text", () => {
  const opening =
    "I think we need to replace Diana; she keeps telling the group chat the wrong thing.";
  const snapshot = PromptSnapshotSchema.parse({
    ...emptyPrompt(),
    entries: {
      situation: {
        id: "prompt_situation_2023",
        text: "Someone has hired a spokesperson for the group chat.",
        locked: false,
        openingHint: opening,
      },
    },
    relationship: null,
    jokeTopic: null,
  });
  const restored = PromptSnapshotSchema.parse(
    JSON.parse(JSON.stringify(snapshot)),
  );
  expect(restored.entries.situation.openingHint).toBe(opening);
  expect(restored).toEqual(snapshot);
  expect(promptText(restored)).not.toContain(opening);
});
