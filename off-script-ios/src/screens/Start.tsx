import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  Back,
  Button,
  Card,
  Counter,
  Disclosure,
  Chip,
  Eyebrow,
  Row,
  Field,
  Page,
  Title,
  Txt,
  useTheme,
} from "../design/ui";
import { activityById, modes } from "../domain/content";
import { ModeSchema, type SessionSettings } from "../domain/contracts";
import {
  intentDescriptions,
  intentLabels,
  type PlayIntent,
} from "../domain/playbooks";
import { useApp } from "../providers/AppProvider";
function Setup() {
  const params = useLocalSearchParams<{
    mode?: string;
    activity?: string;
    studio?: string;
    intent?: string;
    playFlow?: string;
    quick?: string;
  }>();
  const mode = ModeSchema.safeParse(params.mode).success
    ? ModeSchema.parse(params.mode)
    : "surprise";
  const activity = params.activity ? activityById(params.activity) : null;
  const { data, start } = useApp();
  const intent: PlayIntent =
    params.intent === "practice"
      ? "practice"
      : params.intent === "riff"
        ? "riff"
        : mode === "scene_lab" || mode === "improv_gym"
          ? "practice"
          : data.preferences.playIntent;
  const min = Math.max(2, activity?.minPlayers ?? 2);
  const max = mode === "just_us" ? 2 : (activity?.maxPlayers ?? 12);
  const [count, setCount] = useState(
    Math.min(
      max,
      Math.max(
        min,
        params.studio
          ? data.studio.playerCount
          : data.preferences.lastPlayerCount,
      ),
    ),
  );
  const [names, setNames] = useState<string[]>(() => [
    ...data.preferences.lastPlayerNames,
  ]);
  const [playFlow, setPlayFlow] = useState<SessionSettings["playFlow"]>(
    activity?.id === "G10"
      ? "rounds"
      : params.playFlow === "free" ||
          (params.playFlow !== "rounds" && activity?.id === "W1")
        ? "free"
        : params.playFlow === "rounds"
          ? "rounds"
          : data.preferences.lastPlayFlow,
  );
  const named = Array.from({ length: count }, (_, i) => names[i]?.trim() ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTheme();
  const working = useRef(false);
  const begin = async () => {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    try {
      const id = await start(
        count,
        mode,
        named,
        activity?.id,
        params.studio ? (data.studio.result ?? undefined) : undefined,
        intent,
        playFlow,
      );
      router.replace(`/session/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start.");
      setBusy(false);
      working.current = false;
    }
  };
  const launched = useRef(false);
  useEffect(() => {
    if (launched.current || !(params.quick === "1" || params.studio)) return;
    // Reuse a compatible remembered group; the Studio player count is already chosen.
    const remembered = data.preferences.lastPlayerCount;
    if (!params.studio && (remembered < min || remembered > max)) return;
    const launch = setTimeout(() => {
      launched.current = true;
      void begin();
    }, 0);
    return () => clearTimeout(launch);
    // Launch once on entry; subsequent preference writes must not create another session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Page narrow compact>
      <Back />
      <Title
        eyebrow={intentLabels[intent]}
        title="Who's in?"
        sub="Set the group and play. Names and round settings are optional."
      />
      <Txt size={14} muted>
        {intentDescriptions[intent]}
      </Txt>
      <Card style={{ gap: 24, padding: 32 }}>
        <View style={{ alignItems: "center", gap: 12 }}>
          <Txt weight="medium">How many people are playing?</Txt>
          <Counter count={count} onChange={setCount} min={min} max={max} />
          <Txt size={13} muted>
            {count === 2
              ? "Just the two of you. We’ll do the hosting."
              : "Everyone gets a turn. We’ll keep it fair."}
          </Txt>
        </View>
        <Txt size={14} muted>
          {playFlow === "free"
            ? "No countdown or round breaks. Change games or stop whenever you like."
            : activity?.id === "G10"
              ? "Four timed versions of the same scene: 60, 30, 15 and 5 seconds. You start each shorter replay."
              : "A timer suggests when to wrap up. You choose when to finish and move to the next game."}
        </Txt>
        <Button
          onPress={() => void begin()}
          disabled={busy}
          icon="play"
          after="arrow"
        >
          {busy
            ? "Opening the game…"
            : activity
              ? "Let’s play this one"
              : "Let’s play"}
        </Button>
        <Disclosure title="Free play or rounds">
          <Eyebrow>HOW DO YOU WANT TO PLAY?</Eyebrow>
          <Row>
            {activity?.id !== "G10" && (
              <Chip
                selected={playFlow === "free"}
                onPress={() => setPlayFlow("free")}
              >
                Free play
              </Chip>
            )}
            <Chip
              selected={playFlow === "rounds"}
              onPress={() => setPlayFlow("rounds")}
            >
              Rounds
            </Chip>
          </Row>
          <Txt size={14} muted>
            {activity?.id === "G10"
              ? "Half-Life uses timed replays, so it needs rounds. Other games offer free play."
              : playFlow === "free"
                ? "No timer, scores, or round breaks. Keep going, change games, or stop whenever you like."
                : "A timer suggests when to wrap up, followed by a break between games. You decide when to finish or switch games."}
          </Txt>
        </Disclosure>
        <Disclosure title="Add names (optional)">
          <Eyebrow>EVERYONE’S NAME</Eyebrow>
          <Txt muted size={14}>
            First names or nicknames. They stay on this device.
          </Txt>
          {Array.from({ length: count }, (_, i) => (
            <Field
              key={i}
              value={names[i] ?? ""}
              label={`Player ${i + 1} name`}
              placeholder={`Name for player ${i + 1}`}
              onChangeText={(s) =>
                setNames((old) =>
                  Array.from({ length: Math.max(count, old.length) }, (_, j) =>
                    i === j ? s.slice(0, 40) : (old[j] ?? ""),
                  ),
                )
              }
            />
          ))}
        </Disclosure>
        <View style={{ gap: 12 }}>
          {(activity || mode !== "surprise") && (
            <Txt muted size={13}>
              Playing:{" "}
              {activity?.title ?? modes.find((m) => m.id === mode)?.label}
            </Txt>
          )}
          {!!error && <Txt style={{ color: t.accentInk }}>{error}</Txt>}
          <Txt muted size={11} style={{ textAlign: "center" }}>
            Clean by default. Skip anything, anytime.
          </Txt>
        </View>
      </Card>
    </Page>
  );
}

export default function Start() {
  const { ready } = useApp();
  return ready ? (
    <Setup />
  ) : (
    <Page compact>
      <Txt>Opening your saved setup…</Txt>
    </Page>
  );
}
