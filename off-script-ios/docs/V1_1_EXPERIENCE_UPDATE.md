# Off Script 1.1 — two ways to play

## Product decision

Just Riff and Improv Practice describe the user's intent, not their skill or identity. No forced expertise questionnaire or onboarding is added. Just Riff is selected by default; Practice is one tap away. The existing five curated session policies and standalone Studio remain underneath these two entry points, sharing all 39 canonical activity formats and engines.

Just Riff auto-hosting selects the curated quick-to-understand games. It favors conversational participation, short rounds (a soft 60–90 second reminder), small groups, and simple first moves. The story and scene setup usually has one ingredient. Deliberate direct game launch can still run any activity; it never relaxes hard player-count, rating, role or privacy gates. Practice retains the entire catalog, full authored rules, skill focus, coaching, reflections, teacher display and precise specialty mechanics. It weights scenes/drills more heavily during surprise selection and uses grounded prompts.

Both screenshots are addressed: W4 now starts with “Take turns adding one sentence: ‘Fortunately…’ then ‘Unfortunately…’.” Its Riff story seed comes from the playful bank. S8 now starts with “Pick one odd thing your character does. Repeat it, then take it one step further.” The canonical notes on heightening and supporting relationships remain in the coaching sheet. S8 stays out of automatic casual selection while remaining available directly and in Practice.

## Content

The original 600 Studio entries and 80 relationship templates are retained. The new pack adds 141 authored playful entries, including 24 structured relationships: 12 dyads, 4 triangles and 8 expandable ensembles. Total: 741 Studio entries and 104 relationship templates. A connected playful generation picks one surprising ingredient and uses grounded supporting ingredients when possible. Mix freely can combine more freely. Existing locked values always take precedence. No runtime AI or server is used.

Every activity has an additional validated-by-tests playbook containing one short action-oriented instruction, two steps and a concrete example. These supplement the original teaching copy. Original identities, safety gates, joke plurals, secret-objective/quirk banks and specialized engine behavior remain.

## UI and brand

- Dedicated round shell: one concise setup, real cast names, current cue/turn state and a persistent control dock. Global browsing navigation is removed while playing; Exit safely pauses and offers save/leave or end/recap.
- Start, Pause, manual cue and Finish do not require scrolling. Large text and small-height viewports have explicit browser assertions. All scene details and exact Studio snapshots remain available in a sheet.
- Quick examples follow the actual setup and remain optional; technical rules and coaching stay in a scrollable sheet. Reflection is offered in Practice without interrupting casual next-game flow.
- Studio shows real generated cards before category configuration. Generate/Customize stay visible. Plain labels “Connected ideas” and “Mix freely” retain the same deterministic generator semantics.
- Compact library exposes quick picks first and the full catalog in Practice, with search and a filter sheet. Clean counts and the optional 18+ format are explained.
- Four licensed fonts are now bundled under stable project-owned asset paths, removing the encoded @ package path that broke on the public host. UI text also has explicit platform fallbacks.
- Darker muted and accent text reaches at least 4.5:1 on the applicable tested light backgrounds. Navy/cream remains the core palette.
- Original offset conversation/script mark replaces the generic sparkle; app icons, favicon and a share card use the same mark. Product descriptor makes the one-phone improv game clear. Meta tags and a web manifest support useful sharing and home-screen installation.

## Local data compatibility

New preference/session intent and prompt flavor fields have schema defaults. The aggregate storage version remains 1 because the IndexedDB/SQLite structure is unchanged. Reads validate and fill new fields while retaining exact saved text, locks, names, rounds, scores and favorites. Old Studio data without flavor defaults to grounded; a fresh Studio starts playful. New sessions keep the current chosen intent. Group resizing also keeps team membership consistent with added seats. User-created data is never replaced to apply the visual update.

## Validation

The final task handoff records executed counts, export status and deployment URL. Tests include all 39 actual exported game screens, previous-version aggregate recovery, deterministic Riff selection, every game’s short instructions, one-oddity generation, lock preservation, role/name matching, grounded Practice, small-screen control visibility, font loading, content quotas, cues/privacy/scoring, offline reload and exact Studio handoff. This is browser/shared-domain coverage; no physical iPhone, signed IPA or TestFlight upload is implied.
