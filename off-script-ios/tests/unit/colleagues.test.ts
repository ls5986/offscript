import { expect, test } from "vitest";
import {
  prompts,
  relationships,
  resolveIngredientId,
} from "../../src/domain/content";
import {
  generatePrompt,
  emptyPrompt,
  promptText,
} from "../../src/domain/prompts";
import { upgradeSnapshotIngredients } from "../../src/domain/composer";
import { seededRng } from "../../src/domain/random";
import previousReview from "../../content/editorial/ingredient-purity-2.6.0.json";
import currentReview from "../../content/editorial/ingredient-purity-2.6.1.json";

test("the colleague relationship and every generated role leave the workplace to the location", () => {
  const source = prompts.find(
    (entry) => entry.id === resolveIngredientId("prompt_relationship_102"),
  )!;
  expect(source.text).toBe("Colleagues");
  expect(source.version).toBe(3);
  const template = relationships.find(
    (entry) => entry.id === source.relationshipTemplateId,
  )!;
  expect(template.premise).toBe("Colleagues");
  expect(template.expandableRole).toBe("Colleague");
  expect(template.version).toBe(3);
  const snapshot = generatePrompt(
    {
      categories: ["relationship"],
      count: 6,
      style: "coherent",
      pool: [source],
    },
    seededRng(1),
  ).snapshot;
  expect(snapshot.entries.relationship.text).toBe("Colleagues");
  expect(
    snapshot.relationship!.assignments.map((role) => role.roleText),
  ).toEqual([
    "Colleague 1",
    "Colleague 2",
    "Colleague 3",
    "Colleague 4",
    "Colleague 5",
    "Colleague 6",
  ]);
  expect(promptText(snapshot)).not.toContain("Office");
});

test("old office wording stays exact until explicitly upgraded, and locked originals are not changed", () => {
  const original = {
    ...emptyPrompt(),
    contentPackVersion: "2.6.0",
    entries: {
      relationship: {
        id: "prompt_relationship_102",
        text: "Office colleagues",
        locked: false,
        sourceVersion: 2,
        sourcePackVersion: "2.6.0",
      },
    },
    relationship: {
      templateId: "rel_102",
      premise: "Office colleagues",
      assignments: [1, 2, 3, 4].map((number) => ({
        playerId: `00000000-0000-4000-8000-00000000000${number}`,
        roleText: `Office colleague ${number}`,
      })),
    },
  };
  const upgraded = upgradeSnapshotIngredients(original);
  expect(upgraded.entries.relationship.text).toBe("Colleagues");
  expect(upgraded.relationship!.premise).toBe("Colleagues");
  expect(upgraded.relationship!.assignments[0].roleText).toBe("Colleague 1");
  expect(original.entries.relationship.text).toBe("Office colleagues");
  original.entries.relationship.locked = true;
  expect(upgradeSnapshotIngredients(original)).toEqual(original);
});

test("the wording correction changes only the colleague input and its matching roles", () => {
  expect(
    currentReview.approvedEntries
      .filter(
        (entry, index) =>
          JSON.stringify(entry) !==
          JSON.stringify(previousReview.approvedEntries[index]),
      )
      .map((entry) => entry.id),
  ).toEqual(["prompt_relationship_102"]);
  expect(
    currentReview.approvedRelationshipTemplates
      .filter(
        (entry, index) =>
          JSON.stringify(entry) !==
          JSON.stringify(previousReview.approvedRelationshipTemplates[index]),
      )
      .map((entry) => entry.id),
  ).toEqual(["rel_102"]);
});
