# OFF SCRIPT — Complete Codex V1 Build Package

**Goal:** Create a polished offline-first iOS + browser improv party game and instructor prompt tool from scratch, with 39 distinct playable games, full Prompt Studio, Surprise Me, real coaching and complete local persistence.

## Fastest way to hand this to Codex

**Option A — one single prompt:** Paste or attach `OFF_SCRIPT_ALL_IN_ONE_CODEX_PROMPT.md`. This contains the full 8,000+-word PRD, its TypeScript domain schemas, local SQLite migration, complete authored 39-game catalog and QA guidance in one file.

**Option B — easiest for a coding repo:** Upload the whole ZIP to a fresh Off Script project. Paste the beginning of `CODEX_MASTER_PROMPT.md` into Codex and tell it to use all included files as canonical design and data contracts. The master prompt itself tells Codex how to proceed end to end.

## File index

- `OFF_SCRIPT_ALL_IN_ONE_CODEX_PROMPT.md` — truly self-contained prompt and PRD with attached technical specifications inline.
- `CODEX_MASTER_PROMPT.md` — readable main build prompt and 14-section product + engineering PRD.
- `contracts/domain.schemas.ts` — runnable TypeScript/Zod validation schemas for activities, prompts, player/session/round state, teams, votes and preferences.
- `database/001_init.sql` — actual versioned SQLite schema for offline state.
- `content/activities.v1.json` — all **39** activities, each with original rules, example, coaching, modes, player bounds and mechanics.
- `docs/QA_MATRIX.md` — 39-game acceptance checklist.
- `docs/CONTENT_GUIDELINES.md` — editorial rules and required prompt-bank counts.
- `docs/RELEASE_RUNBOOK.md` — iOS/TestFlight + browser preview/release steps and outstanding owner actions.
- `docs/WEB_PREVIEW.md` — mandatory runnable browser preview, persistence, testing and deployment acceptance contract.

## What this package is not

It is a **Codex implementation package**, not a generated runnable app. The 600 Prompt Studio entries and specialized objective/quirk/topic banks are explicit deliverables to be created by Codex, quality-checked and validated before claiming v1 complete. The activity catalog is already fully enumerated. No backend, login, API keys or Apple credentials are included. OFF SCRIPT is a working name pending brand clearance.

## Suggested first message inside a fresh Codex task

“Implement OFF SCRIPT version 1.0.0 end-to-end using `OFF_SCRIPT_ALL_IN_ONE_CODEX_PROMPT.md` as the product contract. Build the actual working React Native/Expo project for both iOS and interactive web preview, not just mockups or an implementation plan. Let me access and play a real browser preview as soon as available; implement working browser persistence and Playwright testing. Validate the 39-game catalog and all schemas, complete all phases, run tests, and return exact completed work and honest blockers. Work inside a standalone Off Script repository only.”
