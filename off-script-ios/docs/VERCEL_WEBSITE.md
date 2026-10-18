# One Off Script site: landing, browser play and Apple policy pages

## What this builds

| URL | Purpose |
| --- | --- |
| `/` | Fast static landing page; no app JavaScript required |
| `/play` | Full browser app home |
| `/library` | Searchable individual prompts and ready-made ingredient recipes |
| `/studio`, `/party`, `/games`, `/saved`, `/settings` | Direct browser-app routes |
| `/privacy` | Static privacy policy for web and iOS |
| `/support` | Static help, optional public contact email, troubleshooting and install guidance |

The existing Expo game engine remains shared with iOS. Native home stays `/`;
browser home links, exits and reloads use `/play`, not the marketing page.
This is **in-person, shared-device play**, not online multiplayer or synchronized
rooms. Android users do not need an APK or an Apple account to use the website.

## Vercel setup

Import the repository into Vercel and configure:

- **Root Directory:** `off-script-ios` (relative to the `offscript` Git root).
- **Framework Preset:** Other.
- **Node.js:** 24.x.
- **Install Command:** `npm ci`.
- **Build Command:** `npm run build:web`.
- **Output Directory:** `dist`.

`vercel.json` already sets the commands/output and explicit app/legal rewrites.
Do not replace them with a universal `/(.*) -> /index.html` rewrite: that would
serve the landing page for app routes and could serve HTML as missing JS files.
Actual static files remain static; unknown URLs/assets receive 404.
The service worker and manifest use revalidation-friendly headers.

No database server, serverless function, runtime AI service, Vercel Analytics,
new dependency, Expo account or paid Expo plan is required.
Hosting/account costs and plan suitability are the owner's decisions.

**Important:** a GitHub-connected Vercel project must use a branch containing
the committed `off-script-ios` source, not the repository's original ZIP-only
baseline. If the app is published on a feature branch, select that branch or
merge it through the normal Git workflow before relying on a default-branch
deployment. A Git push does not itself create or configure a Vercel project.
Alternatively, deploy the prepared app directory using Vercel's authorized
CLI workflow. Neither route should change the older public deployment unless
that change is explicitly requested.
`.vercelignore` excludes native output, local environment files and test caches
from a local CLI deployment. Never upload Apple signing assets or credentials.

## Public build settings

Optional Vercel environment variables (or `.env.local` for local builds):

```dotenv
OFFSCRIPT_SITE_URL=https://YOUR-ACTUAL-DOMAIN
OFFSCRIPT_SUPPORT_EMAIL=YOUR-APPROVED-PUBLIC-SUPPORT-EMAIL
```

Those strings describe the input shape, not ready-to-use release values.
Set actual values or leave them unset; invalid values fail the website build.
The site URL must be an HTTPS origin with no subdirectory, query or credentials.
If it is omitted on Vercel, `VERCEL_PROJECT_PRODUCTION_URL` supplies the
production hostname when available. With neither value, canonical URLs are
omitted rather than pointing to the old Sites deployment or an invented host.
Set `OFFSCRIPT_SITE_URL` explicitly when using a custom domain.

The support email is intentionally **published**, not a secret. Without one,
the support pages still provide the existing public GitHub issue tracker,
which requires a GitHub account to post. The website can function that way,
but **the Apple support-contact requirement is not complete**: add an
owner-approved direct public contact before submitting to App Review.
Never substitute a private Apple account email/address without approval.

Only those public values are interpolated into the pages; unrelated server
environment variables are not dumped into HTML. Review the final policy and
contact language for the owner's actual practices before publishing.
The website is prepared, not automatically deployed or legally certified.

## After publishing on the chosen domain

1. Verify `/`, `/privacy`, `/support`, `/play`, a direct game route and reload.
2. Confirm both policy/support pages are public without a Vercel login.
   Apple must be able to reach them; check Deployment Protection settings.
3. Review the policy and make sure the public contact email is correct.
4. Use the actual `/privacy` and `/support` HTTPS URLs in App Store Connect
   and `OFFSCRIPT_PRIVACY_URL` / `OFFSCRIPT_SUPPORT_URL` for the next native
   build. Website-only variables do not automatically configure the native app.
5. Rebuild the native binary to embed those links. An existing TestFlight
   binary does not update when website settings change.

The policy distinguishes local gameplay saves, browser caching, user-chosen
sharing, hosting request metadata, and Apple's automatic TestFlight diagnostics.
There is no claim that Vercel receives no network requests or that TestFlight
diagnostics stay on the device.

## Android/browser installation, offline and saved data

On modern Android Chrome, open `/play` and use **Install app** or **Add to Home
screen**, if offered. On iPhone Safari, use **Share > Add to Home Screen**.
This installs a web app, not an Android APK or the native iPhone app.
The manifest starts at `/play` and uses standalone display.

The first visit needs a connection. Open the game and allow its own app/font/
content files to finish caching before relying on offline mode. After that,
the service worker can serve the game, landing and policy/help pages offline
while the browser retains the cache. Browser install UI, storage limits,
background behavior, speech and haptics differ by device; visible/manual
controls remain available. No claim of universal device support is made.

Names, sessions, presets, favorites and saved prompts stay in this browser's
IndexedDB. There is no account-based sync with iOS or other players.
**A new Vercel domain has separate browser storage from the older website**:
the old site's saves do not automatically move. Existing saves on the same
origin keep the same IndexedDB database/schema; this work does not reset them.
Private browsing, clearing site data or browser eviction can remove saves/cache.
Export local feedback is not a backup of all gameplay.

## Source and local validation

- `release-pages/`: landing/privacy/support HTML and shared responsive CSS.
- `scripts/offline.mjs`: builds public pages, metadata and content-hashed offline worker.
- `scripts/serve.mjs`: serves `dist` using the same rewrites/headers as `vercel.json`.
- `app/play.tsx`: browser app entry; existing native entry is unchanged.

```bash
export PATH=/opt/homebrew/opt/node@24/bin:$PATH
npm run build:web
node scripts/serve.mjs
# http://localhost:4173/       landing
# http://localhost:4173/play   game
npm run test:e2e:web
```

`npm run web` remains the app development preview; its `/` is still the native/
app home. The **production export server**, not Metro, verifies the full public
site and service worker. There is no new native dependency or native gameplay
change to force an iPhone update just for browser routing.

## References

- [Vercel project configuration](https://vercel.com/docs/project-configuration)
- [Vercel Privacy Notice](https://vercel.com/legal/privacy-notice)
- [Apple support URL requirements](https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/)

## Executed verification: October 18, 2026

- **341 unit tests across 38 files**, TypeScript, lint and full content
  validation passed.
- Full production export and **96 browser tests** passed, including all
  existing gameplay/persistence/age-gating flows and the new website routes.
- Pixel 7-sized Chromium tested landing-to-play, saved prompts, an offline
  party, offline landing/privacy/support navigation, app Home and reload.
  This is mobile browser emulation, not physical Android certification.
- Public-page normal/large text contrast, keyboard skip links and horizontal
  fit passed at **320px and 1440px in light and dark**. All internal links
  returned 200. The static landing requires no app JavaScript.
- Actual manifest MIME/start URL/scope, worker MIME/cache headers and missing
  JavaScript-asset 404 behavior passed. The local server consumes the deployed
  rewrite/header configuration rather than relying on a different generic SPA
  fallback.
- Each field used in `vercel.json` validated against its published Vercel
  schema definition. This is configuration validation, not an actual hosted
  Vercel deployment.
- The native iOS JavaScript/Hermes export passed after the platform-aware
  navigation change. Native home routing and storage schemas are unchanged.
- The full website preview at `http://localhost:8088/` and original app
  development preview at `http://localhost:8087/` both returned HTTP 200.

No Vercel account/project was created, no source was committed/pushed, no
public site was deployed, and no Apple submission or native archive was
modified by this website work. Owner policy/contact review and real public
URL verification remain deployment/release gates.
