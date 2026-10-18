import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Platform, View } from "react-native";
import { PartyOptionsFields, levelLabel } from "../components/PartyOptions";
import { PartyGamePicker } from "../components/PartyGamePicker";
import { Feedback, FeedbackChoices } from "../components/Feedback";
import { GameChoice } from "../components/GameChoice";
import { PartyDeckCard } from "../components/PartyDeckCard";
import { PromptSwipe } from "../components/PromptSwipe";
import { BrandMark } from "../design/brand";
import {
  Button,
  Card,
  Dialog,
  Disclosure,
  Eyebrow,
  Field,
  IconButton,
  Page,
  Row,
  Title,
  Toggle,
  Txt,
  useTheme,
} from "../design/ui";
import { activityById } from "../domain/content";
import { bookFor, partyGuidance, partyInstruction } from "../domain/playbooks";
import { adviceFor, missingAdviceContext } from "../domain/party-advice";
import { PartyComfortSchema } from "../domain/contracts";
import { isQuickGame, promptActionLabel } from "../domain/gameplay";
import {
  appendPartyCard,
  editPartyRoster,
  compatiblePartyRecipes,
  normalizePartyOptions,
  partyDeckError,
  partyCanRepeat,
  partyPromptNavigation,
  navigatePartyPrompt,
  partyCardAllowed,
  passPartyTurn,
  rerollPartyPrompt,
  setPartySittingOut,
  partyPlayers,
  partyPromptText,
  partyTurnPlayer,
  nextPartyTurn,
  type PartyPlayerDraft,
} from "../domain/party";
import { partyDefaultActivityIds, recipeById } from "../domain/party-recipes";
import type { PartyOptions } from "../domain/party-contracts";
import { currentRound, type GameAction } from "../domain/session";
import { useApp, uuid } from "../providers/AppProvider";
import { playHomePath } from "../config/navigation";
export default function Party() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data,
    ready,
    act,
    advanceParty,
    editPartyPlayers,
    changeSession,
    update,
    favorite,
  } = useApp();
  const router = useRouter();
  const t = useTheme();
  const s = data.sessions.find((s) => s.id === id);
  const [sheet, setSheet] = useState<
    | "more"
    | "rules"
    | "players"
    | "preferences"
    | "deck"
    | "feedback"
    | "games"
    | null
  >(null);
  const [largeDisplay, setLargeDisplay] = useState(false);
  const [roster, setRoster] = useState<PartyPlayerDraft[]>([]);
  const [editingPlayers, setEditingPlayers] = useState(false);
  const [draft, setDraft] = useState<PartyOptions | null>(null);
  const [secretVisible, setSecretVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const working = useRef(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  useFocusEffect(
    React.useCallback(
      () => () => {
        setSecretVisible(false);
        Speech.stop();
        if (id) void act(id, { type: "PAUSE" });
      },
      [id, act],
    ),
  );
  useEffect(() => {
    const cover = () => setSecretVisible(false);
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") cover();
    });
    const hide = () => {
      if (document.hidden) cover();
    };
    if (Platform.OS === "web")
      document.addEventListener("visibilitychange", hide);
    return () => {
      sub.remove();
      if (Platform.OS === "web")
        document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  useEffect(() => {
    if (!secretVisible) return;
    const timeout = setTimeout(() => setSecretVisible(false), 20000);
    return () => clearTimeout(timeout);
  }, [secretVisible]);
  const safely = async (fn: () => Promise<void>) => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save that change.");
    } finally {
      working.current = false;
      setBusy(false);
    }
  };
  if (!ready)
    return (
      <Page>
        <Txt>Opening your party…</Txt>
      </Page>
    );
  if (!s?.party)
    return (
      <Page>
        <Title eyebrow="PARTY NIGHT" title="Bring your people." />
        <Button onPress={() => router.replace("/party")}>Start a party</Button>
      </Page>
    );
  const r = currentRound(s);
  const a = activityById(r.activityId);
  const guidance = partyGuidance(a);
  const firstEncounter = !data.sessions.some((session) =>
    session.rounds.some(
      (round) => round.id !== r.id && round.activityId === a.id,
    ),
  );
  const advice = a.id === "P5" ? adviceFor(r.promptSnapshot) : null;
  const card = s.party.cards.at(-1)!;
  const recipe = recipeById(card.recipeId);
  const includedNow = partyCanRepeat(s);
  const gameHidden = !(
    s.party.options.selectedActivityIds ??
    partyDefaultActivityIds(s.party.options.level)
  ).includes(a.id);
  const allowed = partyCardAllowed(s, data.preferences.classroomDefault);
  const currentDeckProblem = partyDeckError(
    normalizePartyOptions(s.party.options, data.preferences.classroomDefault),
    s.players.filter((player) => !player.isSittingOut).length,
  );
  const name = (pid: string) =>
    partyPlayers(s).find((p) => p.id === pid)?.displayName ?? "Player";
  const live = r.status === "live";
  const turnPlayer = partyTurnPlayer(s);
  const paused = r.status === "paused" || s.status === "paused";
  const rolePlayerIds = [...r.performerIds, ...r.supportingPlayerIds];
  const required =
    a.id === "G2"
      ? 3
      : typeof recipe?.performers === "number"
        ? recipe.performers
        : 1;
  const needsPlayers =
    rolePlayerIds.length < required ||
    (a.id === "G2" &&
      (r.performerIds.length < 2 ||
        r.performerIds.length > 4 ||
        r.supportingPlayerIds.length !== 1 ||
        r.performerIds.includes(r.supportingPlayerIds[0]) ||
        new Set(r.performerIds).size !== r.performerIds.length ||
        !rolePlayerIds.every((pid) =>
          s.players.some((player) => player.id === pid && !player.isSittingOut),
        ))) ||
    (recipe?.performers !== "everyone" &&
      s.party.passedPlayerIds.some((pid) =>
        r.secrets.some((secret) => secret.playerId === pid),
      ));
  const navigation = partyPromptNavigation(
    s,
    data.preferences.classroomDefault,
  );
  const canPrevious = !!navigation && navigation.index > 0;
  const canForward =
    !!navigation && navigation.index < navigation.snapshots.length - 1;
  const browse = (direction: -1 | 1) =>
    void safely(async () => {
      await changeSession(id, (session) => {
        const current = partyPromptNavigation(
          session,
          data.preferences.classroomDefault,
        );
        if (!current)
          throw Error("Prompt browsing is unavailable for this card.");
        return direction === 1 && current.index === current.snapshots.length - 1
          ? rerollPartyPrompt(session, data.preferences.classroomDefault)
          : navigatePartyPrompt(
              session,
              direction,
              data.preferences.classroomDefault,
            );
      });
      setToast("");
    });
  const action = (action: GameAction) => void safely(() => act(id, action));
  const advance = (options: Parameters<typeof advanceParty>[1] = {}) =>
    void safely(async () => {
      setSecretVisible(false);
      Speech.stop();
      await advanceParty(id, options);
      setToast("");
      setSheet(null);
    });
  const hideGame = () =>
    void safely(async () => {
      await update((d) => {
        const session = d.sessions.find((session) => session.id === id);
        if (!session?.party) throw Error("This party is no longer available.");
        const gameId = currentRound(session).activityId;
        const selectedActivityIds = (
          session.party.options.selectedActivityIds ??
          partyDefaultActivityIds(session.party.options.level)
        ).filter((activityId) => activityId !== gameId);
        return {
          ...d,
          preferences: {
            ...d.preferences,
            selectedPartyActivityIds: selectedActivityIds,
          },
          sessions: d.sessions.map((item) =>
            item.id === id
              ? {
                  ...item,
                  updatedAt: new Date().toISOString(),
                  party: {
                    ...session.party!,
                    options: { ...session.party!.options, selectedActivityIds },
                  },
                }
              : item,
          ),
        };
      });
      setSheet(null);
      setToast(
        `${a.title} hidden from this and future parties. Bring it back in Choose games.`,
      );
    });
  const open = (value: typeof sheet) =>
    void safely(async () => {
      setSecretVisible(false);
      // Untimed social cards keep flowing after a quick menu visit. Timed/secret scenes pause safely.
      if (r.schedule.length || r.remainingMs > 0 || r.secrets.length)
        await act(id, { type: "PAUSE" });
      if (value === "players") {
        setRoster(s.players.map((p) => ({ id: p.id, name: p.displayName })));
        setEditingPlayers(false);
      }
      if (value === "preferences" || value === "deck")
        setDraft(
          normalizePartyOptions(
            s.party!.options,
            data.preferences.classroomDefault,
          ),
        );
      setSheet(value);
    });
  const start = () =>
    void safely(async () => {
      if (r.status === "intro") await act(id, { type: "READY" });
      if (!r.secrets.length || r.status === "ready")
        await act(id, { type: "START" });
    });
  const end = () =>
    void safely(async () => {
      setSecretVisible(false);
      Speech.stop();
      await changeSession(id, (session) => ({
        ...session,
        status: "finished",
        rounds: session.rounds.map((round, i) =>
          i === session.rounds.length - 1
            ? {
                ...round,
                status: "complete",
                completedAt: new Date().toISOString(),
              }
            : round,
        ),
        party: {
          ...session.party!,
          cards: session.party!.cards.map((c, i) =>
            i === session.party!.cards.length - 1
              ? { ...c, disposition: "played" }
              : c,
          ),
        },
      }));
      setSheet(null);
    });
  const save = () =>
    void safely(async () => {
      await update((d) => {
        if (
          d.savedPrompts.some(
            (p) =>
              JSON.stringify(p.snapshot) === JSON.stringify(r.promptSnapshot),
          )
        )
          return d;
        return {
          ...d,
          savedPrompts: [
            {
              id: uuid(),
              label: a.title,
              createdAt: new Date().toISOString(),
              snapshot: structuredClone(r.promptSnapshot),
              playerCount: Math.max(2, rolePlayerIds.length),
            },
            ...d.savedPrompts,
          ],
        };
      });
      setSheet(null);
      setToast("Prompt saved on this device.");
    });
  const deckProblem = draft
    ? partyDeckError(
        normalizePartyOptions(draft, data.preferences.classroomDefault),
        s.players.filter((player) => !player.isSittingOut).length,
      )
    : null;
  const savePreferences = () =>
    void safely(async () => {
      if (!draft) throw Error("Reopen Party preferences before saving.");
      const options = normalizePartyOptions(
        draft,
        data.preferences.classroomDefault,
      );
      await update((d) => {
        let session = d.sessions.find((session) => session.id === id);
        if (!session?.party) throw Error("This party is no longer available.");
        const problem = partyDeckError(
          options,
          session.players.filter((player) => !player.isSittingOut).length,
        );
        if (problem) throw Error(problem);
        if (options.teams && !session.teams.length)
          session = editPartyRoster(
            session,
            session.players.map((player) => ({
              id: player.id,
              name: player.displayName,
            })),
            uuid,
            new Date().toISOString(),
          );
        const changed = {
          ...session,
          settings: {
            ...session.settings,
            cuePreference: options.automaticCues
              ? ("sound_and_visual" as const)
              : ("manual" as const),
            excludeMovement: !options.movement,
            energy: options.movement
              ? ("light_movement" as const)
              : ("seated" as const),
          },
          party: { ...session.party!, options },
        };
        const variants = compatiblePartyRecipes(changed).filter(
          (recipe) => recipe.activityId === currentRound(session).activityId,
        );
        const preferred =
          variants.find((recipe) => recipe.level === options.level) ??
          variants.find(
            (recipe) => recipe.level === "spicy" && options.level !== "clean",
          ) ??
          variants.find((recipe) => recipe.level === "clean");
        const next =
          options.level !== session.party!.options.level && preferred
            ? appendPartyCard(changed, uuid, new Date().toISOString(), {
                recipeId: preferred.id,
              })
            : partyCardAllowed(changed, d.preferences.classroomDefault)
              ? changed
              : appendPartyCard(changed, uuid, new Date().toISOString(), {
                  skip: true,
                });
        return {
          ...d,
          preferences: {
            ...d.preferences,
            selectedPartyActivityIds: options.selectedActivityIds,
            lastPartyOptions: PartyComfortSchema.parse(options),
          },
          sessions: d.sessions.map((session) =>
            session.id === id ? next : session,
          ),
        };
      });
      setSheet(null);
      setToast(
        sheet === "deck"
          ? "Deck saved. Your choices apply from the next card."
          : `Playing ${levelLabel(options.level)}.`,
      );
    });
  if (s.status === "finished")
    return (
      <Page narrow>
        <Title
          eyebrow="PARTY NIGHT · YOUR RECAP"
          title="That was all you."
          sub={`${s.players.length} people · ${s.party.cards.filter((c) => c.disposition === "played").length} cards played.`}
        />
        <Txt size={14} accessibilityLiveRegion="polite">
          Saved on this device. Find your recap in Saved → Sessions.
        </Txt>
        <Card>
          <Eyebrow>THE LINEUP</Eyebrow>
          {s.rounds
            .filter((round) => round.status !== "skipped")
            .map((round) => (
              <Row key={round.id} style={{ justifyContent: "space-between" }}>
                <Txt>{activityById(round.activityId).title}</Txt>
                <Txt muted size={13}>
                  {round.performerIds
                    .map(
                      (pid) =>
                        s.party!.cards.find((c) => c.roundId === round.id)
                          ?.playerNames?.[pid] ?? name(pid),
                    )
                    .join(", ")}
                </Txt>
              </Row>
            ))}
        </Card>
        <Field
          label="Session highlight"
          placeholder="A line worth remembering?"
          value={s.note}
          multiline
          onChangeText={(note) =>
            void changeSession(id, (session) => ({
              ...session,
              note: note.slice(0, 500),
            }))
          }
        />
        <Button icon="shuffle" onPress={() => router.replace("/party")}>
          Another party
        </Button>
        <Button
          kind="secondary"
          onPress={() => router.replace(playHomePath(Platform.OS))}
        >
          Home
        </Button>
        <Button
          kind="ghost"
          onPress={() =>
            router.push({ pathname: "/saved", params: { tab: "sessions" } })
          }
        >
          View saved parties
        </Button>
      </Page>
    );
  return (
    <Page
      narrow
      compact
      play
      presentation={largeDisplay}
      dock={
        <View style={{ gap: 8 }}>
          {allowed &&
            live &&
            !needsPlayers &&
            card.pattern === "CUED_SCENE" && (
              <Button
                small
                kind="coral"
                onPress={() => action({ type: "CALL_CUE" })}
              >
                {a.id === "G2"
                  ? "New Choice!"
                  : a.id === "G3"
                    ? "New emotion"
                    : "New genre"}
              </Button>
            )}
          <View accessibilityLiveRegion="polite">
            {allowed &&
              r.cue &&
              (r.cue.type === "stop" ||
                r.elapsedMs - r.cue.atElapsedMs < r.cue.displayDurationMs) && (
                <Txt
                  testID="party-cue"
                  size={19}
                  weight="bold"
                  style={{ textAlign: "center", color: t.accentInk }}
                >
                  {r.cue.text}
                </Txt>
              )}
          </View>
          <Row
            style={{
              width: "100%",
              maxWidth: 740,
              alignSelf: "center",
              flexWrap: "nowrap",
              gap: 8,
            }}
          >
            <Button
              disabled={
                busy ||
                !allowed ||
                !!currentDeckProblem ||
                r.status === "private_reveal"
              }
              style={{ flex: 1, paddingHorizontal: 10 }}
              onPress={() =>
                !includedNow || s.party!.options.rotation === "shuffle"
                  ? advance()
                  : isQuickGame(a.id)
                    ? browse(1)
                    : advance({ replay: true })
              }
            >
              {!includedNow
                ? "Start selected game"
                : s.party.options.rotation === "shuffle"
                  ? "Next game"
                  : isQuickGame(a.id)
                    ? canForward
                      ? "Next prompt"
                      : promptActionLabel(a.id)
                    : a.id === "W6"
                      ? "Another word"
                      : a.id === "W8"
                        ? "Another prompt"
                        : a.id === "T2"
                          ? "Another character"
                          : a.id === "W5"
                            ? "Restart moves"
                            : recipe?.pattern === "TURN_BASED"
                              ? "Another story"
                              : "Another scene"}
            </Button>
            <Button
              kind="secondary"
              disabled={busy || !!currentDeckProblem}
              style={{ flex: 1, paddingHorizontal: 14 }}
              onPress={() => open("games")}
            >
              Change game
            </Button>
          </Row>
          <Row style={{ justifyContent: "space-between", gap: 6 }}>
            {live && (
              <Button
                small
                kind="ghost"
                style={{ paddingHorizontal: 10 }}
                onPress={() => action({ type: "PAUSE" })}
              >
                Pause
              </Button>
            )}
            <Button
              small
              kind="ghost"
              style={{ paddingHorizontal: 10 }}
              disabled={busy}
              onPress={end}
            >
              End game
            </Button>
            <Button
              small
              kind="ghost"
              style={{ paddingHorizontal: 10 }}
              onPress={() => open("rules")}
            >
              How to Play
            </Button>
          </Row>
        </View>
      }
    >
      <Row style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
        <Row style={{ gap: 8, flexWrap: "nowrap", flex: 1 }}>
          <BrandMark size={26} />
          <Eyebrow>PARTY NIGHT</Eyebrow>
        </Row>
        <IconButton
          name="people"
          label="Change players"
          onPress={() => open("players")}
        />
        <Button kind="ghost" small onPress={() => open("preferences")}>
          {data.preferences.classroomDefault
            ? "Clean enforced"
            : levelLabel(s.party.options.level)}
        </Button>
        <IconButton
          name="settings"
          label="Party menu"
          onPress={() => open("more")}
        />
      </Row>
      {!!error && (
        <Txt accessibilityLiveRegion="polite" style={{ color: t.accentInk }}>
          {error}
        </Txt>
      )}
      {!!currentDeckProblem && (
        <Card>
          <Txt accessibilityLiveRegion="polite">{currentDeckProblem}</Txt>
          <Button kind="secondary" onPress={() => open("deck")}>
            Edit deck
          </Button>
        </Card>
      )}
      {!allowed ? (
        <Card>
          <Txt>This card is hidden by your current content settings.</Txt>
          <Button
            disabled={!!currentDeckProblem}
            onPress={() => advance({ skip: true })}
          >
            Deal an eligible card
          </Button>
        </Card>
      ) : (
        <PromptSwipe
          disabled={!navigation || !!sheet || busy || needsPlayers}
          onPrevious={canPrevious ? () => browse(-1) : undefined}
          onNext={() => browse(1)}
        >
          <PartyDeckCard
            session={s}
            large={largeDisplay}
            privateContent={
              r.status === "private_reveal" ? (
                <View style={{ gap: 18 }}>
                  <Eyebrow>PRIVATE HANDOFF</Eyebrow>
                  <Txt serif size={28}>
                    Only {name(r.secrets[r.revealIndex]?.playerId)} should look.
                  </Txt>
                  <Txt size={18}>
                    {secretVisible
                      ? r.secrets[r.revealIndex]?.text
                      : "Everyone else looks away. Pass the phone face down."}
                  </Txt>
                  <Button
                    kind="secondary"
                    onPress={() => {
                      if (!secretVisible) setSecretVisible(true);
                      else {
                        setSecretVisible(false);
                        action({ type: "HIDE_PRIVATE_REVEAL" });
                      }
                    }}
                  >
                    {secretVisible ? "Hide & pass" : "Reveal my role"}
                  </Button>
                  {!secretVisible && (
                    <Button
                      kind="ghost"
                      onPress={() => {
                        setSecretVisible(false);
                        void safely(async () => {
                          await changeSession(id, (session) =>
                            passPartyTurn(
                              session,
                              r.secrets[r.revealIndex].playerId,
                            ),
                          );
                          await advanceParty(id, { skip: true });
                        });
                      }}
                    >
                      Pass this role
                    </Button>
                  )}
                </View>
              ) : undefined
            }
          >
            {r.status !== "private_reveal" &&
              (needsPlayers ? (
                <View style={{ gap: 12 }}>
                  <Txt>
                    {a.id === "G2"
                      ? "New Choice needs 2–4 actors and a separate caller. Add a player and start a new scene, or change game. Your saved scene is unchanged."
                      : "Someone passed. No pressure."}
                  </Txt>
                  <Button
                    kind="secondary"
                    onPress={() => advance({ skip: true })}
                  >
                    New scene
                  </Button>
                </View>
              ) : paused ? (
                <Button
                  icon="play"
                  disabled={busy}
                  onPress={() => action({ type: "RESUME" })}
                >
                  Resume
                </Button>
              ) : r.status === "intro" || r.status === "ready" ? (
                <View style={{ gap: 10 }}>
                  {firstEncounter && (
                    <Button
                      small
                      kind="secondary"
                      onPress={() => open("rules")}
                    >
                      Learn this game
                    </Button>
                  )}
                  <Button icon="play" disabled={busy} onPress={start}>
                    {r.secrets.length && r.status === "intro"
                      ? "Pass out the roles"
                      : "Start"}
                  </Button>
                </View>
              ) : null)}
          </PartyDeckCard>
        </PromptSwipe>
      )}
      {navigation && (
        <Row style={{ gap: 8 }}>
          <Button
            small
            kind="ghost"
            disabled={!canPrevious || busy}
            onPress={() => browse(-1)}
          >
            Previous prompt
          </Button>
          <Txt muted size={12}>
            Swipe left for next · right for previous
          </Txt>
        </Row>
      )}
      {allowed &&
        live &&
        !needsPlayers &&
        card.pattern === "TURN_BASED" &&
        turnPlayer && (
          <Disclosure title="Optional turn guide">
            <Card style={{ padding: 16, gap: 8 }}>
              <Txt weight="bold">
                {turnPlayer.displayName}, you’re up
                {a.id === "W4"
                  ? ` · ${r.turn % 2 === 0 ? "Fortunately…" : "Unfortunately…"}`
                  : a.id === "W1"
                    ? " · Yes, and…"
                    : ""}
              </Txt>
              <Row>
                <Button
                  small
                  kind="secondary"
                  onPress={() =>
                    void safely(() =>
                      changeSession(id, (session) =>
                        nextPartyTurn(session, uuid, new Date().toISOString()),
                      ),
                    )
                  }
                >
                  Next turn
                </Button>
                <Button
                  small
                  kind="ghost"
                  onPress={() =>
                    void safely(() =>
                      changeSession(id, (session) =>
                        passPartyTurn(session, turnPlayer.id),
                      ),
                    )
                  }
                >
                  Pass turn
                </Button>
              </Row>
              <Txt muted size={12}>
                Optional guide. You can also just go around the group.
              </Txt>
            </Card>
          </Disclosure>
        )}
      <Feedback
        activityId={a.id}
        roundId={r.id}
        snapshot={allowed ? r.promptSnapshot : undefined}
      />
      {largeDisplay && (
        <Button small kind="secondary" onPress={() => setLargeDisplay(false)}>
          Exit Large Display
        </Button>
      )}
      {!!toast && (
        <Txt
          size={14}
          accessibilityLiveRegion="polite"
          style={{ color: t.accentInk }}
        >
          {toast}
        </Txt>
      )}
      <Dialog
        visible={sheet !== null}
        onClose={() => setSheet(null)}
        title={
          sheet
            ? {
                more: "Your party",
                rules: "How to Play",
                players: "Your people",
                preferences: "Party preferences",
                deck: "Choose games",
                games: "Play a game now",
                feedback: "How did it land?",
              }[sheet]
            : "Your party"
        }
      >
        {sheet === "more" && (
          <>
            <Button
              kind="secondary"
              disabled={busy || gameHidden}
              onPress={hideGame}
            >
              {gameHidden ? "Game type hidden" : "Hide this game type"}
            </Button>
            {live && (
              <Button
                kind="secondary"
                icon="pause"
                onPress={() =>
                  void safely(async () => {
                    await act(id, { type: "PAUSE" });
                    setSheet(null);
                  })
                }
              >
                Pause
              </Button>
            )}
            {allowed && (
              <>
                <Button
                  kind="secondary"
                  icon="heart"
                  onPress={() => favorite(a.id)}
                >
                  {data.favorites.includes(a.id)
                    ? "Unfavorite Game"
                    : "Favorite Game"}
                </Button>
              </>
            )}
            {allowed && includedNow && !r.secrets.length && (
              <Button
                kind="secondary"
                onPress={() =>
                  void safely(async () => {
                    await changeSession(id, rerollPartyPrompt);
                    setSheet(null);
                  })
                }
              >
                Another prompt in this game
              </Button>
            )}
            <Button
              kind="secondary"
              disabled={!includedNow}
              onPress={() => advance({ replay: true })}
            >
              New round of this game
            </Button>
            <Button kind="secondary" onPress={() => open("deck")}>
              Choose games
            </Button>
            <Button kind="secondary" onPress={() => setSheet("games")}>
              Play a game now
            </Button>
            {recipe && recipe.durationSec > 0 && (
              <>
                <Toggle
                  label="Scene timer"
                  sub="Optional. Finishing the timer never changes the card."
                  value={r.remainingMs > 0}
                  onChange={(enabled) =>
                    void safely(() =>
                      changeSession(id, (session) => ({
                        ...session,
                        rounds: session.rounds.map((round) =>
                          round.id === r.id
                            ? {
                                ...round,
                                remainingMs: enabled
                                  ? recipe.durationSec * 1000
                                  : 0,
                              }
                            : round,
                        ),
                      })),
                    )
                  }
                />
                <Button
                  kind="secondary"
                  onPress={() =>
                    void safely(() =>
                      changeSession(id, (session) => ({
                        ...session,
                        rounds: session.rounds.map((round) =>
                          round.id === r.id
                            ? {
                                ...round,
                                remainingMs: recipe.durationSec * 1000,
                              }
                            : round,
                        ),
                      })),
                    )
                  }
                >
                  Restart timer
                </Button>
              </>
            )}
            {allowed &&
              (Object.keys(r.promptSnapshot.entries).length > 0 ||
                r.promptSnapshot.jokeTopic) && (
                <Button kind="secondary" onPress={save}>
                  Save Prompt
                </Button>
              )}
            <Button
              kind="secondary"
              onPress={() => {
                setLargeDisplay(!largeDisplay);
                setSheet(null);
              }}
            >
              {largeDisplay ? "Exit Large Display" : "Large Display"}
            </Button>
            <Button kind="secondary" onPress={() => open("players")}>
              Players & passes
            </Button>
            <Button kind="secondary" onPress={() => open("preferences")}>
              Party preferences
            </Button>
            <Button kind="secondary" onPress={() => setSheet("feedback")}>
              Rate this card
            </Button>
            <Button
              kind="secondary"
              onPress={() =>
                void safely(async () => {
                  await act(id, { type: "PAUSE" });
                  router.replace(playHomePath(Platform.OS));
                })
              }
            >
              Save & leave
            </Button>
            <Button kind="ghost" onPress={end}>
              End Session
            </Button>
          </>
        )}
        {sheet === "rules" && !allowed && (
          <Txt>
            This card is hidden by your current content settings. Choose an
            available game to continue.
          </Txt>
        )}
        {sheet === "rules" && allowed && (
          <>
            <Txt weight="bold">{a.title}</Txt>
            <Txt>{partyInstruction(a)}</Txt>
            <Eyebrow>THIS ROUND</Eyebrow>
            <Txt>{guidance.participation}</Txt>
            <Eyebrow>SUGGESTED STARTING LENGTH</Eyebrow>
            <Txt weight="medium">{guidance.roundLimit}</Txt>
            <Txt>{guidance.finish}</Txt>
            {a.id === "G2" && (
              <Txt>
                Bell plays even with spoken cues off. Check volume and audio
                output.
              </Txt>
            )}
            {a.id === "P5" && (
              <>
                <Eyebrow>A PRETEND FRIEND ASKS</Eyebrow>
                <Txt>{partyPromptText(r)}</Txt>
                <Txt weight="medium">
                  {advice?.question ?? missingAdviceContext}
                </Txt>
              </>
            )}
            {isQuickGame(a.id) && (
              <Txt>
                The reader can start. Everyone uses this prompt for a separate
                response. Go around again if you like.
              </Txt>
            )}
            {a.id === "P5" ? (
              advice && (
                <>
                  <Eyebrow>EXAMPLE OF ONE ANSWER</Eyebrow>
                  <Txt>{advice.example}</Txt>
                </>
              )
            ) : (
              <>
                <Eyebrow>TRY IT LIKE THIS</Eyebrow>
                <Txt>{bookFor(a).example}</Txt>
              </>
            )}
            <Txt muted>Pass freely. Nobody owes the group a performance.</Txt>
          </>
        )}
        {sheet === "players" && (
          <>
            <Txt muted size={14}>
              Pass freely, sit out, or change the group. Earlier cards keep
              their original assignments.
            </Txt>
            {editingPlayers ? (
              <>
                {roster.map((p, i) => (
                  <View key={p.id ?? `new-${i}`} style={{ gap: 4 }}>
                    <Field
                      label={`Player ${i + 1} name`}
                      value={p.name}
                      placeholder={`Player ${i + 1}`}
                      onChangeText={(name) =>
                        setRoster((old) =>
                          old.map((p, j) =>
                            i === j ? { ...p, name: name.slice(0, 40) } : p,
                          ),
                        )
                      }
                    />
                    <Button
                      small
                      kind="ghost"
                      disabled={roster.length <= 2}
                      onPress={() =>
                        setRoster((old) => old.filter((_, j) => i !== j))
                      }
                    >
                      Remove player {i + 1}
                    </Button>
                  </View>
                ))}
                <Button
                  kind="secondary"
                  disabled={roster.length >= 12}
                  onPress={() => setRoster((old) => [...old, { name: "" }])}
                >
                  Add player
                </Button>
                <Txt muted size={13}>
                  Adding or removing people deals a fresh Clean card. Adult
                  cards need confirmation for the new group.
                </Txt>
                <Button
                  disabled={busy}
                  onPress={() =>
                    void safely(async () => {
                      await editPartyPlayers(id, roster);
                      setSheet(null);
                      setToast("Group updated.");
                    })
                  }
                >
                  Save players
                </Button>
                <Button kind="ghost" onPress={() => setEditingPlayers(false)}>
                  Cancel edits
                </Button>
              </>
            ) : (
              <>
                <Button
                  kind="secondary"
                  onPress={() => setEditingPlayers(true)}
                >
                  Edit names, add or remove players
                </Button>
                {s.players.map((p) => (
                  <View key={p.id} style={{ gap: 5 }}>
                    <Txt weight="bold">{p.displayName}</Txt>
                    <Row>
                      <Button
                        small
                        kind="secondary"
                        disabled={
                          p.isSittingOut ||
                          (!isQuickGame(a.id) &&
                            !rolePlayerIds.includes(p.id)) ||
                          s.party!.passedPlayerIds.includes(p.id)
                        }
                        onPress={() =>
                          void safely(() =>
                            changeSession(id, (session) =>
                              passPartyTurn(session, p.id),
                            ),
                          )
                        }
                      >
                        Pass {p.displayName}
                      </Button>
                      <Button
                        small
                        kind="ghost"
                        onPress={() =>
                          void safely(() =>
                            changeSession(id, (session) =>
                              setPartySittingOut(
                                session,
                                p.id,
                                !p.isSittingOut,
                              ),
                            ),
                          )
                        }
                      >
                        {p.isSittingOut
                          ? `Rejoin ${p.displayName}`
                          : `Sit out ${p.displayName}`}
                      </Button>
                    </Row>
                  </View>
                ))}
                {s.party.passedPlayerIds.length > 0 && (
                  <Button
                    kind="secondary"
                    onPress={() =>
                      void safely(() =>
                        changeSession(id, (session) => ({
                          ...session,
                          party: { ...session.party!, passedPlayerIds: [] },
                        })),
                      )
                    }
                  >
                    Clear passes for the next card
                  </Button>
                )}
                {s.party.options.teams && (
                  <>
                    <Eyebrow>TEAMS · NO SCORING REQUIRED</Eyebrow>
                    {s.teams.map((team) => (
                      <View key={team.id} style={{ gap: 6 }}>
                        <Field
                          label={`Name for ${team.displayName}`}
                          value={team.displayName}
                          onChangeText={(displayName) =>
                            void changeSession(id, (session) => ({
                              ...session,
                              teams: session.teams.map((t) =>
                                t.id === team.id
                                  ? {
                                      ...t,
                                      displayName:
                                        displayName.trim().slice(0, 40) ||
                                        "Team",
                                    }
                                  : t,
                              ),
                            }))
                          }
                        />
                        <Txt size={14}>
                          {team.playerIds.map(name).join(", ")}
                        </Txt>
                        {team.playerIds.map((pid) => (
                          <Button
                            key={pid}
                            small
                            kind="ghost"
                            disabled={team.playerIds.length <= 1}
                            onPress={() =>
                              void safely(() =>
                                changeSession(id, (session) => ({
                                  ...session,
                                  teams: session.teams.map((t) => ({
                                    ...t,
                                    playerIds:
                                      t.id === team.id
                                        ? t.playerIds.filter((p) => p !== pid)
                                        : [...t.playerIds, pid],
                                  })),
                                })),
                              )
                            }
                          >
                            Move {name(pid)} to other team
                          </Button>
                        ))}
                      </View>
                    ))}
                  </>
                )}
                <Button onPress={() => setSheet(null)}>Done</Button>
              </>
            )}
          </>
        )}
        {sheet === "deck" && draft && (
          <>
            <Txt size={14} muted>
              Keep playing the current card. Changes apply from the next card
              and are remembered for future parties.
            </Txt>
            <PartyGamePicker
              value={draft}
              onChange={setDraft}
              playerCount={
                s.players.filter((player) => !player.isSittingOut).length
              }
              classroom={data.preferences.classroomDefault}
            />
            <Button
              disabled={
                !!deckProblem ||
                (draft.level === "18_plus" && !draft.adultsConfirmedAt)
              }
              onPress={savePreferences}
            >
              Save deck
            </Button>
          </>
        )}
        {sheet === "preferences" && (
          <>
            {draft && (
              <PartyOptionsFields
                value={draft}
                onChange={setDraft}
                classroom={data.preferences.classroomDefault}
              />
            )}
            <Button kind="secondary" onPress={() => setSheet("deck")}>
              Choose games
            </Button>
            {!!deckProblem && (
              <Txt accessibilityLiveRegion="polite">{deckProblem}</Txt>
            )}
            <Button
              disabled={
                !draft ||
                !!deckProblem ||
                (draft.level === "18_plus" && !draft.adultsConfirmedAt)
              }
              onPress={savePreferences}
            >
              Apply preferences
            </Button>
            {s.party.options.level !== "clean" && (
              <Button
                kind="secondary"
                onPress={() =>
                  void safely(async () => {
                    await changeSession(id, (session) => {
                      const clean = {
                        ...session,
                        party: {
                          ...session.party!,
                          options: {
                            ...session.party!.options,
                            level: "clean" as const,
                            adultsConfirmedAt: null,
                          },
                        },
                      };
                      const problem = partyDeckError(
                        clean.party.options,
                        clean.players.filter((player) => !player.isSittingOut)
                          .length,
                      );
                      return partyCardAllowed(clean, true) || problem
                        ? clean
                        : appendPartyCard(
                            clean,
                            uuid,
                            new Date().toISOString(),
                            {
                              skip: true,
                            },
                          );
                    });
                    setSheet(null);
                    setToast("Playing Clean.");
                  })
                }
              >
                Return to Clean
              </Button>
            )}
          </>
        )}
        {sheet === "games" && (
          <>
            <Txt muted size={14}>
              Choose a game for this group. A game outside the default quick mix
              is included for this session. Choose games edits the mix.
            </Txt>
            {compatiblePartyRecipes(s)
              .filter(
                (recipe, i, all) =>
                  !all
                    .slice(i + 1)
                    .some((r) => r.activityId === recipe.activityId),
              )
              .map((recipe) => (
                <GameChoice
                  key={recipe.id}
                  title={activityById(recipe.activityId).title}
                  description={partyInstruction(
                    activityById(recipe.activityId),
                  )}
                  disabled={busy}
                  onPress={() => advance({ recipeId: recipe.id })}
                />
              ))}
          </>
        )}
        {sheet === "feedback" && (
          <FeedbackChoices
            disabled={busy}
            onRate={(rating) =>
              void safely(async () => {
                await update((d) => ({
                  ...d,
                  feedback: [
                    ...d.feedback,
                    {
                      id: uuid(),
                      activityId: a.id,
                      roundId: r.id,
                      recipeId: card.recipeId,
                      rating,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }));
                setToast("Feedback saved on this device.");
                setSheet(null);
              })
            }
          />
        )}
      </Dialog>
    </Page>
  );
}
