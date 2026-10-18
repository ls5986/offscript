import { View } from "react-native";
import { Button, IconButton, Row, Txt } from "../design/ui";
import type { Activity } from "../domain/contracts";
import type { GameAction, GameRound } from "../domain/session";

export function FreePlayDock({
  round,
  activity,
  busy,
  onAction,
  onChangeGame,
  onDone,
}: {
  round: GameRound;
  activity: Activity;
  busy: boolean;
  onAction: (action: GameAction) => void;
  onChangeGame: () => void;
  onDone: () => void;
}) {
  const paused = round.status === "paused";
  let label = "New idea";
  let action: GameAction = { type: "REROLL_PROMPT" };
  if (activity.engine === "scene_rotation") {
    label = activity.id === "G5" ? "Freeze & replace" : "Relay performer";
    action = { type: "ROTATE" };
  } else if (activity.cueTypes.length) {
    label =
      (
        {
          G2: "New Choice!",
          G3: "New emotion",
          G4: "New genre",
          G9: "Surprise line",
          S5: "Shift status",
        } as Record<string, string>
      )[activity.id] ?? "New cue";
    action = { type: "CALL_CUE" };
  } else if (
    ["story_turn", "short_challenge", "movement"].includes(activity.engine)
  ) {
    label =
      activity.id === "S6" && round.turn >= 2
        ? "New scene"
        : activity.id === "W5"
          ? "Switch leader"
          : "Next player";
    action =
      label === "New scene" ? { type: "REROLL_PROMPT" } : { type: "NEXT_TURN" };
  } else if (activity.engine === "rapid_fire") {
    label =
      activity.id === "P4"
        ? "New profession"
        : activity.id === "P5"
          ? "New situation"
          : activity.id === "P6"
            ? "New place"
            : "New word";
  }
  const secretGame = round.secrets.length > 0;
  return (
    <View
      style={{ width: "100%", maxWidth: 1000, alignSelf: "center", gap: 8 }}
    >
      <Row style={{ flexWrap: "nowrap", gap: 10 }}>
        <Button
          style={{ flex: 1 }}
          disabled={busy}
          icon={paused ? "play" : "arrow"}
          onPress={() =>
            paused
              ? onAction({ type: "RESUME" })
              : secretGame
                ? onChangeGame()
                : onAction(action)
          }
        >
          {paused ? "Resume" : secretGame ? "Change game" : label}
        </Button>
        <IconButton
          name={paused ? "play" : "pause"}
          label={paused ? "Resume game" : "Pause"}
          onPress={() => onAction({ type: paused ? "RESUME" : "PAUSE" })}
        />
      </Row>
      <Row style={{ flexWrap: "nowrap", gap: 8 }}>
        {!secretGame && (
          <Button
            small
            kind="secondary"
            style={{ flex: 1 }}
            onPress={onChangeGame}
          >
            Change game
          </Button>
        )}
        <Button small kind="ghost" style={{ flex: 1 }} onPress={onDone}>
          Done playing
        </Button>
        {activity.engine === "rapid_fire" &&
          round.variant !== "open_mic" &&
          !paused && (
            <Button
              small
              kind="ghost"
              onPress={() => onAction({ type: "NEXT_TURN" })}
            >
              Pass turn
            </Button>
          )}
      </Row>
      <Txt size={12} muted style={{ textAlign: "center" }}>
        No timer. Keep going as long as you like.
      </Txt>
    </View>
  );
}
