# Web preview

For the unified Vercel landing, Android-capable browser app and public
privacy/support routes, see [Vercel website setup](VERCEL_WEBSITE.md).
The production root is now the landing page; `/play` opens the browser app.
Metro's development root remains the app home.

```bash
npm ci
npm run web
# Expo logs a local URL.
npm run build:web
node scripts/serve.mjs
# Production export: http://localhost:4173
npm run test:e2e:web
```

This workspace's local port is an internal QA server; it is not a public URL.
The production export is `dist/`. Use the explicit public/app route rules in
`vercel.json` (also emitted as `_redirects` for compatible hosts), not a blanket
SPA rewrite to `index.html`. The game shell is `app.html`; `index.html` is the
static landing. Set HTTPS for service worker and clipboard support.
No database server or runtime environment secret is needed.

Playwright tests the actual production export with system Chromium and produces `docs/screenshots/phone-home.png`, `phone-live-game.png`, `phone-studio.png`, `desktop-home.png`, and `desktop-play.png`. Tests cover actual 39-game start/finish/replay, 2/6/8-person flows, Studio locks/toggles/handoff, reload persistence, hidden-tab privacy, content gating, paused cues, viewport widths 320/390/768/1440, keyboard activation and offline reload/play. Browser audio is optional; visible controls remain usable without speech.

Web persistence is actual IndexedDB. There is no transient fallback described as a save. Storage/quota/private-mode errors are visible. Clearing local data removes preferences, names, sessions, scores, favorites, presets and saved prompts. Cache holds only bundled app assets, not a cloud backup of personal data. A first visit needs connectivity; subsequent offline loading depends on precache completion and browser cache availability.

On this restricted execution image, local commands used `EXPO_NO_TELEMETRY=1`, `__UNSAFE_EXPO_HOME_DIRECTORY=/tmp/off-script-expo`, and `NODE_USE_ENV_PROXY=1` for tool network diagnostics. Normal owner machines do not require those workspace-specific overrides. Keep TLS verification enabled. Browser QA uses a network-enabled execution sandbox so loopback ports and Chromium processes can run.
