import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";

test("Three-Line Scene keeps directions in help and lets the group keep playing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/party");
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Three-Line Scene", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await expect(page.getByTestId("party-prompt")).toBeVisible();
  await expect(
    page.getByText(
      "First named player: line 1. Second: line 2. First: line 3.",
      { exact: true },
    ),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      /Play a scene in just three spoken lines|Stop after the third line/,
    ),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Start", exact: true }),
  ).toBeVisible();
  const before = (await readAppData(page)).sessions.at(-1)!;
  await page.screenshot({
    path: test.info().outputPath("three-line-minimal.png"),
  });
  await page.getByRole("button", { name: "How to Play", exact: true }).click();
  const help = page.getByRole("dialog", { name: "How to Play", exact: true });
  await expect(
    help.getByText(
      "First named player: line 1. Second: line 2. First: line 3.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(help.getByText(/keep (going|playing)/i).first()).toBeVisible();
  await expect(help.getByText(/suggested/i).first()).toBeVisible();
  await expect(help.getByText(/then stop|Stop after/)).toHaveCount(0);
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pause", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Large Display", exact: true })
    .click();
  await expect(
    page.getByText(/First named player:|Stop after|then stop/),
  ).toHaveCount(0);
  const after = (await readAppData(page)).sessions.at(-1)!;
  expect(after.rounds.at(-1)!.id).toBe(before.rounds.at(-1)!.id);
  expect(after.rounds.at(-1)!.promptSnapshot).toEqual(
    before.rounds.at(-1)!.promptSnapshot,
  );
  expect(after.rounds.at(-1)!.status).toBe("live");
  await expect(
    page.getByRole("button", { name: "End game", exact: true }),
  ).toBeInViewport();
});

test("quick cards keep their playable frame without repeating turn and stopping instructions", async ({
  page,
}) => {
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await page
    .getByRole("button", { name: "World's Worst", exact: true })
    .click();
  await expect(page.getByTestId("party-starter")).toContainText("Hi, I'm your");
  await expect(
    page.getByText(
      /The reader starts|Separate answers, not a continuing scene/,
    ),
  ).toHaveCount(0);
  await expect(
    page.getByText("Say one thing a terrible person at this job might say.", {
      exact: true,
    }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "How to Play", exact: true }).click();
  const help = page.getByRole("dialog", { name: "How to Play", exact: true });
  await expect(
    help.getByText("Say one thing a terrible person at this job might say.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(help.getByText(/The reader starts/).first()).toBeVisible();
});
