# Yes, And, free play and named players

The simple **Yes, And** game is W1 (formerly “Yes-And Ladder”), with its original ID and teaching notes preserved. It now appears directly below the main Home action, first in Just Riff's library, and in casual surprise selection. Plain-language instructions and an original sandwich-shop/penguin example introduce the game. Its Home shortcut opens setup with free play selected.

Setup always shows a name field for every player. First names or nicknames are required to start; whitespace-only entries do not count. Adding a player adds a required field. Names and the chosen play flow are remembered locally and shown for confirmation on future starts. Home's main action always opens setup so returning groups can review names and their play option. Existing imported/saved sessions retain their original names and remain readable.

**Free play** has no countdown, automatic cues, scoring break, round number or round-complete screen. Take turns naturally or use named turn controls. Pause/resume, manual cues, changing prompts and secret handoffs remain available. “Change game” opens a compatible clean-content-aware picker and keeps the roster; “Done playing” returns to Home. Free games stay free through reload and background pause. The session engine uses its existing persisted game records internally, but those records do not impose round transitions on players.

**Rounds** retains timed game reminders, reviews, replay and optional scores. Half-Life requires rounds because its 60/30/15/5-second replays are intrinsic to the game; it is excluded from the free-play picker and surprise pool.

Session settings add `playFlow`, defaulting to `rounds` when reading older data. Preferences add defaulted `lastPlayerNames` and `lastPlayFlow`. Both contract copies are updated; no storage reset or SQL migration is required. Native aggregate/session-settings JSON and web IndexedDB preserve the new values.

Validation covers all eligible free-play games running for five minutes without countdown/cues/end, manual cue operation, old-session migration, names, reload/resume, game changes, return to named rounds, and both public and local setup flows. Existing round-based browser scenarios explicitly select Rounds and name their players.
