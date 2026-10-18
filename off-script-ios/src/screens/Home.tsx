import { useState } from "react";
import { PartyOptionsSchema } from "../domain/party-contracts";
import { useRouter } from "expo-router";
import { Pressable, useWindowDimensions, View } from "react-native";
import {
  Button,
  Card,
  Eyebrow,
  Icon,
  Page,
  Row,
  Txt,
  useTheme,
} from "../design/ui";
import { activityById } from "../domain/content";
import { currentRound } from "../domain/session";
import { useApp } from "../providers/AppProvider";
export default function Home() {
  const router = useRouter();
  const { data, startParty } = useApp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const group =
    data.preferences.lastPartyGroup ??
    (data.hasPlayed
      ? {
          count: data.preferences.lastPlayerCount,
          names: data.preferences.lastPlayerNames,
        }
      : null);
  const begin = async () => {
    if (!group) {
      router.push("/party");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const id = await startParty(
        group.count,
        group.names,
        PartyOptionsSchema.parse({
          ...data.preferences.lastPartyOptions,
          selectedActivityIds: data.preferences.selectedPartyActivityIds,
        }),
      );
      router.push(`/party/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open your party.");
    } finally {
      setBusy(false);
    }
  };
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const t = useTheme();
  const resume = [...data.sessions]
    .reverse()
    .find(
      (s) =>
        s.status !== "finished" &&
        (s.party || !["complete", "skipped"].includes(currentRound(s).status)),
    );
  return (
    <Page compact>
      <View style={{ gap: 10 }}>
        <Txt serif size={wide ? 48 : 28}>
          Make something up.
        </Txt>
        <Txt muted size={14}>
          An idea for you. A game with friends.
        </Txt>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Prompt Studio"
        onPress={() => router.push("/studio")}
        style={({ pressed }) => ({
          padding: 18,
          borderRadius: 22,
          backgroundColor: t.lilac,
          opacity: pressed ? 0.7 : 1,
          gap: 4,
          minHeight: 44,
        })}
      >
        <Row style={{ justifyContent: "space-between" }}>
          <Txt serif size={26} style={{ flexShrink: 1 }}>
            Prompt Studio
          </Txt>
          <Icon name="arrow" size={20} />
        </Row>
        <Txt size={14}>
          Get a prompt. Write or act, on your own or together.
        </Txt>
      </Pressable>
      <Card style={{ backgroundColor: t.blue, padding: 18, gap: 8 }}>
        <Row style={{ justifyContent: "space-between" }}>
          <Txt serif size={26}>
            Party Night
          </Txt>
          <Icon name="shuffle" />
        </Row>
        <Txt size={14}>
          Play with friends. We pick who’s up and what’s next.
        </Txt>
        <Button
          icon="play"
          after="arrow"
          disabled={busy}
          onPress={() => void begin()}
        >
          {busy ? "Dealing…" : "Start Party Night"}
        </Button>
        {group && (
          <Row style={{ justifyContent: "space-between" }}>
            <Txt muted size={13}>
              {group.count} people · fresh deck
            </Txt>
            <Button small kind="ghost" onPress={() => router.push("/party")}>
              Change players
            </Button>
            <Button small kind="ghost" onPress={() => router.push("/party")}>
              Choose games
            </Button>
          </Row>
        )}
        {!!error && <Txt accessibilityLiveRegion="polite">{error}</Txt>}
      </Card>
      {resume && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Resume saved session"
          onPress={() =>
            router.push(
              resume.party ? `/party/${resume.id}` : `/session/${resume.id}`,
            )
          }
          style={{
            padding: 17,
            borderWidth: 1,
            borderColor: t.line,
            borderRadius: 18,
            gap: 4,
          }}
        >
          <Row>
            <Icon name="play" size={18} />
            <Txt weight="bold">Pick up where you left off</Txt>
          </Row>
          <Txt muted size={13}>
            {resume.party
              ? "Party Night"
              : activityById(currentRound(resume).activityId).title}{" "}
            · {resume.players.filter((p) => !p.isSittingOut).length} people
          </Txt>
        </Pressable>
      )}
      <View style={{ flexDirection: width >= 650 ? "row" : "column", gap: 14 }}>
        {[
          {
            title: "Explore Games",
            text: "Find a favorite. Practice something new.",
            icon: "grid" as const,
            path: "/games",
            color: t.blue,
          },
        ].map((item) => (
          <Pressable
            key={item.title}
            accessibilityRole="button"
            accessibilityLabel={item.title}
            onPress={() => router.push(item.path as "/studio")}
            style={({ pressed }) => ({
              flex: 1,
              padding: 22,
              borderRadius: 22,
              backgroundColor: item.color,
              opacity: pressed ? 0.7 : 1,
              gap: 9,
            })}
          >
            <Row style={{ justifyContent: "space-between" }}>
              <Icon name={item.icon} size={24} />
              <Icon name="arrow" size={18} />
            </Row>
            <Txt serif size={29}>
              {item.title}
            </Txt>
            <Txt muted size={14}>
              {item.text}
            </Txt>
          </Pressable>
        ))}
      </View>
      <Button
        kind="secondary"
        icon="bookmark"
        onPress={() => router.push("/saved")}
      >
        Your saved games & prompts
      </Button>
      <Button kind="ghost" icon="grid" onPress={() => router.push("/library")}>
        Prompt & recipe library
      </Button>
      <Card style={{ padding: 20 }}>
        <Eyebrow>A SIMPLE PLACE TO START</Eyebrow>
        <Txt size={15} muted>
          Accept an idea. Add one detail. See where it goes.
        </Txt>
        <Row>
          <Button
            small
            kind="secondary"
            icon="play"
            onPress={() =>
              router.push({
                pathname: "/start",
                params: { activity: "W1", intent: "riff", playFlow: "free" },
              })
            }
          >
            Play Yes, And
          </Button>
          <Button
            small
            kind="ghost"
            onPress={() =>
              router.push({
                pathname: "/start",
                params: { mode: "just_us", intent: "riff" },
              })
            }
          >
            Just two of us
          </Button>
        </Row>
      </Card>
    </Page>
  );
}
