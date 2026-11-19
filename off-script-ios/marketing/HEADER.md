# Off Script App Store header

The header is the large creative banner at the top of the App Store product
page. It is separate from device screenshots and does not change the app binary.

## Upload this one

**Recommended: [off-script-header-3840x1646.png](exports/headers/off-script-header-3840x1646.png).**

1. Open the app version in App Store Connect.
2. Choose **Header and Search Results**, then **Header**.
3. Use **Upload** to select the recommended PNG above.
4. Use Apple's **Preview** control to confirm the actual device presentation,
   then save.

The Header slot takes **one** asset. Do not upload both sizes there, and do
not upload a ZIP, small preview image, or green safe-area diagnostic image.

The [5244 x 2950 universal PNG](exports/headers/off-script-universal-5244x2950.png)
is an alternative accepted Header format. Apple's current specifications also
permit this exact universal PNG size in Search Results. It can be used there
if desired; use the Search Results preview before saving it. The 3840 x 1646
wide header is not a 3:2 Search Results image.

`Off-Script-App-Store-Header.zip` packages both sizes, previews, source and instructions.
The normal upload PNGs contain no template labels, green guides, transparency,
Apple badges, screenshots, adult material or app-version claims.

## Artwork

Original Off Script speech-card mark, layered conversation cards, navy/paper/
lilac/coral palette, bundled licensed Fraunces and DM Sans, and short all-ages
copy: **Make it up. As you go. / One phone. Everyone plays.**

This is original brand illustration rather than a claim to show app UI.
No third-party stock imagery, unlicensed music, template artwork, or
unsupported app functionality is included.

## Official template alignment

Apple's official Photoshop files were downloaded from the links on the
[asset best-practices page](https://developer.apple.com/app-store/asset-best-practices/).
Their **Art Safe Area** layer geometry was read directly from the 16-bit PSD
layer records, not estimated from a generic center percentage:

| Format | Canvas | Safe area: left, top, right, bottom |
| --- | --- | --- |
| Wide Header | 3840 x 1646 | 1097, 493, 2743, 1154 |
| Universal | 5244 x 2950 | 1921, 660, 3323, 1622 |

The original artwork's complete focal group (mark and all wording) is within
these bounds. Only nonessential background decoration extends outside.
Designs are adapted for the two formats, not stretched from one to the other.
Green diagnostic previews are in `exports/headers/previews/`; **do not upload
those**. They are our outline visualization of the measured bounds, not copies
of Apple's template art.

Final files are verified **8-bit opaque RGB PNGs** at the exact required pixel
sizes. [Verification and SHA-256 checksums](exports/headers/verification.json)
record the focal geometry and official source links. Apple upload acceptance
and final crop presentation have not been verified in an authenticated portal.
Nothing has been submitted, published or automatically applied to the listing.

## Editable source and reproduction

`header.html` is editable HTML/CSS/SVG. Open it with:

```text
header.html?format=wide
header.html?format=universal
header.html?format=wide&guides=1
header.html?format=universal&guides=1
```

From the app root with existing Playwright/Chromium installed:

```bash
node --test marketing/header.test.mjs
node marketing/render-header.mjs
```

There are no new app dependencies, live-server requirements, online render
services or external font requests. The portable ZIP includes the local font
and original mark assets and font licenses. After extracting it, upload from
`Off-Script-Header/marketing/exports/headers/`. Re-rendering needs the existing
development tools.

Apple's templates were used only for inspection, are not modified, and are
not redistributed in this package.

## References

- [Apple creative asset specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications)
- [Apple asset best practices and template links](https://developer.apple.com/app-store/asset-best-practices/)
