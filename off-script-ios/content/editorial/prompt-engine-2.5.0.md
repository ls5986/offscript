# Prompt engine review: 2.3 → 2.4 → 2.5

The JSON reviews are the approved, complete snapshots for their respective stages.
Do not rewrite a historical review to match today's wording.

| Stage | Scope                                                                        | Historical behavior                                                                                                                                                                                                          |
| ----- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.3   | Category-purity review and reusable decomposition                            | Combined originals remain archived; explicit upgrades resolve to today's approved ingredient.                                                                                                                                |
| 2.4   | All 96 locations become short place names                                    | Detailed places remain versioned originals. `Repair shop` stays `Repair shop` in 2.5.                                                                                                                                        |
| 2.5   | Complete review of 1,182 ingredients and 96 unchanged relationship templates | Twenty-four bounded text edits: sixteen emotions and eight existing Party scene seeds; additive task-fit tags; seventeen complete-clause metadata corrections. No ID, rating, existing task tag or template text is removed. |

## Bounded editorial decisions

- Beginner emotions remove unnecessary qualifiers: _Barely contained excitement_
  becomes _Excitement_, _Careful vulnerability_ becomes _Vulnerability_.
  More nuanced alternatives such as _Bittersweet happiness_ stay available.
  Emotion Remote uses fifteen explicitly reviewed beginner cues.
- World's Worst uses twenty-three recognizable clean professions, including
  jobs from both flavor banks. Eight existing spicy professions remain targeted
  to the spicy audience. Whimsical jobs remain in Studio rather than being
  deleted or blanket-relabeled.
- Expert Interview and Character Hot Seat likewise use those eight existing
  spicy professions at spicy/18+ levels. Clean profession draws stay clean;
  their other practice ingredients retain their own category policies.
- Terrible Advice uses only its sixteen clean or twelve spicy authored requests.
  The existing `party_advice` tags, literal text, IDs and question/example
  provenance remain unchanged.
- Exactly eight existing Party scene seeds (four clean, four spicy) replace
  recurring bureaucratic props with immediate human stakes: closing an elevator
  on your boss, taking credit for the same idea, or discovering mismatched
  relationship expectations. These are scene seeds, not advice requests. Their
  ratings, IDs and exact tags remain unchanged; every 2.4 original is archived,
  and each entry advances from version 1 to version 2 only once.
- Association Chain uses twenty-five existing, simple object names. Character
  Walk uses six existing mimable physical tasks, not abstract roles or emotional
  adjective combinations. Make the Mundane Matter keeps an ordinary action and
  object; Who, What, Where keeps a relationship, action and place.
- Complete sentences such as _Your restaurant’s only review was written by a
  pigeon_ are marked as clauses, never joined as “with a your …”.
  No runtime code truncates or removes creative words.

The completed 2.5 review records 24 text corrections, 119 metadata corrections
and 126 unique changed entries, with overlap between text and metadata changes.
All 1,182 ingredients and 96 templates remain reviewed. The archive contains
583 preserved originals; the eight Party revisions each add one 2.4 original.

## Engine behavior versus content edits

`relationshipRoleText(template, index)` retains every fixed role verbatim and
continues expandable numbering at the next performer slot. All forty-four
ensemble templates now produce unique labels through twelve performers.
Generating new assignments or explicitly upgrading an unlocked editable copy
uses the helper; loading and locking a saved snapshot never rewrites its labels.

Composition has its own optional flag. Explicit `false` suppresses composed
output; explicit `true` enables it independently of selection style. An omitted
flag preserves a previous value, and old snapshots without the flag retain
legacy composition. Surface places use “on a bridge / rooftop / beach” rather
than “in a bridge”.

A new connected draw still favors a curated match. Subsequent draws consider
fresh entries before narrowing to archival links, so a locked Hotel no longer
alternates back to the hat policy on every second draw. History resets only when
the broader eligible flavor/task pool is exhausted.

## Reproduction and verification

From the project root:

```sh
python3 scripts/build-ingredient-pack.py
npm run content:validate
npx vitest run tests/unit/composer.test.ts tests/unit/ingredient-purity.test.ts \
  tests/unit/simple-suggestions.test.ts tests/unit/v1-prompts.test.ts \
  tests/unit/v1-game-prompts.test.ts tests/unit/v1-party-tone.test.ts
```

The generator reapplies the immutable 2.3 and 2.4 stages before applying the
approved 2.5 review. It rejects unapproved text or metadata differences.
Regeneration is byte-identical for all v2 JSON files and the 2.5 review.
Archived sources keep their original pack/version/text; their ingredient links
point to the current approved versions. Saved snapshots retain their own literal
text and provenance until an explicit, unlocked-copy upgrade.

The unpublished 2.5 review's eight-scene completion was approved once with
`python3 scripts/build-ingredient-pack.py --approve-party-scenes`. That explicit
authoring path rejects amendments to any other existing entry, IDs, tags or
ratings; normal generation never changes the approved review.
