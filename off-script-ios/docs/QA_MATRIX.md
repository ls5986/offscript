# OFF SCRIPT — ALL 39 GAME ACCEPTANCE MATRIX

Each of these must pass an offline end-to-end round test. A static instruction card is not sufficient.

| ID | Activity | Min people | Mechanics to validate |
| --- | --- | ---: | --- |
| P1 | Pickup Lines | 2 | rapid_fire; player rotation, instructions, completion, replay |
| P2 | Sex With Me Is Like | 2 | 18+ opt-in and clean-class exclusion |
| P3 | 185 Walk Into a Bar | 2 | Singular/plural-compatible joke noun |
| P4 | World's Worst | 2 | rapid_fire; player rotation, instructions, completion, replay |
| P5 | Terrible Advice | 2 | rapid_fire; player rotation, instructions, completion, replay |
| P6 | Never Say That | 2 | rapid_fire; player rotation, instructions, completion, replay |
| G1 | Questions Only | 2 | scene_open; player rotation, instructions, completion, replay |
| G2 | New Choice | 2 | Automatic and manual NEW CHOICE cue; visual fallbacks |
| G3 | Emotion Remote | 2 | Emotion changes using emotion bank |
| G4 | Genre Remote | 2 | Genre changes using genre bank |
| G5 | Freeze & Replace | 3 | Freeze -> newcomer starts new scene; no touch assumption |
| G6 | Gibberish Translator | 2 | interview; player rotation, instructions, completion, replay |
| G7 | Sound Effects | 3 | Two actors + distinct Foley player |
| G8 | Expert Interview | 2 | interview; player rotation, instructions, completion, replay |
| G9 | Surprise Line | 2 | Surprise line only revealed on cue |
| G10 | Half-Life | 2 | 60/30/15/5 timer sequence and replay controls |
| G11 | Ridiculous Infomercial | 2 | interview; player rotation, instructions, completion, replay |
| S1 | Open Scene | 2 | Prompt Studio handoff with zero or many categories |
| S2 | Relationship First | 2 | scene_open; player rotation, instructions, completion, replay |
| S3 | Who, What, Where | 2 | scene_open; player rotation, instructions, completion, replay |
| S4 | Secret Objective | 2 | One secret objective per performer; safe private reveal |
| S5 | Status Shift | 2 | scene_cued; player rotation, instructions, completion, replay |
| S6 | Three-Line Scene | 2 | short_challenge; player rotation, instructions, completion, replay |
| S7 | Make the Mundane Matter | 2 | scene_open; player rotation, instructions, completion, replay |
| S8 | Heighten the Pattern | 2 | scene_open; player rotation, instructions, completion, replay |
| S9 | Invisible World | 2 | movement; player rotation, instructions, completion, replay |
| W1 | Yes-And Ladder | 2 | story_turn; player rotation, instructions, completion, replay |
| W2 | Word-at-a-Time Story | 2 | story_turn; player rotation, instructions, completion, replay |
| W3 | Sentence Chain | 2 | story_turn; player rotation, instructions, completion, replay |
| W4 | Fortunately / Unfortunately | 2 | story_turn; player rotation, instructions, completion, replay |
| W5 | Mirror | 2 | Seated mirror variant |
| W6 | Association Chain | 2 | story_turn; player rotation, instructions, completion, replay |
| W7 | Character Walk | 2 | Seated character-movement variant |
| W8 | Listening Echo | 2 | story_turn; player rotation, instructions, completion, replay |
| T1 | Invented Shared History | 2 | scene_open; player rotation, instructions, completion, replay |
| T2 | Character Hot Seat | 2 | hot_seat; player rotation, instructions, completion, replay |
| T3 | Party Quirks | 3 | One host + private guest quirks and reveal screen |
| T4 | Scene Relay | 3 | Substitute performer preserves scene reality |
| T5 | Group Statue | 3 | Seated group statue variant |

## Shared checks

Every catalog game: direct open from Explore; supported selected mode; correct number of stage/support participants; prompt loaded offline; start/finish; skip; new prompt when supported; favorite; short guide; original example; coaching; complete without an account or connection.

For Surprise Me, validate catalog eligibility and fair participant selection across many seeded sessions. For a Just Us run, confirm no required third facilitator.


## Cross-platform web acceptance (required for v1)

- [ ] Expo `npm run web` loads Home; no blank web screen or fatal console errors.
- [ ] `npm run build:web` succeeds and the exported version is playable.
- [ ] Playwright exercises 2-person Surprise Me and 6-person multi-round play.
- [ ] Every one of the 39 games uses real shared catalog/engines and can run in browser.
- [ ] Studio category toggles, lock/reroll, save and Scene Lab handoff work in browser.
- [ ] Actual browser persistence survives refresh/close: players, sessions, favorites and prompts.
- [ ] Web voice cue failure or muted browser does not block a 2-person round.
- [ ] Private roles re-cover on tab background and never leak into a public recap.
- [ ] Phone, tablet, desktop sizes and keyboard focus have been tested.
- [ ] Browser screenshots, E2E output and live URL (if actually deployed) are recorded.

See `docs/WEB_PREVIEW.md`; never pass the project solely on native or screenshots.
