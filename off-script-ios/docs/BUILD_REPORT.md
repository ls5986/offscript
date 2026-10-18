# Off Script 1.3 build report

2026-10-16. Public target: https://off-script-play.lindsey08092.chatgpt.site

## Result

Corrects the request-alignment audit: compact app-first Home, one-tap fresh play for returning groups, an occasional short scene in the default party mix, participant-first cards, New Word/New Prompt beside Next Card, and direct access to the full eligible catalog. The warm navy/cream/lilac brand, original card mark and serif/sans typography are retained.

Party Night adds in-session rename/add/remove controls, optional named turn guidance and passing, optional team turns without scoring, editable teams and Large Display. Current and archived players retain distinct IDs; deal-time names preserve recap history, including backfilling pre-1.3 card names before the first roster edit. Membership changes deal a fresh Clean card and reset adult confirmation. Earlier prompts, ingredient locks/source versions and secret assignments remain intact.

Selected games reuse compatible remembered groups; Studio handoff uses its already-selected player count and exact snapshot. Names and free-play/round settings are optional setup disclosures. Explore exposes 38 Clean games immediately, plus the adult format after opt-in, with optional quick-game/group/skill filters. Shared local feedback is available for Party cards, individual games and Studio prompts.

Pack 2.2.0 adds 94 task-specific ingredients and expands Spicy variants across eight formats. Terrible Advice receives a first-person problem; short card instructions preserve each game's actual mechanic. The 31 generated recipe examples were editorially reviewed. Party cards display any ingredient outside their composed premise. The composer keeps an independent event separate when joining it to selected people would force an awkward sentence. Exact ingredients and 281 original curated combinations are preserved.

## Verification

- TypeScript, ESLint, content validation and whitespace checks.
- 92 unit/integration tests: all existing composer/category subsets, determinism, saved compatibility, content gates, fair assignment, cues/secrets, web/native repository checks; new tests cover mixed defaults, roster archives/deal-time names, turn passes, teams and task-specific content. Native tests exercise real SQLite transaction/foreign-key behavior through the test adapter.
- Browser scenarios cover the supplied Pickup Lines, New Choice, Fortunately/Unfortunately and World's Worst examples; initial emotion visibility, inline rerolls, roster edits, one-tap returning play, teams/display, full catalog, optional names, direct Studio/game handoffs and shared feedback. Existing scenarios cover all 39 actual game lifecycles, offline play, secret cover, exact saves/locks and phone/tablet/desktop/dark/large-text/startup behavior. 32 distinct browser scenarios passed across the full run and final focused rerun (20/20 focused checks after the last adjustments). The full run separately passed all 39 game lifecycles.
- Web production export and iOS Hermes export. Native export is not a physical-device, signed-build or TestFlight test.

## Storage and publication

One shared Expo application and session/prompt engines. IndexedDB web and SQLite native store validated local snapshots. Defaulted fields preserve older records without destructive schema changes. Current SQLite seats/team members are refreshed transactionally while archived actors and old rounds remain available. No remote backend, account, runtime AI or cloud sync is introduced for single-phone play.

The existing registered Sites project is published publicly using its exact pushed source commit. `scripts/check-party-public.mjs` verifies the deployed site in a fresh unauthenticated browser. The content inventory is regenerated with `npx tsx scripts/export-content.ts`; the editorial sample with `npx tsx scripts/review-party-cards.ts`.

See [REQUEST_ALIGNMENT_AUDIT.md](REQUEST_ALIGNMENT_AUDIT.md) for the historical findings and resolution table, [PARTY_NIGHT.md](PARTY_NIGHT.md) for current behavior, and [CARD_EDITORIAL_SAMPLE.md](CARD_EDITORIAL_SAMPLE.md) for actual generated cards.

## Limits

No real-group humor/usability study has been executed. Feedback remains local unless the owner exports it. Physical iPhone audio, accessibility/lifecycle checks, signing and TestFlight remain unverified. The shared native source and EAS profiles remain available for those release steps.

## Final executed checks

- 92/92 unit/integration tests passed.
- 32 distinct browser scenarios passed across full and focused runs; final focused run: 20/20 in 54.9 seconds.
- Final strict typecheck, ESLint, content validation and `git diff --check` passed.
- Production web export passed; 51 offline assets, cache digest `93336c8f44d0`.
- Final iOS Hermes export passed: `/tmp/off-script-ios-aligned-final`.
- Public post-deployment verification is performed separately by `scripts/check-party-public.mjs`; its output stays outside the source checkout at `/workspace/off-script-party-live/verification.json`.

## Content correction 2.2.1

Action `prompt_action_071` is now exactly “Organizing a fridge” (v2). The previous comparison remains archived as a curated Action + Situation example, rather than being generated as an Action ingredient. Existing saved originals and locks remain exact; explicit upgrades keep only the categories already selected. The reproducible ingredient authoring script includes this correction without changing other published IDs. Current inventory: 1,075 ingredients and 282 curated examples. iOS handoff work is paused in a separate checkout at the owner’s request.

Correction checks passed: 93 unit/storage tests, the two Studio composition browser regressions, production web export, and a targeted browser check that upgrading the old fridge Action shows only “Organizing a fridge” without adding Situation.

## Complete ingredient review 2.3.0

Reviewed all 1,075 existing ingredient values across ten categories and all 96 relationship templates. Made 181 standalone-text corrections, separated reusable scene details, preserved 463 original examples, and resolved six duplicate IDs. The current bank contains 1,182 ingredients. Multiple historical values sharing an ID remain upgradable by exact source text, while saved/locked originals stay exact. Full changes and review criteria: [INGREDIENT_PURITY_REVIEW.md](INGREDIENT_PURITY_REVIEW.md). iOS preparation remains paused.

Review verification: 97 unit/storage tests passed; 32 browser scenarios passed, including all 39 game lifecycles; the final two Studio composition regressions passed after the locked-snapshot fix. A targeted browser check confirms that upgrading old mixed Action/Location values changes only those values, leaves a locked Emotion exact, adds no categories, and preserves the saved original. Strict typecheck, targeted ESLint, content review validation, reproducible authoring and production web export passed.
