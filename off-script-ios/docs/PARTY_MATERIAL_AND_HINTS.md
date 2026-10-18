# Party material levels

## The selected version must reach the card

Clean, Spicy and 18+ control the permitted material. The strongest reviewed
input eligible for the category and actual cast takes priority:

- on the first deal;
- when staying in the same game;
- on another prompt;
- when optional shuffling chooses that game;
- and when deliberately choosing the game from the menu.

The current card is not silently rewritten merely by reopening a saved session.
Subsequent generated material follows the current eligible level. Explicit old
recipe IDs remain readable for saved-game compatibility.

An honestly neutral input can remain Clean at a higher level. When a category
or cast has no stronger eligible value, its lower-rated scaffold stays
available; no relationship, prop or extra category is inserted to manufacture
an adult version. Rating labels are not inherited merely from an earlier
bundled scene.

Adult variants require affirmative group consent. A new group still confirms
consent, and Classroom clean overrides both Spicy and 18+. Neither higher
setting requests real personal disclosures, touching or dares.

The two levels have different editorial jobs:

| Material | Direction |
| --- | --- |
| Spicy | Attraction, mixed signals, suggestive misunderstandings and social embarrassment without assigning a particular pair's relationship |
| 18+ | Non-graphic intimacy/sexual misunderstandings, appropriately adult occupations and dialogue, within the chosen categories |

Ordinary jobs and places remain short ingredients. Their context can be adult
without describing explicit acts. The game supplies the performance task.
Pickup Lines, 185 and the adult analogy format can still use ordinary noun
topics; their sentence structure supplies the wordplay.

## Independent content pack 2.7

The shared bank contains only reviewed independent ingredients. A Situation
must not choose casual partners and a toothbrush. Its neutral core can say
that something was left behind; the relationship and object are separate
choices where those categories are selected and eligible.

Complete first-person advice problems stay in a dedicated Terrible Advice
input pool. They do not enter Studio or ordinary scene-generation pools.
Names, expanded relationship roles, action targets and opening lines receive
the same independence treatment.

See [current canonical counts, source mappings and authoring
proof](ATOMIC_27_CONTENT.md). All old source records and approvals stay exact.
Historical archives support explicit editable-copy upgrades, not automatic
rewrites. An old adult source does not become Classroom-clean merely because
its newer core was re-rated.

## Historical content pack 2.6

This was an additive content expansion. Its source text, IDs,
ratings and saved originals are retained. The expansion includes scene seeds,
advice problems, professions, locations and opening lines in distinct Spicy and
adult-rated pools. Their prior classification as independent ingredients was
too permissive; the 2.7 review supersedes fresh generation without modifying
that historical approval. See [the historical authored review](SPICY_26_CONTENT.md) and generated
[version/material samples](prompt-review/REVIEW.md) for counts and examples.

The source is the bundled content bank, merged with the existing library by the
content loader. Native/browser saves retain captured prompt values as before.
No remote database, account, runtime AI or destructive local-data migration is
required.

## Streamlined play cards

Opening-line hints have been removed from Party cards, individual games and
How to Play. New generation does not capture hints, and the application does
not load the authored hint bank. The optional schema field remains readable
for old saved snapshots so existing data is not discarded or rejected; its
value is never displayed. Historical editorial approvals retain their original
metadata for reproducible source reviews.

Detailed directions, advice examples and suggested round lengths remain in
How to Play, not on the card. The group can keep going beyond the suggested
length; it is not a cutoff. The card retains the prompt, roles, game-format
starter/advice question and live controls. Optional timers leave play live when
they expire.

## Verification

The regression tests check actual first-deal/round/reroll delivery at the
selected level, new-entry reachability over deterministic seeds, missing adult
consent, ordinary noun frames and old snapshot compatibility. The exact
toothbrush case upgrades only Situation; no prop or relationship is added.
Studio casting survives replay, and plural groups/personal narration compose
without a singular article or forced "where I" clause. Browser checks
verify that the group-chat example has no hint on the card or in help, individual
games have no hint, and Party limits remain accessible through How to Play.

Run `npm run content:validate` and `npm run content:review` to validate the
authored banks and regenerate examples. These checks do not prove that a group
will find a prompt funny; real beginner and consenting-adult playtests remain
important.
