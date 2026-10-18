import { expect, test, type Page } from "@playwright/test";
import type { AppData } from "../../src/storage/model";

async function stored(page: Page): Promise<AppData> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open("off-script", 1);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    try {
      return await new Promise<AppData>((resolve, reject) => {
        const r = db.transaction("state").objectStore("state").get("app");
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
    } finally {
      db.close();
    }
  });
}

async function swipe(
  page: Page,
  direction: "left" | "right" | "vertical",
  testId = "prompt-swipe-surface",
) {
  const surface = page.getByTestId(testId);
  const studioAction = page
    .getByRole("button", { name: /^(Generate Again|Next prompt)$/ })
    .first();
  if (await studioAction.count()) await expect(studioAction).toBeEnabled();
  const box = await surface.boundingBox();
  expect(box).not.toBeNull();
  const x = box!.x + box!.width * (direction === "right" ? 0.28 : 0.72);
  const y = box!.y + Math.min(box!.height - 24, 115);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(
    x + (direction === "left" ? -130 : direction === "right" ? 130 : 5),
    y + (direction === "vertical" ? 120 : 3),
    { steps: 12 },
  );
  await page.mouse.up();
}

test("Studio swipes browse exact prompts, persist across reload, and keep ordinary taps/vertical movement inert", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  const first = (await stored(page)).studio.result!;
  await swipe(page, "left");
  await expect
    .poll(async () => (await stored(page)).studio.result!.entries.location.id)
    .not.toBe(first.entries.location.id);
  const second = (await stored(page)).studio.result!;
  await swipe(page, "right");
  await expect
    .poll(async () => (await stored(page)).studio.result)
    .toEqual(first);
  await page.reload();
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  await swipe(page, "left");
  await expect
    .poll(async () => (await stored(page)).studio.result)
    .toEqual(second);
  await page.getByText(second.entries.location.text, { exact: true }).click();
  await swipe(page, "vertical");
  expect((await stored(page)).studio.result).toEqual(second);
  await page
    .getByRole("button", { name: "Previous prompt", exact: true })
    .click();
  await expect
    .poll(async () => (await stored(page)).studio.result)
    .toEqual(first);
});

test("quick Party swipes preserve the exact round, roster and game, with button alternatives", async ({
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
  const first = (await stored(page)).sessions.at(-1)!;
  await swipe(page, "left");
  await expect
    .poll(
      async () =>
        (await stored(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot
          .entries.profession.id,
    )
    .not.toBe(first.rounds.at(-1)!.promptSnapshot.entries.profession.id);
  const second = (await stored(page)).sessions.at(-1)!;
  await swipe(page, "right");
  await expect
    .poll(
      async () =>
        (await stored(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot,
    )
    .toEqual(first.rounds.at(-1)!.promptSnapshot);
  await page.reload();
  await page
    .getByRole("button", { name: "Next prompt", exact: true })
    .waitFor();
  await swipe(page, "left");
  await expect
    .poll(
      async () =>
        (await stored(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot,
    )
    .toEqual(second.rounds.at(-1)!.promptSnapshot);
  const current = (await stored(page)).sessions.at(-1)!;
  expect(current.rounds.at(-1)!.id).toBe(first.rounds.at(-1)!.id);
  expect(current.players).toEqual(first.players);
  expect(current.rounds.at(-1)!.activityId).toBe("P4");
  await expect(
    page.getByRole("button", { name: "Previous prompt", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByRole("button", { name: "Another job", exact: true }),
  ).toBeVisible();
});

test("configuration edits reset Studio browsing rather than undoing a lock or restoring deselected categories", async ({
  page,
}) => {
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Generate Again", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Previous prompt", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Previous prompt", exact: true }),
  ).toBeDisabled();
  const locked = (await stored(page)).studio.result!.entries.location;
  await swipe(page, "left");
  expect((await stored(page)).studio.result!.entries.location).toEqual(locked);
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "Relationship", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Previous prompt", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Unlock Location", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Previous prompt", exact: true }),
  ).toBeDisabled();
});

test("touchscreen swipes work while screen-edge gestures, short drags and nested controls do not reroll", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  const first = (await stored(page)).studio.result!;
  const cdp = await context.newCDPSession(page);
  const gesture = async (
    x: number,
    y: number,
    dx: number,
    dy: number,
    fingers = 1,
  ) => {
    const points = (progress: number) =>
      Array.from({ length: fingers }, (_, id) => ({
        x: x + dx * progress + id * 16,
        y: y + dy * progress,
        id,
      }));
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: points(0),
    });
    for (let index = 1; index <= 10; index++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: points(index / 10),
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  };
  const box = (await page.getByTestId("prompt-swipe-surface").boundingBox())!;
  const y = box.y + box.height - 28;
  await gesture(box.x + box.width * 0.75, y, -135, 2);
  await expect
    .poll(async () => (await stored(page)).studio.result!.entries.location.id)
    .not.toBe(first.entries.location.id);
  const second = (await stored(page)).studio.result!;
  await gesture(box.x + box.width * 0.25, y, 135, 2);
  await expect
    .poll(async () => (await stored(page)).studio.result)
    .toEqual(first);
  await gesture(box.x + box.width * 0.75, y, -35, 0);
  expect((await stored(page)).studio.result).toEqual(first);
  const primary = { x: box.x + box.width * 0.75, y, id: 0 };
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [primary],
  });
  const end = { ...primary, x: primary.x - 130 };
  for (let step = 1; step <= 10; step++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ ...primary, x: primary.x - step * 13 }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [end, { x: end.x + 20, y, id: 1 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [end],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(
    page.getByRole("button", { name: "Next prompt", exact: true }),
  ).toBeEnabled();
  expect((await stored(page)).studio.result).toEqual(first);
  await gesture(21, y, 130, 2);
  expect((await stored(page)).studio.result).toEqual(first);
  await gesture(box.x + box.width * 0.55, y, -130, 1, 2);
  expect((await stored(page)).studio.result).toEqual(first);
  const lock = (await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .boundingBox())!;
  await gesture(lock.x + 20, lock.y + 20, -130, 1);
  expect((await stored(page)).studio.result).toEqual(first);
  await gesture(box.x + box.width * 0.75, y, -135, 2);
  await expect
    .poll(async () => (await stored(page)).studio.result)
    .toEqual(second);
  await context.close();
});

test("touch dragging vertically still scrolls long Studio output without changing its words", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 664 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  for (const name of ["Relationship", "Profession", "Action", "Emotion"])
    await page.getByRole("button", { name, exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  const before = (await stored(page)).studio.result!;
  const surface = page.getByTestId("prompt-swipe-surface");
  const originalY = (await surface.boundingBox())!.y;
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 170, y: 420, id: 0 }],
  });
  for (let step = 1; step <= 12; step++)
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 173, y: 420 - step * 14, id: 0 }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(async () => (await surface.boundingBox())!.y)
    .toBeLessThan(originalY - 40);
  expect((await stored(page)).studio.result).toEqual(before);
  await context.close();
});

test("modal controls and active New Choice scenes cannot trigger prompt browsing", async ({
  page,
}) => {
  await page.goto("/studio");
  await page
    .getByRole("button", { name: "Lock Location", exact: true })
    .waitFor();
  const first = (await stored(page)).studio.result!;
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  const header = (await page
    .getByRole("dialog", { name: "Your scene recipe", exact: true })
    .boundingBox())!;
  await page.mouse.move(header.x + header.width - 80, header.y + 110);
  await page.mouse.down();
  await page.mouse.move(header.x + 40, header.y + 112, { steps: 10 });
  await page.mouse.up();
  expect((await stored(page)).studio.result).toEqual(first);
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await page.goto("/party");
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Change game", exact: true }).click();
  await page.getByRole("button", { name: "New Choice", exact: true }).click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  const before = (await stored(page)).sessions.at(-1)!;
  await swipe(page, "left");
  await swipe(page, "right");
  const after = (await stored(page)).sessions.at(-1)!;
  expect(after.rounds.at(-1)!.id).toBe(before.rounds.at(-1)!.id);
  expect(after.rounds.at(-1)!.promptSnapshot).toEqual(
    before.rounds.at(-1)!.promptSnapshot,
  );
  expect(after.rounds.at(-1)!.cueIndex).toBe(before.rounds.at(-1)!.cueIndex);
  expect(after.party!.cursor).toBe(before.party!.cursor);
  await expect(
    page.getByRole("button", { name: "Previous prompt", exact: true }),
  ).toHaveCount(0);
});
