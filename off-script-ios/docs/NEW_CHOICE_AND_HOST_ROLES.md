# New Choice and human support roles

## New Choice

New Choice requires **at least three people**:

- **2-4 actors** play the scene.
- **One separate caller** operates the phone and does not play a character.
- Extra people watch this round and can be assigned in a later round.

The supported group remains 3-12 total people. A group of three uses two actors
and one caller; larger groups can use up to four actors plus the caller. The
caller is stored as a supporting player, not silently added to the fictional
relationship's character assignments.

### What each person does

1. Read the scene prompt and the named actor/caller assignments.
2. The actors begin an ordinary conversation as their characters.
3. The caller taps **New Choice** after an actor has said a line they want changed.
4. The button plays the bundled bell and shows a visible NEW CHOICE cue.
5. The last speaker replaces **only their last spoken line** with something different.
6. Everyone accepts that replacement as the current reality and continues the same scene.

This does not restart the scene, replace a different player's line, or require
the actors to tap after every sentence. The caller chooses useful moments;
New Choice never schedules automatic interruptions.

The first named actor starts. The caller can let the conversation develop rather
than pressing the button constantly. A short round/timer provides an ending
guide; the group deliberately chooses another scene or changes the game.

### Bell and accessibility

The bell is an original, bundled WAV played by SDK-matched `expo-audio`.
It is actual audio, not a spoken substitute or haptic-only cue. The manual
button's bell is independent from optional spoken automatic cues.

Device volume, audio output and platform behavior still affect what is heard.
The visual cue remains available, and playback failures are surfaced rather
than treated as a successful audible cue. The audio implementation is playback
only: no microphone, recording or background-audio permission was introduced.

Browser tests verify the served WAV header/asset and actual playback/progress
events. This does not substitute for hearing the bell on a rebuilt physical
iPhone. Adding a native module requires rebuilding an installed development app;
a Hermes export alone does not install it.

### Compatibility

New two-person sessions cannot select New Choice, and its catalog entry is not
listed as a two-player game. Older captured scenes remain readable without
rewriting their prompt text or creating a fake third player. A legacy scene
without a valid caller cannot resume as if a complete cast were present: add a
caller/recast or choose another game.

Passing or sitting out the caller must invalidate the scene even if four actors
remain. Total headcount is not proof that all required roles are filled.

## Other games: moderator versus participant

Not every extra role is a moderator, and not every cue game requires an extra
person. These distinctions should remain explicit:

| Game | Actual human roles | Separate moderator required? |
| --- | --- | --- |
| New Choice | 2-4 actors + one caller | **Yes: caller**, minimum 3 total |
| Party Quirks | Guessing host + at least two secret guests | **Yes: guessing host**, minimum 3; the host is part of the game |
| Sound Effects | Two actors + one sound-effects performer | Third participant required, but their job is sound effects rather than moderation |
| Expert Interview | Expert + interviewer | No extra moderator; the interviewer is the second participant |
| Gibberish Translator | Speaker + translator | No extra moderator; the translator is the second participant |
| Freeze & Replace | Two actors and a waiting replacement | At least 3 total; a dedicated fourth moderator is not required |
| Scene Relay | Current actors and waiting replacement(s) | At least 3 total; app/manual rotation can handle timing |
| Emotion Remote / Genre Remote | Named actors; phone supplies changes or a human can operate manual controls | Human cue caller can help, but is optional rather than a hidden required third participant |
| Surprise Line | Actors incorporating revealed text | Optional reader/caller; app reveal supports the activity |
| Half-Life | Actors replaying the same scene | App manages segment readiness/countdowns; no extra moderator required |
| Questions Only | Two actors helping each other maintain the question rule | No required moderator; a statement can be rephrased and play continued |
| Secret Objective | Actors with private character goals | No external guesser/moderator required; private phone handoff stays protected |
| Group Statue | Group making a still image and sharing thoughts | A reader can lead phases; no additional person outside the group is inherently required |

Do not infer that a game works with two people merely because only two people
act. Also do not add a mandatory moderator to every scene to match New Choice.
The required role, opener, cue ownership and end action should be visible for
the activity that is actually being played.
