# Off Script: App Store submission readiness

## Latest TestFlight update: matching build 1.3.0 (4) uploaded

The newer compact Library and first-use source now has a signed matching
archive, **1.3.0 (4)**, successfully uploaded at **7:50 PM on October 18**.
Apple acknowledged processing. The shared portal remains signed out, so
completed processing and current tester availability are not verified.
See [the exact build/delivery evidence](ios/VERIFICATION.md).

This standard App Store Connect upload is not restricted to internal-only
testing, but it is still a **beta upload, not public App Review submission**.
It does not complete the owner-approved public links, contact details or
other declarations below. A later public-release binary must embed the
approved privacy/support URLs, which remain unset. Do not reupload build 4.

## Earlier public-release attempt: owner prerequisites blocked

The owner requested a matching native build and App Review submission on
October 18, 2026. Fresh validation passed **358 unit tests across 41 files**,
TypeScript, lint and content validation. The public-release preflight
(`npm run ios:check:local`) correctly rejects the missing approved public
privacy-policy and support HTTPS URLs. The shared App Store Connect browser
still redirects to sign-in with `authResult=FAILED`. Opening the Vercel
dashboard also redirects to login, so no authenticated hosting session is
available.

[Copy-ready listing and review notes](APP_STORE_METADATA.md) are prepared.
The name, subtitle, promotional text, description and keywords were checked
against their field limits. These are local drafts, not metadata saved to
the authenticated Apple record.

The screenshot-matching source has also passed unsigned Release compilation
for the generic arm64 iOS device target. Its actual bundle contains the new
Library/first-use markers, and its vendor frameworks match the available
authentic dSYMs. This is not the pending signed release archive; see
[device validation evidence](ios/VERIFICATION.md).

No approved public support contact, deployed policy/support URLs or policy
publication approval was supplied when requested. Do not substitute a private
Apple email, invent URLs, infer approval from an unavailable-owner response,
or bypass the release preflight. Finalize and verify those links before
archiving so they are embedded in the matching binary. No new build number
has been assigned, matching archive created, upload performed or App Review
submission made during this attempt.

At that earlier attempt, the latest confirmed upload was **1.3.0 (3)**, delivered successfully through
Organizer on October 18 with matching authentic framework symbols. It used
standard App Store Connect distribution (`testFlightInternalTestingOnly=false`).
It is not restricted to internal TestFlight, but predates the compact Library
and first-use improvements shown in the new marketing screenshots. Verify the
next unused build number in authenticated App Store Connect before building
the matching release. Do not reupload build 3 or submit it as matching artwork.

The original build **1.3.0 (1)** was internal-only and is not App Store eligible.
Earlier build-2 authentication failures do not supersede build 3's successful
delivery. See [executed iOS verification](ios/VERIFICATION.md).

## Registered Apple identity

- Listing: **Off Script: Improv Games**.
- Home-screen name: Off Script.
- Bundle ID: `com.lindseystevens.offscript`.
- Team ID: `S6R25SG86U`.
- Apple app ID: `6824118644`.
- [App Store Connect](https://appstoreconnect.apple.com/apps/6824118644/distribution).

The October 18 browser check redirected to Apple sign-in. This session has
not verified which metadata fields the owner may have completed since app
creation. Items below are required checks, not invented live dashboard results.
Sign in through Apple's UI; do not put passwords or codes in source or chat.

## What must be ready before Add for Review

1. **Readable, stable native build.** Check light and dark appearance, fields,
   selected/unselected controls, private-role cards, dialogs, status bars,
   VoiceOver, larger text, offline launch, sound/silent behavior, background
   restore, SQLite saves and update-without-data-loss on an actual iPhone.
   Simulator/browser checks do not replace the owner's physical-device report.
2. **Approved, published privacy policy and support page.** The
   [privacy](../release-pages/privacy.html) and
   [support](../release-pages/support.html) sources now build with the
   [unified Vercel website](VERCEL_WEBSITE.md), but are not live release URLs.
   The support site must expose an actual owner-approved contact
   method; Apple's documentation lists legal address, email or telephone.
   Set `OFFSCRIPT_SUPPORT_EMAIL` to publish an approved support email.
   A public issue tracker alone is not a safe substitute for that requirement.
   Do not publish a private Apple account email/address without permission.
   Configure verified HTTPS URLs, then run `npm run ios:check:local`.
3. **Complete store listing.** Description, keywords, support URL, copyright,
   primary category and any additional required fields. Optional promotional
   text/subtitle can be added without treating them as submission blockers.
   Keep the listing and the selected binary's marketing version consistent.
4. **Actual screenshots.** Supply the screenshots App Store Connect requires
   for supported iPhone and iPad sizes; the app currently supports iPad.
   Six current-native designs for each device are prepared in the
   [launch-media package](../marketing/README.md). Match the submitted binary
   to those screens; do not use old web-preview images or invented gameplay.
   The website/social tutorial videos are not Apple App Preview deliverables.
   Do not remove iPad support merely to avoid preparing screenshots.
5. **Age/content questionnaire.** Disclose all accessible material, including
   optional Spicy and suggestive adult content, not only default Clean mode.
   The app's 18+ toggle is not identity-based age verification. Apple calculates
   the rating; do not promise a particular age rating or approval.
6. **App Privacy and content rights.** Review the app and included SDKs,
   user-chosen feedback sharing, support handling and any applicable
   disclosure exceptions against Apple's definitions. Local-only player data
   does not by itself prove a blanket "no data collected" answer. Apple-managed
   TestFlight diagnostics are documented separately in the draft policy.
   Confirm rights to the name, fonts, original prompts and other assets.
7. **Review contact and instructions.** Provide the owner's real review email,
   telephone and contact name. The current app requires no Off Script account,
   so no fake demo login is needed. Explain one-phone group play, Studio,
   optional adult settings, offline operation and private-role handoffs.
8. **Pricing, availability and agreements.** Choose free/paid pricing and
   territories, complete applicable export-compliance and regional/trader
   declarations, and have the Account Holder review required Apple agreements.
   Do not accept legal terms or choose commercial/trader status on guesses.
9. **New App Store-capable upload.** Archive the corrected build with an unused
   build number and standard App Store Connect distribution, **without**
   `testFlightInternalTestingOnly=true`. Wait for processing and select that
   exact build on the matching version record. Neither a JavaScript export
   nor the original internal-only upload satisfies this step.
10. **Owner-approved submission.** Select manual release if the owner wants
    control over public launch, resolve App Store Connect's validation errors,
    choose Add for Review and submit the version. App Review submission and
    approval/public release are separate events. Do not submit publicly until
    the owner approves the concrete build and metadata.

## What is not needed for the current app

- A cloud database, runtime AI service or new player accounts.
- Sign in with Apple, since there is no account sign-in flow.
- A paid Expo plan or EAS project for direct local Xcode delivery.
- App Store publication just to continue internal testing.

## Official references

- [Apple's before-you-submit checklist](https://developer.apple.com/app-store/review/guidelines/#before-you-submit)
- [Platform version information, including Support URL requirements](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/)
- [App Privacy details and collection definitions](https://developer.apple.com/app-store/app-privacy-details/)
- [Set an age rating](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating/)
- [Internal TestFlight restrictions](https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers/)

For signing/upload instructions, use [the TestFlight guide](ios/TESTFLIGHT.md)
and [native release checklist](ios/RELEASE_CHECKLIST.md).
