import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const url = "https://off-script-play.lindsey08092.chatgpt.site";
const output = "/workspace/off-script-free-play-live";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
  proxy: process.env.HTTPS_PROXY
    ? { server: process.env.HTTPS_PROXY }
    : undefined,
});
const page = await browser.newPage({ viewport: { width: 390, height: 664 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(url);
await page.getByRole("button", { name: "Play Yes, And", exact: true }).click();
const begin = page.getByRole("button", {
  name: "Let’s play this one",
  exact: true,
});
assert(await begin.isDisabled());
for (const [i, name] of ["Alex", "Bea"].entries())
  await page
    .getByRole("textbox", { name: `Player ${i + 1} name`, exact: true })
    .fill(name);
await begin.click();
await page.getByRole("button", { name: "Start playing", exact: true }).click();
await page.getByText("FREE PLAY", { exact: true }).waitFor();
assert.equal(await page.getByText(/ROUND \d/).count(), 0);
assert.equal(
  await page.getByRole("button", { name: "Finish round", exact: true }).count(),
  0,
);
const before = await page.getByText(/^YOUR TURN · /).innerText();
await page.getByRole("button", { name: "Next player", exact: true }).click();
assert.notEqual(await page.getByText(/^YOUR TURN · /).innerText(), before);
const controls = [];
for (const name of ["Next player", "Change game", "Done playing"]) {
  const bounds = await page
    .getByRole("button", { name, exact: true })
    .boundingBox();
  assert(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 664);
  controls.push({ name, ...bounds });
}
await page.screenshot({ path: output + "/yes-and-free-play.png" });
await page.reload();
await page.getByRole("button", { name: "Resume", exact: true }).click();
await page.getByRole("button", { name: "Change game", exact: true }).click();
await page
  .getByRole("button", { name: "Play New Choice", exact: true })
  .click();
await page.getByRole("button", { name: "Start playing", exact: true }).click();
await page.getByRole("button", { name: "New Choice!", exact: true }).click();
await page.getByText("NEW CHOICE!", { exact: true }).waitFor();
await page.getByRole("button", { name: "Done playing", exact: true }).click();
await page.getByRole("button", { name: "Start Party Night", exact: true }).waitFor();
await page.reload();
await page.getByRole("button", { name: "Start Party Night", exact: true }).waitFor();
assert.equal(
  await page
    .getByRole("button", { name: "Resume saved session", exact: true })
    .count(),
  0,
);
await page.getByRole("button", { name: "Start Party Night", exact: true }).click();
await page
  .getByRole("button", { name: "Add names (optional)", exact: true })
  .click();
for (const [i, name] of ["Alex", "Bea"].entries())
  assert.equal(
    await page
      .getByRole("textbox", { name: `Player ${i + 1} name`, exact: true })
      .inputValue(),
    name,
  );
assert.deepEqual(errors, []);
const result = {
  url,
  publicAccess: true,
  requiredNames: true,
  freePlay: true,
  namedTurns: true,
  preservedOnReloadAndGameChange: true,
  controls,
  errors,
};
await writeFile(output + "/verification.json", JSON.stringify(result, null, 2));
await browser.close();
console.log(JSON.stringify(result));
