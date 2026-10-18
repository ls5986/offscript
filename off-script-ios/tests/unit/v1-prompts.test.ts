import { expect, test } from "vitest";
import {
  composeScene,
  upgradeSnapshotIngredients,
} from "../../src/domain/composer";
import {
  curatedScenes,
  prompts,
  relationships,
  resolveIngredientId,
} from "../../src/domain/content";
import historicalReview from "../../content/editorial/ingredient-purity-2.5.0.json";
import {
  emptyPrompt,
  generatePrompt,
  type Usage,
} from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import type { PromptSnapshot } from "../../src/domain/contracts";

const entries = (values: Record<string, string>): PromptSnapshot => ({
  ...emptyPrompt(),
  entries: Object.fromEntries(
    Object.entries(values).map(([category, text]) => [
      category,
      { id: `custom_${category}`, text, locked: false },
    ]),
  ),
});

test("composition is independently opt-in for new callers and absent flags preserve legacy behavior", () => {
  const previous = entries({ location: "Hotel", situation: "A late delivery" });
  expect(composeScene(previous)).toBeDefined();
  const disabled = generatePrompt(
    {
      categories: ["location", "situation"],
      count: 2,
      style: "coherent",
      previous,
      compositionEnabled: false,
    },
    seededRng(1),
  ).snapshot;
  expect(disabled.compositionEnabled).toBe(false);
  expect(disabled.composition).toBeUndefined();
  expect(composeScene(disabled)).toBeUndefined();
  const retained = generatePrompt(
    {
      categories: ["location", "situation"],
      count: 2,
      style: "independent",
      previous: disabled,
    },
    seededRng(2),
  ).snapshot;
  expect(retained.compositionEnabled).toBe(false);
  const enabled = generatePrompt(
    {
      categories: ["location", "situation"],
      count: 2,
      style: "independent",
      previous: disabled,
      compositionEnabled: true,
    },
    seededRng(3),
  ).snapshot;
  expect(enabled.composition).toBeDefined();
});

test("every ensemble relationship has unique assignments through its maximum count", () => {
  for (const template of relationships.filter((r) => r.expandableRole)) {
    const source = prompts.find(
      (p) => p.relationshipTemplateId === template.id,
    )!;
    for (
      let count = template.minPlayers;
      count <= template.maxPlayers;
      count++
    ) {
      const snapshot = generatePrompt(
        {
          categories: ["relationship"],
          count,
          style: "independent",
          pool: [source],
          contentLevel: "18_plus",
        },
        seededRng(1),
      ).snapshot;
      const roles = snapshot.relationship!.assignments.map((a) => a.roleText);
      expect(new Set(roles).size, `${template.id} at ${count}`).toBe(count);
      expect(roles.slice(0, template.namedRoles.length)).toEqual(
        template.namedRoles,
      );
    }
  }
});

test("explicit historical relationship upgrades use unique roles without rewriting locked assignments", () => {
  const source = prompts.find(
    (p) => p.category === "relationship" && p.maxPlayers === 12,
  )!;
  const template = relationships.find(
    (r) => r.id === source.relationshipTemplateId,
  )!;
  const old: PromptSnapshot = {
    ...entries({ relationship: source.text }),
    relationship: {
      templateId: template.id,
      premise: template.premise,
      assignments: Array.from({ length: 12 }, (_, i) => ({
        playerId: `p${i}`,
        roleText: `Saved ${i}`,
      })),
    },
  };
  const archived = curatedScenes.find(
    (c) => c.source.id === source.id && c.originalText !== source.text,
  )!;
  old.entries.relationship = {
    id: source.id,
    text: archived.originalText,
    locked: false,
  };
  const upgraded = upgradeSnapshotIngredients(old);
  expect(
    new Set(upgraded.relationship!.assignments.map((a) => a.roleText)).size,
  ).toBe(12);
  old.entries.relationship.locked = true;
  expect(upgradeSnapshotIngredients(old)).toEqual(old);
});

test("explicit upgrade repairs old duplicate labels even when ingredient text is already current", () => {
  const source = prompts.find((p) => p.relationshipTemplateId === "rel_041")!;
  const old: PromptSnapshot = {
    ...emptyPrompt(),
    entries: {
      relationship: { id: source.id, text: source.text, locked: false },
    },
    relationship: {
      templateId: "rel_041",
      premise: source.text,
      assignments: Array.from({ length: 8 }, (_, i) => ({
        playerId: `p${i}`,
        roleText: `Theater board member ${(i % 4) + 1}`,
      })),
    },
  };
  const saved = structuredClone(old);
  const upgraded = upgradeSnapshotIngredients(old);
  expect(upgraded.relationship!.assignments[4].roleText).toBe("Board member 5");
  expect(
    new Set(upgraded.relationship!.assignments.map((a) => a.roleText)).size,
  ).toBe(8);
  expect(old).toEqual(saved);
  old.entries.relationship.locked = true;
  expect(upgradeSnapshotIngredients(old)).toEqual(old);
  expect(
    generatePrompt(
      {
        categories: ["relationship"],
        count: 8,
        previous: old,
        style: "coherent",
      },
      seededRng(1),
    ).snapshot.relationship,
  ).toEqual(old.relationship);
});

test("locative composition uses on for surfaces and in for rooms without editing ingredient words", () => {
  for (const place of ["Bridge", "Rooftop", "Beach", "Boat", "Train", "Farm"]) {
    const snapshot = entries({ location: place, action: "Waiting" });
    expect(composeScene(snapshot)?.text).toBe(
      `Waiting on a ${place.toLowerCase()}.`,
    );
    expect(snapshot.entries.location.text).toBe(place);
  }
  expect(
    composeScene(entries({ location: "Hotel", action: "Waiting" }))?.text,
  ).toBe("Waiting in a hotel.");
  for (const location of ["Train station", "Train yard"])
    expect(composeScene(entries({ location, action: "Waiting" }))?.text).toBe(
      `Waiting in a ${location.toLowerCase()}.`,
    );
});

test("canonical complete clauses are not treated as noun conditions", () => {
  for (const id of ["066", "076", "078", "091"]) {
    const source = prompts.find(
      (p) => p.id === resolveIngredientId(`prompt_situation_${id}`),
    )!;
    expect(source.compositionForm, source.text).toBe("clause");
    const snapshot = entries({ location: "Hotel", situation: source.text });
    snapshot.entries.situation.id = source.id;
    expect(composeScene(snapshot)?.text).toBe(
      `A hotel, where ${source.text[0].toLowerCase()}${source.text.slice(1).replace(/[.!?]$/, "")}.`,
    );
  }
});

test("a locked Hotel honors Grounded archive priority and requested Playful without repeating before its pool is exhausted", () => {
  const hotel = prompts.find((p) => p.id === "prompt_location_077")!;
  for (const flavor of ["grounded", "playful"] as const) {
    let snapshot: PromptSnapshot = {
      ...emptyPrompt(),
      entries: { location: { id: hotel.id, text: hotel.text, locked: true } },
    };
    const locked = structuredClone(snapshot.entries.location);
    let usage: Usage = {};
    const ids: string[] = [];
    const available = prompts.filter(
      (p) =>
        p.category === "situation" &&
        p.contentRating === "clean" &&
        p.flavor === flavor &&
        p.minPlayers <= 2 &&
        p.maxPlayers >= 2,
    );
    for (let i = 0; i < 30; i++) {
      const next = generatePrompt(
        {
          categories: ["location", "situation"],
          count: 2,
          style: "coherent",
          flavor,
          previous: snapshot,
          usage,
        },
        seededRng(i + 1),
      );
      snapshot = next.snapshot;
      usage = next.usage;
      const source = available.find(
        (p) => p.id === snapshot.entries.situation.id,
      )!;
      expect(source).toBeDefined();
      expect(snapshot.entries.situation.text).toBe(source.text);
      expect(snapshot.entries.situation.sourceVersion).toBe(source.version);
      expect(snapshot.entries.location).toEqual(locked);
      ids.push(snapshot.entries.situation.id);
    }
    if (flavor === "grounded") expect(ids[0]).toBe("prompt_situation_144");
    const firstCycleLength = Math.min(30, available.length);
    expect(new Set(ids.slice(0, firstCycleLength)).size).toBe(firstCycleLength);
    expect(new Set(ids).size).toBeGreaterThanOrEqual(20);
    expect(ids.every((id, i) => !i || id !== ids[i - 1])).toBe(true);
  }
});

test("bounded 2.5 beginner emotion review keeps simple cues and preserves specialist alternatives", () => {
  expect(historicalReview.targetPackVersion).toBe("2.5.0");
  expect(
    historicalReview.approvedEntries.find((p) => p.id === "prompt_emotion_001")
      ?.text,
  ).toBe("Excitement");
  expect(
    historicalReview.approvedEntries.find((p) => p.id === "prompt_emotion_038")
      ?.text,
  ).toBe("Vulnerability");
  expect(
    historicalReview.approvedEntries.some(
      (p) => p.text === "Bittersweet happiness",
    ),
  ).toBe(true);
});
