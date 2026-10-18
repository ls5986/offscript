import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
const url = "https://off-script-play.lindsey08092.chatgpt.site";
const output = "/workspace/off-script-composer-live";
await mkdir(output, { recursive: true });
const bank = JSON.parse(
  await readFile("src/content/v2/ingredients.json", "utf8"),
);
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
  proxy: process.env.HTTPS_PROXY
    ? { server: process.env.HTTPS_PROXY }
    : undefined,
});
const page = await browser.newPage({ viewport: { width: 390, height: 744 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
async function state() {
  return page.evaluate(async () => {
    const db = await new Promise((resolve) => {
      const r = indexedDB.open("off-script", 1);
      r.onsuccess = () => resolve(r.result);
    });
    return new Promise((resolve) => {
      const r = db.transaction("state").objectStore("state").get("app");
      r.onsuccess = () => resolve(r.result);
    });
  });
}
try {
  await page.goto(url + "/studio");
  const scene = page.getByTestId("composed-scene");
  await scene.waitFor();
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "Blank Canvas", exact: true }).click();
  await page.getByRole("button", { name: "Location", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  const only = (await state()).studio.result;
  assert.deepEqual(Object.keys(only.entries), ["location"]);
  assert.equal(await scene.count(), 0);
  assert.equal(
    only.entries.location.text,
    bank.find((p) => p.id === only.entries.location.id).text,
  );
  assert(only.entries.location.sourceVersion);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "Situation", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await scene.waitFor();
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .click();
  assert(
    await page
      .getByRole("button", { name: "Reroll Location", exact: true })
      .isDisabled(),
  );
  const before = (await state()).studio.result;
  await page
    .getByRole("button", { name: "Reroll Situation", exact: true })
    .click();
  const after = (await state()).studio.result;
  assert.deepEqual(after.entries.location, before.entries.location);
  assert.notEqual(after.entries.situation.id, before.entries.situation.id);
  assert.equal(await scene.innerText(), after.composition.text);
  assert.deepEqual(Object.keys(after.entries).sort(), [
    "location",
    "situation",
  ]);
  await page.getByRole("button", { name: "Save prompt", exact: true }).click();
  const saved = (await state()).savedPrompts[0].snapshot;
  await page.reload();
  await scene.waitFor();
  assert.equal(await scene.innerText(), saved.composition.text);
  assert.deepEqual((await state()).studio.result.entries, saved.entries);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: output + "/studio-composer.png" });
  const result = {
    url: url + "/studio",
    publicAccess: true,
    ingredientOnly: true,
    selectedCategoriesOnly: true,
    locksAndRerolls: true,
    savedReload: true,
    composition: saved.composition,
    errors,
  };
  await writeFile(
    output + "/verification.json",
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify({
      publicAccess: true,
      ingredientOnly: true,
      locksAndRerolls: true,
      savedReload: true,
      errors,
    }),
  );
} catch (e) {
  await page.screenshot({ path: output + "/failure.png" }).catch(() => {});
  console.log(
    JSON.stringify({
      error: e.message,
      url: page.url(),
      body: (await page.locator("body").innerText()).slice(0, 1000),
      errors,
    }),
  );
  throw e;
} finally {
  await browser.close();
}
