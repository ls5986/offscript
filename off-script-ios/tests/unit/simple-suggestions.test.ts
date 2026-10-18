import { expect, test } from "vitest";
import previousReview from "../../content/editorial/ingredient-purity-2.3.0.json";
import currentReview from "../../content/editorial/ingredient-purity-2.7.0.json";
import {
  curatedScenes,
  PACK,
  prompts,
  resolveIngredientId,
} from "../../src/domain/content";
import {
  legacyIngredientCategories,
  upgradeSnapshotIngredients,
} from "../../src/domain/composer";
import {
  emptyPrompt,
  generatePrompt,
  promptText,
} from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import { initialData } from "../../src/storage/model";
import type { PromptSnapshot } from "../../src/domain/contracts";

const oldRepairShop = (): PromptSnapshot => ({
  ...emptyPrompt(),
  contentPackVersion: "2.3.0",
  entries: {
    location: {
      id: "prompt_location_027",
      text: "The repair counter of an umbrella shop",
      locked: false,
      sourceVersion: 1,
      sourcePackVersion: "2.3.0",
    },
  },
});

test("new Studio sessions start with one ordinary place, not a prewritten scene", () => {
  const studio = initialData().studio;
  expect(studio.categories).toEqual(["location"]);
  expect(studio.flavor).toBe("grounded");
});

test("all location suggestions are short place names without article or story padding", () => {
  const locations = prompts.filter((prompt) => prompt.category === "location");
  expect(
    locations.map(({ id, text, version }) => ({ id, text, version })),
  ).toEqual(
    currentReview.approvedValues
      .filter((entry) => entry.category === "location")
      .map(({ id, text, version }) => ({ id, text, version })),
  );
  for (const location of locations) {
    expect(
      location.text.trim().split(/\s+/).length,
      location.id,
    ).toBeLessThanOrEqual(3);
    expect(location.text.length, location.id).toBeLessThanOrEqual(24);
    expect(location.text, location.id).not.toMatch(/^(a|an|the)\s/i);
    expect(location.text, location.id).not.toMatch(
      /\b(where|everyone|while|because|before|after|must)\b/i,
    );
  }
  expect(
    new Set(locations.map((location) => location.text.toLowerCase())).size,
  ).toBe(locations.length);
});

test("the umbrella counter produces exactly Repair shop, including the copied text", () => {
  const location = prompts.find(
    (prompt) => prompt.id === "prompt_location_027",
  )!;
  const result = generatePrompt(
    {
      categories: ["location"],
      count: 2,
      flavor: "grounded",
      style: "coherent",
      pool: [location],
    },
    seededRng(1),
  ).snapshot;
  expect(result.entries.location.text).toBe("Repair shop");
  expect(Object.keys(result.entries)).toEqual(["location"]);
  expect(result.relationship).toBeNull();
  expect(result.jokeTopic).toBeNull();
  expect(result.composition).toBeUndefined();
  expect(promptText(result)).toBe("Repair shop");
  expect(result.entries.location.sourcePackVersion).toBe(PACK);
});

test("copying a lone place omits diagnostic ingredient labels", () => {
  const snapshot = oldRepairShop();
  snapshot.entries.location.text = "Repair shop";
  expect(promptText(snapshot)).toBe("Repair shop");
});

test("default generation never adds a relationship, situation or player assignments", () => {
  const studio = initialData().studio;
  for (let seed = 0; seed < 100; seed++) {
    const result = generatePrompt(
      {
        categories: studio.categories,
        count: studio.playerCount,
        style: studio.generationStyle,
        flavor: studio.flavor,
      },
      seededRng(seed),
    ).snapshot;
    expect(Object.keys(result.entries)).toEqual(["location"]);
    expect(result.relationship).toBeNull();
    expect(result.composition).toBeUndefined();
    expect(promptText(result)).toBe(result.entries.location.text);
  }
});

test("an explicit editable-copy upgrade simplifies the old location without modifying its source snapshot", () => {
  const old = oldRepairShop();
  const original = structuredClone(old);
  expect(legacyIngredientCategories(old)).toEqual(["location"]);
  const upgraded = upgradeSnapshotIngredients(old);
  expect(upgraded.entries.location).toMatchObject({
    id: "prompt_location_027",
    text: "Repair shop",
    sourceVersion: 2,
    sourcePackVersion: PACK,
  });
  expect(old).toEqual(original);
});

test("locked detailed originals remain exact until the owner unlocks and upgrades them", () => {
  const old = oldRepairShop();
  old.entries.location.locked = true;
  const original = structuredClone(old);
  expect(upgradeSnapshotIngredients(old)).toEqual(original);
  const generated = generatePrompt(
    {
      categories: ["location"],
      count: 2,
      style: "coherent",
      previous: old,
    },
    seededRng(1),
  ).snapshot;
  expect(generated.entries.location).toEqual(original.entries.location);
});

test("every previous location is preserved as a versioned original, not silently overwritten", () => {
  for (const previous of previousReview.approvedValues.filter(
    (entry) => entry.category === "location",
  )) {
    const current = prompts.find(
      (entry) => entry.id === resolveIngredientId(previous.id),
    )!;
    const approved = currentReview.approvedEntries.find(
      (entry) => entry.id === current.id,
    )!;
    expect(current.version, previous.id).toBe(approved.version);
    if (current.id === previous.id)
      expect(current.version, previous.id).toBeGreaterThan(previous.version);
    expect(
      curatedScenes.some(
        (example) =>
          example.source.id === previous.id &&
          example.source.version === previous.version &&
          example.source.packVersion === "2.3.0" &&
          example.originalText === previous.text,
      ),
      previous.id,
    ).toBe(true);
  }
});

test("additional ingredients still work when deliberately requested", () => {
  const result = generatePrompt(
    {
      categories: ["relationship", "location", "situation"],
      count: 2,
      style: "coherent",
    },
    seededRng(1),
  ).snapshot;
  expect(new Set(Object.keys(result.entries))).toEqual(
    new Set(["relationship", "location", "situation"]),
  );
  expect(result.relationship?.assignments).toHaveLength(2);
  expect(result.composition).toBeDefined();
});
