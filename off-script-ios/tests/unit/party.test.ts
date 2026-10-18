import { randomUUID } from "node:crypto";
import { describe, expect, test } from "vitest";
import { activities, advicePrompts, prompts } from "../../src/domain/content";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import {
  appendPartyCard,
  makePartySession,
  normalizePartyOptions,
  partyCardAllowed,
  passPartyTurn,
  rerollPartyPrompt,
  setPartySittingOut,
  editPartyRoster,
  partyTurnPlayer,
  nextPartyTurn,
} from "../../src/domain/party";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import {
  activityExperiences,
  partyRecipes,
} from "../../src/domain/party-recipes";
import { generatePrompt } from "../../src/domain/prompts";
import { seededRng } from "../../src/domain/random";
import {
  currentRound,
  restoreSession,
  SessionSnapshotSchema,
  transitionRound,
} from "../../src/domain/session";
import { AppDataSchema, initialData } from "../../src/storage/model";
const prefs = UserPreferencesSchema.parse({});
const now = "2026-10-16T17:00:00.000Z";
const mixedOptions = {
  rotation: "shuffle",
  selectedActivityIds: [
    ...new Set(
      partyRecipes
        .filter(
          (recipe) =>
            recipe.level === "clean" && recipe.pattern !== "PRIVATE_ROLE",
        )
        .map((recipe) => recipe.activityId),
    ),
  ],
};
const make = (count = 4, extra = {}) =>
  makePartySession(
    count,
    prefs,
    [],
    PartyOptionsSchema.parse(extra),
    randomUUID,
    42,
  );
const next = (s: ReturnType<typeof make>, recipeId?: string) =>
  appendPartyCard(s, randomUUID, now, { recipeId });
describe("hosted Party Night", () => {
  test("seeded selection is reproducible, supports 2–12, and stays within content and movement limits", () => {
    for (let count = 2; count <= 12; count++) {
      let a = make(count, mixedOptions);
      let b = make(count, mixedOptions);
      expect(a.players.map((p) => p.displayName)).toEqual(
        Array.from({ length: count }, (_, i) => `Player ${i + 1}`),
      );
      for (let i = 0; i < 40; i++) {
        a = next(a);
        b = next(b);
        expect(a.party?.cards.at(-1)?.recipeId).toBe(
          b.party?.cards.at(-1)?.recipeId,
        );
        const r = currentRound(a);
        const activity = activities.find((x) => x.id === r.activityId)!;
        expect(activity.energy).toBe("seated");
        expect(a.party?.cards.at(-1)?.level).toBe("clean");
        expect(r.activityId).not.toBe(a.rounds.at(-2)?.activityId);
        expect(
          [...r.performerIds, ...r.supportingPlayerIds].length,
        ).toBeGreaterThan(0);
        expect(
          new Set([...r.performerIds, ...r.supportingPlayerIds]).size,
        ).toBe(r.performerIds.length + r.supportingPlayerIds.length);
        for (const e of Object.values(r.promptSnapshot.entries))
          expect(
            (r.activityId === "P5" ? advicePrompts : prompts).find(
              (p) => p.id === e.id && p.text === e.text,
            )?.contentRating,
          ).toBe("clean");
      }
      expect(new Set(a.rounds.map((r) => r.activityId)).size).toBeGreaterThan(
        10,
      );
      SessionSnapshotSchema.parse(a);
    }
  });
  test("all nine reusable participation patterns have viable recipes; all 39 games have explicit metadata", () => {
    expect(new Set(partyRecipes.map((r) => r.pattern)).size).toBe(9);
    expect(Object.keys(activityExperiences)).toHaveLength(39);
    for (const recipe of partyRecipes) {
      const s = next(
        make(6, { movement: true, level: "18_plus", adultsConfirmedAt: now }),
        recipe.id,
      );
      expect(currentRound(s).activityId).toBe(recipe.activityId);
      expect(s.party?.cards.at(-1)?.pattern).toBe(recipe.pattern);
      if (recipe.pattern === "PRIVATE_ROLE")
        expect(currentRound(s).secrets.map((x) => x.playerId)).toEqual(
          currentRound(s).performerIds,
        );
      if (recipe.activityId === "G8") {
        expect(currentRound(s).performerIds).toHaveLength(1);
        expect(currentRound(s).supportingPlayerIds).toHaveLength(1);
      }
    }
  });
  test("consecutive long scenes are avoided and skipped activities do not immediately repeat", () => {
    let s = next(make(6, mixedOptions), "g2_clean");
    for (let i = 0; i < 50; i++) {
      const before = s.party!.cards.at(-1)!;
      s = appendPartyCard(s, randomUUID, now, { skip: i % 3 === 0 });
      const after = s.party!.cards.at(-1)!;
      expect(currentRound(s).activityId).not.toBe(s.rounds.at(-2)?.activityId);
      if (
        [
          "PAIR",
          "SMALL_GROUP",
          "TIMED_SCENE",
          "CUED_SCENE",
          "PRIVATE_ROLE",
        ].includes(before.pattern)
      )
        expect([
          "ALL_PLAY",
          "TURN_BASED",
          "OPEN_MIC",
          "SINGLE_PLAYER",
        ]).toContain(after.pattern);
    }
  });
  test("single-player opportunities and pairs rotate fairly without charging skipped cards", () => {
    let s = make(6);
    const singles: string[] = [];
    for (let i = 0; i < 18; i++) {
      s = next(s, "t2_clean");
      singles.push(currentRound(s).performerIds[0]);
    }
    const counts = s.players.map(
      (p) => singles.filter((id) => id === p.id).length,
    );
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
    s = make(6);
    const pairs: string[] = [];
    for (let i = 0; i < 12; i++) {
      s = next(s, "g1_clean");
      const r = currentRound(s);
      // Scenes must actually start to count as opportunities in shared exposure.
      r.startedAt = now;
      r.status = "live";
      pairs.push([...r.performerIds].sort().join("/"));
    }
    expect(new Set(pairs).size).toBeGreaterThanOrEqual(9);
    const before = currentRound(s).performerIds;
    const skipped = appendPartyCard(s, randomUUID, now, {
      skip: true,
      recipeId: "p4_clean",
    });
    expect(skipped.rounds.at(-2)?.status).toBe("skipped");
    expect(before).toHaveLength(2);
  });
  test("one-card passes can recover a pair; durable sit-out and rejoin preserve the roster", () => {
    let s = next(make(2), "g1_clean");
    const pid = currentRound(s).performerIds[0];
    s = passPartyTurn(s, pid);
    s = next(s);
    expect(currentRound(s).performerIds).toHaveLength(2);
    expect(s.party!.passedPlayerIds).toEqual([]);
    expect(() => setPartySittingOut(s, pid, true)).toThrow(/two people/);
    s = make(5);
    const roster = s.players.map((p) => p.id);
    s = setPartySittingOut(s, roster[0], true);
    s = next(s);
    expect(currentRound(s).performerIds).not.toContain(roster[0]);
    expect(s.settings.playerCount).toBe(4);
    s = setPartySittingOut(s, roster[0], false);
    expect(s.players.map((p) => p.id)).toEqual(roster);
    expect(s.settings.playerCount).toBe(5);
  });
  test("reroll preserves game, players and private secrets; replay preserves game", () => {
    for (const recipe of ["p1_clean", "p4_clean", "g2_clean", "s4_clean"]) {
      let s = next(make(), recipe);
      const r = structuredClone(currentRound(s));
      s = rerollPartyPrompt(s);
      expect(currentRound(s).activityId).toBe(r.activityId);
      expect(currentRound(s).performerIds).toEqual(r.performerIds);
      expect(currentRound(s).secrets).toEqual(r.secrets);
      expect(currentRound(s).promptSnapshot).not.toEqual(r.promptSnapshot);
      s = appendPartyCard(s, randomUUID, now, { replay: true });
      expect(currentRound(s).activityId).toBe(r.activityId);
    }
  });
  test("18+ needs fresh affirmative group opt-in; classroom and return to Clean block resumed cards", () => {
    expect(
      normalizePartyOptions(PartyOptionsSchema.parse({ level: "18_plus" }))
        .level,
    ).toBe("clean");
    let s = make(4, { level: "spicy" });
    expect(() => next(s, "p2_adult")).toThrow(/compatible/);
    s = next(make(4, { level: "18_plus", adultsConfirmedAt: now }), "p2_adult");
    expect(partyCardAllowed(s, false)).toBe(true);
    expect(partyCardAllowed(s, true)).toBe(false);
    s.party!.options.level = "clean";
    expect(partyCardAllowed(s, false)).toBe(false);
    expect(() => next(s, "p2_adult")).toThrow(/compatible/);
    s = next(make(4, { level: "spicy" }), "w4_spicy");
    expect(currentRound(s).promptSnapshot.entries.situation.text).toBeTruthy();
    expect(
      prompts.find(
        (p) => p.id === currentRound(s).promptSnapshot.entries.situation.id,
      )?.contentRating,
    ).toBe("spicy");
    s.party!.options.level = "clean";
    expect(partyCardAllowed(s, false)).toBe(false);
    for (let seed = 0; seed < 100; seed++) {
      const snapshot = generatePrompt(
        {
          categories: ["situation"],
          count: 2,
          style: "independent",
          flavor: "playful",
        },
        seededRng(seed),
      ).snapshot;
      expect(
        prompts.find((p) => p.id === snapshot.entries.situation.id)
          ?.contentRating,
      ).toBe("clean");
    }
  });
  test("cues work manually and automatically without sound; timer completion leaves the current card live", () => {
    let s = next(make(2, { sound: false }), "g3_clean");
    let r = currentRound(s);
    const ctx = { session: s, now, rng: seededRng(12), id: randomUUID };
    r = transitionRound(r, { type: "READY" }, ctx);
    r = transitionRound(r, { type: "START" }, ctx);
    r = transitionRound(r, { type: "CALL_CUE" }, ctx);
    expect(r.cue?.type).toBe("emotion_change");
    for (let i = 0; i < 140; i++)
      r = transitionRound(r, { type: "TICK", deltaMs: 1000 }, ctx);
    expect(r.status).toBe("live");
    expect(r.remainingMs).toBe(0);
    expect(r.cueIndex).toBeGreaterThan(4);
    expect(r.activityId).toBe("G3");
    s = { ...s, rounds: [...s.rounds.slice(0, -1), r] };
    expect(currentRound(restoreSession(s)).status).toBe("paused");
  });
  test("legacy data gets defaults, deck snapshots round-trip, and finished sessions remain finished", () => {
    const d = initialData();
    const old = structuredClone(d) as Partial<typeof d>;
    delete old.feedback;
    expect(AppDataSchema.parse(old).feedback).toEqual([]);
    d.sessions = [make(12, { level: "spicy" })];
    const parsed = AppDataSchema.parse(JSON.parse(JSON.stringify(d)));
    expect(parsed).toEqual(d);
    const finished = { ...d.sessions[0], status: "finished" as const };
    expect(appendPartyCard(finished, randomUUID, now)).toEqual(finished);
    expect(restoreSession(finished).status).toBe("finished");
  });
});

test("quick decks never automatically select timed scenes or private handoffs, with scenes still available on request", () => {
  let s = make(4, { includeScenes: false });
  for (let i = 0; i < 100; i++) {
    const r = currentRound(s);
    expect(r.status).toBe("live");
    expect(r.remainingMs).toBe(0);
    expect(r.secrets).toEqual([]);
    s = next(s);
  }
  expect(() => next(s, "g2_clean")).toThrow(/compatible/);
  s.party!.options.includeScenes = true;
  s = next(s, "g2_clean");
  expect(currentRound(s).activityId).toBe("G2");
  const cards: string[] = [];
  for (let i = 0; i < 100; i++) {
    s = next(s);
    cards.push(s.party!.cards.at(-1)!.pattern);
  }
  expect(cards).toContain("CUED_SCENE");
});

test("explicitly shuffled mixed games include short scenes within five cards", () => {
  for (const count of [2, 4, 12]) {
    let s = make(count, mixedOptions);
    expect(s.party!.options.includeScenes).toBe(true);
    for (let i = 0; i < 20; i++) s = next(s);
    for (let i = 0; i < s.party!.cards.length - 4; i++)
      expect(
        s
          .party!.cards.slice(i, i + 5)
          .some((c) =>
            [
              "PAIR",
              "SMALL_GROUP",
              "CUED_SCENE",
              "TIMED_SCENE",
              "PRIVATE_ROLE",
            ].includes(c.pattern),
          ),
      ).toBe(true);
  }
});
test("player edits retain archived identities, prompts, locks and names; changed groups return to Clean", () => {
  let s = next(
    make(4, { level: "18_plus", adultsConfirmedAt: now }),
    "g2_clean",
  );
  const old = structuredClone(s.rounds);
  // Version 1.2 cards did not yet capture names; the edit preserves their pre-edit roster.
  s.party!.cards.forEach((card) => {
    delete card.playerNames;
  });
  const originalIds = s.players.map((p) => p.id);
  const renamed = editPartyRoster(
    s,
    s.players.map((p, i) => ({ id: p.id, name: i ? p.displayName : "Alex" })),
    randomUUID,
    now,
  );
  expect(renamed.rounds).toEqual(old);
  expect(renamed.party!.cards[0].playerNames![originalIds[0]]).toBe("Player 1");
  expect(renamed.players[0].id).toBe(originalIds[0]);
  expect(renamed.party!.options.level).toBe("18_plus");
  s = editPartyRoster(
    renamed,
    [
      { id: originalIds[0], name: "Alex" },
      { id: originalIds[2], name: "Sam" },
      { name: "Meghan" },
    ],
    randomUUID,
    now,
  );
  expect(s.players.map((p) => p.displayName)).toEqual([
    "Alex",
    "Sam",
    "Meghan",
  ]);
  expect(s.players.map((p) => p.seatIndex)).toEqual([0, 1, 2]);
  expect(s.party!.archivedPlayers.map((p) => p.id)).toEqual([
    originalIds[1],
    originalIds[3],
  ]);
  expect(s.rounds[0]).toEqual(old[0]);
  expect(s.rounds.at(-2)!.promptSnapshot).toEqual(old.at(-1)!.promptSnapshot);
  expect(s.rounds.at(-2)!.performerIds).toEqual(old.at(-1)!.performerIds);
  expect(s.party!.options.level).toBe("clean");
  expect(s.party!.options.adultsConfirmedAt).toBe(null);
  expect(s.teams).toHaveLength(2);
  expect(s.teams.flatMap((t) => t.playerIds).sort()).toEqual(
    s.players.map((p) => p.id).sort(),
  );
  SessionSnapshotSchema.parse(s);
  expect(() =>
    editPartyRoster(
      s,
      [
        { id: originalIds[0], name: "A" },
        { id: originalIds[0], name: "B" },
      ],
      randomUUID,
      now,
    ),
  ).toThrow(/out of date/);
});
test("named turn passing keeps the story beat and next turn advances once", () => {
  let s = next(make(4), "w4_clean");
  const first = partyTurnPlayer(s)!;
  s = passPartyTurn(s, first.id);
  expect(partyTurnPlayer(s)!.id).not.toBe(first.id);
  expect(currentRound(s).turn).toBe(0);
  const second = partyTurnPlayer(s)!.id;
  s = nextPartyTurn(s, randomUUID, now);
  expect(currentRound(s).turn).toBe(1);
  expect(partyTurnPlayer(s)!.id).not.toBe(second);
  const current = partyTurnPlayer(s)!.id;
  const other = currentRound(s).performerIds.find((pid) => pid !== current)!;
  s = passPartyTurn(s, other);
  expect(partyTurnPlayer(s)!.id).toBe(current);
});
test("optional team turns alternate on suitable cards without scoring or affecting other games", () => {
  let s = make(6, { teams: true });
  const turns: (string | undefined)[] = [];
  for (let i = 0; i < 8; i++) {
    s = next(s, "p1_clean");
    const card = s.party!.cards.at(-1)!;
    turns.push(card.teamId);
    expect(currentRound(s).performerIds).toEqual(
      s.teams.find((t) => t.id === card.teamId)!.playerIds,
    );
  }
  expect(new Set(turns).size).toBe(2);
  expect(turns.every((id, i) => !i || id !== turns[i - 1])).toBe(true);
  s = next(s, "g2_clean");
  expect(s.party!.cards.at(-1)!.teamId).toBeUndefined();
  expect(currentRound(s).performerIds).toHaveLength(4);
  expect(currentRound(s).supportingPlayerIds).toHaveLength(1);
  expect(s.settings.scoring).toBe("off");
});
test("Terrible Advice always gets a first-person problem, and spicy variants have correctly typed ingredients", () => {
  let s = make(4, { level: "spicy" });
  for (let i = 0; i < 20; i++) {
    s = next(s, i % 2 ? "p5_clean" : "p5_spicy");
    const entry = currentRound(s).promptSnapshot.entries.situation;
    const source = advicePrompts.find((p) => p.id === entry.id)!;
    expect(source.tags).toContain("party_advice");
    expect(entry.text).toBe(source.text);
    expect(entry.sourceVersion).toBe(source.version);
    expect(entry.text).toMatch(/^I|^My|^The person/);
  }
  for (const id of ["p4_spicy", "p6_spicy", "g8_spicy"]) {
    s = next(s, id);
    for (const e of Object.values(currentRound(s).promptSnapshot.entries))
      expect(prompts.find((p) => p.id === e.id)!.contentRating).toBe("spicy");
  }
});
