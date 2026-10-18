import { composeScene } from "../domain/composer";
import { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { Button, Card, Eyebrow, Txt, useTheme } from "../design/ui";
import { Category, categoryLabels } from "../domain/content";
import type { Activity, Player } from "../domain/contracts";
import { bookFor } from "../domain/playbooks";
import { resolvePromptPlayerId } from "../domain/prompts";
import { GameRound, rapidOpening } from "../domain/session";
import { useApp } from "../providers/AppProvider";
export function SceneBrief({
  round: r,
  activity: a,
  players,
  large = false,
  onDetails,
}: {
  round: GameRound;
  activity: Activity;
  players: Player[];
  large?: boolean;
  onDetails: () => void;
}) {
  const t = useTheme();
  const entries = Object.entries(r.promptSnapshot.entries);
  const scene = composeScene(r.promptSnapshot);
  const rapid = a.engine === "rapid_fire";
  const subject =
    a.id === "P4"
      ? r.promptSnapshot.entries.profession?.text
      : a.id === "P5"
        ? r.promptSnapshot.entries.situation?.text
        : a.id === "P6"
          ? r.promptSnapshot.entries.location?.text
          : r.promptSnapshot.jokeTopic?.word;
  if (rapid)
    return (
      <Card
        style={{ backgroundColor: t.lilac, padding: large ? 32 : 22, gap: 14 }}
      >
        <Eyebrow>
          {a.id === "P5"
            ? "THE PROBLEM"
            : a.id === "P4"
              ? "YOUR TERRIBLE JOB"
              : a.id === "P6"
                ? "THE PLACE"
                : "YOUR WORD"}
        </Eyebrow>
        <Txt
          serif
          size={large ? 58 : a.id === "P5" ? 26 : 38}
          style={{ lineHeight: large ? 68 : a.id === "P5" ? 35 : 47 }}
        >
          {subject}
        </Txt>
        <Txt size={large ? 25 : 18}>{rapidOpening(r)}</Txt>
      </Card>
    );
  if (!entries.length)
    return (
      <Card style={{ backgroundColor: t.blue }}>
        <Eyebrow>
          {r.promptSnapshot.jokeTopic ? "YOUR WORD" : "WIDE OPEN"}
        </Eyebrow>
        <Txt serif size={large ? 42 : 25}>
          {r.promptSnapshot.jokeTopic?.word ??
            "Make a small offer. See what happens."}
        </Txt>
      </Card>
    );
  return (
    <Card
      style={{ padding: large ? 30 : 21, gap: 12, backgroundColor: t.lilac }}
    >
      <Eyebrow>
        {a.engine === "story_turn" ? "YOUR STORY SEED" : "YOUR SETUP"}
      </Eyebrow>
      {scene && (
        <Txt
          serif
          size={large ? 40 : 25}
          style={{ lineHeight: large ? 50 : 34 }}
        >
          {scene.text}
        </Txt>
      )}
      {entries
        .filter(
          ([category]) =>
            !scene?.includedCategories.includes(category as Category),
        )
        .map(([c, v], i) => (
          <View key={c} style={{ gap: 4 }}>
            {(i > 0 || scene) && (
              <Txt size={12} muted weight="bold">
                {categoryLabels[c as Category]}
              </Txt>
            )}
            <Txt
              serif={!scene && i === 0}
              size={large ? 38 : scene ? 16 : i === 0 ? 24 : 17}
              style={{
                lineHeight: large ? 48 : scene ? 24 : i === 0 ? 32 : 25,
              }}
            >
              {v.text}
            </Txt>
          </View>
        ))}
      {r.promptSnapshot.relationship && (
        <View style={{ gap: 4, marginTop: 2 }}>
          {r.promptSnapshot.relationship.assignments.map((assignment, i) => {
            const playerId = resolvePromptPlayerId(
              assignment.playerId,
              i,
              players,
              a.id === "S1" ? r.performerIds : [],
            );
            const p = players.find((person) => person.id === playerId);
            return (
              <Txt key={assignment.playerId} size={large ? 19 : 14} muted>
                {p?.displayName ??
                  (assignment.playerId.startsWith("Player ")
                    ? assignment.playerId
                    : `Player ${i + 1}`)}{" "}
                · {assignment.roleText}
              </Txt>
            );
          })}
        </View>
      )}
      {(entries.length > 2 ||
        (r.promptSnapshot.relationship?.assignments.length ?? 0) > 3) && (
        <Button small kind="ghost" onPress={onDetails}>
          All scene details
        </Button>
      )}
    </Card>
  );
}
export function CueCard({
  round: r,
  activity: a,
  large = false,
}: {
  round: GameRound;
  activity: Activity;
  large?: boolean;
}) {
  const { data } = useApp();
  const cueId = r.cue?.id;
  const [scale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (!cueId || data.preferences.reducedMotion) return;
    scale.setValue(0.97);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: false,
      speed: 25,
      bounciness: 2,
    }).start();
  }, [cueId, data.preferences.reducedMotion, scale]);
  const visible =
    r.cue &&
    (r.cue.type === "stop" ||
      r.elapsedMs - r.cue.atElapsedMs < r.cue.displayDurationMs);
  if (!visible) return null;
  const helper =
    a.id === "G2"
      ? "Last speaker: replace only your last line. Same characters, same scene. Accept the newest line as true."
      : a.id === "G3"
        ? "New feeling. Same people, same scene."
        : a.id === "G4"
          ? "New style. Keep the scene’s facts."
          : a.id === "G9"
            ? "Work this line into the conversation."
            : a.id === "S5"
              ? "Reverse who has the power. Keep the relationship."
              : "";
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Card
        style={{
          backgroundColor: "#172B49",
          overflow: "hidden",
          borderColor: "#172B49",
          gap: 12,
          padding: large ? 36 : 24,
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: -4,
            top: 10,
            width: 22,
            height: 8,
            backgroundColor: "#F29B87",
            transform: [{ rotate: "-35deg" }],
          }}
        />
        <Eyebrow color="#F4A18E">
          {r.cue!.type === "stop"
            ? a.id === "G10"
              ? r.status === "review"
                ? "SCENE COMPLETE"
                : "PAUSE BEFORE THE NEXT REPLAY"
              : "TIME — OR KEEP GOING"
            : r.cue!.type.replaceAll("_", " ")}
        </Eyebrow>
        <Txt
          accessibilityLiveRegion="polite"
          serif
          size={large ? 54 : 32}
          style={{ color: "#F8F6F1", lineHeight: large ? 66 : 42 }}
        >
          {r.cue!.text}
        </Txt>
        {!!helper && (
          <Txt size={large ? 23 : 16} style={{ color: "#E3EAF4" }}>
            {helper}
          </Txt>
        )}
      </Card>
    </Animated.View>
  );
}
export function TurnStage({
  round: r,
  activity: a,
  players,
  large = false,
}: {
  round: GameRound;
  activity: Activity;
  players: Player[];
  large?: boolean;
}) {
  const t = useTheme();
  const turn =
    players.find((p) => p.id === r.performerIds[r.turn % r.performerIds.length])
      ?.displayName ?? "Player";
  const prompt =
    a.id === "W4"
      ? r.turn % 2 === 0
        ? "Fortunately…"
        : "Unfortunately…"
      : a.id === "W8"
        ? "Echo a detail. Add a new one."
        : a.id === "W1"
          ? "“Yes, and…” + one detail."
          : a.id === "W2"
            ? "Just one word."
            : a.id === "W3"
              ? "One more sentence."
              : a.id === "W6"
                ? "First association. Say it."
                : a.id === "W5"
                  ? "Lead slowly. Everyone mirrors."
                  : a.id === "S6"
                    ? [
                        "Establish something.",
                        "Accept it. Add a detail.",
                        "Change the moment.",
                      ][Math.min(2, r.turn)]
                    : bookFor(a).instruction;
  return (
    <Card style={{ backgroundColor: t.sage, padding: 22, gap: 10 }}>
      <Eyebrow>
        {a.id === "S6"
          ? `LINE ${Math.min(3, r.turn + 1)} OF 3`
          : `YOUR TURN · ${turn}`}
      </Eyebrow>
      <Txt serif size={large ? 50 : 31}>
        {prompt}
      </Txt>
      {a.id === "W4" && <Txt size={16}>Add one sentence. Pass it on.</Txt>}
    </Card>
  );
}
