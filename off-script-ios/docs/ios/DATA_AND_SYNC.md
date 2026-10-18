# Data architecture for the first iOS release

The app already has the appropriate first-release backend: local persistence, without a remote service. `OffScriptRepository` in `src/storage/model.ts` is the storage boundary; `repository.native.ts` uses SQLite and `repository.web.ts` uses IndexedDB. `AppProvider` owns serialized state writes, restoration and game actions. Bundled content is immutable and authored separately from player data.

## Keep for v1

| Data | Storage | Owner/control |
| --- | --- | --- |
| Bundled games, ingredients and curated combinations | App bundle | Versioned authored content; remains after local reset |
| Player names, party groups and historical assignments | Native SQLite | Device-local session actors, UUIDs, optional names |
| Prompts, locks, source versions, favorites and presets | Native SQLite | Exact local snapshots |
| Cues, private roles, timers and session history | Native SQLite | Pause/cover safely on restore; never expose private roles in public previews |
| Feedback | Local state | Shared only when the user explicitly exports it |
| Preferences | Native SQLite | User can reset locally |
| Login tokens | None | No accounts in this release |

Keep AppData schema version 1 and SQLite user_version 1 until an actual migration is needed. Zod supplies backward-compatible defaults. Native writes are transactional and preserve archived actors/foreign-key history; projection caches update after successful transactions. Clear all local data removes user records and leaves the bundled catalog available. This has a real SQL test adapter, but still needs physical iOS bridge/lifecycle testing.

Save validation also checks unique identities, seats and round ordinals; the
active player count; round/session ownership; and player, team, result and Party
card references. Historical references may resolve through archived players,
and older Studio `Player N` seat placeholders remain valid. Invalid state is
reported before either adapter replaces its persisted aggregate; it is not
silently repaired by deleting history. A saved activity not present in the
installed catalog requires an explicit update/recovery decision.

An imported saved prompt can legitimately retain actor UUIDs from a different
Party session. For Open Scene, those portable role identities resolve by role
order to that round's saved cast; they are not treated as foreign keys into the
new roster. Validation and both role-display surfaces use the same resolver.
The source snapshot's words, role IDs, locks and provenance remain exact, including
when an older Party-to-scene record is reopened.

New snapshot ingredients and joke words carry optional `contentRating`
provenance. This is an additive version-1 field: older snapshots keep their exact
text and can use known catalog IDs or ingredient aliases for classification.
Unknown values without classification are not assumed clean. They stay saved
but are hidden under Classroom clean, including when opened in a scene.

SQLite is not a secure token vault and this app does not add SQLCipher encryption. It resides in iOS's app container and benefits from OS protections. Do not promise forensic deletion, cloud recovery or cross-device sync. Apple-controlled device backups may include app data. A browser's saved data does not automatically appear in a newly installed iOS app; a future user-controlled transfer feature would need explicit implementation and validation.

## Preserve a clean upgrade path

If an account-backed sync feature is later justified:

1. Keep guest play. Introduce a separate account identity for the phone/library owner; never convert all party participants into accounts.
2. Introduce a separate authenticated sync adapter alongside local persistence. Let local play stay usable offline; authentication is not a condition of game-engine execution.
3. Keep device/entity UUIDs. Add explicit owner, entity revision and sync timestamps; enforce ownership on the server. A player name or an ID supplied by a client is not authorization.
4. Ask the signed-in owner which existing local collections to import. Make the import transactional/idempotent, with a retained local recovery copy. Account switching must not expose one owner's cloud library to another.
5. Define conflicts and deletion first: immutable session/prompt snapshots, editable collection revisions, deletion tombstones and bounded retention. Avoid whole-database last-write-wins uploads.
6. Put refresh/session credentials in iOS Keychain through a suitable secure-storage library, never SQLite/AppData exports or public Expo configuration. Server keys stay on the server.
7. Implement account deletion, Apple token revocation, remote record removal and clearly separate local-device clearing from cloud-account deletion.

No dormant remote service or fake sync button was added. This document defines the integration boundary without committing the app to a provider or new operating cost.
