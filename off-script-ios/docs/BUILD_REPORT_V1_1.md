# Off Script 1.1 build report

Built 2026-10-16. This update implements the dual-audience product and UI recommendations. The initial build report is preserved in BUILD_REPORT_V1_0.md. Product details are in V1_1_EXPERIENCE_UPDATE.md.

## What changed

- **Just Riff:** curated quick games, short rules, playful setups, optional examples and a soft 60–90 second round reminder. The default path still asks only for the player count.
- **Improv Practice:** the full catalog, grounded scenes, focused exercises, full teaching notes, skill focus, reflection, teacher presets and large display.
- Shared catalog/engines; no beginner/expert identity gate and no duplicate fake games. Direct launch retains access to every canonical format.
- 141 new authored playful entries, including 24 structured relationships. Connected playful generation favors one oddity with grounded supporting ingredients. Existing 600 entries are retained.
- Dedicated live-play shell and fixed control dock; actual player-to-role labels; shorter instructions; setup before optional examples; full details and coaching in scrollable sheets.
- Studio results first, fixed Generate/Customize controls, plain-language mixing labels and exact locks/saves.
- Compact library and filters, revised conversation mark/icons/share card, stable licensed font asset paths, explicit font fallbacks and stronger text contrast.
- Backward-compatible schema defaults preserve exact saved text, names, locks, sessions, favorites, scores and presets. No user data reset is performed.

## Executed checks

| Check | Result |
| --- | --- |
| TypeScript and ESLint | Passed |
| Domain/content/storage unit and integration tests | **62 passed** |
| Actual production-export browser acceptance | **16 passed** |
| All 39 browser game lifecycles | Start, play, finish and replay passed |
| New profile behavior | Riff curation, Practice full catalog, persisted choice and grounded/playful content passed |
| Content validator | 39 games, 741 Studio entries, 104 relationship templates, 160 pluralized topics, 60 goals, 40 quirks, 160 possible cue entries |
| Previous-version saved aggregate | Restores without losing names, rounds, saved values or favorites |
| Phone controls | Cue, Pause and Finish remain within 320 × 568 viewport with larger text; initial Home button is within viewport too |
| Studio and private data | Lock/reroll/toggle/handoff, hidden-tab cover, paused reload and persistence passed |
| Casting and roles | Fairness simulations plus named-role browser mapping and 6/8-person flows passed |
| Optional scoring/votes and content gates | Passed |
| Browser offline reload/play | Passed after precaching |
| Local web font loading | All four custom faces loaded |
| Light-theme token contrast | Muted/lilac 5.22:1; muted/blue 5.40:1; accent/cream 5.50:1 |
| Expo Doctor | 20/20 checks passed |
| Production web export | Passed; `dist/` |
| iOS Hermes bundle export | Passed; `/tmp/off-script-ios-v1-1` |

## Access and evidence

Public deployment target: https://off-script-play.lindsey08092.chatgpt.site . The final native deployment result and fresh-browser post-publication check in the task conversation confirm the hosted release separately from local export tests. `scripts/check-public.mjs` checks unauthenticated access, font delivery, both intents, story play, mobile control visibility and Studio on the hosted site; its output goes outside the source checkout.

Current browser screenshots:

- `docs/screenshots/v1-1-phone-intro.png`
- `docs/screenshots/v1-1-phone-play.png`
- `docs/screenshots/v1-1-phone-studio.png`
- `docs/screenshots/v1-1-phone-library.png`
- `docs/screenshots/v1-1-desktop-home.png`
- `docs/screenshots/v1-1-desktop-play.png`
- `docs/screenshots/v1-1-desktop-dark.png`

## Remaining verification limits

No physical iPhone/iPad, Safari hardware test, Xcode simulator build, signed IPA, TestFlight upload or App Store submission was executed. iOS Hermes export and real SQLite SQL tests do not replace native bridge/device tests. Name clearance, owner Apple/EAS configuration, real support/privacy URLs and physical-device accessibility/audio tests remain Apple distribution gates. No usability study establishes that every group will find the new material funny; the update provides clearer rules and more immediately playable starting points for that next user test.
