import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";

test("Studio upgrades the editable colleague relationship and roles without changing its saved original", async ({
  page,
}) => {
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  await expect
    .poll(async () => !!(await readAppData(page)).studio.result)
    .toBe(true);
  await page.evaluate(async () => {
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
          const state = request.result;
          const snapshot = {
            flavor: "grounded",
            generationStyle: "coherent",
            contentPackVersion: "2.6.0",
            entries: {
              relationship: {
                id: "prompt_relationship_102",
                text: "Office colleagues",
                locked: false,
                sourceVersion: 2,
                sourcePackVersion: "2.6.0",
                contentRating: "clean",
              },
            },
            relationship: {
              templateId: "rel_102",
              premise: "Office colleagues",
              assignments: [1, 2, 3, 4].map((number) => ({
                playerId: `00000000-0000-4000-8000-00000000000${number}`,
                roleText: `Office colleague ${number}`,
              })),
            },
            jokeTopic: null,
          };
          state.studio.categories = ["relationship"];
          state.studio.playerCount = 4;
          state.studio.result = snapshot;
          delete state.studio.promptNavigation;
          state.savedPrompts = [
            {
              id: "colleague-original",
              label: "Original colleagues",
              snapshot,
              playerCount: 4,
              createdAt: "2026-10-17T20:00:00Z",
            },
          ];
          store.put(state, "app");
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  });
  await page.reload();
  await page
    .getByRole("button", { name: "Update ingredients", exact: true })
    .click();
  await expect(page.getByText("Colleagues", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Office colleagues", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(/Office colleague/)).toHaveCount(0);
  await expect(page.getByText(/Player 1.*Colleague 1/)).toBeVisible();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).studio.result?.entries.relationship.text,
    )
    .toBe("Colleagues");
  expect(
    (await readAppData(page)).savedPrompts[0].snapshot.entries.relationship
      .text,
  ).toBe("Office colleagues");
});
