import { expect, test } from "@playwright/test";
import { unreadableText } from "./contrast";
import { readAppData } from "./storage";

for (const colorScheme of ["light", "dark"] as const) {
  test(`${colorScheme} Library fits five readable prompt rows in 400px and keeps usable scene buttons`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/library");
      const titles = page.getByTestId("catalog-record-title");
      await expect(titles).toHaveCount(24);
      await page.evaluate(() => document.fonts.ready);
      const firstFive = await titles.evaluateAll((elements) =>
        elements.slice(0, 5).map((element) => {
          const rect = element.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom };
        }),
      );
      expect(firstFive[4].bottom - firstFive[0].top).toBeLessThanOrEqual(400);
      for (const action of (
        await page.getByRole("button", { name: /^Use / }).all()
      ).slice(0, 5)) {
        const bounds = await action.boundingBox();
        expect(bounds!.height).toBeGreaterThanOrEqual(44);
        expect(bounds!.width).toBeGreaterThanOrEqual(44);
      }
      expect(await unreadableText(page)).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page
      .getByRole("button", { name: "Use Ferry terminal", exact: true })
      .click();
    await expect(page).toHaveURL(/\/studio$/);
    const studio = (await readAppData(page)).studio;
    expect(studio.categories).toEqual(["location"]);
    expect(studio.result!.entries.location.text).toBe("Ferry terminal");
    expect(studio.result!.relationship).toBeNull();
    await expect(
      page.getByRole("button", { name: "Act out this prompt", exact: true }),
    ).toBeVisible();
  });
}

test("compact recipe rows expand their actual ingredients and preserve the exact use action", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/library");
  await page.getByRole("button", { name: "Recipes", exact: true }).click();
  const titles = page.getByTestId("catalog-record-title");
  await expect(titles.first()).toHaveText("Two siblings, one apology");
  const positions = await titles.evaluateAll((elements) =>
    elements.slice(0, 3).map((element) => element.getBoundingClientRect().top),
  );
  expect(positions[2] - positions[0]).toBeLessThanOrEqual(320);
  await expect(
    page.getByText("Rehearsing an apology", { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Recipe details", exact: true })
    .first()
    .click();
  await expect(
    page.getByText("Rehearsing an apology", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Two siblings", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Recipe details", exact: true })
    .first()
    .click();
  await expect(
    page.getByText("Rehearsing an apology", { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", {
      name: "Use recipe Two siblings, one apology",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/studio$/);
  const studio = (await readAppData(page)).studio;
  expect(Object.keys(studio.result!.entries).sort()).toEqual([
    "action",
    "relationship",
  ]);
  expect(studio.result!.entries.action.text).toBe("Rehearsing an apology");
  expect(studio.result!.entries.relationship.text).toBe("Two siblings");
});

test("long list rows wrap at large text sizes while game inputs and historical details remain available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/settings");
  await page.getByRole("switch", { name: "Larger text", exact: true }).click();
  await expect
    .poll(async () => (await readAppData(page)).preferences.useLargeText)
    .toBe(true);
  await page.goto("/library");
  await page.getByRole("button", { name: "Cheeky", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("Writing a passive-aggressive review");
  const title = page.getByTestId("catalog-record-title");
  await expect(title).toHaveText("Writing a passive-aggressive review");
  const use = page.getByRole("button", {
    name: "Use Writing a passive-aggressive review",
    exact: true,
  });
  const textBox = await title.boundingBox();
  const buttonBox = await use.boundingBox();
  expect(textBox!.x + textBox!.width).toBeLessThanOrEqual(buttonBox!.x);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(await unreadableText(page)).toEqual([]);
  await page.getByRole("button", { name: "Recipes", exact: true }).click();
  await page.getByRole("button", { name: "Game recipes", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("p5_clean");
  await page.getByRole("button", { name: "All allowed", exact: true }).click();
  await page
    .getByRole("button", { name: "View inputs for p5_clean", exact: true })
    .click();
  await expect(page.getByTestId("library-bank-label")).toHaveText(
    "Advice problems",
  );
  await expect(page.getByTestId("library-results-count")).toContainText(
    "16 of 16",
  );
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
  await expect(page.getByTestId("catalog-record-title")).toHaveText(
    "Repair shop",
  );
  await expect(page.getByRole("button", { name: /^Use / })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Record details", exact: true })
    .click();
  await expect(page.getByTestId("catalog-record-data")).toContainText(
    '"id": "prompt_location_027"',
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
