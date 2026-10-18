import { advicePrompts } from "./content";
import type { PromptSnapshot } from "./contracts";
import expansion from "../content/v2/party-advice-expansion.json";

type AdviceRequest = { question: string; example: string };
export const adviceRequests: Record<string, AdviceRequest> = {
  ...Object.fromEntries(
    expansion.map(({ id, question, example }) => [id, { question, example }]),
  ),
  prompt_situation_2050: {
    question: "How do I get my roommate to stop labeling everything?",
    example: "You should label the label maker as a forbidden object.",
  },
  prompt_situation_2051: {
    question: "How should I handle my next conversation with my boss?",
    example:
      "You should start signing every email 'Your favorite office relative.'",
  },
  prompt_situation_2052: {
    question: "How do I get my neighbor to stop reviewing my parking?",
    example: "You should send them a review of their reviewing technique.",
  },
  prompt_situation_2053: {
    question: "What should I bring instead of the homemade cake I promised?",
    example:
      "You should bring a drawing of a cake and call it the low-calorie edition.",
  },
  prompt_situation_2054: {
    question: "How do I get my friend to stop copying my personality?",
    example:
      "You should release your personality only as expensive monthly updates.",
  },
  prompt_situation_2055: {
    question: "How do I live down the embarrassment?",
    example:
      "You should tell everyone you're scouting for the national clapping team.",
  },
  prompt_situation_2056: {
    question: "How do I play it cool after waving at the wrong person?",
    example:
      "You should announce that you were conducting an invisible orchestra.",
  },
  prompt_situation_2057: {
    question: "How do I plan a surprise party for someone who hates surprises?",
    example:
      "You should surprise them with a three-hour presentation about the surprise.",
  },
  prompt_situation_2058: {
    question: "How do I handle two birthday dinners on the same night?",
    example: "You should send a cardboard version of yourself to one dinner.",
  },
  prompt_situation_2059: {
    question: "How do I fix using the wrong name for a whole year?",
    example: "You should give everyone a new name so nobody feels singled out.",
  },
  prompt_situation_2060: {
    question: "How do I win back my dog's affection?",
    example:
      "You should submit a formal application for the role of favorite human.",
  },
  prompt_situation_2061: {
    question: "What do I say at book club when I haven't read the book?",
    example: "You should insist the blank pages were the most moving part.",
  },
  prompt_situation_2062: {
    question: "How do I get my parents to stop those comments?",
    example: "You should include an official cast list with every photo.",
  },
  prompt_situation_2063: {
    question: "How do I tell them I'm not doing the marathon?",
    example:
      "You should explain that you already completed it in a very convincing dream.",
  },
  prompt_situation_2064: {
    question: "How do I avoid being put in charge of the next outing?",
    example:
      "You should propose an outing with a 400-slide planning presentation.",
  },
  prompt_situation_2065: {
    question: "How do I get through a meeting when I've forgotten its purpose?",
    example:
      "You should announce a brainstorming session about why the meeting exists.",
  },
  prompt_situation_2066: {
    question: "How should I respond to the request for a reference?",
    example:
      "You should provide a glowing reference from your imaginary ex, the moon.",
  },
  prompt_situation_2067: {
    question: "What do I say to my friend about this match?",
    example: "You should deliver the news as a dramatic weather forecast.",
  },
  prompt_situation_2068: {
    question: "How do I explain the flirty text to the group?",
    example:
      "You should announce that all future group messages will include romance.",
  },
  prompt_situation_2069: {
    question: "How do I make dinner at that restaurant less awkward?",
    example: "You should negotiate custody of the bread basket in advance.",
  },
  prompt_situation_2070: {
    question: "How do I get out of the plan I didn't mean to make?",
    example:
      "You should send a stunt double whose only skill is canceling plans.",
  },
  prompt_situation_2071: {
    question: "How do I get my date to stop treating us like a brand?",
    example: "You should request a quarterly performance review of the date.",
  },
  prompt_situation_2072: {
    question: "How do I get an actual conversation instead of a thumbs-up?",
    example: "You should reply with a detailed biography of your thumb.",
  },
  prompt_situation_2073: {
    question: "How do I make my carefully planned date seem spontaneous?",
    example:
      "You should distribute a printed schedule of the spontaneous moments.",
  },
  prompt_situation_2074: {
    question: "How do I make it clear that I'm flirting, not networking?",
    example:
      "You should hand over a business card that just says ROMANCE DEPARTMENT.",
  },
  prompt_situation_2075: {
    question: "What title should I give this relationship?",
    example:
      "You should appoint them Assistant Regional Director of Occasional Texting.",
  },
  prompt_situation_2076: {
    question: "How do I respond to my date rating the evening?",
    example: "You should request a second judge and a ceremonial scorecard.",
  },
  prompt_situation_2077: {
    question: "How do I get my friend to stop editing my dating profile?",
    example:
      "You should give them a fictional dating profile for your houseplant instead.",
  },
};
export const missingAdviceContext =
  "This saved prompt doesn't include an advice request. Tap Next Card for a new, complete card.";

export function adviceFor(snapshot: PromptSnapshot): AdviceRequest | null {
  const entry = snapshot.entries.situation;
  const source = entry && advicePrompts.find((prompt) => prompt.id === entry.id);
  return source && source.text === entry.text
    ? (adviceRequests[source.id] ?? null)
    : null;
}
