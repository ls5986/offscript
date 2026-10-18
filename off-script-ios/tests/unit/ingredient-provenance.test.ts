import { expect, test } from "vitest";
import { sourcePrompts, topics } from "../../src/domain/content";
import firstBank from "../../src/content/v1/prompts.json";
import firstPlayfulBank from "../../src/content/v1/playful-prompts.json";
import { emptyPrompt, snapshotIsClean } from "../../src/domain/prompts";

test("a retained full adult problem stays non-Clean even when its new independent core is neutral", () => {
  const source = sourcePrompts.find(
    (entry) => entry.id === "prompt_situation_3101",
  )!;
  const snapshot = {
    ...emptyPrompt(),
    entries: { situation: { id: source.id, text: source.text, locked: true } },
  };
  expect(snapshotIsClean(snapshot)).toBe(false);
});

test("an unrelated imported text cannot borrow a known Clean ID's classification", () => {
  const source = sourcePrompts.find(
    (entry) => entry.id === "prompt_location_027",
  )!;
  const snapshot = {
    ...emptyPrompt(),
    entries: {
      location: {
        id: source.id,
        text: "This is unrelated imported wording with no reviewed rating.",
        locked: true,
      },
    },
  };
  expect(snapshotIsClean(snapshot)).toBe(false);
});

test("an exact archived Clean original still has a valid historical classification", () => {
  const snapshot = {
    ...emptyPrompt(),
    entries: {
      location: {
        id: "prompt_location_027",
        text: "The repair counter of an umbrella shop",
        locked: true,
      },
    },
  };
  expect(snapshotIsClean(snapshot)).toBe(true);
});

test("identical words do not lose their old captured classification when a canonical value is re-rated", () => {
  const snapshot = {
    ...emptyPrompt(),
    entries: {
      situation: {
        id: "prompt_situation_2133",
        text: "It is Valentine’s Day",
        locked: true,
        sourcePackVersion: "2.6.1",
      },
    },
  };
  expect(snapshotIsClean(snapshot)).toBe(false);
  snapshot.entries.situation.sourcePackVersion = "2.7.0";
  expect(snapshotIsClean(snapshot)).toBe(true);
});

test("an imported word cannot borrow a known Clean topic ID for unreviewed text", () => {
  const topic = topics[0];
  const snapshot = {
    ...emptyPrompt(),
    jokeTopic: { id: topic.id, word: "Unreviewed different wording" },
  };
  expect(snapshotIsClean(snapshot)).toBe(false);
  snapshot.jokeTopic.word = topic.word;
  expect(snapshotIsClean(snapshot)).toBe(true);
});

test.each([
  "prompt_location_074",
  "prompt_location_082",
  "prompt_location_084",
  "prompt_location_089",
  "prompt_location_090",
  "prompt_relationship_085",
  "prompt_relationship_087",
  "prompt_relationship_090",
  "prompt_relationship_095",
  "prompt_relationship_098",
  "prompt_relationship_100",
  "prompt_relationship_103",
  "prompt_relationship_104",
])(
  "the exact retired 1.1 original %s retains its immutable Clean rating",
  (id) => {
    const source = [...firstBank, ...firstPlayfulBank].find(
      (entry) => entry.id === id,
    )!;
    expect(source.contentRating).toBe("clean");
    const snapshot = {
      ...emptyPrompt(),
      contentPackVersion: "1.1.0",
      entries: {
        [source.category]: {
          id,
          text: source.text,
          locked: true,
          sourceVersion: 1,
        },
      },
    };
    const before = structuredClone(snapshot);
    expect(snapshotIsClean(snapshot)).toBe(true);
    expect(snapshot).toEqual(before);
    snapshot.entries[source.category].text = "An unrelated imported text.";
    expect(snapshotIsClean(snapshot)).toBe(false);
  },
);
