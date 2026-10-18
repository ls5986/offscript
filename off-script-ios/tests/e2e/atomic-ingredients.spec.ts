import { expect, test } from "@playwright/test";
import { readAppData, writeAppData } from "./storage";

test("a full old toothbrush premise upgrades only its editable Situation, never adding its relationship or prop", async ({
  page,
}) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: "Customize", exact: true }).waitFor();
  await expect
    .poll(async () => !!(await readAppData(page)).studio.result)
    .toBe(true);
  const state = await readAppData(page);
  state.preferences.matureOptIn = true;
  const original = {
    flavor: "grounded" as const,
    generationStyle: "independent" as const,
    compositionEnabled: false,
    contentPackVersion: "2.6.0",
    entries: {
      situation: {
        id: "prompt_situation_3101",
        text: "You and a casual partner both pretend not to have left a toothbrush behind.",
        sourceVersion: 1,
        sourcePackVersion: "2.6.0",
        contentRating: "mature_suggestive" as const,
        locked: false,
      },
    },
    relationship: null,
    jokeTopic: null,
  };
  state.studio = {
    ...state.studio,
    categories: ["situation"],
    composeResult: false,
    result: structuredClone(original),
    promptNavigation: undefined,
  };
  state.savedPrompts = [
    {
      id: "atomic-original",
      label: "Saved full premise",
      createdAt: "2026-10-17T20:00:00.000Z",
      playerCount: 2,
      snapshot: structuredClone(original),
    },
  ];
  await writeAppData(page, state);
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Update ingredients", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Update ingredients", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).studio.result?.entries.situation.text,
    )
    .toBe("Something was left behind. Nobody will admit it's theirs.");
  const updated = await readAppData(page);
  expect(Object.keys(updated.studio.result!.entries)).toEqual(["situation"]);
  expect(updated.studio.result!.relationship).toBeNull();
  expect(updated.studio.result!.entries.situation.contentRating).toBe("clean");
  expect(updated.savedPrompts[0].snapshot).toEqual(original);
  await expect(
    page.getByText(original.entries.situation.text, { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(page).toHaveURL(/\/session\//);
  const round = (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!;
  expect(Object.keys(round.promptSnapshot.entries)).toEqual(["situation"]);
  expect(round.promptSnapshot.relationship).toBeNull();
  expect(round.promptSnapshot.entries.situation.text).not.toMatch(
    /partner|toothbrush/i,
  );
});

test("four Studio actors keep their roles through replay, reload and new cast setup", async ({
  page,
}) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: "Customize", exact: true }).click();
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page.getByRole("button", { name: "More players", exact: true }).click();
  await page
    .getByRole("button", { name: "Relationship only", exact: true })
    .click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).studio.result!.relationship!.assignments
          .length,
    )
    .toBe(4);
  await page
    .getByRole("button", { name: "Act out this prompt", exact: true })
    .click();
  await expect(page).toHaveURL(/\/session\//);
  await page.getByRole("button", { name: "Start round", exact: true }).click();
  await page.getByRole("button", { name: "Finish round", exact: true }).click();
  await page.getByRole("button", { name: "Replay game", exact: true }).click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.performerIds
          .length,
    )
    .toBe(4);
  await page.reload();
  await page
    .getByRole("button", { name: "Host controls", exact: true })
    .click();
  await page
    .getByRole("button", { name: "New cast & setup · same game", exact: true })
    .click();
  await expect
    .poll(
      async () =>
        (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!.performerIds
          .length,
    )
    .toBe(4);
  const round = (await readAppData(page)).sessions.at(-1)!.rounds.at(-1)!;
  expect(round.promptSnapshot.relationship!.assignments).toHaveLength(4);
  expect(Object.keys(round.promptSnapshot.entries)).toEqual(["relationship"]);
});

test("an exact retired Clean original remains accessible in Classroom mode and upgrades without losing its saved words", async ({
  page,
}) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: "Customize", exact: true }).waitFor();
  await expect
    .poll(async () => !!(await readAppData(page)).studio.result)
    .toBe(true);
  const state = await readAppData(page);
  const original = {
    flavor: "playful" as const,
    generationStyle: "independent" as const,
    compositionEnabled: false,
    contentPackVersion: "1.1.0",
    entries: {
      location: {
        id: "prompt_location_074",
        text: "A wedding venue shared with a spoon convention",
        locked: true,
        sourceVersion: 1,
        sourcePackVersion: "1.1.0",
      },
    },
    relationship: null,
    jokeTopic: null,
  };
  state.preferences.classroomDefault = true;
  state.studio = {
    ...state.studio,
    categories: ["location"],
    composeResult: false,
    result: structuredClone(original),
    promptNavigation: undefined,
  };
  state.savedPrompts = [
    {
      id: "retired-clean",
      label: "Original Clean prompt",
      playerCount: 2,
      createdAt: "2026-10-17T20:00:00.000Z",
      snapshot: structuredClone(original),
    },
  ];
  await writeAppData(page, state);
  await page.goto("/saved");
  await page.getByRole("button", { name: "Prompts", exact: true }).click();
  await expect(
    page.getByText(original.entries.location.text, { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Open exact prompt", exact: true })
    .click();
  await expect(
    page.getByText(original.entries.location.text, { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Update ingredients", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Unlock Location", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Update ingredients", exact: true })
    .click();
  await expect(page.getByText("Wedding venue", { exact: true })).toBeVisible();
  const updated = await readAppData(page);
  expect(Object.keys(updated.studio.result!.entries)).toEqual(["location"]);
  expect(updated.savedPrompts[0].snapshot).toEqual(original);
});
