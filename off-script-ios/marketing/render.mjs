import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";

const root = dirname(fileURLToPath(import.meta.url));
const afterHours = process.argv.includes("--after-hours");
const output = resolve(root, afterHours ? "exports/after-hours" : "exports");
const frames = 900;
const fps = 30;
const videoRequested = process.argv.includes("--video");
if (afterHours && !videoRequested) {
  throw new Error("After Hours is a video campaign. Include --video.");
}
const ffmpeg = process.env.FFMPEG;
if (videoRequested && !ffmpeg) {
  throw new Error("Set FFMPEG to an installed FFmpeg executable to encode the tutorial.");
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];
const page = await browser.newPage({ deviceScaleFactor: 1 });
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => {
  assert.ok(request.url().startsWith("file:") || request.url().startsWith("data:"), "Media must render without external requests.");
});
const sizes = { phone: [1320, 2868], tablet: [2064, 2752], horizontal: [1920, 1080], vertical: [1080, 1920] };
const manifest = { screenshots: [], videos: [], duration: 30, fps, source: "Current Release simulator app; original native captures, never browser-emulated app screens." };
if (afterHours) manifest.audience = "18+";

async function open(format, mode = "screenshot", shot = 0) {
  const [width, height] = sizes[format];
  await page.setViewportSize({ width, height });
  const url = pathToFileURL(resolve(root, "artwork.html"));
  url.search = new URLSearchParams({ format, mode, shot: String(shot) }).toString();
  if (afterHours) url.searchParams.set("campaign", "after-hours");
  await page.goto(url.href);
  await page.evaluate(() => window.mediaReady);
  await page.evaluate(async () => {
    await Promise.all([...document.images].filter((image) => image.src).map((image) => image.decode()));
    for (const font of ['16px DM', '700 16px DM', '16px Fraunces']) {
      if (!document.fonts.check(font)) throw new Error(`A bundled font did not load: ${font}`);
    }
  });
}

async function checkLayout() {
  const failures = await page.evaluate(() => {
    const problems = [];
    const device = document.querySelector(".device").getBoundingClientRect();
    const copy = document.querySelector(".copy").getBoundingClientRect();
    if (copy.bottom > device.top && !document.querySelector(".tutorial:not(.vertical)") && !document.querySelector(".outro")) problems.push("Headline/description overlaps the device.");
    for (const selector of [".brand", ".copy", ".device"]) {
      const element = document.querySelector(selector);
      if (getComputedStyle(element).display === "none") continue;
      const box = element.getBoundingClientRect();
      if (box.left < 0 || box.top < 0 || box.right > innerWidth || box.bottom > innerHeight) problems.push(`${selector} extends beyond the canvas.`);
    }
    return problems;
  });
  assert.deepEqual(failures, []);
}

async function contactSheet(items, destination, columns, cellWidth) {
  const rows = Math.ceil(items.length / columns);
  const [firstWidth, firstHeight] = items[0].size;
  const imageHeight = Math.round(cellWidth * firstHeight / firstWidth);
  const cellHeight = imageHeight + 48;
  const sheet = await browser.newPage({ viewport: { width: columns * cellWidth, height: rows * cellHeight }, deviceScaleFactor: 1 });
  const url = pathToFileURL(resolve(root, "artwork.html"));
  if (afterHours) url.search = "?mode=tutorial&format=horizontal&campaign=after-hours";
  await sheet.goto(url.href);
  await sheet.evaluate(() => window.mediaReady);
  const encoded = await Promise.all(items.map(async (item) => ({
    label: item.file,
    src: `data:image/png;base64,${(await readFile(resolve(output, item.file))).toString("base64")}`,
  })));
  await sheet.evaluate(async ({ encoded, columns, cellWidth, cellHeight, imageHeight }) => {
    document.body.replaceChildren();
    document.body.style.cssText = "margin:0;background:#D9DDE3;overflow:visible";
    for (const [index, item] of encoded.entries()) {
      const tile = document.createElement("div");
      tile.style.cssText = `position:absolute;left:${index % columns * cellWidth}px;top:${Math.floor(index / columns) * cellHeight}px;width:${cellWidth}px;height:${cellHeight}px;padding:8px`;
      const img = new Image();
      img.src = item.src;
      img.style.cssText = `display:block;width:100%;height:${imageHeight - 16}px;object-fit:contain`;
      const label = document.createElement("div");
      label.style.cssText = "font:12px sans-serif;color:#172B49;padding-top:8px;text-align:center";
      label.textContent = item.label;
      tile.append(img, label);
      document.body.append(tile);
      await img.decode();
    }
  }, { encoded, columns, cellWidth, cellHeight, imageHeight });
  await sheet.screenshot({ path: resolve(output, destination), omitBackground: false });
  await sheet.close();
}

try {
  await open(afterHours ? "horizontal" : "phone", afterHours ? "tutorial" : "screenshot");
  const story = await page.evaluate(() => window.offscriptMedia);
  assert.equal(story.fps, fps);
  assert.equal(story.duration * fps, frames);
  assert.equal(story.tutorial[0].start, 0);
  assert.equal(story.tutorial.at(-1).end, 30);
  story.tutorial.forEach((scene, index) => {
    assert.ok(scene.end > scene.start);
    assert.ok(scene.caption.split(/\s+/).length / (scene.end - scene.start) * 60 <= 180, "Captions exceed 180 words per minute.");
    if (index) assert.equal(scene.start, story.tutorial[index - 1].end);
  });
  for (const format of afterHours ? [] : ["phone", "tablet"]) {
    const folder = format === "phone" ? "iphone" : "ipad";
    await mkdir(resolve(output, folder), { recursive: true });
    for (const [index, scene] of story.screenshots.entries()) {
      await open(format, "screenshot", index);
      await checkLayout();
      const file = `${folder}/${scene.id}.png`;
      await page.screenshot({ path: resolve(output, file), omitBackground: false });
      manifest.screenshots.push({ file, size: sizes[format], capture: `${folder}/${scene.capture}.png`, headline: scene.title.replaceAll("\n", " ") });
      console.log("Rendered", file);
    }
    await contactSheet(manifest.screenshots.filter((shot) => shot.file.startsWith(folder)), `${folder}-contact-sheet.png`, 3, 330);
  }
  const timestamp = (seconds, separator = ",") => `00:00:${String(seconds).padStart(2, "0")}${separator}000`;
  await writeFile(resolve(output, "tutorial.srt"), story.tutorial.map((scene, i) => `${i + 1}\n${timestamp(scene.start)} --> ${timestamp(scene.end)}\n${scene.caption}\n`).join("\n"));
  await writeFile(resolve(output, "tutorial.vtt"), `WEBVTT\n\n${story.tutorial.map((scene) => `${timestamp(scene.start, ".")} --> ${timestamp(scene.end, ".")}\n${scene.caption}\n`).join("\n")}`);
  if (videoRequested) {
    for (const format of ["horizontal", "vertical"]) {
      await open(format, "tutorial");
      const file = `off-script-${afterHours ? "after-hours" : "tutorial"}-${format}-30s.mp4`;
      const encoder = spawn(ffmpeg, [
        "-y", "-hide_banner", "-loglevel", "warning", "-f", "image2pipe", "-vcodec", "png", "-r", String(fps), "-i", "pipe:0",
        "-vf", "scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p",
        "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(fps),
        "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
        "-frames:v", String(frames), "-movflags", "+faststart", resolve(output, file),
      ], { stdio: ["pipe", "inherit", "inherit"] });
      const completed = once(encoder, "exit");
      const sampleFrames = [...new Set([...story.tutorial.map((scene) => (scene.start + 0.5) * fps), 885])];
      const samples = [];
      try {
        for (let frame = 0; frame < frames; frame++) {
          await page.evaluate((seconds) => window.renderMedia(seconds), frame / fps);
          if (sampleFrames.includes(frame)) {
            await checkLayout();
            const sample = `tutorial-${format}-${String(frame).padStart(3, "0")}.png`;
            await page.screenshot({ path: resolve(output, sample), omitBackground: false });
            samples.push({ file: sample, size: sizes[format] });
          }
          const bytes = await page.screenshot({ type: "png", omitBackground: false });
          if (!encoder.stdin.write(bytes)) await once(encoder.stdin, "drain");
          if (frame % 150 === 0) console.log(`${format}: frame ${frame}/${frames}`);
        }
        encoder.stdin.end();
        const [code] = await completed;
        assert.equal(code, 0, `Encoding ${file} failed.`);
      } finally {
        if (encoder.exitCode === null && encoder.signalCode === null) encoder.kill("SIGTERM");
      }
      manifest.videos.push({ file, size: sizes[format], frames, fps, seconds: frames / fps, audio: "None; caption-first silent tutorial.", use: "Website and social media. Not an App Store App Preview." });
      await contactSheet(samples, `tutorial-${format}-contact-sheet.png`, 3, format === "vertical" ? 260 : 480);
      await writeFile(resolve(output, `tutorial-${format}-poster.png`), await readFile(resolve(output, samples[0].file)));
      for (const sample of samples) await unlink(resolve(output, sample.file));
      console.log("Encoded", file);
    }
  }
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
} finally {
  await browser.close();
}
