# Independent ingredients, pack 2.7.0

This is the immutable 2.7 base record. [Content 2.8](PROMPT_LIBRARY.md) appends
60 independent rated inputs and 14 explicit library combinations without
changing this bank, its authoring approvals, aliases, templates or archives.

## Scope and inputs

The approved ingredient-independence audit reviewed all **1,326** original
ingredients and **96** relationship templates: 595 keep, 86 rewrite, 566 split,
79 move. Every original has an explicit reviewed disposition and a direct
same-category canonical alias. No extraction automatically adds another selected
category, prop, relationship, place, profession, action or opening hint.

The immutable source is
`content/editorial/ingredient-purity-2.6.1.json`, not whatever runtime exports
happen to be installed. The earlier 2.3/2.4/2.5/2.6/2.6.1 approvals and old
content banks are historical records and are not overwritten by this pass.

The included editorial inputs are:

- `content/editorial/atomic-audit-2.7.0.json`: complete original per-record audit
  and template/role decisions, copied without changing the audit's source texts.
- `content/editorial/atomic-authoring-2.7.0.json`: hand-authored cores, explicit
  semantic consolidations, template roles, ratings, task eligibility and additions.
  This is not a regex stripping policy or a runtime generator.
- `content/editorial/ingredient-purity-2.7.0.json`: frozen complete approval,
  including input SHA-256 values, all original decisions, canonical entries and
  templates, complete aliases and exact-original archive records.

`reviewedIngredientIds` and `reviewedRelationshipTemplateIds` identify the
approved canonical banks. `sourceReviewedIngredientIds` and
`sourceReviewedRelationshipTemplateIds`, plus `decisions` and
`relationshipDecisions`, explicitly cover all 1,326/96 originals. A disposition
of `rewrite` can also mean versioned metadata cleanup, such as supplying the
explicit flavor previously supplied by a schema default; it does not change the
original audit's keep/rewrite/split/move classification.

## Canonical counts

There are **1,154** canonical ingredients and **60** matching relationship
templates. There is no retained 1,326/144/72 quota. Identical cores and explicit
semantic equivalents consolidate rather than becoming duplicate canonical IDs.

| Category | Clean | Spicy | Mature-suggestive | Total |
| --- | ---: | ---: | ---: | ---: |
| Action | 128 | 0 | 0 | 128 |
| Emotion | 51 | 0 | 0 | 51 |
| Genre | 25 | 0 | 0 | 25 |
| Location | 99 | 9 | 2 | 110 |
| Object | 100 | 0 | 0 | 100 |
| Opening line | 97 | 2 | 3 | 102 |
| Profession | 83 | 5 | 5 | 93 |
| Relationship | 58 | 2 | 0 | 60 |
| Role | 61 | 0 | 0 | 61 |
| Situation | 402 | 14 | 8 | 424 |
| **Total** | **1,104** | **32** | **18** | **1,154** |

Every category has Clean choices at every cast size from two through twelve.
Relationship consolidation never crosses the two-person, three-person and
four-to-twelve partitions. Club, committee, board, crew, team and group
connections remain distinct, while their workplace and industry variants
consolidate with matching neutral role names.

Task eligibility survives consolidation: 45 `familiar_profession`, 31
`association_seed`, 28 `mundane_action`, six `character_walk`, and 15
`beginner_emotion` canonical entries. The optional existing `tags` array marks
reviewed direct-transitive Actions with `takes_object`; it adds no schema field.

## Editorial decisions

- `prompt_situation_3101` is exactly **Something was left behind. Nobody will
  admit it's theirs.** It is Clean. Its original casual-partner/toothbrush scene
  remains exact in history, not in fresh Situation generation.
- Situation 2102 concerns conflicting expectations, not actors meeting for the
  first time. Situation 2100 concerns disputed decision authority, not a meeting
  or a forced equal hierarchy.
- Situation 045 is mistaken importance: **Someone has been mistaken for a much
  more important person.** It assigns no Expert role or profession.
- All 32 new Spicy scenes, all 32 new adult scenes and all 60 advice problems
  have individually authored, reviewed independent circumstances. Neutral
  circumstances are Clean. Romantic/sexual misunderstanding is rated only where
  that meaning remains explicit, rather than inherited from a bundled scene.
- Fifteen additional non-graphic circumstances explore attraction, privacy,
  suggestive misunderstandings and intimacy without assigning a pair's
  relationship, concrete prop, place, job or scripted response.
- Five additional Mature professions supply genuine adult-specialist jobs:
  Sex therapist, Erotic novelist, Burlesque performer, Adult-store clerk and
  Adult-film director. All retain `familiar_profession` eligibility. The existing
  Spicy Intimacy coordinator is clarified as Film-set intimacy coordinator,
  preserving its ID, rating and task metadata.
- Three additional Mature opening lines are selected dialogue inputs, not hints:
  “That sounded a lot more sexual than I intended.”; “I did not mean for everyone
  to hear that fantasy.”; “I meant that as a sexual confession, not a practical
  suggestion.” They prescribe no prop, relationship, job, place or performed
  sequence. This bounded eight-record addition preserves every previous
  canonical record except the explicitly clarified profession text; aliases and
  relationship templates remain byte-identical.
- New separately selectable Objects include a toothbrush, string of lights,
  spare key, pillow, duvet and laundry basket. Physical attributes and contents
  remain valid Object specificity. Nothing automatically selects these objects
  when a scene is split.
- New two-person Relationships are Partners, Ex-partners, Casual partners and
  Newly dating, with explicit roles and honest Clean/Spicy eligibility.
- Inventor becomes Creator and Puppeteer becomes Manipulator in Role. Their
  literal occupations are separately available as Profession entries. Ambiguous
  Sign seeker is resolved as seeking answers and consolidated with the existing
  Questioner role, not a mandatory sign, omen or direction.
- Repair variants share Repairing; fixed-prop Actions become independently
  selectable verbs. Generic meal, gift and activity targets remain allowed.
  Genre conventions, emotion nuances and professional specializations are not
  flattened into generic placeholders.
- Thirteen moved performance constraints are historical-only. Their aliases
  describe fictional pressures or misunderstandings, not required seating,
  hand-only movement, vocal restrictions or memorized dialogue. Four moved
  activity seeds likewise receive ordinary circumstances.
- All 60 full advice requests retain their exact original text in source/history.
  The parent runtime exports these separately for Terrible Advice; the atomic
  bank contains their Situation aliases, not rewritten advice questions.

## Persistence interfaces

| File | Contract |
| --- | --- |
| `src/content/v2/atomic-ingredients-2.7.json` | Full canonical `PromptEntry[]`, with explicit flavor |
| `src/content/v2/atomic-relationships-2.7.json` | One `RelationshipTemplate` per canonical relationship |
| `src/content/v2/atomic-aliases-2.7.json` | All 1,326 old IDs map directly to an existing same-category canonical ID |
| `src/content/v2/atomic-archive-2.7.json` | 763 exact-original `CuratedScene` records |

An archive exists for every original whose text, canonical ID or role mapping
changed, including all moved advice records. It contains exact old ID, text,
version and pack **2.6.1**, exactly one same-category reference to the current
canonical version, and original named/expandable roles for relationships.
Metadata-only changes do not need a text archive, but existing canonical IDs
receive a version bump whenever their text or metadata changes.

These JSONs supersede fresh generation only. Historical source text, locked
snapshots and read-only originals are never silently upgraded. Runtime migration
of editable copies follows explicit aliases; the parent runtime also remaps
older curated references to canonical versions without altering original text.

## Reproduction and approval

From the application root:

```sh
python3 scripts/apply-atomic-review.py
python3 scripts/build-ingredient-pack.py
PATH=/opt/homebrew/opt/node@24/bin:$PATH npx vitest run tests/unit/atomic-content-data.test.ts
```

The full builder's final hook invokes the same standalone compiler. Normal
reruns recompute the candidate and **verify** the frozen 2.7 approval before
writing derived outputs. They cannot silently reapprove changes. After explicit
editorial review of authoring changes, approval is deliberately opt-in:

```sh
python3 scripts/apply-atomic-review.py --approve-atomic-ingredients
```

Only the first import of the original audit additionally needed
`--audit-directory <path-to-original-audit>`; subsequent builds use the included
complete audit snapshot and have no dependency on a developer's session folder.

The data test started RED with missing-file fallbacks, then passed all eight
schema, semantic, all-original coverage, cast, archival, version and reproducible
generation tests. Once the generated files existed, it was refactored to static
typed JSON imports and schema-parsed ingredient/template arrays, without
explicit `any` types or unsafe casts. It reruns under `PYTHONHASHSEED=0` and `1`,
checking identical hashes for all outputs, approvals and historical banks. An altered candidate
approval is rejected without modifying any file.

The four old live bank/template hashes still match the original audit's
SHA-256 baselines byte-for-byte. Final derived file SHA-256 values:

```text
2aa8f53650b1b7479627e650f0b9377f93befe7d6b87a732cb731c5f56f432ff  atomic-ingredients-2.7.json
a040acd98db5ec7c4f2b3e4e8ba1f1be7eb4e324b2d8077acd080d0170a9020b  atomic-relationships-2.7.json
1e55ff96ee12134f5963e26aae84b26b4a0d7efb2fbd9528613a65b485cad11b  atomic-aliases-2.7.json
7847b49a715f368abd133c39311f8e4c7dbbd4027e162b3e00b4a3b1306fec51  atomic-archive-2.7.json
317fc6a7357d4dd9ba50caf95673c62522d74235ce7e4f7b6bbbe06ef09bf732  ingredient-purity-2.7.0.json
```
