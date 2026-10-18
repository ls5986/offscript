import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "vitest";
import baseline from "../../content/editorial/ingredient-purity-2.5.0.json";
import expansionReview from "../../content/editorial/ingredient-purity-2.6.0.json";
import { advicePrompts, sourcePrompts } from "../../src/domain/content";
import { PromptEntrySchema } from "../../src/domain/contracts";
import { adviceFor, adviceRequests } from "../../src/domain/party-advice";
import { emptyPrompt } from "../../src/domain/prompts";

const read = <T>(path: string, fallback: T): T =>
  existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : fallback;
const expansion = read<(typeof baseline.approvedEntries)[number][]>(
  "src/content/v2/party-expansion-2.6.json",
  [],
);
const hints = read<
  { id: string; text: string; openingLine: string; contentRating: string }[]
>("src/content/v2/party-opening-hints.json", []);
const advice = read<{ id: string; question: string; example: string }[]>(
  "src/content/v2/party-advice-expansion.json",
  [],
);

test("2.6 adds exactly 144 rated ingredients after the unchanged 1,182-record baseline", () => {
  expect(expansionReview.targetPackVersion).toBe("2.6.0");
  expect(expansion).toHaveLength(144);
  expect(sourcePrompts).toHaveLength(1326);
  expect(
    expansionReview.approvedEntries
      .slice(0, 1182)
      .map((entry) => PromptEntrySchema.parse(entry)),
  ).toEqual(
    baseline.approvedEntries.map((entry) => PromptEntrySchema.parse(entry)),
  );
  expect(sourcePrompts.slice(1182)).toEqual(
    expansion.map((entry) => PromptEntrySchema.parse(entry)),
  );
  expect(new Set(sourcePrompts.map((entry) => entry.id)).size).toBe(1326);
  for (const entry of expansion) {
    expect(Number(entry.id.split("_").at(-1))).toBeGreaterThanOrEqual(3000);
    expect(entry).toMatchObject({ minPlayers: 2, maxPlayers: 12, version: 1 });
    expect(entry.contentRating).not.toBe("clean");
    expect(entry.text).not.toMatch(/placeholder|lorem ipsum|scenario \d+/i);
  }
});

test.each(["spicy", "mature_suggestive"])(
  "%s has 32 scenes, 16 separate advice requests and eight of each ordinary input",
  (rating) => {
    const pool = expansion.filter((entry) => entry.contentRating === rating);
    expect(pool).toHaveLength(72);
    const scenes = pool.filter(
      (entry) =>
        entry.category === "situation" && entry.tags.includes("party_seed"),
    );
    expect(scenes).toHaveLength(32);
    const requests = pool.filter((entry) =>
      entry.tags.includes("party_advice"),
    );
    expect(requests).toHaveLength(16);
    for (const entry of requests) {
      expect(entry.category).toBe("situation");
      expect(entry.tags).not.toContain("party_seed");
    }
    for (const category of ["profession", "location", "opening_line"]) {
      const inputs = pool.filter((entry) => entry.category === category);
      expect(inputs).toHaveLength(8);
      for (const entry of inputs) {
        expect(entry.tags).toContain("party_seed");
        if (category !== "opening_line") {
          expect(entry.text.split(/\s+/).length).toBeLessThanOrEqual(3);
          expect(entry.text.length).toBeLessThanOrEqual(24);
          expect(entry.text).not.toMatch(/^(a|an|the)\s/i);
        }
      }
    }
  },
);

test("all 154 scene hints are reviewed source-exact first-person starts, never advice or extra opening-line jokes", () => {
  const scenes = sourcePrompts.filter(
    (entry) =>
      entry.category === "situation" && entry.tags.includes("party_seed"),
  );
  expect(scenes).toHaveLength(154);
  expect(hints).toHaveLength(154);
  expect(new Set(hints.map((hint) => hint.id))).toEqual(
    new Set(scenes.map((entry) => entry.id)),
  );
  for (const hint of hints) {
    const source = scenes.find((entry) => entry.id === hint.id)!;
    expect(hint).toEqual({
      id: source.id,
      text: source.text,
      openingLine: expect.any(String),
      contentRating: source.contentRating,
    });
    expect(hint.openingLine).toMatch(
      /\b(I|I'm|I've|I'd|I'll|my|we|we're|our)\b/i,
    );
    expect(hint.openingLine.length).toBeGreaterThan(12);
    expect(hint.openingLine.length).toBeLessThanOrEqual(180);
    expect(hint.openingLine).not.toMatch(
      /fortunately|unfortunately|you should|punchline|ba[ -]?dum|plot twist/i,
    );
  }
  expect(hints.find((hint) => hint.id === "prompt_situation_2023")).toEqual({
    id: "prompt_situation_2023",
    text: "Someone has hired a spokesperson for the group chat.",
    openingLine:
      "I think we need to replace Diana; she keeps telling the group chat the wrong thing.",
    contentRating: "clean",
  });
});

test("32 new advice examples merge with all 28 old requests and honor the exact-text guard", () => {
  expect(advice).toHaveLength(32);
  expect(Object.keys(adviceRequests)).toHaveLength(60);
  expect(new Set(advice.map((entry) => entry.id))).toEqual(
    new Set(
      expansion
        .filter((entry) => entry.tags.includes("party_advice"))
        .map((entry) => entry.id),
    ),
  );
  for (const { id, question, example } of advice) {
    const source = advicePrompts.find((entry) => entry.id === id)!;
    expect(question).toMatch(/\?$/);
    expect(example).toMatch(/^You should /);
    const snapshot = {
      ...emptyPrompt(),
      entries: { situation: { id, text: source.text, locked: true } },
    };
    expect(adviceFor(snapshot)).toEqual({ question, example });
    snapshot.entries.situation.text += " Changed saved original.";
    expect(adviceFor(snapshot)).toBeNull();
  }
});

test("all 32 new fictional advice problems use the requesting friend's first-person voice", () => {
  const problems = expansion.filter((entry) =>
    entry.tags.includes("party_advice"),
  );
  expect(problems).toHaveLength(32);
  for (const problem of problems)
    expect(problem.text, problem.id).toMatch(/^(I |My )/);
});

test("new profession inputs are recognizable dating/adult-topic jobs, not ordinary jobs with a rating label", () => {
  for (const [rating, approvedJobs] of [
    [
      "spicy",
      [
        "Matchmaker",
        "Blind-date organizer",
        "Singles event planner",
        "Wedding photographer",
        "Romance columnist",
        "Dating-app moderator",
        "Singles-trip guide",
        "Anniversary planner",
      ],
    ],
    [
      "mature_suggestive",
      [
        "Couples counselor",
        "Divorce lawyer",
        "Intimacy coordinator",
        "Prenup lawyer",
        "Relationship therapist",
        "Late-night advice host",
        "Adult dating coach",
        "Honeymoon coordinator",
      ],
    ],
  ] as const)
    expect(
      expansion
        .filter(
          (entry) =>
            entry.category === "profession" && entry.contentRating === rating,
        )
        .map((entry) => entry.text),
    ).toEqual(approvedJobs);
});

test("the eight new mature locations carry familiar adult context in their actual place labels", () => {
  const places = expansion.filter(
    (entry) =>
      entry.category === "location" &&
      entry.contentRating === "mature_suggestive",
  );
  expect(places.map((entry) => entry.text)).toEqual([
    "Adults-only resort",
    "Divorce court",
    "Burlesque club",
    "Lingerie store",
    "Adult novelty store",
    "Adults-only pool",
    "Wedding night suite",
    "Couples counseling room",
  ]);
  const historicalPlaces = new Set(
    baseline.approvedEntries
      .filter((entry) => entry.category === "location")
      .map((entry) => entry.text.toLowerCase()),
  );
  for (const place of places) {
    expect(place.text.length).toBeLessThanOrEqual(24);
    expect(historicalPlaces.has(place.text.toLowerCase())).toBe(false);
    expect(place).toMatchObject({ compositionForm: "place", version: 1 });
  }
});

test("2.6 approval covers complete values, additive provenance and both metadata files", () => {
  const review = read("content/editorial/ingredient-purity-2.6.0.json", {
    sourcePackVersion: "",
    targetPackVersion: "",
    previousReview: "",
    sourceEntries: [],
    approvedEntries: [],
    approvedValues: [],
    reviewedOpeningHints: [],
    reviewedAdviceRequests: [],
  });
  expect(review).toMatchObject({
    sourcePackVersion: "2.5.0",
    targetPackVersion: "2.6.0",
    previousReview: "ingredient-purity-2.5.0.json",
  });
  expect(review.sourceEntries).toEqual(baseline.approvedEntries);
  expect(review.approvedEntries).toEqual([
    ...baseline.approvedEntries,
    ...expansion,
  ]);
  expect(review.approvedValues).toEqual(
    expansionReview.approvedEntries.map(({ id, category, text, version }) => ({
      id,
      category,
      text,
      version,
    })),
  );
  expect(review.reviewedOpeningHints).toEqual(hints);
  expect(review.reviewedAdviceRequests).toEqual(advice);
});

test("all three historical editorial approvals remain byte-for-byte immutable", () => {
  for (const [version, digest] of [
    [
      "2.3.0",
      "cd32ad8daa89d6e0a4753cc90aff563e7fa4abbd34509d6d954fbde2c08518d5",
    ],
    [
      "2.4.0",
      "7b7ad4a6e5c007417be91276c1def9c0473f197db0eef2b13bbf3b0a83f558cc",
    ],
    [
      "2.5.0",
      "ca2fdaaf525ef1a1f898869d22a4decfd765cd89132d07d3d4f90ecb693c64c7",
    ],
  ]) {
    expect(
      createHash("sha256")
        .update(
          readFileSync(`content/editorial/ingredient-purity-${version}.json`),
        )
        .digest("hex"),
    ).toBe(digest);
  }
});
