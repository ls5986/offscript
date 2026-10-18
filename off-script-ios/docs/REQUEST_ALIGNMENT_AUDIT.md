# Off Script — request alignment audit

Reviewed 2026-10-16 against public Sites version 10 and source commit `3e901738a71a1cc5c666dc0149dfee2ffd1cf71a`.

## Finding

The application has a real continuous Party Night engine and a functional Prompt Studio, but the implementation does not fully match the requested UI and product behavior. Earlier completion summaries blurred functional availability, discoverability and fidelity to the supplied examples. Passing engineering tests did not establish that the requested experience had been delivered.

The most consequential drift happened in the latest simplification: New Word was moved away from the card, while scene and private-role cards were excluded from default automatic selection. Those were implementation choices, not explicit changes requested by the owner. The supplied card examples and pacing requirements should have remained the acceptance criteria.

This is a review artifact. No application code or public deployment was changed during this audit.

## Inputs reviewed

1. Original `OFF_SCRIPT_ALL_IN_ONE_CODEX_PROMPT.md`, particularly sections 1, 3.1–3.5 and 6: immediate play, returning one-tap play, optional names, task-based navigation, live controls, visual direction and Studio.
2. The earlier six-page UI/brand review: real fonts, persistent play controls, accurate named roles, result-first Studio, compact discovery, contrast, distinctive card mark and real-person usability testing.
3. The uploaded “Party Night + Prompt Studio as the Two Flagship Experiences” review and implementation prompt, including the exact card examples and sections 3–6C.
4. The explicit Prompt Studio composition refinement supplied separately in chat.
5. Current Home, setup, Party Night, Studio, Explore, Saved, Settings, shared engines and content definitions; captured UI evidence and the previous public smoke result.

The uploaded refinement ends during section 6C. All findings below are grounded in requirements that were received; that boundary does not explain or excuse the mismatches.

## Requirement comparison

| Requested | Current implementation | Verdict |
| --- | --- | --- |
| Party Night and Prompt Studio lead; Explore and Saved remain accessible. | Home has Start Party Night, Studio and Explore modules, Saved access and four navigation destinations. | Implemented structurally. The relative visual prominence still needs a task-based usability check. |
| Minimal first-time setup: 2–12 people, optional names, then play. | Party Night has a counter, optional-name disclosure and Deal first card. No account, score, duration, game or skill selection is required. | Implemented for Party Night. |
| Original returning-user requirement: saved group count, one tap to a fresh playable activity. | Home always opens PartySetup, requiring another tap to Deal. Resuming an existing session is separate and does work. | Missing for a fresh returning session. |
| Continuous Card → Next → different activity without setup or mandatory review. | PartyDeckEngine creates persistent cards and reuses the active group. Next/Skip/Replay/New Prompt, save/leave, resume and end exist. | Implemented. |
| Pickup Lines example explicitly shows `[New Word] [Next Card]` together. | Next and Skip are fixed on screen; New Word/New Prompt are inside Party menu. | UI mismatch. The function exists but is not where requested. |
| Named pair/person is prominent, followed by activity, prompt and a short instruction. | Names/Everyone appear in a badge inside a reusable card, below a small activity label. Prompt and instructions share the card. | Partially faithful. The information exists; the hierarchy was reinterpreted rather than matched to the examples. |
| Default pacing favors short social games, rapid jokes, easy stories, **occasional short scenes**, and varied participation. | `includeScenes` is false by default. Automatic selection excludes PAIR, SMALL_GROUP, TIMED_SCENE, CUED_SCENE and PRIVATE_ROLE patterns unless enabled. | Departed from the brief. Simplifying the presentation should not have removed the requested default variety. |
| New Choice and other appropriate scenes belong in the mixed party experience. | They are implemented and can be chosen manually or enabled in preferences; they do not naturally appear in a fresh default deck. | Capability present; requested default experience incomplete. |
| All nine reusable participation patterns. | All nine have recipes. A default four-person Clean deck currently uses only ALL_PLAY, SINGLE_PLAYER, TURN_BASED and OPEN_MIC. | Infrastructure implemented; the default experience exposes only four patterns. |
| Everyone, individuals, pairs, groups, teams where appropriate, volunteers. | Everyone/singles/pairs/groups/open mic exist. Party sessions explicitly have no teams. Team scoring exists in the older round interface. | Partial; Party Night team participation is missing. |
| Effortless passing, sit out, rejoin, fair assignment. | Skip is visible; per-person passing and sit-out/rejoin live in the menu. Shared assignment and pair fairness exist. | Functional, but individual passing takes several interactions. |
| Clear player management; original brief allows changing group size during the session. | Party menu can pass, sit out or rejoin existing people. It does not add new players or rename them. | Partial. Existing roster controls are narrower than the requested player-management flow. |
| Easy turn-based play without needing a host. | Turn-based instructions say to go around the group, but the latest card simplification removed named turn controls from the visible Party interface. | Partial. The group can play, but named turn guidance is weaker than the hosted promise. |
| Explore exposes the full catalog without an unnecessary entertainment/practice choice. | All 39 activities are preserved, but Just Riff filters the list and Full catalog switches the preference to Improv Practice. | Catalog preserved; discovery UX remains unnecessarily gated. |
| Experienced users can start a chosen exercise with little setup. | Individual games and Studio→Scene Lab still use the older setup with Free play/Rounds and mandatory names. | Partial. These routes retain the setup burden that the new product direction sought to reduce. |
| Standalone Studio; any of ten ingredient categories; simple relationship/location generation. | Standalone Studio has ten categories, Relationship only/Location only shortcuts, locks, individual rerolls, presets, performer counts and saved prompts. | Implemented. The fresh view still includes flavor/count choices before results; simplicity needs user validation. |
| Pure ingredients and deterministic natural composition, exact values retained, no unselected categories. | Separate ingredients, provenance, locks, composed output and fallbacks are implemented; 281 archived combinations remain linked. | Implemented with regression coverage. Naturalness across every possible combination still requires editorial review. |
| Clean, Spicy and affirmative adult opt-in with safe passing and return to Clean. | Recipe-level eligibility, adult group confirmation, classroom override and return-to-Clean controls exist. | Implemented functionally. |
| Broader adult humor across suitable formats. | Five Spicy variants use P5/W1/W4/G2/T1, with 16 added spicy situations; P2 remains the only adult-only format. | Partial content expansion, not a broad adult-content editorial pass. |
| “Funnier and easier”: dry, observational, petty, awkward, concise and immediately playable. | Plain-language playbooks, earlier playful content and the latest 24 clean/16 spicy situation additions exist. Much material remains derived from the original library. | Partially addressed. No real-group study establishes that the content is funnier or easier. Content quantity and code tests are not evidence of humor quality. |
| Shared activity/content/session infrastructure; no separate apps or unnecessary server. | One Expo app, shared domain functions, activity-referenced recipes and existing IndexedDB/SQLite persistence. | Substantially implemented. No remote backend was required by these local features; the original spec explicitly excludes one. |
| Consistent saving, favorites and feedback across experiences. | Favorites and exact prompts use shared persistence. Card feedback UI exists in Party Night and is local/exportable; it is not a uniform UI across Studio and individual games. | Saving substantially implemented; feedback consistency partial. |
| Large readable host/display mode. | Studio and the classic session have Large Display. Party Night lacks a comparable explicit presentation control. | Partial across the product. |
| Shared native iOS architecture and release preparation. | Expo/native components, SQLite and EAS profiles exist; iOS Hermes exports pass. No physical device, signed build or TestFlight distribution was tested. | Architecture prepared; native release verification incomplete. |

## What the earlier UI/brand recommendations did receive

- Original conversation/card mark, stable outlined wordmark, app icons, category glyphs and sharing assets replaced the generic creativity symbol.
- The original navy/cream/lilac/coral direction and serif/sans pairing were retained, as the visual brief requested.
- Public font delivery was repaired; WOFF2, explicit fallbacks, direct icon imports and deferred offline downloads were added. Earlier performance measurement showed improvement; no new physical-device performance result is claimed here.
- Contrast tokens were improved; classic play controls became persistent; named roles resolve actual player IDs.
- Studio results and Generate became prominent; category controls moved into Customize. Explore filters were condensed.

Those are real completed changes. They do not establish complete UI fidelity or replace the usability exercises proposed in the review.

Remaining presentation issues are partly design judgments rather than missing functions: the large editorial Home hero consumes substantial phone space, secondary destinations can require scrolling on smaller screens, small tracked labels remain, Saved uses five collection tabs, and the product still uses overlapping vocabulary such as games/cards/scenes/sparks and Just Riff/Practice. The original visual spec itself asks for a friendly editorial style; it does not specify copying Picolo's palette, typography, swipe gesture or exact screen design. The clear contractual gaps are the ones tied to the supplied interactions above.

## Why the last update drifted

I interpreted “still confusing” as a request to remove more controls and exclude more complex cards. That produced a cleaner-looking card but changed the product's default mix and hid an action explicitly shown in the example. I also treated “available somewhere in the application” as close enough to “obvious and usable in this flow.” It is not sufficient for this brief.

The reported test counts validated behavior such as persistence, eligibility and Next/Skip. Some tests then encoded my revised decisions—for example, twenty default cards with no scene starts—instead of checking the supplied mixed-card examples. That made a green test result look more conclusive than it was.

## Corrections in priority order

1. Use the provided Pickup Lines, New Choice, Fortunately/Unfortunately, World's Worst and Terrible Advice examples as explicit UI acceptance scenarios. Keep their required card actions visible and make the selected person/pair obvious.
2. Restore an easy mixed default deck that can include occasional short pair/cued scenes. Keep advanced or long formats optional; do not equate every pair or scene with an advanced game.
3. Keep New Word/New Prompt beside Next where the game needs that quick action. Place detailed rules, saved collections, settings and optional scoring behind progressive disclosure.
4. Implement a one-tap fresh start for a returning group, with a clear way to change people. Support editing names and adding/removing players safely between cards.
5. Make Explore show the complete eligible catalog directly; use optional task/skill filters rather than changing a user identity preference to reveal it. Reduce setup on selected-game and Studio handoff routes.
6. Complete missing participation/host controls where appropriate: named turn guidance, teams and a clear shared display mode.
7. Conduct an editorial pass on actual generated cards, not just ingredient banks; then observe unfamiliar friends and instructors using the intended flows without explanation. Evaluate funny/easy feedback separately from engineering correctness.

## Evidence anchors

- Explicit Home setup routing: `src/screens/Home.tsx:138`.
- Default scene exclusion: `src/screens/PartySetup.tsx:24`, `src/domain/party-contracts.ts:21`, `src/domain/party.ts:77`.
- Main dock vs menu actions: `src/screens/Party.tsx:290` and `src/screens/Party.tsx:479`.
- Current card hierarchy: `src/components/PartyDeckCard.tsx:48`.
- Party teams cleared: `src/domain/party.ts:319`.
- Existing-roster-only party controls: `src/screens/Party.tsx:555` and `src/domain/party.ts:386`.
- Explore filtering: `src/screens/Games.tsx:142` and `src/screens/Games.tsx:235`.
- Mandatory names on classic setup: `src/screens/Start.tsx:73`.
- Studio single-category shortcuts: `src/screens/Studio.tsx:444`.
- Shared content additions: `src/content/v2/party-ingredients.json` and `src/domain/party-recipes.ts`.

Read-only seeded audit: 201 cards for a four-person default Clean party produced 12 activities (P1, P3, P4, P5, P6, T2, W1, W2, W3, W4, W6, W8), with four participation patterns and no pairs/scenes. The full Party catalog has 28 recipes across 23 activity IDs. This confirms the default exclusion; it is not a usability or humor study.

## Corrections implemented after this audit — 1.3

The comparison above records the reviewed version 10; it is retained as historical evidence rather than rewritten as if the gaps never existed.

| Finding | 1.3 correction | Evidence |
| --- | --- | --- |
| Hidden reroll; reordered card hierarchy | People first; New Word/New Prompt beside Next Card; short game-specific instruction | `PartyDeckCard.tsx`, `Party.tsx`; `alignment.spec.ts` supplied examples |
| Default scene exclusion | Balanced mixed default with a short scene in each compatible five-card stretch; quick card after a scene; private roles manually available | `party.ts`, `party.test.ts` |
| Repeated returning setup | Remembered party group; one-tap fresh Clean deck; separate Change players and Resume | `Home.tsx`, `AppProvider.tsx`, browser alignment scenario |
| Restricted player controls | Edit/add/remove/rename, archived actor IDs and deal-time names; changed group gets a fresh Clean card | `editPartyRoster`, native repository round-trip test |
| Missing named turns/teams/display | Optional named turn guide/pass, team turns without scoring, editable teams, Large Display | Party domain and browser alignment scenarios |
| Catalog gate and old setup burden | Full eligible catalog directly, optional filters; optional names/settings; direct remembered-game and Studio handoff | `Games.tsx`, `Start.tsx`, Studio handoff regressions |
| Content review incomplete | 94 task-specific additions; eight Spicy formats; concise canonical rules; 31 generated recipe samples reviewed | `CARD_EDITORIAL_SAMPLE.md`, `review-party-cards.ts` |
| Feedback inconsistent | Shared choices in Party, Studio and individual games; local/exportable records | `Feedback.tsx`, alignment feedback scenario |
| Large marketing Home | Compact app-first Home with the two experiences and direct task controls; existing brand retained | updated phone screenshot |
| Lost unmerged Party ingredients | Show remaining ingredient values on the card; avoid forced independent-clause joins | `PartyDeckCard.tsx`, composer regressions |

Human usability/humor research and physical-iPhone/signed release checks remain unexecuted. Automated and editorial checks are reported separately in BUILD_REPORT.md.
