import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import {
  appendPartyCard,
  makePartySession,
  normalizePartyOptions,
  rerollPartyPrompt,
} from "../../src/domain/party";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import { partyGuidance, partyInstruction } from "../../src/domain/playbooks";
import { partyRecipes } from "../../src/domain/party-recipes";
import { advicePrompts } from "../../src/domain/content";
import { adviceFor, adviceRequests } from "../../src/domain/party-advice";
import { emptyPrompt } from "../../src/domain/prompts";
import {
  currentRound,
  SessionSnapshotSchema,
  transitionRound,
} from "../../src/domain/session";
import { seededRng } from "../../src/domain/random";
import { AppDataSchema, initialData } from "../../src/storage/model";

const now = "2026-10-17T06:00:00.000Z";
const make = (selectedActivityIds: string[], extra = {}, count = 2) =>
  makePartySession(
    count,
    UserPreferencesSchema.parse({}),
    [],
    PartyOptionsSchema.parse({ selectedActivityIds, ...extra }),
    randomUUID,
    42,
  );
const next = (session: ReturnType<typeof make>, recipeId?: string) =>
  appendPartyCard(session, randomUUID, now, { recipeId });

test("Hot Seat says the character answers questions rather than ending after an introduction", () => {
  expect(partyInstruction({ id: "T2" })).toMatch(/answer questions/i);
});

test("every supported Party game explains participation and when to move on", () => {
  for (const recipe of partyRecipes) {
    const guidance = partyGuidance({ id: recipe.activityId });
    expect(guidance.participation.length).toBeGreaterThan(0);
    expect(guidance.finish).toContain("Change game");
  }
  expect(partyGuidance({ id: "P4" }).participation).toMatch(
    /one separate line|tiny demonstration/,
  );
  expect(partyGuidance({ id: "W1" }).participation).toContain("same story");
  expect(partyGuidance({ id: "S6" }).finish).toContain("third line");
  expect(partyGuidance({ id: "W6" }).participation).toContain(
    "last word spoken",
  );
  expect(() => partyGuidance({ id: "missing" })).toThrow(
    /Missing Party instructions/,
  );
});

test("Party suggests a starting length without telling players they must stop", () => {
  const limits = {
    P5: "1 answer each",
    P4: "1 answer each",
    T2: "3 questions total",
    G8: "60 seconds",
    W1: "2 turns each",
    W2: "1 sentence, up to 12 words",
    S6: "3 lines total",
    W5: "3 moves per leader",
  };
  for (const [id, roundLimit] of Object.entries(limits))
    expect(partyGuidance({ id })).toMatchObject({ roundLimit });
  for (const recipe of partyRecipes)
    expect(partyGuidance({ id: recipe.activityId }).finish).toMatch(
      /keep (going|playing)/i,
    );
  expect(partyInstruction({ id: "S6" })).not.toMatch(/then stop/i);
});

test("Three-Line Scene stays live beyond three turns and the suggested starting length", () => {
  const session = next(make(["S6"]), "s6_clean");
  const context = { session, now, rng: seededRng(1), id: randomUUID };
  let round = transitionRound(
    currentRound(session),
    { type: "READY" },
    context,
  );
  round = transitionRound(round, { type: "START" }, context);
  for (let turn = 0; turn < 6; turn++)
    round = transitionRound(round, { type: "NEXT_TURN" }, context);
  for (let second = 0; second < 140; second++)
    round = transitionRound(round, { type: "TICK", deltaMs: 1000 }, context);
  expect(round.status).toBe("live");
  expect(round.turn).toBe(6);
  expect(round.activityId).toBe("S6");
  expect(round.elapsedMs).toBe(140000);
  expect(round.completedAt).toBeNull();
  expect(round.promptSnapshot).toEqual(currentRound(session).promptSnapshot);
});

test("all 60 advice situations preserve the old 28 requests and add matching harmless examples", () => {
  const pool = advicePrompts;
  expect(pool).toHaveLength(60);
  expect(
    pool.filter((prompt) => Number(prompt.id.split("_").at(-1)) < 3000),
  ).toHaveLength(28);
  expect(new Set(Object.keys(adviceRequests))).toEqual(
    new Set(pool.map((prompt) => prompt.id)),
  );
  for (const prompt of pool) {
    const snapshot = {
      ...emptyPrompt(),
      entries: {
        situation: { id: prompt.id, text: prompt.text, locked: true },
      },
    };
    const original = structuredClone(snapshot);
    const request = adviceFor(snapshot)!;
    expect(request.question.endsWith("?")).toBe(true);
    expect(request.example).toMatch(/^You should /);
    expect(snapshot).toEqual(original);
  }
  expect(adviceRequests.prompt_situation_2055.question).toBe(
    "How do I live down the embarrassment?",
  );
});

test("unrecognized saved advice originals are not given a mismatched invented request", () => {
  expect(adviceFor(emptyPrompt())).toBeNull();
  expect(
    adviceFor({
      ...emptyPrompt(),
      entries: {
        situation: {
          id: "prompt_situation_2055",
          text: "My own unrelated saved problem.",
          locked: false,
        },
      },
    }),
  ).toBeNull();
});

test("a one-game deck keeps dealing that game instead of falling back to the default mix", () => {
  let session = make(["T2"]);
  for (let i = 0; i < 50; i++) {
    expect(currentRound(session).activityId).toBe("T2");
    session = next(session);
  }
});

test("a scenes-only selection never has quick games forced into its rotation", () => {
  let session = make(["G2"], {}, 3);
  for (let i = 0; i < 20; i++) {
    expect(currentRound(session).activityId).toBe("G2");
    session = next(session);
  }
});

test("an explicitly selected private-role game can be dealt without entering the default mix", () => {
  expect(currentRound(make(["S4"])).activityId).toBe("S4");
});

test("selected games still obey group size and content restrictions", () => {
  let session = make(["P1", "P2", "G11"]);
  for (let i = 0; i < 15; i++) {
    expect(currentRound(session).activityId).toBe("P1");
    session = next(session);
  }
});

test("empty, unsupported and currently unplayable selections fail explicitly without restoring other games", () => {
  for (const selection of [[], ["missing"], ["missing", "P1"], ["G11"], ["P2"]])
    expect(() => make(selection)).toThrow(
      /selected games|supported.*Party Night/i,
    );
  expect(() => make(["G2"], { includeScenes: false })).toThrow(
    /selected games/i,
  );
});

test("classroom normalization keeps the selection instead of replacing it with an unrestricted deck", () => {
  const options = normalizePartyOptions(
    PartyOptionsSchema.parse({
      selectedActivityIds: ["P2"],
      level: "18_plus",
      adultsConfirmedAt: now,
    }),
    true,
  );
  expect(() =>
    makePartySession(
      2,
      UserPreferencesSchema.parse({}),
      [],
      options,
      randomUUID,
      42,
    ),
  ).toThrow(/selected games/i);
});

test("manual choice and replay cannot sneak an excluded game back into the deck", () => {
  const session = make(["T2"]);
  expect(() => next(session, "p4_clean")).toThrow(/compatible|selected/i);
  session.party!.options = PartyOptionsSchema.parse({
    selectedActivityIds: ["W6"],
  });
  const before = structuredClone(currentRound(session));
  expect(currentRound(rerollPartyPrompt(session)).activityId).toBe("T2");
  expect(currentRound(session)).toEqual(before);
  expect(() =>
    appendPartyCard(session, randomUUID, now, { replay: true }),
  ).toThrow(/compatible|selected/i);
  expect(currentRound(next(session)).activityId).toBe("W6");
});

test("custom selections survive aggregate and session JSON round trips", () => {
  const data = initialData();
  data.preferences = UserPreferencesSchema.parse({
    selectedPartyActivityIds: ["T2"],
  });
  data.sessions = [make(["T2"])];
  const restored = AppDataSchema.parse(JSON.parse(JSON.stringify(data)));
  expect(restored.preferences).toMatchObject({
    selectedPartyActivityIds: ["T2"],
  });
  expect(restored.sessions[0].party!.options).toMatchObject({
    selectedActivityIds: ["T2"],
  });
  expect(currentRound(next(restored.sessions[0])).activityId).toBe("T2");
});

test("legacy party options still restore, while duplicate selection IDs are rejected", () => {
  const old = JSON.parse(JSON.stringify(make(["T2"])));
  delete old.party.options.selectedActivityIds;
  expect(SessionSnapshotSchema.parse(old).party!.options).toMatchObject({
    selectedActivityIds: null,
  });
  expect(
    PartyOptionsSchema.safeParse({ selectedActivityIds: ["T2", "T2"] }).success,
  ).toBe(false);
});
