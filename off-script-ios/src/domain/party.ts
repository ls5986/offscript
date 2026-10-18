/** Shared, deterministic hosted deck. Card instances point at the existing game rounds. */
import { activities, activityById, PACK, topics } from "./content";
import { refreshComposition, sceneText } from "./composer";
import type { Player, UserPreferences } from "./contracts";
import {
  PartyOptionsSchema,
  type PartyOptions,
  type PartyLevel,
} from "./party-contracts";
import {
  partyRecipes,
  partyDefaultActivityIds,
  preferredPartyVariants,
  type PartyRecipe,
  recipeById,
} from "./party-recipes";
import { gamePromptOptions } from "./game-prompts";
import { isQuickGame } from "./gameplay";
import {
  appendPromptNavigation,
  currentPromptNavigation,
  stepPromptNavigation,
} from "./prompt-navigation";
import { emptyPrompt, generatePrompt, snapshotIsClean } from "./prompts";
import { type RNG, sample, seededRng, weighted } from "./random";
import {
  assignPerformers,
  currentRound,
  generateCueSchedule,
  makeSession,
  prepareRound,
  transitionRound,
  type ID,
  type SessionSnapshot,
  type GameRound,
} from "./session";

export function normalizePartyOptions(
  options: PartyOptions,
  classroom = false,
): PartyOptions {
  const o = PartyOptionsSchema.parse(options);
  if (classroom || (o.level === "18_plus" && !o.adultsConfirmedAt))
    return { ...o, level: "clean", adultsConfirmedAt: null };
  return o;
}
export function partyCardAllowed(s: SessionSnapshot, classroom: boolean) {
  const card = s.party?.cards.at(-1);
  if (!card || !s.party) return false;
  if (classroom && card.level !== "clean") return false;
  if (card.level === "spicy" && s.party.options.level === "clean") return false;
  return (
    card.level !== "18_plus" ||
    (s.party.options.level === "18_plus" && !!s.party.options.adultsConfirmedAt)
  );
}
const scene = (r?: PartyRecipe) =>
  !!r &&
  ["PAIR", "SMALL_GROUP", "TIMED_SCENE", "CUED_SCENE", "PRIVATE_ROLE"].includes(
    r.pattern,
  );
function recipesForGroup(options: PartyOptions, count: number) {
  return partyRecipes.filter((r) => {
    const a = activityById(r.activityId);
    return (
      (options.selectedActivityIds == null ||
        options.selectedActivityIds.includes(r.activityId)) &&
      count >=
        Math.max(
          a.minPlayers,
          typeof r.performers === "number" ? r.performers : 2,
        ) &&
      count <= a.maxPlayers &&
      (options.includeScenes || !scene(r)) &&
      (options.movement || a.energy === "seated") &&
      (r.level === "clean" ||
        (options.level !== "clean" && r.level === "spicy") ||
        (r.level === "18_plus" &&
          options.level === "18_plus" &&
          !!options.adultsConfirmedAt))
    );
  });
}
function inAutomaticDeck(recipe: PartyRecipe, options: PartyOptions) {
  return (
    (options.selectedActivityIds !== null ||
      partyDefaultActivityIds(options.level).includes(recipe.activityId)) &&
    (options.includeScenes || !scene(recipe)) &&
    (recipe.pattern !== "PRIVATE_ROLE" || options.selectedActivityIds != null)
  );
}
export function partyDeckRecipes(options: PartyOptions, count: number) {
  return recipesForGroup(options, count).filter((recipe) =>
    inAutomaticDeck(recipe, options),
  );
}
export function partyCanRepeat(s: SessionSnapshot): boolean {
  if (!s.party) return false;
  const card = s.party.cards.at(-1);
  return (
    !!card &&
    partyDeckRecipes(
      s.party.options,
      s.players.filter((player) => !player.isSittingOut).length,
    ).some((recipe) => recipe.id === card.recipeId)
  );
}
export function partyDeckError(
  options: PartyOptions,
  count: number,
): string | null {
  if (
    options.selectedActivityIds?.some(
      (id) => !partyRecipes.some((r) => r.activityId === id),
    )
  )
    return "Some selected games are not supported in Party Night. Update Choose games.";
  if (count < 2)
    return "At least two people need to be playing. Rejoin someone to continue.";
  return partyDeckRecipes(options, count).length
    ? null
    : "No selected games can be played with this group and these settings. Choose an available game or adjust your party preferences.";
}
export function compatiblePartyRecipes(s: SessionSnapshot) {
  if (!s.party) throw Error("This session is not a Party Night deck.");
  const active = s.players.filter((p) => !p.isSittingOut);
  const available = active.filter(
    (p) => !s.party!.passedPlayerIds.includes(p.id),
  ).length;
  return recipesForGroup(s.party.options, active.length).filter(
    (r) => available >= (typeof r.performers === "number" ? r.performers : 1),
  );
}
export const PartyDeckEngine = {
  choose(s: SessionSnapshot, rng: RNG): PartyRecipe {
    const compatible = compatiblePartyRecipes(s);
    const problem = partyDeckError(
      s.party!.options,
      s.players.filter((p) => !p.isSittingOut).length,
    );
    if (problem) throw Error(problem);
    const preferred = preferredPartyVariants(
      compatible,
      s.party!.options.level,
    );
    const last = recipeById(s.party!.cards.at(-1)?.recipeId ?? "");
    const previous = preferred.find(
      (recipe) => recipe.activityId === last?.activityId,
    );
    if (
      s.party!.options.rotation === "stay" &&
      previous &&
      compatible.some((recipe) => recipe.id === previous.id) &&
      inAutomaticDeck(previous, s.party!.options)
    )
      return previous;
    const eligible = preferred.filter((r) =>
      inAutomaticDeck(r, s.party!.options),
    );
    if (!eligible.length)
      throw Error(
        partyDeckError(
          s.party!.options,
          s.players.filter((p) => !p.isSittingOut).length,
        ) ??
          "No selected games have enough available players. Clear passes or rejoin someone to continue.",
      );
    const history = s.party!.cards.slice(-7);
    const recentActivities = history
      .slice(-5)
      .map((c) => recipeById(c.recipeId)?.activityId);
    let pool = eligible.filter((r) => !recentActivities.includes(r.activityId));
    if (!pool.length)
      pool = eligible.filter(
        (r) => r.activityId !== currentRound(s)?.activityId,
      );
    if (!pool.length) pool = eligible;
    // A scene is always followed by a quick social card; never stack lengthy performances.
    const lastRecipe = recipeById(history.at(-1)?.recipeId ?? "");
    if (scene(lastRecipe)) {
      const quick = pool.filter((r) => !scene(r));
      if (quick.length) pool = quick;
    }
    // Make the first card immediately playable without instructions, secrets or a timer.
    if (!history.length) {
      const starters = pool.filter((r) =>
        ["P1", "P4", "P5", "W1", "W4", "W6"].includes(r.activityId),
      );
      if (starters.length) pool = starters;
    }
    // Offer a short scene at least once in each five-card stretch in the mixed deck.
    if (
      s.party!.options.includeScenes &&
      history.length >= 4 &&
      !history.slice(-4).some((c) => scene(recipeById(c.recipeId)))
    ) {
      const shortScenes = pool.filter(
        (r) => scene(r) && r.pattern !== "PRIVATE_ROLE",
      );
      if (shortScenes.length) pool = shortScenes;
    }
    const usedPatterns = history.slice(-3).map((c) => c.pattern);
    return weighted(
      pool,
      (r) =>
        r.weight *
        (usedPatterns.includes(r.pattern) ? 0.55 : 1.5) *
        (s.party!.options.pacing === "quick" && scene(r) ? 0.4 : 1) *
        (s.party!.options.pacing === "relaxed" && scene(r) ? 1.5 : 1) *
        (history.some(
          (c) =>
            c.disposition === "skipped" &&
            recipeById(c.recipeId)?.activityId === r.activityId,
        )
          ? 0.4
          : 1),
      rng,
    );
  },
};
function assignCard(s: SessionSnapshot, recipe: PartyRecipe, rng: RNG) {
  const a = activityById(recipe.activityId);
  const passed = s.party!.passedPlayerIds;
  const active = s.players.filter((p) => !p.isSittingOut);
  const n =
    recipe.performers === "everyone" ? active.length : recipe.performers;
  let available = active.filter((p) => !passed.includes(p.id));
  if (available.length < n) {
    // All-play includes active people except temporary passes; pair cards must remain viable.
    if (recipe.performers === "everyone" && available.length >= 1)
      return available.map((p) => p.id);
    available = active;
  }
  const history = s.rounds.filter((r) => r.status !== "skipped");
  if (a.id === "G2") {
    const assignment = assignPerformers(a, available, history, rng);
    return [...assignment.performerIds, ...assignment.supportingPlayerIds];
  }
  const result = assignPerformers(
    {
      ...a,
      id: "party_assignment",
      minPerformers: n,
      maxPerformers: n,
      playPattern: n === 2 ? "pair" : "ensemble",
    },
    available,
    history,
    rng,
  );
  // Two candidates are guaranteed for a pair; assignment prefers least-used pair in shared engine.
  return result.performerIds;
}
function generateCardPrompt(
  s: SessionSnapshot,
  recipe: PartyRecipe,
  performerIds: string[],
  rng: RNG,
  previous?: GameRound["promptSnapshot"],
) {
  const gameOptions = gamePromptOptions(
    recipe.activityId,
    "riff",
    recipe.level,
  );
  const history = s.rounds.slice(-40);
  const usage: Record<string, string[]> = {};
  for (const r of history)
    for (const [category, e] of Object.entries(r.promptSnapshot.entries))
      (usage[category] ??= []).push(e.id);
  let snapshot = generatePrompt(
    {
      ...gameOptions,
      categories: recipe.categories,
      count: Math.max(2, performerIds.length),
      style: "coherent",
      flavor: gameOptions.flavor,
      playerIds: performerIds,
      contentLevel: recipe.level,
      usage,
      previous,
    },
    rng,
  ).snapshot;
  if (["P1", "P2", "P3"].includes(recipe.activityId)) {
    const used = new Set(history.map((r) => r.promptSnapshot.jokeTopic?.id));
    const fresh = topics.filter(
      (t) =>
        t.contentRating === "clean" &&
        !used.has(t.id) &&
        t.id !== previous?.jokeTopic?.id,
    );
    const fallback = topics.filter(
      (t) => t.contentRating === "clean" && t.id !== previous?.jokeTopic?.id,
    );
    const t = sample(fresh.length ? fresh : fallback, rng);
    snapshot = {
      ...emptyPrompt(),
      jokeTopic: { id: t.id, word: t.word, contentRating: t.contentRating },
    };
  }
  return refreshComposition(snapshot);
}
export function appendPartyCard(
  s: SessionSnapshot,
  id: ID,
  now: string,
  options: { replay?: boolean; skip?: boolean; recipeId?: string } = {},
): SessionSnapshot {
  if (!s.party || s.status === "finished") return s;
  const active = s.players.filter((player) => !player.isSittingOut);
  const currentRecipe = recipeById(s.party.cards.at(-1)?.recipeId ?? "");
  const assignmentRecipe = options.recipeId
    ? recipeById(options.recipeId)
    : currentRecipe;
  const remaining = active.filter(
    (player) => !s.party!.passedPlayerIds.includes(player.id),
  );
  const needsFreshCast =
    typeof assignmentRecipe?.performers === "number" &&
    remaining.length < assignmentRecipe.performers;
  const selection = {
    ...s,
    party: {
      ...s.party,
      passedPlayerIds:
        needsFreshCast ||
        (active.length >= 2 &&
          active.every((player) =>
            s.party!.passedPlayerIds.includes(player.id),
          ))
          ? []
          : s.party.passedPlayerIds,
    },
  };
  const cursor = s.party.cursor + 1;
  const rng = seededRng(s.seed + cursor * 104729);
  const last = s.party.cards.at(-1);
  const requested = options.recipeId
    ? recipeById(options.recipeId)
    : options.replay && last
      ? recipeById(last.recipeId)
      : undefined;
  if (options.recipeId && !requested)
    throw Error("That party game is not available. Choose a listed game.");
  if (options.replay && !partyCanRepeat(s))
    throw Error(
      "This game is no longer included in the selected games. Start a selected game.",
    );
  if (
    options.recipeId &&
    requested &&
    selection.party.options.selectedActivityIds === null &&
    !partyDefaultActivityIds(selection.party.options.level).includes(
      requested.activityId,
    )
  )
    selection.party.options = {
      ...selection.party.options,
      selectedActivityIds: [
        ...partyDefaultActivityIds(selection.party.options.level),
        requested.activityId,
      ],
    };
  if (
    requested &&
    !compatiblePartyRecipes(selection).some((r) => r.id === requested.id)
  )
    throw Error(
      "That card is not compatible with the active players or content settings.",
    );
  const recipe = requested ?? PartyDeckEngine.choose(selection, rng);
  const rounds = s.rounds.map((r, i) =>
    i === s.rounds.length - 1
      ? {
          ...r,
          status: options.skip ? ("skipped" as const) : ("complete" as const),
          completedAt: now,
        }
      : r,
  );
  const base = { ...selection, rounds, party: { ...selection.party, cursor } };
  const a = activityById(recipe.activityId);
  const teamEligible =
    s.party.options.teams &&
    ["P1", "P2", "P3", "P5", "P6"].includes(recipe.activityId);
  const availableTeams = teamEligible
    ? s.teams.filter((t) =>
        t.playerIds.some(
          (pid) =>
            s.players.some((p) => p.id === pid && !p.isSittingOut) &&
            !selection.party.passedPlayerIds.includes(pid),
        ),
      )
    : [];
  const lastTeamId = [...s.party.cards].reverse().find((c) => c.teamId)?.teamId;
  const team =
    availableTeams.find((t) => t.id !== lastTeamId) ?? availableTeams[0];
  const performerIds = team
    ? team.playerIds.filter(
        (pid) =>
          s.players.some((p) => p.id === pid && !p.isSittingOut) &&
          !selection.party.passedPlayerIds.includes(pid),
      )
    : assignCard(base, recipe, rng);
  const actors = a.id === "G2" ? performerIds.slice(0, -1) : performerIds;
  const snapshot = generateCardPrompt(base, recipe, actors, rng);
  const round = prepareRound(base, a, id, now, snapshot);
  round.performerIds = performerIds;
  round.supportingPlayerIds = [];
  // Expert Interview has both an expert and interviewer; keep the existing engine roles.
  if (a.id === "G8") round.supportingPlayerIds = [round.performerIds.pop()!];
  if (a.id === "G2") round.supportingPlayerIds = [round.performerIds.pop()!];
  round.promptSnapshot = snapshot;
  if (round.secrets.length) {
    // prepareRound generated unique secrets; bind them to this card's fair assignment.
    round.secrets = round.secrets
      .slice(0, performerIds.length)
      .map((secret, i) => ({ ...secret, playerId: performerIds[i] }));
  }
  round.remainingMs = recipe.durationSec * 1000;
  round.schedule =
    recipe.pattern === "CUED_SCENE"
      ? generateCueSchedule(
          { ...a, defaultDurationSec: Math.max(90, recipe.durationSec) },
          rng,
          "playful",
        )
      : [];
  const immediate = !scene(recipe);
  round.status = immediate ? "live" : "intro";
  round.startedAt = immediate ? now : null;
  return {
    ...base,
    status: "active",
    updatedAt: now,
    rounds: [...rounds, round],
    party: {
      ...base.party,
      passedPlayerIds: [],
      turnPlayerId: undefined,
      cards: [
        ...s.party.cards.map((c, i) =>
          i === s.party!.cards.length - 1
            ? {
                ...c,
                disposition: options.skip
                  ? ("skipped" as const)
                  : ("played" as const),
              }
            : c,
        ),
        {
          roundId: round.id,
          teamId: team?.id,
          playerNames: Object.fromEntries(
            s.players.map((p) => [p.id, p.displayName]),
          ),
          recipeId: recipe.id,
          recipeVersion: recipe.version,
          contentPackVersion: PACK,
          pattern: recipe.pattern,
          level: recipe.level,
          disposition: "current",
        },
      ],
    },
  };
}
export function makePartySession(
  count: number,
  prefs: UserPreferences,
  names: string[],
  options: PartyOptions,
  id: ID,
  seed: number,
): SessionSnapshot {
  const s = makeSession(
    count,
    "party_night",
    { ...prefs, matureOptIn: false },
    id,
    seed,
    names,
    "W1",
    undefined,
    "riff",
    "rounds",
  );
  s.rounds = [];
  s.settings = {
    ...s.settings,
    scoring: "off",
    preferredMinutes: null,
    energy: options.movement ? "light_movement" : "seated",
    excludeMovement: !options.movement,
    cuePreference: options.automaticCues ? "sound_and_visual" : "manual",
  };
  s.party = {
    version: 1,
    options: normalizePartyOptions(options, prefs.classroomDefault),
    cards: [],
    cursor: 0,
    passedPlayerIds: [],
    archivedPlayers: [],
  };
  return appendPartyCard(s, id, s.createdAt);
}
export function rerollPartyPrompt(
  s: SessionSnapshot,
  classroom = s.settings.classroomClean,
): SessionSnapshot {
  if (!s.party || s.status === "finished") return s;
  const sourceRecipe = recipeById(s.party.cards.at(-1)!.recipeId);
  const candidates = isQuickGame(currentRound(s).activityId)
    ? { ...s, party: { ...s.party, passedPlayerIds: [] } }
    : s;
  const recipe = preferredPartyVariants(
    compatiblePartyRecipes(candidates),
    s.party.options.level,
  ).find((candidate) => candidate.activityId === sourceRecipe?.activityId);
  const r = currentRound(s);
  if (!recipe || !["live", "paused", "intro", "ready"].includes(r.status))
    return s;
  const cursor = s.party.cursor + 1;
  const team = s.teams.find(
    (team) => team.id === s.party?.cards.at(-1)?.teamId,
  );
  const activeIds = s.players
    .filter(
      (player) =>
        !player.isSittingOut && (!team || team.playerIds.includes(player.id)),
    )
    .map((player) => player.id);
  const performerIds = isQuickGame(r.activityId)
    ? [
        ...r.performerIds.filter((id) => activeIds.includes(id)),
        ...activeIds.filter((id) => !r.performerIds.includes(id)),
      ]
    : r.performerIds;
  const promptSnapshot = generateCardPrompt(
    s,
    recipe,
    r.activityId === "G2"
      ? performerIds
      : [...performerIds, ...r.supportingPlayerIds],
    seededRng(s.seed + cursor * 104729),
    r.promptSnapshot,
  );
  const navigation = isQuickGame(r.activityId)
    ? appendPromptNavigation(
        r.promptSnapshot,
        r.promptNavigation,
        partyPromptContext(
          { ...s, rounds: [...s.rounds.slice(0, -1), { ...r, performerIds }] },
          classroom,
        ),
        promptSnapshot,
      )
    : undefined;
  return {
    ...s,
    party: {
      ...s.party,
      cursor,
      ...(isQuickGame(r.activityId) ? { passedPlayerIds: [] } : {}),
      cards: s.party.cards.map((card, index) =>
        index === s.party!.cards.length - 1
          ? {
              ...card,
              recipeId: recipe.id,
              recipeVersion: recipe.version,
              level: recipe.level,
            }
          : card,
      ),
    },
    rounds: [
      ...s.rounds.slice(0, -1),
      {
        ...r,
        performerIds,
        turn: 0,
        promptSnapshot,
        ...(navigation ? { promptNavigation: navigation } : {}),
      },
    ],
  };
}

function partyPromptContext(
  s: SessionSnapshot,
  classroom = s.settings.classroomClean,
): string {
  const r = currentRound(s);
  return JSON.stringify({
    round: r.id,
    activity: r.activityId,
    options: s.party!.options,
    classroom,
    players: s.players.map((player) => [
      player.id,
      player.displayName,
      player.isSittingOut,
    ]),
    performers: r.performerIds,
    support: r.supportingPlayerIds,
    team: s.party!.cards.at(-1)?.teamId,
    locks: Object.entries(r.promptSnapshot.entries).filter(
      ([, entry]) => entry.locked,
    ),
  });
}

export function partyPromptNavigation(
  s: SessionSnapshot,
  classroom = s.settings.classroomClean,
) {
  const r = currentRound(s);
  if (
    !s.party ||
    s.status === "finished" ||
    !isQuickGame(r.activityId) ||
    r.secrets.length ||
    !["live", "paused", "intro", "ready"].includes(r.status) ||
    !partyCardAllowed(s, classroom) ||
    !partyCanRepeat(s)
  )
    return undefined;
  return currentPromptNavigation(
    r.promptSnapshot,
    r.promptNavigation,
    partyPromptContext(s, classroom),
  );
}

export function navigatePartyPrompt(
  s: SessionSnapshot,
  direction: -1 | 1,
  classroom = s.settings.classroomClean,
): SessionSnapshot {
  const navigation = partyPromptNavigation(s, classroom);
  if (!navigation)
    throw Error(
      "Prompt browsing is available only for an eligible quick game.",
    );
  const next = stepPromptNavigation(navigation, direction);
  const snapshot = next.snapshots[next.index];
  if (
    (classroom || s.party!.options.level === "clean") &&
    !snapshotIsClean(snapshot)
  )
    throw Error(
      "This previous prompt is hidden by your current content settings.",
    );
  const r = currentRound(s);
  return {
    ...s,
    rounds: [
      ...s.rounds.slice(0, -1),
      {
        ...r,
        promptNavigation: next,
        promptSnapshot: structuredClone(snapshot),
      },
    ],
  };
}
export function passPartyTurn(
  s: SessionSnapshot,
  playerId: string,
): SessionSnapshot {
  if (!s.party || !s.players.some((p) => p.id === playerId && !p.isSittingOut))
    return s;
  const r = currentRound(s);
  if (
    !r.performerIds.includes(playerId) &&
    !r.supportingPlayerIds.includes(playerId)
  )
    return s;
  const passed = [...new Set([...s.party.passedPlayerIds, playerId])];
  const beforeTurn = partyTurnPlayer(s);
  const performers = r.performerIds.filter((pid) => pid !== playerId);
  const nextTurnId =
    beforeTurn?.id === playerId
      ? r.performerIds[
          (r.performerIds.indexOf(playerId) + 1) % r.performerIds.length
        ]
      : beforeTurn?.id;
  const recipe = recipeById(s.party.cards.at(-1)!.recipeId);
  const everyone = recipe?.performers === "everyone";
  return {
    ...s,
    party: {
      ...s.party,
      passedPlayerIds: passed,
      turnPlayerId: nextTurnId === playerId ? undefined : nextTurnId,
    },
    rounds: [
      ...s.rounds.slice(0, -1),
      {
        ...r,
        performerIds: performers,
        supportingPlayerIds: r.supportingPlayerIds.filter(
          (pid) => pid !== playerId,
        ),
        turn: r.turn,
        // A pair/secret role needs a fresh assignment before continuing; preserve its archived prompt.
        status: !everyone || performers.length < 2 ? "paused" : r.status,
      },
    ],
  };
}
export function setPartySittingOut(
  s: SessionSnapshot,
  playerId: string,
  sittingOut: boolean,
): SessionSnapshot {
  const players = s.players.map((p) =>
    p.id === playerId ? { ...p, isSittingOut: sittingOut } : p,
  );
  if (players.filter((p) => !p.isSittingOut).length < 2)
    throw Error(
      "Keep at least two people playing. You can end the session instead.",
    );
  const next = sittingOut ? passPartyTurn(s, playerId) : s;
  return {
    ...next,
    players,
    settings: {
      ...next.settings,
      playerCount: players.filter((p) => !p.isSittingOut).length,
    },
  };
}
export const partyPromptText = (r: GameRound) =>
  r.promptSnapshot.jokeTopic?.word ||
  sceneText(r.promptSnapshot) ||
  (r.activityId === "W5" ? "Move together." : "Start with any word.");
export const partyParticipantText = (s: SessionSnapshot) => {
  const r = currentRound(s);
  const pattern = s.party?.cards.at(-1)?.pattern;
  const names = [...r.performerIds, ...r.supportingPlayerIds].map(
    (id) => s.players.find((p) => p.id === id)?.displayName ?? "Player",
  );
  const team = s.teams.find((t) => t.id === s.party?.cards.at(-1)?.teamId);
  if (team) return `${team.displayName}, you’re up · ${names.join(" + ")}`;
  if (isQuickGame(r.activityId))
    return s.players.filter((player) => !player.isSittingOut).length === 2
      ? "Both of you try this prompt"
      : "Everyone tries this prompt";
  if (pattern === "OPEN_MIC") return "1 answer each · any order";
  if (["ALL_PLAY", "TURN_BASED"].includes(pattern ?? ""))
    return "Everyone plays";
  return names.length === 1 ? `${names[0]}, you’re up` : names.join(" + ");
};
// Useful to library filters and content validation without duplicating activity definitions.
export const partyActivityIds = new Set(partyRecipes.map((r) => r.activityId));
export const allActivityIds = activities.map((a) => a.id);
export type { PartyOptions, PartyLevel, Player };

/** Historical actors keep their IDs even after leaving the current group. */
export const partyPlayers = (s: SessionSnapshot) => [
  ...s.players,
  ...(s.party?.archivedPlayers ?? []),
];
export function partyTurnPlayer(s: SessionSnapshot) {
  const r = currentRound(s);
  const people = r.performerIds.filter(
    (pid) =>
      s.players.some((p) => p.id === pid && !p.isSittingOut) &&
      !s.party?.passedPlayerIds.includes(pid),
  );
  const pid = people.includes(s.party?.turnPlayerId ?? "")
    ? s.party!.turnPlayerId
    : people[r.turn % people.length];
  return s.players.find((p) => p.id === pid);
}
export function nextPartyTurn(
  s: SessionSnapshot,
  id: ID,
  now: string,
): SessionSnapshot {
  if (!s.party || currentRound(s).status !== "live") return s;
  const r = currentRound(s);
  const people = r.performerIds.filter(
    (pid) => !s.party!.passedPlayerIds.includes(pid),
  );
  const index = people.indexOf(partyTurnPlayer(s)?.id ?? "");
  const updated = transitionRound(
    r,
    { type: "NEXT_TURN" },
    { session: s, now, id, rng: seededRng(s.seed + r.turn) },
  );
  return {
    ...s,
    party: { ...s.party, turnPlayerId: people[(index + 1) % people.length] },
    rounds: [...s.rounds.slice(0, -1), updated],
  };
}
export type PartyPlayerDraft = { id?: string; name: string };
export function editPartyRoster(
  s: SessionSnapshot,
  draft: PartyPlayerDraft[],
  id: ID,
  now: string,
): SessionSnapshot {
  if (!s.party || s.status === "finished") return s;
  if (draft.length < 2 || draft.length > 12)
    throw Error("Party Night needs 2–12 people.");
  const oldIds = new Set(s.players.map((p) => p.id));
  const supplied = draft.flatMap((p) => (p.id ? [p.id] : []));
  if (
    new Set(supplied).size !== supplied.length ||
    supplied.some((pid) => !oldIds.has(pid))
  )
    throw Error("That player list is out of date. Reopen Players.");
  const players = draft.map((p, i) => ({
    ...(s.players.find((old) => old.id === p.id) ?? {
      id: id(),
      isSittingOut: false,
    }),
    displayName: p.name.trim().slice(0, 40) || `Player ${i + 1}`,
    seatIndex: i,
  }));
  if (players.filter((p) => !p.isSittingOut).length < 2)
    throw Error("Rejoin at least two people before saving.");
  const removed = s.players.filter(
    (p) => !players.some((next) => next.id === p.id),
  );
  const membershipChanged =
    removed.length > 0 || players.some((p) => !oldIds.has(p.id));
  const teams = s.teams.map((t) => ({
    ...t,
    playerIds: t.playerIds.filter((pid) => players.some((p) => p.id === pid)),
  }));
  if (!teams.length)
    for (let i = 0; i < 2; i++)
      teams.push({
        id: id(),
        sessionId: s.id,
        displayName: `Team ${i ? "B" : "A"}`,
        playerIds: [],
      });
  for (const p of players)
    if (!teams.some((t) => t.playerIds.includes(p.id))) {
      [...teams]
        .sort((a, b) => a.playerIds.length - b.playerIds.length)[0]
        .playerIds.push(p.id);
    }
  for (const empty of teams.filter((t) => !t.playerIds.length)) {
    const largest = [...teams].sort(
      (a, b) => b.playerIds.length - a.playerIds.length,
    )[0];
    if (largest.playerIds.length > 1)
      empty.playerIds.push(largest.playerIds.pop()!);
  }
  const nonemptyTeams = teams.filter((t) => t.playerIds.length > 0);
  const changed: SessionSnapshot = {
    ...s,
    players,
    teams: nonemptyTeams,
    settings: {
      ...s.settings,
      playerCount: players.filter((p) => !p.isSittingOut).length,
    },
    party: {
      ...s.party,
      cards: s.party.cards.map((card) => ({
        ...card,
        playerNames:
          card.playerNames ??
          Object.fromEntries(partyPlayers(s).map((p) => [p.id, p.displayName])),
      })),
      archivedPlayers: [...s.party.archivedPlayers, ...removed],
      options: membershipChanged
        ? { ...s.party.options, level: "clean", adultsConfirmedAt: null }
        : s.party.options,
    },
  };
  // A fresh card makes any changed cast safe, while all old cards and secret assignments stay exact.
  return membershipChanged ? appendPartyCard(changed, id, now) : changed;
}
