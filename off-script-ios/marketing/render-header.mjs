import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const root = dirname(fileURLToPath(import.meta.url));
const output = resolve(root, "exports/headers");
await mkdir(output, { recursive: true });
await mkdir(resolve(output, "previews"), { recursive: true });
const formats = [
  { name: "wide", width: 3840, height: 1646, safe: [1097, 493, 2743, 1154], file: "off-script-header-3840x1646.png" },
  { name: "universal", width: 5244, height: 2950, safe: [1921, 660, 3323, 1622], file: "off-script-universal-5244x2950.png" },
];
const browser = await chromium.launch();
const report = {
  specifications: "https://developer.apple.com/help/app-store-connect/reference/app-information/creative-assets-specifications",
  guidance: "https://developer.apple.com/app-store/asset-best-practices/",
  safeAreaSource: "Art Safe Area layer bounds read from Apple's official 16-bit Photoshop header/universal templates on October 18, 2026. Templates are not bundled.",
  templateURLs: [
    "https://devimages-cdn.apple.com/design/resources/download/app-store/creative_assets-product_page_header_template-static.psd",
    "https://devimages-cdn.apple.com/design/resources/download/app-store/creative_assets-universal_asset_template-static.psd",
  ],
  assets: [],
  uploadedToApple: false,
};
try {
  for (const format of formats) {
    const page = await browser.newPage({ viewport: { width: format.width, height: format.height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      assert.ok(request.url().startsWith("file:"), "The header must render without external requests.");
    });
    const url = pathToFileURL(resolve(root, "header.html"));
    url.search = `?format=${format.name}`;
    await page.goto(url.href);
    await page.evaluate(() => window.headerReady);
    const layout = await page.evaluate(() => {
      const element = document.querySelector(".focal");
      const box = element.getBoundingClientRect();
      return {
        focalBounds: [box.left, box.top, box.right, box.bottom],
        copyOverflow: document.querySelector(".copy").scrollWidth > document.querySelector(".copy").clientWidth,
        guidesVisible: getComputedStyle(document.querySelector(".safe-guide")).display !== "none",
      };
    });
    const [left, top, right, bottom] = layout.focalBounds;
    const [safeLeft, safeTop, safeRight, safeBottom] = format.safe;
    assert.ok(left >= safeLeft && top >= safeTop && right <= safeRight && bottom <= safeBottom);
    assert.equal(layout.copyOverflow, false);
    assert.equal(layout.guidesVisible, false);
    const png = await page.screenshot({ path: resolve(output, format.file), omitBackground: false });
    assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [format.width, format.height]);
    assert.deepEqual([...png.subarray(24, 26)], [8, 2]);
    await page.setViewportSize({ width: 1280, height: Math.round(format.height * 1280 / format.width) });
    await page.evaluate(({ width, height }) => {
      const scene = document.querySelector(".scene");
      scene.style.width = `${width}px`;
      scene.style.height = `${height}px`;
      scene.style.transformOrigin = "top left";
      scene.style.transform = `scale(${1280 / width})`;
    }, format);
    await page.screenshot({ path: resolve(output, `previews/preview-${format.name}.png`), omitBackground: false });
    await page.locator("#scene").evaluate((scene) => scene.classList.add("show-guides"));
    await page.screenshot({ path: resolve(output, `previews/safe-area-preview-${format.name}.png`), omitBackground: false });
    const persisted = await readFile(resolve(output, format.file));
    assert.deepEqual(persisted, png);
    assert.deepEqual(errors, []);
    report.assets.push({
      file: format.file,
      dimensions: [format.width, format.height],
      color: "8-bit opaque RGB PNG; no alpha channel",
      templateSafeArea: format.safe,
      focalBounds: layout.focalBounds,
      sha256: createHash("sha256").update(persisted).digest("hex"),
      placement: format.name === "wide" ? "Product page Header (recommended)" : "Universal creative accepted for Header or Search Results; verify both in Apple's Preview tool",
    });
    console.log("Rendered and verified", format.file);
    await page.close();
  }
  await writeFile(resolve(output, "verification.json"), `${JSON.stringify(report, null, 2)}\n`);
} finally {
  await browser.close();
}
