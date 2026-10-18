import { enterNames } from "./helpers";
import { expect, Page, test } from "@playwright/test";
import catalog from "../../src/content/v1/activities.json" with { type: "json" };
import type { AppData } from "../../src/storage/model";
async function begin(page: Page, id: string, count?: number) {
  await page.goto(`/start?activity=${id}&mode=surprise`);
  await expect(
    page.getByText("How many people are playing?", { exact: true }),
  ).toBeVisible();
  if (count) {
    const d = await readData(page);
    const min = catalog.find((a) => a.id === id)?.minPlayers ?? 2;
    for (
      let i = Math.max(min, d?.preferences.lastPlayerCount ?? 2);
      i < count;
      i++
    )
      await page
        .getByRole("button", { name: "More players", exact: true })
        .click();
  }
  await enterNames(page);
  await page
    .getByRole("button", { name: "Let’s play this one", exact: true })
    .click();
  await expect(page.getByText(/ROUND 1$/)).toBeVisible();
}
async function play(page: Page) {
  if (
    await page
      .getByRole("button", { name: "Pass out the secrets", exact: true })
      .isVisible()
  ) {
    await page
      .getByRole("button", { name: "Pass out the secrets", exact: true })
      .click();
    for (let i = 0; i < 6; i++) {
      const reveal = page.getByRole("button", { name: /Reveal my/ });
      if (!(await reveal.isVisible())) break;
      await reveal.click();
      await page
        .getByRole("button", { name: "Hide & pass", exact: true })
        .click();
    }
  }
  await page.getByRole("button", { name: "Start round", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Finish round", exact: true }),
  ).toBeVisible();
}
async function readData(page: Page): Promise<AppData> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open("off-script", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    return new Promise<AppData>((resolve, reject) => {
      const r = db.transaction("state").objectStore("state").get("app");
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  });
}
test("phone evidence, private cover on hidden tab, and restored paused game", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/play");
  await expect(
    page.getByRole("button", { name: "Start Party Night", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/phone-home.png",
    fullPage: true,
  });
  await begin(page, "S4");
  await page.getByRole("button", { name: "Pass out the secrets" }).click();
  await page.getByRole("button", { name: "Reveal my objective" }).click();
  const d = await readData(page);
  const secret = d.sessions.at(-1)!.rounds[0].secrets[0].text;
  await expect(page.getByText(secret, { exact: true })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByText(secret, { exact: true })).toHaveCount(0);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.getByRole("button", { name: "Skip this reveal" }).click();
  await page.getByRole("button", { name: "Reveal my objective" }).click();
  await page.getByRole("button", { name: "Hide & pass" }).click();
  await page.getByRole("button", { name: "Start round", exact: true }).click();
  await page.screenshot({
    path: "docs/screenshots/phone-live-game.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(secret, { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("Studio toggles, locks, rerolls, saved exact snapshot, reload and scene handoff", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/studio");
  await expect(
    page.getByRole("button", { name: "Lock Location", exact: true }),
  ).toBeVisible();
  const first = (await readData(page)).studio.result!;
  expect(Object.keys(first.entries)).toEqual(["location"]);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "Relationship", exact: true }).click();
  await page.getByRole("button", { name: "Situation", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Generate Again", exact: true })
    .click();
  const locked = (await readData(page)).studio.result!;
  expect(locked.entries.location.text).toBe(first.entries.location.text);
  await page
    .getByRole("button", { name: "Reroll Situation", exact: true })
    .click();
  const reroll = (await readData(page)).studio.result!;
  expect(reroll.entries.location).toEqual(locked.entries.location);
  expect(reroll.entries.relationship).toEqual(locked.entries.relationship);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "Emotion", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  const toggled = (await readData(page)).studio.result!;
  expect(toggled.entries.situation).toEqual(reroll.entries.situation);
  expect(toggled.entries.relationship).toEqual(reroll.entries.relationship);
  await page.getByRole("button", { name: "Save prompt", exact: true }).click();
  await page.screenshot({
    path: "docs/screenshots/phone-studio.png",
    fullPage: true,
  });
  await page.reload();
  await expect(
    page.getByText(toggled.entries.location.text, { exact: true }),
  ).toBeVisible();
  expect((await readData(page)).savedPrompts[0].snapshot).toEqual(toggled);
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(page).toHaveURL(/\/session\//);
  expect(
    (await readData(page)).sessions.at(-1)!.rounds[0].promptSnapshot,
  ).toEqual(toggled);
});
test("six-person cues, pause/resume, favorites, another round and reload", async ({
  page,
}) => {
  await begin(page, "G3", 6);
  await page
    .getByRole("button", { name: "Favorite this game", exact: true })
    .click();
  await play(page);
  await page.getByRole("button", { name: "New emotion", exact: true }).click();
  const data = await readData(page);
  expect(data.sessions.at(-1)!.players).toHaveLength(6);
  expect(data.sessions.at(-1)!.rounds[0].cue?.type).toBe("emotion_change");
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const remaining = (await readData(page)).sessions.at(-1)!.rounds[0]
    .remainingMs;
  await page.waitForTimeout(1200);
  expect((await readData(page)).sessions.at(-1)!.rounds[0].remainingMs).toBe(
    remaining,
  );
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.getByRole("button", { name: "Finish round", exact: true }).click();
  await page.getByRole("button", { name: "Next game" }).click();
  await expect(page.getByText(/ROUND 2$/)).toBeVisible();
  await expect
    .poll(async () => (await readData(page)).sessions.at(-1)!.rounds.length)
    .toBe(2);
  await page.reload();
  const restored = await readData(page);
  expect(restored.favorites).toContain("G3");
  expect(restored.sessions.at(-1)!.rounds).toHaveLength(2);
});
test("adult opt-in and classroom override filter both catalog and direct route", async ({
  page,
}) => {
  await page.goto("/games");
  await expect(
    page.getByRole("button", { name: "View Sex With Me Is Like", exact: true }),
  ).toHaveCount(0);
  await page.goto("/settings");
  await page.getByRole("switch", { name: "Optional 18+ format" }).click();
  await page
    .getByRole("button", { name: "Everyone is 18+ and agrees" })
    .click();
  await expect
    .poll(async () => (await readData(page))?.preferences.matureOptIn)
    .toBe(true);
  await page.goto("/games");
  await expect(
    page.getByRole("button", { name: "View Sex With Me Is Like", exact: true }),
  ).toBeVisible();
  await page.goto("/settings");
  await page.getByRole("switch", { name: "Classroom clean" }).click();
  await expect
    .poll(async () => (await readData(page)).preferences.classroomDefault)
    .toBe(true);
  await page.goto("/games/P2");
  await expect(
    page.getByText(
      "This optional format is hidden by your clean-content settings.",
      { exact: true },
    ),
  ).toBeVisible();
});
test("all 39 actual exported game screens start, play, finish, and replay", async ({
  page,
}) => {
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/settings");
  await page.getByRole("switch", { name: "Optional 18+ format" }).click();
  await page
    .getByRole("button", { name: "Everyone is 18+ and agrees" })
    .click();
  await expect
    .poll(async () => (await readData(page))?.preferences.matureOptIn)
    .toBe(true);
  for (const a of catalog) {
    await begin(page, a.id);
    await play(page);
    await page
      .getByRole("button", { name: "Finish round", exact: true })
      .click();
    await expect(
      page.getByText("Nice work. Ready for another?", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Replay game", exact: true })
      .click();
    await expect(page.getByText(/ROUND 2$/)).toBeVisible();
    await expect
      .poll(
        async () =>
          (await readData(page)).sessions.at(-1)!.rounds[1]?.activityId,
      )
      .toBe(a.id);
  }
  expect(errors).toEqual([]);
});
test("320 phone, tablet, desktop, large text and keyboard remain usable", async ({
  page,
}) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/play");
    await expect(
      page.getByRole("button", { name: "Start Party Night", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/settings");
  await page.getByRole("switch", { name: "Larger text" }).click();
  await expect
    .poll(async () => (await readData(page))?.preferences.useLargeText)
    .toBe(true);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/start?intent=practice");
  await enterNames(page);
  await page.getByRole("button", { name: "Let’s play", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText(/ROUND 1$/)).toBeVisible();
});
test("offline reload and play use cached local content", async ({
  page,
  context,
}) => {
  await page.goto("/play");
  await expect(
    page.getByRole("button", { name: "Start Party Night", exact: true }),
  ).toBeVisible();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.evaluate(async () => {
    if (navigator.serviceWorker.controller) return;
    await new Promise<void>((resolve) =>
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => resolve(),
        { once: true },
      ),
    );
  });
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Start Party Night", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Change game", exact: true }),
  ).toBeVisible();
  await context.setOffline(false);
});

test("eight-person classroom Studio roles and manual scoring/votes are real", async ({
  page,
}) => {
  await page.goto("/settings");
  await page
    .getByRole("switch", { name: "Classroom clean", exact: true })
    .click();
  await expect
    .poll(async () => (await readData(page))?.preferences.classroomDefault)
    .toBe(true);
  await page.goto("/studio");
  await page
    .getByRole("button", {
      name: "Customize",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Relationship", exact: true }).click();
  for (let i = 2; i < 8; i++)
    await page
      .getByRole("button", { name: "More players", exact: true })
      .click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page
    .getByRole("button", { name: "Generate Again", exact: true })
    .click();
  let d = await readData(page);
  expect(d.studio.result?.relationship?.assignments).toHaveLength(8);
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(page).toHaveURL(/\/session\//);
  d = await readData(page);
  expect(d.sessions.at(-1)!.rounds[0].performerIds).toHaveLength(8);
  expect(d.sessions.at(-1)!.rounds[0].promptSnapshot).toEqual(d.studio.result);
  await begin(page, "P1");
  await play(page);
  await page.getByRole("button", { name: "Finish round", exact: true }).click();
  await page
    .getByRole("button", { name: "Optional points · no judgment required" })
    .click();
  await page
    .getByRole("button", { name: "Players", exact: true })
    .last()
    .click();
  await page
    .getByRole("button", { name: "+1 point", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Player 1 is voting", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Vote Player 2", exact: true })
    .click();
  d = await readData(page);
  expect(d.sessions.at(-1)!.scores).toHaveLength(1);
  expect(d.sessions.at(-1)!.votes).toHaveLength(1);
});
