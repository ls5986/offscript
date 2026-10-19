# Off Script After Hours

A separate, playful **Cheeky + optional 18+** feature promo. Suggested audience:
adults who want improv with friends, not explicit sexual content.

## Deliverables

- [Open the After Hours gallery](after-hours.html).
- [Landscape MP4: 1920 x 1080](exports/after-hours/off-script-after-hours-horizontal-30s.mp4).
- [Vertical MP4: 1080 x 1920](exports/after-hours/off-script-after-hours-vertical-30s.mp4).
- Portable ZIP: `Off-Script-After-Hours-Media.zip` alongside the gallery source.
- [Timed VTT captions](exports/after-hours/tutorial.vtt) and [SRT captions](exports/after-hours/tutorial.srt).
- Posters and scene contact sheets in `exports/after-hours/`.
- [Encoded-media verification](exports/after-hours/verification.json).

Both cuts are **30.00 seconds / 900 frames / 30 fps**, silent, caption-first
H.264 MP4s with standard BT.709 video color and no alpha. The original all-ages
video exports, screenshot designs and launch ZIP are unchanged.

**These are website/social promos, not Apple App Previews.** Do not use them
in the App Store preview slot. Adult-themed social and advertising placements
have their own rules; check the platform and intended audience before posting.
The files and gallery are local deliverables, not a public deployment.

## Story and real functionality

| Time | Feature / story beat |
| --- | --- |
| 0-3s | After Hours hook: Less polite. More plot twists. |
| 3-7s | Library filtered to Cheeky, with a real recipe's Use button |
| 7-10s | Exact recipe: Staging a dramatic exit in a wedding venue |
| 10-14s | The real 18+ consent dialog and its keep-it-clean alternative |
| 14-18s | Exact adult recipe: Rehearsing an overconfident seduction on a rooftop |
| 18-22s | Studio's Clean/Cheeky/18+ and selected-ingredient controls |
| 22-25s | Locked Location, actual Save prompt and Act out controls |
| 25-27s | Saved > Prompts, showing the exact saved adult prompt |
| 27-30s | Bring friends. Leave the script. Fictional prompts, real boundaries. |

The content selections and saves were made through actual native UI
interactions on the existing task-owned iPhone 18 Pro Max simulator, using
the same current Release app used for the original marketing captures.
No production-code backdoor, browser-emulated native screen, real-player data,
or bypassed consent was used. This is an animated sequence of native stills,
not a continuous recording or a real human usability study.

`captures/after-hours/` contains eight original native screenshots. The
adult recipe is the bundled **Confidence is not the problem**; the Cheeky
recipe is **Not making a scene**. Capturing consent changed only the demo
simulator's local preferences, not an owner's device or the app defaults.
The opt-in is a content preference, not identity-based age verification.
There is no nudity, depicted sexual activity, touching, or disclosure request.

## Edit and reproduce

Edit `after-hours-story.js` for copy, timing and capture selection. The
shared `artwork.html` has a separate After Hours style with a persistent
adult-audience badge. Open:

```text
artwork.html?mode=tutorial&format=vertical&campaign=after-hours
artwork.html?mode=tutorial&format=horizontal&campaign=after-hours
```

Use `await renderMedia(14.5)` in the browser console to inspect an exact time.
From the app root:

```bash
node --test marketing/media.test.mjs
FFMPEG=/absolute/path/to/ffmpeg node marketing/render.mjs --video --after-hours
FFMPEG=/absolute/path/to/ffmpeg node marketing/verify.mjs --after-hours
```

The campaign flag writes **only** to `exports/after-hours/`. The existing
all-ages command remains `node marketing/render.mjs --video`. No new app
dependency or live server is required. FFmpeg is an external render tool,
and Playwright/Chromium comes from the existing development environment.

The native test source is `capture-tools/AfterHoursCapture.swift`. Generate
its standalone UI-test project outside the app with the existing Ruby
`xcodeproj` gem:

```bash
ruby marketing/capture-tools/generate-afterhours-capture.rb /absolute/output/directory
```

Run it only against a dedicated demo simulator with a current native
Off Script build installed; do not reset an owner's saved data. The test
expects the initial adult-consent preference to be off. Export the named
attachments with `xcrun xcresulttool export attachments`.

The portable ZIP includes the gallery, editable shared sources, native
captures, required brand/font assets and their license files. After extracting,
open `Off-Script-After-Hours/marketing/after-hours.html`. Re-rendering requires
the development dependencies described above.
