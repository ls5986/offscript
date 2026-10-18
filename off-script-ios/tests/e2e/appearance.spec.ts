import { expect, test } from "@playwright/test";
import { unreadableText } from "./contrast";

for (const scheme of ["light", "dark"] as const) {
  test(`${scheme} setup save errors stay readable`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/start?activity=W1&intent=riff");
    await expect(
      page.getByRole("button", { name: "Let’s play this one", exact: true }),
    ).toBeVisible();
    await page.evaluate(() => {
      IDBObjectStore.prototype.put = function () {
        throw new Error("Local save failed for the readability check.");
      };
    });
    await page
      .getByRole("button", { name: "Let’s play this one", exact: true })
      .click();
    await expect(
      page
        .getByText("Local save failed for the readability check.", {
          exact: true,
        })
        .last(),
    ).toBeVisible();
    expect(await unreadableText(page), "Save-error text").toEqual([]);
  });

  test(`${scheme} appearance keeps navigation, prompts, controls and dialogs readable`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width: 393, height: 852 });
    for (const route of ["/play", "/studio", "/settings", "/games"]) {
      await page.goto(route);
      await expect(
        page.getByRole("link", { name: "Off Script home", exact: true }),
      ).toBeVisible();
      await expect(page.getByText("Opening your local game box…")).toHaveCount(
        0,
      );
      expect(await unreadableText(page), route).toEqual([]);
    }
    await page.goto("/studio");
    await page.getByRole("button", { name: "Customize", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Relationship", exact: true }),
    ).toBeVisible();
    expect(await unreadableText(page), "Studio customization").toEqual([]);
    await page
      .getByRole("button", { name: "Relationship", exact: true })
      .click();
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Lock Relationship", exact: true }),
    ).toBeVisible();
    expect(
      await unreadableText(page),
      "Relationship and location cards",
    ).toEqual([]);
    await page.goto("/start?activity=W1&intent=riff");
    await page
      .getByRole("button", { name: "Add names (optional)", exact: true })
      .click();
    await expect(
      page.getByRole("textbox", { name: "Player 1 name", exact: true }),
    ).toBeVisible();
    expect(await unreadableText(page), "Player setup").toEqual([]);
    await page
      .getByRole("button", { name: "Let’s play this one", exact: true })
      .click();
    await expect(page).toHaveURL(/\/session\//);
    await page
      .getByRole("button", { name: "Start playing", exact: true })
      .click();
    expect(await unreadableText(page), "Live story").toEqual([]);
    await page
      .getByRole("button", { name: "Full rules & coaching", exact: true })
      .click();
    expect(await unreadableText(page), "How to Play").toEqual([]);
  });
}
