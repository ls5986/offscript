# Bounded adult-tone authoring — content pack 2.6.0

This pass adds content, not game rules. The 1,182 existing ingredients keep their
exact IDs, text, ratings, tags, grammar metadata and versions. The 96 relationship
templates and the 2.3/2.4/2.5 editorial approvals are unchanged. Existing Clean
content is not rewritten to make adult decks larger.

## Inventory

| Input                                                                     |  Spicy | 18+ (`mature_suggestive`) | Total new |
| ------------------------------------------------------------------------- | -----: | ------------------------: | --------: |
| Scene situations, `party_seed`                                            |     32 |                        32 |        64 |
| Advice situations, `party_advice`, **not** `party_seed`                   |     16 |                        16 |        32 |
| Recognizable dating/adult-topic jobs, `party_seed`, `familiar_profession` |      8 |                         8 |        16 |
| Short locations, `party_seed`                                             |      8 |                         8 |        16 |
| Spoken opening lines, `party_seed`                                        |      8 |                         8 |        16 |
| **Total**                                                                 | **72** |                    **72** |   **144** |

There are **1,326** live ingredients. Every new record is version 1 and supports
2–12 players. Spicy situation IDs are `prompt_situation_3000`–`3047`;
18+ situation IDs are `prompt_situation_3100`–`3147`. Within each range the
first 32 are scenes and the last 16 are advice. Profession, location and
opening-line categories each use suffixes `3000`–`3007` and `3100`–`3107`.

## Tone and editorial limits

Spicy offers focus on flirting, mistaken expectations and awkward dating.
18+ offers add fictional adult sleepovers, implied consensual intimacy,
breakups, shared money and commitment. Jobs have a recognizable dating/adult
topic in the actual text (for example Matchmaker, Divorce lawyer and Intimacy
coordinator), not just a higher rating on a generic job. They are not built-in
punchlines. Places remain short labels, with the eight new 18+ places explicitly
carrying familiar adult context (for example Divorce court and Adults-only
resort). The existing Honeymoon suite and Couples retreat are preserved rather
than duplicated.

No new offer asks players to disclose real experiences. There is no graphic
sex, minor-focused content, coercion, harmful instruction, identity-based
targeting or humiliation task. Players invent characters. Advice examples are
harmless fictional suggestions, not useful real-world relationship advice.

The new situations leave a conversation to play rather than resolving it with
a joke. For example:

- Spicy: “You each thought the other person was paying for the first date.”
  Optional start: “I thought you were treating me tonight; did we get our
  wires crossed?”
- 18+: “Your partner thought the romantic hotel booking included separate
  rooms.” Optional start: “I booked one room for us; would you prefer me to
  change it?”

The old bureaucratic/whimsical offers remain historical content; this additive
pass does not expand that pattern or silently replace those sources.

## Historical starting dialogue metadata

Opening-line hints were subsequently removed from the application. This
authored metadata remains part of the immutable editorial review only:
it is not loaded by prompt generation or displayed in any game/help surface.
The description below records that retained authoring format, not a current
UI feature.

`src/content/v2/party-opening-hints.json` contains exactly **154** objects:
90 existing scene situations plus 64 new ones. Each has exactly:

```ts
{
  id: string;
  text: string;
  openingLine: string;
  contentRating: string;
}
```

`id` and `text` identify the exact source; `contentRating` duplicates its
classification for validation. `openingLine` is a short first-person contextual
offer, not a polished punchline or scene summary. It has no game-specific
“Fortunately” prefix. Opening-line ingredients are already spoken inputs and
receive no extra hint. Advice situations receive no scene hint.

The requested source `prompt_situation_2023` keeps its original text and uses:
“I think we need to replace Diana; she keeps telling the group chat the wrong
thing.”

`src/content/v2/party-advice-expansion.json` contains **32** objects of shape
`{ id, question, example }`. Each question ends with `?`; each harmless example
starts with `You should `. Each new problem is explicitly authored in the
fictional requesting friend's first-person voice (`I` / `My`), not rewritten
at runtime. The existing advice export adds these to the
unchanged 28 requests, giving **60** total. Its exact-source-text lookup guard
is retained.

## Authoring, review and regeneration

- Explicit authoring source:
  `content/editorial/party-authoring-2.6.0.json`. Scene text and its opening
  dialogue are authored together. Historical hints are keyed to source IDs.
- Complete approval:
  `content/editorial/ingredient-purity-2.6.0.json`, including the complete
  preceding 2.5 entries, all approved current entries/values, unchanged
  relationships, added IDs and the exact two metadata arrays.
- Additive materializer: `scripts/apply-party-expansion-review.py`. It verifies
  the complete old baseline before producing the three new runtime JSON files.
  An absent approval requires explicit `--approve-party-expansion`; normal
  regeneration checks the existing approval without rewriting it. Unpublished
  editorial revisions require that same explicit flag to approve again.

Regenerate with:

```sh
python3 scripts/build-ingredient-pack.py
npm run content:validate
npm test -- tests/unit/tone-expansion.test.ts
```

The generator runs the historical 2.3 → 2.4 → 2.5 passes before the additive 2.6
pass. It never feeds the new expansion into the historical passes. Two complete
regenerations reproduced all 12 runtime-bank/editorial-approval JSON files
byte-for-byte during this change.

Automated checks establish counts, provenance, source-exact metadata, rating
coverage and repeatable authoring. They do **not** prove a prompt is funny,
natural aloud or comfortable for every group; those remain editorial and
playtesting judgments.
