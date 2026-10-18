import {
  Redirect,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Platform, View, useWindowDimensions } from "react-native";
import { Feedback } from "../components/Feedback";
import { GameChoice } from "../components/GameChoice";
import { ComposedPrompt } from "../components/ComposedPrompt";
import { FreePlayDock } from "../components/FreePlayDock";
import { RoundDock } from "../components/RoundDock";
import { CueCard, SceneBrief, TurnStage } from "../components/RoundStage";
import { Scoring } from "../components/Scoring";
import { BrandMark } from "../design/brand";
import {
  Button,
  Card,
  Chip,
  Counter,
  Dialog,
  Disclosure,
  Eyebrow,
  Field,
  Icon,
  IconButton,
  Page,
  Row,
  Title,
  Toggle,
  Txt,
  useTheme,
} from "../design/ui";
import { activityById } from "../domain/content";
import {
  bookFor,
  instructionFor,
  intentDescriptions,
  intentLabels,
} from "../domain/playbooks";
import { snapshotIsClean } from "../domain/prompts";
import {
  currentRound,
  eligibleActivities,
  exposure,
  prepareRound,
} from "../domain/session";
import { useApp, uuid } from "../providers/AppProvider";
import { PromptCards } from "./Studio";
import { playHomePath } from "../config/navigation";
export default function Session() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, ready, act, next, changeSession, update, favorite } = useApp();
  const s = data.sessions.find((s) => s.id === id);
  const t = useTheme();
  const { width } = useWindowDimensions();
  const [secretVisible, setSecretVisible] = useState(false);
  const [large, setLarge] = useState(false);
  const [sheet, setSheet] = useState<
    "rules" | "details" | "players" | "host" | "exit" | "games" | null
  >(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const working = useRef(false);
  useEffect(() => {
    const hide = () => setSecretVisible(false);
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") hide();
    });
    const visibility = () => {
      if (document.hidden) hide();
    };
    if (Platform.OS === "web")
      document.addEventListener("visibilitychange", visibility);
    return () => {
      sub.remove();
      if (Platform.OS === "web")
        document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useFocusEffect(
    React.useCallback(
      () => () => {
        setSecretVisible(false);
        if (id) void act(id, { type: "PAUSE" });
        Speech.stop();
      },
      [id, act],
    ),
  );
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
      setError(
        e instanceof Error ? e.message : "That change could not be saved.",
      );
    } finally {
      working.current = false;
      setBusy(false);
    }
  };
  if (!ready)
    return (
      <Page compact>
        <Txt>Opening your saved game…</Txt>
      </Page>
    );
  if (!s)
    return (
      <Page narrow>
        <Title eyebrow="YOUR GAME" title="Your next good time is waiting." />
        <Button onPress={() => router.replace(playHomePath(Platform.OS))}>
          Go play
        </Button>
      </Page>
    );
  if (s.party) return <Redirect href={`/party/${s.id}`} />;
  const r = currentRound(s);
  const a = activityById(r.activityId);
  const b = bookFor(a);
  const instruction = instructionFor(a, r.promptSnapshot);
  const practice = s.settings.playIntent === "practice";
  const freePlay = s.settings.playFlow === "free";
  const summary = s.status === "finished";
  const active = s.players.filter((p) => !p.isSittingOut);
  const minGroup = s.settings.mode === "party_night" ? 3 : 2;
  const name = (pid: string) =>
    s.players.find((p) => p.id === pid)?.displayName ?? "Player";
  const blocked =
    (a.contentRating !== "clean" &&
      (!data.preferences.matureOptIn || data.preferences.classroomDefault)) ||
    (data.preferences.classroomDefault && !snapshotIsClean(r.promptSnapshot));
  const isLive = r.status === "live" || r.status === "paused";
  const review = r.status === "review" || r.status === "complete";
  const action = (action: Parameters<typeof act>[1]) =>
    void safely(() => act(id, action));
  const start = () =>
    void safely(async () => {
      if (r.status === "intro") {
        await act(id, { type: "READY" });
        if (!a.requiresPrivateReveal) await act(id, { type: "START" });
      } else if (r.status === "ready") await act(id, { type: "START" });
    });
  const skip = () => {
    setSecretVisible(false);
    void safely(async () => {
      await act(id, { type: "SKIP" });
      await next(id);
    });
  };
  const pauseSheet = (value: typeof sheet) => {
    setSecretVisible(false);
    void safely(async () => {
      await act(id, { type: "PAUSE" });
      setSheet(value);
    });
  };
  const performerLabel =
    a.id === "G2"
      ? `Actors: ${r.performerIds.map(name).join(" + ")} · Caller: ${r.supportingPlayerIds.map(name).join(", ") || "missing — add a player and start a new scene, or change game"}`
      : a.id === "G7"
        ? `${r.performerIds.map(name).join(" + ")} · Sound effects: ${r.supportingPlayerIds.map(name).join(", ")}`
        : a.id === "T3"
          ? `Host: ${r.supportingPlayerIds.map(name).join(", ")} · ${r.performerIds.length} guests`
          : a.id === "G6"
            ? `${r.performerIds.map(name).join("")} · Translator: ${r.supportingPlayerIds.map(name).join(", ")}`
            : a.id === "G8"
              ? `Expert: ${r.performerIds.map(name).join("")} · Interviewer: ${r.supportingPlayerIds.map(name).join(", ")}`
              : r.performerIds.map(name).join(" + ");
  const resizeGroup = (count: number) =>
    void changeSession(id, (session) => {
      const players = [...session.players];
      while (players.length < count)
        players.push({
          id: uuid(),
          displayName: `Player ${players.length + 1}`,
          seatIndex: players.length,
          isSittingOut: false,
        });
      return {
        ...session,
        players: players.map((p, i) => ({ ...p, isSittingOut: i >= count })),
        teams: session.teams.map((team, i) => ({
          ...team,
          playerIds: players.filter((_, j) => j % 2 === i).map((p) => p.id),
        })),
        settings: { ...session.settings, playerCount: count },
      };
    });
  const freshSame = () =>
    void safely(() =>
      changeSession(id, (session) => {
        const history = session.rounds.map((x) =>
          x.id === r.id ? { ...x, status: "skipped" as const } : x,
        );
        const base = { ...session, rounds: history };
        return {
          ...base,
          rounds: [
            ...history,
            prepareRound(base, a, uuid, new Date().toISOString()),
          ],
        };
      }),
    );
  const end = () =>
    void safely(async () => {
      await act(id, { type: "PAUSE" });
      await changeSession(id, (session) => ({
        ...session,
        status: "finished",
        rounds: session.rounds.map((x) =>
          x.status === "review" ? { ...x, status: "complete" } : x,
        ),
      }));
      setSheet(null);
      if (freePlay) router.replace(playHomePath(Platform.OS));
    });
  const chooseFreeGame = (activityId: string) =>
    void safely(async () => {
      await changeSession(id, (session) => {
        const history = session.rounds.map((x) =>
          x.id === r.id
            ? {
                ...x,
                status: "complete" as const,
                completedAt: new Date().toISOString(),
              }
            : x,
        );
        const base = { ...session, status: "active" as const, rounds: history };
        return {
          ...base,
          rounds: [
            ...history,
            prepareRound(
              base,
              activityById(activityId),
              uuid,
              new Date().toISOString(),
            ),
          ],
        };
      });
      setSheet(null);
    });
  const dock =
    !summary && !blocked ? (
      freePlay && isLive ? (
        <FreePlayDock
          round={r}
          activity={a}
          busy={busy}
          onAction={action}
          onChangeGame={() => pauseSheet("games")}
          onDone={end}
        />
      ) : (
        <RoundDock
          startLabel={freePlay ? "Start playing" : "Start round"}
          round={r}
          activity={a}
          busy={busy}
          secretVisible={secretVisible}
          onAction={action}
          onStart={start}
          onSkip={skip}
          onNext={(replay) => void safely(() => next(id, replay))}
          onReveal={() => setSecretVisible(true)}
          onCover={() => {
            setSecretVisible(false);
            action({ type: "HIDE_PRIVATE_REVEAL" });
          }}
        />
      )
    ) : undefined;
  return (
    <Page
      narrow={!large}
      compact
      play={!summary}
      presentation={large}
      dock={dock}
    >
      <Row style={{ justifyContent: "space-between", flexWrap: "nowrap" }}>
        <Row style={{ gap: 8, flex: 1, flexWrap: "nowrap" }}>
          {!summary && <BrandMark size={26} />}
          <View style={{ flex: 1 }}>
            <Eyebrow>
              {summary
                ? "YOUR RECAP"
                : freePlay
                  ? "FREE PLAY"
                  : `${practice ? "Practice" : "Just for fun"} · ROUND ${r.ordinal + 1}`}
            </Eyebrow>
          </View>
        </Row>
        <Row style={{ gap: 0, flexWrap: "nowrap" }}>
          {!summary && (
            <>
              <IconButton
                name="expand"
                label={large ? "Exit display" : "Large Display"}
                active={large}
                onPress={() => setLarge(!large)}
              />
              <IconButton
                name="settings"
                label="Host controls"
                onPress={() => pauseSheet("host")}
              />
              <Button small kind="ghost" onPress={() => pauseSheet("exit")}>
                Exit
              </Button>
            </>
          )}
        </Row>
      </Row>
      {!!error && (
        <Txt style={{ color: t.accentInk }} accessibilityLiveRegion="polite">
          {error}
        </Txt>
      )}
      {summary ? (
        <>
          <Title
            eyebrow="GOOD COMPANY. NO SCRIPT."
            title="That was all you."
            sub={
              freePlay
                ? `${s.players.length} people · one good time.`
                : `${s.rounds.filter((x) => x.status === "complete").length} rounds · ${s.players.length} people · one good time.`
            }
          />
          <Card>
            <Eyebrow>YOUR LINEUP</Eyebrow>
            {s.rounds
              .filter((x) => x.startedAt)
              .map((x) => (
                <Row key={x.id} style={{ justifyContent: "space-between" }}>
                  <Txt>{activityById(x.activityId).title}</Txt>
                  <Txt muted size={14}>
                    {Math.round(x.elapsedMs / 1000)}s
                  </Txt>
                </Row>
              ))}
            {!s.rounds.some((x) => x.startedAt) && (
              <Txt muted>Come back whenever you feel like playing.</Txt>
            )}
          </Card>
          <Card>
            <Eyebrow>A MOMENT TO KEEP</Eyebrow>
            <Field
              label="Session highlight"
              multiline
              placeholder="Something you want to remember?"
              value={s.note}
              onChangeText={(note) =>
                void changeSession(id, (s) => ({
                  ...s,
                  note: note.slice(0, 500),
                }))
              }
            />
          </Card>
          <Row>
            <Button icon="shuffle" onPress={() => router.push("/start")}>
              Play again
            </Button>
            <Button kind="secondary" onPress={() => router.push("/saved")}>
              Saved & history
            </Button>
            <Button
              kind="ghost"
              onPress={() => router.push(playHomePath(Platform.OS))}
            >
              Home
            </Button>
          </Row>
        </>
      ) : blocked ? (
        <Card>
          <Txt>This game is hidden by your current clean-content settings.</Txt>
          <Button onPress={skip}>Choose a clean game</Button>
        </Card>
      ) : (
        <>
          <View style={{ gap: 9 }}>
            <Row
              style={{ justifyContent: "space-between", flexWrap: "nowrap" }}
            >
              <Txt
                serif
                size={large ? 54 : width < 360 ? 29 : 35}
                style={{
                  lineHeight: large ? 65 : 43,
                  letterSpacing: -0.8,
                  flex: 1,
                }}
              >
                {a.title}
              </Txt>
              <IconButton
                name="heart"
                label="Favorite this game"
                active={data.favorites.includes(a.id)}
                onPress={() => favorite(a.id)}
              />
            </Row>
            {b.shortTitle && (
              <Txt size={14} muted>
                {b.shortTitle}
              </Txt>
            )}
            <Row style={{ gap: 8 }}>
              <Icon name="people" size={16} />
              <Txt size={14} weight="medium" style={{ flex: 1 }}>
                {performerLabel}
              </Txt>
              <Button kind="ghost" small onPress={() => pauseSheet("players")}>
                Players
              </Button>
            </Row>
            {a.id === "G2" && (
              <Txt size={13} muted>
                Caller: tap New Choice! to ring the bell. No automatic calls.
                Bell plays even with spoken cues off. Check volume and audio
                output.
              </Txt>
            )}
          </View>
          {r.status === "private_reveal" ? (
            <Card
              style={{
                backgroundColor: "#172B49",
                paddingVertical: 35,
                minHeight: 280,
                justifyContent: "center",
                gap: 20,
              }}
            >
              <Icon
                name={secretVisible ? "eye" : "lock"}
                color="#F4A18E"
                size={34}
              />
              <Eyebrow color="#F4A18E">
                PRIVATE HANDOFF · {r.revealIndex + 1} OF {r.secrets.length}
              </Eyebrow>
              <Txt serif size={large ? 46 : 30} style={{ color: "#F8F6F1" }}>
                Only {name(r.secrets[r.revealIndex]?.playerId)} should look.
              </Txt>
              {secretVisible ? (
                <Txt size={large ? 30 : 22} style={{ color: "#F8F6F1" }}>
                  {r.secrets[r.revealIndex]?.text}
                </Txt>
              ) : (
                <Txt size={17} style={{ color: "#DDE5EF" }}>
                  Everyone else looks away. Pass the phone face down.
                </Txt>
              )}
            </Card>
          ) : review ? (
            <>
              <Card style={{ backgroundColor: t.lilac, gap: 15 }}>
                <BrandMark size={38} />
                <Eyebrow>ROUND COMPLETE</Eyebrow>
                <Txt serif size={large ? 48 : 34}>
                  Nice work. Ready for another?
                </Txt>
                <Txt size={17}>
                  {practice
                    ? a.reflection
                    : "Keep the momentum. We’ll pick a different game and give everyone a turn."}
                </Txt>
              </Card>
              {!freePlay && a.voteEligible && <Scoring sessionId={id} />}
              <Feedback activityId={a.id} roundId={r.id} />
              <Button kind="ghost" onPress={end}>
                End session & see recap
              </Button>
            </>
          ) : (
            <>
              {r.status === "intro" && (
                <View style={{ gap: 12 }}>
                  <Txt
                    testID="scene-instruction"
                    size={large ? 28 : 18}
                    weight="medium"
                  >
                    {instruction}
                  </Txt>
                  {a.id === "S1" && !freePlay && (
                    <Txt testID="scene-timing-preview" muted size={13}>
                      Optional {Math.ceil(r.remainingMs / 1000)}-second
                      reminder. Finish when you like, or keep playing after time
                      is up.
                    </Txt>
                  )}
                  {a.energy !== "seated" && (
                    <Txt size={14} muted>
                      No contact needed. Play seated or standing.
                    </Txt>
                  )}
                  {practice && (
                    <Txt size={15} muted>
                      Focus: {a.focusSkills.join(" · ")}. Full rules and
                      coaching are one tap away.
                    </Txt>
                  )}
                </View>
              )}
              {r.status === "ready" && (
                <Card style={{ backgroundColor: t.blue }}>
                  <Eyebrow>SECRETS SAFE</Eyebrow>
                  <Txt serif size={30}>
                    Ready? Start the scene.
                  </Txt>
                  <Txt size={17}>{instruction}</Txt>
                </Card>
              )}
              {isLive && (
                <>
                  <CueCard round={r} activity={a} large={large} />
                  {["story_turn", "short_challenge", "movement"].includes(
                    a.engine,
                  ) && (
                    <TurnStage
                      round={r}
                      activity={a}
                      players={s.players}
                      large={large}
                    />
                  )}
                  {a.engine === "rapid_fire" && (
                    <Eyebrow>
                      {r.variant === "open_mic"
                        ? "ANYONE CAN JUMP IN"
                        : `YOUR TURN · ${name(r.performerIds[r.turn % r.performerIds.length])}`}
                    </Eyebrow>
                  )}
                  {a.id === "G10" && (
                    <Card style={{ backgroundColor: t.blue }}>
                      <Row>
                        {[60, 30, 15, 5].map((sec, i) => (
                          <View
                            key={sec}
                            style={{
                              paddingHorizontal: 12,
                              paddingVertical: 8,
                              borderRadius: 20,
                              backgroundColor:
                                i === r.segment ? t.navy : t.card,
                            }}
                          >
                            <Txt
                              size={14}
                              style={{ color: i === r.segment ? t.bg : t.ink }}
                            >
                              {sec}s
                            </Txt>
                          </View>
                        ))}
                      </Row>
                      <Txt serif size={large ? 42 : 27}>
                        {r.segmentReady
                          ? `Same story. Now in ${[60, 30, 15, 5][r.segment]} seconds.`
                          : `Replay ${r.segment + 1} of 4. Keep the same story.`}
                      </Txt>
                    </Card>
                  )}
                  {a.id === "T3" && (
                    <Card>
                      <Eyebrow>HOST’S GUESS TRACKER</Eyebrow>
                      {r.secrets.map((secret) => (
                        <Row
                          key={secret.playerId}
                          style={{ justifyContent: "space-between" }}
                        >
                          <Txt>{name(secret.playerId)}</Txt>
                          <Chip
                            selected={secret.guessed}
                            onPress={() =>
                              action({
                                type: "MARK_GUESS",
                                playerId: secret.playerId,
                              })
                            }
                          >
                            {secret.guessed ? "Guessed ✓" : "Mark guessed"}
                          </Chip>
                        </Row>
                      ))}
                    </Card>
                  )}
                </>
              )}
              <SceneBrief
                round={r}
                activity={a}
                players={s.players}
                large={large}
                onDetails={() => pauseSheet("details")}
              />
              {r.status === "intro" && !practice && (
                <Disclosure title="Quick example" initial={a.id === "W1"}>
                  <Card
                    style={{ padding: 17, gap: 7, backgroundColor: t.blue }}
                  >
                    <Txt size={16}>{b.example}</Txt>
                  </Card>
                </Disclosure>
              )}
              {isLive && (
                <Txt testID="scene-instruction" size={15} muted>
                  {r.status === "paused"
                    ? "Safely paused. Tap Resume when you’re ready."
                    : a.id === "G5"
                      ? "Freeze a pose. A new player starts a NEW scene."
                      : a.id === "T4"
                        ? "Swap a performer. Continue the SAME scene."
                        : a.cueTypes.length && a.id !== "G10"
                          ? s.settings.cuePreference === "manual"
                            ? "You’re in charge. Tap the cue whenever you want."
                            : "Auto cues are on. You can also tap a cue anytime."
                          : instruction}
                </Txt>
              )}
              {r.status === "intro" && a.engine === "rapid_fire" && (
                <>
                  {r.variant === "battle" && (
                    <Txt size={14} muted>
                      This saved game used an older competitive option. It
                      continues with everyone taking turns.
                    </Txt>
                  )}
                  <Row>
                    {(["take_turns", "open_mic"] as const).map((variant) => (
                      <Chip
                        key={variant}
                        selected={
                          r.variant === variant ||
                          (r.variant === "battle" && variant === "take_turns")
                        }
                        onPress={() => action({ type: "VARIANT", variant })}
                      >
                        {variant === "take_turns"
                          ? "Take turns"
                          : "Anyone can jump in"}
                      </Chip>
                    ))}
                  </Row>
                  <Txt size={14} muted>
                    {r.variant === "open_mic"
                      ? "No fixed order. Anyone can offer a response whenever they are ready; there is no named turn to advance."
                      : "After a response, tap Pass turn to show the next name. You can also pass without speaking."}
                  </Txt>
                </>
              )}
              <Feedback activityId={a.id} roundId={r.id} />
              <Row>
                <Button
                  small
                  kind="ghost"
                  icon="bulb"
                  onPress={() => pauseSheet("rules")}
                >
                  Full rules & coaching
                </Button>
                {!r.secrets.length && (
                  <Button
                    small
                    kind="ghost"
                    icon="refresh"
                    onPress={() => action({ type: "REROLL_PROMPT" })}
                  >
                    New Prompt
                  </Button>
                )}
              </Row>
            </>
          )}
        </>
      )}
      <Dialog
        visible={sheet === "games"}
        onClose={() => setSheet(null)}
        title="What shall we play?"
      >
        <Txt size={14} muted>
          Your names stay with you. No scores or round breaks.
        </Txt>
        {eligibleActivities(
          { ...s.settings, mode: "surprise" },
          data.preferences,
        )
          .sort((a, b) => Number(b.id === "W1") - Number(a.id === "W1"))
          .map((game) => (
            <GameChoice
              key={game.id}
              title={game.title}
              label={`Play ${game.title}`}
              description={bookFor(game).instruction}
              disabled={busy}
              onPress={() => chooseFreeGame(game.id)}
            />
          ))}
      </Dialog>
      <Dialog
        visible={sheet === "rules"}
        onClose={() => setSheet(null)}
        title="Rules & coaching"
      >
        <Eyebrow>THE QUICK VERSION</Eyebrow>
        <Txt size={18} weight="medium">
          {instruction}
        </Txt>
        {b.steps.map((step, i) => (
          <Txt key={step}>
            {i + 1}. {step}
          </Txt>
        ))}
        <Card style={{ backgroundColor: t.lilac, padding: 18 }}>
          <Txt>{b.example}</Txt>
        </Card>
        <Disclosure title="Improv notes & full rules" initial={practice}>
          <Txt>{a.howTo}</Txt>
          <Eyebrow>EXAMPLE</Eyebrow>
          <Txt>{a.example}</Txt>
          <Eyebrow>COACHING</Eyebrow>
          <Txt>{a.coachTip}</Txt>
          <Eyebrow>REFLECTION</Eyebrow>
          <Txt>{a.reflection}</Txt>
        </Disclosure>
      </Dialog>
      <Dialog
        visible={sheet === "details"}
        onClose={() => setSheet(null)}
        title="All scene details"
      >
        <ComposedPrompt snapshot={r.promptSnapshot} large={large} />
        <PromptCards
          snapshot={r.promptSnapshot}
          players={s.players}
          performerIds={a.id === "S1" ? r.performerIds : undefined}
        />
      </Dialog>
      <Dialog
        visible={sheet === "exit"}
        onClose={() => setSheet(null)}
        title="Take a breather?"
      >
        <Txt>
          {freePlay
            ? "Your game is paused. Save it for later or stop whenever you like."
            : "Your round is paused. Save it for later or finish this session."}
        </Txt>
        <Button
          onPress={() =>
            void safely(async () => {
              await act(id, { type: "PAUSE" });
              router.push(playHomePath(Platform.OS));
            })
          }
        >
          Save & leave
        </Button>
        <Button kind="secondary" onPress={end}>
          {freePlay ? "Done playing" : "End session & see recap"}
        </Button>
        <Button
          kind="ghost"
          onPress={() => {
            setSheet(null);
            if (r.status === "paused") action({ type: "RESUME" });
          }}
        >
          Keep playing
        </Button>
      </Dialog>
      <Dialog
        visible={sheet === "players"}
        onClose={() => setSheet(null)}
        title="Who’s playing?"
      >
        <Txt size={14} muted>
          Roster changes apply to the next game. Earlier rounds keep their
          original cast.
        </Txt>
        <Counter
          count={active.length}
          min={minGroup}
          max={s.settings.mode === "just_us" ? 2 : 12}
          onChange={resizeGroup}
        />
        {s.players.map((p) => (
          <Toggle
            key={p.id}
            label={p.displayName}
            sub={`${exposure(p.id, s.rounds).rounds} performance turns`}
            value={!p.isSittingOut}
            onChange={(v) => {
              if (
                s.settings.mode === "just_us" ||
                (!v && active.length <= minGroup)
              )
                return;
              void changeSession(id, (s) => ({
                ...s,
                players: s.players.map((x) =>
                  x.id === p.id ? { ...x, isSittingOut: !v } : x,
                ),
                settings: {
                  ...s.settings,
                  playerCount: s.players.filter((x) =>
                    x.id === p.id ? v : !x.isSittingOut,
                  ).length,
                },
              }));
            }}
          />
        ))}
        <Button onPress={() => setSheet(null)}>Done</Button>
      </Dialog>
      <Dialog
        visible={sheet === "host"}
        onClose={() => setSheet(null)}
        title="Host controls"
      >
        <Eyebrow>NEXT GAME’S STYLE</Eyebrow>
        <Row>
          {(["riff", "practice"] as const).map((playIntent) => (
            <Chip
              key={playIntent}
              selected={s.settings.playIntent === playIntent}
              onPress={() =>
                void changeSession(id, (s) => ({
                  ...s,
                  settings: { ...s.settings, playIntent },
                }))
              }
            >
              {intentLabels[playIntent]}
            </Chip>
          ))}
        </Row>
        <Txt size={14} muted>
          {intentDescriptions[s.settings.playIntent]}
        </Txt>
        {!freePlay && a.cueTypes.length > 0 && a.id !== "G10" && (
          <Toggle
            label="Automatic cues"
            sub="Let the app choose when to call a change. Turn off to use only the cue buttons; spoken cues are a separate choice."
            value={s.settings.cuePreference !== "manual"}
            onChange={(v) =>
              void changeSession(id, (s) => ({
                ...s,
                settings: {
                  ...s.settings,
                  cuePreference: v ? "sound_and_visual" : "manual",
                },
              }))
            }
          />
        )}
        <Toggle
          label="Spoken cues"
          sub="Visible cues always remain available."
          value={data.preferences.soundEnabled}
          onChange={(soundEnabled) =>
            void update((d) => ({
              ...d,
              preferences: { ...d.preferences, soundEnabled },
            }))
          }
        />
        <Toggle
          label="Exclude movement games"
          value={s.settings.excludeMovement}
          onChange={(excludeMovement) =>
            void changeSession(id, (s) => ({
              ...s,
              settings: { ...s.settings, excludeMovement },
            }))
          }
        />
        <Toggle
          label="Larger text"
          value={data.preferences.useLargeText}
          onChange={(useLargeText) =>
            void update((d) => ({
              ...d,
              preferences: { ...d.preferences, useLargeText },
            }))
          }
        />
        <Eyebrow>TIME REMINDER</Eyebrow>
        <Row>
          {[null, 5, 15, 30].map((preferredMinutes) => (
            <Chip
              key={preferredMinutes ?? 0}
              selected={s.settings.preferredMinutes === preferredMinutes}
              onPress={() =>
                void changeSession(id, (s) => ({
                  ...s,
                  settings: { ...s.settings, preferredMinutes },
                }))
              }
            >
              {preferredMinutes ? `${preferredMinutes} min` : "Keep going"}
            </Chip>
          ))}
        </Row>
        {s.settings.preferredMinutes &&
        s.rounds.reduce((n, x) => n + x.elapsedMs, 0) >=
          s.settings.preferredMinutes * 60000 ? (
          <Txt>
            You’ve reached your time preference. Keep playing or end whenever
            you like.
          </Txt>
        ) : null}
        <Button
          kind="secondary"
          onPress={() => {
            setSheet(null);
            freshSame();
          }}
        >
          New cast & setup · same game
        </Button>
        <Button onPress={() => setSheet(null)}>Done</Button>
      </Dialog>
    </Page>
  );
}
