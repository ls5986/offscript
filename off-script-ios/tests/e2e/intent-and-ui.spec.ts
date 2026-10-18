import { enterNames } from "./helpers";
import { expect, Page, test } from "@playwright/test";
async function data(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
    });
    return new Promise<import("../../src/storage/model").AppData>((resolve) => {
      const request = db.transaction("state").objectStore("state").get("app");
      request.onsuccess = () => resolve(request.result);
    });
  });
}
async function start(page: Page, id = "G2", intent = "riff") {
  await page.goto(`/start?activity=${id}&intent=${intent}`);
  await enterNames(page);
  await page
    .getByRole("button", { name: "Let’s play this one", exact: true })
    .click();
  await page.getByRole("button", { name: "Start round", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Finish round", exact: true }),
  ).toBeVisible();
}
async function insideViewport(page: Page, label: string) {
  // React Native publishes resize updates asynchronously; retry the actual geometry.
  await expect(async () => {
    const bounds = await page
      .getByRole("button", { name: label, exact: true })
      .boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
      page.viewportSize()!.height,
    );
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
      page.viewportSize()!.width,
    );
  }).toPass({ timeout: 5000 });
}

test("fonts load as real assets; advanced practice is available through Explore Games", async ({
  page,
}) => {
  await page.goto("/play");
  await expect(
    page.getByRole("button", { name: "Start Party Night", exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 320, height: 568 });
  await insideViewport(page, "Start Party Night");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.evaluate(() =>
    Promise.all(
      ["DMSans", "DMSansMedium", "DMSansBold", "Fraunces"].map((f) =>
        document.fonts.load(`16px ${f}`),
      ),
    ),
  );
  await page.waitForFunction(() => {
    const faces = [...document.fonts].filter((f) =>
      ["DMSans", "DMSansMedium", "DMSansBold", "Fraunces"].includes(
        f.family.replaceAll('"', ""),
      ),
    );
    return faces.length === 4 && faces.every((f) => f.status === "loaded");
  });
  expect(
    await page.evaluate(
      () =>
        [...document.fonts].filter((f) =>
          ["DMSans", "DMSansMedium", "DMSansBold", "Fraunces"].includes(
            f.family.replaceAll('"', ""),
          ),
        ).length,
    ),
  ).toBe(4);
  expect(
    await page.evaluate(() =>
      [...document.fonts]
        .filter((f) =>
          ["DMSans", "DMSansMedium", "DMSansBold", "Fraunces"].includes(
            f.family.replaceAll('"', ""),
          ),
        )
        .every((f) => f.status === "loaded"),
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Explore Games", exact: true })
    .click();
  await expect(page.getByRole("button", { name: /^View / })).toHaveCount(38);
  await expect(
    page.getByRole("button", { name: "Start a practice session", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Start a practice session", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Start a practice session", exact: true })
    .click();
  await enterNames(page);
  await page.getByRole("button", { name: "Let’s play", exact: true }).click();
  expect((await data(page)).sessions.at(-1)?.settings.playIntent).toBe(
    "practice",
  );
});
test("phone controls stay on screen at small heights, with zoomed text and all details", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await start(page);
  for (const label of ["Pause", "New Choice!", "Finish round"])
    await insideViewport(page, label);
  await page.screenshot({ path: "docs/screenshots/v1-1-phone-play.png" });
  await page
    .getByRole("button", { name: "Host controls", exact: true })
    .click();
  await page.getByRole("switch", { name: "Larger text", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 568 });
  for (const label of ["Pause", "New Choice!", "Finish round"])
    await insideViewport(page, label);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "New Choice!", exact: true }).click();
  await expect(
    page.getByText(
      "Last speaker: replace only your last line. Same characters, same scene. Accept the newest line as true.",
      {
        exact: true,
      },
    ),
  ).toBeVisible();
});
test("casual story seed is playful and the technical version remains accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 744 });
  await page.goto("/start?activity=W4&intent=riff");
  await enterNames(page);
  await page
    .getByRole("button", { name: "Let’s play this one", exact: true })
    .click();
  await expect(
    page.getByText(
      "Take turns adding one sentence: “Fortunately…” then “Unfortunately…”.",
      { exact: true },
    ),
  ).toBeVisible();
  const r = (await data(page)).sessions.at(-1)!.rounds[0];
  expect(r.promptSnapshot.flavor).toBe("playful");
  await page.screenshot({ path: "docs/screenshots/v1-1-phone-intro.png" });
  await page
    .getByRole("button", { name: "Full rules & coaching", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Improv notes & full rules", exact: true })
    .click();
  await expect(page.getByText("COACHING", { exact: true })).toBeVisible();
});
test("Studio puts actual results and Generate before customization on phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 744 });
  await page.goto("/studio");
  await expect(
    page.getByRole("button", { name: "Lock Location", exact: true }),
  ).toBeVisible();
  await insideViewport(page, "Generate Again");
  await insideViewport(page, "Customize");
  const snapshot = (await data(page)).studio.result!;
  expect(Object.keys(snapshot.entries)).toEqual(["location"]);
  await expect(page.getByTestId("composed-scene")).toHaveCount(0);
  const first = await page
    .getByText(snapshot.entries.location.text, { exact: true })
    .boundingBox();
  expect(first!.y).toBeLessThan(400);
  await page.screenshot({ path: "docs/screenshots/v1-1-phone-studio.png" });
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Connected ideas", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Relationship", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Connected ideas", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Mix freely", exact: true }),
  ).toBeVisible();
});
test("the library is compact, clear about filtered counts, and retains the full catalog", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 744 });
  await page.goto("/games");
  const first = page.getByRole("button", {
    name: "View Yes, And",
    exact: true,
  });
  await expect(first).toBeVisible();
  const bounds = await first.boundingBox();
  expect(bounds!.y).toBeLessThan(430);
  await page.screenshot({ path: "docs/screenshots/v1-1-phone-library.png" });
  await expect(page.getByRole("button", { name: /^View / })).toHaveCount(38);
  await expect(
    page.getByRole("button", {
      name: "View Heighten the Pattern",
      exact: true,
    }),
  ).toBeAttached();
  await page.getByRole("button", { name: "Filter games", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Any kind", exact: true }),
  ).toBeVisible();
});
test("named roles match the actual cast, and Practice still exposes precise coaching", async ({
  page,
}) => {
  await page.goto("/start?activity=S8&intent=practice");
  await page
    .getByRole("button", { name: "Add names (optional)", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Player 1 name", exact: true })
    .fill("Alex");
  await page
    .getByRole("textbox", { name: "Player 2 name", exact: true })
    .fill("Sam");
  await enterNames(page);
  await page
    .getByRole("button", { name: "Let’s play this one", exact: true })
    .click();
  const d = await data(page);
  const s = d.sessions.at(-1)!;
  for (const role of s.rounds[0].promptSnapshot.relationship!.assignments) {
    const name = s.players.find((p) => p.id === role.playerId)!.displayName;
    await expect(
      page.getByText(`${name} · ${role.roleText}`, { exact: true }),
    ).toBeVisible();
  }
  await page
    .getByRole("button", { name: "Full rules & coaching", exact: true })
    .click();
  await expect(
    page.getByText("Improv notes & full rules", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("COACHING", { exact: true })).toBeVisible();
});
test("desktop and dark presentation use the same controls and readable theme", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/play");
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .waitFor();
  await page.screenshot({ path: "docs/screenshots/v1-1-desktop-home.png" });
  await start(page, "G3", "practice");
  await insideViewport(page, "Pause");
  await insideViewport(page, "New emotion");
  await insideViewport(page, "Finish round");
  await page.screenshot({ path: "docs/screenshots/v1-1-desktop-play.png" });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.getByRole("button", { name: "New emotion", exact: true }).click();
  await page.screenshot({ path: "docs/screenshots/v1-1-desktop-dark.png" });
});
