import { PartyStateSchema } from "./party-contracts";
import { refreshComposition } from "./composer";
import { z } from "zod";
import {
  activities,
  activityById,
  categories,
  goals,
  ingredientRating,
  PACK,
  prompts,
  quirks,
  TimedCue,
  TimedCueSchema,
  topics,
} from "./content";
import {
  Activity,
  Player,
  PlayerSchema,
  PromptSnapshot,
  RoundStateSchema,
  ScoreAwardSchema,
  SessionSettings,
  SessionSettingsSchema,
  TeamSchema,
  UserPreferences,
  VoteSchema,
} from "./contracts";
import { isRiffPick, type PlayIntent } from "./playbooks";
import { recipeById } from "./party-recipes";
import { gamePromptOptions } from "./game-prompts";
import { responseStarter } from "./gameplay";
import { emptyPrompt, generatePrompt, resolvePromptPlayerId } from "./prompts";
import { RNG, sample, seededRng, weighted } from "./random";
import type { PartyLevel } from "./party-contracts";
function sessionContentLevel(settings: SessionSettings): PartyLevel {
  return settings.classroomClean || settings.contentRating === "clean"
    ? "clean"
    : settings.contentRating === "spicy"
      ? "spicy"
      : "18_plus";
}
export const SecretSchema = z.object({
  playerId: z.string().uuid(),
  id: z.string(),
  text: z.string(),
  guessed: z.boolean(),
});
export const GameRoundSchema = RoundStateSchema.extend({
  studioEnsemble: z.boolean().optional(),
  rngCursor: z.number().int().nonnegative(),
  segment: z.number().int().min(0).max(3),
  segmentReady: z.boolean(),
  elapsedMs: z.number().nonnegative(),
  turn: z.number().int().nonnegative(),
  // Keep the retired value readable without offering it for new play.
  variant: z.enum(["take_turns", "open_mic", "battle"]),
  cue: TimedCueSchema.nullable(),
  secrets: z.array(SecretSchema),
  revealIndex: z.number().int().nonnegative(),
  schedule: z.array(TimedCueSchema),
  participation: z
    .record(
      z.string(),
      z.object({
        performanceMs: z.number().nonnegative(),
        supportMs: z.number().nonnegative(),
      }),
    )
    .default({}),
});
export type GameRound = z.infer<typeof GameRoundSchema>;
export const SessionSnapshotSchema = z
  .object({
    id: z.string().uuid(),
    settings: SessionSettingsSchema,
    party: PartyStateSchema.optional(),
    players: z.array(PlayerSchema).min(2).max(12),
    rounds: z.array(GameRoundSchema).min(1),
    status: z.enum(["active", "paused", "finished"]),
    seed: z.number().int().nonnegative(),
    contentPackVersion: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    scores: z.array(ScoreAwardSchema),
    teams: z.array(TeamSchema),
    votes: z.array(VoteSchema),
    note: z.string().max(500),
  })
  .superRefine((session, ctx) => {
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });
    const unique = (
      values: (string | number)[],
      path: (string | number)[],
      field: string,
    ) => {
      const seen = new Set<string | number>();
      values.forEach((value, index) => {
        if (seen.has(value))
          issue([...path, index, field], `Duplicate ${field} in saved game.`);
        seen.add(value);
      });
    };
    unique(
      session.players.map((player) => player.id),
      ["players"],
      "id",
    );
    unique(
      session.players.map((player) => player.seatIndex),
      ["players"],
      "seatIndex",
    );
    unique(
      session.rounds.map((round) => round.id),
      ["rounds"],
      "id",
    );
    unique(
      session.rounds.map((round) => round.ordinal),
      ["rounds"],
      "ordinal",
    );
    unique(
      session.teams.map((team) => team.id),
      ["teams"],
      "id",
    );
    unique(
      session.scores.map((score) => score.id),
      ["scores"],
      "id",
    );
    unique(
      session.votes.map((vote) => vote.id),
      ["votes"],
      "id",
    );
    const players = [
      ...session.players,
      ...(session.party?.archivedPlayers ?? []),
    ];
    const playerIds = new Set(session.players.map((player) => player.id));
    session.party?.archivedPlayers.forEach((player, index) => {
      if (playerIds.has(player.id))
        issue(
          ["party", "archivedPlayers", index, "id"],
          "A historical player ID is duplicated.",
        );
      playerIds.add(player.id);
    });
    const player = (id: string, path: (string | number)[]) => {
      if (!playerIds.has(id))
        issue(
          path,
          "This saved role or result refers to a player missing from the current and archived roster.",
        );
    };
    if (
      session.settings.playerCount !==
      session.players.filter((person) => !person.isSittingOut).length
    )
      issue(
        ["settings", "playerCount"],
        "The saved player count does not match the active roster.",
      );
    session.rounds.forEach((round, index) => {
      const path = ["rounds", index];
      if (round.sessionId !== session.id)
        issue(
          [...path, "sessionId"],
          "This round belongs to another saved game.",
        );
      if (!activities.some((activity) => activity.id === round.activityId))
        issue(
          [...path, "activityId"],
          "This saved activity is not installed. Keep the stored data and update the app before playing it.",
        );
      const cast = new Set<string>();
      for (const field of ["performerIds", "supportingPlayerIds"] as const)
        round[field].forEach((id, actor) => {
          if (cast.has(id))
            issue(
              [...path, field, actor],
              "A player has more than one role in this cast.",
            );
          cast.add(id);
          player(id, [...path, field, actor]);
        });
      round.secrets.forEach((secret, actor) =>
        player(secret.playerId, [...path, "secrets", actor, "playerId"]),
      );
      round.promptSnapshot.relationship?.assignments.forEach(
        (assignment, actor) =>
          player(
            resolvePromptPlayerId(
              assignment.playerId,
              actor,
              players,
              round.activityId === "S1" ? round.performerIds : [],
            ),
            [
              ...path,
              "promptSnapshot",
              "relationship",
              "assignments",
              actor,
              "playerId",
            ],
          ),
      );
      Object.keys(round.participation).forEach((id) =>
        player(id, [...path, "participation", id]),
      );
    });
    const roundIds = new Set(session.rounds.map((round) => round.id));
    const teamIds = new Set(session.teams.map((team) => team.id));
    session.teams.forEach((team, index) => {
      if (team.sessionId !== session.id)
        issue(
          ["teams", index, "sessionId"],
          "This team belongs to another saved game.",
        );
      const members = new Set<string>();
      team.playerIds.forEach((id, member) => {
        if (members.has(id))
          issue(
            ["teams", index, "playerIds", member],
            "A player is duplicated in this team.",
          );
        members.add(id);
        player(id, ["teams", index, "playerIds", member]);
      });
    });
    const target = (
      result: {
        roundId: string;
        targetPlayerId: string | null;
        targetTeamId: string | null;
      },
      path: (string | number)[],
    ) => {
      if (!roundIds.has(result.roundId))
        issue(
          [...path, "roundId"],
          "This saved result refers to a missing round.",
        );
      if (result.targetPlayerId)
        player(result.targetPlayerId, [...path, "targetPlayerId"]);
      if (result.targetTeamId && !teamIds.has(result.targetTeamId))
        issue(
          [...path, "targetTeamId"],
          "This saved result refers to a missing team.",
        );
    };
    session.scores.forEach((score, index) => target(score, ["scores", index]));
    const voters = new Set<string>();
    session.votes.forEach((vote, index) => {
      target(vote, ["votes", index]);
      player(vote.voterPlayerId, ["votes", index, "voterPlayerId"]);
      const key = `${vote.roundId}:${vote.voterPlayerId}`;
      if (voters.has(key))
        issue(
          ["votes", index, "voterPlayerId"],
          "A player has more than one saved vote in this round.",
        );
      voters.add(key);
    });
    session.party?.cards.forEach((card, index) => {
      if (!roundIds.has(card.roundId))
        issue(
          ["party", "cards", index, "roundId"],
          "This Party card refers to a missing round.",
        );
    });
    session.party?.passedPlayerIds.forEach((id, index) =>
      player(id, ["party", "passedPlayerIds", index]),
    );
  });
export type SessionSnapshot = z.infer<typeof SessionSnapshotSchema>;
export type ID = () => string;
export const currentRound = (s: SessionSnapshot) =>
  s.rounds[s.rounds.length - 1];
export function eligibleActivities(
  settings: SessionSettings,
  prefs: UserPreferences,
  pool: Activity[] = activities,
): Activity[] {
  return pool.filter(
    (a) =>
      (settings.playFlow !== "free" || a.id !== "G10") &&
      a.minPlayers <= settings.playerCount &&
      a.maxPlayers >= settings.playerCount &&
      (settings.mode === "surprise" || a.modes.includes(settings.mode)) &&
      (a.contentRating === "clean" ||
        (prefs.matureOptIn &&
          !prefs.classroomDefault &&
          !settings.classroomClean &&
          settings.contentRating === "mature_suggestive")) &&
      (settings.energy !== "seated" ||
        a.energy === "seated" ||
        ["movement", "story_turn"].includes(a.engine) ||
        ["G5", "G7", "T3"].includes(a.id)) &&
      (!settings.excludeMovement || a.energy === "seated") &&
      a.promptCategories.every((c) =>
        prompts.some(
          (p) =>
            p.category === c &&
            p.minPlayers <=
              Math.max(2, Math.min(settings.playerCount, a.maxPerformers)) &&
            p.maxPlayers >=
              Math.max(2, Math.min(settings.playerCount, a.maxPerformers)),
        ),
      ),
  );
}
export function chooseNextActivity(
  settings: SessionSettings,
  prefs: UserPreferences,
  history: GameRound[],
  rng: RNG,
): Activity {
  const hardEligible = eligibleActivities(settings, prefs);
  const eligible =
    settings.playIntent === "riff" && settings.mode === "surprise"
      ? hardEligible.filter(isRiffPick)
      : hardEligible;
  if (!eligible.length)
    throw Error(
      "No games fit these settings. Try a different group size or experience.",
    );
  const last = history.at(-1);
  const recent = history.slice(-5).map((r) => r.activityId);
  const pool = eligible.filter((a) => !recent.includes(a.id));
  const candidates = pool.length
    ? pool
    : eligible.filter((a) => a.id !== last?.activityId);
  return weighted(
    candidates.length ? candidates : eligible,
    (a) => {
      let w = 1;
      if (settings.playIntent === "practice")
        w *=
          a.family === "scene" || a.family === "drill"
            ? 3
            : a.family === "punchline"
              ? 0.5
              : 1;
      if (last && a.family !== activityById(last.activityId).family) w *= 2;
      if (
        history.length < 3 &&
        ["story_turn", "rapid_fire", "scene_open"].includes(a.engine)
      )
        w *= 2;
      if (
        history.filter((r) => r.activityId === a.id && r.status === "skipped")
          .length
      )
        w *= 0.4;
      if (settings.playerCount === 2 && a.modes.includes("just_us")) w *= 1.4;
      if (a.energy === "seated") w *= 1.2;
      if (
        last &&
        activityById(last.activityId).defaultDurationSec < 90 !==
          a.defaultDurationSec < 90
      )
        w *= 1.5;
      return w;
    },
    rng,
  );
}
export function exposure(playerId: string, history: GameRound[]) {
  const played = history.filter(
    (r) =>
      r.startedAt &&
      (r.performerIds.includes(playerId) ||
        (r.participation[playerId]?.performanceMs ?? 0) > 0),
  );
  return {
    rounds: played.length,
    seconds: played.reduce(
      (s, r) =>
        s +
        (r.participation[playerId]?.performanceMs ??
          (r.performerIds.includes(playerId) ? r.elapsedMs : 0)) /
          1000,
      0,
    ),
    last: played.at(-1)?.ordinal ?? -1,
    support: history.filter(
      (r) =>
        r.startedAt &&
        (r.supportingPlayerIds.includes(playerId) ||
          (r.participation[playerId]?.supportMs ?? 0) > 0),
    ).length,
  };
}
export function assignPerformers(
  a: Activity,
  players: Player[],
  history: GameRound[],
  rng: RNG,
): { performerIds: string[]; supportingPlayerIds: string[] } {
  const active = players.filter((p) => !p.isSittingOut);
  const shuffle = active
    .map((p) => ({ p, tie: rng(), e: exposure(p.id, history) }))
    .sort(
      (a, b) =>
        a.e.rounds - b.e.rounds ||
        a.e.seconds - b.e.seconds ||
        a.e.last - b.e.last ||
        a.tie - b.tie,
    );
  if (a.id === "G2") {
    const caller = [...shuffle].sort(
      (x, y) =>
        exposure(
          x.p.id,
          history.filter((r) => r.activityId === "G2"),
        ).support -
          exposure(
            y.p.id,
            history.filter((r) => r.activityId === "G2"),
          ).support || x.tie - y.tie,
    )[0];
    return {
      performerIds: shuffle
        .filter((x) => x !== caller)
        .slice(0, 4)
        .map((x) => x.p.id),
      supportingPlayerIds: caller ? [caller.p.id] : [],
    };
  }
  let n = ["take_turns", "ensemble"].includes(a.playPattern)
    ? Math.min(active.length, a.maxPerformers)
    : a.minPerformers;
  if (a.id === "G7") n = 2;
  if (a.id === "T3") n = Math.min(active.length - 1, 5);
  const first = shuffle[0]?.p.id;
  if (n === 2 && shuffle.length > 2) {
    const min = shuffle[1].e.rounds;
    const candidates = shuffle.slice(1).filter((x) => x.e.rounds === min);
    candidates.sort(
      (x, y) =>
        history.filter(
          (r) =>
            r.startedAt &&
            r.performerIds.includes(first) &&
            r.performerIds.includes(x.p.id),
        ).length -
        history.filter(
          (r) =>
            r.startedAt &&
            r.performerIds.includes(first) &&
            r.performerIds.includes(y.p.id),
        ).length,
    );
    if (candidates.length) {
      const second = candidates[0];
      shuffle.splice(shuffle.indexOf(second), 1);
      shuffle.splice(1, 0, second);
    }
  }
  const performerIds = shuffle.slice(0, n).map((x) => x.p.id);
  let supportingPlayerIds: string[] = [];
  if (["G7", "T3", "G6", "G8"].includes(a.id)) {
    if (a.id === "G7" || a.id === "T3")
      supportingPlayerIds = shuffle.slice(n, n + 1).map((x) => x.p.id);
    else {
      supportingPlayerIds = performerIds.splice(1, 1);
    }
  }
  return { performerIds, supportingPlayerIds };
}
export function generateCueSchedule(
  a: Activity,
  rng: RNG,
  flavor: "playful" | "grounded" = "grounded",
): TimedCue[] {
  const type = a.cueTypes[0];
  if (!type || a.id === "G10" || a.id === "G2") return [];
  const schedule: TimedCue[] = [];
  let last = "";
  for (
    let t = 20000;
    t < a.defaultDurationSec * 1000;
    t += 20000 + Math.floor(rng() * 12000)
  ) {
    let text =
      type === "new_choice"
        ? "NEW CHOICE!"
        : type === "rotation"
          ? "Relay: new player, same scene."
          : type === "status_shift"
            ? "Reverse who has the higher status."
            : type;
    if (["emotion_change", "genre_change", "surprise_line"].includes(type)) {
      const category =
        type === "emotion_change"
          ? "emotion"
          : type === "genre_change"
            ? "genre"
            : "opening_line";
      const cuePool =
        type === "emotion_change" && flavor === "playful"
          ? gamePromptOptions("G3", "riff").pool
          : prompts;
      const compatible = cuePool.filter(
        (p) =>
          p.category === category &&
          p.contentRating === "clean" &&
          p.text !== last,
      );
      const flavored = compatible.filter((p) => p.flavor === flavor);
      text = sample(flavored.length ? flavored : compatible, rng).text;
    }
    last = text;
    schedule.push({
      id: `cue_${schedule.length}`,
      type,
      text,
      atElapsedMs: t,
      displayDurationMs: 6000,
      spokenText: text,
    });
  }
  return schedule;
}
function openSceneRecipe(snapshot: PromptSnapshot) {
  return {
    categories: categories.filter((category) => snapshot.entries[category]),
    pool: prompts,
    style: snapshot.generationStyle,
    flavor: snapshot.flavor,
    compositionEnabled: snapshot.compositionEnabled,
  };
}
export function prepareRound(
  s: SessionSnapshot,
  a: Activity,
  id: ID,
  now: string,
  prompt?: PromptSnapshot,
): GameRound {
  const count = s.players.filter((player) => !player.isSittingOut).length;
  if (count < a.minPlayers)
    throw new Error(
      `${a.title} needs at least ${a.minPlayers} people. Rejoin someone or choose another game.`,
    );
  if (count > a.maxPlayers)
    throw new Error(
      `${a.title} supports at most ${a.maxPlayers} people. Choose another game for this group.`,
    );
  if (s.settings.playFlow === "free" && a.id === "G10")
    throw new Error(
      "Half-Life needs timed rounds. Choose rounds or another game.",
    );
  if (s.settings.excludeMovement && a.energy !== "seated")
    throw new Error(
      "Movement games are off. Choose a seated game or change this setting.",
    );
  if (s.settings.classroomClean && a.contentRating !== "clean")
    throw new Error("Classroom clean is on. Choose a clean game.");
  const ordinal = s.rounds.length;
  const previous = currentRound(s);
  const rng = seededRng(s.seed + ordinal * 7919 + 17);
  const assignment = assignPerformers(a, s.players, s.rounds, rng);
  // Studio's ensemble variant keeps every authored role and seat assignment.
  const studioEnsemble =
    a.id === "S1" &&
    (!!prompt ||
      (previous?.activityId === "S1" &&
        (previous.studioEnsemble === true ||
          previous.performerIds.length > 2)));
  if (studioEnsemble) {
    assignment.performerIds = s.players
      .filter((p) => !p.isSittingOut)
      .map((p) => p.id);
    assignment.supportingPlayerIds = [];
  }
  let snapshot =
    prompt ??
    generatePrompt(
      {
        ...gamePromptOptions(
          a.id,
          s.settings.playIntent,
          sessionContentLevel(s.settings),
        ),
        contentLevel: sessionContentLevel(s.settings),
        count:
          assignment.performerIds.length < 2
            ? 2
            : assignment.performerIds.length,
        style: "coherent",
        ...(a.id === "S1" && previous?.activityId === "S1"
          ? openSceneRecipe(previous.promptSnapshot)
          : {}),
        playerIds: assignment.performerIds,
      },
      rng,
    ).snapshot;
  if (a.engine === "rapid_fire") {
    const word = sample(
      topics.filter(
        (t) => t.id !== currentRound(s)?.promptSnapshot.jokeTopic?.id,
      ),
      rng,
    );
    snapshot = {
      ...(a.id === "P4" || a.id === "P5" || a.id === "P6"
        ? snapshot
        : emptyPrompt()),
      jokeTopic: {
        id: word.id,
        word: word.word,
        contentRating: word.contentRating,
      },
    };
  }
  const secretPool = a.id === "T3" ? quirks : goals;
  const available = [...secretPool];
  const secrets = a.requiresPrivateReveal
    ? assignment.performerIds.map((playerId) => {
        const entry = sample(available, rng);
        available.splice(available.indexOf(entry), 1);
        return { playerId, id: entry.id, text: entry.text, guessed: false };
      })
    : [];
  return {
    id: id(),
    ...(studioEnsemble ? { studioEnsemble: true } : {}),
    sessionId: s.id,
    ordinal,
    activityId: a.id,
    status: "intro",
    ...assignment,
    promptSnapshot: snapshot,
    remainingMs:
      s.settings.playFlow === "free"
        ? 0
        : a.id === "G10"
          ? 60000
          : (s.settings.playIntent === "riff"
              ? Math.min(90, a.defaultDurationSec)
              : a.defaultDurationSec) * 1000,
    timerStartedAtEpochMs: null,
    cueIndex: 0,
    startedAt: null,
    completedAt: null,
    rngCursor: 0,
    segment: 0,
    segmentReady: false,
    elapsedMs: 0,
    turn: 0,
    variant: "take_turns",
    cue: null,
    secrets,
    revealIndex: 0,
    participation: {},
    schedule:
      s.settings.playFlow === "free"
        ? []
        : generateCueSchedule(
            a,
            rng,
            s.settings.playIntent === "riff" ? "playful" : "grounded",
          ),
  };
}
export function makeSession(
  count: number,
  mode: SessionSettings["mode"],
  prefs: UserPreferences,
  id: ID,
  seed: number,
  names: string[] = [],
  activityId?: string,
  prompt?: PromptSnapshot,
  playIntent?: PlayIntent,
  playFlow: SessionSettings["playFlow"] = "rounds",
): SessionSnapshot {
  const promptRatings = prompt
    ? Object.values(prompt.entries).map(ingredientRating)
    : [];
  const promptRating = promptRatings.includes("mature_suggestive")
    ? "mature_suggestive"
    : promptRatings.includes("spicy")
      ? "spicy"
      : "clean";
  if (prompt && prefs.classroomDefault && promptRating !== "clean")
    throw new Error("This prompt is hidden while Classroom clean is on.");
  if (prompt && promptRating === "mature_suggestive" && !prefs.matureOptIn)
    throw new Error("Confirm adult comedy before acting out this prompt.");
  const settings = SessionSettingsSchema.parse({
    mode,
    playIntent:
      playIntent ??
      (mode === "scene_lab" || mode === "improv_gym"
        ? "practice"
        : prefs.playIntent),
    playerCount: count,
    playFlow,
    cuePreference: playFlow === "free" ? "manual" : "sound_and_visual",
    namesOptional: !names.some((name) => name.trim()),
    rngSeed: seed,
    classroomClean: prefs.classroomDefault,
    contentRating: prompt
      ? promptRating
      : prefs.matureOptIn && !prefs.classroomDefault
        ? "mature_suggestive"
        : "clean",
  });
  const now = new Date().toISOString();
  const s: SessionSnapshot = {
    id: id(),
    settings,
    seed,
    players: Array.from({ length: count }, (_, i) => ({
      id: id(),
      displayName: names[i]?.trim().slice(0, 40) || `Player ${i + 1}`,
      seatIndex: i,
      isSittingOut: false,
    })),
    rounds: [],
    status: "active",
    contentPackVersion: PACK,
    createdAt: now,
    updatedAt: now,
    scores: [],
    teams: [],
    votes: [],
    note: "",
  };
  s.teams = [
    {
      id: id(),
      sessionId: s.id,
      displayName: "Team A",
      playerIds: s.players.filter((_, i) => i % 2 === 0).map((p) => p.id),
    },
    {
      id: id(),
      sessionId: s.id,
      displayName: "Team B",
      playerIds: s.players.filter((_, i) => i % 2 === 1).map((p) => p.id),
    },
  ];
  const a = activityId
    ? activityById(activityId)
    : chooseNextActivity(settings, prefs, [], seededRng(seed));
  if (a.id === "G2" && count < 3)
    throw Error(
      "New Choice needs at least 3 people: 2 actors and a separate caller. Add a player or change game.",
    );
  if (
    !eligibleActivities({ ...settings, mode: "surprise" }, prefs).some(
      (x) => x.id === a.id,
    )
  )
    throw Error(
      "This game is not available for this group or content setting.",
    );
  s.rounds.push(prepareRound(s, a, id, now, prompt));
  return s;
}
export type GameAction =
  | {
      type:
        | "READY"
        | "START"
        | "PAUSE"
        | "RESUME"
        | "FINISH"
        | "SKIP"
        | "COMPLETE"
        | "HIDE_PRIVATE_REVEAL"
        | "NEXT_TURN"
        | "NEXT_SEGMENT"
        | "CALL_CUE"
        | "ROTATE"
        | "REROLL_PROMPT";
    }
  | { type: "TICK"; deltaMs: number }
  | { type: "VARIANT"; variant: GameRound["variant"] }
  | { type: "MARK_GUESS"; playerId: string };
function halfLifeBoundaryCue(round: GameRound, id: ID): TimedCue {
  const text =
    round.status === "review"
      ? "Scene complete. You finished all four versions."
      : `Time! Pause here. Next: the same story in ${[60, 30, 15, 5][round.segment]} seconds. Tap Start when everyone is ready.`;
  return {
    id: id(),
    type: "stop",
    text,
    spokenText: text,
    atElapsedMs: round.elapsedMs,
    displayDurationMs: 10000,
  };
}
export function transitionRound(
  round: GameRound,
  action: GameAction,
  ctx: { now: string; rng: RNG; id: ID; session: SessionSnapshot },
): GameRound {
  let r = structuredClone(round);
  const a = activityById(r.activityId);
  const live = r.status === "live";
  if (["REROLL_PROMPT", "CALL_CUE", "ROTATE"].includes(action.type))
    r.rngCursor++;
  switch (action.type) {
    case "READY":
      if (r.status === "intro")
        r.status = r.secrets.length ? "private_reveal" : "ready";
      break;
    case "HIDE_PRIVATE_REVEAL":
      if (r.status === "private_reveal") {
        r.revealIndex++;
        if (r.revealIndex >= r.secrets.length) r.status = "ready";
      }
      break;
    case "START":
    case "RESUME":
      if (r.status === "ready" || r.status === "paused") {
        if (a.id === "G2") {
          const isActive = (id: string) =>
            ctx.session.players.some((p) => p.id === id && !p.isSittingOut);
          if (
            r.performerIds.length < 2 ||
            r.performerIds.length > 4 ||
            !r.performerIds.every(isActive) ||
            r.supportingPlayerIds.length !== 1 ||
            !r.supportingPlayerIds.every(isActive) ||
            r.performerIds.includes(r.supportingPlayerIds[0]) ||
            new Set(r.performerIds).size !== r.performerIds.length
          )
            throw Error(
              "New Choice needs 2–4 actors and a separate caller. Add a player and start a new scene, or change game. Your saved scene is unchanged.",
            );
        }
        const recipe =
          ctx.session.party &&
          recipeById(ctx.session.party.cards.at(-1)?.recipeId ?? "");
        const required = recipe
          ? typeof recipe.performers === "number"
            ? recipe.performers
            : 1
          : a.minPerformers;
        const activeCast = [...r.performerIds, ...r.supportingPlayerIds].filter(
          (id) =>
            ctx.session.players.some(
              (player) => player.id === id && !player.isSittingOut,
            ),
        );
        if (activeCast.length < required)
          throw Error(
            "This scene is missing players. Rejoin someone or start a new scene.",
          );
        r.status = "live";
        r.startedAt ??= ctx.now;
      }
      break;
    case "PAUSE":
      if (live) r.status = "paused";
      break;
    case "FINISH":
      if (live || r.status === "paused") {
        r.status = "review";
        r.completedAt = ctx.now;
      }
      break;
    case "COMPLETE":
      if (r.status === "review") r.status = "complete";
      break;
    case "SKIP":
      if (!["complete", "skipped"].includes(r.status)) {
        r.status = "skipped";
        r.completedAt = ctx.now;
      }
      break;
    case "VARIANT":
      if (action.variant === "battle")
        throw new Error(
          "Battle is not available. Choose Take turns or Anyone can jump in.",
        );
      if (!live) r.variant = action.variant;
      break;
    case "MARK_GUESS":
      if (live || r.status === "review")
        r.secrets = r.secrets.map((s) =>
          s.playerId === action.playerId ? { ...s, guessed: !s.guessed } : s,
        );
      break;
    case "NEXT_TURN":
      if (live) r.turn++;
      break;
    case "ROTATE":
      if (live) {
        const waiting = ctx.session.players.filter(
          (p) => !p.isSittingOut && !r.performerIds.includes(p.id),
        );
        if (waiting.length) {
          const incoming = assignPerformers(
            {
              ...a,
              minPerformers: 1,
              maxPerformers: 1,
              playPattern: "volunteer",
            },
            waiting,
            ctx.session.rounds,
            ctx.rng,
          ).performerIds[0];
          const outgoing = r.performerIds[0];
          r.performerIds = [...r.performerIds.slice(1), incoming];
          if (a.id === "T4" && r.promptSnapshot.relationship) {
            const outgoingSeat = ctx.session.players.find(
              (player) => player.id === outgoing,
            )?.seatIndex;
            r.promptSnapshot = refreshComposition({
              ...r.promptSnapshot,
              relationship: {
                ...r.promptSnapshot.relationship,
                assignments: r.promptSnapshot.relationship.assignments.map(
                  (assignment) =>
                    assignment.playerId === outgoing ||
                    (outgoingSeat !== undefined &&
                      assignment.playerId === `Player ${outgoingSeat + 1}`)
                      ? { ...assignment, playerId: incoming }
                      : assignment,
                ),
              },
            });
          }
        }
        r.turn++;
        r.cue = {
          id: ctx.id(),
          type: "rotation",
          text:
            a.id === "G5"
              ? "Freeze! Keep the pose. Start a completely NEW scene."
              : "New performer. Continue the SAME scene.",
          atElapsedMs: r.elapsedMs,
          displayDurationMs: 8000,
        };
      }
      break;
    case "NEXT_SEGMENT":
      if (live && a.id === "G10") {
        if (r.segmentReady) {
          r.segmentReady = false;
          r.cue = null;
          r.remainingMs = [60000, 30000, 15000, 5000][r.segment];
        } else if (r.segment < 3) {
          r.segment++;
          r.segmentReady = true;
          r.remainingMs = [60000, 30000, 15000, 5000][r.segment];
          r.cue = halfLifeBoundaryCue(r, ctx.id);
        } else {
          r.status = "review";
          r.completedAt = ctx.now;
          r.cue = halfLifeBoundaryCue(r, ctx.id);
        }
      }
      break;
    case "CALL_CUE":
      if (live) {
        const type = a.cueTypes[0];
        if (a.id === "G2") {
          r.cue = {
            id: ctx.id(),
            type: "new_choice",
            text: "NEW CHOICE!",
            atElapsedMs: r.elapsedMs,
            displayDurationMs: 6000,
          };
          r.cueIndex++;
        } else if (type) {
          const schedule = generateCueSchedule(
            a,
            ctx.rng,
            ctx.session.settings.playIntent === "riff" ? "playful" : "grounded",
          );
          const pool = schedule.filter((c) => c.text !== r.cue?.text);
          const cue = sample(
            pool.length
              ? pool
              : schedule.length
                ? schedule
                : [
                    {
                      id: "manual",
                      type,
                      text: "Keep going",
                      atElapsedMs: 0,
                      displayDurationMs: 6000,
                    },
                  ],
            ctx.rng,
          );
          r.cue = { ...cue, id: ctx.id(), atElapsedMs: r.elapsedMs };
          r.cueIndex++;
        }
      }
      break;
    case "REROLL_PROMPT":
      if (
        !["private_reveal", "review", "complete", "skipped"].includes(
          r.status,
        ) &&
        !r.secrets.length
      ) {
        if (a.engine === "rapid_fire" && ["P1", "P2", "P3"].includes(a.id)) {
          const t = sample(
            topics.filter((t) => t.id !== r.promptSnapshot.jokeTopic?.id),
            ctx.rng,
          );
          r.promptSnapshot.jokeTopic = {
            id: t.id,
            word: t.word,
            contentRating: t.contentRating,
          };
        } else
          r.promptSnapshot = generatePrompt(
            {
              ...gamePromptOptions(
                a.id,
                ctx.session.settings.playIntent,
                sessionContentLevel(ctx.session.settings),
              ),
              contentLevel: sessionContentLevel(ctx.session.settings),
              count: Math.max(2, r.performerIds.length),
              style: "coherent",
              ...(a.id === "S1" ? openSceneRecipe(r.promptSnapshot) : {}),
              previous: r.promptSnapshot,
              playerIds: r.performerIds,
            },
            ctx.rng,
          ).snapshot;
      }
      if (ctx.session.settings.playFlow === "free" && a.id === "S6") r.turn = 0;
      break;
    case "TICK":
      if (live && !r.segmentReady) {
        const delta = Math.max(0, Math.round(Math.min(action.deltaMs, 2000)));
        r.elapsedMs += delta;
        for (const p of ctx.session.players) {
          const contribution = r.participation[p.id] ?? {
            performanceMs: 0,
            supportMs: 0,
          };
          if (r.performerIds.includes(p.id))
            contribution.performanceMs += delta;
          if (r.supportingPlayerIds.includes(p.id))
            contribution.supportMs += delta;
          r.participation[p.id] = contribution;
        }
        if (ctx.session.settings.playFlow === "free") break;
        r.remainingMs = Math.max(0, r.remainingMs - delta);
        // Hosted cue scenes keep issuing visual cues after their optional timer expires.
        if (
          ctx.session.party?.options.automaticCues &&
          ctx.session.party.cards.at(-1)?.pattern === "CUED_SCENE" &&
          !r.schedule.some((c) => c.atElapsedMs > r.elapsedMs)
        ) {
          const next = generateCueSchedule(a, ctx.rng, "playful")[0];
          if (next)
            r.schedule.push({
              ...next,
              id: ctx.id(),
              atElapsedMs: r.elapsedMs + 20000,
            });
        }
        const due =
          a.id === "G2" || ctx.session.settings.cuePreference === "manual"
            ? undefined
            : r.schedule.find(
                (c) =>
                  c.atElapsedMs > round.elapsedMs &&
                  c.atElapsedMs <= r.elapsedMs,
              );
        if (due) {
          r.cue = due;
          r.cueIndex++;
          if (due.type === "rotation") {
            const rotated = transitionRound(r, { type: "ROTATE" }, ctx);
            r.performerIds = rotated.performerIds;
            r.promptSnapshot = rotated.promptSnapshot;
            r.turn = rotated.turn;
          }
        }
        if (r.remainingMs === 0 && round.remainingMs > 0) {
          if (a.id === "G10") {
            if (r.segment < 3) {
              r.segment++;
              r.segmentReady = true;
              r.remainingMs = [60000, 30000, 15000, 5000][r.segment];
            } else {
              r.status = "review";
              r.completedAt = ctx.now;
            }
            r.cue = halfLifeBoundaryCue(r, ctx.id);
          } else
            r.cue = {
              id: ctx.id(),
              type: "stop",
              text: "Time! Find your ending — or keep playing.",
              atElapsedMs: r.elapsedMs,
              displayDurationMs: 10000,
            };
        }
      }
      break;
  }
  if (action.type === "REROLL_PROMPT")
    r.promptSnapshot = refreshComposition(r.promptSnapshot);
  return r;
}
export function restoreSession(s: SessionSnapshot): SessionSnapshot {
  const copy = SessionSnapshotSchema.parse(s);
  for (const r of copy.rounds) {
    if (r.status === "live") r.status = "paused";
    r.timerStartedAtEpochMs = null;
  }
  if (copy.status !== "finished") copy.status = "paused";
  return copy;
}
export const engineInstructions: Record<Activity["engine"], string> = {
  rapid_fire:
    "Use the opening below. Take a turn, pass freely, and keep it kind.",
  scene_open:
    "Start with a simple offer. Listen, accept the shared reality, and build together.",
  scene_cued:
    "Keep the scene going. Follow each visible cue without losing the story.",
  story_turn:
    "Pass the phone or take turns in seat order. Build one shared story.",
  movement:
    "No contact required. Stay seated if you like; small gestures work beautifully.",
  role_reveal:
    "Pass the phone privately. Only the named player looks at each secret.",
  interview:
    "One person asks or presents; the other responds in character. Commit to the idea.",
  hot_seat:
    "One character answers questions. Everyone else is curious, not trying to catch them out.",
  scene_rotation:
    "Waiting players join one at a time. Follow the replacement rule for this game.",
  short_challenge:
    "Only three lines: establish, respond, then add a clear change.",
};
export function rapidOpening(r: GameRound): string {
  return responseStarter(r.activityId, r.promptSnapshot);
}
