import { expect, Page, test } from "@playwright/test";
import type { AppData } from "../../src/storage/model";
const another = (page: Page) =>
  page.getByRole("button", {
    name: /^(Another (word|job|place|prompt|scene|story|character)|Restart moves|Next game|Start selected game)$/,
  });
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
async function begin(page: Page, count = 2) {
  await page.goto("/play");
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .click();
  for (let i = 2; i < count; i++)
    await page
      .getByRole("button", { name: "More players", exact: true })
      .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Change game", exact: true }),
  ).toBeVisible();
}
async function menu(page: Page) {
  await page.getByRole("button", { name: "Party menu", exact: true }).click();
}
async function close(page: Page) {
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
}
async function findActivity(page: Page, activityId: string) {
  const titles: Record<string, string> = {
    P1: "Pickup Lines",
    P2: "Sex With Me Is Like",
    G2: "New Choice",
    S4: "Secret Objective",
    P5: "Terrible Advice",
    T2: "Character Hot Seat",
  };
  await menu(page);
  await page
    .getByRole("button", { name: "Play a game now", exact: true })
    .click();
  await page
    .getByRole("button", { name: titles[activityId], exact: true })
    .click();
  expect((await data(page)).sessions.at(-1)!.rounds.at(-1)!.activityId).toBe(
    activityId,
  );
}

test("Hot Seat keeps the character on the card and explains questions and optional length in help", async ({
  page,
}) => {
  await begin(page);
  await findActivity(page, "T2");
  await expect(
    page.getByText(
      "Named player: answer. Everyone else: ask short questions.",
      { exact: true },
    ),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "How to Play", exact: true }).click();
  await expect(
    page.getByText(
      "Named player: answer. Everyone else: ask short questions.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Keep going with more questions. Choose Another character or Change game when you want a fresh start.",
      {
        exact: true,
      },
    ),
  ).toBeVisible();
});

test("the plane-clapping advice card keeps its request while directions and example stay in help", async ({
  page,
}) => {
  await begin(page);
  await findActivity(page, "P5");
  await menu(page);
  await page
    .getByRole("dialog", { name: "Your party", exact: true })
    .getByRole("button", { name: "Pause", exact: true })
    .click();
  await expect
    .poll(async () => (await data(page)).sessions.at(-1)!.rounds.at(-1)!.status)
    .toBe("paused");
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("off-script", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("state", "readwrite");
      const store = tx.objectStore("state");
      const request = store.get("app");
      request.onsuccess = () => {
        const saved = request.result;
        const snapshot = saved.sessions.at(-1).rounds.at(-1).promptSnapshot;
        snapshot.entries.situation = {
          id: "prompt_situation_2055",
          text: "I clapped when the plane landed. Everyone knows.",
          locked: false,
          sourceVersion: 1,
          sourcePackVersion: "2.3.0",
          contentRating: "clean",
        };
        delete snapshot.composition;
        store.put(saved, "app");
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await page.reload();
  await expect(
    page.getByText(
      "The reader starts. Go around once; one answer or pass each.",
      { exact: true },
    ),
  ).toHaveCount(0);
  await expect(
    page.getByText("How do I live down the embarrassment?", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Separate answers, not a continuing scene. Choose another prompt after everyone has tried.",
      { exact: true },
    ),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Example reply", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "How to Play", exact: true }).click();
  const rules = page.getByRole("dialog", { name: "How to Play", exact: true });
  await expect(rules.getByText("1 answer each", { exact: true })).toBeVisible();
  await expect(
    rules.getByText("How do I live down the embarrassment?", { exact: true }),
  ).toBeVisible();
  await expect(
    rules.getByText(
      "You should tell everyone you're scouting for the national clapping team.",
      { exact: true },
    ),
  ).toBeVisible();
  expect(
    (await data(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot.entries
      .situation.text,
  ).toBe("I clapped when the plane landed. Everyone knows.");
});

test("a custom deck applies on the next card and is remembered for the next party", async ({
  page,
}) => {
  await page.goto("/party");
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await expect(
    page.getByRole("switch", { name: "Include Pickup Lines", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(
    page.getByRole("switch", {
      name: "Include Sex With Me Is Like",
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await expect(
    page.getByRole("switch", { name: "Include Pickup Lines", exact: true }),
  ).toHaveAttribute("aria-checked", "false");
  await expect(
    page.getByRole("button", { name: "Deal first card", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByText(/No selected games can be played/).first(),
  ).toBeVisible();
  await page
    .getByRole("switch", { name: "Include Character Hot Seat", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await expect
    .poll(
      async () => (await data(page)).sessions.at(-1)?.rounds.at(-1)?.activityId,
    )
    .toBe("T2");
  const before = (await data(page)).sessions.at(-1)!.rounds.at(-1)!;
  await menu(page);
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Pickup Lines", exact: true })
    .click();
  await page.getByRole("button", { name: "Save deck", exact: true }).click();
  await expect
    .poll(async () => (await data(page)).preferences)
    .toMatchObject({ selectedPartyActivityIds: ["P1"] });
  expect((await data(page)).sessions.at(-1)!.rounds.at(-1)!.id).toBe(before.id);
  await page
    .getByRole("button", { name: "Start selected game", exact: true })
    .click();
  await expect
    .poll(
      async () => (await data(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
    )
    .toBe("P1");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Change game", exact: true }),
  ).toBeVisible();
  expect((await data(page)).sessions.at(-1)!.party!.options).toMatchObject({
    selectedActivityIds: ["P1"],
  });
  await page.goto("/play");
  await page
    .getByRole("button", { name: "Start Party Night", exact: true })
    .click();
  await expect
    .poll(
      async () => (await data(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
    )
    .toBe("P1");
});

test("an adult-only custom deck can return to Clean without exposing its current card or enabling excluded games", async ({
  page,
}) => {
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Party preferences", exact: true })
    .click();
  await page.getByRole("button", { name: "18+", exact: true }).click();
  await page
    .getByRole("switch", {
      name: "Everyone is 18+ and wants adult cards",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Sex With Me Is Like", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await expect
    .poll(
      async () => (await data(page)).sessions.at(-1)?.rounds.at(-1)?.activityId,
    )
    .toBe("P2");
  await menu(page);
  await page
    .getByRole("button", { name: "Party preferences", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Return to Clean", exact: true })
    .click();
  await expect
    .poll(async () => (await data(page)).sessions.at(-1)!.party!.options.level)
    .toBe("clean");
  await expect(page.getByTestId("party-prompt")).toHaveCount(0);
  expect(
    (await data(page)).sessions.at(-1)!.party!.options.selectedActivityIds,
  ).toEqual(["P2"]);
  await expect(
    page.getByText(/No selected games can be played/).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit deck", exact: true }).click();
  await expect(
    page.getByRole("switch", {
      name: "Include Sex With Me Is Like",
      exact: true,
    }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("switch", { name: "Include Pickup Lines", exact: true })
    .click();
  await page.getByRole("button", { name: "Save deck", exact: true }).click();
  await expect
    .poll(
      async () => (await data(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
    )
    .toBe("P1");
});

test("two-player quick start, persistent controls, exact prompt save, replay, feedback, resume and end", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 320, height: 568 });
  await begin(page);
  let d = await data(page);
  let s = d.sessions.at(-1)!;
  expect(s.players.map((p) => p.displayName)).toEqual(["Player 1", "Player 2"]);
  expect(s.party).toBeTruthy();
  expect(s.settings.scoring).toBe("off");
  const next = await page
    .getByRole("button", { name: "Change game", exact: true })
    .boundingBox();
  expect(next!.y + next!.height).toBeLessThanOrEqual(568);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const a = s.rounds.at(-1)!;
  await another(page).click();
  s = (await data(page)).sessions.at(-1)!;
  expect(s.rounds.at(-1)!.activityId).toBe(a.activityId);
  expect(s.rounds.at(-1)!.performerIds).toEqual(a.performerIds);
  expect(s.rounds.at(-1)!.promptSnapshot).not.toEqual(a.promptSnapshot);
  await menu(page);
  await page.getByRole("button", { name: "Save Prompt", exact: true }).click();
  await expect(page.getByText("Prompt saved on this device.")).toBeVisible();
  await menu(page);
  await page
    .getByRole("button", { name: "New round of this game", exact: true })
    .click();
  expect((await data(page)).sessions.at(-1)!.rounds.at(-1)!.activityId).toBe(
    a.activityId,
  );
  await menu(page);
  await page
    .getByRole("button", { name: "Rate this card", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Made us laugh", exact: true })
    .click();
  expect((await data(page)).feedback).toHaveLength(1);
  await menu(page);
  await page.getByRole("button", { name: "Save & leave", exact: true }).click();
  await page
    .getByRole("button", { name: "Resume saved session", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.screenshot({
    path: "docs/screenshots/party-phone-card.png",
    fullPage: true,
  });
  await menu(page);
  await page.getByRole("button", { name: "End Session", exact: true }).click();
  await expect(
    page.getByText("That was all you.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Home", exact: true }).click();
  expect((await data(page)).sessions.at(-1)!.status).toBe("finished");
  await page.reload();
  expect((await data(page)).sessions.at(-1)!.status).toBe("finished");
  await page.goto("/saved");
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await page
    .getByRole("button", { name: "Open exact prompt", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Customize", exact: true }),
  ).toBeVisible();
  d = await data(page);
  expect(d.studio.result).toEqual(d.savedPrompts[0].snapshot);
  const prompt = d.savedPrompts[0].snapshot;
  await expect(
    page
      .getByText(
        prompt.jokeTopic?.word ?? Object.values(prompt.entries)[0].text,
        { exact: true },
      )
      .last(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("optional mixed names, turn passes, sit-out and rejoin work with one remembered group", async ({
  page,
}) => {
  await page.goto("/party");
  for (let i = 2; i < 4; i++)
    await page
      .getByRole("button", { name: "More players", exact: true })
      .click();
  await page
    .getByRole("button", { name: "Add names (optional)", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Player 1 name", exact: true })
    .fill("Alex");
  await page
    .getByRole("textbox", { name: "Player 3 name", exact: true })
    .fill("Sam");
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  let s = (await data(page)).sessions.at(-1)!;
  expect(s.players.map((p) => p.displayName)).toEqual([
    "Alex",
    "Player 2",
    "Sam",
    "Player 4",
  ]);
  await menu(page);
  await page
    .getByRole("button", { name: "Players & passes", exact: true })
    .click();
  await page.getByRole("button", { name: "Sit out Alex", exact: true }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await another(page).click();
  s = (await data(page)).sessions.at(-1)!;
  expect(s.rounds.at(-1)!.performerIds).not.toContain(s.players[0].id);
  await menu(page);
  await page
    .getByRole("button", { name: "Players & passes", exact: true })
    .click();
  await page.getByRole("button", { name: "Rejoin Alex", exact: true }).click();
  await page.getByRole("button", { name: "Pass Sam", exact: true }).click();
  await close(page);
  s = (await data(page)).sessions.at(-1)!;
  expect(s.rounds.at(-1)!.performerIds).not.toContain(s.players[2].id);
  await another(page).click();
  s = (await data(page)).sessions.at(-1)!;
  expect(s.party!.passedPlayerIds).toEqual([]);
  expect(s.players.filter((p) => !p.isSittingOut)).toHaveLength(4);
});
test("18+ needs group confirmation, adult cards can be skipped, and returning to Clean hides current adult material", async ({
  page,
}) => {
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Party preferences", exact: true })
    .click();
  await page.getByRole("button", { name: "18+", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Deal first card", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("switch", {
      name: "Everyone is 18+ and wants adult cards",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await findActivity(page, "P2");
  await page.getByRole("button", { name: "18+", exact: true }).click();
  await page
    .getByRole("button", { name: "Return to Clean", exact: true })
    .click();
  expect((await data(page)).sessions.at(-1)!.party!.options.level).toBe(
    "clean",
  );
  expect(
    (await data(page)).sessions.at(-1)!.rounds.at(-1)!.activityId,
  ).not.toBe("P2");
  for (let i = 0; i < 12; i++) {
    await another(page).click();
    expect((await data(page)).sessions.at(-1)!.party!.cards.at(-1)!.level).toBe(
      "clean",
    );
  }
});
test("private handoff covers on background and reload; New Choice has manual bell cues with speech off", async ({
  page,
}) => {
  test.setTimeout(120000);
  await begin(page, 4);
  await menu(page);
  await page.getByRole("button", { name: "Choose games", exact: true }).click();
  await page
    .getByRole("button", { name: "Select all games", exact: true })
    .click();
  await page.getByRole("button", { name: "Save deck", exact: true }).click();
  await findActivity(page, "S4");
  await page
    .getByRole("button", { name: "Pass out the roles", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reveal my role", exact: true })
    .click();
  const secret = (await data(page)).sessions.at(-1)!.rounds.at(-1)!.secrets[0]
    .text;
  await expect(page.getByText(secret, { exact: true })).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByText(secret, { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Reveal my role", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(secret, { exact: true })).toHaveCount(0);
  await page
    .getByRole("button", { name: "Pass this role", exact: true })
    .click();
  await expect(page.getByTestId("party-prompt")).toBeVisible();
  await findActivity(page, "G2");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByRole("button", { name: "New Choice!", exact: true }).click();
  await expect(page.getByTestId("party-cue")).toContainText("NEW CHOICE!");
  expect((await data(page)).sessions.at(-1)!.party!.options.sound).toBe(false);
  await menu(page);
  await close(page);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "docs/screenshots/party-phone-cue.png",
    fullPage: true,
  });
});

test("party word prompts save and reopen without turning into an empty scene", async ({
  page,
}) => {
  await begin(page);
  await findActivity(page, "P1");
  const word = (await data(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot
    .jokeTopic!.word;
  await menu(page);
  await page.getByRole("button", { name: "Save Prompt", exact: true }).click();
  await expect(
    page.getByText("Prompt saved on this device.", { exact: true }),
  ).toBeVisible();
  await page.goto("/saved");
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await page
    .getByRole("button", { name: "Open exact prompt", exact: true })
    .click();
  await expect(page.getByText("SAVED WORD", { exact: true })).toBeVisible();
  await expect(page.getByText(word, { exact: true }).last()).toBeVisible();
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(page.getByText(word, { exact: true }).last()).toBeVisible();
});

test("classroom clean hides spicy saved ingredients and resumed party material without rewriting originals", async ({
  page,
}) => {
  await page.goto("/party");
  await page
    .getByRole("button", { name: "Party preferences", exact: true })
    .click();
  await page.getByRole("button", { name: "Spicy", exact: true }).click();
  await page
    .getByRole("button", { name: "Deal first card", exact: true })
    .click();
  await findActivity(page, "P5");
  const s = (await data(page)).sessions.at(-1)!;
  expect(s.party!.cards.at(-1)!.level).toBe("spicy");
  await menu(page);
  await page.getByRole("button", { name: "Save Prompt", exact: true }).click();
  await expect(
    page.getByText("Prompt saved on this device.", { exact: true }),
  ).toBeVisible();
  await page.goto("/saved");
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await page
    .getByRole("button", { name: "Open exact prompt", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Customize", exact: true }),
  ).toBeVisible();
  const original = (await data(page)).savedPrompts[0].snapshot;
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(page).toHaveURL(/\/session\//);
  const scene = (await data(page)).sessions.at(-1)!;
  expect(scene.rounds.at(-1)!.activityId).toBe("S1");
  expect(scene.rounds.at(-1)!.promptSnapshot).toEqual(original);
  await page.goto("/settings");
  await page
    .getByRole("switch", { name: "Classroom clean", exact: true })
    .click();
  await expect
    .poll(async () => (await data(page)).preferences.classroomDefault)
    .toBe(true);
  await page.goto(`/session/${scene.id}`);
  const hidden = page.getByText(
    "This game is hidden by your current clean-content settings.",
    { exact: true },
  );
  await expect(hidden).toBeVisible();
  for (const entry of Object.values(original.entries))
    await expect(page.getByText(entry.text, { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(hidden).toBeVisible();
  expect(
    (await data(page)).sessions
      .find((session) => session.id === scene.id)!
      .rounds.at(-1)!.promptSnapshot,
  ).toEqual(original);
  await page.goto("/studio");
  await expect(
    page.getByText("This saved prompt is hidden while Classroom clean is on.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Generate clean ingredients", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await data(page)).studio.result?.entries.situation?.contentRating,
    )
    .toBe("clean");
  expect((await data(page)).savedPrompts[0].snapshot).toEqual(original);
  expect((await data(page)).studio.result).not.toEqual(original);
  await page.goto(`/party/${s.id}`);
  await expect(
    page.getByText("This card is hidden by your current content settings.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Deal an eligible card", exact: true })
    .click();
  expect(
    (await data(page)).sessions
      .find((session) => session.id === s.id)!
      .party!.cards.at(-1)!.level,
  ).toBe("clean");
});
test("silent scene cues remain visible in the fixed dock and the optional timer can be disabled", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await begin(page, 3);
  await findActivity(page, "G2");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByRole("button", { name: "New Choice!", exact: true }).click();
  const cue = page.getByTestId("party-cue");
  await expect(cue).toContainText("NEW CHOICE!");
  const box = await cue.boundingBox();
  expect(box!.y + box!.height).toBeLessThan(568);
  await menu(page);
  await page.getByRole("switch", { name: "Scene timer", exact: true }).click();
  expect((await data(page)).sessions.at(-1)!.rounds.at(-1)!.remainingMs).toBe(
    0,
  );
  await close(page);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Change game", exact: true }),
  ).toBeVisible();
});

test("default Party stays with one quick game and keeps prompt actions visible without per-answer taps", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 744 });
  await begin(page, 4);
  const first = (await data(page)).sessions.at(-1)!.rounds.at(-1)!.activityId;
  const promptIds = new Set<string>();
  for (let i = 0; i < 20; i++) {
    const s = (await data(page)).sessions.at(-1)!;
    expect(s.party!.options.includeScenes).toBe(true);
    const round = s.rounds.at(-1)!;
    expect(round.activityId).toBe(first);
    expect(["P1", "P4", "P5", "P6"]).toContain(first);
    promptIds.add(
      round.promptSnapshot.jokeTopic?.id ??
        Object.values(round.promptSnapshot.entries)[0].id,
    );
    const action = another(page);
    await expect(action).toBeVisible();
    const next = await page
      .getByRole("button", { name: "Change game", exact: true })
      .boundingBox();
    expect(next!.y + next!.height).toBeLessThanOrEqual(744);
    if (!i)
      await page.screenshot({ path: "docs/screenshots/party-simple-card.png" });
    const before = JSON.stringify(round.promptSnapshot);
    await action.click();
    await expect
      .poll(async () =>
        JSON.stringify(
          (await data(page)).sessions.at(-1)!.rounds.at(-1)!.promptSnapshot,
        ),
      )
      .not.toBe(before);
  }
  expect(promptIds.size).toBeGreaterThan(5);
});
