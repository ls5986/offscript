import type { Page } from "@playwright/test";

// Existing round-based scenarios still explicitly choose rounds and name the roster.
export async function enterNames(page: Page) {
  await page
    .getByRole("button", { name: "Free play or rounds", exact: true })
    .click();
  await page.getByRole("button", { name: "Rounds", exact: true }).click();
  await page
    .getByRole("button", { name: "Add names (optional)", exact: true })
    .click();
  const fields = page.getByRole("textbox", { name: /^Player \d+ name$/ });
  for (let i = 0; i < (await fields.count()); i++) {
    if (!(await fields.nth(i).inputValue()).trim())
      await fields.nth(i).fill(`Player ${i + 1}`);
  }
}
