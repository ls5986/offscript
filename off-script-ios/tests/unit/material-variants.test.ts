import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { advicePrompts, PACK, prompts } from "../../src/domain/content";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import {
  appendPartyCard,
  makePartySession,
  passPartyTurn,
  rerollPartyPrompt,
} from "../../src/domain/party";
import {
  PartyOptionsSchema,
  type PartyLevel,
} from "../../src/domain/party-contracts";
import { partyRecipes } from "../../src/domain/party-recipes";
import { currentRound } from "../../src/domain/session";

const now = "2026-10-17T22:00:00.000Z";
const make = (activity: string, level: PartyLevel, seed = 42) =>
  makePartySession(
    activity === "G2" ? 3 : 2,
    UserPreferencesSchema.parse({}),
    [],
    PartyOptionsSchema.parse({
      selectedActivityIds: [activity],
      level,
      adultsConfirmedAt: level === "18_plus" ? now : null,
    }),
    randomUUID,
    seed,
  );

test("first deals, repeated rounds, rerolls and preferred recipes use the strongest available category material", () => {
  for (const level of ["spicy", "18_plus"] as const)
    for (const activity of [
      "P4",
      "P5",
      "P6",
      "W1",
      "W3",
      "W4",
      "G2",
      "G8",
      "T1",
      "T2",
    ]) {
      let session = make(activity, level);
      for (let draw = 0; draw < 8; draw++) {
        const card = session.party!.cards.at(-1)!;
        expect(card.level, `${activity}/${level}`).toBe(level);
        const creative = Object.entries(
          currentRound(session).promptSnapshot.entries,
        ).filter(
          ([category]) =>
            !["relationship", "emotion", "genre"].includes(category),
        );
        expect(creative.length, activity).toBeGreaterThan(0);
        for (const [category, entry] of creative) {
          const expectedRating =
            level === "spicy" ? "spicy" : "mature_suggestive";
          expect(
            entry.contentRating,
            `${activity}/${level}/${entry.text}`,
          ).toBe(expectedRating);
          if (level === "18_plus" && category === "opening_line")
            expect([
              "That sounded a lot more sexual than I intended.",
              "I did not mean for everyone to hear that fantasy.",
              "I meant that as a sexual confession, not a practical suggestion.",
            ]).toContain(entry.text);
        }
        for (const entry of Object.values(
          currentRound(session).promptSnapshot.entries,
        )) {
          const source = (activity === "P5" ? advicePrompts : prompts).find(
            (candidate) => candidate.id === entry.id,
          )!;
          expect(entry.text).toBe(source.text);
          expect(entry.sourceVersion).toBe(source.version);
          expect(entry.sourcePackVersion).toBe(PACK);
        }
        session =
          draw % 2
            ? appendPartyCard(session, randomUUID, now, {
                recipeId: card.recipeId,
              })
            : rerollPartyPrompt(session);
      }
    }
});

test("adult scene variants are gated without hiding their Clean base activity", () => {
  for (const id of ["w1_adult", "p5_adult", "g2_adult"]) {
    const recipe = partyRecipes.find((recipe) => recipe.id === id);
    expect(recipe, id).toBeDefined();
    const clean = make(recipe!.activityId, "clean");
    expect(() =>
      appendPartyCard(clean, randomUUID, now, { recipeId: id }),
    ).toThrow(/compatible/);
    expect(clean.party!.cards.at(-1)!.level).toBe("clean");
  }
});

test("everyday noun games keep ordinary inputs instead of making the topic itself explicit", () => {
  const session = make("P2", "18_plus");
  expect(currentRound(session).promptSnapshot.jokeTopic?.contentRating).toBe(
    "clean",
  );
  expect(session.party!.cards.at(-1)!.level).toBe("18_plus");
  expect(() => make("P2", "clean")).toThrow(/selected games/);
});

test("unconfirmed adult material normalizes to Clean without enabling an adult recipe", () => {
  const session = makePartySession(
    2,
    UserPreferencesSchema.parse({}),
    [],
    PartyOptionsSchema.parse({ selectedActivityIds: ["W1"], level: "18_plus" }),
    randomUUID,
    42,
  );
  expect(session.party!.options.level).toBe("clean");
  expect(session.party!.cards.at(-1)!.level).toBe("clean");
  expect(
    currentRound(session).promptSnapshot.entries.situation.contentRating,
  ).toBe("clean");
});

test("starting another quick prompt clears one-card passes while retaining the selected material", () => {
  let session = make("P5", "spicy");
  for (const player of session.players)
    session = passPartyTurn(session, player.id);
  const previous = currentRound(session).promptSnapshot.entries.situation.id;
  session = rerollPartyPrompt(session);
  expect(session.party!.passedPlayerIds).toEqual([]);
  expect(currentRound(session).performerIds).toHaveLength(2);
  expect(currentRound(session).promptSnapshot.entries.situation.id).not.toBe(
    previous,
  );
  expect(
    currentRound(session).promptSnapshot.entries.situation.contentRating,
  ).toBe("spicy");
});

test("shuffling a selected mix does not downgrade games that have a matching stronger variant", () => {
  for (const level of ["spicy", "18_plus"] as const) {
    let session = makePartySession(
      3,
      UserPreferencesSchema.parse({}),
      [],
      PartyOptionsSchema.parse({
        selectedActivityIds: ["P4", "P5", "P6", "W1", "W3", "G2"],
        rotation: "shuffle",
        level,
        adultsConfirmedAt: level === "18_plus" ? now : null,
      }),
      randomUUID,
      42,
    );
    const games = new Set<string>();
    for (let draw = 0; draw < 30; draw++) {
      expect(session.party!.cards.at(-1)!.level).toBe(level);
      games.add(currentRound(session).activityId);
      session = appendPartyCard(session, randomUUID, now);
    }
    expect(games.size).toBe(6);
  }
});

test("canonical rated situations are reachable through actual Party generation rather than merely present in a bank", () => {
  for (const level of ["spicy", "18_plus"] as const) {
    const seen = new Set<string>();
    for (let seed = 0; seed < 500; seed++) {
      const snapshot = currentRound(make("W1", level, seed)).promptSnapshot;
      seen.add(snapshot.entries.situation.id);
    }
    const fresh = prompts.filter(
      (entry) =>
        entry.category === "situation" &&
        entry.contentRating ===
          (level === "spicy" ? "spicy" : "mature_suggestive"),
    );
    expect(fresh.length).toBeGreaterThan(0);
    expect(
      fresh.filter((entry) => seen.has(entry.id)).map((entry) => entry.id),
    ).toEqual(fresh.map((entry) => entry.id));
  }
});
