# Native release checklist

## Restricted owner-only internal beta

- Confirm the real Apple app record, registered bundle/team, and authorized
  signing account in Xcode. An Expo account is not required for local delivery.
- Create a signed Release archive and upload using TestFlight Internal Only
  (`testFlightInternalTestingOnly=true` for command-line exports).
- Use an internal group containing the existing owner account, not new
  app-management accounts for friends.
- Verify Apple processing, group build availability and the owner invitation.
  Upload acceptance alone is not proof that an iPhone can install the build.
- Public policy/support-page publication is not an Apple prerequisite for
  this restricted path. The full metadata/public-release checks below remain
  strict and must not be satisfied with invented URLs.

## Owner configuration

- Use the owner's Apple Developer account, and their Expo/EAS account only if using EAS; establish the actual app name/rights, bundle ID and App Store Connect record.
- Fill public metadata in `.env.local`/app.json and in the appropriate EAS environments. Run `npm run ios:check -- --release`.
- Host an approved public privacy policy and support page with a real contact path. The native app exposes those configured links in Settings. Both App Store metadata and in-app privacy access are required.
- Apple's Support URL documentation requires actual contact information on
  that site (legal address, email or telephone, as applicable). The current
  issue-tracker-only draft still needs an owner-approved contact method.
- Review the App Store age/content questionnaire against the entire available app, including optional suggestive adult comedy; default Clean mode is not a reason to omit that content from disclosures.

## Native build and privacy

- Run `npm ci`, typecheck, content validation, tests and Expo Doctor with the lockfile.
- Build with Xcode or EAS. This package's source is not a signed IPA.
- Inspect the actual archive's Info.plist, entitlements and aggregated PrivacyInfo.xcprivacy. No camera, microphone, location, contacts or tracking permission is needed for the current game experience. Development-client local-network behavior is distinct from the production app.
- The app manifest declares no tracking/developer data collection. React Native/Expo dependencies supply required-reason API declarations; the generated Podfile keeps privacy-manifest aggregation enabled. CocoaPods/Xcode must perform and verify the final aggregation.
- Current native source uses OS-provided cryptography; the encryption exemption flag is set accordingly. Reassess if the product adds custom/non-exempt encryption.
- Inspect release network behavior, SDK manifests and any user-initiated support/feedback transmission before completing App Store privacy answers. Do not infer the final privacy label solely from a default manifest.
- Check the generated AppIcon asset has the required 1024-square opaque rendition; Expo performs native icon generation from the provided source.

## Physical-device acceptance

- New group: 2–12 optional names → card → Next without repeated setup; returning group one-tap fresh deck; rename/add/remove and archived names remain correct.
- Prompt Studio: each category alone stays pure; selected-category-only composition; locks/rerolls; saved originals; Connected/Mix Freely; native share-sheet behavior.
- Airplane mode from a clean install of a signed native build; bundled fonts and all catalogs work without a first web visit.
- Background/lock/unlock/force quit: timers pause, private roles cover, exact sessions restore safely. Verify real native SQLite bridge behavior and app updates without losing data.
- Ring/Silent/no-audio: all cues remain visually/manual usable. Optional speech/haptics must fail gracefully.
- VoiceOver, Dynamic Type, Reduce Motion, dark/light, keyboard, safe areas, landscape, small iPhone and supported iPad layouts.
- Privacy/Support links open their real pages; Clear all local data clears names/history/favorites/preferences and retains games. Document OS backups honestly.

## Distribution

- For local Xcode delivery, use [the TestFlight steps](TESTFLIGHT.md) and
  the correct internal-only or full-release path. `npm run ios:check:local`
  remains the full-metadata check without an EAS project requirement;
  it does not waive full-release policy/support or signing/owner approval.
- Complete real App Store metadata, policy URLs, support contact, screenshots and age/privacy answers.
- The existing 1.3.0 (1) binary is internal-only. Upload a new corrected build
  without that restriction, match its version to the store version record,
  and select it after processing. Do not try to submit the internal-only build.
- Upload the signed production build to TestFlight; test the actual binary. Record crash/lifecycle/accessibility results.
- Have the owner review the concrete build/metadata and make the final App Review/release decision. A TestFlight upload, a JavaScript export and an App Store approval are separate outcomes.
