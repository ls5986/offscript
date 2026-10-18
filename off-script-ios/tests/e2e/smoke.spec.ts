import { expect, test } from "@playwright/test";
test("first browser play and desktop evidence", async ({ page }) => {
  const fatal: string[] = [];
  page.on("pageerror", (e) => fatal.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/play");
  await expect(
    page.getByRole("button", { name: "Start Party Night", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/desktop-home.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .click();
  await expect(
    page.getByText("How many people are playing?", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Change game", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/desktop-play.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: /^Another (word|job|place|prompt)$/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Change game", exact: true }),
  ).toBeVisible();
  expect(fatal).toEqual([]);
});
