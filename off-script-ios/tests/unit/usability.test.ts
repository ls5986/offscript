import { randomUUID } from "node:crypto";
import { expect, test } from "vitest";
import { activityById } from "../../src/domain/content";
import { UserPreferencesSchema } from "../../src/domain/contracts";
import {
  appendPartyCard,
  makePartySession,
  passPartyTurn,
} from "../../src/domain/party";
import { PartyOptionsSchema } from "../../src/domain/party-contracts";
import { seededRng } from "../../src/domain/random";
import {
  currentRound,
  makeSession,
  prepareRound,
  SessionSnapshotSchema,
  transitionRound,
  type SessionSnapshot,
} from "../../src/domain/session";

const preferences = UserPreferencesSchema.parse({});
const now = "2026-10-17T02:00:00.000Z";
const context = (session: SessionSnapshot) => ({
  session,
  now,
  id: randomUUID,
  rng: seededRng(17),
});
function liveRound(session: SessionSnapshot) {
  const ctx = context(session);
  const ready = transitionRound(currentRound(session), { type: "READY" }, ctx);
  return transitionRound(ready, { type: "START" }, ctx);
}

test.each(["G5", "G7", "T3", "T4", "T5"])(
  "%s cannot prepare a role-deficient replay after the group shrinks",
  (id) => {
    const session = makeSession(
      3,
      "surprise",
      preferences,
      randomUUID,
      17,
      [],
      id,
    );
    const original = structuredClone(currentRound(session));
    session.players[2].isSittingOut = true;
    session.settings.playerCount = 2;
    expect(() =>
      prepareRound(session, activityById(id), randomUUID, now),
    ).toThrow(/at least 3/);
    expect(currentRound(session)).toEqual(original);
  },
);

test.each(["manual", "timed"])(
  "%s Scene Relay transfers the same character to the incoming performer",
  (trigger) => {
    const session = makeSession(
      3,
      "surprise",
      preferences,
      randomUUID,
      17,
      [],
      "T4",
    );

    const before = liveRound(session);
    const original = structuredClone(before);
    const outgoing = before.performerIds[0];
    const outgoingRole = before.promptSnapshot.relationship!.assignments.find(
      (assignment) => assignment.playerId === outgoing,
    )!.roleText;
    let after = before;
    if (trigger === "manual") {
      after = transitionRound(before, { type: "ROTATE" }, context(session));
    } else {
      const due = before.schedule.find((cue) => cue.type === "rotation")!;
      expect(due).toBeDefined();
      while (after.elapsedMs < due.atElapsedMs)
        after = transitionRound(
          after,
          {
            type: "TICK",
            deltaMs: Math.min(1000, due.atElapsedMs - after.elapsedMs),
          },
          context(session),
        );
    }
    const incoming = after.performerIds.find(
      (id) => !before.performerIds.includes(id),
    )!;
    expect(incoming).toBeDefined();
    expect(
      after.promptSnapshot
        .relationship!.assignments.map((assignment) => assignment.playerId)
        .sort(),
    ).toEqual([...after.performerIds].sort());
    expect(
      after.promptSnapshot.relationship!.assignments.find(
        (assignment) => assignment.playerId === incoming,
      )!.roleText,
    ).toBe(outgoingRole);
    expect(after.promptSnapshot.relationship!.premise).toBe(
      before.promptSnapshot.relationship!.premise,
    );
    expect(before).toEqual(original);
    SessionSnapshotSchema.parse({ ...session, rounds: [after] });
  },
);

test.each([2, 6])(
  "all %i Party players can pass and still deal a fresh card",
  (count) => {
    let session = makePartySession(
      count,
      preferences,
      [],
      PartyOptionsSchema.parse({}),
      randomUUID,
      17,
    );
    for (const player of session.players)
      session = passPartyTurn(session, player.id);
    const original = structuredClone(session);
    const next = appendPartyCard(session, randomUUID, now);
    expect(next.party!.passedPlayerIds).toEqual([]);
    expect(currentRound(next).performerIds.length).toBeGreaterThan(0);
    expect(next.rounds).toHaveLength(session.rounds.length + 1);
    expect(session).toEqual(original);
    SessionSnapshotSchema.parse(next);
  },
);

test("clearing an all-pass card still honors team turns on the next card", () => {
  let session = makePartySession(
    4,
    preferences,
    [],
    PartyOptionsSchema.parse({ teams: true }),
    randomUUID,
    17,
  );
  for (const player of session.players)
    session = passPartyTurn(session, player.id);
  const next = appendPartyCard(session, randomUUID, now, {
    recipeId: "p1_clean",
  });
  const team = next.teams.find(
    (team) => team.id === next.party!.cards.at(-1)!.teamId,
  );
  expect(team).toBeDefined();
  expect(currentRound(next).performerIds).toEqual(team!.playerIds);
});

test("Half-Life announces each boundary and keeps shorter replays manually started", () => {
  const session = makeSession(
    2,
    "surprise",
    preferences,
    randomUUID,
    17,
    [],
    "G10",
  );
  let round = liveRound(session);
  for (const [index, seconds] of [60, 30, 15, 5].entries()) {
    for (let second = 0; second < seconds; second++)
      round = transitionRound(
        round,
        { type: "TICK", deltaMs: 1000 },
        context(session),
      );
    expect(round.cue?.type).toBe("stop");
    expect(round.cue?.spokenText).toBeTruthy();
    if (index < 3) {
      expect(round.segmentReady).toBe(true);
      const before = structuredClone(round);
      round = transitionRound(
        round,
        { type: "TICK", deltaMs: 1000 },
        context(session),
      );
      expect(round).toEqual(before);
      round = transitionRound(
        round,
        { type: "NEXT_SEGMENT" },
        context(session),
      );
      expect(round.segmentReady).toBe(false);
    } else {
      expect(round.status).toBe("review");
      expect(round.cue?.text).toMatch(/complete|finished/i);
    }
  }
});

test("legacy Battle saves remain readable but new Battle selections are rejected explicitly", () => {
  const session = makeSession(
    6,
    "surprise",
    preferences,
    randomUUID,
    17,
    [],
    "P1",
  );
  currentRound(session).variant = "battle";
  expect(SessionSnapshotSchema.parse(session).rounds[0].variant).toBe("battle");
  expect(() =>
    transitionRound(
      currentRound(session),
      { type: "VARIANT", variant: "battle" },
      context(session),
    ),
  ).toThrow(/not available/i);
  const changed = transitionRound(
    currentRound(session),
    { type: "VARIANT", variant: "take_turns" },
    context(session),
  );
  expect(changed.variant).toBe("take_turns");
  expect(currentRound(session).variant).toBe("battle");
});
