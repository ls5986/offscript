# Off Script 1.2 build report

2026-10-16. Public target: https://off-script-play.lindsey08092.chatgpt.site

## Implemented

Two flagship experiences: hosted Party Night and Prompt Studio. The home and four navigation destinations lead with these experiences, Explore Games and Saved. Advanced individual-game free play, rounds, Just Us, Game Show, Scene Lab and Improv Gym remain available.

Party Night uses 28 versioned recipes across 23 of the existing activities, all nine participation patterns, seeded selection, pacing, game/prompt recency, fair performers and pairs, optional names, passes, sit-outs/rejoin, private handoffs, continuous Next/Skip/Replay/New Prompt, optional timers, manual/automatic visual cues, opt-in speech, favorites, exact prompt saving, safe resume and a recap. Clean is the default; Spicy and affirmative group-confirmed 18+ are optional. Classroom clean overrides resumed content and non-clean saved ingredients. Feedback stays local and is exportable.

Studio retains pure category values, deterministic composition, compatibility selection, 281 curated original combinations, locks, rerolls, presets and legacy saved-scene upgrades. One-tap Relationship only / Location only shortcuts and saved-word display reduce friction. A saved word can also seed an Open Scene.

Data remains local in IndexedDB and native SQLite, through the same session/round engine. New optional fields and defaults preserve previous records. SQLite avoids redundant projection writes for unchanged historical rounds. No server, account, runtime AI or new permissions are required for this single-phone experience. No multi-device sync is claimed.

## Clarity refinement after group-play feedback

Home explicitly says Start Party Night; setup says Party Night and Deal first card. Default automatic picks are untimed and immediately playable, with scene/private-role cards opt-in. One reusable stacked card contains participants, prompt and a short instruction. The party uses one shared modal for menu pages, avoiding overlapping closing/opening dialogs. Next Card is dominant; rules, rerolls, favorites and player controls are in the menu. A 100-card unit run and a 20-card browser flow verify no default timer, private handoff or repeated Start screen. Manual scene selection still works, and enabling scene cards restores the wider rotation. The current content pack and all 39 activities are retained.

## Executed validation

- TypeScript, ESLint, content validation and whitespace checks passed.
- 87 unit/integration tests passed, including deterministic 2–12-player deck runs, all nine patterns, fairness, pair variety, pass exclusion, replay/reroll invariants, adult/classroom boundaries, indefinite cue/timer behavior, legacy defaults and both storage adapters.
- 29 browser scenarios passed across the full run and focused reruns. These include every one of the 39 activity start/play/finish/replay lifecycles, offline reload/play, exact Studio locks and legacy saves, optional names, Party Night continuation, private cover, passes/sit-outs/rejoin, word saves and scene handoff, content gates, fixed cue geometry, optional timer controls, safe resume/end, phone/tablet/desktop/dark/large-text and delayed-font startup.
- The final focused reruns verified a resize-aware viewport check (React Native resize updates are asynchronous) and the new word-to-Scene-Lab handoff.
- Production web export passed; 51 precached local files. Direct icon imports, WOFF2 fonts, a nonblocking Home shell and delayed offline download remain in place.
- iOS Hermes export passed: `/tmp/off-script-ios-quick-deck-final`. No simulator, physical iPhone, signed binary or TestFlight upload was executed.
- Content: 39 games; 980 ingredients (24 new clean and 16 new spicy situations); 96 neutral relationship templates; 160 joke topics; 60 private objectives; 40 quirks; 161 cue entries; 281 preserved curated combinations; pack 2.1.0.

## Publication and evidence

Sites source synchronization and publication use the existing registered public project and exact pushed commit. Publication status and the live URL are confirmed by native Sites results in the task conversation. `scripts/check-party-public.mjs` performs post-deployment unauthenticated deck/Studio checks and writes evidence to `/workspace/off-script-party-live` outside the source checkout.

Product details: [PARTY_NIGHT.md](PARTY_NIGHT.md). Architecture and data decisions: [ADR_PARTY_NIGHT.md](ADR_PARTY_NIGHT.md). Historical reports remain in BUILD_REPORT_V1_0.md and BUILD_REPORT_V1_1.md.

The complete updated content inventory is reproducible with `npx tsx scripts/export-content.ts <output.md>`.

## Scope and limits

The uploaded text ends midway through section 6C. The implementation covers the supplied requirements; no missing later instructions were inferred. Humor quality still benefits from real group playtesting; local feedback is not represented as submitted research.

Web publication is separate from Apple distribution. Physical-device speech/silent-mode, VoiceOver/Dynamic Type and native lifecycle checks, Apple signing/team/bundle ID and TestFlight remain unverified or unconfigured. EAS profiles and the shared native architecture are retained for those steps.
