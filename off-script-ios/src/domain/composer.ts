import {
  categories,
  categoryLabels,
  curatedScenes,
  PACK,
  prompts,
  relationships,
} from "./content";
import type { Category } from "./content";
import type { PromptSnapshot, SceneComposition } from "./contracts";
import { relationshipRoleText } from "./roles";

const ingredientById = new Map(prompts.map((p) => [p.id, p]));
// A source ID can have several historical values. Match exact saved text, not just its ID.
const originalsById = new Map<string, (typeof curatedScenes)[number][]>();
for (const original of curatedScenes) {
  const list = originalsById.get(original.source.id) ?? [];
  list.push(original);
  originalsById.set(original.source.id, list);
}
const originalForEntry = (entry: PromptSnapshot["entries"][Category]) =>
  originalsById.get(entry.id)?.find((c) => c.originalText === entry.text);
const trim = (s: string) => s.trim().replace(/[.!?]+$/, "");
const lower = (s: string) =>
  /^(?:[A-Z]{2}|I\b)/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);
const sentence = (s: string) => (/[.!?]$/.test(s) ? s : s + ".");
const situatedPlace = /^(backstage\b|beside |outside |inside |on |in |at )/i;
function indefinite(s: string) {
  s = lower(trim(s));
  if (
    /^(a |an |the |one |two |three |members |cousins |bandmates |office colleagues|hotel colleagues|museum colleagues|library colleagues|former )/i.test(
      s,
    )
  )
    return s;
  if (
    /\b(rain|hail|weather|dawn|noon|midnight|closing time|opening time|moving day|conflicting memories)\b/i.test(
      s,
    )
  )
    return s;
  return `${/^[aeiou]/i.test(s) ? "an" : "a"} ${s}`;
}
function identity(s: string) {
  if (
    /^(a |an |the |two |three |members |cousins |bandmates |neighbors |former |old |longtime |hotel colleagues|office colleagues|museum colleagues|library colleagues|classmates |fellow )/i.test(
      s,
    )
  )
    return s;
  return indefinite(s).replace(/^./, (c) => c.toUpperCase());
}
function place(s: string) {
  return situatedPlace.test(s)
    ? lower(s)
    : `${/^(?:(?:a|an|the) )?(?:bridge|rooftop|beach|boat|train|farm|balcony|island|stage|platform|cruise ship)$/i.test(s) ? "on" : "in"} ${indefinite(s)}`;
}
export function legacyIngredientCategories(
  snapshot: PromptSnapshot,
): Category[] {
  return categories.filter((category) => {
    const entry = snapshot.entries[category];
    if (!entry) return false;
    const original = originalForEntry(entry);
    return (
      !!original &&
      original.originalText === entry.text &&
      ingredientById.get(entry.id)?.text !== entry.text
    );
  });
}
export function compositionSignature(snapshot: PromptSnapshot) {
  const input = JSON.stringify(
    categories
      .filter((c) => snapshot.entries[c])
      .map((c) => {
        const e = snapshot.entries[c];
        return [c, e.id, e.text, e.sourceVersion, e.sourcePackVersion];
      }),
  );
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++)
    hash = Math.imul(hash ^ input.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}
/** Pure, deterministic templates. Only selected values are input; unsupported details stay separate. */
export function composeScene(
  snapshot: PromptSnapshot,
): SceneComposition | undefined {
  if (snapshot.compositionEnabled === false) return undefined;
  const selected = categories.filter((c) => snapshot.entries[c]);
  if (selected.length < 2 || legacyIngredientCategories(snapshot).length)
    return undefined;
  const value = (c: Category) => trim(snapshot.entries[c]?.text ?? "");
  const included: Category[] = [];
  let text = "";
  const canFit = (s: string) => s.length <= 180 && s.split(/\s+/).length <= 32;
  const accept = (next: string, category: Category) => {
    if (!canFit(next)) return false;
    text = next;
    included.push(category);
    return true;
  };
  const person = (["relationship", "role", "profession"] as const).find((c) =>
    value(c),
  );
  if (person)
    accept(
      person === "relationship" ? value(person) : identity(value(person)),
      person,
    );
  if (value("action")) {
    const source = ingredientById.get(snapshot.entries.action.id);
    const bindObject =
      value("object") &&
      source?.text === snapshot.entries.action.text &&
      source.tags.includes("takes_object");
    const action =
      value("action") + (bindObject ? ` ${lower(value("object"))}` : "");
    if (
      accept(text ? `${text} ${lower(action)}` : action, "action") &&
      bindObject
    )
      included.push("object");
  }
  if (value("location"))
    accept(
      text
        ? `${text} ${place(value("location"))}`
        : situatedPlace.test(value("location"))
          ? value("location")
          : identity(value("location")),
      "location",
    );
  if (
    value("situation") &&
    !/^(?:i|my|we|our|you|your)\b/i.test(value("situation"))
  ) {
    const s = value("situation");
    const form =
      ingredientById.get(snapshot.entries.situation.id)?.compositionForm ??
      (/\b(is|are|has|have|must|wants|starts|will|can|says)\b/i.test(s)
        ? "clause"
        : "condition");
    const during =
      /\b(rain|hail|weather|delay|day|night|dawn|noon|midnight|picnic)\b/i.test(
        s,
      );
    if (!text) accept(s, "situation");
    else if (form === "condition")
      accept(
        `${text} ${during ? "during" : "with"} ${indefinite(s)}`,
        "situation",
      );
    else if (included.includes("location"))
      accept(`${text}, where ${lower(s)}`, "situation");
    else if (included.includes("action"))
      accept(`${text} while ${lower(s)}`, "situation");
    // An independent event does not always describe the selected people naturally.
    // Keep it visible as an ingredient instead of forcing “For [people], [unrelated event]”.
    // A separate event clause can be clearer than forcing it onto a relationship.
  }
  if (
    value("object") &&
    !included.includes("action") &&
    !included.includes("situation")
  )
    accept(
      text ? `${text} with ${lower(value("object"))}` : value("object"),
      "object",
    );
  if (value("emotion") && included.length === 1 && included[0] === "location") {
    accept(`${value("emotion")} ${place(value("location"))}`, "emotion");
  } else if (
    value("emotion") &&
    included.includes("action") &&
    !included.includes("situation")
  ) {
    accept(`${text}, with ${lower(value("emotion"))}`, "emotion");
  }
  if (value("genre") && included.length === 1 && included[0] === "location") {
    accept(`${value("genre")} ${place(value("location"))}`, "genre");
  }
  if (!text && value("emotion")) accept(value("emotion"), "emotion");
  if (!text && value("genre")) accept(value("genre"), "genre");
  if (!text && value("opening_line"))
    accept(value("opening_line"), "opening_line");
  if (!text) {
    const first = selected[0];
    text = value(first);
    included.push(first);
  }
  const remaining = selected.filter((c) => !included.includes(c));
  return {
    version: 1,
    text: sentence(text),
    includedCategories: included,
    remainingCategories: remaining,
    signature: compositionSignature(snapshot),
    templateId: included.join("-"),
    contentPackVersion: PACK,
  };
}
export function refreshComposition(snapshot: PromptSnapshot): PromptSnapshot {
  const next = { ...snapshot };
  const composition = composeScene(next);
  if (composition) next.composition = composition;
  else delete next.composition;
  return next;
}
/** Explicit upgrade of the editable copy; saved originals and locked values never change. */
export function upgradeSnapshotIngredients(
  snapshot: PromptSnapshot,
): PromptSnapshot {
  const next = structuredClone(snapshot);
  let upgraded = false;
  for (const category of legacyIngredientCategories(next)) {
    const old = next.entries[category];
    if (old.locked) continue;
    const original = originalForEntry(old);
    const ref = original?.ingredients.find((r) => r.category === category);
    const current = ref && ingredientById.get(ref.id);
    if (!current) continue;
    upgraded = true;
    next.entries[category] = {
      id: current.id,
      text: current.text,
      locked: false,
      sourceVersion: current.version,
      sourcePackVersion: PACK,
      contentRating: current.contentRating,
    };
    if (category === "relationship") {
      const template = relationships.find(
        (r) => r.id === current.relationshipTemplateId,
      );
      if (template && next.relationship) {
        next.relationship = {
          templateId: template.id,
          premise: template.premise,
          assignments: next.relationship.assignments.map((a, i) => ({
            playerId: a.playerId,
            roleText: relationshipRoleText(template, i),
          })),
        };
      }
    }
  }
  const relationshipEntry = next.entries.relationship;
  const currentRelationship =
    relationshipEntry && ingredientById.get(relationshipEntry.id);
  const template = relationships.find(
    (r) => r.id === currentRelationship?.relationshipTemplateId,
  );
  if (
    next.relationship &&
    relationshipEntry &&
    !relationshipEntry.locked &&
    currentRelationship?.text === relationshipEntry.text &&
    template?.id === next.relationship.templateId
  ) {
    const assignments = next.relationship.assignments.map(
      (assignment, index) => ({
        ...assignment,
        roleText: relationshipRoleText(template, index),
      }),
    );
    if (
      assignments.some(
        (assignment, index) =>
          assignment.roleText !==
          next.relationship!.assignments[index].roleText,
      )
    ) {
      next.relationship.assignments = assignments;
      upgraded = true;
    }
  }
  if (!upgraded) return next;
  if (Object.values(next.entries).every((e) => e.sourcePackVersion))
    next.contentPackVersion = PACK;
  return refreshComposition(next);
}
export function sceneText(snapshot: PromptSnapshot) {
  return (
    composeScene(snapshot)?.text ??
    Object.values(snapshot.entries)[0]?.text ??
    ""
  );
}
export function remainingIngredientLabels(composition: SceneComposition) {
  return composition.remainingCategories
    .map((c) => categoryLabels[c])
    .join(", ");
}
