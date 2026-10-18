import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";

test("hiding Association Chain keeps the current card but excludes it from subsequent and future parties", async ({
  page,
}) => {
  await page.goto("/party");
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Association Chain", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Yes, And", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await page
    .getByRole("button", { name: "Association Chain", exact: true })
    .click();
  const before = (await readAppData(page)).sessions.at(-1)!;
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Hide this game type", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).preferences.selectedPartyActivityIds,
    )
    .toEqual(["W1"]);
  const hidden = (await readAppData(page)).sessions.at(-1)!;
  expect(hidden.party!.options.selectedActivityIds).toEqual(["W1"]);
  expect(hidden.rounds.at(-1)!.id).toBe(before.rounds.at(-1)!.id);
  expect(hidden.rounds.at(-1)!.promptSnapshot).toEqual(
    before.rounds.at(-1)!.promptSnapshot,
  );
  await expect(
    page.getByText(/Association Chain hidden.*future parties/),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Game type hidden", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "New round of this game", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", {
      name: "Another prompt in this game",
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Play a game now", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Association Chain", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page
    .getByRole("button", { name: "Start selected game", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
    )
    .toBe("W1");
  await page.goto("/play");
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
    )
    .toBe("W1");
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  const association = page.getByRole("switch", {
    name: "Include Association Chain",
    exact: true,
  });
  await expect(association).toHaveAttribute("aria-checked", "false");
  await association.click();
  await page.getByRole("button", { name: "Save deck", exact: true }).click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).preferences.selectedPartyActivityIds,
    )
    .toEqual(["W1", "W6"]);
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await page
    .getByRole("button", { name: "Association Chain", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
    )
    .toBe("W6");
});

test("hiding a default game removes the entire type at higher material levels without expanding the deck", async ({
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
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Hide this game type", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).preferences.selectedPartyActivityIds,
    )
    .toEqual(["P1", "P5", "P6"]);
  await page.getByRole("button", { name: "Clean", exact: true }).click();
  await page.getByRole("button", { name: "18+", exact: true }).click();
  await page
    .getByRole("switch", {
      name: "Everyone is 18+ and wants adult cards",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Apply preferences", exact: true })
    .click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "World's Worst", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page
    .getByRole("button", { name: "Start selected game", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
    )
    .not.toBe("P4");
});

test("hiding the last selected type does not silently restore games and can be recovered from Choose games", async ({
  page,
}) => {
  await page.goto("/party");
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Association Chain", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Hide this game type", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).preferences.selectedPartyActivityIds,
    )
    .toEqual([]);
  await expect(page.getByText(/No selected games can be played/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start selected game", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "End game", exact: true }),
  ).toBeEnabled();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Start selected game", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Edit deck", exact: true }).click();
  await page
    .getByRole("switch", { name: "Include Yes, And", exact: true })
    .click();
  await page.getByRole("button", { name: "Save deck", exact: true }).click();
  await page
    .getByRole("button", { name: "Start selected game", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
    )
    .toBe("W1");
});
