import { expect, test, type Page } from "@playwright/test";
import type { AppData } from "../../src/storage/model";
import type { PromptSnapshot } from "../../src/domain/contracts";

async function stored(page: Page): Promise<AppData> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
    });
    return new Promise<AppData>((resolve) => {
      const request = db.transaction("state").objectStore("state").get("app");
      request.onsuccess = () => resolve(request.result);
    });
  });
}

async function largeText(page: Page) {
  await page.goto("/settings");
  await page.getByRole("switch", { name: "Larger text", exact: true }).click();
}

async function withinScreen(
  page: Page,
  locator: ReturnType<Page["getByRole"]>,
) {
  await expect(async () => {
    const box = await locator.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(
      page.viewportSize()!.height,
    );
  }).toPass();
}

test("Home offers Studio first without hiding the direct Party Night route", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/play");
  const studio = page.getByRole("button", {
    name: "Prompt Studio",
    exact: true,
  });
  const party = page.getByRole("button", {
    name: "Start Party Night",
    exact: true,
  });
  await withinScreen(page, studio);
  await withinScreen(page, party);
  expect((await studio.boundingBox())!.y).toBeLessThan(
    (await party.boundingBox())!.y,
  );
  await studio.click();
  await expect(page).toHaveURL(/\/studio$/);
  await expect(
    page.getByRole("button", { name: "Lock Location", exact: true }),
  ).toBeVisible();
  await page.goto("/play");
  await party.click();
  await expect(page).toHaveURL(/\/party$/);
});

test("small-phone larger text shows a real place and keeps generation reachable in both displays", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await largeText(page);
  await page.goto("/studio");
  const generate = page.getByRole("button", {
    name: "Generate Again",
    exact: true,
  });
  await expect(
    page.getByRole("button", { name: "Lock Location", exact: true }),
  ).toBeVisible();
  const state = await stored(page);
  const place = page.getByText(state.studio.result!.entries.location.text, {
    exact: true,
  });
  await withinScreen(page, place);
  await withinScreen(page, generate);
  expect(
    (await place.boundingBox())!.y + (await place.boundingBox())!.height,
  ).toBeLessThan((await generate.boundingBox())!.y);
  await expect(page.getByText(/2 performers/)).toHaveCount(0);
  await page
    .getByRole("button", { name: "Large Display", exact: true })
    .click();
  await withinScreen(page, generate);
  const before = (await stored(page)).studio.result!.entries.location.id;
  await generate.click();
  await expect
    .poll(async () => (await stored(page)).studio.result!.entries.location.id)
    .not.toBe(before);
  await expect(
    page.getByRole("button", { name: "Reroll Location", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("ingredients are the default and the optional scene choice survives every edit and reload", async ({
  page,
}) => {
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  await expect(
    page.getByRole("switch", { name: "Combine into a scene", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  const combine = page.getByRole("switch", {
    name: "Combine into a scene",
    exact: true,
  });
  await expect(combine).not.toBeChecked();
  await page.getByRole("button", { name: "Situation", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByTestId("composed-scene")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .click();
  const locked = (await stored(page)).studio.result!.entries.location;
  await page.getByRole("button", { name: "Save prompt", exact: true }).click();
  const saved = (await stored(page)).savedPrompts[0].snapshot;
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await combine.click();
  await page.getByRole("button", { name: "Relationship", exact: true }).click();
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByTestId("composed-scene")).toBeVisible();
  await page
    .getByRole("button", { name: "Generate Again", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reroll Situation", exact: true })
    .click();
  await page.reload();
  await expect(page.getByTestId("composed-scene")).toBeVisible();
  let state = await stored(page);
  expect(state.studio.composeResult).toBe(true);
  expect(state.studio.result!.compositionEnabled).toBe(true);
  expect(state.studio.result!.entries.location).toEqual(locked);
  expect(state.savedPrompts[0].snapshot).toEqual(saved);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await expect(combine).toBeChecked();
  await combine.click();
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page.getByRole("button", { name: "Emotion", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page
    .getByRole("button", { name: "Generate Again", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reroll Situation", exact: true })
    .click();
  await expect(page.getByTestId("composed-scene")).toHaveCount(0);
  state = await stored(page);
  expect(state.studio.composeResult).toBe(false);
  expect(state.studio.result!.compositionEnabled).toBe(false);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.copiedPrompt = text;
        },
      },
    });
  });
  await page.getByRole("button", { name: "Copy / Share", exact: true }).click();
  const copied = await page.evaluate(
    () => document.documentElement.dataset.copiedPrompt,
  );
  expect(copied).toContain(state.studio.result!.entries.location.text);
  expect(copied).toContain(state.studio.result!.entries.situation.text);
  expect(copied).toMatch(/^location: /);
  expect(copied).not.toContain("\n\nIngredients:\n");
  await page.reload();
  await expect(page.getByTestId("composed-scene")).toHaveCount(0);
  expect((await stored(page)).savedPrompts[0].snapshot).toEqual(saved);
});

test("an old snapshot without a scene preference opens exactly before editing its copy", async ({
  page,
}) => {
  const original: PromptSnapshot = {
    entries: {
      location: {
        id: "prompt_location_077",
        text: "Hotel",
        locked: true,
        sourceVersion: 3,
        sourcePackVersion: "2.4.0",
      },
      situation: {
        id: "original-policy",
        text: "A strict no-boring-hats policy",
        locked: false,
      },
    },
    relationship: null,
    jokeTopic: null,
    generationStyle: "coherent",
    flavor: "playful",
    contentPackVersion: "2.4.0",
  };
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  await page.evaluate(async (snapshot) => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
    });
    await new Promise<void>((resolve) => {
      const tx = db.transaction("state", "readwrite");
      const store = tx.objectStore("state");
      const request = store.get("app");
      request.onsuccess = () => {
        const state = request.result;
        delete state.studio.composeResult;
        state.studio.categories = ["location", "situation"];
        state.studio.result = snapshot;
        state.savedPrompts = [
          {
            id: "old",
            label: "Original",
            snapshot,
            playerCount: 2,
            createdAt: "2026-01-01T00:00:00Z",
          },
        ];
        store.put(state, "app");
      };
      tx.oncomplete = () => resolve();
    });
  }, original);
  await page.reload();
  await expect(page.getByTestId("composed-scene")).toHaveText(
    "A hotel with a strict no-boring-hats policy.",
  );
  expect((await stored(page)).studio.result).toEqual(original);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  const combine = page.getByRole("switch", {
    name: "Combine into a scene",
    exact: true,
  });
  await expect(combine).toBeChecked();
  await combine.click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByTestId("composed-scene")).toHaveCount(0);
  const state = await stored(page);
  expect(state.studio.result!.entries).toEqual(original.entries);
  expect(state.savedPrompts[0].snapshot).toEqual(original);
});

test("shared controls expose web states, comfortable targets, and larger labels", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await largeText(page);
  const disclosure = page.getByRole("button", {
    name: "Privacy & offline details",
    exact: true,
  });
  await expect(disclosure).toHaveAttribute("aria-expanded", "false");
  await disclosure.click();
  await expect(disclosure).toHaveAttribute("aria-expanded", "true");
  await page.goto("/studio");
  await expect(
    page.getByRole("link", { name: "Studio", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  const brand = await page
    .getByRole("link", { name: "Off Script home", exact: true })
    .boundingBox();
  expect(brand!.height).toBeGreaterThanOrEqual(44);
  expect(brand!.width).toBeGreaterThanOrEqual(44);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  const location = page.getByRole("button", { name: "Location", exact: true });
  await expect(location).toHaveAttribute("aria-pressed", "true");
  const situation = page.getByRole("button", {
    name: "Situation",
    exact: true,
  });
  await expect(situation).toHaveAttribute("aria-pressed", "false");
  await situation.click();
  await expect(situation).toHaveAttribute("aria-pressed", "true");
  const font = await situation.evaluate((el) =>
    parseFloat(getComputedStyle(el.querySelector('[dir="auto"]')!).fontSize),
  );
  expect(font).toBeGreaterThan(13);
  const playful = page.getByRole("button", { name: "Playful", exact: true });
  await playful.click();
  await expect(playful).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByText("Roles in this prompt", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
