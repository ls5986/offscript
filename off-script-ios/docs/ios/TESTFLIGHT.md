# Off Script: local Xcode to TestFlight

This route builds on the Mac and uploads the signed binary with Xcode.
An Expo/EAS account or project ID is **not required** for this route.
Do not use a simulator or unsigned validation build for TestFlight.

## Immediate owner-only testing

**Latest beta upload:** the full Library/content 2.8 build **1.3.0 (3)**
uploaded through Organizer at 12:34 PM on October 18, with matching official
framework dSYMs included. Apple's receipt confirms upload success and processing
handoff. The earlier authentication failure was superseded; do not reupload
this build. The shared portal still needs sign-in, so finished processing and
current tester access have not been re-verified there.

The successful GUI delivery used standard App Store Connect export, not the
internal-only flag used by the earlier failed CLI attempt. This does not
publish the app or submit it for public review. The restricted internal-only
instructions below remain an option for future owner-only builds.
See [the actual delivery evidence](VERIFICATION.md).

For the owner's **internal TestFlight** build, public privacy/support-page
publication is not an Apple upload prerequisite. Do not delay this path on
website drafts or confuse the app's stricter public-release preflight with
Apple's internal-beta upload requirements.

Use the verified bundle/team below and an authorized Apple account in Xcode.
Generate the native project, install its CocoaPods, then create a signed Release
archive. In Organizer, choose **TestFlight Internal Only**; the command-line
equivalent is an App Store Connect export with
`testFlightInternalTestingOnly=true`. This restriction prevents that build
being distributed through external TestFlight or the public App Store.

The `Owner testing` internal group has been created with automatic distribution.
Only the existing Account Holder was added; do not add friends as
app-management users to bypass external beta review. A group without a processed
build is not an installable beta.

The public metadata and `ios:check:local` steps below remain the **full release
preparation** path. Their strict checks and the EAS production guard are
unchanged; no placeholder URL should be supplied to make them pass.

The October 18 readability correction has a verified signed **1.3.0 (2)**
archive, but its upload was blocked by expired App Store Connect access in
Xcode. Reauthenticate through Xcode Settings > Accounts, then retry the
internal-only upload. The browser passkey option also requires owner
authorization. Do not assume build 1 updates itself when local source changes.
See [the latest build/upload evidence](VERIFICATION.md).

## 1. Connect the owner's Apple account

The owner must have active Apple Developer Program access and a role permitted
to create/upload this app. Sign in through Apple's own interface:

- [Apple Developer account](https://developer.apple.com/account/)
- [App Store Connect](https://appstoreconnect.apple.com/apps)
- Xcode > Settings > Accounts

Never put Apple passwords, verification codes, private keys or signing
certificates in source or chat. A development signing identity by itself does
not establish that a paid membership or distribution permission is available.

If Off Script already exists in App Store Connect, use that app record and its
registered bundle ID. Otherwise, register an explicit bundle ID in the correct
team, then create an iOS app record. Do not guess or reuse another app's ID.
An Account Holder may need to accept Apple's current agreements first.

### Verified Apple registration: October 17, 2026

- Store listing name: **Off Script: Improv Games**. Apple rejected `Offscript`
  because that name was already in use; the home-screen name remains Off Script.
- Platform: **iOS only**.
- Registered explicit bundle ID: `com.lindseystevens.offscript`.
- Apple Developer team ID: `S6R25SG86U`.
- Apple app ID: `6824118644`.
- Internal SKU: `OFFSCRIPT-IOS-001`.
- Primary language: English (U.S.).
- [App Store Connect record](https://appstoreconnect.apple.com/apps/6824118644/distribution)

The authenticated Developer account showed an active Individual membership,
renewing September 5, 2027. The registered identifier was verified in the
Identifiers list, and the new app's TestFlight page showed
**"Submit a build to start testing."** Registration is not a signed build or upload.
No other app's identifier was reused.

## 2. Fill the real public app metadata for full release preparation

This checkout's ignored `.env.local` now contains the verified bundle and team
IDs above. Preserve those values and fill its blank privacy/support URLs.
For a fresh checkout, copy `.env.example` to `.env.local` and set:

```dotenv
OFFSCRIPT_IOS_BUNDLE_ID=<the registered Off Script bundle ID>
OFFSCRIPT_PRIVACY_URL=<the owner's approved public HTTPS privacy policy>
OFFSCRIPT_SUPPORT_URL=<the real public HTTPS support page>
```

`OFFSCRIPT_APPLE_TEAM_ID` is optional if the authorized team will be selected
in Xcode. For this local route, `OFFSCRIPT_EAS_PROJECT_ID` may remain unset.
The privacy/support URLs are requirements of the app's release preflight;
do not invent a policy or contact destination to make the check pass.

Then run:

```bash
export PATH=/opt/homebrew/opt/node@24/bin:$PATH
npm run ios:check:local
```

This check skips only the EAS project requirement. It still rejects missing
or placeholder bundle IDs, invalid supplied team IDs and invalid public pages.
Passing it does not establish Apple registration, signing, device behavior or
upload success.

The existing `npm run ios:check -- --release` and EAS production profile retain
their stricter EAS project requirement. Do not combine `--local` with
`--submit`: the latter checks the EAS submission profile.

### Website pages and public hosting

The unified Vercel export now builds the public pages from:

- [Privacy policy](../../release-pages/privacy.html)
- [Support](../../release-pages/support.html)
- [Landing page](../../release-pages/index.html)

See [the Vercel setup guide](../VERCEL_WEBSITE.md) for `/`, `/play`, `/privacy`
and `/support`. They share responsive CSS and use the existing export build,
with no new dependency. The static public pages contain no scripts, forms,
remote fonts or analytics. `OFFSCRIPT_SUPPORT_EMAIL` can add the owner's approved
public contact to both policy/support pages. If unset, only the public
[repository issue tracker](https://github.com/ls5986/offscript/issues) is offered;
that alone does not complete Apple's actual-contact-information requirement.

The policy distinguishes local app data and user-chosen feedback from
Apple's **automatic TestFlight diagnostics** and Vercel's hosting metadata.
Review the policy language and contact before publishing. No Vercel deployment
or live policy URL is claimed by creating those sources.

Deploy the built `dist` output, not raw template files. The build resolves the
configured public domain and optional support email; no private owner contact
or Apple credential is invented. Verify both resulting HTTPS URLs and their
actual page contents before setting the two native release environment variables.
Do not use local file URLs or hypothetical GitHub Pages URLs to pass preflight.

## 3. Generate and open the actual native project

For full release preparation, complete the real metadata above first.
For the restricted internal-only path, the registered bundle/team and
authorized signing access are sufficient to start native generation:

```bash
npx expo prebuild --platform ios
open ios/OffScript.xcworkspace
```

Use the workspace, not the `.xcodeproj`, because CocoaPods dependencies are
required. If prebuild regenerates the native directory, run `pod install
--project-directory=ios` before opening/building the workspace.
Prebuild must use the real bundle ID; an example identifier in an isolated
build experiment is not an owner identifier. Keep the configured local
scene-lifecycle plugin: the installed Expo SDK's scene delegate is required
for a successful iOS 27 launch, not merely a successful compile.

In the OffScript target:

1. Under Signing & Capabilities, select the authorized team and confirm the
   bundle ID matches App Store Connect.
2. Use automatic signing unless the owner already has a deliberate manual
   signing setup. Let Xcode manage credentials; do not copy keys into the app.
3. Confirm version `1.3.0` and select an unused build number after checking the
   existing App Store Connect builds. Persist a chosen `ios.buildNumber` in
   the Expo app configuration if it should survive regeneration.
4. Choose a generic iOS device destination, not a simulator.
5. Product > Archive.

Inspect the archive's actual entitlements, icon and aggregated privacy
manifest. The current source does not request camera/microphone/background
audio access, and declares OS-provided encryption with
`ITSAppUsesNonExemptEncryption=false`; confirm those facts in the archive.

## 4. Upload and enable testing

In Xcode Organizer, select the archive, validate it and use Distribute App >
App Store Connect > Upload. Complete Apple's authentication and any signing
prompts in Apple's interface.

Wait for processing in App Store Connect. A local archive is not evidence of
an upload, and an accepted upload is not evidence that processing has finished.

- For the owner/team, create an internal TestFlight group and add the processed
  build and eligible team testers.
- For friends outside the App Store Connect team, use an external testing
  group. The first external build requires Apple's TestFlight beta review.
  Do not grant friends app-management privileges merely to use internal testing.
- Supply genuine beta contact/review information. Answer content/age questions
  for all available material, including optional adult comedy, not only the
  default Clean setting.
- Install through TestFlight on an iPhone. Check native SQLite persistence,
  cold/offline launch, private-role cover, the New Choice bell, background
  recovery and accessibility before wider distribution.

TestFlight testing does not require publishing the app publicly on the App
Store. App Store release is a separate review/decision.

### Missing React Native framework symbols

`Upload Symbols Failed` for React, ReactNativeDependencies or hermesvm is a
debug-symbol warning, not proof that the app upload failed. Check the actual
delivery result and processed build separately. Missing symbols affect crash
report symbolication in those frameworks, not the UI colors or saved data.

The retained corrected **1.3.0 (2)** archive now contains all three official,
exact-UUID device dSYMs; see [symbol verification](VERIFICATION.md).
The app payload and signature are unchanged. Reopen that corrected archive
in Organizer before a new distribution attempt so it reads the added symbols.
If Apple already accepted this build, do not repeatedly upload the same
version/build merely to remove a symbol warning.

For a newly generated archive, repeat the symbol check: select the exact
installed vendor versions' Release symbol artifacts, verify published
checksums, choose the iPhone-device slice, and compare each framework binary
with its dSYM using `xcrun dwarfdump --uuid`. Copy only matching bundles into
the archive's `dSYMs` directory. Never substitute Debug/simulator symbols,
rename an unrelated dSYM, or fabricate symbols from a stripped binary.
Do not turn off all symbol uploads just to hide warnings.

## Verified starting state and remaining gates

The app/content checks are recorded in
[2.7 verification](../ATOMIC_27_VERIFICATION.md). Native compile/signing/upload
are separate stages; their latest actual results are recorded in
[iOS verification](VERIFICATION.md).

Apple authentication, paid membership and Off Script registration are now
verified as recorded above. A real signed Release archive and internal-only
upload of version 1.3.0 (1) have succeeded. See the current processing/access
evidence in [iOS verification](VERIFICATION.md).
The approved public privacy/support URLs are still unset; they remain part
of full release preparation, not a prerequisite for this restricted internal
beta. Expo remains unnecessary for the direct Xcode route.

The Developer account displayed an updated program-license notice with an
October 28, 2026 deadline. The owner must review any agreement personally;
this session did not accept legal terms.

Official references:

- [Create an App Store Connect app](https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app/)
- [Upload builds](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/)
- [TestFlight overview](https://developer.apple.com/testflight/)
