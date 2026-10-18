import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { composeScene } from "../src/domain/composer";
import { activityById, PACK, categoryLabels } from "../src/domain/content";
import { UserPreferencesSchema } from "../src/domain/contracts";
import {
  makePartySession,
  appendPartyCard,
  partyParticipantText,
  partyPromptText,
} from "../src/domain/party";
import { partyRecipes } from "../src/domain/party-recipes";
import { PartyOptionsSchema } from "../src/domain/party-contracts";
import { partyInstruction } from "../src/domain/playbooks";
import { currentRound } from "../src/domain/session";
const now = "2026-10-16T21:00:00.000Z";
let s = makePartySession(
  6,
  UserPreferencesSchema.parse({}),
  ["Alex", "Sam", "Meghan", "Bea", "Jo", "Lee"],
  PartyOptionsSchema.parse({
    level: "18_plus",
    adultsConfirmedAt: now,
    movement: true,
  }),
  randomUUID,
  124,
);
const lines = [
  `# Generated card editorial sample — pack ${PACK}`,
  "",
  "These are deterministic generated cards, reviewed for concise instructions, a playable input and clear participation. This is an editorial sample, not evidence of human humor testing.",
  "",
];
for (const recipe of partyRecipes) {
  s = appendPartyCard(s, randomUUID, now, { recipeId: recipe.id });
  const r = currentRound(s),
    a = activityById(r.activityId);
  lines.push(
    `## ${a.title} · ${recipe.level}`,
    ``,
    partyParticipantText(s),
    ``,
    partyPromptText(r),
    ...(composeScene(r.promptSnapshot)?.remainingCategories ?? []).map(
      (c) => `${categoryLabels[c]}: ${r.promptSnapshot.entries[c].text}`,
    ),
    ``,
    partyInstruction(a),
    ``,
    `Recipe: ${recipe.id}; pattern: ${recipe.pattern}; source pack: ${PACK}.`,
    "",
  );
}
writeFileSync("docs/CARD_EDITORIAL_SAMPLE.md", lines.join("\n"));
console.log(`Reviewed ${partyRecipes.length} recipe examples.`);
