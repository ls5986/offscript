# Prompt Studio: ingredients and scene composition

## Current 2.5 behavior

Fresh Studio is ingredients-first. The optional **Combine into a scene** switch
is separate from Connected ideas / Mix freely selection. A snapshot's optional
`compositionEnabled: false` suppresses composition; absent values retain legacy
behavior. The Studio preference is optional so older saved recipes remain
readable without rewriting their intended output.

Pack 2.5.0 contains 1,182 ingredients and 583 preserved originals. Role expansion
continues numbered labels after fixed slots; explicit unlocked upgrades can
repair old duplicate labels, while ordinary load and locked words remain exact.
Composition grammar and repeat-aware archival affinity have regression coverage.
See the [reviewed bounded content pass](../content/editorial/prompt-engine-2.5.0.md)
and [generated version/material review](prompt-review/REVIEW.md).

Large Display retains generation. The historical pipeline below explains the
composer when it is explicitly enabled; it is no longer compulsory output.

Studio prompt cards also support left/right browsing with a bounded exact
snapshot history. The next action reuses forward history before generating.
Changes to selected categories, locks, represented cast, composition or selection
style reset browsing rather than letting Back undo those settings. Saved prompt
text, source versions and locks remain authoritative; browsing is not an
implicit content upgrade. See [the swipe behavior](V1_PLAY_EXPERIENCE.md#swipe-through-prompts).

Default: **one short place name**, such as **Repair shop**. No automatic relationship, situation, roles or composed scene. Copy / Share copies the bare place name. Customize deliberately adds other ingredients; flavor choices are hidden for a lone location and mixing controls appear only with multiple ingredients. Existing saved recipes are not reset.

Optional multi-ingredient pipeline: **pure ingredients → compatibility selection → deterministic composer → composed premise + exact ingredients**.

The current content pack is **2.4.0**: 1,182 ingredients, 96 relationship templates and 559 preserved original examples. All 96 locations now use explicit, unique names of at most three words and 24 characters. Each changed location has a new version and an archive of its exact 2.3.0 value. IDs, content ratings, player limits and Party task tags remain intact. The earlier complete category-purity review remains historical; see [INGREDIENT_PURITY_REVIEW.md](INGREDIENT_PURITY_REVIEW.md). The historical source banks remain under `src/content/v1/`.

## Content boundaries

Locations describe places, not an event at the place. Relationships describe how participants are connected, with neutral player-role labels. Independent circumstances, actions and emotions from those old combined cards become separately selectable ingredients. Duplicate pure bases are shared, rather than embellished to preserve an old count. Curated examples retain the original text, original source ID/version/pack, original role labels where relevant, and versioned references to the reusable ingredients. They influence selection; their full old text is never silently pasted over an ingredient.

The hotel example is stored as Location `Hotel` and Situation `A strict no-boring-hats policy`, linked by curated examples preserving the old combined text and earlier location wording. When both are selected, the composer produces **A hotel with a strict no-boring-hats policy.** Location alone stays exactly **Hotel**. `The repair counter of an umbrella shop` is now **Repair shop**, with no unrequested mentor, apprentice or meeting.

## Selection

`src/domain/prompts.ts` filters by selected categories, performer count and flavor. Connected mode prioritizes curated matching ingredient links, then shared semantic domains, then meaningful themes, with neutral fallback when necessary. Retained unlocked cards are compatibility anchors during a single reroll, just like locked cards. Mix Freely skips compatibility ranking and permits unexpected combinations.

Connected Playful scenes use grounded places/relationships when a situation, action or prop can carry the playful twist. This lets a normal hotel lobby pair with the no-boring-hats policy instead of forcing every place to be fantastical. Rerolls prefer a different eligible value. Locked cards cannot be rerolled, and an individual reroll leaves the other entries and role assignments exact.

## Composer and display

`src/domain/composer.ts` is a pure function with explicit people/activity/place/condition/clause/prop templates, stable category order and a 180-character/32-word premise budget. It uses only selected values and grammatical connectors. It does not invent a setting, backstory, character objective or payoff. One selected category has no composed output. With multiple categories, unsupported or overlong additions remain separate and are listed as “Also selected below.” Roles, professions, emotions, genre and opening lines are not forcibly assigned to everyone in a relationship.

Independent situation clauses remain separate when they cannot naturally describe the selected people. Party cards also display all values outside the composed premise.

With multiple selected ingredients, Studio shows the composed suggestion first, followed by all exact ingredient values and lock/reroll controls. A multi-part fallback is labeled “Starting premise.” Large Display, saved-scene previews, Copy / Share and Scene Lab handoff use the same composer. Individual ingredients remain the source of truth.

Each newly generated entry stores `id`, `text`, `locked`, `sourceVersion`, and `sourcePackVersion`. `snapshot.composition` is separate: composer version, text, included/remaining categories, template ID, input signature and pack version. Every generation, category toggle and ingredient update refreshes the stored composition; display also derives it from current entries so stale saved composition cannot override changed ingredients. Changing a lock does not rewrite its words.

## Compatibility with saved scenes

The snapshot schema accepts older records without provenance or composition. Saved texts, IDs, locks and role assignments are never automatically rewritten to match the new pack. Known old combined entries show a “Saved original” notice and retain their original content; they are not presented as new pure ingredients. The user may unlock them and choose “Update ingredients” on the editable Studio copy. The update maps each old value to its current same-category ingredient, adds no unselected categories, and leaves the saved original record unchanged.

Mixed old/new snapshots retain the old parent pack as the provenance fallback for untouched legacy cards; each newly generated card records its own new pack/version explicitly.

Web IndexedDB and native SQLite already store validated snapshot JSON, so no storage reset or destructive SQL migration is needed. Older sessions and presets stay readable.

## Regression evidence

The short-place follow-up covers 100 default seeds, all 96 reviewed locations and their archived versions, exact bare-name copy, locked originals, and explicit upgrades. Browser coverage takes the original mentor/umbrella-counter/meeting example through Update ingredients and category removal, then confirms **Repair shop** alone survives reload while the saved original remains exact.

Tests cover all 1,023 non-empty category subsets in Connected and Mix Freely, the exact hotel-policy example, single-category purity, 2–12-person relationships, deterministic output, source versions, length/fallback behavior, stale composition, whole-card locks, single rerolls, curated references, old snapshot loading and explicit upgrades. Browser tests verify the prominent composed view, exact ingredients underneath, locked reroll controls, category removal, save/reopen/reload, legacy locks and upgrades, existing Studio ensembles and game handoff.

Content correction 2.2.1: Action `prompt_action_071` v2 is “Organizing a fridge.” Its former luxury-hotel comparison is preserved as a separate, linked Situation in a curated example. Action-only generation adds no comparison or category. Saved originals/locks retain their exact text and can use the existing explicit ingredient-upgrade action.
