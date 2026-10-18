import { writeFileSync } from "node:fs";
import {
  activities,
  categories,
  categoryLabels,
  curatedScenes,
  goals,
  PACK,
  prompts,
  quirks,
  relationships,
  topics,
} from "../src/domain/content";
import { partyRecipes } from "../src/domain/party-recipes";
import { riffCategories } from "../src/domain/playbooks";
const lines: string[] = [];
const add = (...text: string[]) => lines.push(...text, "");
add(
  "# Off Script — Prompts, Games, and Setup",
  `Application 1.3.0 · Content pack ${PACK} · Exported ${new Date().toISOString().slice(0, 10)}`,
  "Live: https://off-script-play.lindsey08092.chatgpt.site",
  "This is the current bundled, authored content inventory. Prompts are selected locally; no runtime AI generates material.",
);
add(
  "## How the app is set up",
  "- Party Night: Start Party Night → 2–12 people → optional names → Deal first card → continuous hosted cards. Clean and seated with no sound by default. The balanced deck mixes quick cards with occasional short scenes; secret-role games remain manually selectable. Returning groups start a fresh deck in one tap. Next, Skip, Replay, New Prompt, fair turns, optional cues/timers, passes, editable players, team turns, Large Display, sit-out/rejoin, saves and resume.",
  "- Prompt Studio: choose any of 10 pure ingredient categories. One category stays ingredient-only; multiple categories use deterministic scene composition. Exact ingredients, locks and source versions are stored separately. Connected uses curated links/domains; Mix Freely selects independently. Extra details remain separate when composition would be awkward.",
  "- Explore Games: all 39 formats, quick picks, focused practice, Just Us, free play and rounds. Names are optional in every setup. Remembered compatible groups and Studio handoffs skip repeated setup.",
  "- Saved: shared favorites, exact prompts, presets and sessions. All progress stays in this browser/device (IndexedDB web, SQLite native). Feedback is local and exportable across Party Night, individual games and Studio. No cloud backup or account.",
  "- Content levels: default generation is Clean. Spicy recipes add cheeky adult situations; 18+ recipes require affirmative confirmation for the group. Classroom overrides content levels. Ingredient categories are not copied into separate adult databases.",
  `Totals: ${activities.length} activities, ${prompts.length} ingredients, ${relationships.length} relationship templates, ${topics.length} joke words, ${goals.length} secret goals, ${quirks.length} quirks, ${curatedScenes.length} preserved original combinations, ${partyRecipes.length} party recipes.`,
);
add(
  "## Game → prompt mapping",
  "| ID | Game | Engine | Full categories | Casual categories | Party recipes |",
  "|---|---|---|---|---|---|",
);
for (const a of activities)
  add(
    `| ${a.id} | ${a.title} | ${a.engine} | ${a.promptCategories.join(", ") || "none"} | ${riffCategories(a).join(", ") || "none"} | ${
      partyRecipes
        .filter((r) => r.activityId === a.id)
        .map((r) => `${r.id} (${r.level})`)
        .join(", ") || "Explore only"
    } |`,
  );
add(
  "Rapid-fire P1/P2/P3 use jokeTopic words rather than a full scene. P4 uses a profession; P5 a situation; P6 a location. Party recipes explicitly request their category subsets below. Secret games add private goals/quirks from their corresponding banks.",
);
add(
  "## Party card recipes",
  "| Recipe | Activity | Participation | Creative inputs | Duration | Level |",
  "|---|---|---|---|---|---|",
);
for (const r of partyRecipes)
  add(
    `| ${r.id} v${r.version} | ${r.activityId} | ${r.pattern}; ${r.performers} | ${r.categories.join(", ") || (["P1", "P2", "P3"].includes(r.activityId) ? "joke word" : "open")} ${r.curatedSituation ? "(curated party situations)" : ""} | ${r.durationSec ? `${r.durationSec}s, optional` : "untimed"} | ${r.level} |`,
  );
add("## All ingredient prompts");
for (const category of categories) {
  const pool = prompts.filter((p) => p.category === category);
  add(`### ${categoryLabels[category]} (${pool.length})`);
  for (const p of pool)
    add(
      `- **${p.id}** v${p.version} · ${p.flavor} · ${p.contentRating} · ${p.minPlayers}–${p.maxPlayers} performers: ${p.text}`,
    );
}
add(
  "## Relationship role templates",
  "The relationship ingredient remains neutral. Role assignments identify participants; they do not invent personalities or objectives.",
);
for (const r of relationships)
  add(
    `- **${r.id}** v${r.version} · ${r.minPlayers}–${r.maxPlayers} performers: ${r.premise}\n  Roles: ${r.namedRoles.join("; ")}${r.expandableRole ? `; additional: ${r.expandableRole}` : ""}.`,
  );
add("## Joke words — P1/P2/P3");
for (const t of topics)
  add(`- **${t.id}**: ${t.word} · plural: ${t.plural} · ${t.contentRating}`);
add("## Private objectives — Secret Objective");
for (const g of goals) add(`- **${g.id}**: ${g.text}`);
add("## Private quirks — Party Quirks");
for (const q of quirks) add(`- **${q.id}**: ${q.text}`);
add("## Full game instructions");
for (const a of activities)
  add(
    `### ${a.id} — ${a.title}`,
    `Group: ${a.minPlayers}–${a.maxPlayers}. Performers: ${a.minPerformers}–${a.maxPerformers}. ${a.energy}. ${a.contentRating}.`,
    a.howTo,
    `Example: ${a.example}`,
    `Coaching: ${a.coachTip}`,
    `Reflection: ${a.reflection}`,
  );
add(
  "## Preserved combined examples",
  "These original combinations remain curated references to separate ingredients. They are not misclassified as single Location or Relationship ingredients.",
);
for (const c of curatedScenes)
  add(
    `- **${c.id}**: ${c.originalText}\n  Original: ${c.source.id} v${c.source.version}, pack ${c.source.packVersion}. Ingredients: ${c.ingredients.map((i) => `${i.category}=${i.id} v${i.version}`).join("; ")}.`,
  );
writeFileSync(
  process.argv[2] ?? "/workspace/Off-Script-Prompts-Games-and-Setup.md",
  lines.join("\n"),
);
console.log(
  `Exported ${prompts.length} ingredients, ${activities.length} games and ${partyRecipes.length} recipes.`,
);
