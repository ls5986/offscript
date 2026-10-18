# V1 implementation and verification

Updated 2026-10-17. Application 1.3.0; content pack **2.7.0**.

## Current ingredient-independence correction

The approved per-record corrections are implemented in the separate canonical
bank: 1,154 independent ingredients, 60 neutral role templates, all 1,326
historical source records retained, and complete advice inputs routed only to
their game. Source aliases and exact archives preserve earlier saves.

Verified **314 unit/storage tests across 33 files**, **87 full production
browser tests**, **nine live-preview regressions**, typecheck, lint, content
validation, the six-version/material review and web/iOS JavaScript exports.
The additional 16,384-snapshot matrix and every historical rating/lock/upgrade
probe passed. The final review's retired-source rating gap was reproduced and
fixed before the full passing runs.

Read [the executed verification and limits](ATOMIC_27_VERIFICATION.md) and
[authoring/preservation details](ATOMIC_27_CONTENT.md). The older counts below
are historical records, not the current test totals or atomic-bank size.

## Studio-to-scene ingredient preservation

The initial Act out this prompt handoff retains its exact snapshot. The
reproduced defect was Open Scene regeneration: New Prompt and repeat rounds
used the game defaults and added a Situation. Both now derive categories,
selection style, flavor and composition preference from the current Open Scene
snapshot. Other activities keep their game-specific input policies. No saved
prompt or already-captured scene is silently rewritten.

Verified **254 unit/storage tests across 28 files**, **17 targeted production
browser tests**, typecheck, lint, content validation and web/iOS JavaScript
exports. Six domain cases cover location-only, relationship-only, the selected
pair, explicitly selected situations, other Studio categories and wide-open
input. The actual Studio selection/launch/New Prompt/Replay game flow passed
on production and live development previews, preserving Studio's original.

## Colleague wording correction

One relationship and its template now use Colleagues / Colleague 1, 2, 3...
instead of Office colleagues. All other ingredients and templates are
unchanged. The 2.6.0 approval stays immutable, and the earlier wording is the
584th archived original, available for explicit editable-copy upgrades.
Regeneration reproduced the three changed content banks and both old/new
approvals byte-identically.

Verified 248 unit/storage tests across 27 files, six targeted production
Studio browser tests, typecheck, lint, complete content validation, the
five-version prompt review and web/iOS JavaScript exports. The specific Studio
upgrade also passed on the live preview, retaining the saved original.

## Persistent game-type hiding

Party menu now offers **Hide this game type**, saved atomically to the current
party's game selection and the remembered future-party selection. It excludes
the activity across material variants without rewriting the current card or
history. Choose games can restore it. Hiding the last type leaves an explicit
empty-deck recovery rather than restoring unwanted games; deal controls are
disabled while the selection is unplayable.

Verified **245 unit/storage tests**, **27 targeted production browser tests**,
typecheck, lint, content validation and web/iOS JavaScript exports. Three new
browser regressions also passed on the live preview: Association Chain
exclusion/reload/future-party/re-inclusion, default-deck exclusion across
adult-level changes, and empty-deck recovery. No native-device test is claimed.

## Current prompt-first Party cards

Party cards retain the creative input, roles, playable joke frame/advice
question and live controls. Game instructions, turn-by-turn participation,
stopping paragraphs, advice examples and the caller's volume reminder now
live in How to Play. Standard and Large Display share the simplified layout.
Privacy handoffs, caller assignments, live cues and End game remain available.

How to Play labels lengths as suggested starting points. Groups can continue
past them; Three-Line Scene can continue beyond its suggested three lines.
Timer expiry keeps the current card live and no longer tells players to stop.
Individual practice's structured mechanics are unchanged.

Executed verification: **245 unit/storage tests across 26 files**, **79 full
production browser tests**, typecheck, lint, content validation, the
4,310-generation/448-role review and web/iOS JavaScript exports passed.
Twenty directly affected Party/browser regressions also passed on the live
development preview. The domain check keeps Three-Line Scene live after six
turns and 140 seconds with its original prompt. Screenshots were inspected for
the cleaner prompt/roles/Start layout. No native-device or human-study
validation is claimed.

## Prior card cleanup

Opening-line hints have been removed from Party cards, individual games and
help. New generation no longer captures them. Old snapshots remain readable
without displaying stored hints. The House rule badge is also removed from
Party cards, while How to Play retains its round limit. The expanded 2.6
material and direct End game control remain unchanged.

Verified after cleanup: **244 unit/storage tests across 26 files** and **22
targeted production browser tests** passed, plus typecheck, lint, content
validation, the 4,310-generation/448-role review and web/iOS JavaScript exports.
Four live-preview regressions passed for old saved hints, individual play,
adult/Classroom boundaries and help-only round limits in standard/Large Display.
No physical-device validation is claimed.

The verification records below describe preceding implementations, including
the now-removed hint feature; they do not define the current card layout.

## Prior material and contextual-hint follow-up

- Added **144 ingredients: 72 Spicy and 72 mature-suggestive**, bringing the
  live bank to **1,326**. All 1,182 earlier records remain unchanged.
- Added **154 exact-source first-speaker hints** and **32 advice requests**
  with matching questions/examples; there are now 60 reviewed advice requests.
- Added 12 recipe variants, for **43 recipes across 23 Party activities**.
  Matching selected-level variants take priority on first deal, same-game
  rounds, rerolls and shuffle. Ordinary-noun formats retain ordinary nouns.
- Reviewed actual output, not only rating labels: the new profession and adult
  location banks now supply recognizable dating/adult contexts rather than
  relabeled generic jobs and places.
- Optional opening hints start closed, reset when the source changes and do
  not advance play or modify the prompt. The group-chat spokesperson case
  offers: "I think we need to replace Diana; she keeps telling the group chat
  the wrong thing."
- Captured hints survive snapshot serialization. Legacy lookup requires both
  exact ID and text; unmatched custom wording does not inherit a wrong hint.
  Classroom/private card guards cover the new hint surfaces too.

Final executed checks for this follow-up:

| Check | Result |
| --- | --- |
| Full unit/storage/configuration suite | **247 passed across 26 files** |
| Full production browser suite | **72 passed** |
| Live development hint regressions | **2 passed**, in isolated browser contexts on localhost:8087 |
| TypeScript, ESLint and content validation | Passed |
| Version/material prompt review | **4,310 generation checks**, **448 role checks**, **328 sample rows** |
| Production web/offline export | Passed; 38 local files precached |
| iOS JavaScript/Hermes export | Passed; not a signed native build |

Browser checks cover the exact spokesperson opening, no mutation of the saved
prompt, collapsed hints on the next story, immediate adult delivery, and
Classroom clean hiding both adult cards and hints. The existing caller,
gesture/history, private-role and all-game regressions remain in the full
passing suite. No physical-device or human comedy/usability study is claimed.

See [material and hints](PARTY_MATERIAL_AND_HINTS.md) and the generated
[four-version prompt review](prompt-review/REVIEW.md).
The verification sections below are historical baselines, not current totals.

## Prior prompt-swiping follow-up

Studio and quick Party cards now support left/next and right/previous prompt
browsing. Forward history is replayed exactly before a new suggestion is
generated. The optional bounded timeline holds thirty snapshots, persists in
the existing aggregate and is compatible with older saves without that field.

Back does not rewind game, cast, scores, timers or turn progress. Studio
configuration/lock changes reset browsing, and Party context includes the
round, roster, material, game selection and lock state. Scenes, private
handoffs, New Choice, menus and blocked/busy states do not accept prompt swipes.
Buttons remain available, and ordinary taps do not navigate.

Fresh verification after this follow-up:

- **225 unit/storage tests passed across 23 files**, including actual IndexedDB
  and native SQLite aggregate history round trips.
- **70 production browser tests passed**, including all existing game flows
  and six new gesture/history scenarios.
- All six gesture scenarios passed against the live development preview.
  The initial five scenarios also passed three consecutive runs after fixing
  browser text-selection cancellation.
- Actual browser touch events cover horizontal browsing, vertical scrolling,
  screen-edge/short drags, nested controls, multi-finger input, a stationary
  second finger after responder acquisition, and New Choice exclusion.
- Typecheck, lint, content validation, production web export and iOS
  JavaScript/Hermes export passed. No dependency was added.

The focused review's second-finger cancellation case was reproduced failing,
then passed with latched touch-start cancellation. This is browser touch and
domain/storage validation, not a physical-iPhone gesture certification.

The sections below record the preceding v1 implementation baseline; their
214/64 figures are historical, not the current total.

## Implemented scope

The approved v1 list was implemented as a low-tap experience, not a mandatory
per-answer controller.

| Approved items | Result |
| --- | --- |
| 1-3: Home/startup | Studio visually first; direct Party remains available; no new mandatory mode gate; names optional; group and safe comfort preferences remembered |
| 4-10: Party progression | Reader-first social laps, same input for participating players, task-specific Another actions, explicit Change game, optional shuffle, context-specific controls and honest manually followed house limits |
| 11-13: Selection | Small quick default; all 39 games remain accessible; deliberate advanced/scene choices; strict saved selections, effective default reset and replay eligibility |
| 14-19: Inputs/help/editorial | Shared grammatical starters and game-input policies; familiar professions; actual advice problems; simple association inputs; name-to-role mappings; bounded 24-text review rather than a mass rewrite |
| 20-23: Studio | Independent ingredients; optional persistent composition; legacy output compatibility; grammar/affinity fixes; generation in Large Display |
| 24-28: Correctness/accessibility/settings | Unique expanded role labels; explicit unlocked upgrades; cast-aware passes/resume; narrow/larger-text layout; semantic selected/expanded/current state; effective material labels and scoped consent |
| 29-30: Feedback | TestFlight guidance plus a minimal explicit share/copy flow; no automatic submission/backend, no automatically included player names/private role prose |
| 31: Human beta | Plan and acceptance criteria documented; **not performed or fabricated** |
| 32: Release | Development/configuration/export checks run; **owner metadata, signing, device checks and distribution remain external gates** |

**New Choice addition:** minimum 3 people, 2-4 actors plus one separate caller,
manual-only New Choice calls, real bundled bell, actor-only character generation,
and guards against missing caller even when four actors remain.
Older captured scenes remain readable; callerless/under-capacity scenes cannot
resume as if complete. See [host-role instructions](NEW_CHOICE_AND_HOST_ROLES.md).

## Final executed checks

| Check | Result |
| --- | --- |
| Full unit/storage/configuration suite | **214 passed across 21 files** |
| Full production browser suite | **64 passed**, including all 39 actual game lifecycles |
| Live development preview regression | **14 passed** against owned localhost:8087; caller bell, failure recovery, low-tap flow, feedback, saved composition, small-phone Studio and accessibility |
| TypeScript | Passed |
| ESLint | Passed |
| Content validation | Passed: 1,182 ingredients; 96 templates; 583 preserved originals; 31 Party recipes / 23 activities |
| Version/material prompt review | **3,620 generation checks**, **448 template/count role checks**, **282 representative CSV rows** |
| Web production/offline export | Passed; real bell included and cached |
| iOS JavaScript/Hermes export | Passed; approximately 4.1 MB entry and bundled WAV |
| Clean `npm ci` | Passed: 877 packages, in an isolated manifest/lock fixture so live dependencies were not disrupted |
| Development iOS configuration check | Completed with four genuine owner-value warnings |
| Strict release check | Correctly blocked by missing owner configuration; not bypassed |

The actual Party reroll path was checked separately from the policy helper.
At seeds 42, 124 and 4290000000, twenty same-game World's Worst inputs produced
**16, 13 and 15 distinct jobs**, with zero immediate repeats. The pre-fix path
reproduced only three jobs. The browser test also waits for committed changed
input rather than accepting a label-only or stale-save proxy.

The Bell tests verify HTTP asset/WAV validity and actual browser playing/progress
events, plus visible recovery when playback fails. They do not certify physical
iPhone speaker behavior. `expo-audio@57.0.5` matches the installed Expo SDK's
compatibility map. The generated sound is original; no microphone, recording or
background-audio permission was added.

## Prompt and version review

Read the generated [review](prompt-review/REVIEW.md), [sample CSV](prompt-review/samples.csv)
and [measurements](prompt-review/measurements.json).

- Historical comparison uses immutable approved packs **2.3 / 2.4 / 2.5**.
- Current Party/individual generation is exercised across Clean, Spicy and
  consenting-adult routes where those routes exist.
- Studio ingredients-only and combined views are exercised separately.
- Locked historical repair-counter wording stays exact; explicit editable-copy
  upgrade produces Repair shop.
- The 2.5 pass changes 24 texts and 126 entry versions, retaining all IDs/ratings
  and old reviews. Sixteen emotion revisions and eight ordinary/social scenario
  revisions are bounded editorial changes, not a replacement of the library.
- Generated role labels are unique for every supported template/count.

Structural/grammar checks are not proof that real people understand a game or
find a prompt funny. Small Spicy pools still have a shorter repeat horizon.

## Remaining external release work

The owner must supply:

1. A registered owner-selected iOS bundle ID.
2. The real Expo/EAS project UUID.
3. An approved public privacy policy URL.
4. An approved public support/contact URL.
5. Apple/Expo authorization and signing/distribution setup.

No IDs, destinations, legal pages, credentials or successful upload were
invented. Native audio requires a rebuilt installed app; no IPA, physical-device
bell playback, TestFlight upload or App Store approval is claimed.

Run the small unassisted beginner beta and real iPhone/VoiceOver/Dynamic Type,
SQLite, silent-mode/output, interruptions and airplane-mode checks before public
release. No human study results were generated.

## Dependency advisories

The fresh dependency audit still reports **21 propagated findings: 18 high and
3 moderate**, from `braces`, `node-forge` and `decode-uri-component` chains.
This was explicitly reviewed, not presented as a green security gate.
No forced incompatible Expo/React Native downgrade was applied. The existing
upstream/registry constraints remain separate release-risk work.

All implementation is local on the existing topic branch. No commit, push,
public web deployment, EAS build/signing or App Store submission was performed.
The original localhost:8087 development preview remains available.
