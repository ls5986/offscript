import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import {
  Back,
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
  Toggle,
  Txt,
  useTheme,
} from "../design/ui";
import { activities, modes } from "../domain/content";
import type { Activity } from "../domain/contracts";
import { bookFor, isRiffPick } from "../domain/playbooks";
import { activityExperiences } from "../domain/party-recipes";
import { useApp } from "../providers/AppProvider";
import { Feedback } from "../components/Feedback";
export const familyIcon: Record<
  Activity["family"],
  "wordplay" | "movement" | "scene" | "practice" | "group"
> = {
  punchline: "wordplay",
  performance: "movement",
  scene: "scene",
  drill: "practice",
  social: "group",
};
const familyLabels: Record<Activity["family"], string> = {
  punchline: "Quick jokes",
  performance: "Acting games",
  scene: "Scenes",
  drill: "Skill exercises",
  social: "Group games",
};
export function ActivityTile({ activity: a }: { activity: Activity }) {
  const { data, favorite } = useApp();
  const t = useTheme();
  const router = useRouter();
  const b = bookFor(a);
  const riff = data.preferences.playIntent === "riff";
  return (
    <View
      style={{
        flexGrow: 1,
        flexBasis: 290,
        maxWidth: 560,
        borderWidth: 1,
        borderColor: t.line,
        borderRadius: 21,
        backgroundColor: t.card,
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${a.title}`}
        onPress={() => router.push(`/games/${a.id}`)}
        style={({ pressed }) => ({
          padding: 22,
          gap: 13,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Row style={{ justifyContent: "space-between" }}>
          <View
            style={{
              width: 39,
              height: 39,
              borderRadius: 12,
              backgroundColor:
                a.family === "scene"
                  ? t.lilac
                  : a.family === "drill"
                    ? t.sage
                    : t.blue,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={familyIcon[a.family]} />
          </View>
          <Eyebrow>
            {riff && b.riffPick ? "QUICK TO GET" : familyLabels[a.family]}
          </Eyebrow>
        </Row>
        <Txt serif size={27}>
          {a.title}
          {a.contentRating !== "clean" ? " · 18+" : ""}
        </Txt>
        <Txt size={15} muted numberOfLines={3}>
          {riff ? b.instruction : a.summary}
        </Txt>
        <Row style={{ gap: 14, paddingRight: 30 }}>
          <Row style={{ gap: 5 }}>
            <Icon name="people" size={15} />
            <Txt size={13} muted>
              {a.minPlayers}–{a.maxPlayers}
            </Txt>
          </Row>
          <Row style={{ gap: 5 }}>
            <Icon name="clock" size={15} />
            <Txt size={13} muted>
              ~
              {Math.max(
                1,
                Math.round(
                  (riff
                    ? Math.min(90, a.defaultDurationSec)
                    : a.defaultDurationSec) / 60,
                ),
              )}{" "}
              min
            </Txt>
          </Row>
        </Row>
      </Pressable>
      <View style={{ position: "absolute", right: 12, bottom: 10 }}>
        <IconButton
          name="heart"
          label={`${data.favorites.includes(a.id) ? "Unfavorite" : "Favorite"} ${a.title}`}
          active={data.favorites.includes(a.id)}
          onPress={() => favorite(a.id)}
        />
      </View>
    </View>
  );
}
export default function Games() {
  const { mode: initial } = useLocalSearchParams<{ mode?: string }>();
  const { data } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState(initial ?? "all");
  const [family, setFamily] = useState("all");
  const [search, setSearch] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [seated, setSeated] = useState(false);
  const [filters, setFilters] = useState(false);
  const [quickOnly, setQuickOnly] = useState(false);
  const riff = data.preferences.playIntent === "riff";
  const list = activities.filter(
    (a) =>
      (a.contentRating === "clean" ||
        (data.preferences.matureOptIn && !data.preferences.classroomDefault)) &&
      (!quickOnly || isRiffPick(a)) &&
      (mode === "all" ||
        (mode === "party_night"
          ? activityExperiences[a.id].casualParty
          : a.modes.includes(mode as "party_night"))) &&
      (family === "all" || a.family === family) &&
      (!count || (a.minPlayers <= count && a.maxPlayers >= count)) &&
      (!seated || a.energy === "seated") &&
      `${a.title} ${a.summary} ${bookFor(a).instruction} ${a.focusSkills.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const order = ["W1", "G2", "W4", "P4", "G11", "W3", "G8", "G3", "T2"];
  const sorted = riff
    ? [...list].sort(
        (a, b) =>
          (order.includes(a.id) ? order.indexOf(a.id) : 99) -
          (order.includes(b.id) ? order.indexOf(b.id) : 99),
      )
    : list;
  return (
    <Page compact>
      <View style={{ gap: 9 }}>
        <Eyebrow>THE GAME LIBRARY</Eyebrow>
        <Txt serif size={32}>
          Pick your next game.
        </Txt>
        <Txt size={15} muted>
          The full catalog. Pick a quick laugh, a scene, or a skill to practice.
        </Txt>
      </View>
      <Row>
        <Chip selected={!quickOnly} onPress={() => setQuickOnly(false)}>
          All games
        </Chip>
        <Chip selected={quickOnly} onPress={() => setQuickOnly(true)}>
          Quick games
        </Chip>
      </Row>
      <Row style={{ flexWrap: "nowrap", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Field
            label="Search games"
            placeholder="Search games or skills…"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <IconButton
          name="settings"
          label="Filter games"
          active={mode !== "all" || family !== "all" || !!count || seated}
          onPress={() => setFilters(true)}
        />
        <IconButton
          name="studio"
          label="Prompt & recipe library"
          onPress={() => router.push("/library")}
        />
      </Row>
      <Row style={{ justifyContent: "space-between" }}>
        <Txt size={14} weight="bold">
          {sorted.length} games{count ? ` for ${count} people` : ""}
        </Txt>
      </Row>
      {sorted.length ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {sorted.map((a) => (
            <ActivityTile activity={a} key={a.id} />
          ))}
        </View>
      ) : (
        <Card>
          <Txt serif size={26}>
            A little too specific?
          </Txt>
          <Txt muted>Try fewer filters or another search.</Txt>
          <Button
            kind="secondary"
            onPress={() => {
              setMode("all");
              setFamily("all");
              setCount(null);
              setSeated(false);
              setSearch("");
              setQuickOnly(false);
            }}
          >
            Clear filters
          </Button>
        </Card>
      )}
      <Button
        kind="ghost"
        small
        icon="play"
        onPress={() =>
          router.push({ pathname: "/start", params: { intent: "practice" } })
        }
      >
        Start a practice session
      </Button>
      <Txt muted size={13}>
        {data.preferences.matureOptIn && !data.preferences.classroomDefault
          ? "All 39 formats are available."
          : "38 clean games + 1 optional 18+ format in Content settings."}
      </Txt>
      <Feedback activityId="catalog" roundId="catalog" />
      <Dialog
        visible={filters}
        onClose={() => setFilters(false)}
        title="Find your game"
      >
        <Eyebrow>KIND OF GAME</Eyebrow>
        <Row>
          <Chip selected={mode === "all"} onPress={() => setMode("all")}>
            Any kind
          </Chip>
          {modes.map((m) => (
            <Chip
              key={m.id}
              selected={mode === m.id}
              onPress={() => setMode(m.id)}
            >
              {m.label}
            </Chip>
          ))}
        </Row>
        <Txt size={14} muted>
          {mode === "all"
            ? "These are groups of games, not difficulty levels. Choosing one only filters this list."
            : modes.find((item) => item.id === mode)?.sub}
        </Txt>
        <Eyebrow>TYPE OF GAME</Eyebrow>
        <Row>
          {(
            [
              "all",
              "punchline",
              "performance",
              "scene",
              "drill",
              "social",
            ] as const
          ).map((f) => (
            <Chip key={f} selected={family === f} onPress={() => setFamily(f)}>
              {f === "all" ? "All types" : familyLabels[f]}
            </Chip>
          ))}
        </Row>
        <Toggle
          label="Filter by group size"
          value={count !== null}
          onChange={(v) =>
            setCount(v ? data.preferences.lastPlayerCount : null)
          }
        />
        {count !== null && <Counter count={count} onChange={setCount} />}
        <Toggle
          label="Seated catalog only"
          value={seated}
          onChange={setSeated}
        />
        <Button onPress={() => setFilters(false)}>
          Show {sorted.length} games
        </Button>
      </Dialog>
    </Page>
  );
}
export function GameDetails() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const router = useRouter();
  const { data, favorite } = useApp();
  const t = useTheme();
  const a = activities.find((a) => a.id === activityId);
  if (!a)
    return (
      <Page compact>
        <Back />
        <Txt serif size={32}>
          Let’s find another one.
        </Txt>
        <Button onPress={() => router.replace("/games")}>Explore games</Button>
      </Page>
    );
  const b = bookFor(a);
  const practice = data.preferences.playIntent === "practice";
  const blocked =
    a.contentRating !== "clean" &&
    (!data.preferences.matureOptIn || data.preferences.classroomDefault);
  return (
    <Page
      narrow
      compact
      dock={
        !blocked ? (
          <Button
            icon="play"
            onPress={() =>
              router.push({
                pathname: "/start",
                params: {
                  activity: a.id,
                  quick: data.hasPlayed ? "1" : undefined,
                  mode: "surprise",
                  intent: data.preferences.playIntent,
                },
              })
            }
          >
            Play {a.title}
          </Button>
        ) : undefined
      }
    >
      <Back text="Explore Games" />
      <Row style={{ justifyContent: "space-between" }}>
        <Eyebrow>
          {a.family} · {a.minPlayers}–{a.maxPlayers} players
        </Eyebrow>
        <IconButton
          name="heart"
          label="Favorite game"
          active={data.favorites.includes(a.id)}
          onPress={() => favorite(a.id)}
        />
      </Row>
      <Txt serif size={39}>
        {a.title}
      </Txt>
      {blocked ? (
        <Card>
          <Txt>
            This optional format is hidden by your clean-content settings.
          </Txt>
          <Button onPress={() => router.push("/settings")}>
            Content settings
          </Button>
        </Card>
      ) : (
        <>
          <Txt size={19} weight="medium">
            {b.instruction}
          </Txt>
          <Card style={{ padding: 23 }}>
            <Eyebrow>DO THIS</Eyebrow>
            {b.steps.map((step, i) => (
              <Txt key={step}>
                {i + 1}. {step}
              </Txt>
            ))}
            <View
              style={{
                backgroundColor: t.lilac,
                padding: 19,
                borderRadius: 16,
                gap: 8,
              }}
            >
              <Eyebrow>LIKE THIS</Eyebrow>
              <Txt size={17}>{b.example}</Txt>
            </View>
          </Card>
          {a.energy !== "seated" && (
            <Txt size={15} muted>
              No contact needed. Seated gestures work.
            </Txt>
          )}
          <Disclosure title="Full rules & coaching" initial={practice}>
            <Txt>{a.howTo}</Txt>
            <Eyebrow>SKILL FOCUS</Eyebrow>
            <Txt>{a.focusSkills.join(" · ")}</Txt>
            <Txt>{a.coachTip}</Txt>
            <Eyebrow>REFLECTION</Eyebrow>
            <Txt serif size={23}>
              {a.reflection}
            </Txt>
          </Disclosure>
          <Feedback activityId={a.id} roundId="details" />
        </>
      )}
    </Page>
  );
}
