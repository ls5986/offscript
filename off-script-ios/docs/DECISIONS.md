# Implementation decisions

1. Use current compatible Expo SDK 58 rather than an old template. Keep exact dependency resolution in the lockfile. Expo Doctor passed 20/20 checks in this workspace.
2. Use IndexedDB on web instead of SQLite WASM and COOP/COEP. Keep native SQLite behind Metro platform resolution. Normalized native tables mirror a validated aggregate, retaining engine-specific restore fields without changing canonical SQL.
3. Default to a static single-page export. Add full local precaching after export, with a first-load network requirement and visible save failures.
4. Adapt Open Scene's maxPerformers from 4 to 12 in both copies of the canonical catalog. Studio can author ensembles of 8–12 and must hand them off intact; the shared engine casts all Studio seats for this explicit variant. Ordinary surprise Open Scene remains a featured pair.
5. Add `excludeMovement` with default false to both copies of SessionSettingsSchema. Seated alternatives exist for movement games, Freeze & Replace, Sound Effects and Party Quirks; a separate strict exclusion setting removes non-seated catalog entries.
6. Keep original examples/teaching catalog. Add authored word plurals and genuinely separate profession/dilemma/location subjects for the corresponding punchline formats.
7. No third host is needed for two-person games. Visible/manual controls always accompany optional speech; silent-mode audio is not promised.
8. This Linux workspace cannot run an Apple simulator, validate device accessibility/hardware, sign an IPA, or upload TestFlight without owner Apple/EAS setup. A successful iOS Hermes export is reported separately.
9. The Sites connector is available, but its filesystem helper bundle and referenced preview files are absent from this execution image. Use the native Sites source/deployment contract with a small local Git-and-archive helper: credentials only on hidden stdin and ephemeral Git environment, never files or output. Preserve the registered Site ID and exact pushed commit/archive.
10. Retain the supplied master prompt and original build-package documentation. Keep any remaining release blockers explicit instead of treating web QA as App Store readiness.
