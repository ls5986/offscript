// Post-publication verification in a fresh, unauthenticated browser profile.
import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
const url =
  process.env.OFF_SCRIPT_VERIFY_URL ??
  "https://off-script-play.lindsey08092.chatgpt.site";
const output = "/workspace/off-script-live-v1-1";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
    (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
  args: ["--no-sandbox"],
  proxy: process.env.HTTPS_PROXY
    ? { server: process.env.HTTPS_PROXY }
    : undefined,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 664 },
});
const page = await context.newPage();
const errors = [];
const fontResponses = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (/\.(ttf|woff2)$/.test(r.url()))
    fontResponses.push({
      url: r.url(),
      status: r.status(),
      type: r.headers()["content-type"],
    });
});
await page.goto(url);
await page.getByRole("button", { name: "Start Party Night", exact: true }).waitFor();
await page.getByRole("button", { name: "Explore Games", exact: true }).click();
await page
  .getByRole("button", { name: "Improv Practice", exact: true })
  .waitFor();
await page.waitForFunction(() => {
  const faces = [...document.fonts].filter((f) =>
    ["DMSans", "DMSansMedium", "DMSansBold", "Fraunces"].includes(
      f.family.replaceAll('"', ""),
    ),
  );
  return faces.length === 4 && faces.every((f) => f.status === "loaded");
});
const fonts = await page.evaluate(() =>
  [...document.fonts]
    .filter((f) =>
      ["DMSans", "DMSansMedium", "DMSansBold", "Fraunces"].includes(
        f.family.replaceAll('"', ""),
      ),
    )
    .map((f) => ({ family: f.family, status: f.status })),
);
if (
  fonts.length !== 4 ||
  fonts.some((f) => f.status !== "loaded") ||
  fontResponses.some((r) => r.type?.includes("text/html"))
)
  throw Error("Public font verification failed");
await page.screenshot({ path: output + "/phone-home.png" });
await page
  .getByRole("button", { name: "Improv Practice", exact: true })
  .click();
await page
  .getByRole("button", { name: "Start Practice", exact: true })
  .waitFor();
await page.goto(url + "/start?activity=W4&intent=riff");
await page.getByRole("button", { name: "Rounds", exact: true }).click();
await page
  .getByRole("textbox", { name: "Player 1 name", exact: true })
  .fill("Alex");
await page
  .getByRole("textbox", { name: "Player 2 name", exact: true })
  .fill("Sam");
await page
  .getByRole("button", { name: "Let’s play this one", exact: true })
  .click();
await page
  .getByText(
    "Take turns adding one sentence: “Fortunately…” then “Unfortunately…”.",
    { exact: true },
  )
  .waitFor();
await page.getByRole("button", { name: "Start round", exact: true }).click();
const controls = [];
for (const name of ["Pause", "Next player", "Finish round"]) {
  const bounds = await page
    .getByRole("button", { name, exact: true })
    .boundingBox();
  if (!bounds || bounds.y < 0 || bounds.y + bounds.height > 664)
    throw Error("Public control outside viewport: " + name);
  controls.push({ name, ...bounds });
}
await page.screenshot({ path: output + "/phone-story.png" });
await page.goto(url + "/studio");
await page
  .getByRole("button", { name: "Lock Relationship", exact: true })
  .waitFor();
await page
  .getByRole("button", { name: "Generate Again", exact: true })
  .waitFor();
await page.screenshot({ path: output + "/phone-studio.png" });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(url + "/games");
await page
  .getByRole("button", { name: "Start Practice", exact: true })
  .waitFor();
await page.screenshot({ path: output + "/desktop-practice.png" });
const result = {
  url,
  publicAccess: true,
  fonts,
  fontResponses,
  controls,
  errors,
};
if (errors.length) throw Error("Public page errors: " + errors.join(", "));
await writeFile(output + "/verification.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
await browser.close();
