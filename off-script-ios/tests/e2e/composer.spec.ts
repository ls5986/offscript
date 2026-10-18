import { expect, test, type Page } from "@playwright/test";
import bank from "../../src/content/v2/atomic-ingredients-2.7.json" with { type: "json" };
import type { AppData } from "../../src/storage/model";
import type { PromptSnapshot } from "../../src/domain/contracts";
function ingredient(id: string) {
  const p = bank.find((p) => p.id === id)!;
  return {
    id: p.id,
    text: p.text,
    locked: false,
    sourceVersion: p.version,
    sourcePackVersion: "2.7.0",
  };
}
async function data(page: Page): Promise<AppData> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const r = indexedDB.open("off-script", 1);
      r.onsuccess = () => resolve(r.result);
    });
    return new Promise<AppData>((resolve) => {
      const r = db.transaction("state").objectStore("state").get("app");
      r.onsuccess = () => resolve(r.result);
    });
  });
}
async function seed(page: Page, snapshot: PromptSnapshot, save = false) {
  await page.goto("/studio");
  await page.getByRole("button", { name: "Customize", exact: true }).waitFor();
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  await page.evaluate(
    async ({ snapshot, save }) => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const r = indexedDB.open("off-script", 1);
        r.onsuccess = () => resolve(r.result);
      });
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("state", "readwrite");
        const store = tx.objectStore("state");
        const read = store.get("app");
        read.onsuccess = () => {
          const d = read.result;
          d.studio = {
            ...d.studio,
            categories: Object.keys(snapshot.entries),
            playerCount: 2,
            flavor: snapshot.flavor,
            generationStyle: snapshot.generationStyle,
            composeResult: snapshot.compositionEnabled,
            result: snapshot,
          };
          if (save)
            d.savedPrompts = [
              {
                id: "legacy",
                label: "Original",
                createdAt: new Date().toISOString(),
                snapshot,
                playerCount: 2,
              },
            ];
          store.put(d, "app");
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    },
    { snapshot, save },
  );
  await page.reload();
}
const policy = bank.find(
  (p) => p.text === "A new rule forbids being ordinary.",
)!;
test("the detailed repair-shop example becomes one place and remains exact after reload", async ({
  page,
}) => {
  const original: PromptSnapshot = {
    entries: {
      location: {
        id: "prompt_location_027",
        text: "The repair counter of an umbrella shop",
        locked: false,
        sourceVersion: 1,
        sourcePackVersion: "2.3.0",
      },
      relationship: {
        id: "prompt_relationship_005",
        text: "A mentor and former apprentice",
        locked: false,
        sourceVersion: 2,
        sourcePackVersion: "2.3.0",
      },
      situation: {
        id: "prompt_situation_2100",
        text: "Everyone in the meeting has equal standing",
        locked: false,
        sourceVersion: 1,
        sourcePackVersion: "2.3.0",
      },
    },
    relationship: {
      templateId: "rel_005",
      premise: "A mentor and former apprentice",
      assignments: [
        { playerId: "Player 1", roleText: "Mentor" },
        { playerId: "Player 2", roleText: "Former apprentice" },
      ],
    },
    jokeTopic: null,
    generationStyle: "coherent",
    flavor: "playful",
    contentPackVersion: "2.3.0",
  };
  await seed(page, original, true);
  await page
    .getByRole("button", { name: "Update ingredients", exact: true })
    .click();
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "Relationship", exact: true }).click();
  await page.getByRole("button", { name: "Situation", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect
    .poll(async () => Object.keys((await data(page)).studio.result!.entries))
    .toEqual(["location"]);
  await page.reload();
  await expect(page.getByText("Repair shop", { exact: true })).toBeVisible();
  await expect(page.getByTestId("composed-scene")).toHaveCount(0);
  const restored = await data(page);
  expect(restored.studio.categories).toEqual(["location"]);
  expect(restored.studio.result!.relationship).toBeNull();
  expect(restored.savedPrompts[0].snapshot).toEqual(original);
});
test("a single place needs no mixing or flavor choices and copies only its name", async ({
  page,
}) => {
  const simple: PromptSnapshot = {
    entries: {
      location: {
        id: "prompt_location_027",
        text: "Repair shop",
        locked: false,
        sourceVersion: 2,
        sourcePackVersion: "2.4.0",
      },
    },
    relationship: null,
    jokeTopic: null,
    generationStyle: "coherent",
    flavor: "grounded",
    contentPackVersion: "2.7.0",
  };
  await seed(page, simple);
  await expect(page.getByText("Repair shop", { exact: true })).toBeVisible();
  await expect(page.getByTestId("composed-scene")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Playful", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Grounded", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Connected ideas", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Mix freely", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.sharedText = text;
        },
      },
    });
  });
  await page.getByRole("button", { name: "Copy / Share", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.dataset.sharedText),
    )
    .toBe("Repair shop");
});
function hotel(): PromptSnapshot {
  return {
    entries: {
      location: ingredient("prompt_location_077"),
      situation: ingredient(policy.id),
    },
    relationship: null,
    jokeTopic: null,
    generationStyle: "coherent",
    flavor: "playful",
    contentPackVersion: "2.7.0",
  };
}
test("composed premise is prominent while locked/rerolled ingredients stay independently exact", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 744 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await seed(page, hotel());
  const premise = page.getByTestId("composed-scene");
  await expect(premise).toHaveText(
    "A hotel, where a new rule forbids being ordinary.",
  );
  expect((await premise.boundingBox())!.y).toBeLessThan(400);
  await expect(page.getByText("Hotel", { exact: true })).toBeVisible();
  await expect(
    page.getByText("A new rule forbids being ordinary.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Reroll Location", exact: true }),
  ).toBeDisabled();
  const before = (await data(page)).studio.result!;
  await page
    .getByRole("button", { name: "Reroll Situation", exact: true })
    .click();
  const after = (await data(page)).studio.result!;
  expect(after.entries.location).toEqual(before.entries.location);
  expect(after.entries.situation.id).not.toBe(before.entries.situation.id);
  await expect(premise).not.toHaveText(
    before.composition?.text ??
      "A hotel, where a new rule forbids being ordinary.",
  );
  expect(after.composition!.text).toContain("hotel");
  await page.screenshot({ path: "docs/screenshots/composer-phone.png" });
  await page.getByRole("button", { name: "Save prompt", exact: true }).click();
  const saved = (await data(page)).savedPrompts[0].snapshot;
  await page.goto("/saved");
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await expect(
    page.getByText(saved.composition!.text, { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Open exact prompt", exact: true })
    .click();
  await expect(premise).toHaveText(saved.composition!.text);
  expect((await data(page)).studio.result).toEqual(saved);
  await page.reload();
  await expect(premise).toHaveText(saved.composition!.text);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "Situation", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(premise).toHaveCount(0);
  expect(Object.keys((await data(page)).studio.result!.entries)).toEqual([
    "location",
  ]);
  await expect(page.getByText("Hotel", { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test("legacy combined scenes and locks survive; an explicit upgrade never adds unselected categories", async ({
  page,
}) => {
  const old: PromptSnapshot = {
    entries: {
      location: {
        id: "prompt_location_077",
        text: "A hotel lobby with a strict no-boring-hats policy",
        locked: true,
      },
    },
    relationship: null,
    jokeTopic: null,
    generationStyle: "coherent",
    flavor: "grounded",
    contentPackVersion: "1.1.0",
  };
  await seed(page, old, true);
  await expect(page.getByText("SAVED ORIGINAL", { exact: true })).toBeVisible();
  await expect(
    page.getByText(old.entries.location.text, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Update ingredients", exact: true }),
  ).toBeDisabled();
  expect((await data(page)).savedPrompts[0].snapshot).toEqual(old);
  await page
    .getByRole("button", { name: "Unlock Location", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Update ingredients", exact: true })
    .click();
  await expect(page.getByText("Hotel", { exact: true })).toBeVisible();
  await expect(page.getByTestId("composed-scene")).toHaveCount(0);
  const current = await data(page);
  expect(Object.keys(current.studio.result!.entries)).toEqual(["location"]);
  expect(current.savedPrompts[0].snapshot).toEqual(old);
  expect(current.studio.result!.entries.location.sourceVersion).toBe(3);
});

test("customizing a saved word replaces it with shareable ingredients without changing the original", async ({
  page,
}) => {
  const original: PromptSnapshot = {
    entries: {},
    relationship: null,
    jokeTopic: { id: "topic_001", word: "bicycle" },
    generationStyle: "coherent",
    flavor: "playful",
    contentPackVersion: "2.3.0",
  };
  await seed(page, original, true);
  await expect(page.getByText("SAVED WORD", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "Location", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByText("SAVED WORD", { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Lock Location", exact: true }),
  ).toBeVisible();
  const edited = (await data(page)).studio.result!;
  expect(edited.jokeTopic).toBeNull();
  expect(Object.keys(edited.entries)).toEqual(["location"]);
  expect((await data(page)).savedPrompts[0].snapshot).toEqual(original);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.sharedPrompt = text;
        },
      },
    });
  });
  await page.getByRole("button", { name: "Copy / Share", exact: true }).click();
  const shared = await page.evaluate(
    () => document.documentElement.dataset.sharedPrompt,
  );
  expect(shared).toContain(edited.entries.location.text);
  expect(shared).not.toContain("Word: bicycle");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Lock Location", exact: true }),
  ).toBeVisible();
  expect((await data(page)).savedPrompts[0].snapshot).toEqual(original);
});
