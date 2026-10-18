import type { Activity, PromptSnapshot } from "./contracts";
import { gamePromptOptions } from "./game-prompts";
export type PlayIntent = "riff" | "practice";
export type Playbook = {
  instruction: string;
  steps: string[];
  example: string;
  riffPick: boolean;
  shortTitle?: string;
};
// Plain-language starting points. Full canonical teaching copy remains available.
export const playbooks: Record<string, Playbook> = {
  P1: {
    instruction:
      "Turn the word into a ridiculous pickup line. Keep it clean; pass whenever you like.",
    steps: [
      "Start with “Are you a…?”",
      "Connect one property of the word to a compliment.",
    ],
    example:
      "Toaster: “Are you a toaster? Because I get nervous when you pop up.”",
    riffPick: true,
  },
  P2: {
    instruction:
      "Adults only: finish “Sex with me is like a [word], because…” with a mild, silly comparison.",
    steps: [
      "Only play if everyone is 18+ and agrees.",
      "Keep it non-explicit. Passing is always fine.",
    ],
    example: "A calendar: “Because I am surprisingly well organized.”",
    riffPick: true,
  },
  P3: {
    instruction:
      "185 of this thing walk into a bar. Give the bartender a terrible pun.",
    steps: [
      "Say “185 [things] walk into a bar…”",
      "Add what the bartender says. Groans count.",
    ],
    example:
      "185 clocks walk into a bar. “Sorry,” says the bartender, “we don’t have time for this.”",
    riffPick: true,
  },
  P4: {
    instruction:
      "Pretend to be the world’s worst person at this job. Show us one disastrous moment.",
    steps: [
      "Use the profession on the card.",
      "Give one line or a tiny demonstration.",
    ],
    example:
      "Worst wedding planner: “I booked your ex as the surprise entertainment.”",
    riffPick: true,
  },
  P5: {
    instruction:
      "Give wildly unhelpful advice for this completely fictional problem.",
    steps: [
      "Start with “You should definitely…”",
      "Keep the bad advice harmless and imaginary.",
    ],
    example:
      "Late for work? “You should definitely arrive wearing a sash that says TOMORROW.”",
    riffPick: true,
  },
  P6: {
    instruction: "What is the one thing you should absolutely never say here?",
    steps: [
      "Picture the place on the card.",
      "Take turns saying the worst possible line.",
    ],
    example:
      "At a pottery class: “Good news: I taste-tested everyone’s bowls.”",
    riffPick: true,
  },
  G1: {
    instruction: "Have a conversation where every line must be a question.",
    steps: [
      "Use the setup on the card.",
      "If someone slips, help them restart. Keep the scene going.",
    ],
    example:
      "“Did you put a tiny sofa in the fridge?” “Where else would the cheese relax?”",
    riffPick: true,
  },
  G2: {
    instruction:
      "2–4 actors play the setup; 1 separate caller taps New Choice! to ring the bell. Replace only the last spoken line.",
    steps: [
      "Caller: hold the device, stay out of character, and tap after a spoken line. Extra people watch.",
      "Speaker: replace only your last line. Everyone keeps the same characters and scene, accepting the newest line as true. No automatic New Choice calls.",
    ],
    example:
      "“I brought flowers.” NEW CHOICE! “I brought a fully assembled garden shed.”",
    riffPick: true,
  },
  G3: {
    instruction:
      "Play the scene. When a new emotion appears, keep the story but change how you feel.",
    steps: [
      "Start with the setup.",
      "Treat each emotion as a new way to play the same moment.",
    ],
    example:
      "Return a borrowed blender with the pride of someone unveiling a monument.",
    riffPick: true,
  },
  G4: {
    instruction:
      "Keep the same scene, but play it in whatever movie or TV style appears.",
    steps: [
      "Keep the people, place and problem.",
      "Only the storytelling style changes.",
    ],
    example:
      "A missing sandwich becomes a detective thriller: “The crumbs don’t lie.”",
    riffPick: true,
  },
  G5: {
    instruction:
      "Freeze a pose. A waiting player takes someone’s place and starts a completely new scene.",
    steps: [
      "Two people begin; the next player calls “Freeze!”",
      "Copy a comfortable pose without touching; seated works. Start a new scene.",
    ],
    example:
      "Hands held high become two people trying to install a ceiling pizza.",
    riffPick: false,
  },
  G6: {
    instruction:
      "One person speaks made-up sounds. The other confidently translates every sentence.",
    steps: [
      "Use invented sounds, never a real accent.",
      "The translator decides what the sounds mean.",
    ],
    example: "“Bloopa shrem!” → “Our new toaster has demanded an office.”",
    riffPick: true,
  },
  G7: {
    instruction:
      "Two people act. A third makes the sound effects. Let the sounds change what happens.",
    steps: [
      "Pick two actors and a separate sound-effects person.",
      "Use sounds or gestures; actors react. Everyone can stay seated.",
    ],
    example:
      "Someone opens a suitcase. It moos. “I see you packed for the countryside.”",
    riffPick: true,
  },
  G8: {
    instruction:
      "One person interviews the world’s leading expert in this very questionable subject.",
    steps: [
      "Ask short questions.",
      "The expert answers as if they know exactly what they are talking about.",
    ],
    example:
      "“How do you train a competitive houseplant?” “We start with very small hurdles.”",
    riffPick: true,
  },
  G9: {
    instruction:
      "Play the scene. Work each surprise line into your next few sentences as naturally as you can.",
    steps: [
      "Start talking from the setup.",
      "Only use the line when it is revealed.",
    ],
    example:
      "At a lost-property desk: “Before we continue, the goose needs a lawyer.”",
    riffPick: true,
  },
  G10: {
    instruction:
      "Play a 60-second scene. Replay the same story in 30, then 15, then 5 seconds.",
    steps: [
      "Keep the same beginning, big moment and ending.",
      "Between replays, tap to start the shorter version.",
    ],
    example:
      "A failed cake delivery becomes a frantic five-second apology and one imaginary cupcake.",
    riffPick: true,
  },
  G11: {
    instruction:
      "Sell this completely unnecessary invention like everyone urgently needs one.",
    steps: [
      "One person demonstrates; the other adds benefits or questions.",
      "Treat its obvious flaws as premium features.",
    ],
    example:
      "“Our silent doorbell finally gives visitors the privacy they deserve.”",
    riffPick: true,
  },
  S1: {
    instruction:
      "Start talking as these people. Give each other something to respond to and see where it goes.",
    steps: [
      "Use as much or as little of the setup as you need.",
      "An ordinary first line is enough.",
    ],
    example: "“You moved the good chair again.” “It needed to see the garden.”",
    riffPick: false,
  },
  S2: {
    instruction:
      "Be these people for a minute. Show how you feel about each other before inventing a big plot.",
    steps: [
      "Start with a small shared task.",
      "Let the relationship show through what you do.",
    ],
    example:
      "Two rival gardeners politely argue over whose tomato gets the sunny seat.",
    riffPick: false,
  },
  S3: {
    instruction:
      "Show who you are, what you are doing, and where you are. Build the scene together.",
    steps: [
      "Make one clear offer.",
      "Your partner adds a detail, rather than restarting the scene.",
    ],
    example:
      "“Dad, hold the trophy while I unlock the bakery.” Three useful facts in one line.",
    riffPick: false,
  },
  S4: {
    instruction:
      "Read your secret privately. Then play the scene while gently trying to get what your character wants.",
    steps: [
      "Only the named player looks at each secret.",
      "Give your partner room to say no and make offers back.",
    ],
    example:
      "You need help moving a plant, but keep pretending you only came over for tea.",
    riffPick: false,
  },
  S5: {
    instruction:
      "Play the scene with one person acting in charge. When the cue comes, reverse who has the power.",
    steps: [
      "Show status through listening, space and small choices.",
      "Keep the same people and situation.",
    ],
    example:
      "The demanding customer discovers the cashier is judging their jam competition.",
    riffPick: false,
  },
  S6: {
    instruction:
      "Make a tiny scene in just three lines: start it, build it, change something.",
    steps: [
      "First line: establish something clear.",
      "Second: accept and add. Third: make the moment matter.",
    ],
    example:
      "“Your dragon ate my shed.” “He thought it was a cracker.” “Then he owes me a very large biscuit.”",
    riffPick: true,
  },
  S7: {
    instruction:
      "Make an ordinary object matter a lot to your character. Let your partner discover why.",
    steps: [
      "Start with a small real task.",
      "Reveal a specific personal reason the object matters.",
    ],
    example:
      "The chipped mug is the only cup that has heard every rehearsal of your wedding speech.",
    riffPick: false,
  },
  S8: {
    instruction:
      "Pick one odd thing your character does. Repeat it, then take it one step further.",
    steps: [
      "Let your partner notice and respond.",
      "Build the same funny idea instead of adding unrelated weirdness.",
    ],
    example:
      "You charge your roommate rent for fridge space. Then you show them the cheese’s private balcony.",
    riffPick: false,
  },
  S9: {
    instruction:
      "Build a room from imaginary objects. Remember where your partner puts things.",
    steps: [
      "Use clear sizes, weights and locations.",
      "Seated gestures work; no contact needed.",
    ],
    example:
      "If the imaginary counter is knee-high, everyone else uses the same knee-high counter.",
    riffPick: false,
  },
  W1: {
    instruction:
      "Start a story together. Accept what came before and add one detail. Saying “Yes, and” is optional.",
    steps: [
      "Start with something simple: “We opened a sandwich shop.”",
      "Accept what came before. Add one thing. You don’t have to be clever.",
    ],
    example:
      "“We opened a sandwich shop.” “Yes, and our first customer is a penguin.” “Yes, and it wants everything on ice.”",
    riffPick: true,
  },
  W2: {
    instruction:
      "Tell one story together, one word per person. Don’t plan your whole sentence.",
    steps: [
      "Add exactly one word.",
      "Pass the turn and listen to what the story becomes.",
    ],
    example: "“Yesterday / my / dentist / adopted / a / submarine.”",
    riffPick: true,
  },
  W3: {
    instruction:
      "Take turns adding one sentence to the same increasingly questionable story.",
    steps: [
      "Use what the last person said.",
      "Add an event, then give someone else a turn.",
    ],
    example: "“The cake arrived early.” “It was driving its own delivery van.”",
    riffPick: true,
  },
  W4: {
    instruction:
      "Take turns adding one sentence: “Fortunately…” then “Unfortunately…”.",
    steps: [
      "Start with the story seed.",
      "Alternate good news and bad news. Keep the same story going.",
    ],
    example:
      "“Fortunately, the raccoon found a venue.” “Unfortunately, it was the bins behind the venue.”",
    riffPick: true,
    shortTitle: "Good news, bad news",
  },
  W5: {
    instruction:
      "One person moves slowly. The others copy them as if they are a mirror.",
    steps: [
      "Seated hands and facial expressions work. No touching.",
      "Switch the leader when you are ready.",
    ],
    example:
      "An imaginary cup slowly gets too heavy to lift. The mirror discovers that at the same time.",
    riffPick: false,
  },
  W6: {
    instruction:
      "Say the first word that connects to the last word. Then pass it on.",
    steps: [
      "A simple connection is enough.",
      "Keep the chain moving; passing is allowed.",
    ],
    example: "“Toast → breakfast → alarm → panic → wedding.”",
    riffPick: true,
  },
  W7: {
    instruction:
      "Try a character using one small physical choice. Let it change how they behave.",
    steps: [
      "Play seated or standing, with no contact.",
      "Try a new choice instead of an imitation of a real group.",
    ],
    example: "Someone who moves as if every floor tile is freshly iced cake.",
    riffPick: false,
  },
  W8: {
    instruction:
      "Repeat a meaningful detail from your partner’s last offer, then add something new.",
    steps: [
      "Show you heard the detail.",
      "Build from it instead of changing the subject.",
    ],
    example:
      "“The goose is late.” “Late again? It promised to bring the wedding rings.”",
    riffPick: false,
  },
  T1: {
    instruction:
      "Remember an event that never happened to either of you. Agree on it and add details.",
    steps: [
      "Use fictional characters, not real personal disclosures.",
      "Treat each new memory as something you both remember.",
    ],
    example:
      "“Remember our lighthouse restaurant?” “We only served things that could be seen from shore.”",
    riffPick: true,
  },
  T2: {
    instruction:
      "One person becomes a character. Everyone else asks them curious, ridiculous questions.",
    steps: [
      "Answer as the character, with confidence.",
      "Switch the person in the hot seat next round.",
    ],
    example:
      "“As the town’s umbrella inspector, what keeps you up at night?” “Horizontal rain.”",
    riffPick: true,
  },
  T3: {
    instruction:
      "One person hosts a party. The guests secretly get silly habits. Can the host guess them?",
    steps: [
      "Guests reveal their quirks privately while the host looks away.",
      "Use words or small seated gestures. The host can accept a clear paraphrase.",
    ],
    example:
      "You give every crisp a formal introduction. “Please welcome the salt-and-vinegar delegation.”",
    riffPick: true,
  },
  T4: {
    instruction:
      "A waiting player swaps into the scene. Keep the same story and everything already established.",
    steps: [
      "Two people begin.",
      "On “Relay,” a new person continues a character in the same scene.",
    ],
    example:
      "The new shopkeeper still remembers that the customer is returning a very suspicious toaster.",
    riffPick: false,
  },
  T5: {
    instruction:
      "Build one frozen group picture. Then each person says what their character is thinking.",
    steps: [
      "Add a seated or standing pose without touching.",
      "Hold the picture, then share one thought each.",
    ],
    example:
      "A very serious committee unveils a statue that is clearly a sandwich.",
    riffPick: false,
  },
};
export function bookFor(a: Activity): Playbook {
  const b = playbooks[a.id];
  if (!b) throw Error(`Missing playbook for ${a.id}`);
  return b;
}
export function instructionFor(
  activity: Activity,
  snapshot: PromptSnapshot,
): string {
  if (activity.id === "S1" && !snapshot.relationship) {
    return snapshot.entries.action
      ? "Start with this action. Invent your own characters and give each other something to respond to."
      : "Invent your own characters. Make a small offer and give each other something to respond to.";
  }
  return bookFor(activity).instruction;
}
export function isRiffPick(a: Activity) {
  return bookFor(a).riffPick;
}
export function riffCategories(a: Activity): Activity["promptCategories"] {
  return gamePromptOptions(a.id, "riff").categories;
}
export const intentLabels: Record<PlayIntent, string> = {
  riff: "Just for fun",
  practice: "Practice skills",
};
export const intentDescriptions: Record<PlayIntent, string> = {
  riff: "Quick, playful prompts and short instructions. No improv experience needed.",
  practice:
    "Grounded scenes and more detailed guidance for trying a specific improv skill.",
};

/** Concise game descriptions for the picker and How to Play. */
export const partyInstruction = (a: { id: string }) =>
  (
    ({
      P1: "Take turns making a pickup line.",
      P2: "Finish ‘Sex with me is like…’ using this word. Anyone can pass.",
      P3: "Take turns finishing the joke. Keep the same word.",
      P4: "Say one thing a terrible person at this job might say.",
      P5: "Give one sentence of ridiculous, harmless advice for this person's problem.",
      P6: "Say something you’d never hear in this place.",
      G1: "Play a scene using questions only. Answer a question with another question.",
      G2: "2–4 actors play a scene. A separate caller taps New Choice! to ring the bell; the last speaker replaces only their last line.",
      G3: "Play a scene. Switch emotions when the app calls a new one.",
      G4: "Play a scene. Switch genres when the app calls a new one.",
      G8: "One expert. One interviewer. Ask about this job; make up the answers.",
      G11: "One presenter. Two inventors. Sell us this object together.",
      S4: "Play the relationship. Keep your secret role to yourself.",
      S6: "Try a tiny scene in three spoken lines: start it, build it, change something.",
      W1: "Take turns accepting the story and adding one detail. Saying ‘Yes, and’ is optional.",
      W2: "Tell one story together, one word per person.",
      W3: "Use this opening line. Take turns adding one sentence to the story.",
      W4: "Go around the group, alternating good and bad developments.",
      W6: "Say the first word this makes you think of. Go around, one word each.",
      W8: "Repeat one detail you just heard, then add a new one. Go around.",
      T1: "Invent a shared memory. Take turns adding details without contradicting each other.",
      T2: "Stay in character and answer questions about this job.",
      W5: "One person moves slowly; the other mirrors. Switch who leads. Seated works too.",
    }) as Record<string, string>
  )[a.id] ?? "Build one idea together. Take turns and pass whenever you like.";

type PartyGuidance = {
  roundLimit: string;
  participation: string;
  finish: string;
};
const partyGuidanceById: Record<string, PartyGuidance> = {
  P1: {
    roundLimit: "1 answer each",
    participation:
      "Players on this card: separate pickup lines using the same word, not one shared story.",
    finish:
      "Keep going with this word, or choose another prompt or Change game whenever you like.",
  },
  P2: {
    roundLimit: "1 answer each",
    participation:
      "Players on this card may offer separate comparisons. Everyone can pass.",
    finish:
      "Keep going with this word, or choose another prompt or Change game whenever you like.",
  },
  P3: {
    roundLimit: "1 answer each",
    participation:
      "Players on this card: a separate punchline, not one shared story.",
    finish:
      "Keep going with this word, or choose another prompt or Change game whenever you like.",
  },
  P4: {
    roundLimit: "1 answer each",
    participation:
      "The reader starts. Everyone gives one separate line or passes, using the same job.",
    finish:
      "Keep going with this job, or choose Another job or Change game whenever you like.",
  },
  P5: {
    roundLimit: "1 answer each",
    participation:
      "Each player on this card gives one short answer or passes. Don't build a story from the last answer.",
    finish:
      "Keep going with more advice, or choose another prompt or Change game whenever you like.",
  },
  P6: {
    roundLimit: "1 answer each",
    participation:
      "Players on this card: separate lines. Each answer stands alone; this is not a scene.",
    finish:
      "Keep going with this place, or choose another prompt or Change game whenever you like.",
  },
  G1: {
    roundLimit: "60 seconds",
    participation: "Named pair: build one scene together, trading questions.",
    finish:
      "Keep playing as long as you like. Choose Another scene or Change game when you want a fresh start.",
  },
  G2: {
    roundLimit: "60 seconds",
    participation:
      "The first named actor starts. Keep the same characters and accept the newest line as true. Caller: hold the device, stay out of the scene, and tap after a line. Extra people watch. Calls are manual.",
    finish:
      "Keep playing as long as you like. Choose Another scene or Change game when you want a fresh start.",
  },
  G3: {
    roundLimit: "60 seconds",
    participation:
      "Named pair: continue the same scene when the emotion changes.",
    finish:
      "Keep playing as long as you like. Choose Another scene or Change game when you want a fresh start.",
  },
  G4: {
    roundLimit: "60 seconds",
    participation:
      "Named pair: continue the same scene when the genre changes.",
    finish:
      "Keep playing as long as you like. Choose Another scene or Change game when you want a fresh start.",
  },
  G8: {
    roundLimit: "60 seconds",
    participation:
      "Named expert: answer. Interviewer: ask follow-up questions.",
    finish:
      "Keep playing as long as you like. Choose Another scene or Change game when you want a fresh start.",
  },
  G11: {
    roundLimit: "60 seconds",
    participation:
      "Presenter: ask questions. Both inventors: demonstrate and add benefits.",
    finish:
      "Keep playing as long as you like. Choose Another scene or Change game when you want a fresh start.",
  },
  S4: {
    roundLimit: "60 seconds",
    participation:
      "Both named players: read privately, then build one scene together.",
    finish:
      "Keep playing as long as you like, keeping goals secret. Choose Another scene or Change game when you want a fresh start.",
  },
  S6: {
    roundLimit: "3 lines total",
    participation: "First named player: line 1. Second: line 2. First: line 3.",
    finish:
      "The third line can be an ending, or keep going. Choose Another scene or Change game when you want a fresh start.",
  },
  W1: {
    roundLimit: "2 turns each",
    participation:
      "The reader starts. Go around adding one detail per turn to the same story.",
    finish:
      "Keep going while the story is flowing. Choose Another story or Change game when you want a fresh start.",
  },
  W2: {
    roundLimit: "1 sentence, up to 12 words",
    participation:
      "The reader gives the first word. Go around, one word each, continuing the same sentence.",
    finish:
      "Keep going with another sentence if you like. Choose Another story or Change game when you want a fresh start.",
  },
  W3: {
    roundLimit: "2 turns each",
    participation:
      "The reader starts with the opening line. Each next player adds one sentence.",
    finish:
      "Keep going while the story is flowing. Choose Another story or Change game when you want a fresh start.",
  },
  W4: {
    roundLimit: "2 turns each",
    participation:
      "The reader starts with Fortunately. Go around, one sentence each, alternating Unfortunately and Fortunately in the same story.",
    finish:
      "Keep going while the story is flowing. Choose Another story or Change game when you want a fresh start.",
  },
  W6: {
    roundLimit: "2 turns each",
    participation:
      "The reader gives the first association. Go around connecting to the last word spoken, not the original card.",
    finish:
      "Keep going with the associations. Choose Another word or Change game when you want a fresh start.",
  },
  W8: {
    roundLimit: "2 turns each",
    participation:
      "The reader makes one offer. Go around: echo a detail from the previous speaker, then build on it.",
    finish:
      "Keep going with the same idea. Choose Another prompt or Change game when you want a fresh start.",
  },
  T1: {
    roundLimit: "60 seconds",
    participation: "Named pair: take turns adding to the same made-up memory.",
    finish:
      "Keep playing as long as you like. Choose Another scene or Change game when you want a fresh start.",
  },
  T2: {
    roundLimit: "3 questions total",
    participation: "Named player: answer. Everyone else: ask short questions.",
    finish:
      "Keep going with more questions. Choose Another character or Change game when you want a fresh start.",
  },
  W5: {
    roundLimit: "3 moves per leader",
    participation:
      "First named player leads 3 slow movements; the other copies. Then swap.",
    finish:
      "Keep going, swapping the leader when you like. Choose Restart moves or Change game when you want a fresh start.",
  },
};
export function partyGuidance(a: { id: string }): PartyGuidance {
  const guidance = partyGuidanceById[a.id];
  if (!guidance) throw Error(`Missing Party instructions for ${a.id}`);
  return guidance;
}
