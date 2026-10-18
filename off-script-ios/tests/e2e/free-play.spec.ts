import { expect, test } from "@playwright/test";

test("Yes, And is one tap from Home and free play keeps names without rounds", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 744 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/play");
  await page
    .getByRole("button", { name: "Play Yes, And", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Free play or rounds", exact: true })
    .click();
  await expect(
    page.getByText(
      "No timer, scores, or round breaks. Keep going, change games, or stop whenever you like.",
      { exact: true },
    ),
  ).toBeVisible();
  const begin = page.getByRole("button", {
    name: "Let’s play this one",
    exact: true,
  });
  await expect(begin).toBeEnabled();
  await page
    .getByRole("button", { name: "Add names (optional)", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Player 1 name", exact: true })
    .fill("Alex");
  await page
    .getByRole("textbox", { name: "Player 2 name", exact: true })
    .fill("Bea");
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await expect(begin).toBeEnabled();
  await page
    .getByRole("textbox", { name: "Player 3 name", exact: true })
    .fill("Cam");
  await begin.click();
  await page
    .getByRole("button", { name: "Start playing", exact: true })
    .click();
  await expect(page.getByText("FREE PLAY", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Finish round", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(/ROUND \d/)).toHaveCount(0);
  const turn = page.getByText(/^YOUR TURN · /);
  const first = await turn.innerText();
  await page.getByRole("button", { name: "Next player", exact: true }).click();
  await expect(turn).not.toHaveText(first);
  await expect(turn).toContainText(/Alex|Bea|Cam/);
  for (const name of ["Next player", "Change game", "Done playing"]) {
    const bounds = await page
      .getByRole("button", { name, exact: true })
      .boundingBox();
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(744);
  }
  await page.screenshot({ path: "docs/screenshots/free-play-phone.png" });
  await page.reload();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await page
    .getByRole("button", { name: "Play New Choice", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Start playing", exact: true })
    .click();
  await page.getByRole("button", { name: "New Choice!", exact: true }).click();
  await expect(page.getByText("NEW CHOICE!", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Done playing", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Start Party Night", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Start Party Night", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Resume saved session", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Change game", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Change players", exact: true })
    .click();
  for (const name of ["Alex", "Bea", "Cam"])
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test("Yes, And is first in casual games and names are shown in setup", async ({
  page,
}) => {
  await page.goto("/games");
  await expect(
    page.getByRole("button", { name: /^View / }).first(),
  ).toHaveAccessibleName("View Yes, And");
  await page
    .getByRole("textbox", { name: "Search games", exact: true })
    .fill("yes, and");
  await page
    .getByRole("button", { name: "View Yes, And", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Play Yes, And", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add names (optional)", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Player 1 name", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Player 2 name", exact: true }),
  ).toBeVisible();
});
