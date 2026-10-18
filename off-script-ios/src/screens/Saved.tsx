import { sceneText } from "../domain/composer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Eyebrow,
  IconButton,
  Page,
  Row,
  Title,
  Txt,
} from "../design/ui";
import { activities, activityById } from "../domain/content";
import { currentRound } from "../domain/session";
import { useApp } from "../providers/AppProvider";
import { savedPromptLevel, studioSnapshotAllowed } from "../domain/library";
import { ActivityTile } from "./Games";
export default function Saved() {
  const { data, update } = useApp();
  const { tab: requestedTab } = useLocalSearchParams<{ tab?: string }>();
  const [selectedTab, setTab] = useState<string | null>(null);
  const tab =
    selectedTab ??
    (requestedTab === "sessions" || data.sessions.length
      ? "Sessions"
      : "Games");
  const router = useRouter();
  const eligiblePrompts = (list: typeof data.savedPrompts) =>
    list.filter((p) => studioSnapshotAllowed(p.snapshot, data.preferences));
  const list = activities.filter(
    (a) =>
      data.favorites.includes(a.id) &&
      (a.contentRating === "clean" ||
        (data.preferences.matureOptIn && !data.preferences.classroomDefault)),
  );
  return (
    <Page>
      <Title
        eyebrow="YOUR LITTLE COLLECTION"
        title="Keep the good stuff."
        sub="Favorite games, scene sparks, and nights worth remembering. All on this device."
      />
      <Row>
        {["Games", "Prompts", "Recent sparks", "Sessions", "Presets"].map(
          (v) => (
            <Chip key={v} selected={tab === v} onPress={() => setTab(v)}>
              {v}
            </Chip>
          ),
        )}
      </Row>
      {tab === "Sessions" && data.sessions.length > 0 && (
        <Txt size={14} muted>
          {data.sessions.length} saved{" "}
          {data.sessions.length === 1 ? "session" : "sessions"} on this device.
        </Txt>
      )}
      {tab === "Games" &&
        (list.length ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 18 }}>
            {list.map((a) => (
              <ActivityTile key={a.id} activity={a} />
            ))}
          </View>
        ) : (
          <Empty
            title="Your future favorites live here."
            text="Tap the heart on a game you want to come back to."
            action="Explore Games"
            onPress={() => router.push("/games")}
          />
        ))}
      {["Prompts", "Recent sparks"].includes(tab) &&
        (eligiblePrompts(
          tab === "Prompts" ? data.savedPrompts : data.promptHistory,
        ).length ? (
          eligiblePrompts(
            tab === "Prompts" ? data.savedPrompts : data.promptHistory,
          ).map((p) => (
            <Card key={p.id}>
              <Row style={{ justifyContent: "space-between" }}>
                <Eyebrow>
                  {p.playerCount} PERFORMERS ·{" "}
                  {new Date(p.createdAt).toLocaleDateString()}
                </Eyebrow>
                <IconButton
                  name="trash"
                  label="Remove prompt"
                  onPress={() =>
                    void update((d) => ({
                      ...d,
                      savedPrompts:
                        tab === "Prompts"
                          ? d.savedPrompts.filter((x) => x.id !== p.id)
                          : d.savedPrompts,
                      promptHistory:
                        tab === "Recent sparks"
                          ? d.promptHistory.filter((x) => x.id !== p.id)
                          : d.promptHistory,
                    }))
                  }
                />
              </Row>
              <Txt serif size={25}>
                {p.snapshot.jokeTopic?.word ||
                  sceneText(p.snapshot) ||
                  "An open scene"}
              </Txt>
              <Txt muted size={13}>
                {Object.keys(p.snapshot.entries)
                  .join(" · ")
                  .replaceAll("_", " ")}
              </Txt>
              <Button
                kind="secondary"
                icon="studio"
                onPress={() => {
                  void update((d) => ({
                    ...d,
                    studio: {
                      contentLevel: savedPromptLevel(p.snapshot),
                      flavor: p.snapshot.flavor,
                      playerCount: p.playerCount,
                      categories: Object.keys(
                        p.snapshot.entries,
                      ) as typeof d.studio.categories,
                      generationStyle: p.snapshot.generationStyle,
                      result: structuredClone(p.snapshot),
                    },
                  })).then(() => router.push("/studio"));
                }}
              >
                Open exact prompt
              </Button>
            </Card>
          ))
        ) : (
          <Empty
            title="Catch an idea before it gets away."
            text="Save a prompt in Studio. Your exact words and locks stay together."
            action="Open Studio"
            onPress={() => router.push("/studio")}
          />
        ))}
      {tab === "Sessions" &&
        (data.sessions.length ? (
          [...data.sessions].reverse().map((s) => (
            <Card key={s.id}>
              <Row style={{ justifyContent: "space-between" }}>
                <Eyebrow>
                  {s.status === "finished" ? "FINISHED" : "READY TO RESUME"} ·{" "}
                  {s.players.length} PEOPLE
                </Eyebrow>
                <Txt size={12} muted>
                  {new Date(s.createdAt).toLocaleDateString()}
                </Txt>
              </Row>
              <Txt serif size={27}>
                {s.party
                  ? "Party Night"
                  : activityById(currentRound(s).activityId).contentRating ===
                        "clean" ||
                      (data.preferences.matureOptIn &&
                        !data.preferences.classroomDefault)
                    ? activityById(currentRound(s).activityId).title
                    : "A saved session"}
              </Txt>
              <Txt muted size={13}>
                {s.rounds.filter((r) => r.status === "complete").length}{" "}
                {s.party ? "cards played" : "completed rounds"}
                {s.note ? ` · “${s.note}”` : ""}
              </Txt>
              <Button
                kind="secondary"
                icon={s.status === "finished" ? "bookmark" : "play"}
                onPress={() =>
                  router.push(s.party ? `/party/${s.id}` : `/session/${s.id}`)
                }
              >
                {s.status === "finished" ? "See recap" : "Resume safely paused"}
              </Button>
            </Card>
          ))
        ) : (
          <Empty
            title="A good night starts somewhere."
            text="Play a round and your session will stay here."
            action="Let’s play"
            onPress={() => router.push("/start")}
          />
        ))}
      {tab === "Presets" &&
        (data.presets.length ? (
          data.presets.map((p) => (
            <Card key={p.id}>
              <Row style={{ justifyContent: "space-between" }}>
                <Txt serif size={25}>
                  {p.label}
                </Txt>
                <IconButton
                  name="trash"
                  label="Delete preset"
                  onPress={() =>
                    void update((d) => ({
                      ...d,
                      presets: d.presets.filter((x) => x.id !== p.id),
                    }))
                  }
                />
              </Row>
              <Txt muted size={13}>
                {p.state.categories.join(" · ")} · {p.state.playerCount}{" "}
                performers
              </Txt>
              <Button
                kind="secondary"
                onPress={() => {
                  void update((d) => ({ ...d, studio: p.state })).then(() =>
                    router.push("/studio"),
                  );
                }}
              >
                Use preset
              </Button>
            </Card>
          ))
        ) : (
          <Empty
            title="Your favorite scene recipe."
            text="Choose categories in Studio, then save a teacher preset."
            action="Open Studio"
            onPress={() => router.push("/studio")}
          />
        ))}
    </Page>
  );
}
function Empty({
  title,
  text,
  action,
  onPress,
}: {
  title: string;
  text: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <Card
      style={{
        minHeight: 250,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <Txt serif size={30} style={{ textAlign: "center" }}>
        {title}
      </Txt>
      <Txt muted style={{ textAlign: "center" }}>
        {text}
      </Txt>
      <Button kind="secondary" onPress={onPress}>
        {action}
      </Button>
    </Card>
  );
}
