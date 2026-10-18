import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import {
  appendPartyCard,
  makePartySession,
  passPartyTurn,
  rerollPartyPrompt,
} from "../../src/domain/party";
import {
  currentRound,
  rapidOpening,
  transitionRound,
} from "../../src/domain/session";
import { seededRng } from "../../src/domain/random";

const now = "2026-10-17T20:00:00.000Z";
const make = (count = 2, options = {}) =>
  makePartySession(
    count,
    UserPreferencesSchema.parse({}),
    [],
    PartyOptionsSchema.parse(options),
    randomUUID,
    42,
  );
const deal = (s: ReturnType<typeof make>, recipeId?: string) =>
  appendPartyCard(s, randomUUID, now, { recipeId });
const live = (s: ReturnType<typeof make>) => {
  const round = currentRound(s);
  return {
    ...s,
    rounds: [...s.rounds.slice(0, -1), { ...round, status: "live" as const }],
  };
};

test("default Party stays with a quick-response game instead of changing mechanics on every round", () => {
  let s = make();
  const first = currentRound(s).activityId;
  expect(["P1", "P4", "P5", "P6"]).toContain(first);
  for (let i = 0; i < 12; i++) {
    s = deal(s);
    expect(currentRound(s).activityId).toBe(first);
  }
});

test("everyone can try World's Worst with the same job and no required turn acknowledgement", () => {
  let s = deal(make(6), "p4_clean");
  expect(currentRound(s).performerIds).toHaveLength(6);
  const before = structuredClone(currentRound(s));
  s = rerollPartyPrompt(s);
  expect(currentRound(s).activityId).toBe("P4");
  expect(currentRound(s).performerIds).toEqual(before.performerIds);
  expect(currentRound(s).promptSnapshot.entries.profession.id).not.toBe(
    before.promptSnapshot.entries.profession.id,
  );
});

test("a one-pass pair-only deck has a viable next scene without broadening the selected games", () => {
  let s = live(make(2, { selectedActivityIds: ["G1"] }));
  s = passPartyTurn(s, currentRound(s).performerIds[0]);
  expect(currentRound(s).performerIds).toHaveLength(1);
  const next = deal(s);
  expect(currentRound(next).activityId).toBe("G1");
  expect(currentRound(next).performerIds).toHaveLength(2);
  expect(next.party!.options.selectedActivityIds).toEqual(["G1"]);
});

test("an observer passing does not pause or alter an otherwise valid scene", () => {
  const s = live(deal(make(3), "g1_clean"));
  const observer = s.players.find(
    (p) => !currentRound(s).performerIds.includes(p.id),
  )!;
  expect(passPartyTurn(s, observer.id)).toEqual(s);
});

test("the shared transition cannot resume a scene that is missing an actor", () => {
  let s = live(make(2, { selectedActivityIds: ["G1"] }));
  s = passPartyTurn(s, currentRound(s).performerIds[0]);
  expect(() =>
    transitionRound(
      currentRound(s),
      { type: "RESUME" },
      {
        session: s,
        now,
        id: randomUUID,
        rng: seededRng(1),
      },
    ),
  ).toThrow(/players|cast|actor|rejoin/i);
});

test("quick-game starters use the captured word and grammatical articles", () => {
  const s = deal(make(), "p1_clean");
  const r = structuredClone(currentRound(s));
  r.promptSnapshot.jokeTopic = {
    id: "topic_002",
    word: "umbrella",
    contentRating: "clean",
  };
  expect(rapidOpening(r)).toBe("Are you an umbrella? Because…");
  r.promptSnapshot.jokeTopic = {
    id: "topic_002",
    word: "toaster",
    contentRating: "clean",
  };
  expect(rapidOpening(r)).toBe("Are you a toaster? Because…");
});

test("replay cannot bypass disabled scenes or a restored default game selection", () => {
  const s = deal(make(3, { selectedActivityIds: ["G2", "P1"] }), "g2_clean");
  s.party!.options.includeScenes = false;
  expect(() => appendPartyCard(s, randomUUID, now, { replay: true })).toThrow(
    /compatible|included|selected/i,
  );
  s.party!.options.includeScenes = true;
  s.party!.options.selectedActivityIds = null;
  expect(() => appendPartyCard(s, randomUUID, now, { replay: true })).toThrow(
    /compatible|included|selected/i,
  );
  expect(["P1", "P4", "P5", "P6"]).toContain(currentRound(deal(s)).activityId);
});
