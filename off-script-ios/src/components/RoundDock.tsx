import { View } from "react-native";
import { Button, IconButton, Row, Txt } from "../design/ui";
import type { Activity } from "../domain/contracts";
import type { GameAction, GameRound } from "../domain/session";
const cueNames: Record<string, string> = {
  G2: "New Choice!",
  G3: "New emotion",
  G4: "New genre",
  G9: "Surprise line",
  S5: "Shift status",
  T4: "Relay performer",
};
export function RoundDock({
  round: r,
  activity: a,
  busy,
  secretVisible,
  onAction,
  onStart,
  onSkip,
  onNext,
  onReveal,
  onCover,
  startLabel = "Start round",
}: {
  round: GameRound;
  activity: Activity;
  busy: boolean;
  secretVisible: boolean;
  onAction: (a: GameAction) => void;
  onStart: () => void;
  onSkip: () => void;
  onNext: (replay?: boolean) => void;
  onReveal: () => void;
  onCover: () => void;
  startLabel?: string;
}) {
  const isLive = r.status === "live" || r.status === "paused";
  const paused = r.status === "paused";
  const countdown = `${Math.floor(Math.ceil(r.remainingMs / 1000) / 60)
    .toString()
    .padStart(
      2,
      "0",
    )}:${(Math.ceil(r.remainingMs / 1000) % 60).toString().padStart(2, "0")}`;
  let label = "Finish round";
  let action: GameAction = { type: "FINISH" };
  if (a.id === "G10") {
    label = r.segmentReady
      ? `Start ${[60, 30, 15, 5][r.segment]}s replay`
      : r.segment === 3
        ? "Finish round"
        : "Next segment";
    action =
      r.segment === 3 && !r.segmentReady
        ? { type: "FINISH" }
        : { type: "NEXT_SEGMENT" };
  } else if (a.engine === "scene_rotation") {
    label = a.id === "G5" ? "Freeze & replace" : "Relay performer";
    action = { type: "ROTATE" };
  } else if (a.cueTypes.length) {
    label = cueNames[a.id] ?? "New cue";
    action = { type: "CALL_CUE" };
  } else if (a.engine === "rapid_fire") {
    label =
      a.id === "P4"
        ? "New profession"
        : a.id === "P5"
          ? "New situation"
          : a.id === "P6"
            ? "New place"
            : "New Word";
    action = { type: "REROLL_PROMPT" };
  } else if (["story_turn", "short_challenge", "movement"].includes(a.engine)) {
    label =
      a.id === "S6"
        ? "Line complete"
        : a.id === "W5"
          ? "Switch leader"
          : "Next player";
    action =
      a.id === "S6" && r.turn >= 2 ? { type: "FINISH" } : { type: "NEXT_TURN" };
  }
  return (
    <View
      style={{ width: "100%", maxWidth: 1000, alignSelf: "center", gap: 8 }}
    >
      {isLive ? (
        <>
          <Row style={{ gap: 10, flexWrap: "nowrap" }}>
            <View style={{ width: 65 }}>
              <Txt size={11} muted weight="bold">
                {paused
                  ? "PAUSED"
                  : r.segmentReady
                    ? "READY"
                    : r.remainingMs === 0
                      ? "NO TIMER"
                      : "TIME"}
              </Txt>
              <Txt
                size={23}
                weight="medium"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                {countdown}
              </Txt>
            </View>
            <Button
              style={{ flex: 1, paddingHorizontal: 12 }}
              icon={paused ? "play" : a.cueTypes.length ? "shuffle" : "arrow"}
              disabled={busy}
              onPress={() => onAction(paused ? { type: "RESUME" } : action)}
            >
              {paused ? "Resume" : label}
            </Button>
            <IconButton
              name={paused ? "play" : "pause"}
              label={paused ? "Resume round" : "Pause"}
              onPress={() => onAction({ type: paused ? "RESUME" : "PAUSE" })}
            />
          </Row>
          <Row style={{ gap: 8, flexWrap: "nowrap" }}>
            {(label !== "Finish round" || paused) && (
              <Button
                small
                kind="secondary"
                style={{ flex: 1 }}
                onPress={() => onAction({ type: "FINISH" })}
              >
                Finish round
              </Button>
            )}
            <Button
              small
              kind="ghost"
              style={{ flex: 1 }}
              icon="skip"
              onPress={onSkip}
            >
              Skip game
            </Button>
            {a.engine === "rapid_fire" && r.variant !== "open_mic" && (
              <Button
                small
                kind="ghost"
                style={{ flex: 1 }}
                onPress={() => onAction({ type: "NEXT_TURN" })}
              >
                Pass turn
              </Button>
            )}
          </Row>
        </>
      ) : r.status === "private_reveal" ? (
        <>
          <Button
            icon={secretVisible ? "hide" : "eye"}
            disabled={busy}
            onPress={secretVisible ? onCover : onReveal}
          >
            {secretVisible
              ? "Hide & pass"
              : a.id === "T3"
                ? "Reveal my quirk"
                : "Reveal my objective"}
          </Button>
          <Button small kind="ghost" onPress={onCover}>
            Skip this reveal
          </Button>
        </>
      ) : r.status === "review" || r.status === "complete" ? (
        <>
          <Button
            icon="shuffle"
            after="arrow"
            disabled={busy}
            onPress={() => onNext()}
          >
            Next game
          </Button>
          <Button
            kind="ghost"
            small
            icon="replay"
            disabled={busy}
            onPress={() => onNext(true)}
          >
            Replay game
          </Button>
        </>
      ) : (
        <>
          <Button
            icon={
              a.requiresPrivateReveal && r.status === "intro" ? "lock" : "play"
            }
            after="arrow"
            disabled={busy}
            onPress={onStart}
          >
            {a.requiresPrivateReveal && r.status === "intro"
              ? "Pass out the secrets"
              : startLabel}
          </Button>
          <Button small kind="ghost" icon="skip" onPress={onSkip}>
            Skip game
          </Button>
        </>
      )}
    </View>
  );
}
