# ADR: Party Night as a hosted deck

2026-10-16 · Implemented in the existing Expo application.

## Baseline and source of truth

Expo 58 / React Native 0.88 / React 19, Expo Router, TypeScript and Zod. `src/domain/contracts.ts` defines validated shared contracts; its distribution copy lives in `contracts/domain.schemas.ts`. `session.ts` owns assignment, rounds, timers, cues, secrets, restoration and actions. `prompts.ts` and `composer.ts` own ingredient selection and deterministic composition. Immutable JSON holds 39 activities, 940 pure ingredients, 96 relationship templates and 281 curated combinations (pack 2.0.0); the older inventory in the brief is historical. `AppProvider` serializes persistence and pauses gameplay in the background. Free play, rounds, named rosters, individual game selection, favorites, saved exact prompts and Studio presets already work.

Baseline validation: 77 unit/integration tests, 21 browser scenarios, strict typecheck and native Hermes export. Existing browser tests cover explicit rounds/free play; new deck scenarios supplement them.

## Decision

Party Night is the hosted experience; Surprise Me opens its minimal setup. Studio is the second primary destination; Explore retains every existing activity and advanced practice. Do not rebuild the app or create a second random-party path.

A recipe references an activity and selects a participation/presentation pattern, ingredient subset, duration, content level and optional curated ingredient pool. A card instance references an existing game round, preserving the exact prompt, participants and private mechanics in that round. Optional `party` metadata extends the existing session with deck preferences/history, re-roll cursor and temporary turn passes. The pure `PartyDeckEngine` chooses compatible recipes with seeded randomness, recent-history suppression, pacing and fair assignment. Existing `prepareRound`, `transitionRound`, prompt/composer and exposure functions remain shared.

Names are optional for Party Night with numbered fallbacks. Existing explicit-game setup remains available. The hosted deck is separate from the existing free-play and scored-round interfaces; all use the same stored session infrastructure. All participation patterns are reusable; no card-specific screen or table.

## Persistence and backend

Retain AppData version 1 and database schema 1. New session metadata is optional and new preferences use defaults. Existing aggregate JSON remains the authoritative complete snapshot on both web and native; normalized native round tables already support the card rounds. No destructive migration, content recategorization or rewrite of saved scenes is required. A server is unnecessary for these local, single-phone features; no account, API key, telemetry or network request is added to gameplay. Feedback is local and can be exported; it is not represented as remotely submitted.

Preserve original saved text, locks and source versions. Restoration pauses active timers and hides private reveals. A finished session cannot be reactivated by cleanup. Clean/classroom eligibility must be enforced during selection and before rendering, including resumed content. 18+ requires affirmative whole-group adult opt-in, never inferred from old preferences. No physical contact, drinking, personal disclosure or humiliation tasks.

## iOS strategy and limits

Continue sharing native components, domain code, bundled content and SQLite. Verify TypeScript, tests and an iOS Hermes export. Visual/manual cues remain usable without speech. No physical device, simulator, signed binary or TestFlight distribution is available in this environment; export is not an App Store readiness claim. Account signing and distribution remain separate work.

## Risks and mitigations

Rapid double taps: serialize UI mutations. Skips and sit-outs: exclude temporary passes from immediate reassignment without charging participation. Pair repeats: prefer least-used compatible pair. Long history: selection reads a bounded recent window and anti-repeat content history; keep exact persisted cards for session resumption. Storage quota errors remain visible. Recipes/content versions are captured on each card; unknown recipes can safely fall back to their archived activity round. Preserve fast startup, direct icon imports, web font compression and delayed offline precaching.

The uploaded implementation brief ends midway through section 6C at an approved situation example. Requirements beyond that boundary were not supplied; the earlier review is context, not evidence of a missing feature.

## 1.3 alignment correction

The earlier opt-in-only scene simplification is superseded: mixed short scenes are the default, private-role cards remain manually available, and inline rerolls match the supplied examples. Full eligible Explore catalog is visible directly. Names are optional in every setup. Returning groups and Studio handoffs avoid repeated setup.

Party state adds defaulted archived players and an optional explicit turn cursor; cards optionally capture team ID and deal-time names. Preferences add a nullable remembered party group. Older cards retain their snapshots, original content versions and existing includeScenes preference. Roster changes archive removed IDs and deal a new Clean card; renames retain the current card. Native aggregate/schema versions stay at 1. Current seat projections are replaced transactionally to avoid duplicate seat indexes, while archived player records preserve foreign-key history.

Team turns reuse existing teams; scoring stays off. Feedback shares UI/storage across experiences and optionally stores the exact Studio snapshot. Composition no longer forces independent situation clauses onto a relationship with a generic “For…” prefix; unmerged values are displayed separately. No additional selected categories or creative details are introduced.
