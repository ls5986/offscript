import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { expect, test } from "vitest";
import source from "../../content/editorial/ingredient-purity-2.6.1.json";
import review from "../../content/editorial/ingredient-purity-2.7.0.json";
import audited from "../../content/editorial/atomic-audit-2.7.0.json";
import atomicIngredients from "../../src/content/v2/atomic-ingredients-2.7.json";
import atomicRelationships from "../../src/content/v2/atomic-relationships-2.7.json";
import atomicAliases from "../../src/content/v2/atomic-aliases-2.7.json";
import archive from "../../src/content/v2/atomic-archive-2.7.json";
import {
  PromptEntrySchema,
  RelationshipTemplateSchema,
  type PromptEntry,
  type RelationshipTemplate,
} from "../../src/domain/contracts";

const sourcePrompts = PromptEntrySchema.array().parse(source.approvedEntries);
const sourceRelationships = RelationshipTemplateSchema.array().parse(
  source.approvedRelationshipTemplates,
);
const prompts = PromptEntrySchema.array().parse(atomicIngredients);
const relationships =
  RelationshipTemplateSchema.array().parse(atomicRelationships);
const aliases: Readonly<Record<string, string>> = atomicAliases;
const byId = new Map<string, PromptEntry>(
  prompts.map((entry) => [entry.id, entry]),
);
const relById = new Map<string, RelationshipTemplate>(
  relationships.map((entry) => [entry.id, entry]),
);
const upgraded = (id: string): PromptEntry => {
  const canonicalId = aliases[id];
  const current = byId.get(canonicalId);
  if (!current)
    throw new Error(`Missing canonical alias target for ${id}: ${canonicalId}`);
  return current;
};
const templateFor = (
  entry: PromptEntry,
  templates: ReadonlyMap<string, RelationshipTemplate>,
) =>
  entry.relationshipTemplateId
    ? templates.get(entry.relationshipTemplateId)
    : undefined;

test("2.7 is a complete, explicitly approved independent bank", () => {
  expect(prompts.length).toBeGreaterThan(500);
  expect(review.sourcePackVersion).toBe("2.6.1");
  expect(review.targetPackVersion).toBe("2.7.0");
  expect(review.approvedEntries).toEqual(atomicIngredients);
  expect(review.approvedValues).toEqual(
    prompts.map(({ id, category, text, version }) => ({
      id,
      category,
      text,
      version,
    })),
  );
  expect(review.reviewedIngredientIds).toEqual(prompts.map((p) => p.id));
  expect(review.approvedRelationshipTemplates).toEqual(atomicRelationships);
  expect(review.reviewedRelationshipTemplateIds).toEqual(
    relationships.map((r) => r.id),
  );
  expect(review.decisions).toHaveLength(1326);
  expect(review.relationshipDecisions).toHaveLength(96);
  expect(
    atomicIngredients.every((entry) =>
      ["grounded", "playful"].includes(entry.flavor),
    ),
  ).toBe(true);
  for (const entry of prompts) {
    expect(PromptEntrySchema.safeParse(entry).success, entry.id).toBe(true);
    expect(["grounded", "playful"]).toContain(entry.flavor);
    expect(entry.tags).not.toContain("advice_problem");
    expect(entry.tags).not.toContain("party_seed");
    expect(entry.tags).not.toContain("party_advice");
  }
  for (const entry of relationships)
    expect(RelationshipTemplateSchema.safeParse(entry).success, entry.id).toBe(
      true,
    );
});

test("every 2.6.1 ingredient has a direct same-category alias, with cast-safe relationships", () => {
  expect(Object.keys(aliases).sort()).toEqual(
    sourcePrompts.map((p) => p.id).sort(),
  );
  for (const old of sourcePrompts) {
    const current = upgraded(old.id);
    expect(current, old.id).toBeDefined();
    expect(current?.category, old.id).toBe(old.category);
    if (old.category === "relationship") {
      expect(current.minPlayers).toBe(old.minPlayers);
      expect(current.maxPlayers).toBe(old.maxPlayers);
      const template = templateFor(current, relById);
      expect(template?.premise).toBe(current.text);
      expect(template?.minPlayers).toBe(current.minPlayers);
      expect(template?.maxPlayers).toBe(current.maxPlayers);
    }
    const decision = review.decisions.find((d) => d.id === old.id);
    expect(decision?.canonicalId).toBe(current.id);
    expect(decision?.sourceText).toBe(old.text);
  }
});

test("archives preserve every changed text, identity or role mapping with one atomic reference", () => {
  const oldTemplates = new Map<string, RelationshipTemplate>(
    sourceRelationships.map((r) => [r.id, r]),
  );
  const expectedIds: string[] = [];
  for (const old of sourcePrompts) {
    const current = upgraded(old.id);
    expect(current, old.id).toBeDefined();
    if (!current) continue;
    const oldRel = templateFor(old, oldTemplates);
    const newRel = templateFor(current, relById);
    const rolesChanged =
      oldRel &&
      (JSON.stringify(oldRel.namedRoles) !==
        JSON.stringify(newRel?.namedRoles) ||
        oldRel.expandableRole !== newRel?.expandableRole);
    if (old.text === current.text && old.id === current.id && !rolesChanged)
      continue;
    expectedIds.push(old.id);
    const archived = archive.find((a) => a.source.id === old.id);
    expect(archived?.originalText).toBe(old.text);
    expect(archived?.source).toEqual({
      id: old.id,
      category: old.category,
      version: old.version,
      packVersion: "2.6.1",
    });
    expect(archived?.ingredients).toEqual([
      { category: old.category, id: current.id, version: current.version },
    ]);
    if (oldRel) {
      expect(archived?.originalRoles).toEqual(oldRel.namedRoles);
      expect(archived?.originalExpandableRole).toBe(oldRel.expandableRole);
    }
  }
  expect(archive.map((a) => a.source.id).sort()).toEqual(expectedIds.sort());
});

test("canonical values are unique within category and compatible cast, without artificial quotas", () => {
  const keys = prompts.map(
    (p) =>
      `${p.category}:${p.category === "relationship" ? `${p.minPlayers}-${p.maxPlayers}:` : ""}${p.text.toLowerCase()}`,
  );
  expect(new Set(keys).size).toBe(prompts.length);
  expect(prompts.length).toBeLessThan(1326);
  const categories = new Set(sourcePrompts.map((p) => p.category));
  for (const category of categories)
    for (let players = 2; players <= 12; players++)
      expect(
        prompts.some(
          (p) =>
            p.category === category &&
            p.minPlayers <= players &&
            p.maxPlayers >= players &&
            p.contentRating === "clean",
        ),
        `${category}/${players}`,
      ).toBe(true);
});

test("specific bundled premises become neutral cores, never hidden relationship or prop choices", () => {
  expect(upgraded("prompt_situation_3101")?.text).toBe(
    "Something was left behind. Nobody will admit it's theirs.",
  );
  expect(upgraded("prompt_situation_3101")?.contentRating).toBe("clean");
  expect(upgraded("prompt_situation_2102")?.text).not.toMatch(
    /meet|first time/i,
  );
  expect(upgraded("prompt_situation_2100")?.text).not.toMatch(
    /meeting|equal standing/i,
  );
  expect(upgraded("prompt_action_001")?.text).toBe("Repairing");
  expect(upgraded("prompt_action_016")?.text).toBe("Untangling");
  expect(upgraded("prompt_action_048")?.id).toBe(
    upgraded("prompt_action_001")?.id,
  );
  expect(upgraded("prompt_role_030")?.text).toBe("Creator");
  expect(upgraded("prompt_role_073")?.text).toBe("Manipulator");
  expect(upgraded("prompt_role_055").id).toBe(upgraded("prompt_role_052").id);
  expect(upgraded("prompt_role_055").text).toBe("Questioner");
  expect(upgraded("prompt_situation_045").text).toBe(
    "Someone has been mistaken for a much more important person.",
  );
  expect(upgraded("prompt_object_069")?.text).toBe("A written complaint");
  expect(upgraded("prompt_opening_line_3004")?.text).toBe(
    "I have been trying to tell you about a very inconvenient crush.",
  );
  for (const label of [
    "Partners",
    "Ex-partners",
    "Casual partners",
    "Newly dating",
  ])
    expect(relationships.some((r) => r.premise === label)).toBe(true);
  expect(
    prompts.some((p) => p.category === "object" && p.text === "A toothbrush"),
  ).toBe(true);
});

test("mature and spicy material is honestly rated and advice/performance originals remain historical only", () => {
  expect(
    prompts
      .filter(
        (entry) =>
          entry.category === "profession" &&
          entry.contentRating === "mature_suggestive",
      )
      .map((entry) => entry.text),
  ).toEqual([
    "Sex therapist",
    "Erotic novelist",
    "Burlesque performer",
    "Adult-store clerk",
    "Adult-film director",
  ]);
  expect(
    prompts
      .filter(
        (entry) =>
          entry.category === "opening_line" &&
          entry.contentRating === "mature_suggestive",
      )
      .map((entry) => entry.text),
  ).toEqual([
    "That sounded a lot more sexual than I intended.",
    "I did not mean for everyone to hear that fantasy.",
    "I meant that as a sexual confession, not a practical suggestion.",
  ]);
  expect(upgraded("prompt_profession_3102").text).toBe(
    "Film-set intimacy coordinator",
  );
  for (const rating of ["spicy", "mature_suggestive"])
    expect(
      prompts.filter(
        (p) => p.category === "situation" && p.contentRating === rating,
      ).length,
    ).toBeGreaterThanOrEqual(6);
  for (const decision of review.decisions) {
    if (
      decision.disposition !== "historical_game_input" &&
      decision.disposition !== "historical_performance_constraint"
    )
      continue;
    expect(archive.some((a) => a.source.id === decision.id)).toBe(true);
    expect(upgraded(decision.id)?.text).not.toBe(decision.sourceText);
  }
  expect(
    review.decisions.filter((d) => d.disposition === "historical_game_input"),
  ).toHaveLength(60);
  for (const entry of prompts.filter((p) => p.tags.includes("takes_object")))
    expect(entry.category).toBe("action");
});

test("every flagged decision is treated and every changed canonical metadata record is versioned", () => {
  expect(audited.ingredientDecisions).toHaveLength(1326);
  expect(audited.relationshipTemplateDecisions).toHaveLength(96);
  for (const decision of audited.ingredientDecisions) {
    expect(["keep", "rewrite", "split", "move"]).toContain(decision.decision);
    const current = upgraded(decision.id);
    if (decision.decision !== "keep")
      expect(current?.text, decision.id).not.toBe(decision.text);
  }
  for (const current of prompts) {
    const old = source.approvedEntries.find((p) => p.id === current.id);
    if (!old) {
      expect(Number(current.id.split("_").at(-1))).toBeGreaterThanOrEqual(4000);
      continue;
    }
    if (!isDeepStrictEqual(old, current))
      expect(current.version, current.id).toBeGreaterThan(old.version);
  }
  for (const number of [2082, 2088, 2096, 2108, 2123, 2131]) {
    const current = upgraded(`prompt_situation_${number}`);
    expect(current?.text).not.toMatch(
      /must remain seated|only hand movements|must be recalled|must be a surprise|work must finish|noise must be/i,
    );
  }
});

test("a normal authoring rerun is hash-stable across Python hash seeds and never reapproves drift", () => {
  const files = [
    "content/editorial/ingredient-purity-2.3.0.json",
    "content/editorial/ingredient-purity-2.4.0.json",
    "content/editorial/ingredient-purity-2.5.0.json",
    "content/editorial/ingredient-purity-2.6.0.json",
    "content/editorial/ingredient-purity-2.6.1.json",
    "content/editorial/atomic-authoring-2.7.0.json",
    "content/editorial/atomic-audit-2.7.0.json",
    "content/editorial/ingredient-purity-2.7.0.json",
    "src/content/v2/ingredients.json",
    "src/content/v2/party-ingredients.json",
    "src/content/v2/party-expansion-2.6.json",
    "src/content/v2/relationships.json",
    "src/content/v2/atomic-ingredients-2.7.json",
    "src/content/v2/atomic-relationships-2.7.json",
    "src/content/v2/atomic-aliases-2.7.json",
    "src/content/v2/atomic-archive-2.7.json",
  ];
  const hashes = () =>
    files.map((file) =>
      createHash("sha256")
        .update(readFileSync(resolve(process.cwd(), file)))
        .digest("hex"),
    );
  const before = hashes();
  for (const seed of ["0", "1"]) {
    const result = spawnSync("python3", ["scripts/apply-atomic-review.py"], {
      cwd: process.cwd(),
      encoding: "utf8",
      env: { ...process.env, PYTHONHASHSEED: seed },
    });
    expect(result.status, result.stderr).toBe(0);
    expect(hashes()).toEqual(before);
  }
  const drift = spawnSync(
    "python3",
    [
      "-c",
      [
        "import runpy",
        "m = runpy.run_path('scripts/apply-atomic-review.py')",
        "review = m['load'](m['APPROVAL_PATH'])",
        "review['policy'] = 'unapproved drift'",
        "m['verify_approval'](review)",
      ].join("\n"),
    ],
    { cwd: process.cwd(), encoding: "utf8" },
  );
  expect(drift.status).not.toBe(0);
  expect(drift.stderr).toContain("--approve-atomic-ingredients");
  expect(hashes()).toEqual(before);
});
