# Startup performance

The original web export contained about 4.2 MiB of JavaScript. The shared UI imported Lucide's root barrel, which made Metro retain the complete icon library. Direct imports through Lucide's supported `icons/*` exports keep only the icons used by the app. The optimized export contains about 2.2 MiB of JavaScript, without changing the framework or game engine.

Web fonts now use WOFF2: **97,112 bytes instead of 241,460 bytes** (60% smaller). Native builds keep their original TTF files. The HTML preloads web fonts so downloading can overlap JavaScript; Home and game setup no longer wait for font completion. The outlined logo remains stable throughout. System fallbacks preserve usable text until the branded fonts arrive.

A small, accessible HTML status screen appears before the application bundle starts. Offline registration waits until two seconds after the page's load event, giving startup network activity priority. Complete offline caching remains available; existing offline reload/play coverage is retained.

Verification: production web export, TypeScript, lint, unit/integration suite and browser suite, including a new regression that holds all web font requests while starting a game. Actual user speed still depends on the connection and device.

## Reproduce measurements

`scripts/measure-startup.mjs` runs three fresh browser contexts at 390×744, with 100ms simulated latency, 2Mbps download and 4× CPU slowdown. It records time to the usable Home action, navigation timing, first paint and encoded resource sizes. Default target is the public site. Set `PERF_PUBLIC=1` in this environment to use its configured outbound proxy. Use `PERF_URL` and `PERF_OUTPUT` to override the URL and output JSON path. Results are written outside the checkout by default.

Compare medians under identical conditions; do not equate exported JavaScript size with compressed network traffic. The pre-change public baseline's median usable Home was 7.0 seconds in this simulated mobile profile.

The committed WOFF2 assets can be regenerated with fonttools and Brotli: open each local TTF with `fontTools.ttLib.TTFont`, set `font.flavor = "woff2"`, then save alongside the TTF. Preserve the existing font licenses.
