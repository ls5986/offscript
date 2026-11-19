import { chromium } from "playwright";
import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
let browser;
before(async () => { browser = await chromium.launch(); });
after(async () => { await browser.close(); });

test("After Hours selects its own native captures and keeps an adult audience label on every scene", async () => {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  try {
    const url = pathToFileURL(resolve(root, "artwork.html"));
    url.search = "?mode=tutorial&format=vertical&campaign=after-hours";
    await page.goto(url.href);
    await page.evaluate(() => window.mediaReady);
    const story = await page.evaluate(() => window.offscriptMedia);
    assert.equal(story.audience, "18+");
    assert.equal(story.duration, 30);
    assert.equal(story.tutorial[0].start, 0);
    assert.equal(story.tutorial.at(-1).end, 30);
    for (const [index, scene] of story.tutorial.entries()) {
      if (index) assert.equal(story.tutorial[index - 1].end, scene.start);
      assert.ok(scene.caption.split(/\s+/).length / (scene.end - scene.start) * 60 <= 180);
      await page.evaluate((time) => window.renderMedia(time), scene.start + 0.5);
      assert.equal(await page.locator(".audience").innerText(), "AFTER HOURS / 18+");
      assert.equal(await page.locator(".audience").isVisible(), true);
      if (scene.capture) {
        const path = await page.locator("#capture").getAttribute("src");
        assert.ok(path.startsWith("./captures/after-hours/"), path);
        assert.equal(await page.locator("#capture").evaluate((image) => image.complete && image.naturalWidth > 0), true);
      }
    }
  } finally {
    await page.close();
  }
});

test("the original tutorial still selects all-ages native captures without an adult campaign label", async () => {
  const page = await browser.newPage();
  try {
    const url = pathToFileURL(resolve(root, "artwork.html"));
    url.search = "?mode=tutorial&format=horizontal";
    await page.goto(url.href);
    await page.evaluate(() => window.mediaReady);
    assert.equal(await page.locator("#headline").innerText(), "Start with\none phone.");
    assert.equal(await page.locator("#capture").getAttribute("src"), "./captures/iphone/01-home.png");
    assert.equal(await page.locator(".audience").isVisible(), false);
  } finally {
    await page.close();
  }
});

test("the After Hours audience badge does not cover the native screen", async () => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  try {
    const url = pathToFileURL(resolve(root, "artwork.html"));
    url.search = "?mode=tutorial&format=horizontal&campaign=after-hours";
    await page.goto(url.href);
    await page.evaluate(() => window.mediaReady);
    await page.evaluate(() => window.renderMedia(3.5));
    const overlaps = await page.evaluate(() => {
      const badge = document.querySelector(".audience").getBoundingClientRect();
      const device = document.querySelector(".device").getBoundingClientRect();
      return badge.left < device.right && badge.right > device.left &&
        badge.top < device.bottom && badge.bottom > device.top;
    });

    assert.equal(overlaps, false);
  } finally {
    await page.close();
  }
});

test("medium-display iPhone artwork fits the accepted upload canvas without stretching native screens", async () => {
      const page = await browser.newPage({ viewport: { width: 1206, height: 2622 }, deviceScaleFactor: 1 });
      try {
        for (let shot = 0; shot < 6; shot++) {
          const url = pathToFileURL(resolve(root, "artwork.html"));
          url.search = `?format=phone-medium&shot=${shot}`;
          await page.goto(url.href);
          await page.evaluate(() => window.mediaReady);
          const layout = await page.evaluate(() => {
            const bounds = (selector) => {
              const box = document.querySelector(selector).getBoundingClientRect();
              return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
            };
            const image = document.querySelector("#capture");
            return {
              canvas: bounds("#canvas"),
              copy: bounds(".copy"),
              device: bounds(".device"),
              renderedAspect: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
              nativeAspect: image.naturalWidth / image.naturalHeight,
            };
          });
          assert.ok(Math.abs(layout.canvas.right - 1206) < 0.1);
          assert.ok(Math.abs(layout.canvas.bottom - 2622) < 0.1);
          assert.ok(layout.copy.bottom < layout.device.top);
          assert.ok(layout.device.left >= 0 && layout.device.right <= 1206);
          assert.ok(layout.device.bottom <= 2622);
          assert.ok(Math.abs(layout.renderedAspect - layout.nativeAspect) < 0.0001);
          const png = await page.screenshot({ omitBackground: false });
          assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [1206, 2622]);
          assert.equal(png[25], 2, "Upload PNG must be opaque RGB.");
        }
      } finally {
        await page.close();
      }
});
