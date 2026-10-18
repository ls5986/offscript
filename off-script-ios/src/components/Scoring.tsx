import { useState } from "react";
import { View } from "react-native";
import { Button, Chip, Disclosure, Eyebrow, Row, Txt } from "../design/ui";
import { currentRound } from "../domain/session";
import { useApp, uuid } from "../providers/AppProvider";
export function Scoring({ sessionId }: { sessionId: string }) {
  const { data, changeSession } = useApp();
  const [voter, setVoter] = useState<string | null>(null);
  const s = data.sessions.find((s) => s.id === sessionId)!;
  const r = currentRound(s);
  return (
    <Disclosure title="Optional points · no judgment required">
      <Txt size={14} muted>
        Only people award points. Anyone can pass.
      </Txt>
      <Row>
        {(["off", "individual", "teams"] as const).map((mode) => (
          <Chip
            key={mode}
            selected={s.settings.scoring === mode}
            onPress={() =>
              void changeSession(s.id, (s) => ({
                ...s,
                settings: { ...s.settings, scoring: mode },
              }))
            }
          >
            {mode === "off"
              ? "No points"
              : mode === "individual"
                ? "Players"
                : "Teams"}
          </Chip>
        ))}
      </Row>
      {s.settings.scoring !== "off" && (
        <View style={{ gap: 12 }}>
          {(s.settings.scoring === "teams"
            ? s.teams
            : s.players.filter((p) => !p.isSittingOut)
          ).map((target) => (
            <Row key={target.id} style={{ justifyContent: "space-between" }}>
              <Txt>
                {target.displayName} ·{" "}
                {s.scores
                  .filter(
                    (x) =>
                      x.targetPlayerId === target.id ||
                      x.targetTeamId === target.id,
                  )
                  .reduce((n, x) => n + x.points, 0)}{" "}
                points
              </Txt>
              <Button
                small
                kind="secondary"
                onPress={() =>
                  void changeSession(s.id, (s) => ({
                    ...s,
                    scores: [
                      ...s.scores,
                      {
                        id: uuid(),
                        roundId: r.id,
                        targetPlayerId:
                          s.settings.scoring === "individual"
                            ? target.id
                            : null,
                        targetTeamId:
                          s.settings.scoring === "teams" ? target.id : null,
                        points: 1,
                        reason: "Manually awarded",
                      },
                    ],
                  }))
                }
              >
                +1 point
              </Button>
            </Row>
          ))}
          <Eyebrow>Optional human vote</Eyebrow>
          <Row>
            {s.players
              .filter((p) => !p.isSittingOut)
              .map((p) => (
                <Chip
                  key={p.id}
                  selected={voter === p.id}
                  onPress={() => setVoter(p.id)}
                >
                  {p.displayName} is voting
                </Chip>
              ))}
          </Row>
          {voter && (
            <Row>
              {(s.settings.scoring === "teams" ? s.teams : s.players).map(
                (target) => (
                  <Button
                    key={target.id}
                    small
                    kind="secondary"
                    onPress={() => {
                      void changeSession(s.id, (s) => ({
                        ...s,
                        votes: [
                          ...s.votes.filter(
                            (v) =>
                              !(
                                v.roundId === r.id && v.voterPlayerId === voter
                              ),
                          ),
                          {
                            id: uuid(),
                            roundId: r.id,
                            voterPlayerId: voter,
                            targetPlayerId:
                              s.settings.scoring === "individual"
                                ? target.id
                                : null,
                            targetTeamId:
                              s.settings.scoring === "teams" ? target.id : null,
                          },
                        ],
                      }));
                      setVoter(null);
                    }}
                  >
                    Vote {target.displayName}
                  </Button>
                ),
              )}
              <Button small kind="ghost" onPress={() => setVoter(null)}>
                Pass vote
              </Button>
            </Row>
          )}
          <Txt size={14} muted>
            {s.votes.filter((v) => v.roundId === r.id).length} votes recorded
            this round.
          </Txt>
        </View>
      )}
    </Disclosure>
  );
}
