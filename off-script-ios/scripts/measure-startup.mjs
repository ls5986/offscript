import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const url =
  process.env.PERF_URL || "https://off-script-play.lindsey08092.chatgpt.site";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
  proxy: process.env.PERF_PUBLIC
    ? { server: process.env.HTTPS_PROXY }
    : undefined,
});
const runs = [];
for (let i = 0; i < 3; i++) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 744 },
  });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 100,
    downloadThroughput: 256000,
    uploadThroughput: 128000,
  });
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .waitFor({ timeout: 90000 });
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .isEnabled();
  const measured = await page.evaluate(() => ({
    readyMs: performance.now(),
    navigation: performance
      .getEntriesByType("navigation")
      .map((n) => ({
        ttfb: n.responseStart,
        domContentLoaded: n.domContentLoadedEventEnd,
      })),
    resources: performance
      .getEntriesByType("resource")
      .filter((r) => ["script", "css", "link"].includes(r.initiatorType))
      .map((r) => ({
        name: r.name.split("/").at(-1),
        transfer: r.transferSize,
        encoded: r.encodedBodySize,
        duration: r.duration,
      })),
    paint: performance
      .getEntriesByType("paint")
      .map((p) => ({ name: p.name, startTime: p.startTime })),
  }));
  runs.push(measured);
  await context.close();
}
await browser.close();
await writeFile(
  process.env.PERF_OUTPUT || "/tmp/off-script-perf-before.json",
  JSON.stringify({ url, runs }, null, 2),
);
console.log(
  JSON.stringify(
    runs.map((r) => ({
      readyMs: Math.round(r.readyMs),
      scriptBytes: r.resources
        .filter((x) => x.name.includes(".js"))
        .reduce((s, r) => s + r.encoded, 0),
      ttfb: Math.round(r.navigation[0].ttfb),
    })),
  ),
);
