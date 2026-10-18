import { topics } from "./content";
import type { PromptSnapshot } from "./contracts";

export const isQuickGame = (id: string) => /^P[1-6]$/.test(id);

function nounPhrase(word: string): string {
  const value = word.trim();
  if (/^binoculars?$/i.test(value)) return "a pair of binoculars";
  if (/^(a|an|the)\s/i.test(value)) return value;
  const article =
    /^(hour|honest|heir)/i.test(value) ||
    (/^[aeiou]/i.test(value) &&
      !/^(uni([^nmd]|$)|user|use|euro|one\b)/i.test(value))
      ? "an"
      : "a";
  return `${article} ${value}`;
}

export function responseStarter(
  activityId: string,
  snapshot: PromptSnapshot,
): string {
  const word = snapshot.jokeTopic?.word ?? "word";
  switch (activityId) {
    case "P1":
      return `Are you ${nounPhrase(word)}? Because…`;
    case "P2":
      return `Sex with me is like ${nounPhrase(word)} because…`;
    case "P3": {
      const topic = topics.find(
        (topic) => topic.id === snapshot.jokeTopic?.id && topic.word === word,
      );
      const plural =
        topic?.plural ??
        (/^binoculars?$/i.test(word) ? "pairs of binoculars" : `${word}s`);
      return `185 ${plural} walk into a bar. The bartender says…`;
    }
    case "P4":
      return `Hi, I'm your ${(snapshot.entries.profession?.text ?? "professional").toLowerCase()}, and…`;
    case "P5":
      return "You should…";
    case "P6":
      return "The one thing you should never say here is…";
    default:
      throw Error(
        `This game does not use a quick-response starter: ${activityId}`,
      );
  }
}

export function promptActionLabel(activityId: string): string {
  if (["P1", "P2", "P3"].includes(activityId)) return "Another word";
  if (activityId === "P4") return "Another job";
  if (activityId === "P6") return "Another place";
  return "Another prompt";
}
