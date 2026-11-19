import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
let browser;
before(async () => { browser = await chromium.launch(); });
after(async () => { await browser.close(); });

for (const [format, size, safe] of [
  ["wide", [3840, 1646], [1097, 493, 2743, 1154]],
  ["universal", [5244, 2950], [1921, 660, 3323, 1622]],
]) {
  test(`${format} header keeps the complete identity inside Apple's template safe area and exports opaque RGB`, async () => {
    assert.ok(existsSync(resolve(root, "header.html")), "The editable App Store header is not implemented.");
    const page = await browser.newPage({ viewport: { width: size[0], height: size[1] }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    try {
      const url = pathToFileURL(resolve(root, "header.html"));
      url.search = `?format=${format}`;
      await page.goto(url.href);
      await page.evaluate(() => window.headerReady);
      const layout = await page.evaluate(() => {
        const bounds = (selector) => {
          const box = document.querySelector(selector).getBoundingClientRect();
          return [box.left, box.top, box.right, box.bottom];
        };
        const mark = document.querySelector(".mark");
        return {
          core: bounds(".focal"),
          mark: bounds(".mark"),
          copy: bounds(".copy"),
          headline: bounds("h1"),
          markLoaded: mark.complete && mark.naturalWidth > 0,
          fontLoaded: document.fonts.check("146px Fraunces") && document.fonts.check("700 28px DM"),
          overflow: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight,
          guidesVisible: getComputedStyle(document.querySelector(".safe-guide")).display !== "none",
        };
      });
      for (const [name, rect] of Object.entries(layout).filter(([, value]) => Array.isArray(value))) {
        assert.ok(rect[0] >= safe[0] && rect[1] >= safe[1] && rect[2] <= safe[2] && rect[3] <= safe[3], `${name} outside ${format} template: ${rect}`);
      }
      assert.ok(layout.markLoaded && layout.fontLoaded);
      assert.equal(layout.overflow, false);
      assert.equal(layout.guidesVisible, false, "Do not bake template guides into upload artwork.");
      assert.deepEqual(errors, []);
      const png = await page.screenshot({ omitBackground: false });
      assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], size);
      assert.deepEqual([...png.subarray(24, 26)], [8, 2], "Apple image must be opaque 8-bit RGB.");
    } finally {
      await page.close();
    }
  });
}
