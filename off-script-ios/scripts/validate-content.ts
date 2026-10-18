import review from "../content/editorial/ingredient-purity-2.7.0.json";
import priorReview from "../content/editorial/ingredient-purity-2.6.1.json";
import {
  activities,
  advicePrompts,
  categories,
  curatedScenes,
  goals,
  ingredientAliases,
  libraryExpansionPrompts,
  PACK,
  prompts,
  quirks,
  relationships,
  resolveIngredientId,
  sourcePrompts,
  sourceRelationships,
  topics,
} from "../src/domain/content";
import {
  PromptEntrySchema,
  RelationshipTemplateSchema,
} from "../src/domain/contracts";
import { gamePromptOptions } from "../src/domain/game-prompts";
import { adviceRequests } from "../src/domain/party-advice";
import { activityExperiences, partyRecipes } from "../src/domain/party-recipes";
import { partyGuidance } from "../src/domain/playbooks";
import { relationshipRoleText } from "../src/domain/roles";
import { promptRecipes } from "../src/domain/library";

function assert(value: unknown, message: string): asserts value {
  if (!value) throw Error(message);
}
assert(
  PACK === "2.8.0" && review.targetPackVersion === "2.7.0",
  "The additive live bank must retain the frozen 2.7 approval.",
);
assert(activities.length === 39, "Must include all 39 activities.");
for (const [family, count] of Object.entries({
  punchline: 6,
  performance: 11,
  scene: 9,
  drill: 8,
  social: 5,
}))
  assert(
    activities.filter((activity) => activity.family === family).length ===
      count,
    `Wrong ${family} count.`,
  );

for (const pool of [activities, prompts, relationships, topics, goals, quirks])
  assert(
    new Set(pool.map((entry) => entry.id)).size === pool.length,
    "Duplicate content ID.",
  );
for (const category of categories) {
  const pool = prompts.filter((entry) => entry.category === category);
  assert(pool.length > 0, `The ${category} category is empty.`);
  assert(
    new Set(
      pool.map(
        (entry) =>
          `${category === "relationship" ? `${entry.minPlayers}-${entry.maxPlayers}:` : ""}${entry.text.toLowerCase().replace(/\s+/g, " ").trim()}`,
      ),
    ).size === pool.length,
    `Duplicate canonical ${category} wording.`,
  );
  for (let count = 2; count <= 12; count++)
    assert(
      pool.some(
        (entry) =>
          entry.contentRating === "clean" &&
          entry.minPlayers <= count &&
          entry.maxPlayers >= count,
      ),
      `No independent Clean ${category} for ${count} people.`,
    );
}
assert(
  !prompts.some((entry) => entry.tags.includes("party_advice")),
  "Complete advice requests must not enter the atomic pool.",
);
assert(
  !prompts.some((entry) =>
    /scenario \d+|placeholder|lorem ipsum/i.test(entry.text),
  ),
  "Placeholder content.",
);
assert(
  topics.length >= 160 && topics.every((topic) => topic.plural),
  "Joke topics require authored plurals.",
);
assert(
  goals.length >= 60 && quirks.length >= 40,
  "Private game inputs must be retained.",
);

assert(
  JSON.stringify(sourcePrompts) ===
    JSON.stringify(
      priorReview.approvedEntries.map((entry) =>
        PromptEntrySchema.parse(entry),
      ),
    ),
  "The complete historical 2.6.1 ingredient source was changed.",
);
assert(
  JSON.stringify(sourceRelationships) ===
    JSON.stringify(
      priorReview.approvedRelationshipTemplates.map((entry) =>
        RelationshipTemplateSchema.parse(entry),
      ),
    ),
  "Historical relationship templates were changed.",
);
assert(
  JSON.stringify(prompts) ===
    JSON.stringify([
      ...review.approvedEntries.map((entry) => PromptEntrySchema.parse(entry)),
      ...libraryExpansionPrompts,
    ]),
  "Atomic ingredients differ from their complete approval.",
);
assert(
  JSON.stringify(prompts.map((entry) => entry.id)) ===
    JSON.stringify([
      ...review.reviewedIngredientIds,
      ...libraryExpansionPrompts.map((entry) => entry.id),
    ]),
  "Every live atomic ingredient needs an explicit review.",
);
assert(
  libraryExpansionPrompts.length === 60,
  "The 2.8 addition must include all 60 authored entries.",
);
for (const entry of libraryExpansionPrompts)
  assert(
    ["action", "situation"].includes(entry.category) &&
      entry.contentRating !== "clean" &&
      entry.tags.includes("comic_28") &&
      !entry.tags.includes("party_advice"),
    `Unexpected 2.8 library input: ${entry.id}.`,
  );
assert(
  promptRecipes.length === 14,
  "All 14 explicit prompt recipes must remain available.",
);
assert(
  JSON.stringify(relationships) ===
    JSON.stringify(
      review.approvedRelationshipTemplates.map((entry) =>
        RelationshipTemplateSchema.parse(entry),
      ),
    ),
  "Atomic role templates differ from their complete approval.",
);
assert(
  JSON.stringify(relationships.map((entry) => entry.id)) ===
    JSON.stringify(review.reviewedRelationshipTemplateIds),
  "Every live relationship template needs an explicit review.",
);

const byId = new Map(prompts.map((entry) => [entry.id, entry]));
for (const before of sourcePrompts) {
  assert(
    ingredientAliases[before.id],
    `Missing reviewed source mapping: ${before.id}.`,
  );
  const current = byId.get(resolveIngredientId(before.id));
  assert(
    current && current.category === before.category,
    `Invalid same-category mapping: ${before.id}.`,
  );
  if (before.id !== current.id || before.text !== current.text)
    assert(
      curatedScenes.some(
        (entry) =>
          entry.source.id === before.id &&
          entry.originalText === before.text &&
          entry.ingredients.some(
            (reference) =>
              reference.category === before.category &&
              reference.id === current.id,
          ),
      ),
      `Missing exact historical original: ${before.id}.`,
    );
  if (before.id === current.id && before.text !== current.text)
    assert(
      current.version > before.version,
      `Unversioned wording change: ${before.id}.`,
    );
}
for (const example of curatedScenes) {
  assert(example.originalText.length > 0, "Missing archived text.");
  assert(
    new Set(example.ingredients.map((reference) => reference.category)).size ===
      example.ingredients.length,
    `An archived example duplicates a category: ${example.id}.`,
  );
  for (const reference of example.ingredients) {
    const current = byId.get(reference.id);
    assert(
      current &&
        current.category === reference.category &&
        current.version === reference.version,
      `Broken archived reference: ${example.id}/${reference.id}.`,
    );
  }
}
for (const entry of prompts.filter(
  (entry) => entry.category === "relationship",
)) {
  const template = relationships.find(
    (template) => template.id === entry.relationshipTemplateId,
  );
  assert(
    template &&
      template.premise === entry.text &&
      template.minPlayers === entry.minPlayers &&
      template.maxPlayers === entry.maxPlayers,
    `Missing or mismatched independent roles: ${entry.id}.`,
  );
}
for (const template of relationships)
  for (let count = template.minPlayers; count <= template.maxPlayers; count++)
    assert(
      new Set(
        Array.from({ length: count }, (_, index) =>
          relationshipRoleText(template, index),
        ),
      ).size === count,
      `Duplicate expanded roles: ${template.id}/${count}.`,
    );

assert(
  advicePrompts.length === 60 &&
    advicePrompts.length === Object.keys(adviceRequests).length,
  "All 60 complete advice problems and their metadata must be retained.",
);
for (const problem of advicePrompts) {
  const request = adviceRequests[problem.id];
  assert(
    request?.question.endsWith("?") &&
      request.example.startsWith("You should "),
    `Missing complete advice task: ${problem.id}.`,
  );
  assert(
    !prompts.some(
      (entry) => entry.id === problem.id && entry.text === problem.text,
    ),
    `A complete advice problem leaked into atomic generation: ${problem.id}.`,
  );
}
const forbiddenSituations = [
  "You and a casual partner both pretend not to have left a toothbrush behind.",
  "Everyone is meeting for the first time",
  "Everyone in the meeting has equal standing",
  "The train is imaginary",
  "Two neighbors are both sure the plant belongs to them",
];
for (const text of forbiddenSituations)
  assert(
    !prompts.some(
      (entry) => entry.category === "situation" && entry.text === text,
    ),
    `An audited bundled/constraint situation is still live: ${text}`,
  );
assert(
  prompts.some(
    (entry) =>
      entry.category === "situation" &&
      entry.text ===
        "Something was left behind. Nobody will admit it's theirs." &&
      entry.contentRating === "clean",
  ),
  "The rejected example needs its neutral, honestly rated core.",
);

assert(
  new Set(partyRecipes.map((recipe) => recipe.pattern)).size === 9,
  "Missing Party participation patterns.",
);
assert(
  Object.keys(activityExperiences).length === 39,
  "Missing game experience metadata.",
);
for (const recipe of partyRecipes) {
  const guidance = partyGuidance({ id: recipe.activityId });
  assert(
    /\d/.test(guidance.roundLimit) &&
      guidance.participation &&
      /keep (going|playing)/i.test(guidance.finish),
    `Missing optional Party guidance: ${recipe.activityId}.`,
  );
}
for (const activity of activities)
  for (const intent of ["riff", "practice"] as const)
    for (const level of ["clean", "spicy", "18_plus"] as const) {
      const options = gamePromptOptions(activity.id, intent, level);
      for (const category of options.categories)
        assert(
          options.pool.some((entry) => entry.category === category),
          `No input for ${activity.id}/${intent}/${level}/${category}.`,
        );
      if (activity.id !== "P5")
        assert(
          !options.pool.some((entry) => entry.tags.includes("party_advice")),
          `Advice leakage into ${activity.id}.`,
        );
    }

console.log(
  JSON.stringify(
    {
      pack: PACK,
      games: activities.length,
      atomicIngredients: prompts.length,
      relationships: relationships.length,
      completeAdviceProblems: advicePrompts.length,
      preservedSourceIngredients: sourcePrompts.length,
      archivedOriginals: curatedScenes.length,
      partyRecipes: partyRecipes.length,
      promptLibraryRecipes: promptRecipes.length,
      byCategory: Object.fromEntries(
        categories.map((category) => [
          category,
          prompts.filter((entry) => entry.category === category).length,
        ]),
      ),
    },
    null,
    2,
  ),
);
console.log(
  "Independent banks, source mappings, exact archives, roles and game-specific input boundaries validated.",
);
