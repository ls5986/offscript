import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";
import { unreadableText } from "./contrast";

test("a standalone cheeky action is browsable without a recipe and opens exactly in Studio", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/games");
  await page
    .getByRole("button", { name: "Prompt & recipe library", exact: true })
    .click();
  await page.getByRole("button", { name: "Cheeky", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("Scattering ashes");
  await expect(
    page.getByText("Scattering ashes", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Use Scattering ashes", exact: true }),
  ).toBeInViewport({ ratio: 1 });
  await page
    .getByRole("button", { name: "Use Scattering ashes", exact: true })
    .click();
  await expect(page).toHaveURL(/\/studio$/);
  const studio = (await readAppData(page)).studio;
  expect(studio.categories).toEqual(["action"]);
  expect(Object.keys(studio.result!.entries)).toEqual(["action"]);
  expect(studio.result!.entries.action.text).toBe("Scattering ashes");
  expect(studio.result!.relationship).toBeNull();
  await page
    .getByRole("button", { name: "Generate Again", exact: true })
    .click();
  expect(
    (await readAppData(page)).studio.result?.entries.action?.contentRating,
  ).toBe("spicy");
});

test("adult library content requires consent, stays adult on reroll, and is hidden in Classroom clean", async ({
  page,
}) => {
  await page.goto("/library");
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("Practicing dirty talk");
  await page.getByRole("button", { name: "18+", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Adult comedy, by choice", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Keep it clean", exact: true })
    .click();
  await expect(
    page.getByText("Practicing dirty talk", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "18+", exact: true }).click();
  await page
    .getByRole("button", { name: "Everyone is 18+ and agrees", exact: true })
    .click();
  await expect(
    page.getByText("Practicing dirty talk", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Use Practicing dirty talk", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Generate Again", exact: true })
    .click();
  const adult = (await readAppData(page)).studio;
  expect(adult.contentLevel).toBe("18_plus");
  expect(adult.result!.entries.action.contentRating).toBe("mature_suggestive");
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(page).toHaveURL(/\/session\//);
  expect(
    (await readAppData(page)).sessions.at(-1)!.settings.contentRating,
  ).toBe("mature_suggestive");
  await page.goto("/settings");
  await page
    .getByRole("switch", { name: "Classroom clean", exact: true })
    .click();
  await expect
    .poll(async () => (await readAppData(page)).preferences.classroomDefault)
    .toBe(true);
  await page.goto("/studio");
  await expect(
    page.getByText("This saved prompt is hidden while Classroom clean is on.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Generate clean ingredients", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).studio.result?.entries.action?.contentRating,
    )
    .toBe("clean");
});

test("the library remains readable, searchable and paginated on a small dark phone", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/library");
  await page.getByRole("button", { name: "Clean", exact: true }).click();
  await page
    .getByRole("button", { name: "Filter library", exact: true })
    .click();
  await page.getByRole("button", { name: "Action", exact: true }).click();
  await expect(page.getByText("Page 1 of 6", { exact: true })).toBeVisible();
  expect(await unreadableText(page)).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "More ideas", exact: true }).click();
  await expect(page.getByText("Page 2 of 6", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cheeky", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("Scattering ashes");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await context.setOffline(true);
  await page.goto("/library");
  await expect(
    page.getByRole("button", { name: "Recipes", exact: true }),
  ).toBeVisible();
});

test("saved adult library prompts keep their level but hide when adult comedy is switched off", async ({
  page,
}) => {
  await page.goto("/library");
  await page.getByRole("button", { name: "18+", exact: true }).click();
  await page
    .getByRole("button", { name: "Everyone is 18+ and agrees", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("Practicing dirty talk");
  await page
    .getByRole("button", { name: "Use Practicing dirty talk", exact: true })
    .click();
  await page.getByRole("button", { name: "Save prompt", exact: true }).click();
  await expect
    .poll(async () => (await readAppData(page)).savedPrompts.length)
    .toBe(1);
  await page.goto("/saved");
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await page
    .getByRole("button", { name: "Open exact prompt", exact: true })
    .click();
  expect((await readAppData(page)).studio.contentLevel).toBe("18_plus");
  await page.goto("/settings");
  await page
    .getByRole("switch", { name: "Optional 18+ format", exact: true })
    .click();
  await expect
    .poll(async () => (await readAppData(page)).preferences.matureOptIn)
    .toBe(false);
  await page.goto("/saved");
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await expect(
    page.getByText("Practicing dirty talk", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Open exact prompt", exact: true }),
  ).toHaveCount(0);
  expect((await readAppData(page)).savedPrompts).toHaveLength(1);
  await page.goto("/studio");
  await expect(
    page.getByText("This saved prompt is hidden while adult comedy is off.", {
      exact: true,
    }),
  ).toBeVisible();
});

test("recipes show their actual ingredients and Classroom clean cannot reveal cheeky or adult entries", async ({
  page,
}) => {
  await page.goto("/library");
  await page.getByRole("button", { name: "Recipes", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("Two siblings");
  await page
    .getByRole("button", {
      name: "Use recipe Two siblings, one apology",
      exact: true,
    })
    .click();
  const studio = (await readAppData(page)).studio;
  expect(studio.categories.slice().sort()).toEqual(["action", "relationship"]);
  expect(Object.keys(studio.result!.entries).sort()).toEqual([
    "action",
    "relationship",
  ]);
  await page.goto("/settings");
  await page
    .getByRole("switch", { name: "Classroom clean", exact: true })
    .click();
  await expect
    .poll(async () => (await readAppData(page)).preferences.classroomDefault)
    .toBe(true);
  await page.goto("/library");
  await expect(
    page.getByRole("button", { name: "Cheeky", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "18+", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("textbox", { name: "Search library", exact: true })
    .fill("Scattering ashes");
  await expect(page.getByText("Scattering ashes", { exact: true })).toHaveCount(
    0,
  );
});
