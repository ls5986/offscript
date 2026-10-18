import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";
import { unreadableText } from "./contrast";

test.setTimeout(30000);

test("reporting a problem is clearly separate from instructions and does not send feedback automatically", async ({
  page,
}) => {
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Something confusing?", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Report a problem", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "How to Play", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "How to Play", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page
    .getByRole("button", { name: "Report a problem", exact: true })
    .click();
  const report = page.getByRole("dialog", {
    name: "Report a problem",
    exact: true,
  });
  await expect(report).toContainText("Nothing is sent automatically.");
  await expect(
    report.getByRole("button", { name: "Copy feedback", exact: true }),
  ).toBeVisible();
  expect((await readAppData(page)).feedback).toEqual([]);
});

test("game choices explain the activity and first encounter offers help without adding rules to every scene", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/party");
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  const choice = page.getByRole("button", { name: "New Choice", exact: true });
  await expect(choice).toContainText("separate caller");
  await expect(choice).toContainText("last line");
  await choice.click();
  await expect(
    page.getByRole("button", { name: "Learn this game", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Learn this game", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "How to Play", exact: true }),
  ).toContainText("Calls are manual.");
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Learn this game", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Another scene", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Learn this game", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "End game", exact: true }),
  ).toBeInViewport({ ratio: 1 });
});

test("quick Library filters put category ahead of sort and isolate full-catalog inspection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/library");
  await page
    .getByRole("button", { name: "Filter library", exact: true })
    .click();
  const action = page.getByRole("button", { name: "Action", exact: true });
  const sort = page.getByRole("button", { name: "A–Z", exact: true });
  const actionBounds = await action.boundingBox();
  const sortBounds = await sort.boundingBox();
  expect(actionBounds!.y).toBeLessThan(sortBounds!.y);
  await expect(action).toBeInViewport({ ratio: 1 });
  await expect(
    page.getByRole("button", {
      name: "Historical ingredients (1326)",
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Inspect full catalog", exact: true })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Historical ingredients (1326)",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Filter library", exact: true })
    .click();
  await page.getByRole("button", { name: "Recipes", exact: true }).click();
  await expect(page.getByTestId("library-recipe-explanation")).toContainText(
    "fixed combinations",
  );
  await page.getByRole("button", { name: "Game recipes", exact: true }).click();
  await expect(page.getByTestId("library-recipe-explanation")).toContainText(
    "draw their prompts",
  );
});

test("an Action-only scene tells players to invent characters and announces the optional timer before Start", async ({
  page,
}) => {
  await page.goto("/library");
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("prompt_action_001");
  await page
    .getByRole("button", { name: "Use Repairing", exact: true })
    .click();
  const snapshot = structuredClone((await readAppData(page)).studio.result);
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start round", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Start talking as these people.", { exact: false }),
  ).toHaveCount(0);
  await expect(page.getByTestId("scene-instruction")).toContainText(
    "Invent your own characters",
  );
  await expect(page.getByTestId("scene-timing-preview")).toContainText(
    "90-second",
  );
  await expect(page.getByTestId("scene-timing-preview")).toContainText(
    "keep playing",
  );
  expect(
    (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot,
  ).toEqual(snapshot);
  await page.getByRole("button", { name: "Start round", exact: true }).click();
  await expect(page.getByTestId("scene-instruction")).toContainText(
    "Invent your own characters",
  );
  await page
    .getByRole("button", { name: "Full rules & coaching", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Rules & coaching", exact: true }),
  ).toContainText("Invent your own characters");
});

test("finished parties confirm local saving and Saved opens the recap collection without an empty favorites detour", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  const original = (await readAppData(page)).sessions.at(-1)!;
  await page.getByRole("button", { name: "End game", exact: true }).click();
  await expect(
    page.getByText(
      "Saved on this device. Find your recap in Saved → Sessions.",
      { exact: true },
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "View saved parties", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Sessions", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "See recap", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/party/${original.id}$`));
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await page.getByRole("link", { name: "Saved", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "See recap", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Your future favorites live here.", { exact: true }),
  ).toHaveCount(0);
  expect((await readAppData(page)).sessions.at(-1)!.status).toBe("finished");
});

test("the corrected novice controls fit a small dark phone without exposing old rules or hiding all catalog banks", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/library");
  await page
    .getByRole("button", { name: "Filter library", exact: true })
    .click();
  expect(await unreadableText(page)).toEqual([]);
  await page
    .getByRole("button", { name: "Inspect full catalog", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Archived originals (1347)", exact: true })
    .click();
  await expect(page.getByTestId("library-bank-label")).toHaveText(
    "Archived originals",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
