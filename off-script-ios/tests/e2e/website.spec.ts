import { devices, expect, test } from "@playwright/test";
import { unreadableText } from "./contrast";

for (const scheme of ["light", "dark"] as const) {
  test(`${scheme} public pages are readable at small-phone and desktop widths`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of ["/", "/privacy", "/support"]) {
        await page.goto(route);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(await unreadableText(page), `${route} at ${width}px`).toEqual(
          [],
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page
          .getByRole("link", { name: "Skip to content", exact: true })
          .focus();
        await page.keyboard.press("Enter");
        expect(new URL(page.url()).hash).toBe("#main");
      }
    }
  });
}

test("the public landing is usable without downloading the game and links to its real routes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Make it up as you go.", exact: true }),
  ).toBeVisible();
  expect(scripts).toEqual([]);
  for (const [label, path] of [
    ["Play online", "/play"],
    ["Privacy policy", "/privacy"],
    ["Support", "/support"],
  ]) {
    await expect(
      page.getByRole("link", { name: label, exact: true }).first(),
    ).toHaveAttribute("href", path);
  }
  await expect(page.getByRole("link", { name: /app store/i })).toHaveCount(0);
  await page
    .getByRole("link", { name: "Play online", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: "Start Party Night", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Studio", exact: true }).click();
  await page.getByRole("link", { name: "Play", exact: true }).click();
  await expect(page).toHaveURL(/\/play$/);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Start Party Night", exact: true }),
  ).toBeVisible();
});

test("privacy/support are real static pages, and missing assets are never SPA HTML", async ({
  page,
  request,
}) => {
  for (const [path, heading] of [
    ["/privacy", "Privacy policy"],
    ["/support", "Off Script support"],
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: heading, exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Play online", exact: true }).first(),
    ).toBeVisible();
    expect(await page.locator("script, iframe, form").count()).toBe(0);
  }
  await page.goto("/privacy");
  await expect(page.getByRole("main")).toContainText("Vercel");
  await expect(page.getByRole("main")).toContainText("TestFlight");
  await expect(page.getByRole("main")).not.toContainText(
    "intended for GitHub Pages",
  );
  await page.goto("/settings");
  await expect(
    page.getByRole("link", { name: "Privacy policy", exact: true }),
  ).toHaveAttribute("href", "/privacy");
  await expect(
    page.getByRole("link", { name: "Support", exact: true }),
  ).toHaveAttribute("href", "/support");
  const missing = await request.get("/_expo/static/js/web/does-not-exist.js");
  expect(missing.status()).toBe(404);
  const serviceWorker = await request.get("/sw.js");
  expect(serviceWorker.headers()["content-type"]).toContain("javascript");
  expect(serviceWorker.headers()["cache-control"]).toContain("no-cache");
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.headers()["content-type"]).toContain("manifest+json");
  expect(await manifest.json()).toMatchObject({
    start_url: "/play",
    scope: "/",
    display: "standalone",
  });
});

test("Android-sized Chrome can play, keep saves and reopen the app and public pages offline", async ({
  browser,
}) => {
  const context = await browser.newContext({ ...devices["Pixel 7"] });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await page
      .getByRole("link", { name: "Play online", exact: true })
      .first()
      .click();
    await page.getByRole("link", { name: "Studio", exact: true }).click();
    await page
      .getByRole("button", { name: "Save prompt", exact: true })
      .click();
    await expect(
      page.getByText("Saved exactly as you see it.", { exact: true }),
    ).toBeVisible();
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller)
        await new Promise<void>((resolve) =>
          navigator.serviceWorker.addEventListener(
            "controllerchange",
            () => resolve(),
            { once: true },
          ),
        );
    });
    await context.setOffline(true);
    for (const [route, text] of [
      ["/", "Make it up as you go."],
      ["/privacy", "Privacy policy"],
      ["/support", "Off Script support"],
    ]) {
      await page.goto(route);
      await expect(
        page.getByRole("heading", { name: text, exact: true }),
      ).toBeVisible();
    }
    await page.goto("/play");
    await expect(
      page.getByRole("button", { name: "Start Party Night", exact: true }),
    ).toBeVisible();
    await page.goto("/saved");
    await page.getByRole("button", { name: "Prompts", exact: true }).click();
    await expect(
      page
        .getByRole("button", { name: "Open exact prompt", exact: true })
        .first(),
    ).toBeVisible();
    await page.goto("/party");
    await page
      .getByRole("button", { name: "Deal first card", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Change game", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "End game", exact: true }).click();
    await page.getByRole("button", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL(/\/play$/);
    await page.reload();
    await expect(
      page.getByRole("button", { name: "Start Party Night", exact: true }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
