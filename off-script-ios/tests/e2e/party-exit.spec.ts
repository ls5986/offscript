import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";

for (const state of ["live", "paused", "large"] as const) {
  test(`Party can end directly from the ${state} play screen and keeps its saved recap`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/party");
    await page
      .getByRole("button", { name: "Deal first card", exact: true })
      .click();
    if (state === "paused")
      await page.getByRole("button", { name: "Pause", exact: true }).click();
    if (state === "large") {
      await page
        .getByRole("button", { name: "Party menu", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Large Display", exact: true })
        .click();
    }
    const before = (await readAppData(page)).sessions.at(-1)!;
    const end = page.getByRole("button", { name: "End game", exact: true });
    await expect(end).toBeInViewport({ ratio: 1 });
    await expect(
      page.getByRole("button", { name: "How to Play", exact: true }),
    ).toBeInViewport({ ratio: 1 });
    if (state !== "paused")
      await expect(
        page.getByRole("button", { name: "Pause", exact: true }),
      ).toBeInViewport({ ratio: 1 });
    const target = await end.boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(44);
    expect(target!.height).toBeGreaterThanOrEqual(44);
    const help = await page
      .getByRole("button", { name: "How to Play", exact: true })
      .boundingBox();
    expect(target!.y).toBe(help!.y);
    if (state === "live")
      await page.screenshot({
        path: test.info().outputPath("party-end-game.png"),
      });
    await end.click();
    await expect(
      page.getByText("That was all you.", { exact: true }),
    ).toBeVisible();
    await expect
      .poll(async () => (await readAppData(page)).sessions.at(-1)!.status)
      .toBe("finished");
    const ended = (await readAppData(page)).sessions.at(-1)!;
    expect(ended.id).toBe(before.id);
    expect(ended.rounds.at(-1)!.status).toBe("complete");
    expect(ended.rounds.at(-1)!.completedAt).toBeTruthy();
    expect(ended.rounds.at(-1)!.promptSnapshot).toEqual(
      before.rounds.at(-1)!.promptSnapshot,
    );
    expect(ended.party!.cards.at(-1)!.disposition).toBe("played");
    await page.reload();
    await expect(
      page.getByText("That was all you.", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL(/\/play$/);
  });
}
