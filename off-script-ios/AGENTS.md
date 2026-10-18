# Off Script native handoff

Read START_HERE_IOS.md, VSCODE_IOS_PROMPT.md and docs/ios/VERIFICATION.md first.

Continue the existing Expo/React Native app. Keep the first iOS release guest-only with device-local SQLite saves. Preserve current game/UI behavior and pure selected-category-only prompt composition, source versions, locks, saved originals and archived actors. Use existing domain/repository interfaces.

Keep native release work isolated from the existing public Sites deployment. Do not provision a remote backend, require accounts, add analytics or rewrite the application as a WebView as part of packaging. Apple sign-in/cloud sync are optional later scope documented in docs/ios/APPLE_SIGN_IN.md.

Complete reversible preparation autonomously. Do not invent owner bundle IDs, Apple/EAS account values, signing assets or policy URLs. Native metadata can use the supported public environment variables; secrets never belong in source or EXPO_PUBLIC variables. Signing, native-device verification and final distribution are distinct from Hermes export/prebuild.

Use npm ci, typecheck, content validation and appropriate tests. The content editorial review protects all ingredients; update it deliberately when editing the library. Test real iOS behavior on macOS/hardware when available and state remaining limits accurately.
