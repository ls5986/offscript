import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";

test("Change game keeps every compatible choice after picking and replaying a non-default game", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/party");
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Play a game now" });
  const before = await dialog.getByRole("button").allTextContents();
  await dialog
    .getByRole("button", { name: "Listening Echo", exact: true })
    .click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await expect(
    dialog.getByRole("button", { name: "New Choice", exact: true }),
  ).toBeVisible();
  for (const title of [
    "Expert Interview",
    "Yes, And",
    "Secret Objective",
    "Listening Echo",
  ]) {
    await expect(
      dialog.getByRole("button", { name: title, exact: true }),
    ).toHaveCount(1);
  }
  const after = await dialog.getByRole("button").allTextContents();
  expect(after).toEqual(before);
  expect(
    (await readAppData(page)).sessions.at(-1)!.party!.options
      .selectedActivityIds,
  ).toBeNull();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page
    .getByRole("button", { name: "Another prompt", exact: true })
    .click();
  expect(
    (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
  ).toBe("W8");
  await page.reload();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "New round of this game", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Hide this game type", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "New round of this game", exact: true })
    .click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  expect(await dialog.getByRole("button").allTextContents()).toEqual(before);
});

test("Choose games is reachable from a shortened list and an explicit default reset restores choices without rewriting the current card", async ({
  page,
}) => {
  await page.goto("/party");
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Listening Echo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  const before = (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!;
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Play a game now" });
  await expect(
    dialog.getByRole("button", { name: "New Choice", exact: true }),
  ).toHaveCount(0);
  await dialog
    .getByRole("button", { name: "Choose games", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Use default mix", exact: true })
    .click();
  await page.getByRole("button", { name: "Save deck", exact: true }).click();
  const after = (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!;
  expect(after.id).toBe(before.id);
  expect(after.promptSnapshot).toEqual(before.promptSnapshot);
  await expect(
    page.getByRole("button", { name: "Start selected game", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await expect(
    dialog.getByRole("button", { name: "New Choice", exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Expert Interview", exact: true }),
  ).toHaveCount(1);
});
