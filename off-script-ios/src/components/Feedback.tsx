import { useState } from "react";
import Constants from "expo-constants";
import { Platform, Share } from "react-native";
import {
  Button,
  Chip,
  Dialog,
  Disclosure,
  Field,
  Row,
  Txt,
} from "../design/ui";
import { feedbackMessage } from "../domain/feedback";
import type { PromptSnapshot } from "../domain/contracts";
import { useApp, uuid } from "../providers/AppProvider";
import type { AppData } from "../storage/model";
type Rating = AppData["feedback"][number]["rating"];
export function FeedbackChoices({
  onRate,
  disabled = false,
}: {
  onRate: (rating: Rating) => void;
  disabled?: boolean;
}) {
  return (
    <>
      <Txt muted size={14}>
        Feedback stays on this device. It is not sent anywhere.
      </Txt>
      <Row>
        {(
          [
            ["fun", "Made us laugh"],
            ["easy", "Easy to play"],
            ["too_hard", "Too much work"],
            ["not_for_us", "Not for us"],
          ] as const
        ).map(([rating, label]) => (
          <Chip key={rating} disabled={disabled} onPress={() => onRate(rating)}>
            {label}
          </Chip>
        ))}
      </Row>
    </>
  );
}
export function Feedback({
  activityId,
  roundId,
  snapshot,
}: {
  activityId: string;
  roundId: string;
  snapshot?: PromptSnapshot;
}) {
  const { update } = useApp();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [issue, setIssue] = useState<"unclear" | "weak_prompt" | "bug">(
    "unclear",
  );
  const [note, setNote] = useState("");
  const rate = async (rating: Rating) => {
    if (busy) return;
    setBusy(true);
    try {
      await update((d) => ({
        ...d,
        feedback: [
          ...d.feedback,
          {
            id: uuid(),
            activityId,
            roundId,
            targetType: snapshot ? "prompt" : "activity",
            snapshot: snapshot ? structuredClone(snapshot) : undefined,
            rating,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      setMessage("Feedback saved on this device.");
      setOpen(false);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save feedback.");
    } finally {
      setBusy(false);
    }
  };
  const share = async () => {
    if (busy) return;
    setBusy(true);
    setMessage("");
    const entry = {
      id: uuid(),
      activityId,
      roundId,
      issue,
      note: note.trim(),
      rating:
        issue === "unclear" ? ("too_hard" as const) : ("not_for_us" as const),
      targetType: snapshot ? ("prompt" as const) : ("activity" as const),
      snapshot: snapshot ? structuredClone(snapshot) : undefined,
      createdAt: new Date().toISOString(),
    };
    try {
      await update((d) => ({ ...d, feedback: [...d.feedback, entry] }));
      const text = feedbackMessage(
        entry,
        Constants.expoConfig?.version ?? "1.3.0",
      );
      if (Platform.OS === "web" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setMessage(
          "Copied. Paste it into TestFlight feedback or send it to the app's support contact. Nothing was sent automatically.",
        );
      } else {
        const result = await Share.share({
          message: text,
          title: "Off Script feedback",
        });
        setMessage(
          result.action === Share.dismissedAction
            ? "Sharing canceled. Your feedback is still saved on this device."
            : "Share completed. Delivery depends on the app and recipient you chose.",
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not prepare feedback for sharing.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Button small kind="ghost" onPress={() => setOpen(true)}>
        Report a problem
      </Button>
      {!!message && !open && (
        <Txt size={13} accessibilityLiveRegion="polite">
          {message}
        </Txt>
      )}
      <Dialog
        visible={open}
        onClose={() => setOpen(false)}
        title="Report a problem"
      >
        <Txt size={14} muted>
          Choose a reason or add a note. The report includes the game, app
          version and prompt IDs, not player names or private roles. Nothing is
          sent automatically.
        </Txt>
        <Row>
          {(
            [
              ["unclear", "Didn't know what to do"],
              ["weak_prompt", "Prompt wasn't good"],
              ["bug", "Something broke"],
            ] as const
          ).map(([value, label]) => (
            <Chip
              key={value}
              selected={issue === value}
              disabled={busy}
              onPress={() => setIssue(value)}
            >
              {label}
            </Chip>
          ))}
        </Row>
        <Field
          label="Optional note"
          value={note}
          onChangeText={(value) => setNote(value.slice(0, 500))}
          multiline
        />
        <Button disabled={busy} onPress={() => void share()}>
          {Platform.OS === "web" ? "Copy feedback" : "Share feedback"}
        </Button>
        {!!message && (
          <Txt size={14} accessibilityLiveRegion="polite">
            {message}
          </Txt>
        )}
        <Disclosure title="Leave a quick rating">
          <FeedbackChoices disabled={busy} onRate={(r) => void rate(r)} />
        </Disclosure>
      </Dialog>
    </>
  );
}
