import { activityById, advicePrompts, prompts, type Category } from "./content";
import type { PromptEntry } from "./contracts";

const minimal: Record<string, Category[]> = {
  P1: [],
  P2: [],
  P3: [],
  P4: ["profession"],
  P5: ["situation"],
  P6: ["location"],
  G1: ["relationship"],
  G2: ["relationship"],
  G3: ["relationship", "emotion"],
  G4: ["location", "genre"],
  G5: ["action", "location"],
  G6: ["profession"],
  G7: ["location", "action"],
  G8: ["profession"],
  G9: ["opening_line", "relationship"],
  G10: ["relationship", "situation"],
  G11: ["object"],
  S1: ["relationship", "location"],
  S2: ["relationship"],
  S3: ["relationship", "action", "location"],
  S4: ["relationship"],
  S5: ["relationship"],
  S6: ["relationship"],
  S7: ["action", "object"],
  S8: ["relationship", "situation"],
  S9: ["location", "object"],
  W1: ["situation"],
  W2: [],
  W3: ["opening_line"],
  W4: ["situation"],
  W5: [],
  W6: ["object"],
  W7: ["action"],
  W8: ["relationship"],
  T1: ["relationship"],
  T2: ["profession"],
  T3: ["role"],
  T4: ["relationship", "location"],
  T5: ["action"],
};
const definingInputs: Record<string, Category[]> = {
  P1: [],
  P2: [],
  P3: [],
  P4: ["profession"],
  P5: ["situation"],
  W2: [],
  W3: ["opening_line"],
  W5: [],
  W6: ["object"],
  W7: ["action"],
  S3: ["relationship", "action", "location"],
  S7: ["action", "object"],
};

/** Task suitability is separate from Studio flavor and never removes canonical content. */
export function gamePromptOptions(
  activityId: string,
  intent: "riff" | "practice",
  level: "clean" | "spicy" | "18_plus" = "clean",
): {
  categories: Category[];
  pool: PromptEntry[];
  flavor: "grounded" | "playful";
} {
  const activity = activityById(activityId);
  const categories = [
    ...(definingInputs[activityId] ??
      (intent === "riff" ? minimal[activityId] : activity.promptCategories)),
  ];
  if (
    level !== "clean" &&
    ["G2", "T1"].includes(activityId) &&
    !categories.includes("situation")
  )
    categories.push("situation");
  const rating =
    level === "clean"
      ? "clean"
      : level === "spicy"
        ? "spicy"
        : "mature_suggestive";
  const pool = (activityId === "P5" ? advicePrompts : prompts).filter(
    (entry) => {
      if (!categories.includes(entry.category)) return false;
      if (
        entry.contentRating !== "clean" &&
        (level === "clean" ||
          (entry.contentRating === "mature_suggestive" && level !== "18_plus"))
      )
        return false;
      if (activityId === "P4")
        return (
          entry.tags.includes("familiar_profession") ||
          entry.contentRating !== "clean"
        );
      if (activityId === "P5")
        return (
          entry.tags.includes("party_advice") && entry.contentRating === rating
        );
      if (activityId === "W6") return entry.tags.includes("association_seed");
      if (activityId === "W7") return entry.tags.includes("character_walk");
      if (activityId === "S7")
        return entry.tags.includes(
          entry.category === "action" ? "mundane_action" : "association_seed",
        );
      if (activityId === "G3" && entry.category === "emotion")
        return entry.tags.includes("beginner_emotion");
      return true;
    },
  );
  return {
    categories,
    pool,
    flavor: intent === "riff" ? "playful" : "grounded",
  };
}
