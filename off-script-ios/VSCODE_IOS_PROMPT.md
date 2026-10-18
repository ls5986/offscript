# Continue Off Script as a native iOS app

Current product behavior is documented in [V1_PLAY_EXPERIENCE.md](docs/V1_PLAY_EXPERIENCE.md): content pack 2.5.0, ingredients-first Studio, low-tap same-game Party prompts, strict deliberate game selection, minimal explicit feedback sharing, and a separate human caller for New Choice. Preserve the historical reviews rather than restoring their old defaults.

Read START_HERE_IOS.md, docs/ios/VERIFICATION.md, docs/ios/DATA_AND_SYNC.md and docs/ios/RELEASE_CHECKLIST.md before changing code.

You are continuing an existing Expo SDK 57 / React Native 0.86.3 app with a verified stable dependency lockfile, not converting an HTML prototype. Do not restore the unavailable SDK 58 patch pins from the original archive. Keep the warm navy/cream/lilac brand, 39 games, continuous hosted Party Night, optional names and passes, one-tap returning play, full Explore catalog, and standalone Prompt Studio. Preserve pure ingredient values, selected-category-only deterministic composition, individual locks/rerolls, content versions, curated original combinations and all ingredient-purity corrections in pack 2.3.0.

The first iOS release is guest-only with local SQLite saves. Do not add a mandatory login, remote database, analytics, server, AI generator, in-app purchases, web wrapper or new provider without a product requirement. Players are session participants, not account owners. Cloud sync and Sign in with Apple are a later optional enhancement described in docs/ios/APPLE_SIGN_IN.md.

First run npm ci, npm run typecheck, npm test, npm run content:validate and npm run ios:check. Configure the owner's actual bundle ID/EAS project/privacy and support URLs using .env.local or app.json. Configure the same public metadata in EAS environments. Never invent account IDs, legal pages, credentials or a successful signing result.

Finish native work on macOS/Xcode and a physical iPhone. Check the release checklist, including fonts/icon, permissions, privacy manifest aggregation in the signed archive, VoiceOver/Dynamic Type, safe-area/control layouts, silent-mode visual cue fallback, background/private-role cover, airplane mode, app updates and local data deletion. Keep simulator generation, Hermes export, native compile, signed build, TestFlight upload and App Store approval as separate claims.

Use the existing repository interface and migrations. Do not reset existing data to fix an upgrade. Do not store future auth tokens in SQLite or treat player IDs/emails as account ownership. New fields/migrations must preserve historical prompts/IDs/locks/source versions and archived cast names.

The handoff excludes Sites hosting identity, repository credentials, installed dependencies, generated native folders and real user data. It does not authorize changes to the existing public website. Keep native release work isolated unless the owner asks to merge/publish shared changes.

Complete reversible preparation and testing autonomously. Owner-specific credentials/signing access, final policy/metadata decisions and physical-device feedback are the remaining external inputs. Report the actual result and any remaining blocker accurately.
