import type { ReactNode } from "react";
import { View, useWindowDimensions } from "react-native";
import { Card, Eyebrow, Txt, useTheme } from "../design/ui";
import { composeScene } from "../domain/composer";
import { activityById, categoryLabels } from "../domain/content";
import { partyParticipantText, partyPromptText } from "../domain/party";
import { adviceFor, missingAdviceContext } from "../domain/party-advice";
import { isQuickGame } from "../domain/gameplay";
import { PromptSwipeControl } from "./PromptSwipe";
import {
  currentRound,
  rapidOpening,
  type SessionSnapshot,
} from "../domain/session";
/** Prompt and live roles; full directions stay in How to Play. */
export function PartyDeckCard({
  session,
  privateContent,
  children,
  large = false,
}: {
  session: SessionSnapshot;
  privateContent?: ReactNode;
  children?: ReactNode;
  large?: boolean;
}) {
  const t = useTheme();
  const { width, height } = useWindowDimensions();
  const compact = height < 650;
  const r = currentRound(session);
  const a = activityById(r.activityId);
  const advice = a.id === "P5" ? adviceFor(r.promptSnapshot) : null;
  const quick = isQuickGame(a.id);
  const remaining = composeScene(r.promptSnapshot)?.remainingCategories ?? [];
  const color = [t.lilac, t.blue, t.sage][r.ordinal % 3];
  return (
    <View style={{ paddingBottom: 8, paddingRight: 5 }}>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 13,
          bottom: 0,
          left: 8,
          right: 0,
          borderRadius: 24,
          backgroundColor: t.line,
          transform: [{ rotate: "1deg" }],
        }}
      />
      <Card
        style={{
          backgroundColor: color,
          minHeight: compact ? 300 : 370,
          padding: compact ? 22 : 28,
          gap: compact ? 16 : 22,
          justifyContent: "center",
        }}
      >
        {privateContent ?? (
          <>
            <View
              style={{
                alignSelf: "flex-start",
                borderRadius: 20,
                backgroundColor: t.card,
                paddingHorizontal: 13,
                paddingVertical: 7,
              }}
            >
              <Txt weight="bold" size={13}>
                {partyParticipantText(session)}
              </Txt>
            </View>
            <Eyebrow>{a.title}</Eyebrow>
            {(r.remainingMs > 0 || r.cue?.type === "stop") && (
              <Txt testID="party-timer" size={14} weight="medium">
                {r.remainingMs > 0
                  ? `Scene timer${r.status === "paused" ? " paused" : r.status === "live" ? "" : " · starts when you press Start"} · ${Math.floor(
                      Math.ceil(r.remainingMs / 1000) / 60,
                    )
                      .toString()
                      .padStart(
                        2,
                        "0",
                      )}:${(Math.ceil(r.remainingMs / 1000) % 60).toString().padStart(2, "0")}`
                  : "Timer finished · keep playing as long as you like."}
              </Txt>
            )}
            {a.id === "P5" && <Eyebrow>A PRETEND FRIEND ASKS</Eyebrow>}
            <Txt
              testID="party-prompt"
              serif
              size={
                large
                  ? 52
                  : width < 360
                    ? 27
                    : r.promptSnapshot.jokeTopic
                      ? 42
                      : 32
              }
              style={{
                lineHeight: large
                  ? 64
                  : width < 360
                    ? 35
                    : r.promptSnapshot.jokeTopic
                      ? 51
                      : 41,
              }}
            >
              {partyPromptText(r)}
            </Txt>
            {r.promptSnapshot.relationship && !quick && (
              <Txt size={large ? 22 : 15}>
                {r.promptSnapshot.relationship.assignments
                  .map((assignment, index) => {
                    const person =
                      session.players.find(
                        (player) => player.id === assignment.playerId,
                      ) ??
                      session.players.find(
                        (player) => player.id === r.performerIds[index],
                      );
                    return `${person?.displayName ?? `Player ${index + 1}`}: ${assignment.roleText}`;
                  })
                  .join(" · ")}
              </Txt>
            )}
            {a.id === "P5" && (
              <Txt
                testID="party-advice-question"
                size={large ? 27 : 20}
                weight="medium"
              >
                {advice?.question ?? missingAdviceContext}
              </Txt>
            )}
            {remaining.map((category) => (
              <Txt key={category} size={large ? 24 : 17}>
                <Txt weight="bold">{categoryLabels[category]}: </Txt>
                {r.promptSnapshot.entries[category].text}
              </Txt>
            ))}
            {quick && (
              <Txt
                testID="party-starter"
                size={large ? 25 : 20}
                weight="medium"
              >
                {rapidOpening(r)}
              </Txt>
            )}
            {a.id === "G11" && (
              <Txt size={large ? 22 : 14}>
                Presenter:{" "}
                {
                  session.players.find((p) => p.id === r.performerIds[0])
                    ?.displayName
                }{" "}
                · Inventors:{" "}
                {r.performerIds
                  .slice(1)
                  .map(
                    (pid) =>
                      session.players.find((p) => p.id === pid)?.displayName,
                  )
                  .join(" + ")}
              </Txt>
            )}
            {a.id === "G2" && (
              <Txt size={large ? 20 : 14}>
                Actors:{" "}
                {r.performerIds
                  .map(
                    (pid) =>
                      session.players.find((p) => p.id === pid)?.displayName,
                  )
                  .join(" + ")}
                {" · Caller: "}
                {r.supportingPlayerIds
                  .map(
                    (pid) =>
                      session.players.find((p) => p.id === pid)?.displayName,
                  )
                  .join(", ") || "missing — add a player or change game"}
              </Txt>
            )}
            {a.id === "G8" && r.supportingPlayerIds.length > 0 && (
              <Txt size={14}>
                Expert:{" "}
                {
                  session.players.find((p) => p.id === r.performerIds[0])
                    ?.displayName
                }{" "}
                · Interviewer:{" "}
                {r.supportingPlayerIds
                  .map(
                    (pid) =>
                      session.players.find((p) => p.id === pid)?.displayName,
                  )
                  .join(", ")}
              </Txt>
            )}
          </>
        )}
        <PromptSwipeControl>{children}</PromptSwipeControl>
      </Card>
    </View>
  );
}
