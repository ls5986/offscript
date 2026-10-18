import { composeScene, refreshComposition } from "./composer";
import {
  Category,
  categoryLabels,
  curatedScenes,
  ingredientRating,
  PACK,
  prompts,
  relationships,
  sourceRelationships,
  topics,
} from "./content";
import { Player, PlayerSchema, PromptEntry, PromptSnapshot } from "./contracts";
import { RNG, weighted } from "./random";
import { relationshipRoleText } from "./roles";
export const emptyPrompt = (): PromptSnapshot => ({
  flavor: "grounded",
  entries: {},
  relationship: null,
  jokeTopic: null,
  generationStyle: "independent",
  contentPackVersion: PACK,
});
export type Usage = Record<string, string[]>;
export function eligiblePromptPool(
  pool: PromptEntry[],
  category: Category,
  count: number,
  level?: "clean" | "spicy" | "18_plus",
): PromptEntry[] {
  let eligible = pool.filter(
    (entry) =>
      (entry.contentRating === "clean" ||
        (level !== undefined &&
          level !== "clean" &&
          (entry.contentRating === "spicy" || level === "18_plus"))) &&
      entry.category === category &&
      entry.minPlayers <= count &&
      entry.maxPlayers >= count,
  );
  if (level && level !== "clean") {
    const ratings =
      level === "18_plus"
        ? ["mature_suggestive", "spicy", "clean"]
        : ["spicy", "clean"];
    const rating = ratings.find((value) =>
      eligible.some((entry) => entry.contentRating === value),
    );
    eligible = eligible.filter((entry) => entry.contentRating === rating);
  }
  return eligible;
}
export function selectPrompt(
  pool: PromptEntry[],
  used: string[],
  rng: RNG,
  tags: string[] = [],
): PromptEntry {
  const fresh = pool.filter((p) => !used.includes(p.id));
  const available = fresh.length
    ? fresh
    : pool.filter((p) => p.id !== used.at(-1));
  return weighted(
    available.length ? available : pool,
    (p) => 1 + p.tags.filter((t) => tags.includes(t)).length * 3,
    rng,
  );
}
export function generatePrompt(
  options: {
    categories: Category[];
    count: number;
    style: "independent" | "coherent";
    previous?: PromptSnapshot | null;
    only?: Category;
    usage?: Usage;
    playerIds?: string[];
    flavor?: "playful" | "grounded";
    contentLevel?: "clean" | "spicy" | "18_plus";
    pool?: PromptEntry[];
    compositionEnabled?: boolean;
  },
  rng: RNG,
): { snapshot: PromptSnapshot; usage: Usage } {
  const { categories, count, style, previous, only } = options;
  const snapshot = structuredClone(previous ?? emptyPrompt());
  const usage = { ...options.usage };
  snapshot.generationStyle = style;
  snapshot.flavor = options.flavor ?? previous?.flavor ?? "grounded";
  if (options.compositionEnabled !== undefined)
    snapshot.compositionEnabled = options.compositionEnabled;
  for (const key of Object.keys(snapshot.entries)) {
    if (!categories.includes(key as Category)) delete snapshot.entries[key];
  }
  if (!categories.includes("relationship")) snapshot.relationship = null;
  let affinity: string[] = [];
  const retained = Object.entries(snapshot.entries)
    .filter(([key, value]) => (only ? key !== only : value.locked))
    .map(([, value]) => value);
  const anchors = [...retained];
  // Connected playful scenes need one surprising idea, not three competing jokes.
  let playfulUsed = Object.entries(snapshot.entries).some(
    ([key, value]) =>
      (only ? key !== only : value.locked) &&
      prompts.find((p) => p.id === value.id)?.flavor === "playful",
  );
  for (const entry of Object.values(snapshot.entries)) {
    if (entry.locked || only) {
      const p = prompts.find((p) => p.id === entry.id);
      if (p) affinity.push(...p.tags);
    }
  }
  const selectionOrder = [
    "location",
    "relationship",
    "situation",
    "role",
    "profession",
    "action",
    "object",
    "emotion",
    "genre",
    "opening_line",
  ] as Category[];
  for (const category of selectionOrder.filter((c) => categories.includes(c))) {
    if (only && only !== category) continue;
    const old = snapshot.entries[category];
    if (old?.locked) continue;
    const compatible = eligiblePromptPool(
      options.pool ?? prompts,
      category,
      count,
      options.contentLevel,
    );
    if (!compatible.length)
      throw Error(
        `No compatible ${categoryLabels[category].toLowerCase()} suggestions are available for ${count} people and this content level.`,
      );
    const desiredFlavor =
      snapshot.flavor === "playful" &&
      style === "coherent" &&
      (playfulUsed ||
        ((category === "location" || category === "relationship") &&
          categories.some((c) =>
            ["situation", "action", "object"].includes(c),
          )))
        ? "grounded"
        : snapshot.flavor;
    const flavored = compatible.filter((p) => p.flavor === desiredFlavor);
    // Atomic inputs are independent; soft associations must not erase the chosen flavor.
    let pool = options.pool
      ? compatible
      : flavored.length
        ? flavored
        : compatible;
    const alternatives = pool.filter((p) => p.id !== old?.id);
    if (alternatives.length) pool = alternatives;
    const history = usage[category] ?? [];
    const used = old ? [...history, old.id] : history;
    const fresh = pool.filter((p) => !used.includes(p.id));
    const cycleComplete = fresh.length === 0;
    // Prefer a fresh compatible idea before narrowing to previously used curated links.
    if (fresh.length) pool = fresh;
    if (style === "coherent" && anchors.length) {
      const anchorIds = new Set(anchors.map((a) => a.id));
      const links = new Set(
        curatedScenes
          .filter((example) =>
            example.ingredients.some((ref) => anchorIds.has(ref.id)),
          )
          .flatMap((example) =>
            example.ingredients
              .filter((ref) => ref.category === category)
              .map((ref) => ref.id),
          ),
      );
      const linked = pool.filter((p) => links.has(p.id));
      const anchorDomains = new Set(
        anchors.flatMap(
          (a) => prompts.find((p) => p.id === a.id)?.domains ?? [],
        ),
      );
      const semantic = pool.filter((p) =>
        p.domains.some((d) => anchorDomains.has(d)),
      );
      const thematic = pool.filter((p) =>
        p.tags.some(
          (tag) =>
            !["everyday", "playful"].includes(tag) && affinity.includes(tag),
        ),
      );
      // Curated pairs win when available; otherwise prefer compatible domains over arbitrary tag weighting.
      if (linked.length) pool = linked;
      else if (semantic.length) pool = semantic;
      else if (thematic.length) pool = thematic;
      else {
        const neutral = pool.filter((p) => p.domains.length === 0);
        if (neutral.length) pool = neutral;
      }
    }
    if (!options.pool && style === "coherent" && desiredFlavor === "playful") {
      const playful = pool.filter((p) => p.flavor === "playful");
      if (playful.length) pool = playful;
    }
    const entry = selectPrompt(
      pool,
      used,
      rng,
      style === "coherent" ? affinity : [],
    );
    snapshot.entries[category] = {
      id: entry.id,
      text: entry.text,
      locked: old?.locked ?? false,
      sourceVersion: entry.version,
      sourcePackVersion: PACK,
      contentRating: entry.contentRating,
    };
    anchors.push(snapshot.entries[category]);
    usage[category] = [...(cycleComplete ? [] : history), entry.id];
    affinity.push(...entry.tags);
    if (entry.flavor === "playful") playfulUsed = true;
    if (category === "relationship") {
      const template = entry.relationshipTemplateId
        ? relationships.find((r) => r.id === entry.relationshipTemplateId)!
        : relationships.find(
            (r) => r.id === `rel_${entry.id.split("_").at(-1)}`,
          )!;
      snapshot.relationship = {
        templateId: template.id,
        premise: template.premise,
        assignments: Array.from({ length: count }, (_, i) => ({
          playerId: options.playerIds?.[i] ?? `Player ${i + 1}`,
          roleText: relationshipRoleText(template, i),
        })),
      };
    }
  }
  // Old locked cards may predate per-entry provenance. Keep their fallback pack intact.
  snapshot.contentPackVersion = Object.values(snapshot.entries).every(
    (e) => e.sourcePackVersion,
  )
    ? PACK
    : (previous?.contentPackVersion ?? PACK);
  return { snapshot: refreshComposition(snapshot), usage };
}
export function relationshipCompatible(
  snapshot: PromptSnapshot | null,
  count: number,
): boolean {
  if (!snapshot?.relationship) return true;
  const r = [...relationships, ...sourceRelationships].find(
    (r) => r.id === snapshot.relationship?.templateId,
  );
  return !!r && count >= r.minPlayers && count <= r.maxPlayers;
}
export function promptText(p: PromptSnapshot): string {
  if (
    Object.keys(p.entries).length === 1 &&
    p.entries.location &&
    !p.relationship &&
    !p.jokeTopic
  )
    return p.entries.location.text;
  const composition = composeScene(p);
  return (
    (p.jokeTopic ? `Word: ${p.jokeTopic.word}\n` : "") +
    (composition ? composition.text + "\n\nIngredients:\n" : "") +
    Object.entries(p.entries)
      .map(([k, v]) => `${k.replace("_", " ")}: ${v.text}`)
      .join("\n") +
    (p.relationship
      ? "\n" +
        p.relationship.assignments
          .map((r, i) => `Player ${i + 1}: ${r.roleText}`)
          .join("\n")
      : "")
  );
}

export function resolvePromptPlayerId(
  playerId: string,
  roleIndex: number,
  players: readonly Player[],
  portableCast: readonly string[] = [],
): string {
  if (players.some((player) => player.id === playerId)) return playerId;
  const seat = /^Player ([1-9]|1[0-2])$/.exec(playerId);
  if (seat)
    return (
      players.find((player) => player.seatIndex === Number(seat[1]) - 1)?.id ??
      playerId
    );
  // Reused snapshots retain their source IDs; the scene's saved cast supplies new actors.
  return PlayerSchema.shape.id.safeParse(playerId).success
    ? (portableCast[roleIndex] ?? playerId)
    : playerId;
}

export function snapshotIsClean(snapshot: PromptSnapshot): boolean {
  const ingredientsClean = Object.values(snapshot.entries).every(
    (entry) => ingredientRating(entry) === "clean",
  );
  const word = snapshot.jokeTopic;
  const wordRating =
    word?.contentRating ??
    topics.find((topic) => topic.id === word?.id && topic.word === word?.word)
      ?.contentRating;
  return ingredientsClean && (!word || wordRating === "clean");
}
