# Off Script build report

Built in `/workspace/off-script` on 2026-10-16 from the supplied archive and master requirements. Shared Expo iOS/web source, no application backend or external gameplay integration.

## Verified results

| Check | Result |
| --- | --- |
| Strict TypeScript | Pass |
| ESLint | Pass |
| Catalog/content release validator | Pass: 39 games, 600 Studio entries, 80 relationship templates, 160 pluralized topics, 60 goals, 40 quirks, 145 cue-bank entries |
| Domain/repository tests | 54 passed |
| Production-export Chromium acceptance | 9 passed |
| All 39 actual browser games | Each started, played, finished, and replayed |
| 2-person browser play | Passed first-use and another-round flow |
| 6-person browser play | Passed distinct casting, manual emotion cue, pause/resume, another round, favorite/reload |
| 8-person instructor Studio | Passed structured roles and exact full-ensemble Scene Lab handoff |
| Studio | Passed toggles preserving other values, exact locks, category reroll, saved snapshot, reload and handoff |
| Private reveal safety | Passed recipient handoff, hidden-tab cover and no secret after restored pause |
| Mature/classroom gates | Passed library and direct-route behavior |
| Offline browser reload/play | Passed after service-worker precache |
| Viewports/keyboard | Passed 320, 390, 768 and 1440 widths, large text and Enter activation |
| Manual score/vote | Passed browser storage assertions |
| Native SQLite SQL | Passed real SQLite migration, roundtrip, repeat writes, team score and reset via Node bridge |
| Expo Doctor | 20/20 checks passed |
| Production web export | Passed, static `dist/` with local asset precache |
| iOS JavaScript/Hermes export | Passed; `/tmp/off-script-ios` in this execution workspace |

The browser test suite observes fatal page exceptions during lifecycle/privacy runs. It operates against the real export and reads actual browser IndexedDB after user actions. It is not a substitute for human usability testing or iOS hardware validation.

## Browser access

Local production QA: `npm run build:web` then `node scripts/serve.mjs` at `http://localhost:4173`. The development command is `npm run web` (Expo Router). Local addresses are internal to the host environment.

Registered private Sites deployment target: https://off-script-play.lindsey08092.chatgpt.site . The final native deployment result in the task conversation is authoritative for publication success. Hosting starts owner-private; no public audience change or custom production domain was requested. The exported app itself has no user account requirement.

## Screenshots

- `docs/screenshots/phone-home.png`
- `docs/screenshots/phone-live-game.png`
- `docs/screenshots/phone-studio.png`
- `docs/screenshots/desktop-home.png`
- `docs/screenshots/desktop-play.png`

## Remaining release limits

No Apple simulator or physical iPhone/iPad was available. No signed IPA, TestFlight upload, App Store submission, VoiceOver/hardware audit, native silent-mode test, native airplane-mode test, or moderated ten-minute usability study was run. Native SQL was tested through a real SQLite bridge, not the iOS Expo bridge. These remain release gates, with owner Apple/EAS credentials, bundle ID, approved support/privacy URLs and brand clearance also required. See APP_STORE_READINESS.md.

The automated gates support the implemented browser build and shared domain. They do not certify an App Store-ready binary. Browser storage/cache can be evicted; interrupted processes can lose the final three seconds of timer progress before the next checkpoint. There is no cloud backup or sync.
