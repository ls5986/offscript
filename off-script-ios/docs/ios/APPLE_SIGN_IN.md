# Sign in with Apple: recommendation and later scope

## Recommendation

Ship the first release with no account and local saves. The core experience is one phone with friends; signing in does not help that immediate task. Apple App Review Guideline 5.1.1(v) says apps without significant account-based features should allow use without login. Local names/favorites are still data, but they do not require developer-operated cloud collection.

Sign in with Apple is a standard, practical addition when there is a clear benefit such as syncing the phone owner's saved prompts across devices. The native button/Apple capability is only one part. It does not create a cloud database, migrate guest data, handle ownership/conflicts or delete accounts for you.

| Approach | Benefit | Additional work |
| --- | --- | --- |
| Guest + local saves (v1) | Fast start, offline play, fewer services | Native release QA, policy/support pages, clear local-data behavior |
| Optional Apple sign-in + cloud sync (later) | Owner can recover/sync a library | Apple capability, auth verification, token/session storage, server ownership, guest import, sync/conflicts, deletion/revocation |

## Implementation sequence when requested

- Add the native Apple authentication SDK/capability to the owner's bundle ID; test on an actual supported Apple device. Keep guest play as a first-class route.
- Use Apple's standard button and available credential flow. Handle cancel/error/revoked credentials gracefully. Apple may return name/email only on first authorization; neither email nor relay email is the durable account key.
- Exchange/verify the Apple credential with a trusted auth service/backend. Validate the expected issuer, audience, signature, expiry and nonce; do not trust a client-decoded token or a user ID supplied in a request.
- Use a stable server account ID mapped to the verified Apple subject. Store app session credentials securely on-device. Keep Apple signing/private keys server-side.
- Implement account deletion inside the app, including associated remote data and Apple token revocation. Handle Apple server notifications where applicable.
- Then implement opt-in guest-library import and cloud sync as described in DATA_AND_SYNC.md. Do not upload party names/private roles merely because someone signs in.
- Update privacy policy, App Store privacy answers and dependency/network audit for the actual implementation.

If Google/Facebook or another social login is added, Apple's 4.8 Login Services rule generally requires an equivalent privacy-preserving option; Sign in with Apple is the usual way to satisfy it. This is not a rule that every account-free app must add an Apple button.

## Official references checked 2026-10-16

- [App Review Guidelines: 4.8 and 5.1.1](https://developer.apple.com/app-store/review/guidelines/)
- [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- [App privacy details](https://developer.apple.com/app-store/app-privacy-details/)
- [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
- [Expo Apple authentication API](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)

The Apple policy pages were retrieved during preparation. The Expo documentation host returned HTTP 403 in this environment; its URL is provided for the receiving developer, without claiming a fresh API-documentation check. No account service, Apple capability or credentials have been provisioned.
