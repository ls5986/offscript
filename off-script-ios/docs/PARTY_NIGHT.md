# Off Script 1.3 — Party Night and Prompt Studio

## Current 2.7 ingredient independence

The shared generation bank now contains only independent ingredients.
Complete advice requests stay in their own game pool; bundled scene seeds
become neutral complications instead of assigning an unselected relationship,
prop, place or job. Historical words remain exact and explicit upgrades change
only selected categories. Studio's ensemble cast persists through replay.

See [authoring and source preservation](ATOMIC_27_CONTENT.md) and
[executed verification](ATOMIC_27_VERIFICATION.md). The 2.6 introduction below
records the preceding source expansion; it is not the current purity policy.

## Current 2.6 material expansion

The [material guide](PARTY_MATERIAL_AND_HINTS.md) describes the
additive Spicy/18+ banks and selected-level delivery. Opening-line hints have
been removed; Party round limits remain in How to Play instead of a card badge.
The generated [prompt review](prompt-review/REVIEW.md) compares
the approved content versions and actual current outputs.

## Current v1 usability behavior

Read [V1_PLAY_EXPERIENCE.md](V1_PLAY_EXPERIENCE.md) for the current implementation.
Party stays in the chosen game by default. Quick games suggest reader-first
social turn-taking, with no required tap after each answer. The group can keep
going with more responses. Another word/job/place/prompt is distinct from Change game.
Optional shuffling is explicit, and default game choices are a small quick mix.
Roles, scene controls, private handoff and movement remain game-specific.
Cards focus on the prompt, roles and playable frame. Detailed directions,
advice examples and suggested lengths live in How to Play. Nobody is required
to stop at a suggested length; optional timers do not end the current card.
The Party menu's **Hide this game type** action excludes the current type from
this party and future remembered decks, across all material variants. It
preserves the current card and history; use Choose games to include it again.
An empty resulting selection prompts Edit deck instead of adding other games.

New Choice uses a separate named human caller; see
[New Choice and host roles](NEW_CHOICE_AND_HOST_ROLES.md). Content pack 2.5.0
has 1,182 active ingredients and 583 preserved originals. Studio composition
is optional, and generation remains available in Large Display. Feedback
sharing never claims that a local rating was automatically sent.

## Historical 1.3 introduction

The following section records the earlier mixed-deck release design, not the
new default progression. Its old card labels/counts are historical.

Party Night and Prompt Studio lead a compact app Home. Explore shows all eligible games immediately (38 Clean, plus the optional adult format). Quick games, group size, experience, skill search, movement and family are optional filters, not a prerequisite identity choice.

First-time Party Night: 2–12 people → optional names and game choices → Deal first card. Returning: Start Party Night deals a fresh Clean deck with the remembered group and game selection in one tap; Change players and Choose games open setup separately. If a saved selection has no playable Clean games, setup explains the issue rather than silently adding other games. Resume continues an existing card. No account, mandatory scoring, duration or skill selection.

## Cards and pacing

A card shows people first, activity, creative input, a short instruction, who contributes and how, and when to move on. New Word/New Prompt sits beside Next Card. Skip, Pause and How to Play are visible. Turn-based cards offer optional named turn guidance, Next turn and Pass turn. Cue scenes offer a Start action, automatic visual cues and a manual cue button. Sound and timers are optional. Reaching zero never deals another card.

The balanced default deck mixes quick jokes/stories/social games with occasional short scenes: a short scene appears within each five-card stretch when compatible. A scene is followed by a quick card when the selected deck permits it. Movement is off; secret-role games are off in the default mix but may be explicitly included or played directly. Turn off Mix in short scenes for an entirely untimed automatic deck. Advanced and instructor-led formats remain in Explore.

## Choose your deck

**Choose games** appears in setup and the Party menu. Each Party-supported game has an include toggle and a short description. Select all games, Clear selection and Use default mix are explicit actions. Adult-only descriptions appear only after adult confirmation; Classroom clean still overrides adult settings. Group size, movement, content level and the short-scenes preference still determine which included games are currently playable.

Changes keep the current card and apply to subsequent deals; they are remembered for both normal setup and one-tap returning starts. A one-game deck may repeat that game. A scenes-only selection is not broadened by rotation or pacing. Empty, unsupported or currently unplayable selections show an error instead of restoring unwanted games. Private-goal scenes require explicit inclusion. **Play a game now** chooses a single next card from included compatible games; replay cannot restore an excluded game.

Returning to Clean always hides an adult card immediately, even if the custom deck contains only adult games. In that case, **Edit deck** asks the group to select an eligible game without changing their exclusions automatically.

Selection is stored as nullable `selectedActivityIds` in Party options and `selectedPartyActivityIds` in preferences. `null` retains the historical default mix; a custom array is a strict allowlist. Optional defaults keep older native/browser saves readable without a storage reset.

## What a turn means

The round limit appears above the creative input, not only at the bottom of the instructions. These are concrete stopping rules, not “keep going until ready”:

| Format | Stop after |
| --- | --- |
| Independent jokes / Terrible Advice / Never Say That | One answer or pass per participating player |
| World's Worst | One short attempt by the named player |
| Character Hot Seat | Three questions and answers total |
| Scenes, interviews, infomercials and shared-memory scenes | 60 seconds |
| Shared stories, association and listening echo | Two turns per person |
| Word-at-a-Time Story | One sentence or 12 words total, whichever comes first |
| Three-Line Scene | Three spoken lines total |
| Mirror | Three slow movements led by each partner |

Players tap Next Card themselves; these limits do not add automatic card changes or speech recognition. Existing timers remain available, and their end message tells players to stop.

Terrible Advice addresses a fictional friend's problem. All 28 curated situations have an explicit advice question and matching sample reply in the [advice task metadata](../src/domain/party-advice.ts). For the plane-clapping situation, the question is **How do I live down the embarrassment?** Each player offers one sentence of silly, harmless advice or passes; answers do not build a continuing story. Example reply is optional on the card and the same context/example appears in How to Play, rather than an unrelated work example.

Captured ingredient text, locks and source versions remain exact. Context is game-specific display metadata, not an automatic rewrite of saved prompts. Unrecognized originals show an explicit missing-request message rather than inventing a mismatched problem.

31 recipes reference 23 existing activities and all nine participation patterns. One shared engine selects compatible cards with deterministic randomness, recent-history suppression and fair participant/pair assignment. Optional team turns alternate teams on suitable joke/open-mic cards without requiring points. Team names and membership can be changed in Players.

## People, host controls and persistence

The People button opens in-session player controls: pass, sit out/rejoin, rename, add or remove. New people receive new IDs; removed people remain archived for historical cards. A changed membership deals a fresh Clean card and clears adult confirmation. Renaming preserves the current card. Card-time names are retained for recap history. Players remain editable between cards without repeating setup.

Large Display enlarges the shared card. Pause, cues, optional timer restart/disable, Replay, Play a game now, Choose games, Save & leave and End Session remain available. Private handoffs cover on background/navigation/reload and after a 20-second reveal timeout. Finished sessions cannot be reactivated by navigation cleanup.

Exact prompts, favorites, sessions and feedback use the shared local repository: IndexedDB on web and SQLite on native. Optional fields/defaults preserve old saved data. SQLite rewrites the current seat projection safely when players change, retains archived player records and keeps historical rounds/participants. No server, account, cloud sync or runtime AI is needed for the single-phone experience.

Feedback uses the same four choices in Party Night, individual games and Studio. It stays on the device and is exportable in Settings. Prompt feedback retains the exact snapshot.

## Prompt Studio and content

One category returns only its pure ingredient. Multiple categories use deterministic, concise composition with exact ingredient values and source versions stored separately. Locks and rerolls keep other ingredients fixed. Independent clauses and other awkward joins remain visible separately rather than being forced into an unnatural sentence. Party cards also show any ingredient outside their composed premise, including initial Emotion Remote emotions.

All 463 original combined examples remain curated relationships between ingredients. Studio handoff launches Scene Lab directly using the already-selected count and exact snapshot. A chosen individual game can reuse a compatible remembered group directly; setup otherwise permits numbered fallback names, with Free play/Rounds and names in optional disclosures.

Pack 2.3.0 includes 1,182 ingredients, 96 neutral relationship templates, 160 joke words, 60 secret objectives and 40 quirks. This update adds 94 ingredients: short social observations, first-person advice problems and dating/flirting material across eight Spicy formats. Card instructions retain the actual rules (three lines, association, echo, shared memory, mirroring, etc.). See [CARD_EDITORIAL_SAMPLE.md](CARD_EDITORIAL_SAMPLE.md) for all 31 generated recipe samples; editorial review does not establish how funny unfamiliar groups find them.

## Native release limits

Shared native components, SQLite, EAS profiles and Hermes export remain supported. This workspace does not provide an Apple simulator, physical iPhone, signing or TestFlight distribution. Those checks are separate from the public web release.
