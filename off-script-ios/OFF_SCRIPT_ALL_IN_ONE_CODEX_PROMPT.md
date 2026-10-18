# OFF SCRIPT — CODEX MASTER BUILD PROMPT, PRD + IMPLEMENTATION CONTRACT

**Product version:** v1.0.0 / full functional iOS + web preview release  
**Prepared:** 2026-10-16  
**Status:** Product specification and implementation instruction; not a claim the app is already built.  
**Product name:** OFF SCRIPT (working brand; requires trademark/App Store clearance before public release)  
**Tagline:** *Less scrolling. More laughing. Make it up as you go.*

> ## YOUR ASSIGNMENT AS CODEX
>
> You are the lead mobile engineer, product designer, content-systems engineer, QA lead, and release engineer responsible for implementing **Off Script** end to end. **Build a complete, real, playable, polished, offline-first iOS app AND an equally functional browser version from a shared Expo/React Native Web codebase, not a wireframe, fake prototype, PRD-only response, or collection of attractive but inert screens.**
>
> Treat this file as the authoritative product requirements document. Canonical artifacts included alongside it are `contracts/domain.schemas.ts`, `database/001_init.sql`, and `content/activities.v1.json` (exactly 39 authored playable activities). Copy/adapt these into the Expo project and keep them in sync. The companion files are implementation inputs, not just examples. For a single-file copy/paste prompt, `OFF_SCRIPT_ALL_IN_ONE_CODEX_PROMPT.md` embeds these artifacts as appendices.
>
> **First:** inspect the current working directory/repository and its existing conventions. If it is empty, scaffold a new independent project named `off-script`. If it contains an Off Script project, extend it non-destructively. If it contains an unrelated project, **do not modify it**; create a clean sibling project only if the environment permits. Do not connect this app to any MLS, property-intelligence, SigLIP, Supabase, Render, or other unrelated system.
>
> **Then execute the build.** Work through the phases below, implement code, seed original content, run validation, test, and report results. Do not stop after generating a plan or after only implementing Phase 1. Make sensible choices without repeatedly asking for product decisions already made here. Only request input when a genuine external credential, legal approval, or inaccessible environment is a blocker. Never fabricate passed tests, builds, TestFlight uploads, assets, or repository actions.

---

## 1. PRODUCT VISION AND USER PROMISE

**Elevator pitch:** Off Script is the improv party game that makes it easy for anyone to be spontaneous, creative, and laugh with friends. Think the effortless pass-the-phone flow of a party game plus playful short-form improv challenges and serious teaching where users want it. Tell it how many people are playing, tap **Surprise Me**, and the app picks compatible activities, explains the rules, rotates players fairly, generates prompts, and keeps the fun going. The app is also a useful improv-class resource through its direct game library and flexible scene **Prompt Studio**.

**Non-negotiable core promise:** A person who has never heard the term “improv” should be able to open the app for the first time and participate in a fun activity with one small setup step: number of people. No forced onboarding, no account, no names, no paywall, no choosing among unfamiliar modes, and no teacher required. A returning group with the previous player count saved should be able to tap one button and see a playable round.

**Audience segments**
1. Two friends, partners, or a date looking for something new to do together.
2. Three to twelve friends hanging out at home, at dinner, or at a casual party.
3. Beginner performers who want accessible prompts and games without embarrassment.
4. Improv students or instructors who need credible, flexible drills, relationships, situations, and scene suggestions.

**Three user needs:**
- Make me laugh: very fast one-word punchlines, silly challenges and game-show exercises.
- Let's make a scene: open-ended or constrained scenes with proper improv techniques.
- Help me get better: coaching, skills and instructor-friendly exercises rooted in real improv.

**Product principles**
- Game first, improv toolkit second.
- Immediate play is the default. Granular control is available but never required.
- One device runs an in-person experience; no user login and no second device required.
- Individual games are genuinely different; avoid disguising the same static prompt card as 39 features.
- Beginner instructions must be clear enough to act on in seconds.
- Use acceptance, listening, offers, specificity and collaboration as teaching foundations. Do not conflate joke contests with long-form scene craft.
- Clean by default, inclusive, consent-sensitive, never require humiliation, physical contact, drinking, or adult content.
- Support instructors without burdening casual users with classroom settings.
- A smaller set of reusable engines powers a real, high-quality authored catalog.

**V1 success metric definitions** (local QA definitions, not analytics sent anywhere):
- New user reaches a playable activity after only choosing player count.
- Returning user can start a fresh session with one tap from home.
- A pair finishes ten minutes of auto-hosted play with no third person.
- A group of six receives fair role distribution over ten mixed rounds.
- An instructor generates relationship-only, location-only, and several combined categories instantly.
- Every one of the 39 named activities is individually runnable offline with matching rules, timer/cue/reveal behavior and a real completion flow.

## 2. V1 FEATURES IN SCOPE — COMPLETE, NOT PHASED OUT

**Six experiences:**
1. **Party Night:** friendly rotation for 3–12 with one-phone activities.
2. **Just Us:** dedicated **exactly two-person** experience for friends/partners, not a romance-only flow.
3. **Game Show:** punchline roulette, short-form performance games and optional competition.
4. **Scene Lab:** open-ended scenes and intentional scene-building exercises.
5. **Improv Gym:** warm-ups, listening, physicality, character work and coaching.
6. **Prompt Studio:** independent scene prompt tool, outside of sessions but integrable into sessions.

**Additional entry experiences:**
- **Surprise Me** is the primary, enormous home-screen CTA and the real Quick Play mode. It auto-hosts suitable activities across the catalog.
- **Explore Games** browses the full 39-game library directly, filters by family/mode/players/energy and searches activity names/skills.
- **Saved** stores favorite activities, generated prompt snapshots and optional teacher presets.
- **Settings** houses privacy, content controls, accessibility, default options and session preferences.

**In v1:** browser-based playable preview with real parity to iOS (mobile and desktop layouts), plus truly playable versions of all 39 activities in the bundled catalog; independent/coherent Prompt Studio; player fairness; optional names; adult-only suggestive content behind explicit opt-in; timer/audio/visual cues; per-player private reveals; saved game/round state; manual scoring/votes; a teacher-oriented display/controls; offline content; clear instructions/examples/tips/reflections; accessible UI; tests; EAS/TestFlight readiness.

**Not in v1:** accounts, cloud storage, server, Supabase, AI-generated runtime prompts, AI evaluation, microphone/camera/recording, social feed, public leaderboard, friend network, remote multiplayer, real-time multi-device sync, solo training curriculum, subscriptions/paywall, push notifications, or external tracking/analytics. Do not sneak in these dependencies as infrastructure scaffolding.

### 2.1 Content quantities required at release

- Exactly **39 distinct playable activity formats**, split into 6 punchline, 11 performance, 9 scenes, 8 drills and 5 social. Prompt Studio is a separate tool, **not a 40th game**.
- Every game has original authored introduction, how-to, example, coaching tip, reflection, tags, modes, player limits, duration and applicable mechanics. Seeded file already specifies them. Review/edit copy for quality, but preserve identities and requirements.
- At least **600 original, clean, authored Prompt Studio entries** meeting the category quotas below (not test placeholders, no duplicates with cosmetic changes).
- At least **160 clean one-word joke topics** with appropriate plural forms for `185 Walk Into a Bar`.
- At least **60 clean private-objective prompts** suitable for Secret Objective.
- At least **40 clean hidden guest quirks** suitable for Party Quirks; avoid stereotypes, disabilities, sexual content, and mimicking real ethnic accents.
- At least **50 clean short auto-cue entries** across emotions, genres, and surprise lines, with balanced variety. These may reuse prompts from the 600 only if semantically appropriate; ensure enough variety.
- Mature/suggestive game is opt-in. Keep all authored examples mild and non-explicit; never imply that default/general-audience content includes it.
- Validate minimum counts and prevent release if content thresholds are not met. Original content can be revised in content-focused PRs without rewriting engines.

**Prompt Studio quota — exactly 600 minimum total:**

| Category | Minimum unique entries | Examples of appropriate content |
| --- | ---: | --- |
| relationship | 80 | former teammates, adult siblings, rivals, longtime neighbors |
| location | 70 | a delayed ferry terminal, backstage at a community theater |
| profession | 50 | museum curator, exhausted wedding planner |
| role | 65 | self-appointed leader, skeptic, enthusiastic newcomer |
| emotion | 50 | barely contained excitement, quiet disappointment |
| action | 65 | repairing an imaginary object, hiding a surprise |
| situation | 65 | two people have conflicting plans, an important visitor is early |
| object | 60 | a giant ceremonial key, a mysterious suitcase |
| genre | 25 | film noir, adventure serial, family sitcom |
| opening_line | 70 | “I specifically asked you not to bring that.” |
| **TOTAL** | **600** | All usable without network calls |

Relationships require **separate, structured multi-person templates**, not just a flat phrase list. The `RelationshipTemplate` schema and assignment rules in Section 7 govern 2–12-person consistency.

---

### 2.2 Non-negotiable WEB PREVIEW & functional parity — not postponed

**Owner requirement:** The creator must be able to OPEN OFF SCRIPT IN A WEB BROWSER and interact with the real, complete v1 app while Codex builds it, without waiting for an iOS simulator, TestFlight or App Store approval. **Web is a first-class v1 runtime alongside iOS, not a static marketing site, screenshots, design prototype, or fake data facade.** Maintain one canonical game domain, activity library and UI component system with platform-specific adapters where necessary. Do not create a second unrelated web app that diverges from the iOS product.

**When implementing in Codex:** prioritize an interactive web vertical slice early, so the owner can review the UX before the entire catalog is complete. Provide a *working URL* when a deployment/preview environment is available; do not imply Codex itself supplies a permanent public port or browser tab. A local dev-server address only works inside its reachable environment. If hosting credentials/integration are unavailable, produce a clean web export, exact startup/deploy steps and an honest blocker rather than inventing a live preview link or silently skipping browser testing.

Required functionality on **both** iOS and web:
- Surprise Me, player-count setup, anonymous one-phone hosting, fair rotation, all six experiences, all 39 games, Prompt Studio, session flows, timers and scheduled/manual cues, optional scores, clean-content gating, private reveals, favorites, saved/history, full coaching and settings.
- True persistence after a browser reload/tab closure for the same browser profile, not just React component state. First-load hydration must avoid losing the persisted session, playing phantom cues or showing stale private content.
- Fully responsive layouts: narrow iPhone widths (320–390 CSS px), standard mobile widths (390–430), tablet (768) and desktop (1280+). Desktop can show a centered phone-like play area with larger teacher/presentation mode, but it must never be a stretched, unusable mobile layout. Test keyboard and mouse as well as touch. Portrait and landscape where practical.
- Accessible buttons, tab/focus order, Enter/Space activation, visible keyboard focus, ESC close/pause behavior when appropriate, readable typography, screen readers and reduced motion. Never use hover-only UI.
- Real browser speech/cue output **when supported and permitted**; visible and user-invoked cue controls ALWAYS available. Browser autoplay and speech voices can be restricted until a user gesture. Feature-detect and degrade gracefully, rather than throwing, freezing the scene or blocking a two-person round.
- Use one shared, typed domain model and deterministic engine. No mocked/random screen data replacing the canonical activity catalog or prompt generator on web.
- Clear offline behavior: bundled game content usable without a network after the web app has been loaded; persistent browser storage where available. Do not claim first-visit browser offline works. Document browser storage/quota/private-mode limitations and optional PWA caching if implemented. No backend, accounts or runtime AI required.

**Storage requirement:** The canonical SQL migration is for native iOS via `expo-sqlite`. Web persistence cannot be assumed to work by importing the native SQLite implementation unchanged. `expo-sqlite` web can require WASM Metro setup and cross-origin isolation/COOP-COEP headers; as of the official Expo docs its web setup has special requirements. Choose a reliable implementation and test it in an actual browser. **Preferred: IndexedDB web adapter (e.g. an idb-style typed storage implementation)** that implements the same domain repository interface, field requirements, lifecycle, migrations and invariants; retain SQLite for native iOS. Alternatively use Expo SQLite on web only if the complete supported WASM + hosting headers setup actually works in both local preview and deployed browser, with Playwright proof. Never silently fall back to transient in-memory storage. Document storage-driver selection and upgrade path in `docs/ARCHITECTURE.md`.

Use a shared interface similar to (expand to all entities and write/read operations):

```ts
interface OffScriptRepository {
  initialize(): Promise<void>;
  getPreferences(): Promise<UserPreferences>;
  setPreferences(value: UserPreferences): Promise<void>;
  saveSession(session: SessionSnapshot): Promise<void>;
  restoreSession(id: string): Promise<SessionSnapshot | null>;
  savePrompt(snapshot: PromptSnapshot): Promise<void>;
  listSavedPrompts(): Promise<PromptSnapshot[]>;
  resetAllLocalData(): Promise<void>;
}
// SessionSnapshot is the validated aggregate of Session, Round, Player,
// participant and score records; define it in the domain layer.
// src/storage/repository.native.ts -> SQLite
// src/storage/repository.web.ts -> IndexedDB (or proven supported web SQLite)
```

**Browser preview commands and deployment:** provide verified `npm run web` (using `npx expo start --web`), `npm run build:web` (`npx expo export --platform web`), and `npm run test:e2e:web` (Playwright). Set up `react-dom`, `react-native-web`, and `@expo/metro-runtime` matching the chosen Expo SDK; configure `expo.web.output` appropriately. Default to a static deployable bundle for this backend-free app. Provide `docs/WEB_PREVIEW.md` with exact instructions for viewing, responsive testing and publishing. EAS Hosting can generate a preview URL after authorized account sign-in; a compatible static host such as Netlify is also acceptable. Never deploy to the owner's public production domain without explicit permission. Do not require an external deployment for local web functionality.

**Browser acceptance gate:** use Playwright to open and exercise the ACTUAL exported or running browser app, not just unit-test pure game logic. Test 2-person Surprise Me, a six-person session with another round, Prompt Studio select/lock/reroll, direct game launch, private reveal safety, saved favorites/history persistence after refresh, mobile/desktop viewports, content filtering, cues paused/resumed and no fatal console errors. Produce screenshots of at least phone and desktop states and cite file locations in Codex's final report. Verify no blank web pages, unresponsive CTA, hidden Next/Skip buttons or navigation dead ends.

**Web-first development gates:** Phase 0 gets a real `/` page opening in the browser; Phase 1 delivers a fully playable and inspectable Surprise Me flow on web; subsequent phases keep both web and iOS build/typecheck/behavior passing. A feature is **not done** if it only functions on iOS or only renders in browser.

## 3. UX / INFORMATION ARCHITECTURE

### 3.1 Main home screen

Visual priority on the first screen:

1. Wordmark/logo: **OFF SCRIPT** and tagline *Make it up as you go.* Keep the brand replaceable pending legal name clearance.
2. Hero module with a single dominant button: **Surprise Me**. Supporting text: “Just tell us how many people. We'll handle the rest.”
3. Two secondary, clearly different tappable modules: **Prompt Studio** (“Need a scene idea?”) and **Explore Games** (“Choose a game or exercise”).
4. Small access to **Saved** and **Settings**. Do not use six equally sized home CTAs.

**First-use Surprise Me:** tap CTA → choose count 2–12 (default visible 2; optional names expandable) → show a playable activity. Use sensible defaults: clean, beginner-friendly, seated-compatible, automatic hosting, visually indicated cues, points off, untimed/free-play where appropriate. A selected player count of 2 should naturally bias towards Just Us games but need not ask for relationship type or dating status.

**Return-use Surprise Me:** save last count in local preferences; tap CTA → show new activity directly. Changing players is always one tap away inside the session.

**No first-launch onboarding carousel.** Brief contextual education appears only at the first relevant game if needed (e.g., “Tap the cue button when you want a New Choice” if audio unavailable).

### 3.2 Navigation architecture

Use Expo Router with a clean, shallow screen hierarchy. Navigation choices should prioritize task completion, not stuffing every mode into tabs.

- Home `/` (Surprise Me hero, Prompt Studio, Explore Games).
- Player count quick sheet `/start` (only when required).
- Live session `/session/[id]`, with subviews for activity intro, optional private reveal, ready card, live game, review/vote, summary.
- Explore Games `/games`: browsing, curated mode shelves, search/filter.
- Activity details `/games/[activityId]`: rules, demo example, skills, players, start single game or add to session.
- Prompt Studio `/studio`: independent toggles; lock/reroll; save; large display; copy/share; “Use in Scene Lab.”
- Saved `/saved`: favorite games, saved prompts, custom Studio presets, optional recent session resumptions.
- Settings `/settings`: content, audio, text size, reduced motion, clear device data, privacy and credits.

### 3.3 Screen and component requirements

**Home:** fast launch, joyful typography, large navy pill CTA, subtle card decorations, obvious navigation. Use modern friendly editorial style, not cartoon theater curtains, casino art, or cluttered game dashboards.

**Player setup:** large minus/plus number input 2–12, accessibility announcement, optional names behind “Add names” link, no registration. Default placeholders `Player 1`...`Player N`. If names are added, preserve only locally. Users may change group size mid-session between rounds; handle old round snapshots appropriately.

**Session runner:** shared visual system across games, with state-dependent controls. Above the fold: current activity, selected player(s), clear primary instruction, and prompt. “How to Play,” “New Prompt,” “Replay,” “Skip / Another Surprise,” “Pause,” and “End” remain discoverable as appropriate; do not show every button at the same time. Keep instruction cards brief and progressively reveal examples/tips.

**Host controls:** auto vs manual cue selection, pause/resume, skip, change players, reshuffle performers, in-session accessibility settings. A full-screen readable mode should let a teacher or group see the current prompt from across the room.

**End round:** default effortless Next/Another Surprise; offer quick optional reflection, favorite, and voting only when meaningful. Never insist on voting or rating fellow players.

**End session:** show light-weight recap: activities played, funny highlights only if the user manually added a note (no recordings), number of rounds, favorites saved, optional votes/scores. Invite “Play Again.”

### 3.4 Visual design direction

Modern, warm, a little theatrical but not childish: **deep navy**, warm off-white, soft lilac/blue neutrals, sparing coral accent. Example starting tokens (adjust for contrast): navy `#172B49`, ink `#162136`, cream `#F8F6F1`, accent `#FF775F`, muted blue `#DCE6F3`; light and dark appearances with sufficient contrast. Clean rounded pills, rounded activity cards, generous spacing, large dynamic typography and intentional animations. Use 44pt minimum touch targets, clear focus and accessible labels, reduced motion support, large readable session mode and landscape-friendly prompt display where practical. Avoid relying on color alone to communicate status.

**Copy voice:** smart, friendly, concise, playful without cringe, no unnecessary slang, little punctuation clutter. In product UI, avoid academic language unless the user opens coaching.

### 3.5 UX rules, important exceptions

- Surprise Me must not have prerequisite vibe, duration, experience or mode selectors. These live in optional “Customize.”
- Favorites and settings cannot obscure the primary start button.
- No account, location services, contacts, camera, microphone or network required.
- Two-person automated activities must not require an off-screen third-person host.
- If a user skips a game, immediately pick another eligible one; never shame them or treat skip as a failure.
- Always offer seated alternatives for activities with physical movement and an option to exclude them from Surprise Me.
- In instructor/classroom mode, clean content is enforced irrespective of previous adult opt-in.
- A user can terminate a session without data loss; on next open offer resume if a paused local session exists, never overwrite it automatically.

---

## 4. MODE RULES AND CONTENT MAPPING

These are **discovery / session policies**, not six separate implementations of the same game.

- **Surprise Me:** random-but-curated across all compatible catalog entries. Eligible catalog entries only, based on player count, content, energy and recent repetition. No mode selection. By default mix joke, story/scene, social and drill activities so it stays varied. Player fairness must apply. A 2-player Surprise Me session cannot show 3+-player activities.
- **Party Night:** min 3, max 12; primarily social/performance/punchline with short energizers. Mostly one-phone hosted, optional team scoring.
- **Just Us:** exactly 2; optional vibe defaults to generic/playful. Do not presuppose romantic partners. Weight collaborative storytelling, pair scenes and quick games. Support entirely automatic cue scheduling.
- **Game Show:** selectable performance games and six punchline formats; optionally battle, audience voting, points. Encourage fun over ranking skill.
- **Scene Lab:** relationship/location/scenario scene work; integrate the most recent Prompt Studio snapshot. Allow the performer count to be selected when relevant. “Open Scene” can have zero predefined categories by deliberate choice.
- **Improv Gym:** practice structured listening, Yes-And, character, scene and nonverbal drills; classroom-style instructions, time controls, teach/learn goals.
- **Prompt Studio:** stand-alone generator; no names, session or timer required; transfer prompt snapshot to a compatible scene.

**39 canonical activities:** The full authored set is in `content/activities.v1.json`. Its IDs and titles are fixed v1 acceptance targets:

| Family | IDs and names |
| --- | --- |
| Punchline (6) | P1 Pickup Lines; P2 Sex With Me Is Like (18+); P3 185 Walk Into a Bar; P4 World's Worst; P5 Terrible Advice; P6 Never Say That |
| Performance (11) | G1 Questions Only; G2 New Choice; G3 Emotion Remote; G4 Genre Remote; G5 Freeze & Replace; G6 Gibberish Translator; G7 Sound Effects; G8 Expert Interview; G9 Surprise Line; G10 Half-Life; G11 Ridiculous Infomercial |
| Scene (9) | S1 Open Scene; S2 Relationship First; S3 Who, What, Where; S4 Secret Objective; S5 Status Shift; S6 Three-Line Scene; S7 Make the Mundane Matter; S8 Heighten the Pattern; S9 Invisible World |
| Drill (8) | W1 Yes-And Ladder; W2 Word-at-a-Time Story; W3 Sentence Chain; W4 Fortunately / Unfortunately; W5 Mirror; W6 Association Chain; W7 Character Walk; W8 Listening Echo |
| Social (5) | T1 Invented Shared History; T2 Character Hot Seat; T3 Party Quirks; T4 Scene Relay; T5 Group Statue |

**Every row must actually work.** Render different mechanics via typed engine strategies: rapid-fire rounds, open scenes, timed/interruptible scenes, story chains, embodied activities, pass-the-phone secrets, interviews, character hot seats, replacements/rotations, short challenges. No generic “tap complete” overlay pretending to implement timed cues or private reveal.

### 4.1 Essential specialized games

**P1–P6 Punchline Roulette:** display one **large word** or subject, an easy-to-read joke opening/format, optional example, and controls for `New Word`, `Pass`, `Take Turns`, `Open Mic`, `Battle`, optional voting, and Next. Sample P1: topic *candle* → “Are you a candle? Because you light up the room.” P2 is optionally suggestive, non-explicit, gated; use “Sex with me is like a [topic] because...” and avoid any crude/generated sexual content. P3 requires an authored plural form of the noun where irregular nouns are used; never blindly append “s”. “World's Worst,” “Terrible Advice,” and “Never Say That” have their own distinct openings and subject semantics.

**G2 New Choice:** timed or manually triggered “NEW CHOICE!” signal, visually prominent, optionally spoken and haptic; performer changes their **last line** and all others accept it. User-controlled alternate cue is required.

**G3/G4 Emotion/Genre Remote:** timed or host-triggered cue from correct respective bank. Cue changes style/feeling, not the underlying scene facts. Preserve last cue for a few seconds on screen. Prevent selecting duplicate consecutive cues.

**S5 Status Shift:** use a distinct `status_shift` cue and clear visual host control; do not reuse a performer `rotation` cue for a relationship-status shift.

**G9 Surprise Line:** periodically reveal a pre-authored, safe line that the performers must incorporate; visual and optional spoken cue. Never expose future lines in advance.

**G10 Half-Life:** segments of 60, 30, 15 and 5 seconds, with distinct countdown labels and between-segment “Replay in X seconds” screens. Timers do not run through pause or background. Provide manual Next Segment for accessibility.

**G5 Freeze & Replace and T4 Scene Relay:** waiting performers are chosen fairly. `Freeze & Replace` starts a *new scene* from a frozen pose; `Scene Relay` preserves the *same ongoing scene*. Implement these as different rule variants, not a shared misleading text.

**G7 Sound Effects:** pick 2 performers and a distinct Foley artist (3 minimum). The sound-effects person can be rotated; never give the same person both jobs in one round.

**S4 Secret Objective:** different player desires, concealed with explicit pass-and-hide screens. At each stage identify `Only Player X should look`, reveal just X's objective, then cover screen automatically before “Pass to next player.” Provide exit and manual skip. Blur/cover secret content on background/app switcher. Persist only local round data and never emit private prompts into logs, notifications or shared copy.

**T3 Party Quirks:** one party host plus 2–5 guests. Privately reveal one distinct harmless quirk per guest while the host looks away, then begin. Host can mark guesses, but no secret leaks in audience-facing UI until the round ends.

**T2 Character Hot Seat:** one performer; the other group members ask questions. When only two people, one interviews and one acts; the app switches roles for the next round.

**W5 Mirror / W7 Character Walk / T5 Group Statue:** support seated variants and an upfront no-contact safety reminder. Do not assume all players can stand, walk or be touched.

**S1–S3 and Scene Lab:** connect generated categories and structured relationships from Prompt Studio. A pure Scene Lab scene must still work if none are selected (intentional open scene, not a broken generator).

**W1 Yes-And:** teach acceptance and building, not compulsory literal phrasing or unconditional agreement to unsafe ideas.

**Optional voting:** never automatically judge humor or performance. Users select who got a point (or teams) when enabled, with individual opt-out and no pressure.

---

## 5. SURPRISE ME: PRIMARY EXPERIENCE AND SELECTION ALGORITHM

Implement a **deterministic, injectable-randomness session engine**, not `Math.random()` sprayed throughout UI components. Expose pure functions: `eligibleActivities`, `chooseNextActivity`, `assignPerformers`, `selectPrompt`, `generateCueSchedule`, `transitionRound` and `restoreSession`. A deterministic seeded RNG permits testing and replay of failures.

### 5.1 Hard eligibility gates (all must pass)

1. `minPlayers <= activeCount <= maxPlayers`. Sitting-out players are not active.
2. Activity content rating is allowed by session settings AND user preferences. **Clean is the default.** In classroom preset, **clean-only** always.
3. Physical requirements must fit the user's selected energy setting, or a clearly offered seated alternative exists.
4. The required prompt/role/cue content is present. No phantom scenes if eligible banks are empty.
5. Required performer roles can be filled with distinct eligible participants. If insufficient, remove activity before selection rather than crashing during assignment.
6. Selected activity must support the selected mode, except `surprise`, which can use any eligible mode’s catalog entry.
7. Just Us always has 2 participants. Party Night always has 3–12.

### 5.2 Soft weighting and pacing

For eligible activities, calculate a transparent, testable score based on:
- modest base family weights;
- avoid same activity in the previous 5 rounds unless only a few activities remain eligible;
- prefer a different family from the previous round when possible;
- alternate shorter punchline/story games and longer scenes;
- prioritize beginner-safe, clear activities in first 3 rounds;
- gently favor low-movement games when energy is not specified;
- penalize recently skipped activities for the current session;
- respect explicit user “Another Surprise” without returning the same card immediately;
- do not claim AI personalisation. Use local preference and session history only.

**Required fallback:** if no eligible activities remain after soft filters, relax *only soft filters*. Never relax hard player-count, content, energy or privacy gates. If none after hard filtering, show a useful explanation and offer changing eligible settings. Avoid infinite reroll loops.

### 5.3 Player fairness

Track per-player **performance rounds**, **performance seconds**, **last played round**, **partner repeat frequency**, **support roles**, and **sitting-out state** for the current session. For staged games choose distinct participants with low recent performance exposure; penalize repeat partner pairings; support volunteer/manual override without breaking the record. One-phone `Player 1...N` placeholders are valid. For all-player games, mark all as active. Audience/sound-effect/host roles count separately from performing so they still get performance turns later.

**Target invariant for ordinary pairs:** among participants who are equally available, the max/min performance-round difference after 10 eligible rounds should remain reasonably bounded (target <=2 where applicable) and no one gets 3 consecutive featured pair rounds while someone available has none. These are tested with deterministic simulations, not treated as impossible guarantees for unusual group/activity mixes.

### 5.4 Session continuity

- No mandatory end count; `One More` generates another round indefinitely.
- Duration preference (optional 5/15/30 mins) is a *soft reminder* to end, never a hard cut-off.
- `New Prompt` regenerates within current activity; `Another Surprise` selects another compatible activity and updates fairness correctly.
- `Replay` repeats the same activity with fresh prompt (or let user keep the previous prompt).
- `Skip` does not count an unstarted player performance or apply a score penalty.
- Persist session on significant transitions and foreground/background changes. On crash/restart restore a safely paused timer with no lost round data.

---

## 6. PROMPT STUDIO — FULL STANDALONE MODE

Prompt Studio must function with **zero current session** and zero named players. Users choose performer count 2–12; default 2. They independently toggle one or more of the **ten categories**: relationship, location, profession, character role, emotion, action, situation, object, genre and opening line. They may select **none** only to view an intentional empty-prompt state or pass a truly open scene to Scene Lab; no broken null errors.

**Required interactions**
1. Toggle any category on/off without clearing unrelated results.
2. `Generate` returns one selection per active category and a structured group relationship where chosen.
3. `Lock` any category result. `Generate Again` rerolls **only unlocked active categories**; locked results remain exactly the same.
4. Individual `Reroll` regenerates **only that one category**, even if others are locked.
5. If player count changes, revalidate group relationship and role assignments; refresh only incompatible relationship data and preserve compatible locked values when possible. If a locked result cannot apply, explicitly warn and request a deliberate unlock rather than silently mutating it.
6. `Independent` mode samples categories separately, allowing delightfully odd combinations.
7. `Coherent` mode prefers compatible tags / contexts and builds meaningful combinations **without an AI network service**. Preserve selected category count; never silently inject extra categories. Respect all locks first.
8. Dedicated **Relationship Only**, **Who/What/Where**, **Emotion + Action** and other teacher presets. Custom presets can be saved locally.
9. `Large Display` shows huge readable cards; `Copy` / native Share sheet; `Favorite / Save` stores exact prompt snapshot, not merely a seed that might regenerate a different result.
10. `Use in Scene Lab` transfers exact values and role assignments through a typed snapshot.
11. History supports returning to recent generated prompts, with no cloud sync.
12. Fast response and graceful exhaustion: de-duplicate selections within a session/category until the available pool is exhausted, then start a new shuffled cycle rather than freeze.

### 6.1 Multi-person relationship model (critical)

A relationship is not an arbitrary two-person phrase stamped onto four actors. Use a structured `RelationshipTemplate` with `{premise, minPlayers, maxPlayers, namedRoles, expandableRole, tags}`. Assign roles to the exact performer count and generate a **group-consistent** ensemble premise. For two people use a direct dyad; for three people use a triangle/shared relationship; for four to twelve support an ensemble with specific key roles and scalable participants.

Example two: *Two adult siblings planning a surprise birthday party.*

Example three: *Three former roommates who opened a restaurant; one manages money, one cooks, one secretly wants to sell.*

Example five: *Five board members of a failing neighborhood theater; a chair, treasurer, artistic director, newest member and longtime volunteer.*

Example eight: *Eight relatives coordinating one very chaotic family reunion; allocate four distinct leadership roles and four clearly described participating family-member roles.*

For ensembles above the fixed role count, assign `expandableRole` to the remaining players with unique labels (e.g., “Committee member 1”). No impossible pairings, pronoun/gender assumptions, references to a nonexistent third person as a player, or silently unassigned participant. Keep relationships clean and opt-out friendly.

### 6.2 Coherent generation implementation

Each entry carries curated topic tags (e.g. `family`, `workplace`, `travel`, `celebration`, `mystery`, `domestic`, `absurd`). First honor locks; then sample unlocked categories with a mild positive affinity for overlapping tags. **Do not force every item to share a tag or create an unnatural over-scripted scene.** If no compatible candidate exists, use independent fallback and mark nothing as broken. User must retain ability to reroll a category separately after coherent generation.

### 6.3 Topic and cue banks

- Joke topics: actual ordinary nouns, not abstract placeholder filler; support 185-style singular/plural text.
- Private character objectives: short, specific, playable, light conflict, not “win the scene” or “make someone fail.”
- Hidden quirks: behavioral, fun and non-stigmatizing.
- Audio cue text and visual cue badge must come from the same scheduled cue object so they never diverge.
- All prompt selection should avoid immediate duplicate results; use pure functions and current usage history.

---
## 7. CANONICAL DATA CONTRACTS AND PERSISTENCE

**The attached TypeScript and SQLite files are normative.** Do not invent a contradictory schema. Use Zod runtime validation on static catalogs, database JSON fields at read boundaries and versioned content pack load. Strongly type internal game effects and never silently cast untrusted database JSON to an `Activity`.

### 7.1 Required domain entities

| Entity | Source of truth | Important fields |
| --- | --- | --- |
| `Activity` | bundled `activities.v1.json` | id, title, family, modes, engine, player/performance bounds, timer, cue types, rating, prompts, original teaching copy |
| `PromptEntry` | bundled prompt banks | id, category, text, tags, rating, supported player range |
| `RelationshipTemplate` | bundled relationship templates | coherent premise, min/max players, fixed/scalable roles, tags |
| `JokeTopic` | bundled topic bank | id, singular word, **plural form**, tags, rating |
| `Player` | local SQLite | generated UUID, optional entered display name or placeholder, seat index |
| `Session` | local SQLite | mode, player count, settings JSON, status, current round, seeded RNG, content pack version |
| `Round` | local SQLite | activity id, assigned performers/support, prompt snapshot, cue index, elapsed/remaining time, lifecycle status |
| `RoundParticipant` | local SQLite | role, duration, player participation; supports fair rotation |
| `Team` / `TeamMember` | local SQLite | session team labels and player membership for optional team play |
| `ScoreAward` | local SQLite | explicit manually awarded individual or team points |
| `FavoriteActivity` | local SQLite | activity ID and date saved |
| `SavedPrompt` | local SQLite | exact display snapshot, categories and locked state |
| `PromptPreset` | local SQLite | selected categories, generation style, player count |
| `PromptUsage` | local SQLite | recent prompt ID and category for anti-repeat |
| `Vote` | local SQLite | explicit human vote, target player and round; never AI judgments |
| `UserPreferences` | local SQLite | remembered player count, classroom clean, mature opt-in, audio, haptics, accessibility |

The names and runtime shapes are fully specified in `contracts/domain.schemas.ts`; the database migration is in `database/001_init.sql`. Their version-1 compatibility is mandatory.

**JokeTopic enhancement:** extend the provided `JokeTopicSchema` with optional `plural: string` or require explicit authored plural for P3-eligible topics. Never use a naive `word + 's'` formatter for irregular nouns. Include a catalog validation rule and tests.

**Private-objective, quirk and cue schemas:** add explicit Zod schemas for `SecretGoal {id,text,tags,rating,version}`, `GuestQuirk {...}` and `TimedCue {id,type,text,atElapsedMs,displayDurationMs,spokenText?}`. Tie object to correct round and person; never rely on raw strings for private assignments. Store secret-bearing data as local snapshots only, not analytics.

### 7.2 Shared TypeScript contracts (read with canonical Zod file)

```ts
type Mode =
  | 'surprise' | 'party_night' | 'just_us'
  | 'game_show' | 'scene_lab' | 'improv_gym';
type PromptCategory =
  | 'relationship' | 'location' | 'profession' | 'role'
  | 'emotion' | 'action' | 'situation' | 'object'
  | 'genre' | 'opening_line';
type Rating = 'clean' | 'mature_suggestive';
type GenerationStyle = 'independent' | 'coherent';
type SessionStatus = 'setup' | 'active' | 'paused' | 'finished';
type RoundStatus =
  | 'intro' | 'private_reveal' | 'ready'
  | 'live' | 'paused' | 'review' | 'complete' | 'skipped';
```

**Important:** `Studio` is not a session mode in the running session enum. It is a stand-alone tool with its own state. `surprise` is a session mode but not a catalog tag. Catalog mode membership represents curated discovery, not a hard wall between implementations.

### 7.3 SQLite and migrations

On native iOS, use `expo-sqlite`, preferably with the provider/onInit migration pattern and parameterized calls (`runAsync`/prepared statements) for any input-bearing operations. Keep schema migrations idempotent and versioned using `PRAGMA user_version` or a migration ledger. Enable foreign keys; use WAL where supported; use transactions for session creation, round transitions and votes. Never call `execAsync` with interpolated user text. Bundled content should remain static versioned JSON; do not copy thousands of prompt strings into local SQLite on every launch. On web, use the interoperable persistent adapter defined in section 2.2; both adapters must pass the same domain/repository tests.

The v1 migration defines tables: `players`, `sessions`, `session_players`, `rounds`, `round_participants`, `teams`, `team_members`, `votes`, `score_awards`, `favorite_activities`, `saved_prompts`, `prompt_presets`, `prompt_usage`, `app_preferences`. Indices are included. Implement typed repository adapters and validation on both writes and reads. Add migration upgrade/recovery tests, a reset local data control with confirmation, and predictable seeding from bundled assets.

**Privacy:** player names and session preferences remain only on the device. No analytics, third-party tracking, advertising SDK, auth token or remote telemetry. Document what is and is not collected accurately; no microphone/camera permissions. Local deletion must remove all user-created data. Validate actual permissions and network behavior before claiming “No data collected” in App Store privacy answers.

### 7.4 Explicit round state machine

Use one typed reducer/state transition boundary; never have mutually incompatible component booleans controlling the truth of a round.

```text
new session -> INTRO
INTRO -> PRIVATE_REVEAL (if required) | READY
PRIVATE_REVEAL -> READY (after all reveals acknowledged)
READY -> LIVE (start)
LIVE -> PAUSED (pause or app background)
PAUSED -> LIVE (explicit resume)
LIVE -> REVIEW (finish / timer ends)
REVIEW -> COMPLETE (save vote/skip vote)
INTRO / PRIVATE_REVEAL / READY / LIVE / PAUSED -> SKIPPED (explicit skip)
COMPLETE / SKIPPED -> next INTRO or session FINISHED
```

A timer ending should not automatically declare a performer “done” if an activity permits an untimed ending; show a stop cue and Next/Finish. Protect transitions against double taps. Every mutation persists before moving to a dependent route. Recover persisted `LIVE` rounds on app restart as `PAUSED` with correctly stored remaining time and no phantom automated cues.

### 7.5 Timer / audio / cue behavior

- One centralized scheduler owns live cues, countdowns and audio actions. No `setInterval` per component and no drift from background time.
- Use elapsed monotonic-relative behavior while foregrounded; on pause/background persist remaining duration and pending cue index. On foreground, **do not catch up and fire a burst of missed cues**. Resume on explicit tap.
- When cues require speech, use Expo Speech or an equivalent supported Expo mechanism but respect silent-mode limitations. On iOS, speech can be silent when the device's Ring/Silent switch is on; **every spoken cue must also be visible on screen and manually triggerable**, with optional haptic alert.
- Use built-in `expo-audio` for approved bundled short sounds where necessary, with iOS audio-mode configuration vetted in a real device build; never assume voice will play over Silent Mode unless tested and configured appropriately.
- `Pause`, `New Cue`, `Next`, `Replay`, and manual controls must not double-trigger audio or duplicate cues.
- Timers and cues work without network access. No wake-lock hacks or background audio services are needed; keep the device foreground for host play and offer a gentle screen-awake option only where supported.

---

## 8. ENGINE STRATEGIES AND IMPLEMENTATION PLAN

Use a **typed strategy/renderer registry** keyed by `Activity.engine`, with activity-specific configuration and explicit special-case strategy for the few mechanics that genuinely differ. Suggested interface:

```ts
interface GameEngine {
  canPlay(activity: Activity, settings: SessionSettings, activePlayers: Player[]): boolean;
  prepare(ctx: GameContext): PreparedRound;
  begin(round: RoundState): EngineEffects[];
  handleAction(round: RoundState, action: GameAction): RoundState;
  getControls(round: RoundState): ControlSpec[];
  getCoachContent(activity: Activity): GameGuide;
}
```

Define discriminated typed `GameAction` union for `START`, `PAUSE`, `RESUME`, `FINISH`, `SKIP`, `REPLAY`, `REROLL_PROMPT`, `CALL_CUE`, `NEXT_SEGMENT`, `REVEAL_TO_PLAYER`, `HIDE_PRIVATE_REVEAL`, `MARK_GUESS`, `CAST_VOTE`, `NEXT_ROUND`. No stringly typed actions spread among screen components. Put game mechanics in pure domain services with tests.

**Required engine families:**
1. `rapid_fire`: 6 one-topic punchline formats, turn/open mic/battle.
2. `scene_open`: relationship/open scene games with stage instructions and manual completion.
3. `scene_cued`: New Choice, Emotions, Genres, Surprise Line, Half-Life with typed distinct schedules.
4. `story_turn`: word/sentence alternation, Fortunately/Unfortunately, Yes-And, Association Chain, Listening Echo.
5. `movement`: Mirror, Character Walk, Invisible World, Group Statue; no-contact/seated variants.
6. `role_reveal`: Secret Objective and Party Quirks with private per-player reveals.
7. `interview`: Expert Interview, Gibberish Translator, Infomercial.
8. `hot_seat`: singular volunteer, remaining audience questions.
9. `scene_rotation`: Freeze & Replace, Scene Relay with distinct game rules.
10. `short_challenge`: Three-Line Scene and any future short-count challenge.

Do not rely on the engine enum alone to capture distinctive cues. A registry can route `G10` to a half-life-specific configuration and `G2` to a new-choice-specific configuration while sharing timer infrastructure.

**Game-specific behavior:** read and implement the `howTo`, `cueTypes`, and special notes in the catalog seed for each ID. Use proper semantics and phase controls; do not implement 39 static cards displaying “Start” and “Done” as if complete.

### 8.1 Content pack loading and validation

- Use `assets/content/v1` or `src/content/v1` with bundled JSON/TS.
- On app initialization, read only bundled static data and validate all records with the canonical schemas.
- Fail builds/CI for malformed content or missing required categories. In runtime provide a nonblank clear content-load error rather than a crash or invented prompt.
- Enforce unique IDs, 39 exact catalog IDs, player bounds, mode compatibility, required engine fields, category quota, no repeated cue choices, mature filtering, and usable relationship templates for 2,3,4,5,6,7,8,9,10,11,12 performers.
- Ensure diverse themes, gender-neutral role copy, inclusive examples, and believable workplace/family/friend relationships. Never ship filler like `Scenario 12` or generically repeated template sentences.
- Keep `content_pack_version` in each session and prompt snapshot so local resume can display saved exact text after an update.
- Include content attribution/credits for educational influences only where appropriate; do not copy proprietary game descriptions, TV scripts, app text or trademarked branding.

---

## 9. TECH STACK, APP STRUCTURE AND ENGINEERING STANDARDS

### 9.1 Stack

- React Native + **current supported Expo SDK**; select a mutually compatible version at build time based on official docs, and record versions in `package.json` and lockfile. Do not hard-code stale versions solely because they appear in this spec.
- TypeScript, `strict: true` with no blanket `any` escapes.
- Expo Router for shared iOS/web navigation; React Native Web support with appropriate packages and web bundler configuration.
- `expo-sqlite` for native local data and migrations, with a tested browser persistence adapter (IndexedDB preferred) behind shared typed repository interfaces.
- Zod for runtime schema contracts.
- A minimal predictable state management layer (typed domain services + React context/useReducer or Zustand if justified), not sprawling shared mutable state.
- `expo-speech` for spoken cues where appropriate; `expo-audio` for bundled effects, `expo-haptics` for optional alert, native Share API for copying/sharing prompt text.
- Lucide React Native or Expo-supported icons, a coherent reusable design-system component library, React Native Reanimated only if needed and if compatible with selected SDK.
- Playwright for real browser E2E testing, including mobile/desktop viewport screenshots, persistence after reload, and console-error detection.
- Jest/Vitest suitable for pure domain modules; React Native Testing Library for component behavior; Detox/Maestro or suitable E2E path for iOS flow tests where available. Do not claim simulator/device coverage unless executed.
- ESLint, Prettier, typecheck, content validation, test automation in GitHub Actions (if repository integration exists).
- EAS preview/dev/production profiles for eventual TestFlight, plus web build/export and optional authenticated EAS Hosting preview deployment; no secrets committed.

### 9.2 Proposed file layout

```text
off-script/
  app/
    _layout.tsx
    index.tsx                   # Home, Surprise Me CTA
    start.tsx                   # only necessary first-play count sheet
    session/[id].tsx           # live session shell
    games/index.tsx            # searchable library + mode shelves
    games/[activityId].tsx     # details, how to play, run one game
    studio/index.tsx           # Prompt Studio
    saved/index.tsx            # favorites/presets/history
    settings/index.tsx
  src/
    storage/                    # typed repository.native.ts + repository.web.ts
    design/                     # tokens, typography, chips, cards, buttons
    components/                 # ActivityCard, HostControls, PlayerChip, Timer,
                                # CueOverlay, PrivateReveal, PromptCategoryChip
    content/v1/                # catalog, prompt banks, relationship templates,
                                # topics, secret goals, guest quirks, cues
    domain/
      contracts.ts             # canonical Zod contracts
      engines/                 # strategy registry and implementations
      sessions/                # selection, fairness, round reducer, timers
      prompts/                 # independent/coherent generator and locks
      safety/                  # content gates and classroom policies
    db/
      migrations/001_init.sql
      database.ts
      repositories/
    providers/
    hooks/
    utils/
  assets/                       # original app icon, fonts as allowed, cue sounds
  scripts/
    validate-content.ts
    validate-catalog.ts
  tests/
    unit/
    integration/
    component/
    e2e/
  docs/
    PRD.md
    ARCHITECTURE.md
    CONTENT_GUIDELINES.md
    QA_MATRIX.md
    APP_STORE_READINESS.md
    RELEASE_RUNBOOK.md
    DECISIONS.md
  app.json / app.config.ts
  eas.json
  package.json
  package-lock.json (or chosen single package manager lock)
  README.md
```

If Expo's latest template structures the `app/` folder under `src/app`, adapt to the template while keeping route/component boundaries. Use no external APIs for core play.

### 9.3 Code and quality principles

- Implement meaningful reusable components, not one gigantic App.tsx.
- Pure domain logic for fairness, prompt selection, private reveal assignment, round reducer and timer math.
- Domain functions accept RNG/timestamps as inputs so they can be simulated in tests.
- Never use placeholder authentication, imaginary API responses or fixture-only views in production.
- Text-based content must be fully local and render on a completely offline device.
- All UI affordances should work; disable or remove anything not implemented.
- Keep rendering performant with lazy screen loading and memoized static catalog access where useful.
- Use transactional persistence and idempotent user actions for crash-safe state.
- Include error boundaries and human-readable recovery actions for corrupted local state/catalog data.
- Don't overbuild generalized SaaS infrastructure for a one-phone party game.

---

## 10. IMPLEMENTATION PHASES — ALL REQUIRED FOR A COMPLETE V1

Build in small commits or PRs if the environment supports it. Phases are sequencing, **not permission to defer v1 scope**. Each phase ends with running tests and a concrete completion summary.

### Phase 0: Foundation & contract

- Inspect repo safely, scaffold Expo + TypeScript + Expo Router.
- Establish design tokens, base layout/safe areas, CI, scripts, package lock, EAS config placeholders, lint and typecheck.
- Integrate Zod contracts, base assets, `expo-sqlite`, version-1 migration.
- Import/validate the 39-activity seed with exact IDs.
- Add documented architecture decisions and a quickstart README.
- Gate: clean iOS and web first run, visible playable web shell, schema verification, native migration idempotence and working browser persistence.

### Phase 1: Instant play / Surprise Me vertical slice

- Build finished Home and number-of-players sheet.
- Implement session reducer, settings defaults, deterministic activity selection, player assignment, round flow and saved resume.
- Complete at least three real representative activities spanning rapid-fire, scene, and story with reusable engines, **then complete remaining engine strategies later**.
- Show a meaningful first playable activity, timer where relevant, finish, skip, replay, new prompt and another surprise.
- Persist last count, sessions, round state and prompt snapshots.
- Gate: first-time 2 taps and returning 1 tap; offline works; 2-person end-to-end test ON WEB AND iOS (when available). Provide an owner-inspectable running browser view/URL as soon as supported; screenshots alone are not the browser demo.

### Phase 2: Prompt Studio fully operational

- All ten toggles, selected category display, lock/individual reroll, independent/coherent, number of performers, multi-person relationships, presets, save/history/share/large display, handoff to Scene Lab.
- Generate and curate content banks to required counts; schema validate content.
- Gate: empty category, single category, ten categories, locked reroll, 2/3/5/8/12 people, offline, browser reload/history/resume tests.

### Phase 3: All 39 activities & six mode experiences

- Implement all ten engine families, activity variants, handovers, timed cues, spoken/visual/manual fallback, sound effects roles, private reveals, pass-the-phone, half-life segments, teacher controls and class variants.
- Complete each of the 39 games one by one with its exact mechanics, not only its presence in search.
- Surface mode-specific discovery shelves and Just Us/Party Night curated session behavior without cluttering home.
- Gate: automated activity matrix runs every ID with valid player limits, starts, plays, finishes and replays; required specialty tests pass.

### Phase 4: Saved, settings, coaching and polish

- Complete Favorites, Saved Prompts, Prompt Presets, recent history, manual voting and simple scoring.
- Add coaching guides, skill index, detailed Help/How to Play, user-friendly empty states.
- Complete accessibility, haptics/audio preferences, family/classroom clean mode, appropriate adult opt-in.
- Add subtle delight: shuffle transition, fun cue badges, tactile feedback, reduced motion fallback.
- Gate: no dead buttons, no crash on rotation, large text, VoiceOver labels, content filter tests, data deletion.

### Phase 5: Regression, real-device tests and App Store readiness

- Full validation of 39 games and 600/160/60/40 content minimums.
- Run unit, integration, component, Playwright browser E2E and feasible iOS E2E tests. Build/export the full web version.
- Test 2-person, 6-person, 8-person instructor flows on at least one real device; test silent mode and offline/airplane mode.
- Audit content, naming conflicts, age rating, privacy policy, accessibility, app icons, screenshots, metadata, release notes and EAS signing placeholders.
- Prepare working TestFlight-ready build commands. **Do not claim an App Store submission or TestFlight upload without actually completing it with authorized credentials.**
- Gate: real complete browser play-through and web build/export succeed; a preview URL is supplied only if actually hosted. Release checklist is green, or report any remaining verified blockers and exact remediation.

---

## 11. REQUIRED TEST PLAN / ACCEPTANCE MATRIX

**General tests**
- Catalog has exactly 39 unique IDs, correct 6/11/9/8/5 distribution, valid modes, player bounds, activity copy and engines.
- Every game supports compatible group sizes; no activity is offered to an incompatible group.
- Validated content counts meet all quotas, no duplicate prompt IDs, and no placeholder content.
- No forced login, online access, microphone, camera, location, contact or tracking permissions.
- All important controls have actual behavior; no unimplemented tap handlers.
- App restart, force kill, background, orientation changes (where supported), and low storage produce recoverable states.

**Surprise Me tests**
- First-run: home → tap Surprise Me → choose count → first playable game. Name entry optional.
- Return-run: one tap with saved count starts a compatible round.
- Player count 2 never yields games with min 3.
- Counts 3, 6 and 12 always yield an eligible activity within a bounded selection time.
- Weighted selector never relaxes hard constraints when content is scarce.
- No immediate repeat in a normal sufficiently populated catalog.
- Fairness simulations with seeded RNG across 50 sessions; no persistent starvation when compatible performer roles remain.
- Skip before play doesn't count as performed; repeated skip biases next selection but never permanently bans game.
- User can end and resume a paused session; next opening does not silently discard it.

**Prompt Studio tests**
- Each of 10 categories works alone.
- All ten selected together work without inventing extra categories.
- Multiple toggles and per-category reroll preserve every other category exactly.
- Locked result remains identical across full regenerate and reopening saved snapshot.
- 2-person relationship has 2 valid assigned roles; 3-person and 4–12-person templates assign all participants coherently.
- Changing player count respects existing locks or clearly asks for an unlock.
- Coherent generation prefers curated affinity but gracefully falls back when none available.
- Studio works with no active session; Scene Lab receives exact snapshot.
- History, save, copy, share, full-screen display and reset flow work offline.

**Audio / timed game tests**
- G2 new-choice scheduled/manual cue; G3 correct emotion; G4 correct genre; G9 short line; G10 60/30/15/5 stage progression.
- Pause and background do not advance countdown; no catch-up cue burst on resume.
- Visible/manual cue works in iPhone silent mode with speech disabled or inaudible.
- No duplicated sound/haptic from double tap or component remount.
- Short game finishes normally if sound/tactile hardware unavailable.

**Private reveal tests**
- S4 objective shown only to intended participant; card covers itself before next recipient.
- T3 host is not shown hidden quirks, and each guest gets their own separate quirk.
- On app background/app switcher, cover any private info. Clear transcript/display when private reveal exits.
- Private content never enters logs, history previews, copy/share output or summary without explicit consent.

**Content safety tests**
- Default clean mode excludes P2 and all suggestive entries, even via Surprise Me, search, and saved history.
- Mature content requires opt-in confirmation and is clearly labeled; switching to classroom clean removes it immediately from eligible pools.
- Users can skip any activity without penalty or explanation.
- Physical activities offer seated options and no unwanted contact requirement.
- Gibberish game notes disallow imitating real accents; all educational content avoids humiliation or personal-target jokes.

**Browser parity tests (mandatory)**
- `npm run web` opens an interactive application without errors, not a blank screen or iOS-only asset import failure.
- `npm run build:web` creates a real usable web export with working route transitions.
- Playwright executes playable Surprise Me, Prompt Studio, Game Show, direct game launch and session resume in mobile and desktop viewports.
- Web save/reload restores names, counts, preferences, favorites, Studio prompts and paused rounds with no data loss; private reveals re-cover on tab background.
- Browser with speech/audio blocked still permits every compatible activity through visible/manual cue controls.
- Keyboard access, focus indication, high zoom, clean-content gating and 2/6/8-player flows pass.
- No fatal console errors. Capture and include browser screenshots as evidence.
- Cross-platform repository contract suite passes against native SQLite and real web IndexedDB (or validated web SQLite).

**Offline and local storage tests**
- Run all 39 activities in airplane mode.
- Favorites, prompted snapshots, preferences and unfinished session round-trip through SQLite.
- Migration 001 runs on empty database, and rerun does not lose rows.
- Corrupt JSON is handled with recoverable error, not unhandled crash.
- Data-deletion control deletes locally stored personal/session information.

**Usability / accessibility**
- Beginner can understand the premise and begin within 10 seconds of seeing a new activity card in moderated tests.
- VoiceOver identifies prompt, primary actions and countdown clearly; screen reader does not disclose private prompts to the wrong player.
- Dynamic Type / large text does not obscure critical Start/Next controls.
- Touch targets at least 44x44 pt; accessible contrast; reduce-motion path.
- Session is usable by two people without a third-person facilitator.

**Suggested script names:**

```bash
npm run lint
npm run typecheck
npm run content:validate
npm run test
npm run test:integration
npm run test:e2e   # where simulator/device runner is present
npm run web          # Expo live interactive browser dev server
npm run build:web    # production web export
npm run test:e2e:web # Playwright real browser tests
npx expo-doctor
```

Pin and verify compatible versions and ensure `npm install` from a clean checkout succeeds. CI should run all non-device checks on each PR.

---

## 12. EDITORIAL AND IMPROV-TEACHING STANDARDS

- Provide `What you do`, `Why this helps`, `Example`, and `Tip` for every game, with optional `Reflection` at end.
- Ground educational claims in widely used practices: agreement, focused listening, making offers, relationship, narrative continuity, status/character and physical space. Reference appropriate original sources in developer-facing credits/notes, but write **original in-app instructions**, not copied third-party text.
- The app must not frame laughter as the only goal: some scenes may be emotionally grounded or observational.
- Distinguish improv *constraints* (“Questions Only”, “Three-Line Scene”, literal Yes-And) from universal improv rules. Make it clear those constraints are exercises, not rules for all scenes.
- Support gentle, opt-in critique via self-reflection prompts; never auto-grade subjective talent.
- Give beginner-friendly explanations before introducing insider terms (“heighten,” “offers,” “status”).
- Joke categories and examples must be original and suitable for people with different cultural contexts; no jokes at the expense of identities, disabilities, trauma, or actual relationships in the room.
- No transcriptions, unattributed TV script lines, branded program logos or falsely implied partnership with *Whose Line Is It Anyway?*, Picolo or other apps. Familiar game mechanics can be described in original words; review legal issues where appropriate.

**Useful developer/editor research:**
- Improv Encyclopedia, https://improvencyclopedia.org/games/
- Hoopla Impro, https://www.hooplaimpro.com/resource/short-form-show-games
- Expo Router, https://docs.expo.dev/router/introduction/
- Expo SQLite, https://docs.expo.dev/versions/latest/sdk/sqlite/
- Expo Speech, https://docs.expo.dev/versions/latest/sdk/speech/
- Expo Audio, https://docs.expo.dev/versions/latest/sdk/audio/
- Expo Web, https://docs.expo.dev/workflow/web/
- Expo Web Hosting, https://docs.expo.dev/eas/hosting/get-started/
- Expo SQLite web setup, https://docs.expo.dev/versions/latest/sdk/sqlite/
- Expo EAS submission, https://docs.expo.dev/submit/ios/
- Apple App Review Guidelines, https://developer.apple.com/app-store/review/guidelines/

These links are reference material; verify against current versions when implementing.

---

## 13. PRIVACY, CONTENT AND APP STORE COMPLIANCE

- **No authentication or service backend in v1.** No third-party analytics, ads, crash logging that uploads personal content, online prompts or network-dependent features. No special permissions are justified for ordinary play.
- Store only locally entered names/settings, local prompts, favorites, history and votes. Provide a clear `Reset All Local Data` action with confirmation.
- Adult joke format P2 should be hidden by default, available only in adult opt-in settings with an 18+ self-attestation and non-explicit editorial copy. **Do not assume an opt-in toggle alone guarantees App Store policy compliance**; properly complete age-rating questionnaire and editorial review. If a restriction would prevent approval, report it honestly and propose the least disruptive compliant treatment without silently discarding the agreed feature.
- In classroom mode, clean-only always takes precedence over adult opt-in and persisted favoriting.
- Provide a plain-language privacy policy and support contact placeholders in docs; do not invent owned domains or email addresses. Build should allow configured legal policy URL when owner supplies one.
- Complete TestFlight metadata checklist, purpose strings audit, accessibility audit, original icon/screenshots, bundle ID owner selection and trademark check for “Off Script” / “Offscript Games” before public submission.
- Do not upload or submit to App Store on behalf of owner without authorized developer-account access. A compiled local/simulator preview, EAS build configuration and release notes are legitimate deliverables even when submission credentials are unavailable.

---

## 14. RELEASE CHECKLIST AND CODEX FINAL REPORT FORMAT

At completion, return a precise report with:

1. **Shipped/implemented:** architecture, screens, engines, 39 games, Prompt Studio, iOS + full browser feature parity, native/web storage, content counts, cues, accessibility and App Store readiness.
2. **Repository:** path, branch, commits/PRs created, key file locations; never invent URLs or commit SHAs.
3. **Verification:** exact commands executed, including `npm run web`, `npm run build:web`, Playwright browser tests, pass/fail counts, failed/skipped tests and reason. Explicitly distinguish static validation, simulator verification and actual real-device verification.
4. **Manual QA checklist:** two players, six friends, instructor group, private reveals, adult filtering, airplane mode, silent mode, background/resume.
5. **Preview and TestFlight steps:** verified working web preview URL if successfully deployed (or honest lack of externally reachable URL), local web run steps, browser screenshots and iOS/TestFlight owner actions, without disclosing secret values.
6. **Blockers/risk register:** unresolved technical issues, naming/legal clearance, adult-content review, missing device test coverage, and content QA work if incomplete.
7. **Next 3 highest-value actions**, clearly separated into launch blockers and optional later enhancements.

**Definition of Done:** Off Script v1 is a real standalone iOS-capable app AND fully playable responsive web app built from the same project, with **all 39 distinct activities**, all **six experiences**, home-first **Surprise Me**, stand-alone **Prompt Studio**, durable local state, credible game instructions, working cue/host behavior, mature default-safe gating, tests and EAS-ready configuration. No dummy screens, mock APIs, placeholder player setup or unimplemented game mechanics. If external constraints prevent any of this, state exactly what is finished and what remains; do not label the release complete.

**Start implementing now.**


---

# APPENDICES — IMPLEMENTATION ARTIFACTS INCLUDED IN THIS SINGLE-FILE PROMPT

The files below are fully embedded so the prompt remains self-contained when pasted into Codex. When creating the repository, write each appendix to its declared relative path and import/validate it; do not omit or paraphrase the contents.

## Appendix A — canonical TypeScript / Zod contracts

**Write to `contracts/domain.schemas.ts`:**

```ts
/**
 * OFF SCRIPT v1 canonical domain contracts.
 * Copy this file to src/domain/contracts.ts in the generated Expo app.
 * All seed data, persistence adapters, UI views and game engines must pass these validators.
 * Runtime dependency: zod.
 */
import { z } from 'zod';

export const ModeSchema = z.enum([
  'surprise', 'party_night', 'just_us', 'game_show', 'scene_lab', 'improv_gym',
]);
export const CatalogModeSchema = z.enum([
  'party_night', 'just_us', 'game_show', 'scene_lab', 'improv_gym',
]);
export const FamilySchema = z.enum(['punchline', 'performance', 'scene', 'drill', 'social']);
export const EngineSchema = z.enum([
  'rapid_fire', 'scene_open', 'scene_cued', 'story_turn', 'movement',
  'role_reveal', 'interview', 'hot_seat', 'scene_rotation', 'short_challenge',
]);
export const PromptCategorySchema = z.enum([
  'relationship', 'location', 'profession', 'role', 'emotion', 'action',
  'situation', 'object', 'genre', 'opening_line',
]);
export const RatingSchema = z.enum(['clean', 'mature_suggestive']);
export const EnergySchema = z.enum(['seated', 'light_movement', 'full_movement']);
export const CueTypeSchema = z.enum([
  'new_choice', 'emotion_change', 'genre_change', 'surprise_line',
  'rotation', 'status_shift', 'countdown', 'stop',
]);
export const PlayPatternSchema = z.enum([
  'take_turns', 'open_mic', 'pair', 'ensemble', 'rotating', 'volunteer',
]);

export const ActivitySchema = z.object({
  id: z.string().regex(/^[PGSWT][0-9]{1,2}$/),
  title: z.string().min(3),
  family: FamilySchema,
  modes: z.array(CatalogModeSchema).min(1),
  engine: EngineSchema,
  minPlayers: z.number().int().min(2).max(12),
  maxPlayers: z.number().int().min(2).max(12),
  minPerformers: z.number().int().min(1).max(12),
  maxPerformers: z.number().int().min(1).max(12),
  playPattern: PlayPatternSchema,
  defaultDurationSec: z.number().int().min(20).max(600),
  timerMode: z.enum(['countdown', 'stopwatch', 'optional']),
  energy: EnergySchema,
  contentRating: RatingSchema,
  requiresPrivateReveal: z.boolean(),
  cueTypes: z.array(CueTypeSchema),
  promptCategories: z.array(PromptCategorySchema),
  focusSkills: z.array(z.string().min(2)).min(1),
  summary: z.string().min(20),
  howTo: z.string().min(50),
  example: z.string().min(20),
  coachTip: z.string().min(25),
  reflection: z.string().min(15),
  variants: z.array(z.enum(['standard', 'take_turns', 'open_mic', 'battle', 'teacher_led'])).min(1),
  voteEligible: z.boolean(),
  version: z.literal(1),
}).superRefine((a, ctx) => {
  if (a.minPlayers > a.maxPlayers) ctx.addIssue({ code: 'custom', path: ['minPlayers'], message: 'minPlayers exceeds maxPlayers' });
  if (a.minPerformers > a.maxPerformers || a.maxPerformers > a.maxPlayers) ctx.addIssue({ code: 'custom', path: ['maxPerformers'], message: 'Invalid performer range' });
  if (a.minPerformers > a.minPlayers) ctx.addIssue({ code: 'custom', path: ['minPerformers'], message: 'Not playable with stated minimum player count' });
  if (a.modes.includes('just_us') && a.minPlayers > 2) ctx.addIssue({ code: 'custom', path: ['modes'], message: 'Just Us must support two players' });
});
export type Activity = z.infer<typeof ActivitySchema>;

export const PromptEntrySchema = z.object({
  id: z.string().regex(/^prompt_[a-z_]+_[0-9]{3,4}$/),
  category: PromptCategorySchema,
  text: z.string().min(3).max(280),
  tags: z.array(z.string()).default([]),
  contentRating: RatingSchema.default('clean'),
  minPlayers: z.number().int().min(2).max(12).default(2),
  maxPlayers: z.number().int().min(2).max(12).default(12),
  version: z.literal(1),
}).refine(p => p.minPlayers <= p.maxPlayers, 'Invalid player range');
export type PromptEntry = z.infer<typeof PromptEntrySchema>;

export const RelationshipTemplateSchema = z.object({
  id: z.string().min(3),
  premise: z.string().min(15),
  minPlayers: z.number().int().min(2).max(12),
  maxPlayers: z.number().int().min(2).max(12),
  // Fixed slot roles, assigned without duplication.
  namedRoles: z.array(z.string().min(4)).min(2),
  // Required if more participants than namedRoles can participate.
  expandableRole: z.string().min(4).nullable(),
  tags: z.array(z.string()),
  contentRating: RatingSchema,
  version: z.literal(1),
}).superRefine((r, ctx) => {
  if (r.maxPlayers < r.minPlayers) ctx.addIssue({ code: 'custom', message: 'Invalid relationship player range' });
  if (r.namedRoles.length > r.minPlayers) ctx.addIssue({ code: 'custom', message: 'More fixed roles than minimum scene participants' });
  if (r.maxPlayers > r.namedRoles.length && !r.expandableRole) ctx.addIssue({ code: 'custom', message: 'Missing expandable role for ensemble' });
});
export type RelationshipTemplate = z.infer<typeof RelationshipTemplateSchema>;

export const JokeTopicSchema = z.object({
  id: z.string().regex(/^topic_[0-9]{3,4}$/),
  word: z.string().min(2).max(45),
  plural: z.string().min(2).max(55).optional(), // Mandatory for P3-compatible words.
  tags: z.array(z.string()),
  contentRating: RatingSchema.default('clean'),
  version: z.literal(1),
});
export type JokeTopic = z.infer<typeof JokeTopicSchema>;

export const SessionSettingsSchema = z.object({
  mode: ModeSchema,
  playerCount: z.number().int().min(2).max(12),
  vibe: z.enum(['surprise', 'silly', 'connection', 'practice', 'flirty']).default('surprise'),
  experience: z.enum(['beginner', 'mixed', 'experienced']).default('mixed'),
  energy: EnergySchema.default('seated'),
  pacing: z.enum(['short', 'balanced', 'relaxed']).default('balanced'),
  classroomClean: z.boolean().default(false),
  contentRating: RatingSchema.default('clean'),
  cuePreference: z.enum(['sound_and_visual', 'visual_only', 'manual']).default('sound_and_visual'),
  coaching: z.enum(['concise', 'detailed', 'hidden']).default('concise'),
  scoring: z.enum(['off', 'individual', 'teams']).default('off'),
  preferredMinutes: z.number().int().min(0).max(180).nullable().default(null),
  autoHost: z.boolean().default(true),
  namesOptional: z.boolean().default(true),
  rngSeed: z.number().int().nonnegative(),
}).superRefine((s, ctx) => {
  if (s.mode === 'just_us' && s.playerCount !== 2) ctx.addIssue({ code: 'custom', path: ['playerCount'], message: 'Just Us requires exactly two people' });
  if (s.mode === 'party_night' && s.playerCount < 3) ctx.addIssue({ code: 'custom', path: ['playerCount'], message: 'Party Night requires three or more people' });
  if (s.classroomClean && s.contentRating !== 'clean') ctx.addIssue({ code: 'custom', path: ['contentRating'], message: 'Classroom mode must be clean' });
});
export type SessionSettings = z.infer<typeof SessionSettingsSchema>;

export const PlayerSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1).max(40),
  isSittingOut: z.boolean().default(false),
  seatIndex: z.number().int().min(0).max(11),
});
export type Player = z.infer<typeof PlayerSchema>;

export const PromptSnapshotSchema = z.object({
  entries: z.record(z.string(), z.object({
    id: z.string(),
    text: z.string(),
    locked: z.boolean(),
  })).refine(r => Object.keys(r).every(k => PromptCategorySchema.safeParse(k).success), 'Invalid category key'),
  relationship: z.object({
    templateId: z.string(),
    premise: z.string(),
    assignments: z.array(z.object({ playerId: z.string(), roleText: z.string() })),
  }).nullable(),
  jokeTopic: z.object({ id: z.string(), word: z.string() }).nullable(),
  generationStyle: z.enum(['independent', 'coherent']),
  contentPackVersion: z.string(),
});
export type PromptSnapshot = z.infer<typeof PromptSnapshotSchema>;

export const RoundStatusSchema = z.enum([
  'intro', 'private_reveal', 'ready', 'live', 'paused', 'review', 'complete', 'skipped',
]);
export const SessionStatusSchema = z.enum(['setup', 'active', 'paused', 'finished']);

export const RoundStateSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  ordinal: z.number().int().nonnegative(),
  activityId: z.string().min(2),
  status: RoundStatusSchema,
  performerIds: z.array(z.string().uuid()),
  supportingPlayerIds: z.array(z.string().uuid()),
  promptSnapshot: PromptSnapshotSchema,
  // Timer persisted as remaining time on pause; wall-clock timestamps used only while active.
  remainingMs: z.number().int().nonnegative(),
  timerStartedAtEpochMs: z.number().nullable(),
  cueIndex: z.number().int().nonnegative(),
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
});
export type RoundState = z.infer<typeof RoundStateSchema>;

export const StudioStateSchema = z.object({
  playerCount: z.number().int().min(2).max(12),
  categories: z.array(PromptCategorySchema),
  generationStyle: z.enum(['independent', 'coherent']),
  result: PromptSnapshotSchema.nullable(),
});
export type StudioState = z.infer<typeof StudioStateSchema>;

export const TeamSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid(),
  displayName: z.string().min(1).max(40),
  playerIds: z.array(z.string().uuid()).min(1),
});
export type Team = z.infer<typeof TeamSchema>;

export const VoteSchema = z.object({
  id: z.string().uuid(),
  roundId: z.string().uuid(),
  voterPlayerId: z.string().uuid(),
  targetPlayerId: z.string().uuid().nullable(),
  targetTeamId: z.string().uuid().nullable(),
}).refine(v => Number(Boolean(v.targetPlayerId)) + Number(Boolean(v.targetTeamId)) === 1, 'Vote must target exactly one player or team');
export type Vote = z.infer<typeof VoteSchema>;

export const ScoreAwardSchema = z.object({
  id: z.string().uuid(),
  roundId: z.string().uuid(),
  targetPlayerId: z.string().uuid().nullable(),
  targetTeamId: z.string().uuid().nullable(),
  points: z.number().int().min(1).max(10),
  reason: z.string().max(80),
}).refine(v => Number(Boolean(v.targetPlayerId)) + Number(Boolean(v.targetTeamId)) === 1, 'Points require exactly one target');
export type ScoreAward = z.infer<typeof ScoreAwardSchema>;

export const UserPreferencesSchema = z.object({
  lastPlayerCount: z.number().int().min(2).max(12).default(2),
  soundEnabled: z.boolean().default(true),
  hapticsEnabled: z.boolean().default(true),
  reducedMotion: z.boolean().default(false),
  useLargeText: z.boolean().default(false),
  matureOptIn: z.boolean().default(false),
  matureConfirmedAt: z.string().datetime().nullable().default(null),
  classroomDefault: z.boolean().default(false),
  lastSessionSettings: SessionSettingsSchema.optional(),
});
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
```

## Appendix B — local SQLite migration

**Write to `database/001_init.sql`:**

```sql
-- OFF SCRIPT V1 - Local-only SQLite database.
-- Use expo-sqlite SQLiteProvider onInit and PRAGMA user_version migrations.
-- Execute this migration transactionally using appropriate expo-sqlite APIs.
-- Static game and prompt catalogs remain bundled immutable JSON, NOT copied to the database.
-- ALL user data is stored on device; no cloud account or analytics in v1.
-- On opening the DB, BEFORE transaction: PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY NOT NULL,
    display_name TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 40),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('surprise','party_night','just_us','game_show','scene_lab','improv_gym')),
    status TEXT NOT NULL CHECK (status IN ('setup','active','paused','finished')),
    player_count INTEGER NOT NULL CHECK (player_count BETWEEN 2 AND 12),
    settings_json TEXT NOT NULL CHECK (json_valid(settings_json)),
    rng_seed INTEGER NOT NULL,
    content_pack_version TEXT NOT NULL,
    current_round_ordinal INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    finished_at TEXT
);

CREATE TABLE IF NOT EXISTS session_players (
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE RESTRICT,
    seat_index INTEGER NOT NULL CHECK (seat_index BETWEEN 0 AND 11),
    is_sitting_out INTEGER NOT NULL DEFAULT 0 CHECK (is_sitting_out IN (0,1)),
    PRIMARY KEY (session_id, player_id),
    UNIQUE (session_id, seat_index)
);

CREATE TABLE IF NOT EXISTS rounds (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
    activity_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('intro','private_reveal','ready','live','paused','review','complete','skipped')),
    assigned_player_ids_json TEXT NOT NULL CHECK (json_valid(assigned_player_ids_json)),
    supporting_player_ids_json TEXT NOT NULL CHECK (json_valid(supporting_player_ids_json)),
    prompt_snapshot_json TEXT NOT NULL CHECK (json_valid(prompt_snapshot_json)),
    selected_variant TEXT NOT NULL,
    remaining_ms INTEGER NOT NULL CHECK (remaining_ms >= 0),
    timer_started_at_epoch_ms INTEGER,
    cue_index INTEGER NOT NULL DEFAULT 0 CHECK (cue_index >= 0),
    started_at TEXT,
    completed_at TEXT,
    UNIQUE (session_id, ordinal)
);

CREATE TABLE IF NOT EXISTS round_participants (
    round_id TEXT NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    contribution_role TEXT NOT NULL CHECK (contribution_role IN ('performer','support','audience')),
    performance_seconds INTEGER NOT NULL DEFAULT 0 CHECK (performance_seconds >= 0),
    PRIMARY KEY (round_id, player_id)
);

CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 40)
);

CREATE TABLE IF NOT EXISTS team_members (
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    PRIMARY KEY (team_id, player_id)
);

CREATE TABLE IF NOT EXISTS votes (
    id TEXT PRIMARY KEY NOT NULL,
    round_id TEXT NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    voter_player_id TEXT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    target_player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
    target_team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    CHECK ((target_player_id IS NOT NULL) + (target_team_id IS NOT NULL) = 1),
    UNIQUE (round_id, voter_player_id)
);

CREATE TABLE IF NOT EXISTS score_awards (
    id TEXT PRIMARY KEY NOT NULL,
    round_id TEXT NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
    target_player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
    target_team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
    points INTEGER NOT NULL CHECK (points BETWEEN 1 AND 10),
    reason TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    CHECK ((target_player_id IS NOT NULL) + (target_team_id IS NOT NULL) = 1)
);

CREATE TABLE IF NOT EXISTS favorite_activities (
    activity_id TEXT PRIMARY KEY NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_prompts (
    id TEXT PRIMARY KEY NOT NULL,
    label TEXT NOT NULL DEFAULT '',
    snapshot_json TEXT NOT NULL CHECK (json_valid(snapshot_json)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prompt_presets (
    id TEXT PRIMARY KEY NOT NULL,
    label TEXT NOT NULL,
    categories_json TEXT NOT NULL CHECK (json_valid(categories_json)),
    generation_style TEXT NOT NULL CHECK (generation_style IN ('independent','coherent')),
    player_count INTEGER NOT NULL CHECK (player_count BETWEEN 2 AND 12),
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS prompt_usage (
    id TEXT PRIMARY KEY NOT NULL,
    category TEXT NOT NULL,
    prompt_id TEXT NOT NULL,
    used_at TEXT NOT NULL,
    session_id TEXT REFERENCES sessions(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS app_preferences (
    key TEXT PRIMARY KEY NOT NULL,
    value_json TEXT NOT NULL CHECK (json_valid(value_json)),
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_updated ON sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_rounds_session ON rounds(session_id, ordinal);
CREATE INDEX IF NOT EXISTS idx_participation_player ON round_participants(player_id, round_id);
CREATE INDEX IF NOT EXISTS idx_prompt_usage_category ON prompt_usage(category, used_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_prompts_created ON saved_prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_round ON votes(round_id);
CREATE INDEX IF NOT EXISTS idx_teams_session ON teams(session_id);
CREATE INDEX IF NOT EXISTS idx_score_awards_round ON score_awards(round_id);

PRAGMA user_version = 1;
```

## Appendix C — full 39-game v1 catalog with rules and examples

**Write to `content/activities.v1.json`:**

```json
[
  {
    "id": "P1",
    "title": "Pickup Lines",
    "family": "punchline",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "rapid_fire",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "take_turns",
    "defaultDurationSec": 60,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "object"
    ],
    "focusSkills": [
      "association",
      "wordplay"
    ],
    "summary": "Invent a ridiculous pickup line from a single surprise topic.",
    "howTo": "Reveal one noun. Players take turns making a funny, clean pickup line related to the noun. In Open Mic, anyone may offer a line; in Battle, two volunteers compete and the group may vote.",
    "example": "Word: candle. “Are you a candle? Because you light up the entire room.”",
    "coachTip": "Find a concrete property of the object, then connect it to the person with confidence.",
    "reflection": "Which associations surprised you?",
    "variants": [
      "standard",
      "take_turns",
      "open_mic",
      "battle"
    ],
    "voteEligible": true,
    "version": 1
  },
  {
    "id": "P2",
    "title": "Sex With Me Is Like",
    "family": "punchline",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "rapid_fire",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "take_turns",
    "defaultDurationSec": 60,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "mature_suggestive",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "object"
    ],
    "focusSkills": [
      "analogy",
      "timing"
    ],
    "summary": "A mild, suggestive analogy game for consenting adult sessions only.",
    "howTo": "Only show after an explicit 18+ opt-in; never in classroom-clean mode. Reveal an everyday noun. Each player finishes “Sex with me is like [noun] because...” with non-explicit, playful wordplay. Anyone can skip without explanation.",
    "example": "Word: candle. “Sex with me is like a candle: best when there is a little spark.”",
    "coachTip": "Keep it witty and lightly suggestive, never graphic, targeted, or humiliating.",
    "reflection": "Was the joke clear and kind?",
    "variants": [
      "standard",
      "take_turns",
      "open_mic",
      "battle"
    ],
    "voteEligible": true,
    "version": 1
  },
  {
    "id": "P3",
    "title": "185 Walk Into a Bar",
    "family": "punchline",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "rapid_fire",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "take_turns",
    "defaultDurationSec": 75,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "object",
      "profession"
    ],
    "focusSkills": [
      "pun-building",
      "speed"
    ],
    "summary": "Turn a random noun into a quick bar-joke punchline.",
    "howTo": "The app reveals a pluralizable noun. Players begin “185 [plural nouns] walk into a bar...” and improvise a short bartender exchange or payoff. Rotate quickly; encourage absurd logic over perfect puns.",
    "example": "Word: clocks. “185 clocks walk into a bar. The bartender says, ‘We do not have time for this.’”",
    "coachTip": "The strongest joke often uses a familiar property of the noun in an unexpected context.",
    "reflection": "What word association made the best payoff?",
    "variants": [
      "standard",
      "take_turns",
      "open_mic",
      "battle"
    ],
    "voteEligible": true,
    "version": 1
  },
  {
    "id": "P4",
    "title": "World's Worst",
    "family": "punchline",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "rapid_fire",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "open_mic",
    "defaultDurationSec": 90,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "profession",
      "situation"
    ],
    "focusSkills": [
      "character",
      "commitment"
    ],
    "summary": "Impersonate the worst possible person for a profession or situation.",
    "howTo": "Reveal a profession, event, or occupation. Players step in or take turns delivering one short line or action as the world’s worst example. Reset to the same category for several quick attempts.",
    "example": "Profession: lifeguard. “Has anyone seen my glasses? I cannot actually see the pool.”",
    "coachTip": "Be specific and commit to the character; avoid punches aimed at real identities.",
    "reflection": "Did the character choice read immediately?",
    "variants": [
      "standard",
      "take_turns",
      "open_mic",
      "battle"
    ],
    "voteEligible": true,
    "version": 1
  },
  {
    "id": "P5",
    "title": "Terrible Advice",
    "family": "punchline",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "rapid_fire",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "take_turns",
    "defaultDurationSec": 90,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "situation"
    ],
    "focusSkills": [
      "perspective",
      "spontaneity"
    ],
    "summary": "Offer hilariously bad advice for ordinary harmless dilemmas.",
    "howTo": "Reveal a low-stakes everyday dilemma. Players improvise advice that is obviously absurd, impractical, or backwards. Never use real crisis, medical, or dangerous scenarios.",
    "example": "Dilemma: keeping a houseplant alive. “Teach it to water itself. Independence builds character.”",
    "coachTip": "Make the advice comically impractical while keeping the stakes harmless.",
    "reflection": "Did everyone recognize the absurd twist?",
    "variants": [
      "standard",
      "take_turns",
      "open_mic",
      "battle"
    ],
    "voteEligible": true,
    "version": 1
  },
  {
    "id": "P6",
    "title": "Never Say That",
    "family": "punchline",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "rapid_fire",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "open_mic",
    "defaultDurationSec": 75,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "location",
      "situation"
    ],
    "focusSkills": [
      "context",
      "wordplay"
    ],
    "summary": "Invent the one thing a character should never say at a particular occasion.",
    "howTo": "The app reveals a social situation or location. Players offer one brief statement that would be awkwardly out of place there. Favor playful surprise rather than cruelty.",
    "example": "At a wedding: “Okay, whose turn is it to try the cake first?”",
    "coachTip": "Use the normal expectations of the setting as the setup for the reversal.",
    "reflection": "Which line made the setting instantly recognizable?",
    "variants": [
      "standard",
      "take_turns",
      "open_mic",
      "battle"
    ],
    "voteEligible": true,
    "version": 1
  },
  {
    "id": "G1",
    "title": "Questions Only",
    "family": "performance",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "scene_open",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 2,
    "playPattern": "pair",
    "defaultDurationSec": 120,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "relationship",
      "location"
    ],
    "focusSkills": [
      "listening",
      "offer-making"
    ],
    "summary": "Perform an entire scene using questions instead of statements.",
    "howTo": "Two performers begin a simple shared scene. Every line must be a question. If a performer makes a statement, they can recover or be replaced by a volunteer in larger groups. Keep the scene coherent, not just a question contest.",
    "example": "A: “Did you invite my boss to dinner?” B: “Was I not supposed to?”",
    "coachTip": "Ask questions that give your partner something concrete to respond to.",
    "reflection": "Did the questions still establish a relationship and situation?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G2",
    "title": "New Choice",
    "family": "performance",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "scene_cued",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 2,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [
      "new_choice"
    ],
    "promptCategories": [
      "relationship",
      "location",
      "situation"
    ],
    "focusSkills": [
      "flexibility",
      "agreement"
    ],
    "summary": "Redo your last spoken choice whenever the app interrupts.",
    "howTo": "Two performers start an ordinary scene. At spaced intervals the app announces NEW CHOICE. The person who just spoke immediately replaces their last statement with a different one. Continue accepting the most recent choice as true.",
    "example": "A: “I got you roses.” CUE. A: “I got you an entire beehive.” B: “You remembered my favorite animal!”",
    "coachTip": "Replace the choice boldly, and have the partner support the new reality.",
    "reflection": "Did the replacements become part of the scene?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G3",
    "title": "Emotion Remote",
    "family": "performance",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "scene_cued",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 3,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [
      "emotion_change"
    ],
    "promptCategories": [
      "relationship",
      "location",
      "emotion"
    ],
    "focusSkills": [
      "emotional range",
      "continuity"
    ],
    "summary": "Continue a scene while emotional tones change on cue.",
    "howTo": "Start a simple scene. The app announces emotions at intervals; performers keep the established facts while altering their characters’ emotional point of view. Avoid choosing emotions that humiliate real participants.",
    "example": "An ordinary hardware-store return shifts from delighted to jealous to suspicious.",
    "coachTip": "Let emotions change how you react, not the basic facts of the scene.",
    "reflection": "Did the emotional change affect behavior rather than just volume?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G4",
    "title": "Genre Remote",
    "family": "performance",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "scene_cued",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 3,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [
      "genre_change"
    ],
    "promptCategories": [
      "location",
      "situation",
      "genre"
    ],
    "focusSkills": [
      "adaptability",
      "style"
    ],
    "summary": "Change performance genres without changing the core scene facts.",
    "howTo": "Begin one consistent situation. As the app calls new genres, immediately play the same situation in that style: romantic comedy, film noir, adventure, documentary, and others.",
    "example": "A lost library book becomes a film-noir mystery, then a high-stakes sports documentary.",
    "coachTip": "Switch voice, pacing and imagery while preserving who the characters are.",
    "reflection": "Did the genre switch feel clear and playful?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G5",
    "title": "Freeze & Replace",
    "family": "performance",
    "modes": [
      "party_night",
      "game_show",
      "improv_gym"
    ],
    "engine": "scene_rotation",
    "minPlayers": 3,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 3,
    "playPattern": "rotating",
    "defaultDurationSec": 180,
    "timerMode": "optional",
    "energy": "light_movement",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "action",
      "location"
    ],
    "focusSkills": [
      "physicality",
      "initiation"
    ],
    "summary": "Replace a frozen performer and launch a new scene from that pose.",
    "howTo": "Two players act. A waiting player calls FREEZE, then the performers stop moving. The caller gently replaces one performer in the pose and begins an entirely new scene suggested by the physical position.",
    "example": "Two people freeze reaching upward. The newcomer says, “Please hold the ladder; I am changing the moon.”",
    "coachTip": "Use the physical pose to inspire a new situation; avoid physical contact without permission.",
    "reflection": "Did the new opening justify the frozen pose?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G6",
    "title": "Gibberish Translator",
    "family": "performance",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "interview",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 2,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "profession",
      "situation"
    ],
    "focusSkills": [
      "listening",
      "co-creation"
    ],
    "summary": "One player speaks invented sounds, and the other translates their meaning.",
    "howTo": "One performer speaks in freely invented syllables. The translator explains the meaning to an audience. The speaker reacts to the translation and builds on it. Keep the fictional language playful and do not imitate real ethnic accents.",
    "example": "Speaker: “Blim bozzoya!” Translator: “Naturally, the mayor has declared every Tuesday a festival.”",
    "coachTip": "Both players should listen and treat each translation as a real offer.",
    "reflection": "Was the translation accepted and developed?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G7",
    "title": "Sound Effects",
    "family": "performance",
    "modes": [
      "party_night",
      "game_show",
      "improv_gym"
    ],
    "engine": "scene_open",
    "minPlayers": 3,
    "maxPlayers": 12,
    "minPerformers": 3,
    "maxPerformers": 3,
    "playPattern": "ensemble",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "light_movement",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "location",
      "action",
      "situation"
    ],
    "focusSkills": [
      "listening",
      "physicality"
    ],
    "summary": "One participant provides live sound effects for a pair of scene performers.",
    "howTo": "Assign two performers and one Foley artist. Generate a physical situation. The performers act while the third person invents sound effects; performers should react and let the sounds influence events.",
    "example": "An explorer opens a cave door; the Foley artist makes an unmistakable chicken cluck.",
    "coachTip": "Make the sound effects offers that the actors can accept rather than distractions.",
    "reflection": "Did the sound effects change what the characters did?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G8",
    "title": "Expert Interview",
    "family": "performance",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "interview",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 2,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "profession",
      "object",
      "situation"
    ],
    "focusSkills": [
      "character",
      "support"
    ],
    "summary": "Interview a confident expert in a completely invented subject.",
    "howTo": "The app reveals an implausible expert topic. One player is a talk-show host and the other is an expert. The host asks curious specific questions; the expert answers with commitment. Exchange roles on replay.",
    "example": "Topic: professional cloud naming. Expert: “Cirrus is very traditional, but cumulus is coming back.”",
    "coachTip": "Specific, grounded answers are funnier than nonstop random nonsense.",
    "reflection": "Did the interviewer help the expert look brilliant?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G9",
    "title": "Surprise Line",
    "family": "performance",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "scene_cued",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 3,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [
      "surprise_line"
    ],
    "promptCategories": [
      "opening_line",
      "relationship",
      "location"
    ],
    "focusSkills": [
      "integration",
      "scene continuity"
    ],
    "summary": "Include an unexpectedly revealed line in an ongoing scene.",
    "howTo": "Two people begin a scene. At spaced intervals the app reveals a short new line to the screen or announces it. A performer must say it naturally and everyone treats it as an honest part of the shared reality.",
    "example": "Line: “This is not what I meant by a surprise.” Said naturally during a family celebration.",
    "coachTip": "Do not apologize for the surprise sentence; justify it within the scene.",
    "reflection": "Did the unexpected line become meaningful?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G10",
    "title": "Half-Life",
    "family": "performance",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "scene_cued",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 2,
    "playPattern": "pair",
    "defaultDurationSec": 180,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [
      "countdown",
      "stop"
    ],
    "promptCategories": [
      "situation",
      "relationship"
    ],
    "focusSkills": [
      "story structure",
      "physical clarity"
    ],
    "summary": "Replay the same scene at rapidly shrinking lengths.",
    "howTo": "Perform a complete short scene once. Then repeat its major beats in 30 seconds, 15 seconds and 5 seconds as prompted by the app. The app controls segment countdowns; keep the essential story recognizable.",
    "example": "A lost-package scene shrinks from a detailed argument to “Parcel?” “Mine!” “No!”",
    "coachTip": "Replay the relationship and major turning points, not every exact word.",
    "reflection": "What was the essential beat that survived every replay?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "G11",
    "title": "Ridiculous Infomercial",
    "family": "performance",
    "modes": [
      "party_night",
      "just_us",
      "game_show"
    ],
    "engine": "interview",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 3,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "object",
      "profession"
    ],
    "focusSkills": [
      "heightening",
      "collaboration"
    ],
    "summary": "Sell a ridiculous invention together with complete confidence.",
    "howTo": "The app combines an everyday object with an impossible benefit. Two hosts alternate features, testimonials and demonstrations. They must support each invented claim as real.",
    "example": "Product: the self-filling umbrella. “It catches your rain and delivers it back as soup.”",
    "coachTip": "Escalate one consistent absurd invention instead of changing products each line.",
    "reflection": "Did the two hosts support a shared product idea?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": true,
    "version": 1
  },
  {
    "id": "S1",
    "title": "Open Scene",
    "family": "scene",
    "modes": [
      "scene_lab",
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "scene_open",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 4,
    "playPattern": "pair",
    "defaultDurationSec": 180,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "relationship",
      "location",
      "situation"
    ],
    "focusSkills": [
      "initiation",
      "listening"
    ],
    "summary": "Create a scene from only the clues you choose to reveal.",
    "howTo": "Select any number of Prompt Studio categories, including none for a completely open scene. Choose two to four primary performers and begin. Additional group members can watch or rotate on another round.",
    "example": "Relationship: former rivals. The performers discover their history and location by listening.",
    "coachTip": "Define something concrete early; do not wait for the perfect joke.",
    "reflection": "Did both performers develop the same shared reality?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "S2",
    "title": "Relationship First",
    "family": "scene",
    "modes": [
      "scene_lab",
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "scene_open",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 4,
    "playPattern": "pair",
    "defaultDurationSec": 180,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "relationship"
    ],
    "focusSkills": [
      "relationships",
      "emotional truth"
    ],
    "summary": "Begin a scene with a meaningful relationship and discover everything else.",
    "howTo": "Generate a two- to four-person relationship in Prompt Studio and reveal it. Start the scene without specifying location or situation. Performers should show how they feel about each other through specific behavior.",
    "example": "Relationship: two siblings competing to host the family reunion.",
    "coachTip": "Show the relationship through what you care about and the way you treat your partner.",
    "reflection": "Did we understand how these people relate?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "S3",
    "title": "Who, What, Where",
    "family": "scene",
    "modes": [
      "scene_lab",
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "scene_open",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 4,
    "playPattern": "pair",
    "defaultDurationSec": 180,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "relationship",
      "role",
      "location",
      "action"
    ],
    "focusSkills": [
      "clarity",
      "environment"
    ],
    "summary": "Establish who is present, what is happening, and where it happens.",
    "howTo": "Use Prompt Studio to reveal role or relationship, action or situation, and location. Give performers a few seconds to read and then have them demonstrate the shared reality through specific dialogue and behavior.",
    "example": "A museum conservator and apprentice are restoring a suspiciously noisy portrait.",
    "coachTip": "Do not announce an exposition checklist; let the reality emerge naturally.",
    "reflection": "Was the scene reality clear without excessive explanation?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "S4",
    "title": "Secret Objective",
    "family": "scene",
    "modes": [
      "scene_lab",
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "role_reveal",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 4,
    "playPattern": "pair",
    "defaultDurationSec": 180,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": true,
    "cueTypes": [],
    "promptCategories": [
      "relationship",
      "situation",
      "action"
    ],
    "focusSkills": [
      "objectives",
      "reacting"
    ],
    "summary": "Play an ordinary scene while pursuing private character wants.",
    "howTo": "Assign two to four performers. Show each player a unique private desire using pass-and-hide reveal before starting. The goals must be compatible with a single premise. Nobody can read the other players’ objectives unless they reveal them in character.",
    "example": "One person wants an apology; another wants to leave early. Both are at the same reunion.",
    "coachTip": "Pursue your want while still hearing and accepting your partner.",
    "reflection": "Did hidden wants create interesting choices without blocking?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "S5",
    "title": "Status Shift",
    "family": "scene",
    "modes": [
      "scene_lab",
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "scene_cued",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 4,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [
      "status_shift"
    ],
    "promptCategories": [
      "relationship",
      "profession"
    ],
    "focusSkills": [
      "status",
      "physical choices"
    ],
    "summary": "Explore how behavior changes with perceived social status.",
    "howTo": "Give characters different starting status relationships, then run a scene. Halfway through, offer a subtle cue that lets the status relationship change. Status concerns behavior and confidence, not a person’s inherent worth.",
    "example": "The nervous customer gains confidence when the powerful manager realizes they made an error.",
    "coachTip": "Play status through choices, physical behavior, and who accommodates whom.",
    "reflection": "How did the relationship shift without narrating it?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "S6",
    "title": "Three-Line Scene",
    "family": "scene",
    "modes": [
      "scene_lab",
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "short_challenge",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 2,
    "playPattern": "pair",
    "defaultDurationSec": 45,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "relationship",
      "location"
    ],
    "focusSkills": [
      "specificity",
      "initiation"
    ],
    "summary": "Establish a vivid scene reality in three lines of dialogue.",
    "howTo": "Give two performers a simple relationship or location. They deliver only three total spoken lines before stopping. The aim is to make clear choices and get on the same page, not to cram in a whole story.",
    "example": "A: “Dad, they sold the boat.” B: “After all those summers?” A: “I kept your captain’s hat.”",
    "coachTip": "Make one strong, concrete offer rather than packing in exposition.",
    "reflection": "What can the audience infer after only three lines?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "S7",
    "title": "Make the Mundane Matter",
    "family": "scene",
    "modes": [
      "scene_lab",
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "scene_open",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 3,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "action",
      "object",
      "relationship"
    ],
    "focusSkills": [
      "emotional connection",
      "specificity"
    ],
    "summary": "Give emotional meaning to something ordinary.",
    "howTo": "The app reveals a mundane statement or action. One performer says or does it naturally. The other responds as if it matters deeply to their relationship, without arbitrarily raising the stakes to catastrophe.",
    "example": "A: “I put the cups away.” B: “You remembered where Mom used to keep them.”",
    "coachTip": "Connect emotional importance to a relationship, not a random emergency.",
    "reflection": "Did an ordinary offer create a relationship?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "S8",
    "title": "Heighten the Pattern",
    "family": "scene",
    "modes": [
      "scene_lab",
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "scene_open",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 4,
    "playPattern": "pair",
    "defaultDurationSec": 180,
    "timerMode": "optional",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "relationship",
      "situation"
    ],
    "focusSkills": [
      "heightening",
      "pattern recognition"
    ],
    "summary": "Notice a playful behavior or idea and develop it intentionally.",
    "howTo": "Begin a scene with one unusual behavior that makes sense to the character. Rather than adding unrelated oddities, repeat and meaningfully heighten the original pattern while the other performer supports the relationship.",
    "example": "A neighbor politely asks permission before each increasingly tiny favor.",
    "coachTip": "Heighten through clearer consequences and reactions, not only louder or stranger choices.",
    "reflection": "What recurring pattern did the group recognize?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "S9",
    "title": "Invisible World",
    "family": "scene",
    "modes": [
      "scene_lab",
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "movement",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 4,
    "playPattern": "pair",
    "defaultDurationSec": 180,
    "timerMode": "optional",
    "energy": "light_movement",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "location",
      "action",
      "object"
    ],
    "focusSkills": [
      "object work",
      "space"
    ],
    "summary": "Build a detailed shared environment using imagined objects and space.",
    "howTo": "Reveal a physical location or task. Performers establish imaginary object size, weight and placement before speaking, then allow the activity to launch a scene. Leave room to move safely.",
    "example": "Two watchmakers silently carry a huge invisible clock onto a crowded shelf.",
    "coachTip": "Remember where you placed objects and share a consistent physical space.",
    "reflection": "Did both performers believe in the same environment?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "W1",
    "title": "Yes-And Ladder",
    "family": "drill",
    "modes": [
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "story_turn",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "ensemble",
    "defaultDurationSec": 120,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "situation"
    ],
    "focusSkills": [
      "agreement",
      "collaboration"
    ],
    "summary": "Practice receiving one idea and building on it.",
    "howTo": "One person makes a simple fictional offer. The next acknowledges the fact and adds a useful detail; continue in a circle. Players need not literally say “yes, and” each time.",
    "example": "“We bought a boat.” “And we named it after Grandma.” “She is demanding a captain’s hat.”",
    "coachTip": "Accept the substance of the offer, then add a detail that gives the next person room.",
    "reflection": "Did we make one coherent world together?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "W2",
    "title": "Word-at-a-Time Story",
    "family": "drill",
    "modes": [
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "story_turn",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "ensemble",
    "defaultDurationSec": 120,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [],
    "focusSkills": [
      "listening",
      "shared authorship"
    ],
    "summary": "Build a single story one spoken word at a time.",
    "howTo": "The group forms an order. Each player contributes exactly one word, moving quickly around the circle. Avoid trying to control where the story goes; practice noticing grammar and the last offer.",
    "example": "Players: “Yesterday” / “our” / “neighbor” / “discovered” / “a” / “dragon.”",
    "coachTip": "Listen for the next possible word instead of planning a whole sentence.",
    "reflection": "How much did the story change from the idea you expected?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "W3",
    "title": "Sentence Chain",
    "family": "drill",
    "modes": [
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "story_turn",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "ensemble",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "opening_line",
      "situation"
    ],
    "focusSkills": [
      "narrative",
      "acceptance"
    ],
    "summary": "Build a continuous story one complete sentence per player.",
    "howTo": "Start from one opening situation. Move in a fixed order, with each participant adding exactly one sentence that accepts the story so far. Avoid unrelated new plots.",
    "example": "“A package arrived with no return address.” “Inside was a map of our own apartment.”",
    "coachTip": "Pick up one detail already established and make it more important.",
    "reflection": "Did the ending connect to the beginning?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "W4",
    "title": "Fortunately / Unfortunately",
    "family": "drill",
    "modes": [
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "story_turn",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "ensemble",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "situation"
    ],
    "focusSkills": [
      "cause and effect",
      "heightening"
    ],
    "summary": "Alternate good and bad turns in a shared fictional story.",
    "howTo": "A player begins with an ordinary story event. Participants alternate new sentences starting Fortunately and Unfortunately. Each twist should grow from the previous turn rather than reset the story.",
    "example": "“Unfortunately, the bus broke down.” “Fortunately, it stopped outside a bakery.”",
    "coachTip": "Make every new twist a consequence of what just happened.",
    "reflection": "Did the story escalate logically?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "W5",
    "title": "Mirror",
    "family": "drill",
    "modes": [
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "movement",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "ensemble",
    "defaultDurationSec": 120,
    "timerMode": "optional",
    "energy": "light_movement",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [],
    "focusSkills": [
      "nonverbal listening",
      "trust"
    ],
    "summary": "Follow another player’s movement with careful attention.",
    "howTo": "Players stand or sit in pairs. One slowly moves and the other mirrors. Switch the leader, then try to move together without declaring a leader. Offer seated or hands-only options for accessibility.",
    "example": "Two partners raise their hands together, then silently change direction as one.",
    "coachTip": "Move slowly enough that your partner can stay connected; do not turn this into a trick.",
    "reflection": "When did it become hard to identify the leader?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "W6",
    "title": "Association Chain",
    "family": "drill",
    "modes": [
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "story_turn",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "ensemble",
    "defaultDurationSec": 90,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "object"
    ],
    "focusSkills": [
      "spontaneity",
      "flexibility"
    ],
    "summary": "Build a quick chain of words by free association.",
    "howTo": "Reveal a starting word. Players respond in turn with the first harmless association it sparks. There are no incorrect answers; do not require explanations or criticize unexpected connections.",
    "example": "“Rain” → “boots” → “puddles” → “frogs” → “pond.”",
    "coachTip": "Trust your first usable thought and keep the rhythm moving.",
    "reflection": "Did anyone surprise themselves with an association?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "W7",
    "title": "Character Walk",
    "family": "drill",
    "modes": [
      "improv_gym",
      "party_night"
    ],
    "engine": "movement",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "ensemble",
    "defaultDurationSec": 150,
    "timerMode": "optional",
    "energy": "full_movement",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "role",
      "emotion",
      "action"
    ],
    "focusSkills": [
      "character physicality",
      "embodiment"
    ],
    "summary": "Create different characters through physical choices.",
    "howTo": "Offer a posture, tempo, energy, or imaginary physical trait. Players move around safely or do a seated version, letting movement suggest voice and personality. Never imitate protected characteristics.",
    "example": "Explore a character who feels as if their shoes are much too heavy for their feet.",
    "coachTip": "Change one physical variable at a time to notice how it influences character.",
    "reflection": "What physical adjustment instantly suggested a new person?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "W8",
    "title": "Listening Echo",
    "family": "drill",
    "modes": [
      "improv_gym",
      "party_night",
      "just_us"
    ],
    "engine": "story_turn",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 12,
    "playPattern": "take_turns",
    "defaultDurationSec": 120,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "relationship",
      "situation"
    ],
    "focusSkills": [
      "active listening",
      "emotional reactions"
    ],
    "summary": "Listen for a meaningful detail before adding your own offer.",
    "howTo": "A player shares one fictional observation in character. The next person briefly repeats or paraphrases a key meaningful detail and contributes a new related detail. Repeat in pairs or a circle; avoid robotic verbatim repetition.",
    "example": "A: “My boat leaves tonight.” B: “Tonight? I thought you were staying for the festival.”",
    "coachTip": "Use the echo to prove that you heard the offer and are affected by it.",
    "reflection": "Did your response truly connect to what was said?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "T1",
    "title": "Invented Shared History",
    "family": "social",
    "modes": [
      "party_night",
      "improv_gym",
      "just_us"
    ],
    "engine": "scene_open",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 4,
    "playPattern": "pair",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "relationship",
      "situation"
    ],
    "focusSkills": [
      "agreement",
      "relationship"
    ],
    "summary": "Invent a mutual memory as if your characters have known each other for years.",
    "howTo": "Two to four performers receive a relationship and an occasion. One mentions a shared memory; the others confidently add details without contradicting the established history. Other players can take the next round.",
    "example": "“Remember when we opened that lemonade stand?” “And it ended up on the evening news?”",
    "coachTip": "Treat your partner’s detail as something your character remembers too.",
    "reflection": "Did the memory become specific and mutually owned?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "T2",
    "title": "Character Hot Seat",
    "family": "social",
    "modes": [
      "party_night",
      "improv_gym",
      "just_us"
    ],
    "engine": "hot_seat",
    "minPlayers": 2,
    "maxPlayers": 12,
    "minPerformers": 1,
    "maxPerformers": 1,
    "playPattern": "volunteer",
    "defaultDurationSec": 150,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "role",
      "profession",
      "emotion"
    ],
    "focusSkills": [
      "character consistency",
      "specificity"
    ],
    "summary": "Ask questions of one performer who is fully committed to a fictional character.",
    "howTo": "The app gives a volunteer a character role. Everyone else asks short, imaginative questions. The character answers immediately while maintaining a consistent point of view. Switch volunteers each round.",
    "example": "Character: an overconfident lighthouse keeper. “How do you sleep?” “I wink at the ships one at a time.”",
    "coachTip": "Build a consistent character perspective rather than chase random jokes.",
    "reflection": "What did you learn about the character?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "T3",
    "title": "Party Quirks",
    "family": "social",
    "modes": [
      "party_night",
      "game_show",
      "improv_gym"
    ],
    "engine": "role_reveal",
    "minPlayers": 3,
    "maxPlayers": 12,
    "minPerformers": 3,
    "maxPerformers": 6,
    "playPattern": "ensemble",
    "defaultDurationSec": 240,
    "timerMode": "optional",
    "energy": "light_movement",
    "contentRating": "clean",
    "requiresPrivateReveal": true,
    "cueTypes": [],
    "promptCategories": [
      "role",
      "emotion",
      "situation"
    ],
    "focusSkills": [
      "character",
      "nonverbal choices"
    ],
    "summary": "One host guesses the hidden fictional quirks of party guests.",
    "howTo": "Assign one host and two to five guests. Show each guest a distinct harmless character quirk privately through pass-and-hide screens while the host looks away. The host then mingles and guesses each quirk. Pass and reveal must never expose other guests’ assignments.",
    "example": "One guest thinks every chair is a celebrity; another treats the party like an international summit.",
    "coachTip": "Guests should demonstrate quirks through behavior and conversation, not simply announce them.",
    "reflection": "Did the host receive enough clues to make fair guesses?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "T4",
    "title": "Scene Relay",
    "family": "social",
    "modes": [
      "party_night",
      "improv_gym",
      "game_show"
    ],
    "engine": "scene_rotation",
    "minPlayers": 3,
    "maxPlayers": 12,
    "minPerformers": 2,
    "maxPerformers": 4,
    "playPattern": "rotating",
    "defaultDurationSec": 180,
    "timerMode": "countdown",
    "energy": "seated",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [
      "rotation"
    ],
    "promptCategories": [
      "relationship",
      "location",
      "situation"
    ],
    "focusSkills": [
      "scene continuity",
      "listening"
    ],
    "summary": "Replace performers while keeping the established scene reality intact.",
    "howTo": "Two performers begin a scene. On a timed or manual rotation cue, a waiting player replaces one performer and continues the same established scene. The new person accepts the original relationships, location and situation.",
    "example": "A cafe scene continues as new employees rotate in, each accepting the missing birthday cake.",
    "coachTip": "Carry forward at least one concrete fact from before the switch.",
    "reflection": "Did the story stay recognizable across replacements?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  },
  {
    "id": "T5",
    "title": "Group Statue",
    "family": "social",
    "modes": [
      "party_night",
      "improv_gym"
    ],
    "engine": "movement",
    "minPlayers": 3,
    "maxPlayers": 12,
    "minPerformers": 3,
    "maxPerformers": 12,
    "playPattern": "ensemble",
    "defaultDurationSec": 150,
    "timerMode": "optional",
    "energy": "full_movement",
    "contentRating": "clean",
    "requiresPrivateReveal": false,
    "cueTypes": [],
    "promptCategories": [
      "location",
      "situation",
      "action"
    ],
    "focusSkills": [
      "ensemble awareness",
      "physical storytelling"
    ],
    "summary": "Create a frozen group image, then discover the story behind it.",
    "howTo": "Give the group a location or event. Everyone takes a comfortable pose to form a still image; one by one, performers briefly speak a character thought, then the group brings the image to life. Provide a fully seated option.",
    "example": "The group freezes as a chaotic airport baggage carousel and then begins speaking as employees and travelers.",
    "coachTip": "Make visual relationships legible and keep the physical space comfortable and safe.",
    "reflection": "What story did the statue communicate before anyone spoke?",
    "variants": [
      "standard",
      "teacher_led"
    ],
    "voteEligible": false,
    "version": 1
  }
]
```

## Appendix D — QA test matrix

**Write to `docs/QA_MATRIX.md`:**

# OFF SCRIPT — ALL 39 GAME ACCEPTANCE MATRIX

Each of these must pass an offline end-to-end round test. A static instruction card is not sufficient.

| ID | Activity | Min people | Mechanics to validate |
| --- | --- | ---: | --- |
| P1 | Pickup Lines | 2 | rapid_fire; player rotation, instructions, completion, replay |
| P2 | Sex With Me Is Like | 2 | 18+ opt-in and clean-class exclusion |
| P3 | 185 Walk Into a Bar | 2 | Singular/plural-compatible joke noun |
| P4 | World's Worst | 2 | rapid_fire; player rotation, instructions, completion, replay |
| P5 | Terrible Advice | 2 | rapid_fire; player rotation, instructions, completion, replay |
| P6 | Never Say That | 2 | rapid_fire; player rotation, instructions, completion, replay |
| G1 | Questions Only | 2 | scene_open; player rotation, instructions, completion, replay |
| G2 | New Choice | 2 | Automatic and manual NEW CHOICE cue; visual fallbacks |
| G3 | Emotion Remote | 2 | Emotion changes using emotion bank |
| G4 | Genre Remote | 2 | Genre changes using genre bank |
| G5 | Freeze & Replace | 3 | Freeze -> newcomer starts new scene; no touch assumption |
| G6 | Gibberish Translator | 2 | interview; player rotation, instructions, completion, replay |
| G7 | Sound Effects | 3 | Two actors + distinct Foley player |
| G8 | Expert Interview | 2 | interview; player rotation, instructions, completion, replay |
| G9 | Surprise Line | 2 | Surprise line only revealed on cue |
| G10 | Half-Life | 2 | 60/30/15/5 timer sequence and replay controls |
| G11 | Ridiculous Infomercial | 2 | interview; player rotation, instructions, completion, replay |
| S1 | Open Scene | 2 | Prompt Studio handoff with zero or many categories |
| S2 | Relationship First | 2 | scene_open; player rotation, instructions, completion, replay |
| S3 | Who, What, Where | 2 | scene_open; player rotation, instructions, completion, replay |
| S4 | Secret Objective | 2 | One secret objective per performer; safe private reveal |
| S5 | Status Shift | 2 | scene_cued; player rotation, instructions, completion, replay |
| S6 | Three-Line Scene | 2 | short_challenge; player rotation, instructions, completion, replay |
| S7 | Make the Mundane Matter | 2 | scene_open; player rotation, instructions, completion, replay |
| S8 | Heighten the Pattern | 2 | scene_open; player rotation, instructions, completion, replay |
| S9 | Invisible World | 2 | movement; player rotation, instructions, completion, replay |
| W1 | Yes-And Ladder | 2 | story_turn; player rotation, instructions, completion, replay |
| W2 | Word-at-a-Time Story | 2 | story_turn; player rotation, instructions, completion, replay |
| W3 | Sentence Chain | 2 | story_turn; player rotation, instructions, completion, replay |
| W4 | Fortunately / Unfortunately | 2 | story_turn; player rotation, instructions, completion, replay |
| W5 | Mirror | 2 | Seated mirror variant |
| W6 | Association Chain | 2 | story_turn; player rotation, instructions, completion, replay |
| W7 | Character Walk | 2 | Seated character-movement variant |
| W8 | Listening Echo | 2 | story_turn; player rotation, instructions, completion, replay |
| T1 | Invented Shared History | 2 | scene_open; player rotation, instructions, completion, replay |
| T2 | Character Hot Seat | 2 | hot_seat; player rotation, instructions, completion, replay |
| T3 | Party Quirks | 3 | One host + private guest quirks and reveal screen |
| T4 | Scene Relay | 3 | Substitute performer preserves scene reality |
| T5 | Group Statue | 3 | Seated group statue variant |

## Shared checks

Every catalog game: direct open from Explore; supported selected mode; correct number of stage/support participants; prompt loaded offline; start/finish; skip; new prompt when supported; favorite; short guide; original example; coaching; complete without an account or connection.

For Surprise Me, validate catalog eligibility and fair participant selection across many seeded sessions. For a Just Us run, confirm no required third facilitator.


## Appendix E — editorial and content requirements

**Write to `docs/CONTENT_GUIDELINES.md`:**

# OFF SCRIPT V1 — CONTENT / TEACHING EDITORIAL GUIDE

## Purpose

The app is a genuinely playable **social improv host** and a credible **classroom toolkit**. A random prompt is not a lesson. Each game needs easy instructions, a concrete demonstration, optional coaching and a completion loop.

## Editorial checks for all 39 activities

1. An inexperienced adult can understand the round in ten seconds of reading an activity card.
2. Instructions identify the minimum players and any supporting host / sound-artist / guest roles clearly.
3. Where a game has a special behavior (new choice, timed genre/emotion, private reveal, half-life replay), instructions accurately describe what the app actually does.
4. Every game has a unique original example, not generic “Player A says X” filler.
5. Coaching is a genuine transferable improv skill: listening, accepting, making specific offers, recognizing relationships, heightening, physical awareness or spontaneity.
6. Avoid treating short-form joke formats as interchangeable with believable scene work.
7. Distinguish temporary practice constraints from universal rules, e.g. “Questions Only” and literal “Yes-And.”
8. No pressure to disclose personal/romantic details, improv humiliating traits, touch other players, stand/walk, or do adult jokes.
9. Prefer everyday settings and intriguing relationships; avoid repetitive generic scenarios about office employees arguing.
10. Use original copy and original examples. Cite teaching influences in editor docs if applicable, but don't copy TV/show scripts or proprietary paid course materials.

## Required authored content — compile-time gates

600 Prompt Studio entries total: relationship 80, location 70, profession 50, role 65, emotion 50, action 65, situation 65, object 60, genre 25, opening_line 70. All clean by default.

Additional authored banks: 160 one-word nouns/subjects (with plural form for P3 where necessary), 60 distinct character objectives, 40 hidden guest quirks, and 50 or more valid cue values across emotions, genres and lines (may be drawn from above pools where appropriate). Validators must reject missing minimums, duplicate IDs, empty content, implausible min/max player counts, and accidental mature tags in clean-only pools.

## Relationship examples requiring dedicated structured templates

- Two: two siblings trying to organize the same surprise party, one thrilled and one anxious.
- Three: three former roommates managing a pop-up coffee shop, with manager, barista and skeptical investor.
- Four: four members of a community garden committee trying to decide where to put one bench.
- Five: family theater troupe, with a producer, stage manager, lead actor, new volunteer and old-school director.
- Eight: cousins planning a family reunion, with four named organizer roles and four expanded ensemble roles.
- Twelve: twelve organizers working on the town's annual lantern parade, with diverse fixed organizers and distinct expandable committee roles.

**Implementation:** ensure exactly `N` participant assignments and a believable shared relationship context for each N from 2 to 12, not an impossible “two parents” premise with ten unexplained actors. Allow users to explicitly select a subgroup of 2–4 scene performers inside a larger active session.

## Content and product safety

- Clean general-audience mode is always the default.
- A mildly suggestive P2 format is a separate 18+ opt-in choice with a self-declared adult confirmation; avoid explicit sexual content, slurs, coercion, exploitation, humiliation or jokes about real people.
- In class mode, clean-only overrides previously saved mature preferences and cannot be bypassed from favorites/history.
- “Gibberish Translator” means entirely made-up playful syllables; it must not encourage imitating a real language's accent for a joke.
- “Worst advice” uses *harmless* everyday topics, never actual medicine, dangerous behavior, trauma, crisis or exploitation.
- Physical activities include chair/seated options and never require touch.
- Private roles are not copied or displayed in external share sheets by default.

## Instructions formatting

For each game:
- Label/title and short, enticing promise.
- Time, compatible players and requirements.
- **Do this:** two or three short action-focused instructions.
- **Example:** original, concrete one-scene example.
- **Why it works:** skill focus in plain English.
- **One useful tip:** not vague encouragement.
- **Reflection (optional):** short, nonjudgmental question.
- **Variants:** teacher-led, seated, open mic, battle, or take turns where appropriate.

## Test of useful coaching

The app should help someone understand the difference between: accepting an idea vs agreeing to everything in life; a relationship vs a funny voice; heightening a pattern vs just shouting louder; performing a joke vs building an emotionally believable scene; a timed cue constraint vs how all improv scenes work.

## Legal and attribution

References for research and developer notes: https://improvencyclopedia.org/games/ and https://www.hooplaimpro.com/resource/short-form-show-games . Use original authored wording. Do not claim association with Picolo, Get Closer, Whose Line Is It Anyway?, established theaters, or teachers.


## Appendix F — release runbook

**Write to `docs/RELEASE_RUNBOOK.md`:**

# OFF SCRIPT V1 — BUILD / TESTFLIGHT / LAUNCH RUNBOOK

## Build assumptions

iOS + fully playable web React Native / Expo from one shared codebase. No accounts, backend, runtime AI calls, camera, microphone, location, contacts or mandatory connectivity. Catalog/content bundled in-app; native SQLite persists user-specific state; an IndexedDB-compatible web adapter persists real sessions, prompts and favorites in-browser. Working display name OFF SCRIPT pending a trademark/name review.

## Required developer steps

1. Create/inspect standalone repository for Off Script, scaffold supported Expo SDK and Expo Router.
2. Import canonical Zod contracts, SQLite migration and all 39 game records.
3. Implement full offline game engine, prompt generation, content banks, modes and UX from master PRD.
4. Run `npm install`, lint, TypeScript validation, catalog/content validator, unit/integration tests, Playwright web E2E, `npx expo-doctor`, browser production export, and iOS simulator tests where supported.
5. Test on physical iPhone, including Ring/Silent behavior, VoiceOver, Dynamic Type, airplane mode, resume/background, app reinstall and local storage persistence.
6. Create original icon/splash/screenshots and developer-facing release metadata; do not assume rights to any existing branded imagery.
7. Ensure customer-facing legal URLs/privacy notice/support info are real owner-provided values and App Store privacy/age rating disclosures match actual app behavior.
8. Confirm Off Script branding clearance before public submission. Existing similar brands are a known risk; treat name as replaceable until cleared.
9. Configure bundle identifier from owner's Apple team; authenticate EAS CLI only when owner supplies access. Never commit credentials, API keys or device signing assets.
10. EAS build then EAS Submit to TestFlight. TestFlight upload is not the same as App Store approval/release.
11. Review final screenshots, age rating, metadata and TestFlight tester results, then request owner's approval before final App Store review submission.

## Browser-first preview steps

The owner wants to play the app in a browser during development. Make the browser version functional as soon as Surprise Me works. Verify in-browser persistence, all 39 games, Studio, private reveals, cue fallbacks and responsiveness. See `docs/WEB_PREVIEW.md`.

```bash
npm run web            # local Expo browser server
npm run build:web      # production browser bundle
npm run test:e2e:web   # Playwright browser run
# Optional AFTER authorized Expo login/hosting setup, and successful export:
npx eas-cli@latest deploy  # obtain an actual preview URL from the command output
```

If preview hosting cannot be authenticated, do not claim a shareable link. Distinguish local preview, deployable web build and verified remote hosted URL. The owner should not need TestFlight or an iOS device to review early playable builds.

## Example owner-authorized Expo path

```bash
npm install
npm run lint
npm run typecheck
npm run content:validate
npm run test
npx expo-doctor
npx eas-cli@latest build --platform ios --profile preview
# Once signing & Apple account are configured:
npx eas-cli@latest build --platform ios --profile production
npx eas-cli@latest submit --platform ios
```

Refer to current official documentation: https://docs.expo.dev/submit/ios/ and https://developer.apple.com/app-store/review/guidelines/ . Compatible package versions and build profiles must be validated at implementation time.

## Blockers that must be reported, never hidden

- Cannot reach real device or simulator; distinguish tests executed from merely planned.
- Incomplete content quotas or game engine mechanics.
- App Store naming conflict or 18+ content policy concerns.
- Missing Apple signing/team/EAS credentials.
- Unverified offline or silent-mode behavior.
- Broken web export, missing browser persistency, or absent real web Playwright verification.
- Hosting/auth unavailable for an externally reachable browser preview URL.
- Missing owner-approved support or privacy-policy URL.


## Appendix G — web preview contract

**Write to `docs/WEB_PREVIEW.md`:**

# OFF SCRIPT V1 — WEB PREVIEW AND DEPLOYMENT CONTRACT

## Goal

The app owner must be able to view and PLAY Off Script in a real browser throughout Codex development. Web is a functional first-class target alongside iOS, not a static design preview. Keep one repository, one game engine, one content catalog, and shared UI components.

## Local preview and build

From the app project root, after dependencies are installed:

```bash
npm run web           # configured as: expo start --web
npm run build:web     # configured as: expo export --platform web
npm run test:e2e:web  # Playwright, ideally against built output
```

`npm run web` should log a local URL. Local addresses such as `localhost` are reachable only on the machine/environment hosting that server. Do not imply that a Codex Cloud local address is public or accessible from the owner's phone. To provide the owner a link across devices, publish a real hosted preview when authorized and credentials/integration are available.

## Deployment options

1. Prefer Expo EAS Hosting preview if the owner is signed into a compatible Expo account; follow current official docs for web export and `eas deploy`. Only report a URL after a successful deployment. Get user authorization before production deployment or paid resource creation.
2. Alternatively publish the exported static site (`dist/`) to Netlify or another static host with correct route fallback/headers. Verify the deployed URL by visiting it and playing a round in a real browser.
3. If remote deployment isn't available, document how to run the web preview from a reachable machine and provide complete build logs/screenshots. Do not pretend the preview was deployed.

## Storage/platform specifics

- Native: Expo SQLite and canonical `database/001_init.sql` migration.
- Web: IndexedDB adapter is preferred, behind the same typed repositories, with versioned browser migrations, clear-storage, and round-trip data tests. `expo-sqlite` on web is an acceptable alternative only after proving its WASM/SharedArrayBuffer/cross-origin headers work on the selected deployed host.
- Bundled game content is platform-shared. No remote accounts, user data service or runtime generative AI.
- Browser storage can be limited or removed by the user/browser and may not persist in private mode; present accurate UI copy when persistent storage is unavailable. Never silently claim data was saved.

## Web acceptance walkthrough

- Fresh mobile viewport: load Home; tap Surprise Me; select 2; play, finish, skip, get another round.
- Six-person flow: fair performers, compatible Game Show activity, timers, visual/manual cues, no third operator required in 2-person flow.
- Open direct game from Explore and return via browser Back/Forward without losing live state.
- Prompt Studio: 10 toggles, independent/coherent, per-category lock and reroll, save and resume, launch Scene Lab.
- Save a favorite and prompt; refresh the page, reopen browser profile, confirm actual persistence.
- Private role reveal: respect pass/cover, hide secret on document visibility changes, no leak via browser tab or session recap.
- Test clean-content filter, disable audio permissions, repeat gameplay. Keyboard navigation, focus and large-text zoom usable.
- Test narrow phone/mobile landscape/tablet/desktop viewports. Capture representative screenshots and report their locations.
- Export to production web bundle, serve it locally with the right routing behavior, and run Playwright on the production bundle when feasible. No fatal console errors, missing assets or dead CTAs.

## Final Codex report must include

- How to open the currently working web app (actual reachable URL if deployed, otherwise tested local command and environment limitation).
- Whether web was built, exported, browser-tested and actually deployed, separately. No unsupported success claims.
- Screenshots for phone-width Home, live game, Prompt Studio and desktop play layout.
- Cross-platform feature-parity exceptions, if any, with tracked blockers and owner actions.
- iOS simulator/device/TestFlight status independently; a working web version does not substitute for testing native features.

Official docs: https://docs.expo.dev/workflow/web/ , https://docs.expo.dev/deploy/web/ , https://docs.expo.dev/versions/latest/sdk/sqlite/ . Verify command/version compatibility during implementation.

