import { expect, test } from "@playwright/test";
import { readAppData } from "./storage";

test("quick Party has a social starter, same-game primary reroll and explicit game switch", async ({
  page,
}) => {
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Play a game now", exact: true })
    .click();
  await page
    .getByRole("button", { name: "World's Worst", exact: true })
    .click();
  await expect(
    page.getByText(
      "The reader can start. Everyone uses this prompt for a separate response. Go around again if you like.",
      { exact: true },
    ),
  ).toHaveCount(0);
  await expect(page.getByTestId("party-starter")).toContainText("Hi, I'm your");
  await expect(
    page.getByRole("button", { name: "Next player", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Another job", exact: true }).click();
  await expect(page.getByText("World's Worst", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await page.getByRole("button", { name: "Pickup Lines", exact: true }).click();
  await expect(page.getByTestId("party-starter")).toContainText("Are you");
  await expect(
    page.getByRole("button", { name: "Another word", exact: true }),
  ).toBeVisible();
});

test("feedback clearly shares only a minimal report and never claims a local copy was sent", async ({
  page,
}) => {
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Report a problem", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Didn't know what to do", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Optional note", exact: true })
    .fill("I could not find the starter.");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          document.documentElement.dataset.feedbackText = text;
        },
      },
    }),
  );
  await page
    .getByRole("button", { name: "Copy feedback", exact: true })
    .click();
  await expect(
    page.getByText(
      "Copied. Paste it into TestFlight feedback or send it to the app's support contact. Nothing was sent automatically.",
      { exact: true },
    ),
  ).toBeVisible();
  const report = await page.evaluate(
    () => document.documentElement.dataset.feedbackText,
  );
  expect(report).toContain("I could not find the starter.");
  expect(report).not.toMatch(
    /playerId|roundId|assignments|secrets|displayName/,
  );
});

test("live movement preference enables a deliberately selected movement game", async ({
  page,
}) => {
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Party preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Pacing, movement & cues", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include movement games", exact: true })
    .click();
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Mirror", exact: true })
    .click();
  await page.getByRole("button", { name: "Save deck", exact: true }).click();
  await page
    .getByRole("button", { name: "Start selected game", exact: true })
    .click();
  await expect(page.getByText("Mirror", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Restart moves", exact: true }),
  ).toBeVisible();
});

test("changing the material level deals the matching variant without changing the chosen activity", async ({
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
  await page.getByRole("button", { name: "Clean", exact: true }).click();
  await page.getByRole("button", { name: "Spicy", exact: true }).click();
  await page
    .getByRole("button", { name: "Apply preferences", exact: true })
    .click();
  await expect(page.getByText("World's Worst", { exact: true })).toBeVisible();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot
          .entries.profession.contentRating,
    )
    .toBe("spicy");
  const profession = (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!
    .promptSnapshot.entries.profession;
  await expect(page.getByTestId("party-prompt")).toHaveText(profession.text);
});

test("restoring the default mix keeps the current scene but prevents another excluded scene", async ({
  page,
}) => {
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await page
    .getByRole("button", { name: "Expert Interview", exact: true })
    .click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Use default mix", exact: true })
    .click();
  await page.getByRole("button", { name: "Save deck", exact: true }).click();
  await expect(
    page.getByText("Expert Interview", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Start selected game", exact: true })
    .click();
  await expect(page.getByText("Expert Interview", { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("button", { name: /^Another (word|job|place|prompt)$/ }),
  ).toBeVisible();
});

test("reopening an exact combined prompt does not inherit the current ingredients-only preference", async ({
  page,
}) => {
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "Relationship", exact: true }).click();
  await page
    .getByRole("switch", { name: "Combine into a scene", exact: true })
    .click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByTestId("composed-scene")).toBeVisible();
  await page.getByRole("button", { name: "Save prompt", exact: true }).click();
  await expect(
    page.getByText("Saved exactly as you see it.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page
    .getByRole("switch", { name: "Combine into a scene", exact: true })
    .click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.getByTestId("composed-scene")).toHaveCount(0);
  await page.goto("/saved");
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await page
    .getByRole("button", { name: "Open exact prompt", exact: true })
    .click();
  await expect(page.getByTestId("composed-scene")).toBeVisible();
});
