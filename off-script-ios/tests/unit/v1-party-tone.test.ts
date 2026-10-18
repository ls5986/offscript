import { expect, test } from "vitest";
import previousReview from "../../content/editorial/ingredient-purity-2.4.0.json";
import review from "../../content/editorial/ingredient-purity-2.5.0.json";
import {
  curatedScenes,
  PACK,
  prompts,
  resolveIngredientId,
  sourcePrompts,
} from "../../src/domain/content";
import currentReview from "../../content/editorial/ingredient-purity-2.7.0.json";
import { upgradeSnapshotIngredients } from "../../src/domain/composer";
import { gamePromptOptions } from "../../src/domain/game-prompts";
import { emptyPrompt, generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import type { PromptSnapshot } from "../../src/domain/contracts";

const revisions = [
  [
    "1808",
    "clean",
    "The elevator has started accepting feedback.",
    "You just closed the elevator on your boss.",
    "Someone has accidentally shut out a person whose approval matters.",
  ],
  [
    "1813",
    "clean",
    "The potluck now requires references.",
    "You brought a store-bought dish and called it homemade.",
    "Someone claimed credit for work they did not do.",
  ],
  [
    "2008",
    "clean",
    "The office has hired a consultant to choose a biscuit.",
    "You both claimed the same idea was yours.",
    "You both claimed the same idea was yours.",
  ],
  [
    "2020",
    "clean",
    "The office microwave has been given its own calendar.",
    "Your boss walks in while you are rehearsing an excuse.",
    "An excuse has been overheard by the person it was meant to deceive.",
  ],
  [
    "1904",
    "spicy",
    "Someone has brought a PowerPoint to a first date.",
    "Your date has already planned your next holiday.",
    "Someone has made plans far beyond what was agreed.",
  ],
  [
    "1916",
    "spicy",
    "The lingerie shop has introduced a loyalty tribunal.",
    "You run into your ex while buying an anniversary gift.",
    "Someone from the past appears during preparations for a new beginning.",
  ],
  [
    "2032",
    "spicy",
    "The couple’s soft launch has a press embargo.",
    "One of you has told everyone you are a couple.",
    "A private assumption has been announced publicly as fact.",
  ],
  [
    "2049",
    "spicy",
    "A couple has brought separate slides to the relationship talk.",
    "You agreed to keep it casual. One of you made anniversary plans.",
    "One person is marking a milestone that nobody else agreed existed.",
  ],
] as const;

test.each(revisions)(
  "Party scene %s uses the approved human-stakes revision without rewriting a saved original",
  (number, rating, before, after, neutral) => {
    const id = `prompt_situation_${number}`;
    const canonicalId = resolveIngredientId(id);
    const current = prompts.find((entry) => entry.id === canonicalId)!;
    const historical = sourcePrompts.find((entry) => entry.id === id)!;
    const approved = currentReview.approvedEntries.find(
      (entry) => entry.id === canonicalId,
    )!;
    const generated = generatePrompt(
      {
        categories: ["situation"],
        count: 2,
        style: "coherent",
        contentLevel: rating,
        pool: [current],
      },
      seededRng(1),
    ).snapshot;
    expect(generated.entries.situation.text).toBe(neutral);
    expect(generated.entries.situation.sourceVersion).toBe(approved.version);
    expect(generated.entries.situation.sourcePackVersion).toBe(PACK);
    expect(current.contentRating).toBe("clean");
    expect(historical.text).toBe(after);
    expect(historical.contentRating).toBe(rating);
    expect(historical.tags).toEqual(["party_seed", rating, "social"]);
    expect(current.compositionForm).toBe("clause");
    expect(current.version).toBe(approved.version);
    expect(historical.version).toBe(2);
    expect(
      previousReview.approvedValues.find((entry) => entry.id === id),
    ).toMatchObject({
      text: before,
      version: 1,
    });
    expect(
      review.approvedValues.find((entry) => entry.id === id),
    ).toMatchObject({
      text: after,
      version: 2,
    });
    expect(review.sourceEntries.find((entry) => entry.id === id)).toMatchObject(
      {
        text: before,
        version: 1,
        contentRating: rating,
        tags: historical.tags,
      },
    );
    expect(
      curatedScenes.find(
        (entry) =>
          entry.source.id === id &&
          entry.source.packVersion === "2.4.0" &&
          entry.originalText === before,
      ),
    ).toMatchObject({
      source: { id, version: 1, packVersion: "2.4.0" },
      ingredients: [
        { id: canonicalId, category: "situation", version: approved.version },
      ],
    });
    for (const activityId of ["W1", "W4"])
      expect(
        gamePromptOptions(activityId, "riff", rating).pool.some(
          (entry) => entry.id === canonicalId,
        ),
      ).toBe(true);
    const original: PromptSnapshot = {
      ...emptyPrompt(),
      contentPackVersion: "2.4.0",
      entries: {
        situation: {
          id,
          text: before,
          locked: true,
          sourceVersion: 1,
          sourcePackVersion: "2.4.0",
          contentRating: rating,
        },
      },
    };
    const saved = structuredClone(original);
    expect(upgradeSnapshotIngredients(original)).toEqual(saved);
    expect(
      generatePrompt(
        {
          categories: ["situation"],
          count: 2,
          style: "coherent",
          previous: original,
          pool: [current],
          contentLevel: rating,
        },
        seededRng(1),
      ).snapshot.entries.situation,
    ).toEqual(saved.entries.situation);
    const unlocked = structuredClone(original);
    unlocked.entries.situation.locked = false;
    expect(
      upgradeSnapshotIngredients(unlocked).entries.situation,
    ).toMatchObject({
      id: canonicalId,
      text: neutral,
      sourceVersion: approved.version,
      sourcePackVersion: PACK,
    });
    expect(original).toEqual(saved);
  },
);

test("the unpublished 2.5 tone pass changes exactly four clean and four spicy existing scene seeds, never advice", () => {
  const sceneCorrections = review.corrections.filter((row) =>
    sourcePrompts
      .find((entry) => entry.id === row.id)
      ?.tags.includes("party_seed"),
  );
  expect(new Set(sceneCorrections.map((row) => row.id))).toEqual(
    new Set(revisions.map(([number]) => `prompt_situation_${number}`)),
  );
  for (const rating of ["clean", "spicy"])
    expect(
      sceneCorrections.filter(
        (row) =>
          sourcePrompts.find((entry) => entry.id === row.id)!.contentRating ===
          rating,
      ),
    ).toHaveLength(4);
  expect(
    sceneCorrections.every(
      (row) =>
        !sourcePrompts
          .find((entry) => entry.id === row.id)!
          .tags.includes("party_advice"),
    ),
  ).toBe(true);
});
