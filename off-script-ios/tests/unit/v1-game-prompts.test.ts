import { expect, test } from "vitest";
import {
  activities,
  prompts,
  resolveIngredientId,
} from "../../src/domain/content";
import {
  emptyPrompt,
  generatePrompt,
  type Usage,
} from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import type { PromptSnapshot } from "../../src/domain/contracts";
import { gamePromptOptions } from "../../src/domain/game-prompts";

test("both intents use the game's defining minimal input rather than generic relationship shortcuts", () => {
  const options = gamePromptOptions;
  for (const intent of ["riff", "practice"] as const) {
    for (const [id, categories] of [
      ["P4", ["profession"]],
      ["P5", ["situation"]],
      ["W2", []],
      ["W3", ["opening_line"]],
      ["W6", ["object"]],
      ["S3", ["relationship", "action", "location"]],
      ["S7", ["action", "object"]],
      ["W7", ["action"]],
    ] as const) {
      expect(options(id, intent).categories, `${id} ${intent}`).toEqual(
        categories,
      );
    }
  }
});

test("task filtering retains the established riff/playful and practice/grounded intent labels", () => {
  const options = gamePromptOptions;
  expect(options("W4", "riff").flavor).toBe("playful");
  expect(options("W4", "practice").flavor).toBe("grounded");
});

test("World's Worst reaches familiar jobs from both flavor banks without deleting playful Studio jobs", () => {
  const options = gamePromptOptions("P4", "riff");
  expect(options.pool.some((p) => p.text === "Dentist")).toBe(true);
  expect(options.pool.some((p) => p.text === "Neighborhood baker")).toBe(true);
  expect(
    options.pool.some((p) => p.text === "Celebrity garden-gnome publicist"),
  ).toBe(false);
  expect(
    prompts.some((p) => p.text === "Celebrity garden-gnome publicist"),
  ).toBe(true);
  let previous: PromptSnapshot = emptyPrompt();
  let usage: Usage = {};
  const ids = new Set<string>();
  for (let i = 0; i < options.pool.length; i++) {
    const result = generatePrompt(
      { ...options, count: 2, style: "coherent", previous, usage },
      seededRng(i),
    );
    previous = result.snapshot;
    usage = result.usage;
    ids.add(previous.entries.profession.id);
  }
  expect(ids.size).toBe(options.pool.length);
});

test("World's Worst previous-only rerolls draw broadly from the deliberate familiar pool without cumulative usage", () => {
  const options = gamePromptOptions("P4", "riff");
  let previous: PromptSnapshot = emptyPrompt();
  const ids: string[] = [];
  for (let i = 0; i < 40; i++) {
    previous = generatePrompt(
      { ...options, count: 2, style: "coherent", previous },
      seededRng(42 + i * 104729),
    ).snapshot;
    ids.push(previous.entries.profession.id);
  }
  expect(new Set(ids).size).toBeGreaterThanOrEqual(15);
  expect(ids.every((id, index) => !index || id !== ids[index - 1])).toBe(true);
  expect(
    ids.some(
      (id) => prompts.find((entry) => entry.id === id)!.flavor === "grounded",
    ),
  ).toBe(true);
});

test.each(["G8", "T2"])(
  "%s uses expanded level-specific professions while clean stays clean",
  (activityId) => {
    for (const intent of ["riff", "practice"] as const)
      for (const level of ["clean", "spicy", "18_plus"] as const) {
        const options = gamePromptOptions(activityId, intent, level);
        const expectedRating =
          level === "18_plus" ? "mature_suggestive" : level;
        for (let seed = 0; seed < 8; seed++) {
          const snapshot = generatePrompt(
            { ...options, count: 2, style: "coherent", contentLevel: level },
            seededRng(seed),
          ).snapshot;
          expect(
            snapshot.entries.profession.contentRating,
            `${activityId}/${intent}/${level}/${seed}`,
          ).toBe(expectedRating);
        }
        const professions = options.pool.filter(
          (entry) => entry.category === "profession",
        );
        expect(professions.length).toBeGreaterThan(0);
        if (level === "clean")
          expect(
            professions.every((entry) => entry.contentRating === "clean"),
          ).toBe(true);
        else {
          expect(
            professions
              .filter((entry) => entry.contentRating === "spicy")
              .map((entry) => entry.text),
          ).toEqual([
            "romance audiobook narrator",
            "flirting workshop instructor",
            "Romance columnist",
            "Film-set intimacy coordinator",
            "Adult dating coach",
          ]);
          expect(
            professions
              .filter((entry) => entry.contentRating === "mature_suggestive")
              .map((entry) => entry.text),
          ).toEqual(
            level === "18_plus"
              ? [
                  "Sex therapist",
                  "Erotic novelist",
                  "Burlesque performer",
                  "Adult-store clerk",
                  "Adult-film director",
                ]
              : [],
          );
          expect(
            professions.some(
              (entry) =>
                entry.id === resolveIngredientId("prompt_profession_2078"),
            ),
          ).toBe(true);
        }
      }
  },
);

test("Terrible Advice always supplies a tagged request from the requested material level", () => {
  const options = gamePromptOptions;
  for (const intent of ["riff", "practice"] as const)
    for (const level of ["clean", "spicy", "18_plus"] as const) {
      const selected = options("P5", intent, level);
      expect(selected.pool).toHaveLength(
        level === "clean" ? 16 : level === "spicy" ? 28 : 16,
      );
      expect(
        selected.pool.every(
          (p) =>
            p.category === "situation" &&
            p.tags.includes("party_advice") &&
            p.contentRating ===
              (level === "clean"
                ? "clean"
                : level === "spicy"
                  ? "spicy"
                  : "mature_suggestive"),
        ),
      ).toBe(true);
      const snapshot = generatePrompt(
        {
          ...selected,
          contentLevel: level,
          count: 2,
          style: "coherent",
        },
        seededRng(1),
      ).snapshot;
      expect(snapshot.entries.situation.id).toBeDefined();
    }
});

test("Association uses simple existing objects and Character Walk uses actionable physical movement", () => {
  const options = gamePromptOptions;
  const objects = options("W6", "riff").pool;
  expect(objects.length).toBeGreaterThan(10);
  expect(
    objects.every(
      (p) => p.category === "object" && p.text.split(/\s+/).length <= 4,
    ),
  ).toBe(true);
  expect(objects.some((p) => p.text === "A suitcase")).toBe(true);
  expect(
    objects.some((p) => /sash|punctuality|emergency sunshine/i.test(p.text)),
  ).toBe(false);
  const movement = options("W7", "practice").pool;
  expect(movement.length).toBeGreaterThan(3);
  expect(
    movement.every(
      (p) => p.category === "action" && p.tags.includes("character_walk"),
    ),
  ).toBe(true);
});

test("Emotion Remote limits cues to reviewed beginner emotions while other games retain the richer bank", () => {
  const options = gamePromptOptions;
  const remote = options("G3", "riff");
  const emotions = remote.pool.filter((p) => p.category === "emotion");
  expect(emotions.length).toBeGreaterThanOrEqual(12);
  expect(
    emotions.every(
      (p) =>
        p.tags.includes("beginner_emotion") && p.text.split(/\s+/).length <= 2,
    ),
  ).toBe(true);
  expect(emotions.some((p) => p.text === "Excitement")).toBe(true);
  expect(
    emotions.some((p) => /careful|bittersweet|respectful/i.test(p.text)),
  ).toBe(false);
  expect(
    options("T2", "practice").pool.some(
      (p) => p.text === "Bittersweet happiness",
    ),
  ).toBe(true);
});

test("all 39 game policies generate only requested categories with count-compatible rated content", () => {
  const options = gamePromptOptions;
  for (const activity of activities)
    for (const intent of ["riff", "practice"] as const)
      for (const level of ["clean", "spicy", "18_plus"] as const) {
        const selected = options(activity.id, intent, level);
        for (const count of [2, 3, 8, 12]) {
          const result = generatePrompt(
            {
              ...selected,
              count,
              style: "coherent",
              contentLevel: level,
            },
            seededRng(1),
          ).snapshot;
          expect(
            new Set(Object.keys(result.entries)),
            `${activity.id} ${intent} ${level} ${count}`,
          ).toEqual(new Set(selected.categories));
          expect(
            Object.values(result.entries).every(
              (p) => level !== "clean" || p.contentRating === "clean",
            ),
          ).toBe(true);
        }
      }
});
