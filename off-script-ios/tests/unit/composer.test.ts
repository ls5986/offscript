import { describe, expect, test } from "vitest";
import {
  categories,
  curatedScenes,
  PACK,
  prompts,
  relationships,
  resolveIngredientId,
} from "../../src/domain/content";
import {
  composeScene,
  legacyIngredientCategories,
  refreshComposition,
  upgradeSnapshotIngredients,
} from "../../src/domain/composer";
import {
  PromptSnapshotSchema,
  type PromptSnapshot,
} from "../../src/domain/contracts";
import {
  emptyPrompt,
  generatePrompt,
  promptText,
} from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import { AppDataSchema, initialData } from "../../src/storage/model";
function custom(
  entries: Partial<Record<(typeof categories)[number], string>>,
): PromptSnapshot {
  return {
    ...emptyPrompt(),
    entries: Object.fromEntries(
      Object.entries(entries).map(([category, text]) => [
        category,
        {
          id: `custom_${category}`,
          text,
          locked: false,
          sourceVersion: 1,
          sourcePackVersion: PACK,
        },
      ]),
    ),
  };
}
describe("deterministic scene composition", () => {
  test("fridge Action stays simple while original combined suggestions and locked saves remain intact", () => {
    const sourceId = "prompt_action_071";
    const fridge = prompts.find((p) => p.id === resolveIngredientId(sourceId))!;
    const generated = generatePrompt(
      {
        categories: ["action"],
        count: 2,
        style: "coherent",
        flavor: "playful",
        pool: [fridge],
      },
      seededRng(1),
    ).snapshot;
    expect(generated.entries.action.text).toBe("Organizing");
    expect(Object.keys(generated.entries)).toEqual(["action"]);
    expect(generated.composition).toBeUndefined();
    const old = custom({ action: "Organizing the fridge like a luxury hotel" });
    old.entries.action = {
      ...old.entries.action,
      id: sourceId,
      sourceVersion: 1,
      sourcePackVersion: "2.2.0",
      locked: true,
    };
    const copy = structuredClone(old);
    expect(upgradeSnapshotIngredients(old)).toEqual(old);
    const upgraded = upgradeSnapshotIngredients({
      ...old,
      entries: { action: { ...old.entries.action, locked: false } },
    });
    expect(upgraded.entries.action.id).toBe(fridge.id);
    expect(upgraded.entries.action.text).toBe("Organizing");
    expect(Object.keys(upgraded.entries)).toEqual(["action"]);
    expect(old).toEqual(copy);
    expect(
      curatedScenes.find((c) => c.source.id === sourceId)?.originalText,
    ).toBe("Organizing the fridge like a luxury hotel");
  });

  test("the requested hotel-policy example, with no hidden creative details", () => {
    const original = custom({
      location: "Hotel lobby",
      situation: "Strict no-boring-hats policy",
    });
    const copy = structuredClone(original);
    expect(composeScene(original)?.text).toBe(
      "A hotel lobby with a strict no-boring-hats policy.",
    );
    expect(composeScene(original)?.remainingCategories).toEqual([]);
    expect(original).toEqual(copy);
    expect(composeScene(original)).toEqual(
      composeScene({
        ...original,
        entries: Object.fromEntries(Object.entries(original.entries).reverse()),
      }),
    );
  });
  test("clausal situations and small two-ingredient combinations read naturally", () => {
    expect(
      composeScene(
        custom({
          relationship: "Two siblings",
          situation: "The prize has arrived",
        }),
      )?.text,
    ).toBe("Two siblings.");
    expect(
      composeScene(
        custom({
          relationship: "Two siblings",
          situation: "The prize has arrived",
        }),
      )?.remainingCategories,
    ).toEqual(["situation"]);
    expect(
      composeScene(custom({ location: "A hotel lobby", genre: "Film noir" }))
        ?.text,
    ).toBe("Film noir in a hotel lobby.");
    for (const [id, text] of [
      [
        "prompt_situation_182",
        "Official recognition is being sought for something inanimate.",
      ],
      [
        "prompt_situation_179",
        "Something lost has reappeared as a prized discovery.",
      ],
    ]) {
      const entry = prompts.find((p) => p.id === resolveIngredientId(id))!;
      expect(entry.text).toBe(text);
      expect(entry.compositionForm).toBe("clause");
      const snapshot = custom({ location: "A hotel lobby", situation: text });
      snapshot.entries.situation.id = entry.id;
      expect(composeScene(snapshot)?.text).toContain(", where ");
    }
  });
  test("each single category returns its exact value without composing another category", () => {
    for (const category of categories)
      for (const count of [2, 3, 8, 12]) {
        const { snapshot } = generatePrompt(
          {
            categories: [category],
            count,
            style: "coherent",
            flavor: "playful",
          },
          seededRng(count),
        );
        expect(Object.keys(snapshot.entries)).toEqual([category]);
        expect(snapshot.composition).toBeUndefined();
        const current = prompts.find(
          (p) => p.id === snapshot.entries[category].id,
        )!;
        expect(snapshot.entries[category].text).toBe(current.text);
        expect(snapshot.entries[category].sourceVersion).toBe(current.version);
        expect(snapshot.entries[category].sourcePackVersion).toBe(PACK);
      }
  });
  test("all 1,023 category subsets preserve the selection, stay concise and account for every ingredient", () => {
    for (const style of ["coherent", "independent"] as const)
      for (let mask = 1; mask < 1024; mask++) {
        const chosen = categories.filter((_, i) => mask & (1 << i));
        const { snapshot } = generatePrompt(
          { categories: chosen, count: 3, style },
          seededRng(mask),
        );
        expect(new Set(Object.keys(snapshot.entries))).toEqual(new Set(chosen));
        if (chosen.length === 1) continue;
        const scene = composeScene(snapshot)!;
        expect(scene).toEqual(snapshot.composition);
        expect(
          new Set([...scene.includedCategories, ...scene.remainingCategories]),
        ).toEqual(new Set(chosen));
        expect(new Set(scene.includedCategories).size).toBe(
          scene.includedCategories.length,
        );
        expect(scene.text.length).toBeLessThanOrEqual(181);
      }
  }, 30000);
  test("complex combinations keep a short premise and list unmerged details separately", () => {
    const snapshot = custom({
      relationship: "Three neighbors",
      location: "A hotel lobby",
      role: "The spokesperson",
      profession: "Dentist",
      emotion: "Quiet anticipation",
      genre: "Film noir",
      opening_line: "“I found your hat.”",
      situation: "Strict no-boring-hats policy",
    });
    const result = composeScene(snapshot)!;
    expect(result.text).toBe(
      "Three neighbors in a hotel lobby with a strict no-boring-hats policy.",
    );
    expect(result.remainingCategories).toEqual(
      expect.arrayContaining([
        "role",
        "profession",
        "emotion",
        "genre",
        "opening_line",
      ]),
    );
    expect(result.text).not.toMatch(
      /spokesperson|dentist|confident|wants|hopes|hat\./i,
    );
  });
  test("every ingredient change invalidates composed output without rewriting values", () => {
    const snapshot = refreshComposition(
      custom({
        location: "Hotel lobby",
        situation: "Strict no-boring-hats policy",
      }),
    );
    const changed = structuredClone(snapshot);
    changed.entries.location.text = "A train station";
    expect(composeScene(changed)?.text).toBe(
      "A train station with a strict no-boring-hats policy.",
    );
    expect(composeScene(changed)?.signature).not.toBe(
      snapshot.composition?.signature,
    );
    delete changed.entries.situation;
    expect(refreshComposition(changed).composition).toBeUndefined();
    expect(changed.entries.location.text).toBe("A train station");
  });
});
describe("selection, content purity and original scene preservation", () => {
  test("Grounded Connected prioritizes the hotel archive without overriding requested Playful; Mix freely remains varied", () => {
    const location = prompts.find((p) => p.id === "prompt_location_077")!;
    const example = curatedScenes.find((c) => c.source.id === location.id)!;
    const policy = example.ingredients.find((r) => r.category === "situation")!;
    const initial: PromptSnapshot = {
      ...emptyPrompt(),
      entries: {
        location: {
          id: location.id,
          text: location.text,
          locked: true,
          sourceVersion: location.version,
          sourcePackVersion: PACK,
        },
      },
    };
    const values = new Set<string>();
    for (let seed = 0; seed < 20; seed++) {
      const connected = generatePrompt(
        {
          categories: ["location", "situation"],
          count: 2,
          style: "coherent",
          flavor: "grounded",
          previous: initial,
        },
        seededRng(seed),
      ).snapshot;
      expect(connected.entries.situation.id).toBe(policy.id);
      expect(connected.composition?.text).toBe(
        "A hotel, where a new rule forbids being ordinary.",
      );
      const playful = generatePrompt(
        {
          categories: ["location", "situation"],
          count: 2,
          style: "coherent",
          flavor: "playful",
          previous: initial,
        },
        seededRng(seed),
      ).snapshot;
      const source = prompts.find(
        (p) => p.id === playful.entries.situation.id,
      )!;
      expect(source.flavor).toBe("playful");
      expect(playful.entries.situation.text).toBe(source.text);
      expect(playful.entries.situation.sourceVersion).toBe(source.version);
      expect(playful.entries.location).toEqual(initial.entries.location);
      expect(playful.entries.situation.id).not.toBe(policy.id);
      const mixed = generatePrompt(
        {
          categories: ["location", "situation"],
          count: 2,
          style: "independent",
          flavor: "playful",
          previous: initial,
        },
        seededRng(seed),
      ).snapshot;
      values.add(mixed.entries.situation.id);
    }
    expect(values.size).toBeGreaterThan(1);
  });
  test("locks and single-card rerolls preserve all other IDs, texts, source versions and role assignments", () => {
    const first = generatePrompt(
      {
        categories: ["relationship", "location", "situation"],
        count: 3,
        style: "coherent",
      },
      seededRng(1),
    ).snapshot;
    first.entries.location.locked = true;
    const locked = generatePrompt(
      {
        categories: ["relationship", "location", "situation"],
        count: 3,
        style: "coherent",
        previous: first,
        only: "location",
      },
      seededRng(2),
    ).snapshot;
    expect(locked.entries).toEqual(first.entries);
    const next = generatePrompt(
      {
        categories: ["relationship", "location", "situation"],
        count: 3,
        style: "coherent",
        previous: first,
        only: "situation",
      },
      seededRng(3),
    ).snapshot;
    expect(next.entries.situation.id).not.toBe(first.entries.situation.id);
    expect(next.entries.location).toEqual(first.entries.location);
    expect(next.entries.relationship).toEqual(first.entries.relationship);
    expect(next.relationship).toEqual(first.relationship);
    expect(next.composition).toEqual(composeScene(next));
  });
  test("all curated originals and versioned links remain available; pure relationship roles impose no goals", () => {
    expect(curatedScenes.length).toBeGreaterThan(250);
    for (const example of curatedScenes)
      for (const ref of example.ingredients)
        expect(
          prompts.some(
            (p) =>
              p.id === ref.id &&
              p.category === ref.category &&
              p.version === ref.version,
          ),
        ).toBe(true);
    expect(prompts.find((p) => p.id === "prompt_location_077")?.text).toBe(
      "Hotel",
    );
    expect(
      prompts.find(
        (p) => p.id === resolveIngredientId("prompt_relationship_001"),
      )?.text,
    ).toBe("Two siblings");
    for (const r of relationships) {
      expect(r.premise).not.toMatch(
        /trying|planning|preparing|discovering|negotiating|wants|nervous|overconfident/i,
      );
      for (const role of r.namedRoles)
        expect(role).not.toMatch(
          /trying|wants|defending|protecting|overconfident|newest person asking/i,
        );
    }
  });
});
describe("saved snapshots and explicit legacy upgrade", () => {
  test("legacy combined text and locks survive loading and upgrade requires unlocking", () => {
    const old: PromptSnapshot = {
      ...emptyPrompt(),
      contentPackVersion: "1.1.0",
      entries: {
        location: {
          id: "prompt_location_077",
          text: "A hotel lobby with a strict no-boring-hats policy",
          locked: true,
        },
      },
    };
    const state = initialData();
    state.savedPrompts = [
      {
        id: "old",
        label: "Original",
        createdAt: new Date().toISOString(),
        snapshot: old,
        playerCount: 2,
      },
    ];
    const restored = AppDataSchema.parse(JSON.parse(JSON.stringify(state)));
    expect(restored.savedPrompts[0].snapshot).toEqual(old);
    expect(legacyIngredientCategories(old)).toEqual(["location"]);
    expect(composeScene(old)).toBeUndefined();
    expect(upgradeSnapshotIngredients(old).entries).toEqual(old.entries);
    const unlocked = structuredClone(old);
    unlocked.entries.location.locked = false;
    const updated = upgradeSnapshotIngredients(unlocked);
    expect(updated.entries.location.text).toBe("Hotel");
    expect(Object.keys(updated.entries)).toEqual(["location"]);
    expect(updated.entries.location.sourceVersion).toBe(3);
    expect(state.savedPrompts[0].snapshot).toEqual(old);
  });
  test("an old locked pure card keeps its original fallback pack beside new versioned ingredients", () => {
    const location = prompts.find((p) => p.id === "prompt_location_011")!;
    const old: PromptSnapshot = {
      ...emptyPrompt(),
      contentPackVersion: "1.1.0",
      entries: {
        location: { id: location.id, text: location.text, locked: true },
      },
    };
    const generated = generatePrompt(
      {
        categories: ["location", "situation"],
        count: 2,
        style: "coherent",
        previous: old,
      },
      seededRng(99),
    ).snapshot;
    expect(generated.entries.location).toEqual(old.entries.location);
    expect(generated.contentPackVersion).toBe("1.1.0");
    expect(generated.entries.situation.sourcePackVersion).toBe(PACK);
    expect(generated.composition?.contentPackVersion).toBe(PACK);
  });
  test("new saved composition roundtrips independently from ingredient values and shares both views", () => {
    const result = generatePrompt(
      {
        categories: ["relationship", "location", "situation"],
        count: 8,
        style: "coherent",
      },
      seededRng(4),
    ).snapshot;
    expect(
      PromptSnapshotSchema.parse(JSON.parse(JSON.stringify(result))),
    ).toEqual(result);
    const output = promptText(result);
    expect(output.startsWith(result.composition!.text)).toBe(true);
    for (const entry of Object.values(result.entries))
      expect(output).toContain(entry.text);
    expect(result.relationship?.assignments).toHaveLength(8);
  });
});
