import { expect, Page, test } from "@playwright/test";
import type { AppData } from "../../src/storage/model";
const button = (page: Page, name: string) =>
  page.getByRole("button", { name, exact: true });
async function data(page: Page): Promise<AppData> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const r = indexedDB.open("off-script", 1);
      r.onsuccess = () => resolve(r.result);
    });
    return new Promise<AppData>((resolve) => {
      const r = db.transaction("state").objectStore("state").get("app");
      r.onsuccess = () => resolve(r.result);
    });
  });
}
async function choose(page: Page, name: string) {
  await button(page, "Party menu").click();
  await button(page, "Play a game now").click();
  await button(page, name).click();
  await expect(page.locator('[role="dialog"]:visible')).toHaveCount(0);
}
async function begin(page: Page) {
  await page.goto("/party");
  await button(page, "More players").click();
  await button(page, "More players").click();
  await button(page, "Add names (optional)").click();
  for (const [i, name] of ["Alex", "Sam", "Meghan", "Bea"].entries())
    await page
      .getByRole("textbox", { name: `Player ${i + 1} name`, exact: true })
      .fill(name);
  await button(page, "Choose games").click();
  await button(page, "Select all games").click();
  await button(page, "Deal first card").click();
  await expect(button(page, "Change game")).toBeVisible();
}
test("supplied party examples show cast first, short copy and inline card actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 744 });
  await begin(page);
  await choose(page, "Pickup Lines");
  await expect(
    page.getByText("Take turns making a pickup line.", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByTestId("party-starter")).toContainText("Are you");
  await expect(button(page, "Another word")).toBeVisible();
  await expect(button(page, "Change game")).toBeVisible();
  const old = (await data(page)).sessions.at(-1)!.rounds.at(-1)!;
  await button(page, "Another word").click();
  const rerolled = (await data(page)).sessions.at(-1)!.rounds.at(-1)!;
  expect(rerolled.performerIds).toEqual(old.performerIds);
  expect(rerolled.promptSnapshot.jokeTopic).not.toEqual(
    old.promptSnapshot.jokeTopic,
  );
  await page.screenshot({ path: "docs/screenshots/aligned-pickup.png" });
  await choose(page, "New Choice");
  const s = (await data(page)).sessions.at(-1)!;
  const names = s.rounds
    .at(-1)!
    .performerIds.map((pid) => s.players.find((p) => p.id === pid)!.displayName)
    .join(" + ");
  const caller = s.players.find(
    (p) => p.id === s.rounds.at(-1)!.supportingPlayerIds[0],
  )!.displayName;
  await expect(
    page.getByText(`Actors: ${names} · Caller: ${caller}`, { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "2–4 actors play a scene. A separate caller taps New Choice! to ring the bell; the last speaker replaces only their last line.",
      { exact: true },
    ),
  ).toHaveCount(0);
  await expect(button(page, "Start")).toBeVisible();
  await button(page, "Start").click();
  await button(page, "New Choice!").click();
  await expect(page.getByTestId("party-cue")).toHaveText("NEW CHOICE!");
  await page.screenshot({ path: "docs/screenshots/aligned-new-choice.png" });
  await choose(page, "Emotion Remote");
  const emotion = (await data(page)).sessions.at(-1)!.rounds.at(-1)!
    .promptSnapshot.entries.emotion.text;
  await expect(
    page.getByText(`Emotion: ${emotion}`, { exact: true }),
  ).toBeVisible();
  await choose(page, "Fortunately / Unfortunately");
  await expect(
    page.getByText(
      "Go around the group, alternating good and bad developments.",
      { exact: true },
    ),
  ).toHaveCount(0);
  await button(page, "Optional turn guide").click();
  await expect(page.getByText(/you’re up · Fortunately…/)).toBeVisible();
  await button(page, "Pass turn").click();
  await expect(page.getByText(/you’re up · Fortunately…/)).toBeVisible();
  await button(page, "Next turn").click();
  await expect(page.getByText(/you’re up · Unfortunately…/)).toBeVisible();
  await choose(page, "World's Worst");
  await expect(
    page.getByText("Everyone tries this prompt", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Say one thing a terrible person at this job might say.", {
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(page.getByTestId("party-starter")).toContainText("Hi, I'm your");
  await page.screenshot({ path: "docs/screenshots/aligned-worlds-worst.png" });
});
test("in-session roster edits preserve history, returning fresh play takes one tap, and teams/display work", async ({
  page,
}) => {
  await begin(page);
  const before = (await data(page)).sessions.at(-1)!;
  await button(page, "Change players").click();
  await button(page, "Edit names, add or remove players").click();
  await page
    .getByRole("textbox", { name: "Player 1 name", exact: true })
    .fill("Alexandra");
  await button(page, "Remove player 4").click();
  await button(page, "Add player").click();
  await page
    .getByRole("textbox", { name: "Player 4 name", exact: true })
    .fill("Jo");
  await button(page, "Save players").click();
  const edited = (await data(page)).sessions.at(-1)!;
  expect(edited.players.map((p) => p.displayName)).toEqual([
    "Alexandra",
    "Sam",
    "Meghan",
    "Jo",
  ]);
  expect(edited.party!.archivedPlayers[0].displayName).toBe("Bea");
  expect(edited.rounds[0].promptSnapshot).toEqual(
    before.rounds[0].promptSnapshot,
  );
  expect(edited.rounds[0].performerIds).toEqual(before.rounds[0].performerIds);
  expect(edited.party!.cards[0].playerNames![before.players[0].id]).toBe(
    "Alex",
  );
  await button(page, "Clean").click();
  await page.getByRole("switch", { name: "Team turns", exact: true }).click();
  await button(page, "Apply preferences").click();
  await choose(page, "Pickup Lines");
  await expect(page.getByText(/Team [AB], you’re up/)).toBeVisible();
  await button(page, "Party menu").click();
  await button(page, "Large Display").click();
  await expect(button(page, "Exit Large Display")).toBeVisible();
  await page.screenshot({ path: "docs/screenshots/aligned-display.png" });
  await button(page, "Exit Large Display").click();
  await button(page, "Party menu").click();
  await button(page, "Save & leave").click();
  const count = (await data(page)).sessions.length;
  await button(page, "Start Party Night").click();
  await expect(button(page, "Change game")).toBeVisible();
  const d = await data(page);
  expect(d.sessions).toHaveLength(count + 1);
  expect(d.sessions.at(-1)!.players.map((p) => p.displayName)).toEqual([
    "Alexandra",
    "Sam",
    "Meghan",
    "Jo",
  ]);
  expect(d.sessions.at(-1)!.party!.options.level).toBe("clean");
});
test("full catalog is direct, names optional, remembered game and Studio launches skip setup, feedback is shared", async ({
  page,
}) => {
  await page.goto("/games");
  await expect(page.getByRole("button", { name: /^View / })).toHaveCount(38);
  await button(page, "View Yes, And").click();
  await button(page, "Play Yes, And").click();
  await expect(button(page, "Let’s play this one")).toBeEnabled();
  await button(page, "More players").click();
  await button(page, "Let’s play this one").click();
  await button(page, "Report a problem").click();
  await button(page, "Leave a quick rating").click();
  await button(page, "Easy to play").click();
  await page.goto("/games/G2");
  await button(page, "Play New Choice").click();
  await expect(page).toHaveURL(/\/session\//);
  await expect(button(page, "Let’s play this one")).toHaveCount(0);
  await page.goto("/studio");
  await button(page, "Customize").click();
  await button(page, "Location only").click();
  await button(page, "Done").click();
  const snapshot = (await data(page)).studio.result;
  await button(page, "Report a problem").click();
  await button(page, "Leave a quick rating").click();
  await button(page, "Made us laugh").click();
  expect((await data(page)).feedback.at(-1)!.snapshot).toEqual(snapshot);
  await button(page, "Act out this prompt").click();
  await expect(page).toHaveURL(/\/session\//);
  expect((await data(page)).sessions.at(-1)!.rounds[0].promptSnapshot).toEqual(
    snapshot,
  );
});
