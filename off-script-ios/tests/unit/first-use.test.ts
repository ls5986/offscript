import { expect, test } from "vitest";
import { activityById } from "../../src/domain/content";
import { emptyPrompt } from "../../src/domain/prompts";
import { bookFor, instructionFor } from "../../src/domain/playbooks";

test("Action-only Open Scene invents characters without choosing a relationship or changing the prompt", () => {
  const snapshot = {
    ...emptyPrompt(),
    entries: {
      action: { id: "prompt_action_001", text: "Repairing", locked: false },
    },
  };
  const original = structuredClone(snapshot);
  expect(instructionFor(activityById("S1"), snapshot)).toBe(
    "Start with this action. Invent your own characters and give each other something to respond to.",
  );
  expect(snapshot).toEqual(original);
});

test("Open Scene with no selected relationship does not imply supplied people", () => {
  const snapshot = emptyPrompt();
  expect(instructionFor(activityById("S1"), snapshot)).toBe(
    "Invent your own characters. Make a small offer and give each other something to respond to.",
  );
});

test("relationship-led scenes and other activities keep their existing instructions", () => {
  const snapshot = {
    ...emptyPrompt(),
    relationship: {
      templateId: "rel_030",
      premise: "Two siblings",
      assignments: [
        { playerId: "Player 1", roleText: "First sibling" },
        { playerId: "Player 2", roleText: "Second sibling" },
      ],
    },
  };
  expect(instructionFor(activityById("S1"), snapshot)).toBe(
    bookFor(activityById("S1")).instruction,
  );
  expect(instructionFor(activityById("W1"), emptyPrompt())).toBe(
    bookFor(activityById("W1")).instruction,
  );
});
