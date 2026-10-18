# Architecture

See [the 1.1 experience update](V1_1_EXPERIENCE_UPDATE.md) for Just Riff / Practice selection, layered instructions, stable font assets, and backward-compatible prompt-flavor fields. The original 1.0 architecture below remains the persistence/engine foundation; current content counts are 741 entries and 104 structured relationships.

Expo SDK 58, React Native 0.88, React 19.3, Expo Router, strict TypeScript, Zod 4. Exact compatible versions are pinned by package-lock.json; Expo Doctor is the compatibility gate. UI, engines, banks and navigation are shared on iOS/web. Platform-specific repository files and Expo Speech/Haptics handle platform behavior.

## Domain and lifecycle

`session.ts` validates the aggregate with `SessionSnapshotSchema`, extending the supplied RoundState with segment, cue, reveal, deterministic cursor, per-person contribution time, and engine state. All game actions cross the typed `transitionRound` reducer. UI does not adjudicate spoken content or evaluate jokes. Distinct mechanics include rapid-fire variants, physical/seated work, story turns, interviews, hot seat, scene replacement vs same-scene relay, secrets, three-line counting, style/status cues, and Half-Life's four segments.

New rounds use injected seeded PRNGs. Hard gates precede soft weighting; soft history exclusion never relaxes player counts, rating or content availability. Skips before start have no performance exposure. Featured pairs favor the least exposed people, with seconds/recency and partner-repeat tie breaks. Supporting roles are separate. Each tick records actual actor/support time, including performers replaced mid-round. Sitting-out participants are excluded from the next casting. Group resizing retains old players so round snapshots stay meaningful.

The provider owns a single foreground monotonic scheduler. Ticks are rounded to integer milliseconds, background/pause never advances time, and restore changes LIVE to PAUSED. Background and navigation stop speech. No catch-up burst runs on resume. Significant mutations save immediately; live timer progress checkpoints every three seconds and on pause/background. Abrupt browser/process termination can lose up to the last three seconds if no background event is delivered. Queued writes serialize snapshots to prevent stale overwrites. Save errors are shown and dependent navigation waits for persistence.

Secrets are rendered only during a deliberate recipient reveal. Local UI state, not storage, owns whether a secret is currently exposed. Visibility/AppState/navigation changes cover it; timeout covers it after 20 seconds. Leaving a recipient requires Hide & pass or explicit skip. No secret-bearing text is copied to public summaries, speech, or generated prompt sharing.

## Persistence

Both adapters implement `OffScriptRepository`: initialize, validated aggregate read/write, and reset. The aggregate includes preferences, sessions/rounds/players/teams/scores/votes, favorites, exact saved prompts, Studio state/presets, and anti-repeat usage.

Web uses IndexedDB database `off-script` version 1, store `state`, key `app`. Each complete aggregate put is one atomic readwrite transaction. No native SQLite module is imported by the web bundle and there is no in-memory fallback claiming durable saves. Zod validates writes and reads. Unavailable/corrupt storage yields a visible recovery message and Settings deletion control. Future structural changes should increment the IndexedDB version and transform the aggregate in `onupgradeneeded`, retaining exact prompt text and content-pack versions.

Native uses expo-sqlite with foreign keys and WAL enabled before the versioned, transactional canonical migration. The validated aggregate is stored in `app_preferences`, and session/player/round/participation/team/vote/score/favorite/saved-prompt/preset projections use the canonical normalized tables. All input uses bound parameters; only static migration SQL goes through execAsync. A future migration must update both aggregate validation and projections, with `PRAGMA user_version` and recovery tests. Static content remains bundled. Reset deletes user tables and the aggregate; web reset atomically replaces the aggregate with initial defaults.

The native repository SQL is tested against an actual SQLite engine through a Node bridge. The same aggregate roundtrip invariants are exercised for web IndexedDB. This verifies SQL/migration logic, not the expo-sqlite native bridge on an iPhone. Real browser tests read actual IndexedDB after UI actions and reloads.

## Content and Studio

Version 1.0.0 banks are Zod-validated on import and by a build validator. Ten category quotas total 600. Relationships have 30 dyads, 10 triangles and 40 ensembles with fixed/expandable slots for 4–12. Locks are exact values, not seeds. Unlocked categories sample without replacement using stored usage, then start a new cycle. Coherent generation gives a mild positive tag affinity and falls back to the available pool. Toggling a category preserves all unrelated entries. A locked relationship must be deliberately unlocked before resizing its exact assignments.

Studio's Open Scene ensemble variant preserves all selected roles in seat order and all exact texts/locks. The canonical Open Scene performer ceiling is adapted from 4 to 12 for this use, while ordinary surprise selection still casts a pair. See DECISIONS.md.

## Offline and hosting

Metro exports a static SPA. `postbuild:web` emits a versioned service worker that caches every local export file, including code-split routes and fonts. Online navigation falls back to cached index.html when offline. No first-visit offline claim is made. Browser storage/cache eviction and private browsing remain platform limitations. Hosting access controls are independent of the account-free app: the Sites deployment starts owner-private; the export can run on another static host.

There are no runtime API calls for gameplay, prompts or persistence. Hosting requests and optional browser speech infrastructure remain platform operations. No analytics, camera, microphone, location, push, or cloud data SDK is included.
