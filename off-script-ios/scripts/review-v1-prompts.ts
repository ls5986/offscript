import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";
import {
  activities,
  advicePrompts,
  PACK,
  prompts,
  relationships,
  resolveIngredientId,
  sourcePrompts,
} from "../src/domain/content";
import {
  PromptCategorySchema,
  UserPreferencesSchema,
  type PromptSnapshot,
} from "../src/domain/contracts";
import {
  composeScene,
  upgradeSnapshotIngredients,
} from "../src/domain/composer";
import { gamePromptOptions } from "../src/domain/game-prompts";
import { isQuickGame, responseStarter } from "../src/domain/gameplay";
import { adviceFor } from "../src/domain/party-advice";
import {
  appendPartyCard,
  makePartySession,
  partyPromptText,
} from "../src/domain/party";
import {
  PartyOptionsSchema,
  type PartyLevel,
} from "../src/domain/party-contracts";
import { partyRecipes } from "../src/domain/party-recipes";
import { emptyPrompt, generatePrompt } from "../src/domain/prompts";
import { seededRng } from "../src/domain/random";
import { relationshipRoleText } from "../src/domain/roles";
import { currentRound, makeSession } from "../src/domain/session";

const output = resolve(process.argv[2] ?? "docs/prompt-review");
mkdirSync(output, { recursive: true });
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw Error(message);
}
const approvalSchema = z.object({
  approvedValues: z.array(
    z.object({
      id: z.string(),
      category: PromptCategorySchema,
      text: z.string(),
      version: z.number(),
    }),
  ),
});
const approvals = ["2.3.0", "2.4.0", "2.5.0", "2.6.0", "2.6.1", "2.7.0"].map(
  (version) => ({
    version,
    ...approvalSchema.parse(
      JSON.parse(
        readFileSync(
          `content/editorial/ingredient-purity-${version}.json`,
          "utf8",
        ),
      ),
    ),
  }),
);
type Sample = {
  route: string;
  game: string;
  gameName: string;
  tone: string;
  players: number;
  seed: number;
  input: string;
  starter: string;
  roles: string;
  adviceQuestion: string;
  composition: string;
  supportRole: string;
};
const samples: Sample[] = [];
const delivery: Record<
  string,
  { cards: number; entryRatings: Record<string, number> }
> = {};
let generationChecks = 0;
const now = "2026-10-17T20:00:00.000Z";
function check(snapshot: PromptSnapshot, level: PartyLevel) {
  generationChecks++;
  for (const entry of Object.values(snapshot.entries)) {
    const source = [...prompts, ...advicePrompts].find(
      (prompt) => prompt.id === entry.id && prompt.text === entry.text,
    );
    assert(source, `Unknown current prompt ${entry.id}`);
    assert(source.text === entry.text, `Rewritten current value ${entry.id}`);
    assert(
      level !== "clean" || source.contentRating === "clean",
      `Clean boundary ${entry.id}`,
    );
    assert(
      entry.sourceVersion === source.version,
      `Wrong source version ${entry.id}`,
    );
  }
  const roles =
    snapshot.relationship?.assignments.map(
      (assignment) => assignment.roleText,
    ) ?? [];
  assert(
    new Set(roles).size === roles.length,
    "Duplicate generated role labels",
  );
  const composition = composeScene(snapshot)?.text ?? "";
  assert(
    !/\bwith (?:a|an) (?:your|my|i |you )|\bin a bridge\b/i.test(composition),
    "Malformed reviewed composition",
  );
}
function record(
  route: string,
  game: string,
  tone: string,
  players: number,
  seed: number,
  snapshot: PromptSnapshot,
  input?: string,
  supportRole = "",
) {
  samples.push({
    route,
    game,
    gameName:
      game === "studio"
        ? "Prompt Studio"
        : (activities.find((activity) => activity.id === game)?.title ?? game),
    tone,
    players,
    seed,
    input:
      input ??
      Object.entries(snapshot.entries)
        .map(([key, value]) => `${key}: ${value.text}`)
        .join(" / "),
    starter: isQuickGame(game) ? responseStarter(game, snapshot) : "",
    roles:
      snapshot.relationship?.assignments
        .map((assignment) => assignment.roleText)
        .join(" / ") ?? "",
    adviceQuestion: game === "P5" ? (adviceFor(snapshot)?.question ?? "") : "",
    composition: composeScene(snapshot)?.text ?? "",
    supportRole,
  });
}
for (const level of ["clean", "spicy", "18_plus"] as const) {
  for (const recipe of partyRecipes.filter(
    (recipe) => recipe.level === level,
  )) {
    for (const players of [2, 6]) {
      if (typeof recipe.performers === "number" && recipe.performers > players)
        continue;
      for (let seed = 0; seed < 30; seed++) {
        let session = makePartySession(
          players,
          UserPreferencesSchema.parse({}),
          [],
          PartyOptionsSchema.parse({
            level,
            adultsConfirmedAt: level === "18_plus" ? now : null,
            movement: true,
          }),
          randomUUID,
          seed,
        );
        session = appendPartyCard(session, randomUUID, now, {
          recipeId: recipe.id,
        });
        const round = currentRound(session);
        const delivered = (delivery[level] ??= {
          cards: 0,
          entryRatings: {},
        });
        delivered.cards++;
        for (const entry of Object.values(round.promptSnapshot.entries)) {
          const rating = entry.contentRating ?? "unknown";
          delivered.entryRatings[rating] =
            (delivered.entryRatings[rating] ?? 0) + 1;
        }
        if (recipe.activityId === "G2") {
          assert(
            players >= 3 &&
              round.performerIds.length >= 2 &&
              round.performerIds.length <= 4 &&
              round.supportingPlayerIds.length === 1,
            "New Choice requires 2-4 actors and a separate caller",
          );
          assert(
            round.schedule.length === 0,
            "New Choice still schedules automatic interruptions",
          );
        }
        check(round.promptSnapshot, level);
        if (seed < 2)
          record(
            "Party",
            recipe.activityId,
            level,
            players,
            seed,
            round.promptSnapshot,
            partyPromptText(round),
            recipe.activityId === "G2"
              ? "Separate human caller; manual bell button"
              : recipe.activityId === "G8"
                ? "Separate interviewer"
                : "",
          );
      }
    }
  }
}
for (const intent of ["riff", "practice"] as const) {
  for (const mature of [false, true]) {
    for (const activity of activities.filter(
      (activity) => mature || activity.contentRating === "clean",
    )) {
      for (let seed = 0; seed < 10; seed++) {
        const session = makeSession(
          activity.minPlayers,
          "surprise",
          UserPreferencesSchema.parse({ matureOptIn: mature }),
          randomUUID,
          seed,
          [],
          activity.id,
          undefined,
          intent,
        );
        const snapshot = currentRound(session).promptSnapshot;
        if (activity.id === "G2") {
          assert(
            currentRound(session).supportingPlayerIds.length === 1 &&
              currentRound(session).performerIds.length >= 2 &&
              currentRound(session).schedule.length === 0,
            "Individual New Choice lacks a separate manual caller",
          );
        }
        const level = mature ? "18_plus" : "clean";
        check(snapshot, level);
        if (!seed)
          record(
            `Individual ${intent}`,
            activity.id,
            level,
            activity.minPlayers,
            seed,
            snapshot,
            undefined,
            activity.id === "G2"
              ? "Separate human caller; manual bell button"
              : "",
          );
      }
    }
  }
}
for (const combine of [false, true]) {
  for (const seed of [1, 2, 4, 17, 42]) {
    const snapshot = generatePrompt(
      {
        categories: [
          "relationship",
          "location",
          "profession",
          "emotion",
          "action",
        ],
        count: 2,
        style: "coherent",
        flavor: "grounded",
        compositionEnabled: combine,
      },
      seededRng(seed),
    ).snapshot;
    check(snapshot, "clean");
    assert(
      combine || !snapshot.composition,
      "Ingredients-only Studio composed a scene",
    );
    record(
      `Studio ${combine ? "combined" : "ingredients"}`,
      "studio",
      "clean",
      2,
      seed,
      snapshot,
    );
  }
}
const distributions: Record<
  string,
  { draws: number; unique: number; immediateRepeats: number; values: string[] }
> = {};
for (const level of ["clean", "spicy", "18_plus"] as const) {
  let previous: PromptSnapshot | undefined;
  let usage = {};
  const values = new Set<string>();
  let repeats = 0;
  for (let seed = 0; seed < 100; seed++) {
    const result = generatePrompt(
      {
        ...gamePromptOptions("P4", "riff", level),
        count: 2,
        style: "coherent",
        contentLevel: level,
        previous,
        usage,
      },
      seededRng(seed),
    );
    const entry = result.snapshot.entries.profession;
    if (entry.id === previous?.entries.profession.id) repeats++;
    values.add(entry.text);
    check(result.snapshot, level);
    previous = result.snapshot;
    usage = result.usage;
  }
  assert(repeats === 0, `Immediate profession repeats at ${level}`);
  distributions[level] = {
    draws: 100,
    unique: values.size,
    immediateRepeats: repeats,
    values: [...values],
  };
}
let roleChecks = 0;
for (const template of relationships)
  for (let count = template.minPlayers; count <= template.maxPlayers; count++) {
    const roles = Array.from({ length: count }, (_, index) =>
      relationshipRoleText(template, index),
    );
    assert(
      new Set(roles).size === count,
      `${template.id}: repeated roles at ${count}`,
    );
    roleChecks++;
  }
const history = approvals.map((approval) => {
  const previous = approval.approvedValues.find(
    (entry) => entry.id === "prompt_location_027",
  )!;
  const snapshot: PromptSnapshot = {
    ...emptyPrompt(),
    contentPackVersion: approval.version,
    entries: {
      location: {
        id: previous.id,
        text: previous.text,
        locked: true,
        sourceVersion: previous.version,
        sourcePackVersion: approval.version,
      },
    },
  };
  const retained = generatePrompt(
    {
      categories: ["location"],
      count: 2,
      style: "coherent",
      previous: snapshot,
    },
    seededRng(1),
  ).snapshot;
  assert(
    JSON.stringify(retained.entries.location) ===
      JSON.stringify(snapshot.entries.location),
    `Locked ${approval.version} original changed`,
  );
  const upgraded = upgradeSnapshotIngredients({
    ...snapshot,
    entries: { location: { ...snapshot.entries.location, locked: false } },
  });
  return {
    pack: approval.version,
    text: previous.text,
    version: previous.version,
    lockedExact: true,
    explicitUpgradeText: upgraded.entries.location.text,
  };
});
const changed = approvals.slice(1).map((approval, index) => {
  const old = new Map(
    approvals[index].approvedValues.map((entry) => [entry.id, entry]),
  );
  const currentIds = new Set(approval.approvedValues.map((entry) => entry.id));
  return {
    from: approvals[index].version,
    to: approval.version,
    addedEntries: approval.approvedValues.filter((entry) => !old.has(entry.id))
      .length,
    retiredEntries: [...old.keys()].filter((id) => !currentIds.has(id)).length,
    textChanges: approval.approvedValues.filter(
      (entry) => old.has(entry.id) && old.get(entry.id)?.text !== entry.text,
    ).length,
    versionChanges: approval.approvedValues.filter(
      (entry) =>
        old.has(entry.id) && old.get(entry.id)?.version !== entry.version,
    ).length,
  };
});
const columns: (keyof Sample)[] = [
  "route",
  "game",
  "gameName",
  "tone",
  "players",
  "seed",
  "input",
  "starter",
  "roles",
  "adviceQuestion",
  "composition",
  "supportRole",
];
const csv = (value: unknown) => `"${String(value).replaceAll('"', '""')}"`;
writeFileSync(
  resolve(output, "samples.csv"),
  [
    columns.map(csv).join(","),
    ...samples.map((sample) =>
      columns.map((column) => csv(sample[column])).join(","),
    ),
  ].join("\n") + "\n",
);
const measurements = {
  pack: PACK,
  generationChecks,
  roleChecks,
  sampleRows: samples.length,
  changed,
  history,
  professionDistributions: distributions,
  partyMaterialDelivery: delivery,
  atomicSeparation: {
    independentIngredients: prompts.length,
    completeAdviceProblems: advicePrompts.length,
    preservedSourceIngredients: sourcePrompts.length,
    redirectedSourceIds: sourcePrompts.filter(
      (entry) => resolveIngredientId(entry.id) !== entry.id,
    ).length,
    rewrittenSourceTexts: sourcePrompts.filter(
      (entry) =>
        prompts.find((current) => current.id === resolveIngredientId(entry.id))
          ?.text !== entry.text,
    ).length,
  },
};
writeFileSync(
  resolve(output, "measurements.json"),
  JSON.stringify(measurements, null, 2) + "\n",
);
const table = (value: string) =>
  value.replaceAll("|", "\\|").replaceAll("\n", " ");
writeFileSync(
  resolve(output, "REVIEW.md"),
  [
    `# V1 prompt review - content ${PACK}`,
    "",
    "Deterministic review of actual Party and individual game generation, plus Studio output modes. This verifies task shape, source text/version, rating boundaries, role uniqueness and representative grammar; it does not establish whether real people find the jokes funny.",
    "",
    `**Results:** ${generationChecks} generation checks, ${roleChecks} template/count uniqueness checks, and ${samples.length} representative rows. All executed assertions passed.`,
    "",
    "## Content pack comparisons",
    "",
    "| From | To | Added entries | Retired from fresh draws | Changed existing texts | Changed existing versions |",
    "|---|---|---:|---:|---:|---:|",
    ...changed.map(
      (row) =>
        `| ${row.from} | ${row.to} | ${row.addedEntries} | ${row.retiredEntries} | ${row.textChanges} | ${row.versionChanges} |`,
    ),
    "",
    "Historical comparison uses the immutable approved 2.3/2.4/2.5/2.6/2.6.1 records and the separate 2.7 atomic approval, not a claim that old Expo apps were run. Current generation is executed. Locks from all six packs remain exact; known detailed originals upgrade only through the explicit editable-copy action. Retired IDs redirect only new/explicitly upgraded generation; saved originals are not deleted or rewritten.",
    "",
    `The current shared bank contains **${prompts.length} independent ingredients**. All **${sourcePrompts.length} historical source ingredients** remain available for provenance. **${advicePrompts.length} complete advice problems** are routed only to their game input pool, not treated as atomic Situations.`,
    "",
    "| Saved pack | Exact original | Locked retained | Explicit upgrade result |",
    "|---|---|---|---|",
    ...history.map(
      (row) =>
        `| ${row.pack} | ${table(row.text)} | yes | ${table(row.explicitUpgradeText)} |`,
    ),
    "",
    "## Clean / Spicy / 18+ variants",
    "",
    "- Clean Party/individual checks reject spicy source entries. Classroom and group consent are separately exercised by the browser suite.",
    "- Higher levels prefer the strongest reviewed material eligible for the category and actual cast. A neutral rewritten core can honestly be Clean; no adult quota or relabeling is used. Full advice problems retain their source ratings.",
    "- When a matching input exists, the selected level takes priority on cold start, same-game rounds, rerolls and shuffling. A lower-rated compatible scaffold remains available when that category/cast has no stronger input. Explicitly requested lower-rated recipe IDs remain readable for saved compatibility.",
    "- The adult analogy game intentionally uses ordinary clean nouns. Its sentence frame, not a sexual noun bank, supplies the format.",
    "- Individual games expose Clean versus consenting-adult preference, not a separate Spicy UI switch. Studio's new generation remains Clean; imported snapshots retain their provenance and classroom checks.",
    "- A higher content level is not permission for disclosures, dares, personal targeting or graphic material.",
    "",
    "| World’s Worst level | Draws | Distinct jobs | Immediate repeats |",
    "|---|---:|---:|---:|",
    ...Object.entries(distributions).map(
      ([level, row]) =>
        `| ${level} | ${row.draws} | ${row.unique} | ${row.immediateRepeats} |`,
    ),
    "",
    "The pre-v1 Party policy restricted Clean draws to 13 playful jobs and excluded 50 grounded jobs. V1 uses a reviewed familiarity subset rather than claiming every profession is equally accessible. Small Spicy pools still have a shorter repeat horizon; zero immediate repeats is not proof of endless novelty.",
    "",
    "## Representative current outputs",
    "",
    "| Route | Game | Tone | Input | Starter / request |",
    "|---|---|---|---|---|",
    ...samples
      .filter(
        (sample) =>
          sample.seed === 0 &&
          sample.players === 2 &&
          ["P1", "P2", "P4", "P5", "P6", "G8", "T2"].includes(sample.game),
      )
      .slice(0, 24)
      .map(
        (sample) =>
          `| ${sample.route} | ${sample.gameName} | ${sample.tone} | ${table(sample.input)} | ${table(sample.adviceQuestion || sample.starter)} |`,
      ),
    "",
    "## Streamlined play cards",
    "",
    "Optional opening-line hints have been removed from Party, individual games and help. New snapshots do not capture them; older saved values remain readable but are not displayed. Detailed Party directions, advice examples and suggested starting lengths live in How to Play. Cards retain prompts, roles, playable frames and live controls. Groups can keep playing beyond the suggestions; no mandatory stopping paragraph appears on the card.",
    "",
    "## Editorial judgment and remaining human checks",
    "",
    "- Preserve short places and actions. The player should invent the surprising response; source inputs need not already be punchlines.",
    "- Familiar jobs and simple association objects now fit their tasks. Beginner emotion cues are easier to recognize, while advanced nuances remain available.",
    "- Role numbering is unique for every supported template/count. Existing captured role words are not silently rewritten.",
    "- Composition is optional and the reviewed bridge/clause failures are covered; this bounded review is not a guarantee of every possible sentence.",
    "- Compare three versus four Clean starter games with untrained pairs/groups; test dry/adult tone with consenting adult readers. No human study results are claimed.",
    "",
    "Full generated samples: [samples.csv](samples.csv). Reproducible counts: [measurements.json](measurements.json).",
  ].join("\n") + "\n",
);
console.log(JSON.stringify(measurements, null, 2));
