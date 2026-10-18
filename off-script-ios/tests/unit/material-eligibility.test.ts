import { expect, test } from "vitest";
import { prompts } from "../../src/domain/content";
import { generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";

const source = prompts.find((entry) => entry.category === "profession")!;
const clean = {
  ...source,
  id: "prompt_profession_9000",
  text: "Baker",
  contentRating: "clean" as const,
  minPlayers: 2,
  maxPlayers: 12,
};
const spicy = {
  ...source,
  id: "prompt_profession_9001",
  text: "Matchmaker",
  contentRating: "spicy" as const,
  minPlayers: 2,
  maxPlayers: 12,
};
const adult = {
  ...source,
  id: "prompt_profession_9002",
  text: "Adult advice host",
  contentRating: "mature_suggestive" as const,
  minPlayers: 2,
  maxPlayers: 2,
};

test.each([
  ["clean", 2, "clean"],
  ["spicy", 2, "spicy"],
  ["18_plus", 2, "mature_suggestive"],
  ["18_plus", 4, "spicy"],
] as const)(
  "the %s preference uses the strongest eligible material for %i people",
  (contentLevel, count, rating) => {
    for (let seed = 0; seed < 20; seed++) {
      const snapshot = generatePrompt(
        {
          categories: ["profession"],
          count,
          style: "independent",
          contentLevel,
          pool: [clean, spicy, adult],
        },
        seededRng(seed),
      ).snapshot;
      expect(snapshot.entries.profession.contentRating).toBe(rating);
    }
  },
);

test("a category with no stronger compatible ingredient uses an honestly rated Clean scaffold", () => {
  const snapshot = generatePrompt(
    {
      categories: ["profession"],
      count: 4,
      style: "coherent",
      contentLevel: "18_plus",
      pool: [clean, adult],
    },
    seededRng(3),
  ).snapshot;
  expect(snapshot.entries.profession.contentRating).toBe("clean");
  expect(snapshot.entries.profession.text).toBe("Baker");
});

test("an actually empty compatible category reports an explicit content error", () => {
  expect(() =>
    generatePrompt(
      {
        categories: ["profession"],
        count: 4,
        style: "coherent",
        contentLevel: "clean",
        pool: [adult],
      },
      seededRng(3),
    ),
  ).toThrow(/no compatible profession/i);
});
