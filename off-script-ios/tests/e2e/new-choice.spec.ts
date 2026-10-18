import { expect, test } from "@playwright/test";

test("New Choice assigns a separate caller and plays a real bundled bell with speech off", async ({
  page,
}) => {
  const bells: { url: string; status: number }[] = [];
  page.on("response", (response) => {
    if (/new-choice-bell.*\.wav/.test(response.url()))
      bells.push({ url: response.url(), status: response.status() });
  });
  await page.addInitScript(() => {
    const original = HTMLMediaElement.prototype.play;
    (globalThis as typeof globalThis & { bellEvents: string[] }).bellEvents =
      [];
    (globalThis as typeof globalThis & { bellProgress: number }).bellProgress =
      0;
    HTMLMediaElement.prototype.play = function () {
      const isBell = this.src.includes("new-choice-bell");
      this.addEventListener(
        "playing",
        () => {
          if (this.currentSrc.includes("new-choice-bell"))
            (
              globalThis as typeof globalThis & { bellEvents: string[] }
            ).bellEvents.push(this.currentSrc);
        },
        { once: true },
      );
      this.addEventListener("timeupdate", () => {
        if (isBell) {
          const state = globalThis as typeof globalThis & {
            bellProgress: number;
          };
          state.bellProgress = Math.max(state.bellProgress, this.currentTime);
        }
      });
      return original.call(this);
    };
  });
  await page.goto("/start?activity=G2&intent=riff");
  await expect(
    page.getByRole("button", { name: "Let’s play this one", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Let’s play this one", exact: true })
    .click();
  await expect(
    page.getByText(/2.?4 actors.*caller|caller.*2.?4 actors/i).first(),
  ).toBeVisible();
  await expect(page.getByText(/Caller: Player/).first()).toBeVisible();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
    });
    await new Promise<void>((resolve) => {
      const transaction = db.transaction("state", "readwrite");
      const store = transaction.objectStore("state");
      const request = store.get("app");
      request.onsuccess = () => {
        const data = request.result;
        data.preferences.soundEnabled = false;
        store.put(data, "app");
      };
      transaction.oncomplete = () => resolve();
    });
    db.close();
  });
  await page.reload();
  await page.getByRole("button", { name: "Start round", exact: true }).click();
  await page.getByRole("button", { name: "New Choice!", exact: true }).click();
  await expect(page.getByText("NEW CHOICE!", { exact: true })).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (globalThis as typeof globalThis & { bellEvents: string[] })
            .bellEvents.length,
      ),
    )
    .toBeGreaterThan(0);
  expect(bells.some((response) => [200, 206].includes(response.status))).toBe(
    true,
  );
  const played = await page.evaluate(
    () =>
      (globalThis as typeof globalThis & { bellEvents: string[] })
        .bellEvents[0],
  );
  const asset = await page.request.get(played);
  expect(asset.status()).toBe(200);
  expect((await asset.body()).subarray(0, 4).toString()).toBe("RIFF");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (globalThis as typeof globalThis & { bellProgress: number })
            .bellProgress,
      ),
    )
    .toBeGreaterThan(0.25);
  await expect(page.getByText(/bell could not play/i)).toHaveCount(0);
});

test("Party hides caller controls and resume when four actors remain without their caller", async ({
  page,
}) => {
  await page.goto("/party");
  for (let i = 0; i < 4; i++)
    await page
      .getByRole("button", { name: "More players", exact: true })
      .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Play a game now", exact: true })
    .click();
  await page.getByRole("button", { name: "New Choice", exact: true }).click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  const caller = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
    });
    const data = await new Promise<import("../../src/storage/model").AppData>(
      (resolve) => {
        const request = db.transaction("state").objectStore("state").get("app");
        request.onsuccess = () => resolve(request.result);
      },
    );
    db.close();
    const session = data.sessions.at(-1)!;
    const round = session.rounds.at(-1)!;
    if (
      round.performerIds.length !== 4 ||
      round.supportingPlayerIds.length !== 1
    )
      throw Error("Expected four actors and a separate caller");
    return session.players.find((p) => p.id === round.supportingPlayerIds[0])!
      .displayName;
  });
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Players & passes", exact: true })
    .click();
  await page
    .getByRole("button", { name: `Pass ${caller}`, exact: true })
    .click();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(
    page.getByText(/New Choice needs 2.?4 actors and a separate caller/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New Choice!", exact: true }),
  ).toHaveCount(0);
});

test("a failed bell leaves the visual cue and explains how to recover", async ({
  page,
}) => {
  await page.route(/new-choice-bell/, (route) => route.abort());
  await page.goto("/start?activity=G2&intent=riff");
  await page
    .getByRole("button", { name: "Let’s play this one", exact: true })
    .click();
  await page.getByRole("button", { name: "Start round", exact: true }).click();
  await page.getByRole("button", { name: "New Choice!", exact: true }).click();
  await expect(page.getByText("NEW CHOICE!", { exact: true })).toBeVisible();
  await expect(
    page.getByText(/bell could not play.*volume.*audio output/i),
  ).toBeVisible({ timeout: 8000 });
});
