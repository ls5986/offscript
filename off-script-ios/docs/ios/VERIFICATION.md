# iOS handoff verification

## Latest matching beta: 1.3.0 (4), upload confirmed

On October 18, the requested latest-source TestFlight update was signed and
uploaded successfully as **1.3.0 (4)** at **7:50 PM**. The command-line Xcode
delivery log explicitly records **"Upload succeeded"**, **"Uploaded package
is processing"** and **"EXPORT SUCCEEDED"**. No duplicate upload is needed.

The real archive contains the compact Library and approved first-use changes
shown in the marketing screenshots. Its Hermes bundle is **4,437,448 bytes**,
SHA-256 `366da756e2b7d1b442f97a34925863fbb0df5eadadf6ca6ce321119a9ce8c5d9`,
with `2.8.0`, `catalog-record-title`, `Report a problem`,
`Inspect full catalog`, `Recipe details`, `View saved parties` and
`Learn this game` verified in the actual bundle.

Fresh **358 unit tests across 41 files**, TypeScript, lint and content
validation passed. The signed archive verified the registered bundle/team,
iOS 16.4 minimum and single-scene bootstrap. Camera, microphone, local-network
usage descriptions and background modes are absent from the Release payload;
the encryption exemption and no-tracking/no-collected-data manifest remain.
The app's own symbols and all three authentic official framework dSYMs match
their arm64 executable UUIDs. Attaching framework symbols left all **83**
app-payload file hashes unchanged; strict deep code-signature verification
passed.

Delivery used **standard App Store Connect** export with
`testFlightInternalTestingOnly=false`, `uploadSymbols=true`, and
`manageAppVersionAndBuildNumber=false`. Expo/native build metadata is now
persisted as 1.3.0 (4). There were no missing-symbol upload warnings.

**Apple processing was acknowledged, not verified complete.** The shared
browser still redirects to App Store Connect sign-in. Internal-group build
assignment, tester install availability and installation on the owner's
iPhone could not be rechecked. The existing Owner testing group was previously
configured for automatic distribution; do not infer current access from that.
Refresh TestFlight after processing and look specifically for **1.3.0 (4)**.

Retained evidence in the session workspace:
`OffScript-TestFlight-1.3.0-4.xcarchive`,
`testflight-build4-verification.json`, and `testflight-build4-upload.log`.
The detailed successful delivery log is
`OffScript_2026-10-18_19-48-21.397.xcdistributionlogs`.

This beta upload does **not** submit for public App Review or publish the
website. Approved live privacy/support URLs and owner contact/declarations
are still required before final public release. Those App Store requirements
were not bypassed or filled with invented values; they are not prerequisites
for this TestFlight upload.

## Earlier App Store preparation: unsigned device validation, public submission blocked

On October 18, after the owner requested a release matching the new media,
fresh **358 unit tests across 41 files**, TypeScript, lint and content
validation passed. The current source also compiled successfully for the
**generic arm64 iOS device target** in Release with signing disabled.
This is device-platform compilation, not physical-device testing, a signed
archive, an installable App Store build or a new upload.

The produced app verified the registered bundle ID, minimum iOS 16.4 and
single-scene lifecycle configuration. Its actual Hermes bundle contains
`2.8.0`, `Report a problem`, `Inspect full catalog`, `Recipe details` and
`View saved parties`, confirming the newer content and first-use/compact
Library source rather than the older uploaded build-3 bundle. Its SHA-256 is
`741aebca000364e362b3217f595c9dff55db14605db513bfbcebbbecfa7beab0`.
All three arm64 React/ReactNativeDependencies/Hermes UUIDs still match the
authentic framework dSYMs retained in the uploaded build-3 archive.

The validation build retains local version/build metadata **1.3.0 (3)**;
it is **not** a replacement upload for that used build number. Verify the
next unused number in authenticated App Store Connect and finalize public
links before creating the new signed release archive.

The public-release preflight still correctly fails because approved live
privacy/support URLs are unset. App Store Connect redirects to sign-in;
the Vercel dashboard also redirects to login. No public support email or
policy-publication approval has been supplied. Do not bypass these gates,
publish a private account address, accept owner agreements, or claim that
submission succeeded. [Listing/review copy](../APP_STORE_METADATA.md) and
the current-native screenshot sets are prepared locally.

## Compact Library list (local source and export)

Replaced large Library result cards with flat rows while retaining exact
prompt/recipe Use actions and all catalog, sorting, search, consent and
read-only history behavior. Recipe descriptions and ingredient/pool
breakdowns expand on demand; game recipes keep direct input-pool access.
The full row title wraps rather than truncates, with 44px minimum action
targets and verified large-text/small-phone fit.

New measured-density tests failed against the previous layout (five ordinary
titles spanned 845px) and pass with the list (283px in the 390px production
preview). **358 unit tests across 41 files**, typecheck, lint, production web
export, **115 complete browser tests** and iOS JavaScript/Hermes export passed.
Light/dark list readability, 320/390px density, exact Studio prompt/recipe
selection, expandable ingredients and read-only metadata were checked.
The local Library preview is updated; uploaded build 3 and the public website
have not been updated by this layout-only task.

## Approved first-use walkthrough fixes (local source, not a new TestFlight build)

Implemented the five fixes approved after the cognitive walkthrough:

- Report a problem is clearly distinct from How to Play; no automatic
  transmission or success-shaped feedback message was added.
- Existing game descriptions appear in Party/free-play choices. First-ever
  Party scene intros offer Learn this game; live/repeated cards stay concise.
- Library Category and Sort are first, with full bank/ID inspection in a
  separate disclosure. All 12 banks, all totals, adult/Classroom gates,
  historical metadata and exact prompt use remain available.
- Open Scene instruction follows selected ingredients, not imaginary supplied
  people. Its optional timer is signposted before Start without changing the
  selected prompt or timing behavior.
- Finished parties confirm local saving and link to Saved sessions. Saved
  defaults to Sessions when history exists rather than an empty favorites
  collection; End game remains one tap.

Observed the new tests fail before implementation. **358 unit tests across
41 files**, typecheck, lint, content validation, production export and
**111 complete browser tests** then passed. An isolated fresh-context phone
pass completed both novice journeys at **390x844 and 320x568**, light and
dark, checking game descriptions/help, visible call/help/end controls,
recap recovery, quick filters and Action-only/timer notice.
The iOS JavaScript/Hermes export passed. This is not a new signed archive,
physical-iPhone certification, TestFlight upload, Vercel deployment or
measured first-time-human study. Uploaded build 3 remains unchanged.

## Latest full Library beta: 1.3.0 (3), upload confirmed

On October 18, the requested latest-source internal beta was compiled and
signed successfully as **version 1.3.0, build 3**, with content **2.8.0**
and the complete sortable Library. Build 3 is persisted in Expo configuration
and the native project; both use marketing version 1.3.0.

Fresh 355 unit tests, TypeScript, lint and content validation passed.
The real archive verified:

- Registered bundle `com.lindseystevens.offscript`, team `S6R25SG86U`,
  minimum iOS 16.4 and the supported Expo scene lifecycle.
- **4,433,254-byte bundled JavaScript**, containing the 2.8.0 pack marker,
  Full content inventory, Most inputs, Scattering ashes and Historical ingredients.
- No tracking/collected-data declarations, no camera/microphone/local-network
  usage descriptions or background modes, and the encryption exemption retained.
- All three official framework dSYMs match their exact arm64 UUIDs and were
  attached to this archive. The app's own dSYM matches its executable.
  All 83 app-payload hashes remained unchanged after symbol attachment, and
  strict deep code-signature/team verification passed.

**Build 3 uploaded successfully at 12:34 PM on October 18.** A fresh Organizer
check confirmed the selected **1.3.0 (3)** archive as **Uploaded to Apple**,
and its native completion sheet stated **"OffScript 1.3.0 (3) uploaded."**
The successful delivery log records **"Upload succeeded"** and
**"Uploaded package is processing."** No duplicate upload is needed.

The initial internal-only command-line attempt and first Organizer check
were blocked by account authentication. Those earlier failures were superseded
by the later successful GUI delivery.

The successful Organizer delivery used standard App Store Connect settings:
`testFlightInternalTestingOnly=false`, `uploadSymbols=true`, and
`manageAppVersionAndBuildNumber=true`. This is not an internal-only restriction,
despite the archive's preparation filename. It does not submit the app for
App Review, create an external testing group, or publish it publicly.

The shared App Store Connect browser remains logged out. Apple's standard
post-upload status link was opened, but that browser still redirected to
sign-in. **Finished processing, Owner testing assignment and actual iPhone
installation have not been re-verified in the portal.** The existing internal
group was configured for automatic distribution, but do not claim current
install availability from the upload receipt alone. No credentials were
extracted, guessed or placed in source/chat.

The retained archive is `OffScript-Internal-1.3.0-3.xcarchive` in the session
workspace. `testflight-build3-verification.json` records the archive and
confirmed delivery evidence. The failed CLI log is retained as historical;
the later successful Organizer log is
`OffScript_2026-10-18_12-32-00.535.xcdistributionlogs`.
Refresh TestFlight for the update, and verify processing/group access in
App Store Connect once authenticated. Do not upload the same build again
merely because the shared browser cannot show its status.

## Complete catalog inspection follow-up (source and export)

The Library now indexes all 12 bundled content banks with separate current
input, recipe, metadata and historical totals, full-set sorting, per-game
recipe pools and read-only record details. 355 unit tests, typecheck/lint/
content validation, 105 production browser tests and iOS Hermes export passed.
Adult and Classroom clean gates apply to every bank. This remains local
source/export verification, not an updated signed archive or TestFlight upload.

## Content 2.8 Library follow-up (source and export only)

[The prompt/recipe library](../PROMPT_LIBRARY.md) adds 60 independent rated
inputs, 14 authored ingredient combinations and Studio content-level controls.
349 unit tests, typecheck/lint/content validation and 101 complete production
browser tests passed. The iOS JavaScript/Hermes export passed, but this is not
a native installation or TestFlight delivery of the Library. The previously
signed 1.3.0 (2) archive contains the earlier appearance fixes, not this new
source. Preserve that distinction when choosing the next unused build number.

## Unified public website follow-up

The policy/support sources below have since been integrated with the
[Vercel website and browser-play export](../VERCEL_WEBSITE.md), rather than
standalone GitHub Pages drafts. Website `/` is the static landing, `/play`
opens the game, and `/privacy` / `/support` are static pages. Native home and
saved-data schemas remain unchanged. Those sources do not establish a live
deployment or complete Apple's support contact requirement: the owner still
needs to approve the policy and supply a public contact, deploy and verify
actual HTTPS URLs before configuring the native release links.
Historical draft notes below describe the earlier preparation, not a claim
that the current pages are published.

## October 18: official framework dSYMs restored to build 2

The three `Upload Symbols Failed` warnings were confirmed against the actual
archived device binaries, not inferred from framework names:

| Framework | Matching arm64 UUID |
| --- | --- |
| React | `EE15B752-FB46-35F2-B0BB-A46636572385` |
| ReactNativeDependencies | `DB4E1216-70C6-36F0-8A46-FDD48FCAE1F2` |
| hermesvm | `BE274A23-47CC-3F5A-9E98-8474553DF5A8` |

The installed vendor runtime tarballs and local CocoaPods cache did not
contain these dSYMs. Separate official Maven Central **Release symbol**
artifacts do contain the exact matches:

- [React Native 0.86.3 core symbols](https://repo.maven.apache.org/maven2/com/facebook/react/react-native-artifacts/0.86.3/react-native-artifacts-0.86.3-reactnative-core-dSYM-release.tar.gz)
- [React Native 0.86.3 dependency symbols](https://repo.maven.apache.org/maven2/com/facebook/react/react-native-artifacts/0.86.3/react-native-artifacts-0.86.3-reactnative-dependencies-dSYM-release.tar.gz)
- [Hermes 250829098.0.17 symbols](https://repo.maven.apache.org/maven2/com/facebook/hermes/hermes-ios/250829098.0.17/hermes-ios-250829098.0.17-hermes-framework-dSYM-release.tar.gz)

Downloaded each from the official artifact repository and verified its
published `.sha256`. Extracted only the device slice (`ios-arm64` for
React/dependencies, `iphoneos` for Hermes), then compared UUID **and
architecture** with `xcrun dwarfdump --uuid`.

Added the three authentic `.framework.dSYM` bundles to the `dSYMs` directory
of the retained **OffScript-Internal-1.3.0-2.xcarchive**, without overwriting
existing symbols. All **83 app-payload file hashes remained unchanged**.
Deep strict code-signature verification still passed; the app's own dSYM
also matches its executable UUID.

This repairs the local build-2 archive's missing-symbol inputs. It does not
establish that Apple has received those symbols or that a previously started
upload used them. No runtime code, signing settings or dependencies changed.
Build 1's historical archive was left untouched.

## October 18 native readability and scene-lifecycle correction

The owner reported hard-to-read colors in TestFlight build 1. Reproduced the
underlying native style failure before fixing it: `Eyebrow` passed
`color: undefined` after `Txt`'s theme color. React Native removed that color;
the original UI rendered section headings **black on dark surfaces**, whereas
the browser retained inherited readable text.

The corrected shared label explicitly uses the current theme's ink unless a
caller supplies a cue-card color. Added a separate `controlLine` token for
input boundaries, secondary buttons, unselected chips and off-switch tracks;
decorative card/divider lines remain subtle. Native-style regression tests
failed first: the old input/switch contrast was **1.29:1 light / 1.40:1 dark**.
The fixes meet **3:1** control contrast, and normal body/helper/accent/section
text meets **4.5:1** on the tested content surfaces.

The setup save-error message also used decorative coral at **2.88:1** on
its light card. A failing browser test reproduced an actual save failure and
measured that message; it now uses the existing readable accent-ink token.

Actual iOS 27 Release launch also failed before correction: UIKit asserted
that the app had not adopted the required UIScene lifecycle. The installed
Expo SDK already provides `ExpoAppSceneDelegate` and its factory-provider
protocol. The persistent local prebuild plugin now connects those supported
APIs and removes duplicate legacy window/startup code; it fails explicitly
on an unsupported native template. No dependency or custom scene delegate
was added, and multiple windows remain disabled.

Executed verification:

- **332 unit tests / 36 files**, typecheck, lint, plugin lint and content
  validation passed.
- Production web export and **91 complete browser tests** passed, including
  measured light/dark contrast across Home, Studio, Settings, library,
  customization, relationship/location cards, player setup, live story and
  rules and actual setup save-error states.
- Corrected native **Release simulator build succeeded** on iOS 27.
- Native XCTest passed Home, Studio, customization and Settings in **both
  light and dark**; checked actual screenshots, not only a web preview.
- Native XCTest also passed warm deep links, background/reactivation and
  cold-start Studio links through the scene lifecycle.
- Controlled native comparison reused the original compiled UI bundle with
  only the required scene bootstrap enabled. Screenshot pixels confirmed
  original heading RGB **0,0,0** on dark, corrected dark **245,241,233**, and
  corrected light **32,43,62**. The fixed app was restored afterward.

Build number **2** is persisted for the corrected beta. A signed device
Release archive of **1.3.0 (2)** succeeded. Verified its real bundle/team,
code signature, version/build, scene manifest, minimum iOS 16.4,
bundled JavaScript, privacy manifest and absence of
camera/microphone/local-network/background declarations.

**Build 2 is not uploaded.** The internal-only upload attempt failed with
Apple's explicit `exportArchive Failed to Use Accounts` error:
App Store Connect access for team `S6R25SG86U` is required. The browser also
redirected to Apple sign-in. Initiated Apple's passkey option and opened the
signed archive in Xcode, but owner authorization remains required.
Reauthenticate in Xcode Settings > Accounts before retrying. Keep passwords,
verification codes and signing keys out of source/chat.

The verified archive and upload log are retained in the session workspace
as `OffScript-Internal-1.3.0-2.xcarchive` and `appearance-testflight-upload.log`.
Build 1 on TestFlight does not contain these fixes.
The owner's physical-iPhone check, full App Store metadata/policy/contact
preparation, an unrestricted store build and public App Review remain separate
release gates. See [the current submission checklist](../APP_STORE_READINESS.md).

## Signed internal TestFlight upload: October 17, 2026

Generated the actual native project with registered bundle ID
`com.lindseystevens.offscript` and Apple team `S6R25SG86U`, installed its
CocoaPods, and successfully archived **version 1.3.0, build 1** using
Xcode 27 / iOS 27 SDK, Release, generic iOS device destination.

Verified the real archive's code signature and team, bundle/version/build,
minimum iOS 16.4, **4,384,486-byte bundled JavaScript**, privacy manifest,
encryption exemption, and absence of camera/microphone/local-network usage
descriptions or background modes.

The authorized Xcode export used App Store Connect upload with
`testFlightInternalTestingOnly=true`. At **23:24**, Xcode reported
**"Upload succeeded"** and **"EXPORT SUCCEEDED"**. After processing,
App Store Connect confirmed version **1.3.0 (1)** marked **Internal** with
status **Testing**, group **Owner testing**, and **1 invitation**.
This is a real processed owner-identity build available for internal testing,
not the earlier unsigned experiment or merely an accepted upload.

Created `Owner testing` with automatic distribution and added exactly the
existing Account Holder. The portal confirmed one internal tester, and the
processed build was automatically assigned to this group.
No other users were invited or given app-management roles.

The upload emitted non-blocking missing-dSYM warnings for the precompiled
React, ReactNativeDependencies and hermesvm frameworks. Apple accepted the
upload; those warnings affect framework crash symbolication rather than
whether the app can be tested.

Public privacy/support pages are not prerequisites for this restricted
internal-only upload. Their URLs remain unset, and the strict full-release/EAS
checks are unchanged. No public App Store or external TestFlight release is
claimed. Physical-iPhone acceptance remains separate.

## Earlier unsigned Release compilation and local TestFlight preparation

An isolated copy of the current app was generated with Expo SDK 57, installed
112 CocoaPods and compiled successfully using **Xcode 27 / iOS 27 SDK**, Release
configuration, generic iOS device destination and arm64 architecture.

This was deliberately **unsigned**, with the clearly non-shipping identifier
`com.example.offscript.nativecheck`. It did not change the owner's app identity,
register a bundle, create a signed archive or upload anything. Application
runtime code/assets matched the original project across 102 files.

Observed in the actual compiled app:

- Version 1.3.0, build 1, minimum iOS **16.4**.
- arm64 Mach-O executable and **4,384,464-byte bundled JavaScript**.
- No camera, microphone, local-network usage description or background modes.
- App privacy manifest: no tracking or collected-data declarations; aggregated
  UserDefaults, FileTimestamp and SystemBootTime reason entries retained.
- No code signature. This output is **not suitable for TestFlight upload**.

The new `npm run ios:check:local` skips only the EAS project requirement for
direct Xcode delivery. Bundle/team and public privacy/support checks remain;
EAS production/submission checks remain strict. All **319 unit tests across
34 files**, typecheck, lint and content validation passed after this change.
Five new local-check tests include real CLI execution and reject mixed
local/EAS-submit flags.

**Apple registration verified October 17, 2026:** the authenticated Developer
account showed active Individual membership, renewing September 5, 2027.
Registered explicit bundle ID `com.lindseystevens.offscript` under team
`S6R25SG86U` and verified it in Apple's Identifiers list. Created the iOS-only
App Store Connect record **Off Script: Improv Games**, app ID `6824118644`,
SKU `OFFSCRIPT-IOS-001`, primary language English (U.S.).
Apple rejected the initial `Offscript` listing name as already in use.
The home-screen name remains Off Script.

The verified bundle/team IDs are saved in the ignored `.env.local`.
The new app's TestFlight page explicitly showed
**"Submit a build to start testing."**

**Full release preparation still pending:** the owner-approved privacy/support
URLs are unset and physical-device acceptance is unverified. These are not a
reason to misstate the restricted internal upload above as blocked or absent.
Expo is not required for the local Xcode route.

Review-only [privacy](../../release-pages/privacy.html) and
[support](../../release-pages/support.html) HTML drafts are prepared from the
actual storage, feedback and Settings behavior. The support route uses the
existing public GitHub issue tracker. The privacy draft explicitly covers
Apple's automatic TestFlight diagnostics rather than claiming all beta data
stays on the device. These pages are not published or approved release URLs;
the ignored local configuration still leaves both URLs unset.

Isolated Chromium validation passed both documents at **1280px and 320px**:
landmarks, draft notices, loaded stylesheet, relative links, keyboard skip
links, bidirectional page navigation and all nine support disclosures.
Neither page overflowed horizontally or made remote requests; no scripts,
forms or iframes were present. The public issue tracker and existing app preview
both returned HTTP 200. No native runtime code or release URLs were changed.

Follow [the direct Xcode/TestFlight guide](TESTFLIGHT.md). The application
release configuration does not contain the temporary test identifier.
The temporary native copy was cleaned after its build/metadata checks;
verification logs were retained. Signing, owner metadata,
physical-device testing and actual upload/processing remain incomplete;
neither TestFlight availability nor App Store approval is claimed.

## Current 2.7 independent content and lifecycle correction

Verified **314 unit/storage tests**, **87 full production browser tests**,
nine live-preview regressions, typecheck, lint, complete content validation,
the six-version/material review and production web/iOS JavaScript exports.
The current bank has 1,154 independent ingredients and 60 matching role
templates; all 1,326 earlier source records remain available for history.

Studio ensembles survive replay, full advice inputs are separate, explicit
upgrades do not add categories, and old ratings/locks retain their provenance.
The reviewer-found thirteen-original Classroom issue was fixed and verified.
See [executed 2.7 verification](../ATOMIC_27_VERIFICATION.md).
This is not a signed build or physical-device certification; older records
below do not define the current test totals.

## Studio-to-scene ingredient preservation

Open Scene rerolls and repeat rounds retain the current snapshot's category
selection and output preferences rather than adding default inputs. The
initial Studio handoff stays exact. Verified 254 unit/storage tests, 17
targeted production browser tests, a live act-out/reroll/replay regression,
typecheck, lint, content validation and web/iOS JavaScript exports. Native
device testing remains separate.

## Persistent game-type hiding

Party menu exclusions reuse the existing persisted selections for this and
future parties, with Choose games recovery and no source-data migration.
Verified 245 unit/storage tests, 27 targeted production browser tests,
typecheck, lint, content validation and web/iOS JavaScript exports. Physical
device validation remains separate. See [verification](../V1_VERIFICATION.md).

## Current prompt-first Party cards

Party directions, examples and suggested lengths are in How to Play, leaving
the prompt, roles, playable frames and live controls on the card. Groups can
keep going past a suggested turn/line/time limit. Timers keep play live.
Private handoffs, caller/bell controls and direct End game remain.

Latest verification passed **245 unit/storage tests**, **79 full production
browser tests**, typecheck, lint, content/review checks and web/iOS JavaScript
exports. See [current verification](../V1_VERIFICATION.md). Native-device and
signed-build checks remain separate release gates.

## Prior card cleanup

Opening-line hints are no longer generated or displayed in Party, individual
games or help. Old captured fields remain readable for save compatibility.
Party round limits appear in How to Play instead of a House rule card badge.
Expanded material and the direct End game button remain.
Cleanup verification passed 244 unit/storage tests, 22 targeted production
browser tests, typecheck, lint, content/review gates and web/iOS JavaScript
exports; this is not physical-device or signed-build validation.
See [current play behavior](../V1_PLAY_EXPERIENCE.md). The records below
are historical, including verification of the subsequently removed hints.

## Prior 2.6 material and hint follow-up

The latest checks passed **247 unit/storage tests across 26 files**, **72
production browser tests** and two isolated live-preview hint regressions.
Typecheck, lint, content validation and web/iOS JavaScript exports passed.
The current bank has 1,326 ingredients, including 144 additive Spicy/adult
inputs, plus 154 optional contextual openings. Existing 1,182 source records
and locked snapshots remain unchanged.

The exact group-chat opening is covered in the UI, as are immediate adult
delivery and Classroom clean hiding both the card and its hint. The generated
four-pack review includes 4,310 generation checks and 448 role checks.
See [current verification](../V1_VERIFICATION.md) and
[material/hint behavior](../PARTY_MATERIAL_AND_HINTS.md).
Signing, device validation and human studies remain separate release gates.

## Prior prompt browsing follow-up

Studio and quick Party prompt swipes have persisted exact back/forward history
and accessible button alternatives. That follow-up verification was
**225 unit/storage tests and 70 production browser tests**, plus typecheck,
lint, content validation and web/iOS-JavaScript exports. Actual browser touch
events cover scrolling, accidental/multi-finger cancellation and caller-game
exclusion. See [V1 verification](../V1_VERIFICATION.md).
Physical-iPhone gesture behavior remains a separate device check.

## Prior v1 usability and caller update

The earlier executed results are in [V1_VERIFICATION.md](../V1_VERIFICATION.md):
214 unit/storage tests, 64 production browser tests, 14 live-preview regressions,
typecheck/lint/content checks, clean lock installation and web/iOS-JavaScript
exports passed. The version/material review includes 3,620 generation checks
and 448 role-template/count checks.

New Choice now requires at least three people with 2-4 actors and a separate
named manual caller, with a real bundled bell. The audio native module requires
a rebuilt development/device app. No microphone/background audio permission
was added. Signing, owner configuration, real-device validation and distribution
remain incomplete; dependency advisories remain documented.

The older sections below are historical verification records and do not define
the new low-tap defaults or current test counts.

## Concrete round limits and advice requests

- Party cards show a numeric round limit above the prompt. Quick answer games use one answer/pass each; shared stories use two turns each; Hot Seat uses three questions total; scene/interview formats use 60 seconds; Three-Line Scene uses three lines; Mirror uses three moves per leader. Word-at-a-Time stops at one sentence or 12 total words so small groups are not limited to an unfinished four-word fragment.
- All 28 advice situations have an explicit request and a matching harmless example. Card and How to Play use the same context. The exact plane-clapping case asks **How do I live down the embarrassment?** and ends after each player answers or passes once.
- Captured prompt words, locks and versions are unchanged. Unrecognized originals show missing-context guidance instead of invented advice requests. Card changes remain manual; no speech recognition or automatic advancement was added.
- Full checks passed: **163 unit/storage tests across 13 files**, typecheck, lint, complete content validation, production web export and iOS JavaScript/Hermes export.
- **50 production browser tests passed**, including all 39 game lifecycles and the exact plane-clapping problem/request/example, visible one-answer limit, matching How to Play, and unchanged saved source text.
- The live preview displays the original current advice card with its new question, visible limit and matching example. No deck selection or current prompt was replaced.

## Clear Party turns and saved game selection

- Every Party-supported activity now states who contributes, whether to build together or offer separate answers, and when to move on. Hot Seat explicitly uses continuing character Q&A rather than a one-line introduction.
- Choose games is available in setup and the live Party menu. Choices persist for future setup and one-tap starts; current cards stay intact. Play a game now is the separate one-card action.
- Include/exclude switches explicitly expose their checked state on web while retaining native accessibility state; browser regression asserts both included and excluded values.
- Single-game, scenes-only and explicit private-role decks respect the chosen allowlist. Empty, unsupported and currently unplayable selections report errors instead of adding excluded games. Group size, content consent, movement and scene settings remain enforced.
- Adult-only picker descriptions stay gated. Returning to Clean with an adult-only selection immediately hides the current card and offers Edit deck without broadening the selection.
- Full unit/storage suite: **160 passed across 13 files**, including browser IndexedDB and native SQLite aggregate round trips with saved game selections.
- Full production browser suite: **49 passed**, including all 39 game lifecycles, visible Hot Seat guidance, custom-deck next-card behavior, reload/future-party persistence and adult-only Clean recovery.
- Typecheck, lint, content validation, production web export and iOS JavaScript/Hermes export passed. Exporting native JavaScript does not establish a signed build or iPhone/device validation.

## Short-place prompts — content pack 2.4.0

- All 96 locations have reviewed short labels; the exact repair-counter example is now **Repair shop**.
- New Studio defaults generate only a location. Relationships, situations and roles require explicit selection. Single-location Copy / Share has no ingredient labels or role dump.
- All 1,182 ingredient IDs/classifications and Party task tags remain intact. There are 559 archived originals, including all 96 previous location values; locked/saved text is not silently rewritten.
- Full unit suite: 149 passed across 12 files. Typecheck, lint and complete content validation passed.
- Production web export and iOS JavaScript/Hermes export passed. These are not a signed native build or device validation.
- Full browser suite: 46 passed, covering all 39 game lifecycles, simple-place UI/copy, opt-in multi-ingredient recipes, saved locks and explicit upgrades. The exact mentor/umbrella-counter example simplifies through the normal UI to **Repair shop**, survives reload, and leaves the saved original unchanged.
- Two isolated complete authoring rebuilds reproduced all five current banks byte-for-byte; reapplying the 2.4 review changed no bytes. Temporary rebuild directories were removed.

> **Current checkout:** dependencies have been repaired to the stable Expo SDK
> 57 baseline. Normal project checks and actual web/iOS-JavaScript exports now
> run; the previous isolated-tool limitations below are historical. See
> [dependency repair and real build verification](#dependency-repair-and-real-build-verification)
> for the current results and unresolved release gates.

Prepared on 2026-10-16 from the public app's `fc7fff3235145a4eaee70177f65a3207e6dc2871` revision, in the separate `ios-handoff` branch. The live website was not changed or redeployed for this work.

## Completed checks

| Check | Result |
| --- | --- |
| TypeScript | Passed |
| Unit/storage/configuration tests | 100 passed across 9 files |
| Lint | Passed |
| Expo Doctor | All 20 checks passed after compatible SDK 58 patch updates |
| Content validation | Passed: 39 games, 1,182 ingredients, 463 preserved curated examples, 31 Party recipes |
| iOS project generation | `expo prebuild --platform ios --no-install --clean` passed |
| iOS JavaScript/Hermes export | Passed; one approximately 4.1 MB entry bundle |
| Production web export | Passed |
| Browser regression | 11 passed: Party Night, Studio composition/saves and delayed-font startup |
| Development release check | Reports the four missing owner values without blocking local development |
| Strict release check without owner metadata | Correctly exits unsuccessfully; prevents accidental production configuration |
| Production configuration with temporary test values | Resolves expected bundle ID, guest/local mode and privacy settings |
| Whitespace/diff check | Passed |

Browser tests used this handoff's exported build on port 4174, independently of the original website checkout. They are browser coverage, not native device tests.

The generated native project defaults to iOS 16.4. The generated 1024 × 1024 AppIcon is opaque RGB. Generated Info.plist disables file sharing/document opening, marks current OS-provided cryptography as exempt, and does not request camera or microphone access. The Podfile retains privacy-manifest aggregation. Required-reason API declarations exist in dependency manifests, but their final CocoaPods/Xcode aggregate has not been produced or certified here.

Temporary validation identifiers were supplied only to local configuration/prebuild commands. They are not owner registrations, credentials, policy pages or distributable app identities. Generated native projects and export/build output are excluded from the source ZIP.

## Still required before release

This environment did not run CocoaPods, Xcode, a signed native compile, a physical iPhone installation, TestFlight upload or App Review. A Hermes export and native project generation do not prove that a signed iOS binary has passed those steps.

The owner must supply the actual Apple/Expo project metadata and public privacy/support pages, then complete the [release checklist](RELEASE_CHECKLIST.md). Verify the real SQLite bridge, airplane-mode startup, lifecycle/private-role protection, accessibility, final privacy manifests and production network behavior on the built app. No account backend or Sign in with Apple service has been provisioned; the first release deliberately uses guest play and local saves.

## Local review follow-up (2026-10-16)

The unpacked app now lives in `off-script-ios/` below the `offscript` Git
repository root. The [CI workflow](../../../.github/workflows/ci.yml) lives at
that root, with app-relative run, cache and artifact paths. Publish the unpacked
source and root workflow together; the original handoff ZIP is not updated by
source edits.

Review fixes block all ordinary state writes until hydration succeeds, hide
loading-time action docks, and retain an explicitly confirmed reset when stored
data cannot be loaded. Scene Lab now checks saved prompt ingredients when
Classroom clean is enabled. Switching a saved word to ingredient composition
clears the word in the editable copy, not the saved original.

Browser regressions were added for those loading/recovery, saved Scene Lab and
Studio sharing flows. They are not yet verified against a fresh Expo export on
this Mac.

Local verification used Node 24.22.0 with an isolated, compatible test-tool
installation because `npm ci` failed: the configured package registry could not
supply `@radix-ui/primitive@1.2.0` referenced by the lockfile, and the pinned Expo
58.0.14 release was also unavailable there. Direct npm registry access failed as
well. The app's dependency manifest and lockfile were not downgraded or rewritten.

- The existing 100 unit tests passed with the isolated runner, including the
  native repository's in-memory SQL adapter.
- Seven additional isolated checks exercised the actual React provider, Page,
  Studio and Session logic: delayed initialization/read, failed hydration,
  confirmed/canceled/failed reset, saved-word customization/sharing, and clean
  saved-session resume. The bug reproductions failed before the fixes and passed
  afterward. These checks use native/navigation/rendering boundary substitutes,
  not an installed iOS app.
- Content validation passed. Changed browser tests passed a standalone strict
  TypeScript check and were discovered by Playwright.
- Root workflow paths and changed-file formatting were checked. Changed-file
  lint rules passed with an isolated resolver and missing-dependency resolution
  excluded; this is not a full project lint pass.
- Standard project typecheck/lint and web export remain blocked by the missing
  Expo/native dependencies. No fresh browser run, native compile, signed build,
  physical-device test or upload is claimed.

## Play-clarity and usability follow-up

New play no longer offers Battle. The stored value remains readable without
rewriting old prompts or rounds. The UI explains Take turns versus Anyone can
jump in, Just for fun versus Practice skills, and Free play versus Rounds.
Library groups use descriptive names and only filter the catalog; Studio's
handoff is labeled Act out this prompt.

The follow-up fixes minimum-roster replay/recast guards, manual and timed relay
role transfer, all-pass Party recovery, independent spoken cue delivery,
Half-Life boundary signals, starting-modifier visibility and optional Party
countdown visibility. Teaching copy is aligned with the actual casts and
controls. The runtime and reference catalogs agree; all 39 IDs remain, and the
ingredient banks and preserved originals were not rewritten.

Saved-state validation now checks cross-record integrity and rejects bad updates
before changing either the provider's visible state or the stored aggregate.
Archived actors, legacy Studio seat placeholders and old competitive values have
explicit compatibility coverage. New snapshots retain optional classification;
known legacy IDs/aliases still work, while unknown unclassified text is not
silently treated as classroom-clean.

With the same dependency-availability limitation described above:

- 140 unit tests passed in the isolated compatible runner.
- Eleven isolated checks exercised actual React/provider/component logic with
  native/navigation/rendering boundaries substituted; these are not iPhone tests.
- 5,022 legal game/count/intent/flow/seed lifecycle cases and 340 Party
  recipe/group-size cases passed, including the stricter complete save schema.
- Content validation and standalone strict domain/browser-test typechecks passed.
- 43 browser cases were discovered. They have not been executed against a fresh
  Expo export here.
- Full Expo project checks, native compile, signing, device accessibility/audio
  behavior and human playtesting are still separate, unverified release gates.

The final independent review identified legitimate imported Party role IDs that
needed to remain portable rather than act as roster foreign keys. New and
already-stored Party-to-scene handoffs now have regression coverage in both
repositories. Validation, the scene card and its detail cards share role-to-cast
resolution without rewriting the original snapshots; ordinary game actor
references are still checked strictly.

## Dependency repair and real build verification

The original lockfile contained eight dependency-version/tarball mismatches,
and several direct version minimums were not available through the configured
registry. The available SDK 58 baseline required a React Native release candidate.
The repaired checkout therefore follows the published stable Expo 57.0.27
compatibility map and TypeScript template: React 19.2.3, React Native 0.86.3 and
the corresponding Expo/native modules. Node 24 is retained. Expo's installer
selected Reanimated 4.5.1 and Worklets 0.10.1 for the router's native peers.

The npm-generated lockfile has zero version/tarball mismatches, and a clean
standard `npm ci` succeeds without force or legacy-peer bypasses. The scoped
`xcode` → `uuid` 11.1.1 override removes the old UUID advisory while preserving
the actual CommonJS parser/UUID API, verified with a parsed project fixture.
The remaining advisory count is 21: 18 high and 3 moderate, propagated from
upstream `braces`, `node-forge` and `decode-uri-component` dependency chains.
Published compatible fixes are not available for all of these in this registry;
the audit's forced Expo 44 / React Native 0.72 downgrade is not a safe repair.
This is not a clean dependency-security sign-off.

Actual installed-project results:

| Check | Result |
| --- | --- |
| Clean locked install | Passed |
| Normal `npm test` | 140 tests passed |
| Normal `npm run typecheck` | Passed, including Expo/native declarations |
| Normal `npm run lint` | Passed without missing-module exclusions |
| Content validation | Passed; all 39 games and ingredient-review coverage retained |
| Production web export | Passed; WOFF2 assets explicitly registered with Metro |
| iOS JavaScript/Hermes export | Passed; one approximately 4 MB bundle |
| Full real Chromium suite | 43 passed, including the all-39-game flow, offline reload, large text, fonts, saved originals and imported-role reload |
| Expo Doctor | 20/21 passed; the remaining online check recommends eight newer patch versions unavailable through this registry |
| Local bundled SDK compatibility | Offline check reports the installed set up to date; this does not replace the online patch recommendation |

Browser test fixtures now wait for saved-state commits before forced navigation
or reloads, and use the current plain-language labels. Large-text and classroom
scenarios verify that their settings actually persisted before exercising them.
CI uses a fresh owned test server instead of silently reusing another process.

The owner still needs to supply the actual bundle ID, Expo/EAS project UUID and
approved public privacy/support URLs; the strict release gate continues to reject
missing values. No owner identifiers or legal pages were fabricated. Newer
recommended SDK patches and upstream audit advisories require follow-up as
patched packages become available. A signed native compile, physical-iPhone
testing, final privacy-manifest inspection and TestFlight/App Store submission
remain unverified and are not implied by the Hermes export or Chromium results.

## Local development preview follow-up

Starting the actual Metro development preview exposed empty message strings
rendered directly into native View containers and a request for the
production-only offline worker. Message conditions now produce booleans, and
worker registration is restricted to production web exports with explicit
failure logging. The startup console regression failed for both issues before
the fixes and passes against the real development server afterward.

Normal unit tests remain 140/140, full TypeScript/lint pass, and the rebuilt
production web app passes 44/44 browser checks, including offline play. These
preview fixes do not change the owner-metadata or upstream-dependency release
limitations above.
