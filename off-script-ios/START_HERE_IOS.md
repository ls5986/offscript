# Off Script — start here in VS Code

The current source also includes [the 2.8 prompt/recipe library](docs/PROMPT_LIBRARY.md):
independently browsable prompts, 14 exact ingredient combinations and 60
additive Cheeky/adult inputs. Studio content levels, saved provenance and
Classroom/adult gates are shared by iOS and web. These changes are not in the
previously prepared signed TestFlight archive; use a fresh unused build number
when building and uploading the new source.

This is the native iOS handoff of the working Off Script app, including content pack 2.7.0 and the [ingredient-independence correction](docs/ATOMIC_27_CONTENT.md). Studio generates only the selected categories; optional composition does not inject a relationship or prop. Complete advice problems are separate game inputs. Saved originals stay exact, and Studio ensembles keep their actors through replay. Party remains low-tap, with no opening-line hint and optional round guidance in How to Play. Read [the current play experience](docs/V1_PLAY_EXPERIENCE.md) and [material behavior](docs/PARTY_MATERIAL_AND_HINTS.md) before changing behavior. Continue this React Native / Expo app rather than wrapping the website or rewriting the engines.

Recommended first release: **no account, device-only saves**. Names, prompts, favorites and sessions are useful local data; they do not require a cloud database or login. Every group member remains a guest. The separate live website has not been changed by this native preparation.

This checkout now uses the verified stable **Expo SDK 57 / React Native
0.86.3 / React 19.2.3** dependency set. The original archive's SDK 58 patch
versions were unavailable. A clean `npm ci`, normal project checks, production
web export, iOS JavaScript/Hermes export and the real browser suite have been
run. See [current verification and remaining limits](docs/ios/VERIFICATION.md).

## Open and run

1. Unzip this package and open its `off-script-ios` folder in VS Code.
2. Use Node 24.3 or newer in the Node 24 line (`nvm use` with the included `.nvmrc`).
3. Run:

```bash
# On this Mac, if not using nvm, select the installed Homebrew Node 24 for this shell:
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
npm ci
npm run typecheck
npm test
npm run ios:check
npm start
```

For a Mac with Xcode and an installed iOS simulator:

```bash
npm run ios:simulator
# or generate and compile a native development app:
npm run ios
```

An iOS JavaScript export is not a compiled simulator app. Supply your real bundle
identifier before generating the native project; `ios:simulator` opens an
already-installed development app rather than registering or signing one.

The repaired SDK 57 app has now produced a real signed Release archive and
successful **internal-only TestFlight upload of version 1.3.0 (1)** under the
registered owner identity. The native workspace is generated in this checkout.
The compiled minimum is iOS 16.4. See
[native verification](docs/ios/VERIFICATION.md) for upload, processing/access
status and non-blocking framework-symbol warnings.
A local compile needs macOS/Xcode; direct Xcode delivery does not require an
Expo account. The existing EAS route is optional and still needs its own
account/project setup. Actual installation and physical-device acceptance
remain separate from a successful upload.

## Configure your identity and public pages

For a local Xcode/TestFlight build on this Mac, follow
[the local TestFlight guide](docs/ios/TESTFLIGHT.md).
`npm run ios:check:local` checks the real bundle ID and public pages without
requiring an Expo project. This is the full-metadata preflight; public-page
publication is not an Apple prerequisite for the restricted internal-only
TestFlight path. The EAS flow below still requires the Expo project and
authentication.

This checkout's ignored `.env.local` already contains the verified bundle/team
IDs; preserve them. For a fresh checkout, copy `.env.example` to `.env.local`.
For full release preparation, fill the public values from your own accounts/pages
(the EAS project is required only for the EAS route):

- `OFFSCRIPT_IOS_BUNDLE_ID`: the bundle identifier you select/register with Apple. Choose it carefully; an App Store app's identifier is not a casual rename.
- `OFFSCRIPT_EAS_PROJECT_ID`: the UUID from your Expo/EAS project.
- `OFFSCRIPT_PRIVACY_URL`: a real, approved public HTTPS privacy policy.
- `OFFSCRIPT_SUPPORT_URL`: a real public HTTPS support page.

`OFFSCRIPT_APPLE_TEAM_ID` is optional when Xcode/EAS can select the authorized team interactively. `app.config.ts` also accepts equivalent values in `app.json`: `ios.bundleIdentifier`, `extra.eas.projectId`, `extra.release.privacyURL`, and `extra.release.supportURL`. No owner identifiers or legal URLs have been invented for you.

Authenticate and connect your own Expo/EAS account, inspect its project, and use its project ID. Configure these public metadata variables in that project's EAS environments too, because `.env.local` is excluded from build uploads. Start with the preview environment and repeat for production. Apple signing keys/certificates and account credentials belong in EAS/Apple credential management, not source, `.env.example`, or `EXPO_PUBLIC_*` variables.

```bash
npx eas-cli@latest login
npx eas-cli@latest init
npm run ios:check -- --release
npm run ios:build:preview
```

`preview` builds for the simulator. `device` is an internal build for registered physical devices; EAS will guide device registration/signing. `development` includes the native development client. `production` is for TestFlight/App Store binaries, with remote build-number incrementing. Production configuration fails early if required owner metadata is missing. The shared EAS base profile pins Node 24.19.0; the package lockfile fixes app dependencies.

```bash
npm run ios:build:production
```

Create the matching app record in App Store Connect. Add its numeric ID to `submit.production.ios.ascAppId` in `eas.json`, then:

```bash
npm run ios:submit
```

Submission uploads a selected build to App Store Connect/TestFlight; it does not replace metadata review, tester validation, App Review submission or release. Keep those final distribution decisions with the owner.

## What has been prepared

- One shared game/content engine; 39 games, Party Night, Studio, all current corrections.
- Existing native SQLite repository, versioned Zod snapshots, safe paused restore, exact saved ingredient/lock provenance, and local deletion.
- Native build configuration with a guest/local policy, public privacy/support link wiring, no tracking declaration, standard encryption exemption flag and protected app-container sharing settings.
- SDK privacy-manifest aggregation retained. Third-party required-reason API declarations must be inspected in the final built archive.
- No Apple login entitlement, cloud account, paid service, analytics or new runtime server.
- A release configuration check, meaningful native-configuration tests, and build profiles.

Settings shows the configured Privacy policy and Support links in native builds. The production check requires both URLs. This package provides implementation and policy guidance; the owner must supply and approve the real policy/contact information.

Read [verification and remaining work](docs/ios/VERIFICATION.md), [data architecture](docs/ios/DATA_AND_SYNC.md), [Apple sign-in decision](docs/ios/APPLE_SIGN_IN.md), and [release checklist](docs/ios/RELEASE_CHECKLIST.md). Give your VS Code coding assistant [VSCODE_IOS_PROMPT.md](VSCODE_IOS_PROMPT.md) after opening the folder.
