# OFF SCRIPT V1 — BUILD / TESTFLIGHT / LAUNCH RUNBOOK

## Build assumptions

iOS + fully playable web React Native / Expo from one shared codebase. No accounts, backend, runtime AI calls, camera, microphone, location, contacts or mandatory connectivity. Catalog/content bundled in-app; native SQLite persists user-specific state; an IndexedDB-compatible web adapter persists real sessions, prompts and favorites in-browser. Working display name OFF SCRIPT pending a trademark/name review.

## Required developer steps

1. Create/inspect standalone repository for Off Script, scaffold supported Expo SDK and Expo Router.
2. Import canonical Zod contracts, SQLite migration and all 39 game records.
3. Implement full offline game engine, prompt generation, content banks, modes and UX from master PRD.
4. Run `npm install`, lint, TypeScript validation, catalog/content validator, unit/integration tests, Playwright web E2E, `npx expo-doctor`, browser production export, and iOS simulator tests where supported.
5. Test on physical iPhone, including Ring/Silent behavior, VoiceOver, Dynamic Type, airplane mode, resume/background, app reinstall and local storage persistence.
6. Create original icon/splash/screenshots and developer-facing release metadata; do not assume rights to any existing branded imagery.
7. Ensure customer-facing legal URLs/privacy notice/support info are real owner-provided values and App Store privacy/age rating disclosures match actual app behavior.
8. Confirm Off Script branding clearance before public submission. Existing similar brands are a known risk; treat name as replaceable until cleared.
9. Configure bundle identifier from owner's Apple team; authenticate EAS CLI only when owner supplies access. Never commit credentials, API keys or device signing assets.
10. EAS build then EAS Submit to TestFlight. TestFlight upload is not the same as App Store approval/release.
11. Review final screenshots, age rating, metadata and TestFlight tester results, then request owner's approval before final App Store review submission.

## Browser-first preview steps

The owner wants to play the app in a browser during development. Make the browser version functional as soon as Surprise Me works. Verify in-browser persistence, all 39 games, Studio, private reveals, cue fallbacks and responsiveness. See `docs/WEB_PREVIEW.md`.

```bash
npm run web            # local Expo browser server
npm run build:web      # production browser bundle
npm run test:e2e:web   # Playwright browser run
# Optional AFTER authorized Expo login/hosting setup, and successful export:
npx eas-cli@latest deploy  # obtain an actual preview URL from the command output
```

If preview hosting cannot be authenticated, do not claim a shareable link. Distinguish local preview, deployable web build and verified remote hosted URL. The owner should not need TestFlight or an iOS device to review early playable builds.

## Example owner-authorized Expo path

```bash
npm install
npm run lint
npm run typecheck
npm run content:validate
npm run test
npx expo-doctor
npx eas-cli@latest build --platform ios --profile preview
# Once signing & Apple account are configured:
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios
```

Refer to current official documentation: https://docs.expo.dev/submit/ios/ and https://developer.apple.com/app-store/review/guidelines/ . Compatible package versions and build profiles must be validated at implementation time.

## Blockers that must be reported, never hidden

- Cannot reach real device or simulator; distinguish tests executed from merely planned.
- Incomplete content quotas or game engine mechanics.
- App Store naming conflict or 18+ content policy concerns.
- Missing Apple signing/team/EAS credentials.
- Unverified offline or silent-mode behavior.
- Broken web export, missing browser persistency, or absent real web Playwright verification.
- Hosting/auth unavailable for an externally reachable browser preview URL.
- Missing owner-approved support or privacy-policy URL.
