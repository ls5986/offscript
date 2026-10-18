import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";
import { activities, categories, prompts } from "../../src/domain/content";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import { bookFor, isRiffPick } from "../../src/domain/playbooks";
import { generatePrompt } from "../../src/domain/prompts";
import { gamePromptOptions } from "../../src/domain/game-prompts";
import { seededRng } from "../../src/domain/random";
import {
  chooseNextActivity,
  currentRound,
  makeSession,
} from "../../src/domain/session";
import { AppDataSchema, initialData } from "../../src/storage/model";
describe("two ways to play, one catalog", () => {
  test("every game has an actionable short rule and an original example", () => {
    for (const a of activities) {
      const b = bookFor(a);
      expect(b.instruction.length).toBeLessThan(175);
      expect(b.steps.length).toBe(2);
      expect(b.example.length).toBeGreaterThan(30);
    }
  });
  test("Riff auto-hosting chooses only curated compatible games at every count", () => {
    const prefs = UserPreferencesSchema.parse({});
    for (const count of [2, 3, 6, 12])
      for (let seed = 0; seed < 100; seed++) {
        const s = makeSession(count, "surprise", prefs, randomUUID, seed);
        const a = chooseNextActivity(s.settings, prefs, [], seededRng(seed));
        expect(isRiffPick(a)).toBe(true);
        expect(a.minPlayers).toBeLessThanOrEqual(count);
        expect(a.maxPlayers).toBeGreaterThanOrEqual(count);
        expect(a.contentRating).toBe("clean");
      }
  });
  test("the screenshot games have simpler rules and playful Riff setups", () => {
    const prefs = UserPreferencesSchema.parse({});
    const s = makeSession(2, "surprise", prefs, randomUUID, 10, [], "W4");
    const r = currentRound(s);
    expect(Object.keys(r.promptSnapshot.entries)).toEqual(["situation"]);
    expect(r.promptSnapshot.flavor).toBe("playful");
    const source = gamePromptOptions("W4", "riff").pool.find(
      (p) => p.id === r.promptSnapshot.entries.situation.id,
    )!;
    expect(source.category).toBe("situation");
    expect(r.promptSnapshot.entries.situation.text).toBe(source.text);
    expect(r.promptSnapshot.entries.situation.sourceVersion).toBe(
      source.version,
    );
    expect(r.promptSnapshot.entries.situation.openingHint).toBeUndefined();
    expect(
      bookFor(activities.find((a) => a.id === "S8")!).instruction,
    ).not.toMatch(/meaningfully|heighten|performer/);
  });
  test("Practice retains grounded prompts and every canonical activity", () => {
    const prefs = UserPreferencesSchema.parse({ playIntent: "practice" });
    for (const a of activities.filter((a) => a.contentRating === "clean")) {
      const s = makeSession(
        a.minPlayers,
        "surprise",
        prefs,
        randomUUID,
        10,
        [],
        a.id,
      );
      expect(s.settings.playIntent).toBe("practice");
      expect(currentRound(s).promptSnapshot.flavor).toBe("grounded");
    }
  });
  test("Connected playful Studio uses one surprising ingredient; locks remain exact", () => {
    const first = generatePrompt(
      {
        categories: [...categories],
        count: 2,
        style: "coherent",
        flavor: "playful",
      },
      seededRng(21),
    ).snapshot;
    expect(Object.keys(first.entries)).toHaveLength(10);
    first.entries.relationship.locked = true;
    const next = generatePrompt(
      {
        categories: [...categories],
        count: 2,
        style: "coherent",
        flavor: "grounded",
        previous: first,
      },
      seededRng(22),
    ).snapshot;
    expect(next.entries.relationship).toEqual(first.entries.relationship);
    expect(
      Object.values(first.entries).filter(
        (v) => prompts.find((p) => p.id === v.id)?.flavor === "playful",
      ),
    ).toHaveLength(1);
  });
  test("the previous version upgrades without losing sessions, names, favorites or locks", () => {
    const d = initialData();
    d.favorites = ["S8"];
    d.sessions = [
      makeSession(
        2,
        "surprise",
        d.preferences,
        randomUUID,
        5,
        ["Alex", "Sam"],
        "S8",
      ),
    ];
    const serialized = JSON.stringify(d, (key, value) =>
      ["flavor", "playIntent"].includes(key) ? undefined : value,
    );
    const restored = AppDataSchema.parse(JSON.parse(serialized));
    expect(restored.favorites).toEqual(["S8"]);
    expect(restored.sessions[0].players.map((p) => p.displayName)).toEqual([
      "Alex",
      "Sam",
    ]);
    expect(restored.sessions[0].rounds[0].promptSnapshot.entries).toEqual(
      d.sessions[0].rounds[0].promptSnapshot.entries,
    );
    expect(restored.preferences.playIntent).toBe("riff");
  });
});

test("contrast tokens meet text thresholds on tinted cards", () => {
  function luminance(hex: string) {
    const c = [0, 2, 4]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  }
  for (const [foreground, background] of [
    ["555F70", "EAE5F4"],
    ["555F70", "E4ECF3"],
    ["AA4234", "F8F6F1"],
  ]) {
    const [a, b] = [luminance(foreground), luminance(background)].sort(
      (a, b) => a - b,
    );
    expect((b + 0.05) / (a + 0.05)).toBeGreaterThanOrEqual(4.5);
  }
});

test("surprise-line cues retain the requested intent while using the approved neutral opening-line bank", () => {
  const cleanOpenings = prompts.filter(
    (p) => p.category === "opening_line" && p.contentRating === "clean",
  );
  expect(cleanOpenings.length).toBeGreaterThan(0);
  expect(cleanOpenings.every((p) => p.flavor === "grounded")).toBe(true);
  for (const playIntent of ["riff", "practice"] as const) {
    const prefs = UserPreferencesSchema.parse({ playIntent });
    const s = makeSession(2, "surprise", prefs, randomUUID, 80, [], "G9");
    const r = currentRound(s);
    expect(r.promptSnapshot.flavor).toBe(
      playIntent === "riff" ? "playful" : "grounded",
    );
    expect(r.schedule.length).toBeGreaterThan(0);
    for (const [index, cue] of r.schedule.entries()) {
      const source = cleanOpenings.find((p) => p.text === cue.text)!;
      expect(source).toBeDefined();
      expect(source.flavor).toBe("grounded");
      if (index) expect(cue.text).not.toBe(r.schedule[index - 1].text);
    }
  }
});
