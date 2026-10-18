import { expect, test } from "vitest";
import previousReview from "../../content/editorial/ingredient-purity-2.3.0.json";
import locationReview from "../../content/editorial/ingredient-purity-2.4.0.json";
import review from "../../content/editorial/ingredient-purity-2.5.0.json";
import sourceReview from "../../content/editorial/ingredient-purity-2.6.1.json";
import currentReview from "../../content/editorial/ingredient-purity-2.7.0.json";
import aliases from "../../src/content/v2/ingredient-aliases.json";
import {
  categories,
  libraryExpansionPrompts,
  curatedScenes,
  PACK,
  prompts,
  relationships,
  resolveIngredientId,
  sourcePrompts,
  sourceRelationships,
} from "../../src/domain/content";
import {
  legacyIngredientCategories,
  upgradeSnapshotIngredients,
} from "../../src/domain/composer";
import { emptyPrompt, generatePrompt } from "../../src/domain/prompts";
import {
  RelationshipTemplateSchema,
  PromptEntrySchema,
  type PromptSnapshot,
} from "../../src/domain/contracts";
import { seededRng } from "../../src/domain/random";
const canonical = (id: string) => (aliases as Record<string, string>)[id] ?? id;
const corrections = [previousReview, locationReview, review].flatMap((pass) =>
  pass.corrections.map((row) => ({
    ...row,
    sourcePackVersion: pass.sourcePackVersion,
  })),
);
const snapshot = (
  id: string,
  text: string,
  category: string,
  version: number,
  locked = false,
  packVersion = previousReview.sourcePackVersion,
): PromptSnapshot => ({
  ...emptyPrompt(),
  contentPackVersion: packVersion,
  entries: {
    [category]: {
      id,
      text,
      locked,
      sourceVersion: version,
      sourcePackVersion: packVersion,
    },
  },
});
test("the entire generated ingredient library and all relationship templates have explicit editorial review coverage", () => {
  const reviewedPrompts = prompts.filter(
    (entry) =>
      !libraryExpansionPrompts.some((addition) => addition.id === entry.id),
  );
  expect(currentReview.reviewedIngredientIds).toEqual(
    reviewedPrompts.map((p) => p.id),
  );
  expect(previousReview.reviewedIngredientIds).toHaveLength(1075);
  expect(locationReview.reviewedIngredientIds).toHaveLength(1182);
  expect(review.reviewedIngredientIds).toHaveLength(1182);
  expect(sourceReview.reviewedIngredientIds).toHaveLength(1326);
  expect(sourcePrompts).toEqual(
    sourceReview.approvedEntries.map((p) => PromptEntrySchema.parse(p)),
  );
  expect(sourceRelationships).toEqual(
    sourceReview.approvedRelationshipTemplates.map((r) =>
      RelationshipTemplateSchema.parse(r),
    ),
  );
  expect(review.reviewedRelationshipTemplateIds).toHaveLength(96);
  expect(new Set(review.approvedValues.map((p) => p.category))).toEqual(
    new Set(categories),
  );
  expect(
    reviewedPrompts.map(({ id, category, text, version }) => ({
      id,
      category,
      text,
      version,
    })),
  ).toEqual(currentReview.approvedValues);
  expect(reviewedPrompts).toEqual(
    currentReview.approvedEntries.map((p) => PromptEntrySchema.parse(p)),
  );
  expect(relationships.map((r) => r.id)).toEqual(
    currentReview.reviewedRelationshipTemplateIds,
  );
  expect(relationships).toEqual(
    currentReview.approvedRelationshipTemplates.map((r) =>
      RelationshipTemplateSchema.parse(r),
    ),
  );
  const teammates = relationships.find(
    (r) => r.premise === "Former teammates",
  )!;
  expect(teammates.namedRoles).toEqual([
    "First former teammate",
    "Second former teammate",
  ]);
});
test("the historical bounded review preserves its IDs, ratings and task tags, versioning every changed entry once", () => {
  for (const before of review.sourceEntries) {
    const current = sourcePrompts.find((p) => p.id === before.id)!;
    expect(current.category).toBe(before.category);
    expect(current.contentRating).toBe(before.contentRating);
    expect(current.tags).toEqual(expect.arrayContaining(before.tags));
    expect(current.version).toBe(before.version + 1);
  }
  for (const pass of [previousReview, locationReview, review])
    for (const correction of pass.corrections) {
      const stage = pass.approvedValues.find(
        (p) => p.id === canonical(correction.id),
      )!;
      // Historical passes remain evidence of their own stage, not rewritten to today's wording.
      expect(stage.text.toLowerCase()).toBe(correction.after.toLowerCase());
      const latest = prompts.find(
        (p) => p.id === resolveIngredientId(stage.id),
      )!;
      if (latest.text.toLowerCase() !== stage.text.toLowerCase())
        expect(
          curatedScenes.some(
            (c) => c.source.id === stage.id && c.originalText === stage.text,
          ),
        ).toBe(true);
    }
});
test("every corrected ingredient generates alone without reintroducing its optional scene details", () => {
  for (const row of corrections) {
    const p = prompts.find((p) => p.id === resolveIngredientId(row.id))!;
    const approved = currentReview.approvedValues.find(
      (entry) => entry.id === resolveIngredientId(row.id),
    )!;
    expect(p.text).toBe(approved.text);
    if (row.after.toLowerCase() !== p.text.toLowerCase())
      expect(
        curatedScenes.some(
          (example) =>
            example.source.id === canonical(row.id) &&
            example.originalText.toLowerCase() === row.after.toLowerCase(),
        ),
      ).toBe(true);
    const s = generatePrompt(
      {
        categories: [p.category],
        count: 2,
        style: "coherent",
        flavor: p.flavor,
        contentLevel: "18_plus",
        pool: [p],
      },
      seededRng(1),
    ).snapshot;
    expect(Object.keys(s.entries)).toEqual([p.category]);
    expect(s.entries[p.category].text).toBe(p.text);
    expect(s.composition).toBeUndefined();
  }
});
test("all corrected historical values remain archived and upgrade only the selected category; locked originals remain exact", () => {
  for (const row of corrections) {
    const original = snapshot(
      row.id,
      row.before,
      row.category,
      row.sourceVersion,
      false,
      row.sourcePackVersion,
    );
    const saved = structuredClone(original);
    expect(
      curatedScenes.some(
        (c) => c.source.id === row.id && c.originalText === row.before,
      ),
    ).toBe(true);
    expect(legacyIngredientCategories(original)).toEqual([row.category]);
    const updated = upgradeSnapshotIngredients(original);
    expect(Object.keys(updated.entries)).toEqual([row.category]);
    expect(updated.entries[row.category].id).toBe(resolveIngredientId(row.id));
    expect(updated.entries[row.category].text.toLowerCase()).toBe(
      currentReview.approvedValues
        .find((entry) => entry.id === resolveIngredientId(row.id))!
        .text.toLowerCase(),
    );
    expect(updated.entries[row.category].sourcePackVersion).toBe(PACK);
    expect(original).toEqual(saved);
    const locked = {
      ...original,
      entries: {
        [row.category]: { ...original.entries[row.category], locked: true },
      },
    };
    expect(upgradeSnapshotIngredients(locked)).toEqual(locked);
  }
});
test("several historical values for the same ID are all recognized, with other locked ingredients unchanged", () => {
  const history = curatedScenes.filter(
    (c) => c.source.id === "prompt_action_076",
  );
  expect(new Set(history.map((c) => c.originalText)).size).toBeGreaterThan(1);
  for (const h of history) {
    const old = snapshot(
      h.source.id,
      h.originalText,
      "action",
      h.source.version,
    );
    old.entries.location = {
      id: "prompt_location_077",
      text: "A hotel lobby",
      locked: true,
      sourceVersion: 2,
      sourcePackVersion: "2.0.0",
    };
    const saved = structuredClone(old);
    const result = upgradeSnapshotIngredients(old);
    expect(result.entries.action.text).toBe("Wrapping a present");
    expect(result.entries.action.id).toBe(resolveIngredientId(h.source.id));
    expect(result.entries.location).toEqual(saved.entries.location);
    expect(Object.keys(result.entries).sort()).toEqual(["action", "location"]);
    expect(old).toEqual(saved);
  }
});
