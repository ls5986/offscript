> **Native iOS handoff:** start with [START_HERE_IOS.md](START_HERE_IOS.md). This checkout contains the additive 2.8.0 prompt/recipe library over the preserved 2.7 ingredient-independence correction, plus native release preparation. Existing public deployments and TestFlight binaries do not automatically receive these local changes.

# Off Script

## First-use clarity

Problem reporting is separate from gameplay help, game choices include short
descriptions, Library quick filters are separate from full-catalog inspection,
standalone scene prompts have matching instructions and a timer notice, and
finished parties are easier to find in Saved. The full content catalog, exact
saved prompts and one-tap ending are preserved. See
[play behavior](docs/V1_PLAY_EXPERIENCE.md) and
[executed checks](docs/ios/VERIFICATION.md).
These source changes are not automatically delivered to TestFlight or Vercel.

## Prompt & recipe library - content 2.8

**Totals** and **All content** now expose every bundled runtime content bank:
1,534 live prompt inputs, 57 recipes (14 prompt combinations and 43 game
variants), role/game metadata and separately marked historical records.
Sort by wording, category, level, ID or eligible input count; inspect record
details and follow game recipes into their exact input pools.

Browse individual ingredients without a recipe, or open one of 14 authored
combinations with exactly the ingredients shown. The shared Library is
accessible from Home, Studio and the game catalog, with search, category,
role-count and Clean/Cheeky/18+ filters.

Added 60 comic/dark/suggestive inputs, including **Scattering ashes** as an
independently playable Action. Studio can now generate Cheeky or 18+ unlocked
ingredients; adult consent, Classroom clean, exact saved/locked originals and
category-preserving Act out still apply. The frozen 2.7 bank is preserved,
not replaced. See [library behavior and content](docs/PROMPT_LIBRARY.md).

## Vercel website and Android browser play

The production web export now includes a static landing page at `/`, the full
game at `/play`, and `/privacy` / `/support` pages on the same domain.
Android, iPhone and desktop users can play in a modern browser; Android
Chrome can offer home-screen installation. No native Android app or account
is required. This is shared-device play, not synchronized online multiplayer.

Use [the Vercel setup guide](docs/VERCEL_WEBSITE.md): root `off-script-ios`,
Framework Other, Node 24, `npm ci`, `npm run build:web`, output `dist`.
The deployment config and offline browser routes are included.
The new site has **not** been deployed or pushed by this task.
An approved public support email and final policy review still need to be
supplied before treating the public pages as Apple submission-ready.

## Independent ingredients - content 2.7

Each selected ingredient now does its own job. Situations no longer supply a
fixed relationship, prop or place on top of the selected categories. Detailed
scene seeds are replaced by reviewed neutral cores; repeated equivalents are
consolidated. Full advice problems remain available only as Terrible Advice
inputs, not ordinary Studio Situations.

All 1,326 earlier source records stay available for historical provenance.
Saved/locked wording stays exact; **Update ingredients** changes only the
editable copy and never enables an unselected category. Relationship roles
are neutralized along with their headings, and Studio ensembles retain all
their actors through replay. See [the reviewed content and authoring
guide](docs/ATOMIC_27_CONTENT.md).

## Expanded Spicy / 18+ material

Higher levels prefer the strongest reviewed input eligible for the chosen
category and cast. Neutral rewritten cores are honestly Clean rather than
retaining an adult label; adult-themed professions and dialogue stay in their
own slots. Clean, consent and Classroom boundaries remain enforced.
Opening-line hints have been removed, and round
lengths, detailed directions and advice examples live in How to Play rather than
on Party cards. Groups can keep going for as long as they like. See
[material levels](docs/PARTY_MATERIAL_AND_HINTS.md).

## V1 usability update

See [the low-tap play experience](docs/V1_PLAY_EXPERIENCE.md) and the generated
[prompt version/material review](docs/prompt-review/REVIEW.md). Studio is first
on Home, with independent ingredient output and optional composition. Party
stays in the chosen game by default: the reader starts, everyone tries the same
prompt, and the main action supplies another word/job/prompt without per-answer
tapping. Game changes and optional shuffling are explicit.

Content pack **2.5.0** preserves historical originals while correcting task fit,
role numbering and composition. Feedback sharing is explicit and minimal; local
ratings are not automatically delivered to the developer.

In Studio and quick Party games, **swipe left for next and right for the exact
previous prompt**. Buttons remain available, normal taps do not advance, and
scenes/private handoffs/New Choice caller controls do not use these gestures.

Version 1.3 makes **Party Night** and **Prompt Studio** the flagship experiences, with the full 39-game catalog in Explore. Read [the product update](docs/PARTY_NIGHT.md) and [architecture decision](docs/ADR_PARTY_NIGHT.md).

Export the current complete prompt/game inventory with `npx tsx scripts/export-content.ts <output.md>`.

Playable, offline-first improv party app for iOS and web. One Expo Router / React Native codebase, one bundled content pack, no backend, account, tracking SDK, or runtime AI.

The verified dependency baseline is **Expo SDK 57 / React Native 0.86.3 /
React 19.2.3**, using Node 24. The lockfile is regenerated from that stable SDK's
compatibility map; do not restore the unavailable SDK 58 patch pins from the
original handoff. Use `npm ci` for the exact tested dependency graph.

## Play

For iPhone beta distribution, follow [the local Xcode/TestFlight
guide](docs/ios/TESTFLIGHT.md). A real signed Release archive and internal-only
TestFlight upload of version 1.3.0 (1) have succeeded under the registered owner
identity. Apple processing, tester access and physical-device acceptance are
separate stages; see [current iOS verification](docs/ios/VERIFICATION.md).

The browser build is publicly hosted with Sites at https://off-script-play.lindsey08092.chatgpt.site . The deployment URL is recorded in `docs/BUILD_REPORT.md` after deployment succeeds. For local use:

```bash
npm ci
npm run web
```

Expo prints the local development address. That address is reachable only from the machine or network running the server. To serve the production export:

```bash
npm run build:web
node scripts/serve.mjs
# http://localhost:4173/      website
# http://localhost:4173/play  game
```

## What is implemented

- Surprise Me, remembered count, optional names, 2–12 players, indefinite rounds and session resume.
- Five curated session policies plus standalone Prompt Studio; 39 runnable activity formats across ten engine families.
- Seeded eligibility/selection, exposure-aware casting, partner-repeat penalties, support roles, sitting out and group resizing.
- Studio starts with one short place name, such as **Repair shop**. Copy / Share copies just that name. Nine other ingredient categories, relationships and scene composition are opt-in through Customize; mixing controls appear only with multiple ingredients. Existing saved selections and locked text remain unchanged.
- Exact Studio locks, individual rerolls, scalable relationships, teacher/custom presets, save/share, history, and exact Scene Lab handoff.
- Party quick cards explain social order without requiring taps between answers. Terrible Advice has an explicit request and matching example for each of its 28 situations. **Choose games** preserves explicit exclusions for future prompts; **Change game** deliberately selects another activity with this group. Selecting a game outside the default quick mix includes it for this session. Non-consent comfort preferences persist; a new adult group still confirms consent.
- Automatic/manual visual cues, optional speech/haptics, centralized pause-safe timer, Half-Life segments, private pass-and-hide objectives/quirks, turn tracking, replacement/relay mechanics, individual/team points and human votes.
- IndexedDB browser persistence and native SQLite migration/projections; safe paused restore; favorites, snapshots, local deletion, coaching, large display/text, keyboard focus, system dark mode.
- Content quotas: 1,182 active ingredients (1,048 core and 134 Party), 96 structured relationships, 160 joke topics with explicit plurals, 60 objectives, 40 quirks, 161 possible emotion/genre/line cues.
- Web production export with service-worker precaching. First visit requires network; offline reload/play is tested after caching. Browser data may be cleared or restricted by the browser/user.

## Checks

In the `offscript` Git repository, this app lives in `off-script-ios/`.
Run the commands below from that app directory. The repository-root
[GitHub Actions workflow](../.github/workflows/ci.yml) uses the same directory,
Node version file, lockfile, and app-relative checks. Include the unpacked
source and root workflow when publishing changes; the handoff ZIP alone does
not run CI.

```bash
npm run typecheck
npm run lint
npm run content:validate
npm test
npm run test:e2e:web
npm run doctor
npm run build:web
```

Playwright uses `/usr/bin/chromium` in this workspace. Elsewhere, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a Chromium installation or adapt the config to Playwright's installed browser. `tests/e2e` exercises the actual exported app. See `docs/BUILD_REPORT.md` for executed checks and exceptions.

For a separate browser-test server, run
`CI=1 OFFSCRIPT_TEST_PORT=18743 npm run test:e2e:web` after the web export.
CI does not reuse an unrelated process already listening on the test port.
Browser checks wait for committed saves before intentionally reloading the page.
The Metro configuration retains Expo's defaults and adds the bundled WOFF2
fonts as assets.
The offline service worker is registered only in production web exports; the
live development preview uses Metro and does not request a missing worker.

Current dependency-health limitations are recorded in
[iOS verification](docs/ios/VERIFICATION.md): online Doctor recommends newer
patches unavailable in the configured registry, and upstream dependency audit
advisories remain. Do not use `npm audit fix --force` to downgrade the app to an
incompatible SDK merely to remove those warnings.

## iOS

```bash
npx expo start --ios
# macOS + Xcode needed for a simulator
npx expo run:ios
# after owner configures bundle ID, EAS project and Apple signing:
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios
```

The JavaScript/Hermes iOS bundle exports on Linux. That does **not** establish an IPA build, simulator/device validation, signing, or TestFlight upload. See `docs/APP_STORE_READINESS.md` and the release runbook.

## Sources and architecture

- `docs/PRD.md`: supplied master requirements.
- `src/domain/contracts.ts` and `contracts/domain.schemas.ts`: synchronized canonical schemas plus the movement-exclusion setting.
- `content/activities.v1.json` and `src/content/v1/activities.json`: synchronized authored catalog; Open Scene's ensemble ceiling is 12 for Studio handoff.
- `database/001_init.sql`: canonical version-1 native migration. `src/storage/migration.ts` contains the identical SQL for Metro bundling.
- `src/domain/session.ts`: deterministic casting, selection, schedules, lifecycle reducer, and timer math.
- `src/domain/prompts.ts`: local prompt generation, locks, cycles and structured roles.
- `src/storage`: validated repositories and versioned aggregate storage.
- `scripts/author-content.py`: auditable original authoring source for bundled banks; no runtime generation service.

Private objectives are never included in shared Studio copy, history summaries or recaps. They stay in local session storage for crash recovery, and only the named recipient sees each reveal.

Local data must finish loading successfully before gameplay or Studio can save
changes. If loading fails, normal controls stay hidden and the error screen
offers a confirmed local reset; canceling preserves the stored data.

## Plain-language play choices

- **Party Night:** the app deals a mixed deck and chooses who plays each card.
- **Just for fun / Practice skills:** changes prompt style and the amount of
  guidance, not the difficulty level or access to the full catalog.
- **Free play / Rounds:** play without a countdown, or use a timer as a cue to
  wrap up. Half-Life is the exception: its four timed versions pause for an
  explicit restart.
- **Take turns / Anyone can jump in:** follow the named player and pass the turn,
  or offer responses without a fixed order. New games do not offer Battle.
  Old saved Battle values remain readable and continue with take-turns wording.
- **Act out this prompt:** starts a scene with the exact Studio prompt and roles.

Catalog categories such as **Two-player games**, **Act out scenes** and
**Practice exercises** only filter the library; they do not silently change a
saved preference. In timed Party scenes the optional countdown is visible.

Both storage adapters validate relationships between saved records before
writing. Historical actors and Studio seat placeholders stay supported; invalid
records produce explicit errors without replacing the last persisted state.
New prompt snapshots capture their content classification. Known legacy values
and aliases can be classified from the bundled catalog; unclassified originals
remain saved but are hidden when Classroom clean is on.
