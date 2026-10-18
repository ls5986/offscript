import Constants from "expo-constants";
import * as Linking from "expo-linking";
import { publicReleaseLinks } from "../config/release";
import { Platform, Share } from "react-native";
import { useState } from "react";
import {
  Button,
  Card,
  Chip,
  Dialog,
  Disclosure,
  Eyebrow,
  Icon,
  Page,
  Row,
  Title,
  Toggle,
  Txt,
  useTheme,
} from "../design/ui";
import { UserPreferences } from "../domain/contracts";
import { intentDescriptions, intentLabels } from "../domain/playbooks";
import { useApp } from "../providers/AppProvider";
import { Feedback } from "../components/Feedback";
import { feedbackMessage } from "../domain/feedback";
export default function Settings() {
  const { data, update, reset } = useApp();
  const p = data.preferences;
  const t = useTheme();
  const links = publicReleaseLinks(Constants.expoConfig?.extra);
  const [adult, setAdult] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [message, setMessage] = useState("");
  const set = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K],
  ) =>
    void update((d) => ({
      ...d,
      preferences: { ...d.preferences, [key]: value },
    }));
  return (
    <Page narrow>
      <Title
        eyebrow="MAKE YOURSELF COMFORTABLE"
        title="Your rules. Your room."
        sub="A few small choices to make playing feel right."
      />
      <Card>
        <Eyebrow>HOW DO YOU WANT TO PLAY?</Eyebrow>
        <Row>
          {(["riff", "practice"] as const).map((playIntent) => (
            <Chip
              key={playIntent}
              selected={p.playIntent === playIntent}
              onPress={() => set("playIntent", playIntent)}
            >
              {intentLabels[playIntent]}
            </Chip>
          ))}
        </Row>
        <Txt size={15} muted>
          {intentDescriptions[p.playIntent]} Both choices keep the full eligible
          catalog available in Explore Games.
        </Txt>
      </Card>
      <Card>
        <Eyebrow>THE COMPANY YOU KEEP</Eyebrow>
        <Toggle
          label="Classroom clean"
          sub="Enforces clean content everywhere, including saved games."
          value={p.classroomDefault}
          onChange={(v) => set("classroomDefault", v)}
        />
        <Toggle
          label="Optional 18+ format"
          sub="For individual games. Party Night has its own group opt-in. Never shown in classroom mode."
          value={p.matureOptIn && !p.classroomDefault}
          onChange={(v) => (v ? setAdult(true) : set("matureOptIn", false))}
        />
        <Txt muted size={12}>
          Any game can be skipped without a reason. No drinking, touching, or
          personal disclosures are required.
        </Txt>
      </Card>
      <Card>
        <Eyebrow>CUES & COMFORT</Eyebrow>
        <Toggle
          label="Spoken cues"
          sub="Visible and manual cues always remain available. Device silent settings may mute speech."
          value={p.soundEnabled}
          onChange={(v) => set("soundEnabled", v)}
        />
        <Toggle
          label="Gentle haptics"
          sub="Available on supported phones."
          value={p.hapticsEnabled}
          onChange={(v) => set("hapticsEnabled", v)}
        />
        <Toggle
          label="Larger text"
          sub="More room for the words that matter."
          value={p.useLargeText}
          onChange={(v) => set("useLargeText", v)}
        />
        <Toggle
          label="Reduced motion"
          sub="Keep transitions simple. Gameplay never relies on animation."
          value={p.reducedMotion}
          onChange={(v) => set("reducedMotion", v)}
        />
        <Txt muted size={12}>
          Appearance follows your device’s light or dark setting. In play, Large
          Display makes prompts readable across the room.
        </Txt>
      </Card>
      <Card>
        <Row>
          <Icon name="lock" />
          <Eyebrow>YOUR DEVICE. YOUR DATA.</Eyebrow>
        </Row>
        <Txt>
          No accounts, ads, tracking, recordings, or runtime AI. Your names,
          saved prompts, and sessions stay on this device.
        </Txt>
        <Txt muted size={13}>
          {Platform.OS === "web"
            ? "Browser storage can be cleared or restricted, especially in private browsing. Offline play works after the app and its files have loaded and been cached. A first visit needs a connection."
            : "Games and prompts are included in the app. Names, favorites and sessions are saved on this device. You can clear them here. Device backups may also include local app data."}
        </Txt>
        {data.feedback.length > 0 && (
          <Button
            kind="secondary"
            icon="copy"
            onPress={() => {
              const text = data.feedback
                .map((entry) =>
                  feedbackMessage(
                    entry,
                    Constants.expoConfig?.version ?? "1.3.0",
                  ),
                )
                .join("\n\n");
              void (async () => {
                try {
                  if (Platform.OS === "web" && navigator.clipboard) {
                    await navigator.clipboard.writeText(text);
                    setMessage("Local feedback copied. Nothing was submitted.");
                  } else await Share.share({ message: text });
                } catch {
                  setMessage(
                    "Sharing was unavailable. Your feedback is still saved here.",
                  );
                }
              })();
            }}
          >
            Export local feedback
          </Button>
        )}
        <Disclosure title="Privacy & offline details">
          <Txt size={13}>
            {Platform.OS === "web"
              ? "The hosted app downloads its own code, fonts, and content. Hosting providers can receive ordinary request metadata. Off Script does not send gameplay or names to an analytics service. There is no app-managed cloud sync."
              : "Off Script does not upload gameplay or names, and does not require an account. Your device controls its own backups. Sharing feedback or opening support is a choice you make."}
          </Txt>
          <Txt size={13}>
            Native stores user data in SQLite; web uses IndexedDB. Clearing site
            data, uninstalling the app, or changing browsers may remove local
            progress. Save only names everyone is comfortable keeping here.
          </Txt>
        </Disclosure>
        <Txt size={13} muted>
          Testing an iOS beta? TestFlight can send screenshots and comments to
          the developer. Local ratings are not submitted. Use Share feedback or
          your approved support contact when you want to send a report.
        </Txt>
        {Platform.OS !== "web" && links.privacyURL && (
          <Button
            kind="secondary"
            onPress={() =>
              void Linking.openURL(links.privacyURL!).catch(() =>
                setMessage("Could not open the privacy page."),
              )
            }
          >
            Privacy policy
          </Button>
        )}
        {Platform.OS !== "web" && links.supportURL && (
          <Button
            kind="secondary"
            onPress={() =>
              void Linking.openURL(links.supportURL!).catch(() =>
                setMessage("Could not open the support page."),
              )
            }
          >
            Support
          </Button>
        )}
        {Platform.OS === "web" && (
          <Row>
            {[
              ["/", "Website"],
              ["/privacy", "Privacy policy"],
              ["/support", "Support"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{
                  color: t.accentInk,
                  fontFamily: "DMSans, system-ui, sans-serif",
                  fontSize: 16,
                  padding: "12px 4px",
                }}
              >
                {label}
              </a>
            ))}
          </Row>
        )}
        <Button
          kind="secondary"
          icon="trash"
          onPress={() => setDeleteOpen(true)}
        >
          Clear all local data
        </Button>
        {!!message && (
          <Txt size={13} accessibilityLiveRegion="polite">
            {message}
          </Txt>
        )}
      </Card>
      <Card>
        <Eyebrow>ABOUT OFF SCRIPT</Eyebrow>
        <Txt serif size={27}>
          Make it up as you go.
        </Txt>
        <Txt size={13} muted>
          Version 1.3.0 · 39 activity formats · Original authored prompts and
          coaching.
        </Txt>
        <Txt size={13}>
          Educational influences include common improv practice, Improv
          Encyclopedia, and Hoopla’s short-form game resources. This app has no
          affiliation with those organizations or television programs.
        </Txt>
        <Txt size={14} muted>
          One phone. No account. Your saved games stay on this device.
        </Txt>
      </Card>
      <Feedback activityId="settings" roundId="settings" />
      <Dialog
        visible={adult}
        onClose={() => setAdult(false)}
        title="Adults in the room?"
      >
        <Txt>
          Enable the mild, suggestive “Sex With Me Is Like” format only if
          everyone playing is 18 or older and freely agrees. It stays hidden in
          Classroom Clean.
        </Txt>
        <Button
          onPress={() => {
            void update((d) => ({
              ...d,
              preferences: {
                ...d.preferences,
                matureOptIn: true,
                matureConfirmedAt: new Date().toISOString(),
              },
            }));
            setAdult(false);
          }}
        >
          Everyone is 18+ and agrees
        </Button>
        <Button kind="secondary" onPress={() => setAdult(false)}>
          Keep it clean
        </Button>
      </Dialog>
      <Dialog
        visible={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Clear this device?"
      >
        <Txt>
          This removes all sessions, names, scores, favorites, prompts, presets,
          and preferences. Bundled games stay available.
        </Txt>
        <Button
          onPress={() => {
            void reset().then(() => {
              setDeleteOpen(false);
              setMessage("All local data cleared. A fresh start.");
            });
          }}
        >
          Delete all local data
        </Button>
        <Button kind="secondary" onPress={() => setDeleteOpen(false)}>
          Keep my data
        </Button>
      </Dialog>
    </Page>
  );
}
