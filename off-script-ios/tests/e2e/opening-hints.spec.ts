import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";
import { enterNames } from "./helpers";

test("Party omits opening hints even for old captured hints without changing the saved prompt", async ({
  page,
}) => {
  await page.goto("/party");
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Yes, And", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Another story", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.status,
    )
    .toBe("paused");
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("state", "readwrite"),
        store = tx.objectStore("state");
      const request = store.get("app");
      request.onsuccess = () => {
        const value = request.result;
        const snapshot = value.sessions.at(-1).rounds.at(-1).promptSnapshot;
        snapshot.entries.situation = {
          id: "prompt_situation_2023",
          text: "Someone has hired a spokesperson for the group chat.",
          locked: false,
          contentRating: "clean",
          sourceVersion: 1,
          sourcePackVersion: "2.5.0",
          openingHint:
            "I think we need to replace Diana; she keeps telling the group chat the wrong thing.",
        };
        delete snapshot.composition;
        store.put(value, "app");
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await page.reload();
  const prompt = (await readAppData(page)).sessions
    .at(-1)!
    .rounds.at(-1)!.promptSnapshot;
  const opening =
    "I think we need to replace Diana; she keeps telling the group chat the wrong thing.";
  await expect(page.getByText(opening, { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Hint: opening line", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "How to Play", exact: true }).click();
  await expect(page.getByText(opening, { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Hint: opening line", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  expect(
    (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot,
  ).toEqual(prompt);
  await page
    .getByRole("button", { name: "Another story", exact: true })
    .click();
  await expect(page.getByText(opening, { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Hint: opening line", exact: true }),
  ).toHaveCount(0);
  expect(
    (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot
      .entries.situation.openingHint,
  ).toBeUndefined();
});

test("selected adult material still deals immediately without hints and remains hidden by Classroom clean", async ({
  page,
}) => {
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Party preferences", exact: true })
    .click();
  await page.getByRole("button", { name: "18+", exact: true }).click();
  await page
    .getByRole("switch", {
      name: "Everyone is 18+ and wants adult cards",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Yes, And", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.party!.cards.at(-1)!.level,
    )
    .toBe("18_plus");
  const session = (await readAppData(page)).sessions.at(-1)!;
  expect(
    session.rounds.at(-1)!.promptSnapshot.entries.situation.contentRating,
  ).toBe("mature_suggestive");
  await expect(
    page.getByRole("button", { name: "Hint: opening line", exact: true }),
  ).toHaveCount(0);
  await page.goto("/settings");
  await page
    .getByRole("switch", { name: "Classroom clean", exact: true })
    .click();
  await expect
    .poll(async () => (await readAppData(page)).preferences.classroomDefault)
    .toBe(true);
  await page.goto(`/party/${session.id}`);
  await expect(page.getByTestId("party-prompt")).toHaveCount(0);
  await expect(page.getByTestId("opening-line-hint")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Hint: opening line", exact: true }),
  ).toHaveCount(0);
});

test("individual story setup and play have no opening-line hint", async ({
  page,
}) => {
  await page.goto("/start?activity=W1&intent=riff");
  await enterNames(page);
  await page
    .getByRole("button", { name: "Let’s play this one", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start round", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Hint: opening line", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Start round", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Finish round", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Hint: opening line", exact: true }),
  ).toHaveCount(0);
});

test("Party keeps round limits in How to Play instead of taking up card space", async ({
  page,
}) => {
  await page.goto("/party");
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Yes, And", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await expect(page.getByTestId("party-prompt")).toBeVisible();
  await expect(page.getByTestId("party-round-limit")).toHaveCount(0);
  await expect(page.getByText(/House rule:/)).toHaveCount(0);
  await page.getByRole("button", { name: "How to Play", exact: true }).click();
  await expect(page.getByText("2 turns each", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Large Display", exact: true })
    .click();
  await expect(page.getByText(/House rule:/)).toHaveCount(0);
  await page.getByRole("button", { name: "How to Play", exact: true }).click();
  await expect(page.getByText("2 turns each", { exact: true })).toBeVisible();
});
