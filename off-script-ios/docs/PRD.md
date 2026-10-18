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
