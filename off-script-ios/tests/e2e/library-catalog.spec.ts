import { expect, test } from "@playwright/test";
import { unreadableText } from "./contrast";
import { readAppData } from "./storage";

test("library totals account for every live bank without counting history as new prompts", async ({
  page,
}) => {
  await page.goto("/library");
  await page
    .getByRole("button", { name: "Catalog totals", exact: true })
    .click();
  await expect(
    page.getByText("1,534 live prompt inputs", { exact: true }),
  ).toBeVisible();
  for (const [name, total] of [
    ["Ingredients", 1214],
    ["Prompt recipes", 14],
    ["Game recipes", 43],
    ["Advice problems", 60],
    ["Joke topics", 160],
    ["Secret goals", 60],
    ["Guest quirks", 40],
    ["Relationship templates", 60],
    ["Games", 39],
    ["Historical ingredients", 1326],
    ["Historical relationships", 96],
    ["Archived originals", 1347],
  ] as const) {
    await expect(
      page.getByRole("button", {
        name: `Browse ${name} (${total})`,
        exact: true,
      }),
    ).toBeVisible();
  }
});

test("sorting covers the whole chosen bank and default browsing does not hide ensemble ingredients", async ({
  page,
}) => {
  await page.goto("/library");
  await page.getByRole("button", { name: "Clean", exact: true }).click();
  await page
    .getByRole("button", { name: "Filter library", exact: true })
    .click();
  await page.getByRole("button", { name: "Relationship", exact: true }).click();
  await page.getByRole("button", { name: "A–Z", exact: true }).click();
  await expect(page.getByTestId("library-results-count")).toContainText("58");
  const first = await page
    .getByTestId("catalog-record-title")
    .allTextContents();
  expect(first).toEqual(
    [...first].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base", numeric: true }),
    ),
  );
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("prompt_relationship_044");
  await expect(page.getByText("Colleagues", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Use Colleagues", exact: true })
    .click();
  expect((await readAppData(page)).studio.playerCount).toBe(4);
  expect(
    (await readAppData(page)).studio.result!.relationship!.assignments,
  ).toHaveLength(4);
});

test("game recipes expose actual category inputs, while old source records remain read-only", async ({
  page,
}) => {
  await page.goto("/library");
  await page.getByRole("button", { name: "Recipes", exact: true }).click();
  await page.getByRole("button", { name: "Game recipes", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("p5_clean");
  await expect(
    page.getByText("Terrible Advice", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "View inputs for p5_clean", exact: true })
    .click();
  await expect(page.getByTestId("library-bank-label")).toHaveText(
    "Advice problems",
  );
  await expect(page.getByTestId("library-results-count")).toContainText("16");
  await page
    .getByRole("button", { name: "Catalog totals", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Browse Historical ingredients (1326)",
      exact: true,
    })
    .click();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("prompt_location_027");
  await expect(page.getByText("Repair shop", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Use / })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Record details", exact: true })
    .click();
  await expect(page.getByTestId("catalog-record-data")).toContainText(
    '"id": "prompt_location_027"',
  );
});

test("all-bank inspection preserves adult/classroom gates and small-phone readability", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/library");
  await page.getByRole("button", { name: "All content", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("Practicing dirty talk");
  await expect(page.getByTestId("catalog-record-title")).toHaveCount(0);
  await page.getByRole("button", { name: "18+", exact: true }).click();
  await page
    .getByRole("button", { name: "Everyone is 18+ and agrees", exact: true })
    .click();
  await expect(page.getByTestId("catalog-record-title")).toHaveText([
    "Practicing dirty talk",
    "Needs improvement",
  ]);
  expect(await unreadableText(page)).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
