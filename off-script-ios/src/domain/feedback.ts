import type { AppData } from "../storage/model";
import { activities } from "./content";

type LocalFeedback = AppData["feedback"][number];

export function feedbackMessage(
  feedback: LocalFeedback,
  appVersion: string,
): string {
  const snapshot = feedback.snapshot;
  const ingredientIds = snapshot
    ? Object.values(snapshot.entries)
        .map((entry) => entry.id)
        .filter((id) => /^prompt_[a-z_]+_\d{3,4}$/.test(id))
    : [];
  if (snapshot?.jokeTopic && /^topic_\d{3,4}$/.test(snapshot.jokeTopic.id))
    ingredientIds.push(snapshot.jokeTopic.id);
  return JSON.stringify(
    {
      app: "Off Script",
      appVersion,
      activity:
        ["studio", "catalog", "settings"].includes(feedback.activityId) ||
        activities.some((activity) => activity.id === feedback.activityId)
          ? feedback.activityId
          : "unknown",
      issue: feedback.issue ?? feedback.rating,
      ...(snapshot
        ? {
            contentPackVersion: /^\d+\.\d+\.\d+$/.test(
              snapshot.contentPackVersion,
            )
              ? snapshot.contentPackVersion
              : "unknown",
          }
        : {}),
      ...(ingredientIds.length ? { ingredientIds } : {}),
      ...(feedback.note?.trim() ? { note: feedback.note.trim() } : {}),
    },
    null,
    2,
  );
}
