import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";

test("acting out selected location and relationship never adds an unselected situation, including New Prompt", async ({
  page,
}) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page
    .getByRole("button", { name: "Location only", exact: true })
    .click();
  await page.getByRole("button", { name: "Relationship", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect
    .poll(async () =>
      Object.keys((await readAppData(page)).studio.result!.entries).sort(),
    )
    .toEqual(["location", "relationship"]);
  const snapshot = (await readAppData(page)).studio.result!;
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(page).toHaveURL(/\/session\//);
  await expect(
    page.getByRole("button", { name: "Start round", exact: true }),
  ).toBeVisible();
  expect(
    (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot,
  ).toEqual(snapshot);
  await expect(page.getByText("Situation", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Start round", exact: true }).click();
  await page.getByRole("button", { name: "New Prompt", exact: true }).click();
  await expect
    .poll(async () =>
      Object.keys(
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot
          .entries,
      ).sort(),
    )
    .toEqual(["location", "relationship"]);
  await expect(page.getByText("Situation", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Finish round", exact: true }).click();
  await page.getByRole("button", { name: "Replay game", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Start round", exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () =>
      Object.keys(
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot
          .entries,
      ).sort(),
    )
    .toEqual(["location", "relationship"]);
  await expect(page.getByText("Situation", { exact: true })).toHaveCount(0);
  expect((await readAppData(page)).studio.result).toEqual(snapshot);
});
