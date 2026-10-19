# Off Script marketing media

## Separate Cheeky / 18+ campaign

The [After Hours gallery](after-hours.html) and [its source/usage guide](AFTER_HOURS.md)
contain the separate adults-only website/social cut. Its exports live in
`exports/after-hours/`; the all-ages screenshot/video files and launch ZIP
below are unchanged. Do not mix the adult campaign into App Store previews.

## What to use

- `exports/iphone/`: six ordered **1320 x 2868** App Store screenshot designs.
- `exports/ipad/`: six ordered **2064 x 2752** App Store screenshot designs.
- `exports/iphone-contact-sheet.png` and `ipad-contact-sheet.png`: quick overview.
- `exports/off-script-tutorial-horizontal-30s.mp4`: **1920 x 1080** website/YouTube tutorial.
- `exports/off-script-tutorial-vertical-30s.mp4`: **1080 x 1920** social/story tutorial.
- `exports/tutorial-horizontal-poster.png` and `tutorial-vertical-poster.png`: video covers.
- `exports/tutorial.srt` and `tutorial.vtt`: timed captions/transcript. The essential instructions also appear in the video itself.
- `exports/manifest.json` and `verification.json`: dimensions, provenance, runtime, decoding checks and checksums.
- `captures/iphone/` and `captures/ipad/`: original, unretouched native simulator screenshots.

Open `index.html` in a browser for the complete local gallery and video players.
`Off-Script-Launch-Media.zip` packages the gallery, final media, native captures, editable sources, and the required brand/font assets and font licenses. After unzipping, open `Off-Script-Launch-Media/marketing/index.html`. Re-rendering still requires the development tools described below.

The videos are silent, caption-first **animated tutorials made from actual native app stills**, not screen recordings of a continuous session. There is no third-party music, stock footage, account information, real participant data, or invented app functionality.

## App Store upload

Use the six PNGs in each device folder, in filename order. The iPhone set uses Apple's accepted **large Dynamic Island display** size (1320 x 2868); the iPad set uses the **13-inch display** size (2064 x 2752). App Store Connect can scale these to supported smaller devices. Designs use opaque, 8-bit RGB PNGs.

**Do not upload the tutorial MP4s as App Store App Previews.** They are branded, frame-animated website/social tutorials, not App Preview deliverables. Apple previews have separate device-specific accepted video resolutions and in-app-footage/content requirements. A preview video is optional; these screenshot sets do not depend on one.

The artwork depicts current source, including the compact Library and first-use
improvements now included in uploaded TestFlight beta **1.3.0 (4)**. The older
build 3 does not match. Final App Store release still needs approved live
privacy/support links and owner metadata; verify final wording and UI against
the eventual submitted binary. No upload, public deployment, or App Review
submission is performed by these media scripts.

## Editing

`story.js` controls the screenshot headlines, colors, capture selection and the 30-second storyboard. `artwork.html` is the editable HTML/CSS composition; there are no external fonts, assets or network requests. It uses the existing original Off Script mark, Fraunces and DM Sans. Their license texts remain in `assets/fonts/`.

Open the HTML in a browser to preview a design:

```text
artwork.html?format=phone&shot=0
artwork.html?format=tablet&shot=4
artwork.html?mode=tutorial&format=horizontal
artwork.html?mode=tutorial&format=vertical
```

The tutorial preview starts at time zero; call `await renderMedia(18.5)` in the browser console to preview any time between 0 and 30 seconds. Exported videos contain 900 frames at 30 fps.

## Reproducing the exports

From the app root, with the existing Playwright/Chromium installation:

```bash
node marketing/render.mjs
FFMPEG=/absolute/path/to/ffmpeg node marketing/render.mjs --video
FFMPEG=/absolute/path/to/ffmpeg node marketing/verify.mjs
```

FFmpeg is an external render tool, **not an app runtime dependency**. The initial render used the local `imageio-ffmpeg` 0.6.0 macOS ARM64 package's executable. Any compatible FFmpeg with the `libx264` encoder can reproduce the MP4s. No FFmpeg binary is bundled into the app or committed here.

The renderer uses the project's bundled fonts and original capture PNGs, checks layout boundaries/font loading, creates contact sheets, and streams deterministic browser-rendered frames into H.264 MP4s. It does not require a live app server or affect saved app data. The verification command checks every final PNG's exact dimensions and lack of alpha, then fully decodes both videos to confirm H.264, yuv420p, 30 fps and exactly 30.00 seconds.

## Native capture provenance

Captured from a freshly compiled **Release** simulator build of current source, using the app's existing native workspace and real XCTest UI interactions. Devices: iPhone 18 Pro Max and iPad Pro 13-inch (M5), iOS 27. The app's UI was not replaced, browser-emulated, or modified for marketing.

All shown gameplay uses the default Clean level. Prompt Studio examples are the actual bundled recipes **Rivals on the rooftop**, **Two siblings, one apology**, and **Neighbors in the kitchen**. Saved prompts were created with the real Save prompt action. Player labels are anonymous demo defaults. The status bar is normalized to 9:41 with a full battery via Simulator.

`capture-tools/MediaCapture.swift` and `generate-media-capture.rb` preserve the task's native navigation/capture workflow. They run in a separate, local-only XCTest project; they are not product code. Generate the project with the `xcodeproj` Ruby gem, install a current simulator build on fresh capture simulators, then run the UI test and export the named screenshot attachments with `xcrun xcresulttool export attachments`. Do not reset an owner's saved app data to reproduce marketing.

## Reference rules

- [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/)
- [Apple App Preview guidance](https://developer.apple.com/app-store/app-previews/)
- [Apple App Preview technical specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications/)

Only Clean, all-ages material appears in the original screenshot/video set
described above. The separate After Hours campaign includes non-graphic,
opt-in higher-rated examples. Neither set replaces the owner's obligation
to disclose all accessible app content accurately in the App Store
age-rating questionnaire.
