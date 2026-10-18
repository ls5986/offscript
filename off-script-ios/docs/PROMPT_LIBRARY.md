# Prompt and recipe library, content pack 2.8.0

## Two independent ways to find an idea

Open **Prompt & recipe library** from Home, Prompt Studio or the game catalog.
The shared web/iOS route is `/library`.

- **Prompts** are individual ingredients. Search by wording, filter by
  category and choose Clean, Cheeky or 18+. A single Action can stand on its
  own; it does not need a recipe.
- **Recipes** now separates **14 Prompt recipes** (authored ingredient
  combinations) from **43 Game recipes** (the actual Party Night variants).
  Prompt recipe cards show exactly which ingredients will open in Studio.
  Game recipes show their input categories and eligible pool sizes, with
  links into those actual pools.
- **All content** searches the full bundled runtime catalog, including
  metadata and read-only historical originals. It does not expose private
  saved player data, credentials or current private-role assignments.

Using a prompt opens only that ingredient, with composition off.
Using a recipe opens exactly its referenced ingredients, with optional
composition on. Both are editable copies in Studio. Roles filter relationship
entries/recipes to a compatible cast when enabled; **Any role count** is the
default, so ensemble records are not silently hidden. Using a prompt chooses
a compatible cast rather than assigning four roles to a two-person template.
Search and pagination keep the full catalog
browsable without rendering every card at once.

## Compact list layout

Library results use flat, divider-separated rows instead of large cards.
Each row keeps its full, wrapping title plus category/bank and content level.
The **Use** button remains beside individual prompts and prompt recipes,
opening the exact selection in Studio as before; **Act out this prompt**
remains available there. The row itself does not silently select anything.
Buttons retain at least 44px touch targets.

Prompt and game recipe summaries stay compact, with longer descriptions,
ingredient references and per-category pool counts under **Recipe details**.
Game recipes retain a direct **Inputs** button for browsing their actual
eligible pools. Read-only historical entries and optional **Record details**
remain available without gaining a Use action. Search, full-bank sorting,
pagination, totals, role compatibility and content gates are unchanged.

Measured on the production browser preview, the first five ordinary prompt
titles span **283px**, versus **845px** in the previous layout. Tests also
require five rows to fit within 400px at 320px and 390px widths in both themes,
check large-text wrapping, and verify exact prompt/recipe use and expandable
details. **358 unit tests, 115 complete browser tests**, typecheck/lint and
iOS JavaScript/Hermes export passed for this presentation change.
This is not a new native-device installation or TestFlight delivery.

## Full inventory, sorting and inspection

**Totals** opens the complete inventory, with direct Browse controls for each
bank and category. The headline **1,534 live prompt inputs** consists of:

| Live prompt bank | Records |
| --- | ---: |
| Current ingredient prompts | 1,214 |
| Complete advice problems | 60 |
| Joke topics | 160 |
| Secret goals | 60 |
| Guest quirks | 40 |
| **Live prompt inputs** | **1,534** |

Separate records are **14 Prompt recipes**, **43 Game recipes**,
**60 current relationship templates**, and **39 games**.
History contains **1,326 historical ingredient records**,
**96 historical relationship templates**, and **1,347 archived originals**.
Across all banks there are **4,459 catalog records**, not 4,459 unique playable
prompts. Template metadata and historical copies are deliberately not added to
the live-prompt total.

Sorting applies to the full filtered bank **before** pagination:
Source order, A–Z, Z–A, By category, By level, By ID,
Most inputs and Fewest inputs. Input-count sorting uses actual eligible
entries for game recipes, fixed ingredient references for prompt recipes,
one for individual live inputs and zero for historical/metadata records.
Search matches wording, IDs and stored metadata. Ordinary browsing uses
**Search ideas**, category-first quick filters and sorting, without the wall
of backend bank choices. **Inspect full catalog** inside Filter library
preserves every bank and the **Show IDs and record details** switch.
**All content** and **Totals** remain direct entry points to full inspection.
Each row shows its category/bank and rating; IDs and **Record details** are shown
when inspection is enabled or a non-prompt metadata/history bank is selected.
Record details expands the actual authored record fields,
including tags, role definitions, versions and ingredient references.
Historical cards are marked read-only and cannot be injected into fresh play.
They remain searchable without silently upgrading or rewriting them.

All allowed levels is the initial browsing filter. Adult text still requires
consent; Classroom clean restricts every bank and its record details to Clean.
Totals include locked records, while the result line shows the visible
matching count against the bank's full total. The Clean/Cheeky/18+ filters
select exact ratings, not cumulative levels.

Prompt recipes explain that they are fixed combinations; Game recipes explain
that they describe how games draw prompts. Browsing and generation behavior,
totals, full-set sorting and read-only history remain unchanged by this
first-use presentation cleanup.

Game recipe input breakdowns use the same category/count/rating eligibility
helper as actual generation, plus the existing game-specific pools. Counts
are stated for the recipe's minimum group and performer count; New Choice
keeps its separate caller. These are eligible input choices, not a fabricated
count of all possible combinations. For example, the Clean Terrible Advice
variant has **16 Clean advice problems**, while its Cheeky variant has 28.
Joke games use the separate 160-word topic bank rather than empty ingredient
recipes being mistaken for missing content.

## Cheeky and adult content

Cheeky is the browser/Studio label for the existing `spicy` level; it is not a
new age rating. The user's `28+` wording was treated as a reference to the
existing **18+** level, not a new 28-year age gate.

The additive pack contains **60 new inputs**:

| Category | Cheeky / Spicy | 18+ / Mature-suggestive |
| --- | ---: | ---: |
| Action | 23 | 13 |
| Situation | 12 | 12 |

Cheeky actions include **Scattering ashes**, **Rehearsing a eulogy**,
**Practicing fake crying**, **Staging a dramatic exit**, and
**Writing a passive-aggressive review**. Adult actions/situations use
suggestive, awkward comedy rather than explicit sexual detail; sexual
references such as a fake orgasm are in the adult group, not Cheeky.
No new activity format requires touching, undressing or personal disclosure.
All scenarios are fictional and skippable. Dark humor is not a request to
mock an actual person's grief.

An action can name what is being done: "Scattering ashes" is the requested
activity, not a hidden full scene. It does not also pick an urn, a beach,
a relationship, a role or an accident. Those are separately chosen only
when a recipe explicitly includes them. Situations likewise do not select
fixed props, relationship labels, occupations or locations.

The full bank is now **1,214 ingredients**:
**1,104 Clean / 67 Spicy / 43 Mature-suggestive**.
There remain 60 relationship templates, 39 games, 43 internal Party Night
variants and 60 separate complete advice problems. The new library recipes
are 6 Clean, 5 Cheeky and 3 adult combinations.

## Studio, consent, history and saved originals

Studio Customize now selects Clean, Cheeky or 18+ for new unlocked inputs.
Older Studio states without a level still default to Clean.
18+ requires the existing adult confirmation; Classroom clean overrides both
Cheeky and adult selection. Adult Studio results are hidden when adult opt-in
is off; saved originals are retained rather than rewritten or deleted.
Saved prompts reopen with their source-rated level.

Content level is part of Studio history context, so changing levels does not
walk back into an unrelated browsing deck. Locks keep their exact original
wording/rating, including when unlocked inputs use a different level.
Classroom clean can hide a locked rated original.

Act out preserves the chosen categories and source rating. A Cheeky action
remains Cheeky on New Prompt/replay, rather than reverting to Clean or jumping
to adult because the session previously mapped all non-Clean values to 18+.
The existing Party pool/variant eligibility remains responsible for which
categories each game uses. New actions are not mislabeled as association
seeds, character walks, advice problems or mundane physical exercises merely
to force them into every game.

The complete frozen 2.7 ingredient bank, aliases, templates and exact-original
archives are unchanged. The new bank appends entries from
`src/content/v2/library-pack-2.8.json`; runtime content provenance advances to
2.8.0 while explicitly recognizing 2.7.0's earlier canonical classifications.
This avoids incorrectly borrowing older, stronger ratings for identical
words saved from the 2.7 canonical bank. All historical original records and
explicit-update behavior remain available.

## Authoring and validation

`library-pack-2.8.json` is the single authored source for the addition:
category/rating/composition-form groups have explicit stable IDs and wording.
Runtime parsing uses the shared `PromptEntrySchema`; no text is stripped into
ingredients by a heuristic. Recipe IDs/references, unique categories, derived
rating and intersecting role ranges are validated when the library loads.

The content validator verifies the frozen 2.7 base separately from the
additive 60 records, plus global unique IDs/text, archive/source mappings and
role compatibility. The full 2.7 compiler remains deterministic and does not
overwrite the additive file. Automated validation establishes structure,
reachability, rating gates and preservation; it cannot certify that people
will find a joke funny. The new material is authored content awaiting
real-player feedback, not a claim of external human editorial approval.

```sh
npm test
npm run typecheck
npm run lint
npm run content:validate
npm run build:web
npm run test:e2e:web
npm run ios:export
```

The Library route is included in the Vercel rewrite and offline app fallback.
These local changes do not update an existing TestFlight binary or deploy the
Vercel site. A new native build/upload is required to deliver them on iPhone.

## Executed checks

- **355 unit tests across 40 files**, TypeScript, lint and complete content
  validation passed.
- Production web export and **105 full browser tests** passed.
- Full catalog tests cover every bank/count, non-duplicated live totals,
  stable full-bank sorting, most/fewest-input ordering, recipe-to-pool links,
  read-only source metadata, consent gates across all banks and ensemble
  selection without a default two-role restriction.
- Real UI checks cover requested action search/use, exact recipe categories,
  Studio Cheeky/adult rerolls, consent/cancel, Classroom clean reset, saved
  adult reopen/opt-out, mobile contrast/pagination and offline Library routing.
- The result-first Library keeps category/role controls inside Filter library.
  The requested action's Use button is fully in the 390-by-844 phone viewport
  after searching; browsing does not require reading an expanded filter wall.
- Frozen 2.7 authoring rebuilt deterministically without changing historical
  banks/approvals. The original 1,326 source records and 1,347 exact archives
  remain available.
- iOS JavaScript/Hermes export passed. This is not a native-device installation,
  signed Library build or TestFlight upload.
- Persistent website `/library` and original app preview are responsive.
