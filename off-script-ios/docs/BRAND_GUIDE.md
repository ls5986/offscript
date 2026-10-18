# Off Script brand system

Positioning: the one-phone improv game that gets friends playing in seconds.
Descriptor: **Improv party games for 2–12 people.**
Sign-off: **Make it up as you go.**

## Two ways in, one identity

**Just Riff** welcomes people who want to mess around with friends: short rules, one playful complication, examples and quick turns. **Improv Practice** gives experienced performers the full catalog, precise exercises and optional coaching. Neither choice judges talent or promises a guaranteed laugh.

Voice is warm, quick-witted and encouraging. Prefer concrete invitations: “Make a small offer,” “Next game,” and “Keep the scene going.” Avoid demanding that players be funny. Keep the language brief during play and put detail behind disclosures.

## Identity

The original mark is a navy conversation card on soft coral, interrupted by an offset paper corner. The same offset-card gesture appears in the category icons, Studio navigation, hero illustration and live cue cards. The stable wordmark is outlined DM Sans Bold and remains independent of font loading. Use the complete lockup for navigation and loading; use the symbol alone when space is limited.

The six original glyphs distinguish wordplay, scenes, practice, groups, movement and Studio. Standard line icons remain for familiar actions such as pause, save and settings. Do not reintroduce a generic sparkle or a microphone as the product's central identity.

- Navy `#172B49`: primary actions and the main identity.
- Warm paper `#F8F6F1`: background and breathing room.
- Lilac `#EAE5F4` / blue `#E4ECF3`: scene context and secondary surfaces.
- Coral `#E97560` / soft coral `#F29B87`: decorative surprise and the mark.
- Deep coral `#AA4234`: readable accent text in light appearance.
- Muted ink `#555F70`: helper text on light surfaces.

Use Fraunces for expressive headlines and playable prompts; DM Sans for instructions and controls. Serve the bundled licensed fonts with explicit fallbacks. Navy, paper and the intentional deep-coral text token keep the identity readable. Dark appearance uses the matching semantic tokens in `useTheme`.

Native labels must resolve an explicit semantic color: passing an undefined
color after a text style resets React Native's color even when the web preview
still inherits the right one. Input boundaries, secondary buttons, unselected
chips and off-switch tracks use `controlLine` (`#7C8593` light / `#7C8BA3`
dark), not the decorative divider token. Keep normal text at least 4.5:1
and essential control boundaries/thumbs at least 3:1 against their surfaces.
Check both appearances on a native build as well as the browser.

Cue animation is brief and respects the reduced-motion setting. Keep decoration outside the controls' layout so it cannot push them off screen.

## Assets and regeneration

Vector files: `public/brand/mark.svg`, `wordmark.svg`, `lockup.svg`.
Raster assets: favicon, 192/512px web app icons, native app/splash icons and 1200×630 share image.
Source: `src/design/brand.tsx`; outlined wordmark data: `src/design/wordmark.json`.

Run `python scripts/brand-assets.py` with fonttools and PyMuPDF installed to export brand assets from vector geometry and the licensed local font files. Font license texts ship with the app. The SVG lockup scales cleanly and the symbol has been visually checked at 24px; recognition by users remains a usability-research task.

The shared-link title, descriptor, preview image, alt text and canonical URL live in `scripts/offline.mjs`. Offline cache revisions hash file contents so same-filename brand updates do not retain old assets.

## Recommendation status

Implemented: public font delivery/fallbacks; descriptor and beginner reassurance; original mark and stable wordmark; conversation/card illustration; consistent icon family and assets; semantic colors and readable accent tokens; restrained cue motion; compact live controls; clear role labels; result-first Studio; compact library filters/counts; contextual action labels; two distinct play intentions.

Still requires people rather than a code change: five-second product-comprehension and icon-recognition studies, observed first-session play with unfamiliar pairs, and teacher testing. Do not present automated checks as evidence of those studies. Name clearance and App Store readiness remain owner release tasks documented in APP_STORE_READINESS.md.
