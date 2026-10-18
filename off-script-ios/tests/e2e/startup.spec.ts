import { expect, test, type Page } from "@playwright/test";
import type { AppData } from "../../src/storage/model";

test("preview routes start without native text or service worker script errors", async ({
  page,
}) => {
  const invalidText: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      (message.text().includes("A text node cannot be a child of a <View>") ||
        message.text().includes("unsupported MIME type"))
    )
      invalidText.push(message.text());
  });
  for (const [path, role, name] of [
    ["/play", "button", "Start Party Night"],
    ["/party", "button", "Deal first card"],
    ["/studio", "button", "Customize"],
    ["/games", "button", "Filter games"],
    ["/saved", "button", "Prompts"],
    ["/settings", "switch", "Classroom clean"],
  ] as const) {
    await page.goto(path);
    await page.getByRole(role, { name, exact: true }).waitFor();
  }
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Change game", exact: true })
    .waitFor();
  // The production offline worker is scheduled two seconds after page load.
  await page.waitForTimeout(2300);
  expect(invalidText).toEqual([]);
});

async function storedData(page: Page): Promise<AppData> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      return await new Promise<AppData>((resolve, reject) => {
        const request = db.transaction("state").objectStore("state").get("app");
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  });
}

async function seedStartupData(page: Page, corrupt = false) {
  await page.goto("/studio");
  await expect(
    page.getByRole("button", { name: "Lock Location", exact: true }),
  ).toBeVisible();
  await page.evaluate(async (corrupt) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("state", "readwrite");
        const store = tx.objectStore("state");
        const request = store.get("app");
        request.onsuccess = () => {
          const data: AppData = request.result;
          data.favorites = ["G2"];
          data.preferences.lastPlayerNames = ["Alex", "Sam"];
          store.put(corrupt ? { ...data, version: 0 } : data, "app");
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  }, corrupt);
}

test("Studio has no mutation dock until saved data finishes loading", async ({
  page,
}) => {
  await seedStartupData(page);
  await page.addInitScript(() => {
    const get = IDBObjectStore.prototype.get;
    let delayed = false;
    IDBObjectStore.prototype.get = function (key) {
      const request = get.call(this, key);
      if (!delayed && this.name === "state" && key === "app") {
        delayed = true;
        Object.defineProperty(request, "onsuccess", {
          set(listener: (this: IDBRequest, event: Event) => void) {
            request.addEventListener("success", (event) => {
              document.documentElement.dataset.storageReadWaiting = "true";
              window.addEventListener(
                "offscript-release-read",
                () => listener.call(request, event),
                { once: true },
              );
            });
          },
        });
      }
      return request;
    };
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => document.documentElement.dataset.storageReadWaiting === "true",
  );
  await expect(
    page.getByRole("button", { name: "Generate Again", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Customize", exact: true }),
  ).toHaveCount(0);
  await page.evaluate(() =>
    window.dispatchEvent(new Event("offscript-release-read")),
  );
  await page
    .getByRole("button", { name: "Generate Again", exact: true })
    .click();
  const data = await storedData(page);
  expect(data.favorites).toEqual(["G2"]);
  expect(data.preferences.lastPlayerNames).toEqual(["Alex", "Sam"]);
});

test("unreadable saved data stays protected until the user confirms a local reset", async ({
  page,
}) => {
  await seedStartupData(page, true);
  await page.reload();
  await expect(
    page.getByText("A local save needs attention", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Generate Again", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Save prompt", exact: true }),
  ).toHaveCount(0);
  expect((await storedData(page)).favorites).toEqual(["G2"]);
  await page
    .getByRole("button", { name: "Clear all local data", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep my data", exact: true }).click();
  expect((await storedData(page)).favorites).toEqual(["G2"]);
  await page
    .getByRole("button", { name: "Clear all local data", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete all local data", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Generate Again", exact: true }),
  ).toBeVisible();
  expect((await storedData(page)).favorites).toEqual([]);
  expect((await storedData(page)).preferences.lastPlayerNames).toEqual([]);
});

test("Home and game setup remain usable while web fonts are still downloading", async ({
  page,
}) => {
  let releaseFonts: () => void = () => {};
  const pendingFonts = new Promise<void>((resolve) => {
    releaseFonts = resolve;
  });
  await page.route("**/*.woff2", async (route) => {
    await pendingFonts;
    await route.continue();
  });
  try {
    await page.goto("/play", { waitUntil: "domcontentloaded" });
    const start = page.getByRole("button", {
      name: "Start Party Night",
      exact: true,
    });
    await expect(start).toBeEnabled();
    await start.click();
    await expect(
      page.getByRole("button", { name: "Deal first card", exact: true }),
    ).toBeVisible();
  } finally {
    releaseFonts();
  }
});
