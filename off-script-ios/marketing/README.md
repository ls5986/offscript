# Off Script marketing media

## App Store header

Use the [3840 x 1646 header PNG](exports/headers/off-script-header-3840x1646.png)
in **Header and Search Results > Header**. The
[header guide](HEADER.md) includes the alternative universal size, official
template-safe geometry, editable source and the standalone header ZIP.
This is separate from screenshots; upload one full-size header, not a preview.

## Separate Cheeky / 18+ campaign

The [After Hours gallery](after-hours.html) and [its source/usage guide](AFTER_HOURS.md)
contain the separate adults-only website/social cut. Its exports live in
`exports/after-hours/`; the all-ages screenshot/video files and launch ZIP
below are unchanged. Do not mix the adult campaign into App Store previews.

## What to use

- **`exports/iphone-medium/`: six ordered 1206 x 2622 PNGs for iPhone with Dynamic Island (medium display)**, matching the slot in the owner's upload-error screenshot.
- `Off-Script-iPhone-Medium-1206x2622.zip`: the corrected medium-slot PNGs, instructions and size-verification records. Extract it before uploading; upload only the six numbered PNGs.
- `exports/iphone/`: six ordered **1320 x 2868** designs for iPhone with Dynamic Island (large display), not the medium slot.
- `exports/ipad/`: six ordered **2064 x 2752** App Store screenshot designs.
- `exports/iphone-contact-sheet.png` and `ipad-contact-sheet.png`: quick overview.
- `exports/iphone-medium-contact-sheet.png`: overview of all six corrected medium-slot designs; this is not an upload screenshot.
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

Use six numbered PNGs from the folder matching the selected upload tab:

| App Store Connect slot | Folder | PNG size |
| --- | --- | --- |
| iPhone with Dynamic Island (medium display) | `exports/iphone-medium/` | **1206 x 2622** |
| iPhone with Dynamic Island (large display) | `exports/iphone/` | **1320 x 2868** |
| iPad 13-inch display | `exports/ipad/` | **2064 x 2752** |

The reported "File dimensions are invalid" error came from putting the
large-iPhone set in the medium-iPhone slot. Automatic scaling for smaller
devices does not mean every upload slot accepts another slot's PNG size.
Remove the rejected attempts and upload the corrected medium set to the
medium tab. Leave iPad images in their separate tab. All final designs use
opaque, 8-bit RGB PNGs.

The medium set is re-rendered at the accepted canvas dimensions from the
editable artwork, with uniform scaling and preserved native screen aspect
ratios. It uses the existing genuine iPhone 18 Pro Max captures; it does not
claim to be a new capture on a different physical device. The original
large-iPhone/iPad/video exports and their historical ZIP remain unchanged.

**Do not upload the tutorial MP4s as App Store App Previews.** They are branded, frame-animated website/social tutorials, not App Preview deliverables. Apple previews have separate device-specific accepted video resolutions and in-app-footage/content requirements. A preview video is optional; these screenshot sets do not depend on one.

The artwork depicts the compact Library and first-use improvements retained
in uploaded beta **1.3.0 (6)**. The older build 3 does not match. Build 6 also
includes the live Settings privacy/support links and Change game repair.
Owner contact/listing declarations remain separate release requirements.
No upload, public deployment, or App Review submission is performed by these
media scripts.

## Editing

`story.js` controls the screenshot headlines, colors, capture selection and the 30-second storyboard. `artwork.html` is the editable HTML/CSS composition; there are no external fonts, assets or network requests. It uses the existing original Off Script mark, Fraunces and DM Sans. Their license texts remain in `assets/fonts/`.

Open the HTML in a browser to preview a design:

```text
artwork.html?format=phone&shot=0
artwork.html?format=phone-medium&shot=0
artwork.html?format=tablet&shot=4
artwork.html?mode=tutorial&format=horizontal
artwork.html?mode=tutorial&format=vertical
```

The tutorial preview starts at time zero; call `await renderMedia(18.5)` in the browser console to preview any time between 0 and 30 seconds. Exported videos contain 900 frames at 30 fps.

## Reproducing the exports

From the app root, with the existing Playwright/Chromium installation:

```bash
node marketing/render.mjs
node marketing/render.mjs --iphone-medium
node marketing/verify.mjs --iphone-medium
FFMPEG=/absolute/path/to/ffmpeg node marketing/render.mjs --video
FFMPEG=/absolute/path/to/ffmpeg node marketing/verify.mjs
```

`--iphone-medium` writes only the corrected screenshot set and its separate
manifest/contact sheet; it does not overwrite original screenshots or videos.
It cannot be combined with video or After Hours flags. This screenshot-only
verification does not require FFmpeg.

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
