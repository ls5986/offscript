import { expect, test, type Page } from "@playwright/test";
import type { AppData } from "../../src/storage/model";

async function begin(page: Page, id: string, intent = "riff", count = 2) {
  await page.goto(`/start?activity=${id}&intent=${intent}&playFlow=rounds`);
  await page
    .getByText("How many people are playing?", { exact: true })
    .waitFor();
  for (let player = 2; player < count; player++)
    await page
      .getByRole("button", { name: "More players", exact: true })
      .click();
  await page
    .getByRole("button", { name: "Let\u2019s play this one", exact: true })
    .click();
  await expect(page).toHaveURL(/\/session\//);
}

async function seed(page: Page, data: AppData) {
  await page.goto("/play");
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .waitFor();
  await page.evaluate(async (data) => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("state", "readwrite");
        tx.objectStore("state").put(data, "app");
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  }, data);
}

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

test("new joke games explain turn-taking without offering an undefined Battle", async ({
  page,
}) => {
  await begin(page, "P1", "riff", 4);
  await expect(
    page.getByRole("button", { name: "Battle", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(/After a response, tap Pass turn/)).toBeVisible();
  await page
    .getByRole("button", { name: "Anyone can jump in", exact: true })
    .click();
  await expect(page.getByText(/No fixed order/)).toBeVisible();
  await expect
    .poll(
      async () =>
        (await storedData(page)).sessions.at(-1)!.rounds.at(-1)!.variant,
    )
    .toBe("open_mic");
});

test("a legacy competitive game stays saved while its explanation uses ordinary turn-taking", async ({
  page,
}) => {
  await begin(page, "P1", "riff", 4);
  const data = await storedData(page);
  const session = data.sessions.at(-1)!;
  session.rounds.at(-1)!.variant = "battle";
  const original = structuredClone(session.rounds.at(-1)!.promptSnapshot);
  await seed(page, data);
  await page.goto(`/session/${session.id}`);
  await expect(page.getByText(/older competitive option/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Battle", exact: true }),
  ).toHaveCount(0);
  const saved = (await storedData(page)).sessions.at(-1)!.rounds.at(-1)!;
  expect(saved.variant).toBe("battle");
  expect(saved.promptSnapshot).toEqual(original);
});

for (const [id, category] of [
  ["G3", "emotion"],
  ["G4", "genre"],
  ["S7", "object"],
]) {
  test(`${id} makes its starting ${category} visible without opening details`, async ({
    page,
  }) => {
    await begin(page, id, "practice");
    const session = (await storedData(page)).sessions.at(-1)!;
    await expect(
      page.getByText(
        session.rounds.at(-1)!.promptSnapshot.entries[category].text,
        { exact: false },
      ),
    ).toBeVisible();
    expect(
      (await storedData(page)).sessions.at(-1)!.rounds.at(-1)!.status,
    ).toBe("intro");
  });
}

test("the optional Party timer is visible, pauses with the menu, and can be turned off", async ({
  page,
}) => {
  await page.goto("/party");
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Play a game now", exact: true })
    .click();
  await page.getByRole("button", { name: "New Choice", exact: true }).click();
  await expect(page.getByTestId("party-timer")).toContainText("01:00");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await expect(page.getByTestId("party-timer")).toContainText(/paused/i);
  await page.getByRole("switch", { name: "Scene timer", exact: true }).click();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(page.getByTestId("party-timer")).toHaveCount(0);
});

test("game categories explain themselves without silently changing the preferred play style", async ({
  page,
}) => {
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  await page.goto("/games");
  await page.getByRole("button", { name: "Filter games", exact: true }).click();
  await page
    .getByRole("button", { name: "Act out scenes", exact: true })
    .click();
  await expect(
    page.getByText(/invented characters, places and situations/),
  ).toBeVisible();
  expect((await storedData(page)).preferences.playIntent).toBe("riff");
  await page.getByRole("button", { name: /^Show \d+ games$/ }).click();
  await expect(
    page.getByRole("button", { name: /^View / }).first(),
  ).toBeVisible();
});

test("a saved Party relationship starts and reloads with the new scene cast without changing its original", async ({
  page,
}) => {
  await page.goto("/party");
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page
    .getByRole("button", { name: "Add names (optional)", exact: true })
    .click();
  for (const [index, name] of ["Nora", "Kai", "Jo"].entries())
    await page
      .getByRole("textbox", { name: `Player ${index + 1} name`, exact: true })
      .fill(name);
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Play a game now", exact: true })
    .click();
  await page.getByRole("button", { name: "New Choice", exact: true }).click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page.getByRole("button", { name: "Save Prompt", exact: true }).click();
  await expect(
    page.getByText("Prompt saved on this device.", { exact: true }),
  ).toBeVisible();
  const original = (await storedData(page)).savedPrompts[0].snapshot;
  expect(original.relationship).not.toBeNull();
  await page.goto("/saved");
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await page
    .getByRole("button", { name: "Open exact prompt", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(page).toHaveURL(/\/session\//);
  const scene = (await storedData(page)).sessions.at(-1)!;
  const round = scene.rounds.at(-1)!;
  expect(round.promptSnapshot).toEqual(original);
  for (const [index, role] of original.relationship!.assignments.entries()) {
    const player = scene.players.find(
      (player) => player.id === round.performerIds[index],
    )!;
    await expect(
      page.getByText(`${player.displayName} · ${role.roleText}`, {
        exact: true,
      }),
    ).toBeVisible();
  }
  await page.reload();
  expect((await storedData(page)).savedPrompts[0].snapshot).toEqual(original);
  for (const [index, role] of original.relationship!.assignments.entries()) {
    const player = scene.players.find(
      (player) => player.id === round.performerIds[index],
    )!;
    await expect(
      page.getByText(`${player.displayName} · ${role.roleText}`, {
        exact: true,
      }),
    ).toBeVisible();
  }
});
