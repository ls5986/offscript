# Off Script — Prompts, Games, and Setup
Application 1.3.0 · Content pack 2.3.0 · Exported 2026-10-16
Live: https://off-script-play.lindsey08092.chatgpt.site
This is the current bundled, authored content inventory. Prompts are selected locally; no runtime AI generates material.

## How the app is set up
- Party Night: Start Party Night → 2–12 people → optional names → Deal first card → continuous hosted cards. Clean and seated with no sound by default. The balanced deck mixes quick cards with occasional short scenes; secret-role games remain manually selectable. Returning groups start a fresh deck in one tap. Next, Skip, Replay, New Prompt, fair turns, optional cues/timers, passes, editable players, team turns, Large Display, sit-out/rejoin, saves and resume.
- Prompt Studio: choose any of 10 pure ingredient categories. One category stays ingredient-only; multiple categories use deterministic scene composition. Exact ingredients, locks and source versions are stored separately. Connected uses curated links/domains; Mix Freely selects independently. Extra details remain separate when composition would be awkward.
- Explore Games: all 39 formats, quick picks, focused practice, Just Us, free play and rounds. Names are optional in every setup. Remembered compatible groups and Studio handoffs skip repeated setup.
- Saved: shared favorites, exact prompts, presets and sessions. All progress stays in this browser/device (IndexedDB web, SQLite native). Feedback is local and exportable across Party Night, individual games and Studio. No cloud backup or account.
- Content levels: default generation is Clean. Spicy recipes add cheeky adult situations; 18+ recipes require affirmative confirmation for the group. Classroom overrides content levels. Ingredient categories are not copied into separate adult databases.
Totals: 39 activities, 1182 ingredients, 96 relationship templates, 160 joke words, 60 secret goals, 40 quirks, 463 preserved original combinations, 31 party recipes.

## Game → prompt mapping
| ID | Game | Engine | Full categories | Casual categories | Party recipes |
|---|---|---|---|---|---|

| P1 | Pickup Lines | rapid_fire | object | object | p1_clean (clean) |

| P2 | Sex With Me Is Like | rapid_fire | object | object | p2_adult (18_plus) |

| P3 | 185 Walk Into a Bar | rapid_fire | object, profession | object, profession | p3_clean (clean) |

| P4 | World's Worst | rapid_fire | profession, situation | profession, situation | p4_clean (clean), p4_spicy (spicy) |

| P5 | Terrible Advice | rapid_fire | situation | situation | p5_clean (clean), p5_spicy (spicy) |

| P6 | Never Say That | rapid_fire | location, situation | location, situation | p6_clean (clean), p6_spicy (spicy) |

| G1 | Questions Only | scene_open | relationship, location | relationship | g1_clean (clean) |

| G2 | New Choice | scene_cued | relationship, location, situation | relationship | g2_clean (clean), g2_spicy (spicy) |

| G3 | Emotion Remote | scene_cued | relationship, location, emotion | relationship | g3_clean (clean) |

| G4 | Genre Remote | scene_cued | location, situation, genre | location | g4_clean (clean) |

| G5 | Freeze & Replace | scene_rotation | action, location | action | Explore only |

| G6 | Gibberish Translator | interview | profession, situation | profession | Explore only |

| G7 | Sound Effects | scene_open | location, action, situation | location | Explore only |

| G8 | Expert Interview | interview | profession, object, situation | profession | g8_clean (clean), g8_spicy (spicy) |

| G9 | Surprise Line | scene_cued | opening_line, relationship, location | relationship | Explore only |

| G10 | Half-Life | scene_cued | situation, relationship | relationship | Explore only |

| G11 | Ridiculous Infomercial | interview | object, profession | object | g11_clean (clean) |

| S1 | Open Scene | scene_open | relationship, location, situation | relationship | Explore only |

| S2 | Relationship First | scene_open | relationship | relationship | Explore only |

| S3 | Who, What, Where | scene_open | relationship, role, location, action | relationship | Explore only |

| S4 | Secret Objective | role_reveal | relationship, situation, action | relationship | s4_clean (clean) |

| S5 | Status Shift | scene_cued | relationship, profession | relationship | Explore only |

| S6 | Three-Line Scene | short_challenge | relationship, location | relationship | s6_clean (clean) |

| S7 | Make the Mundane Matter | scene_open | action, object, relationship | relationship | Explore only |

| S8 | Heighten the Pattern | scene_open | relationship, situation | relationship | Explore only |

| S9 | Invisible World | movement | location, action, object | location | Explore only |

| W1 | Yes, And | story_turn | situation | situation | w1_clean (clean), w1_spicy (spicy) |

| W2 | Word-at-a-Time Story | story_turn | none | situation | w2_clean (clean) |

| W3 | Sentence Chain | story_turn | opening_line, situation | situation | w3_clean (clean) |

| W4 | Fortunately / Unfortunately | story_turn | situation | situation | w4_clean (clean), w4_spicy (spicy) |

| W5 | Mirror | movement | none | none | w5_clean (clean) |

| W6 | Association Chain | story_turn | object | object | w6_clean (clean) |

| W7 | Character Walk | movement | role, emotion, action | role | Explore only |

| W8 | Listening Echo | story_turn | relationship, situation | situation | w8_clean (clean) |

| T1 | Invented Shared History | scene_open | relationship, situation | relationship | t1_clean (clean), t1_spicy (spicy) |

| T2 | Character Hot Seat | hot_seat | role, profession, emotion | profession | t2_clean (clean) |

| T3 | Party Quirks | role_reveal | role, emotion, situation | role | Explore only |

| T4 | Scene Relay | scene_rotation | relationship, location, situation | relationship | Explore only |

| T5 | Group Statue | movement | location, situation, action | location | Explore only |

Rapid-fire P1/P2/P3 use jokeTopic words rather than a full scene. P4 uses a profession; P5 a situation; P6 a location. Party recipes explicitly request their category subsets below. Secret games add private goals/quirks from their corresponding banks.

## Party card recipes
| Recipe | Activity | Participation | Creative inputs | Duration | Level |
|---|---|---|---|---|---|

| p1_clean v1 | P1 | ALL_PLAY; everyone | joke word  | untimed | clean |

| p3_clean v1 | P3 | ALL_PLAY; everyone | joke word  | untimed | clean |

| p4_clean v1 | P4 | SINGLE_PLAYER; 1 | profession  | untimed | clean |

| p5_clean v1 | P5 | OPEN_MIC; everyone | situation (curated party situations) | untimed | clean |

| p6_clean v1 | P6 | OPEN_MIC; everyone | location  | untimed | clean |

| g1_clean v1 | G1 | TIMED_SCENE; 2 | relationship  | 60s, optional | clean |

| g2_clean v1 | G2 | CUED_SCENE; 2 | relationship  | 60s, optional | clean |

| g3_clean v1 | G3 | CUED_SCENE; 2 | relationship, emotion  | 60s, optional | clean |

| g4_clean v1 | G4 | CUED_SCENE; 2 | location, genre  | 60s, optional | clean |

| g8_clean v1 | G8 | PAIR; 2 | profession  | 60s, optional | clean |

| g11_clean v1 | G11 | SMALL_GROUP; 3 | object  | 60s, optional | clean |

| s4_clean v1 | S4 | PRIVATE_ROLE; 2 | relationship  | 60s, optional | clean |

| s6_clean v1 | S6 | PAIR; 2 | relationship  | untimed | clean |

| w1_clean v1 | W1 | TURN_BASED; everyone | situation (curated party situations) | untimed | clean |

| w2_clean v1 | W2 | TURN_BASED; everyone | open  | untimed | clean |

| w3_clean v1 | W3 | TURN_BASED; everyone | opening_line  | untimed | clean |

| w4_clean v1 | W4 | TURN_BASED; everyone | situation (curated party situations) | untimed | clean |

| w6_clean v1 | W6 | TURN_BASED; everyone | object  | untimed | clean |

| w8_clean v1 | W8 | TURN_BASED; everyone | relationship  | untimed | clean |

| t1_clean v1 | T1 | PAIR; 2 | relationship  | 60s, optional | clean |

| t2_clean v1 | T2 | SINGLE_PLAYER; 1 | profession  | untimed | clean |

| w5_clean v1 | W5 | PAIR; 2 | open  | untimed | clean |

| p5_spicy v1 | P5 | OPEN_MIC; everyone | situation (curated party situations) | untimed | spicy |

| w1_spicy v1 | W1 | TURN_BASED; everyone | situation (curated party situations) | untimed | spicy |

| w4_spicy v1 | W4 | TURN_BASED; everyone | situation (curated party situations) | untimed | spicy |

| g2_spicy v1 | G2 | CUED_SCENE; 2 | relationship, situation (curated party situations) | 60s, optional | spicy |

| t1_spicy v1 | T1 | PAIR; 2 | relationship, situation (curated party situations) | 60s, optional | spicy |

| p4_spicy v1 | P4 | SINGLE_PLAYER; 1 | profession  | untimed | spicy |

| p6_spicy v1 | P6 | OPEN_MIC; everyone | location  | untimed | spicy |

| g8_spicy v1 | G8 | PAIR; 2 | profession  | 60s, optional | spicy |

| p2_adult v1 | P2 | ALL_PLAY; everyone | joke word  | untimed | 18_plus |

## All ingredient prompts

### Relationship (96)

- **prompt_relationship_001** v2 · grounded · clean · 2–2 performers: Two adult siblings

- **prompt_relationship_002** v3 · grounded · clean · 2–2 performers: Former teammates

- **prompt_relationship_003** v2 · grounded · clean · 2–2 performers: Longtime neighbors

- **prompt_relationship_004** v2 · grounded · clean · 2–2 performers: Old classmates

- **prompt_relationship_005** v2 · grounded · clean · 2–2 performers: A mentor and former apprentice

- **prompt_relationship_006** v2 · grounded · clean · 2–2 performers: Two cousins

- **prompt_relationship_007** v2 · grounded · clean · 2–2 performers: Former roommates

- **prompt_relationship_008** v2 · grounded · clean · 2–2 performers: A shop owner and a customer

- **prompt_relationship_009** v2 · grounded · clean · 2–2 performers: Two pen pals

- **prompt_relationship_010** v2 · grounded · clean · 2–2 performers: A ferry captain and a regular passenger

- **prompt_relationship_011** v2 · grounded · clean · 2–2 performers: A librarian and their replacement

- **prompt_relationship_012** v2 · grounded · clean · 2–2 performers: Two longtime friends

- **prompt_relationship_013** v2 · grounded · clean · 2–2 performers: A baker and a customer

- **prompt_relationship_014** v2 · grounded · clean · 2–2 performers: Two rival gardeners

- **prompt_relationship_015** v2 · grounded · clean · 2–2 performers: An artist and a model

- **prompt_relationship_016** v2 · grounded · clean · 2–2 performers: Two co-founders

- **prompt_relationship_017** v2 · grounded · clean · 2–2 performers: An adult child and a parent

- **prompt_relationship_018** v2 · grounded · clean · 2–2 performers: A tour guide and a local resident

- **prompt_relationship_019** v2 · grounded · clean · 2–2 performers: Two former bandmates

- **prompt_relationship_020** v2 · grounded · clean · 2–2 performers: A wedding planner and a member of the wedding party

- **prompt_relationship_021** v2 · grounded · clean · 2–2 performers: Two volunteers

- **prompt_relationship_022** v2 · grounded · clean · 2–2 performers: A museum curator and a donor

- **prompt_relationship_023** v2 · grounded · clean · 2–2 performers: Two longtime chess opponents

- **prompt_relationship_024** v2 · grounded · clean · 2–2 performers: A tenant and a caretaker

- **prompt_relationship_025** v2 · grounded · clean · 2–2 performers: Two friends

- **prompt_relationship_026** v2 · grounded · clean · 2–2 performers: An inventor and a tester

- **prompt_relationship_027** v2 · grounded · clean · 2–2 performers: A radio host and their childhood friend

- **prompt_relationship_028** v2 · grounded · clean · 2–2 performers: Two regular train passengers

- **prompt_relationship_029** v2 · grounded · clean · 2–2 performers: A newcomer and a neighborhood greeter

- **prompt_relationship_030** v2 · grounded · clean · 2–2 performers: Two siblings

- **prompt_relationship_031** v2 · grounded · clean · 3–3 performers: Three former roommates

- **prompt_relationship_032** v2 · grounded · clean · 3–3 performers: Three adult cousins

- **prompt_relationship_033** v2 · grounded · clean · 3–3 performers: Three former teammates

- **prompt_relationship_034** v2 · grounded · clean · 3–3 performers: Three co-owners

- **prompt_relationship_035** v2 · grounded · clean · 3–3 performers: Three old friends

- **prompt_relationship_036** v2 · grounded · clean · 3–3 performers: Three neighbors

- **prompt_relationship_037** v2 · grounded · clean · 3–3 performers: Three club founders

- **prompt_relationship_038** v2 · grounded · clean · 3–3 performers: Three siblings

- **prompt_relationship_039** v2 · grounded · clean · 3–3 performers: Three tour guides

- **prompt_relationship_040** v2 · grounded · clean · 3–3 performers: Three fellow performers

- **prompt_relationship_041** v2 · grounded · clean · 4–12 performers: Members of a neighborhood theater board

- **prompt_relationship_042** v2 · grounded · clean · 4–12 performers: Members of an extended family

- **prompt_relationship_043** v2 · grounded · clean · 4–12 performers: Fellow volunteer gardeners

- **prompt_relationship_044** v2 · grounded · clean · 4–12 performers: Museum colleagues

- **prompt_relationship_045** v2 · grounded · clean · 4–12 performers: Members of a ferry crew

- **prompt_relationship_046** v2 · grounded · clean · 4–12 performers: Members of a book club

- **prompt_relationship_047** v2 · grounded · clean · 4–12 performers: Neighbors on the same street

- **prompt_relationship_048** v2 · grounded · clean · 4–12 performers: Members of a choir

- **prompt_relationship_049** v2 · grounded · clean · 4–12 performers: Fellow amateur astronomers

- **prompt_relationship_050** v2 · grounded · clean · 4–12 performers: Members of a bakery team

- **prompt_relationship_051** v2 · grounded · clean · 4–12 performers: Members of a community radio crew

- **prompt_relationship_052** v2 · grounded · clean · 4–12 performers: Members of a walking club

- **prompt_relationship_053** v2 · grounded · clean · 4–12 performers: Members of a restaurant team

- **prompt_relationship_054** v2 · grounded · clean · 4–12 performers: Members of a wedding party

- **prompt_relationship_055** v2 · grounded · clean · 4–12 performers: Members of a school reunion committee

- **prompt_relationship_056** v2 · grounded · clean · 4–12 performers: Members of a neighborhood council

- **prompt_relationship_057** v2 · grounded · clean · 4–12 performers: Members of a costume team

- **prompt_relationship_058** v2 · grounded · clean · 4–12 performers: Bandmates

- **prompt_relationship_059** v2 · grounded · clean · 4–12 performers: Members of a boat club

- **prompt_relationship_060** v2 · grounded · clean · 4–12 performers: Members of a family

- **prompt_relationship_061** v2 · grounded · clean · 4–12 performers: Fellow railway volunteers

- **prompt_relationship_062** v2 · grounded · clean · 4–12 performers: Library colleagues

- **prompt_relationship_063** v2 · grounded · clean · 4–12 performers: Members of a chess club

- **prompt_relationship_064** v2 · grounded · clean · 4–12 performers: Hotel colleagues

- **prompt_relationship_065** v2 · grounded · clean · 4–12 performers: Members of a gardening cooperative

- **prompt_relationship_066** v2 · grounded · clean · 4–12 performers: Members of a local history society

- **prompt_relationship_067** v2 · grounded · clean · 4–12 performers: Members of a film club

- **prompt_relationship_068** v2 · grounded · clean · 4–12 performers: Cousins

- **prompt_relationship_069** v2 · grounded · clean · 4–12 performers: Classmates in a pottery course

- **prompt_relationship_070** v2 · grounded · clean · 4–12 performers: Members of an inventors' team

- **prompt_relationship_071** v2 · grounded · clean · 4–12 performers: Members of a community kitchen team

- **prompt_relationship_072** v2 · grounded · clean · 4–12 performers: Members of a neighborhood orchestra

- **prompt_relationship_073** v2 · grounded · clean · 4–12 performers: Members of a sailing team

- **prompt_relationship_074** v2 · grounded · clean · 4–12 performers: Members of an amateur archaeology team

- **prompt_relationship_075** v2 · grounded · clean · 4–12 performers: Members of a festival committee

- **prompt_relationship_076** v2 · grounded · clean · 4–12 performers: Members of a repair cafe team

- **prompt_relationship_077** v2 · grounded · clean · 4–12 performers: Former classmates

- **prompt_relationship_078** v2 · grounded · clean · 4–12 performers: Members of a planetarium crew

- **prompt_relationship_079** v2 · grounded · clean · 4–12 performers: Fellow cinema volunteers

- **prompt_relationship_080** v2 · grounded · clean · 4–12 performers: Members of a family band

- **prompt_relationship_081** v2 · grounded · clean · 2–2 performers: Two roommates

- **prompt_relationship_082** v2 · grounded · clean · 2–2 performers: Two wedding planners

- **prompt_relationship_083** v2 · grounded · clean · 2–2 performers: Two neighbors

- **prompt_relationship_084** v2 · grounded · clean · 2–2 performers: An employee and their manager

- **prompt_relationship_086** v2 · grounded · clean · 2–2 performers: A chef and a customer

- **prompt_relationship_088** v2 · grounded · clean · 2–2 performers: A museum curator and a visitor

- **prompt_relationship_089** v2 · grounded · clean · 2–2 performers: Two bandmates

- **prompt_relationship_091** v2 · grounded · clean · 2–2 performers: A landlord and a tenant

- **prompt_relationship_092** v2 · grounded · clean · 2–2 performers: Two colleagues

- **prompt_relationship_093** v2 · grounded · clean · 3–3 performers: Three friends

- **prompt_relationship_094** v2 · grounded · clean · 3–3 performers: Three adult siblings

- **prompt_relationship_096** v2 · grounded · clean · 3–3 performers: Three coworkers

- **prompt_relationship_097** v2 · grounded · clean · 4–12 performers: Members of a wedding committee

- **prompt_relationship_099** v2 · grounded · clean · 4–12 performers: Members of a cafe team

- **prompt_relationship_101** v2 · grounded · clean · 4–12 performers: Members of a museum committee

- **prompt_relationship_102** v2 · grounded · clean · 4–12 performers: Office colleagues

### Location (96)

- **prompt_location_001** v2 · grounded · clean · 2–12 performers: A ferry terminal

- **prompt_location_002** v3 · grounded · clean · 2–12 performers: A restaurant kitchen

- **prompt_location_003** v1 · grounded · clean · 2–12 performers: Backstage at a community theater

- **prompt_location_004** v2 · grounded · clean · 2–12 performers: A rooftop garden

- **prompt_location_005** v2 · grounded · clean · 2–12 performers: An airport baggage office

- **prompt_location_006** v2 · grounded · clean · 2–12 performers: A museum gift shop

- **prompt_location_007** v2 · grounded · clean · 2–12 performers: A sleeper-train carriage

- **prompt_location_008** v2 · grounded · clean · 2–12 performers: A laundromat

- **prompt_location_009** v2 · grounded · clean · 2–12 performers: A wedding venue

- **prompt_location_010** v2 · grounded · clean · 2–12 performers: A neighborhood bakery

- **prompt_location_011** v1 · grounded · clean · 2–12 performers: A lighthouse visitor center

- **prompt_location_012** v1 · grounded · clean · 2–12 performers: The lost property room at a swimming pool

- **prompt_location_013** v2 · grounded · clean · 2–12 performers: An orchestra pit

- **prompt_location_014** v2 · grounded · clean · 2–12 performers: A bus depot

- **prompt_location_015** v2 · grounded · clean · 2–12 performers: A garden center

- **prompt_location_016** v2 · grounded · clean · 2–12 performers: An apartment balcony

- **prompt_location_017** v2 · grounded · clean · 2–12 performers: A village hall

- **prompt_location_018** v2 · grounded · clean · 2–12 performers: A radio studio

- **prompt_location_019** v1 · grounded · clean · 2–12 performers: The waiting room of a pet grooming salon

- **prompt_location_020** v2 · grounded · clean · 2–12 performers: A lakeside campsite

- **prompt_location_021** v2 · grounded · clean · 2–12 performers: A bookstore

- **prompt_location_022** v2 · grounded · clean · 2–12 performers: A hotel elevator

- **prompt_location_023** v2 · grounded · clean · 2–12 performers: A community fridge

- **prompt_location_024** v1 · grounded · clean · 2–12 performers: A mountain cable car station

- **prompt_location_025** v2 · grounded · clean · 2–12 performers: A cinema

- **prompt_location_026** v2 · grounded · clean · 2–12 performers: A coat check

- **prompt_location_027** v1 · grounded · clean · 2–12 performers: The repair counter of an umbrella shop

- **prompt_location_028** v2 · grounded · clean · 2–12 performers: A weather station

- **prompt_location_029** v2 · grounded · clean · 2–12 performers: An antique shop

- **prompt_location_030** v2 · grounded · clean · 2–12 performers: A rehearsal room

- **prompt_location_031** v2 · grounded · clean · 2–12 performers: A town council chamber

- **prompt_location_032** v1 · grounded · clean · 2–12 performers: The control booth of a miniature railway

- **prompt_location_033** v2 · grounded · clean · 2–12 performers: A beach kiosk

- **prompt_location_034** v2 · grounded · clean · 2–12 performers: A kitchen showroom

- **prompt_location_035** v2 · grounded · clean · 2–12 performers: An archaeology dig tent

- **prompt_location_036** v2 · grounded · clean · 2–12 performers: An observatory

- **prompt_location_037** v2 · grounded · clean · 2–12 performers: A costume rental shop

- **prompt_location_038** v2 · grounded · clean · 2–12 performers: A pottery studio

- **prompt_location_039** v1 · grounded · clean · 2–12 performers: A school reunion registration desk

- **prompt_location_040** v2 · grounded · clean · 2–12 performers: A frozen food aisle

- **prompt_location_041** v2 · grounded · clean · 2–12 performers: A narrowboat

- **prompt_location_042** v2 · grounded · clean · 2–12 performers: A florist's shop

- **prompt_location_043** v2 · grounded · clean · 2–12 performers: A library meeting room

- **prompt_location_044** v1 · grounded · clean · 2–12 performers: A chess tournament refreshment table

- **prompt_location_045** v2 · grounded · clean · 2–12 performers: An aquarium feeding station

- **prompt_location_046** v2 · grounded · clean · 2–12 performers: A clock repair workshop

- **prompt_location_047** v2 · grounded · clean · 2–12 performers: A roadside diner

- **prompt_location_048** v1 · grounded · clean · 2–12 performers: The sorting room of a local post office

- **prompt_location_049** v1 · grounded · clean · 2–12 performers: A planetarium dressing room

- **prompt_location_050** v2 · grounded · clean · 2–12 performers: A train station piano area

- **prompt_location_051** v2 · grounded · clean · 2–12 performers: A farm stand

- **prompt_location_052** v2 · grounded · clean · 2–12 performers: A sailing club

- **prompt_location_053** v2 · grounded · clean · 2–12 performers: An outdoor sculpture garden

- **prompt_location_054** v2 · grounded · clean · 2–12 performers: A town archive

- **prompt_location_055** v2 · grounded · clean · 2–12 performers: A bowling alley

- **prompt_location_056** v2 · grounded · clean · 2–12 performers: A shoe shop

- **prompt_location_057** v2 · grounded · clean · 2–12 performers: A coworking space

- **prompt_location_058** v2 · grounded · clean · 2–12 performers: A basement classroom

- **prompt_location_059** v2 · grounded · clean · 2–12 performers: A toy repair cafe

- **prompt_location_060** v1 · grounded · clean · 2–12 performers: A ferry's onboard cafeteria

- **prompt_location_061** v2 · grounded · clean · 2–12 performers: A birdwatching hide

- **prompt_location_062** v2 · grounded · clean · 2–12 performers: A maze customer-service booth

- **prompt_location_063** v1 · grounded · clean · 2–12 performers: A jam competition judging tent

- **prompt_location_064** v2 · grounded · clean · 2–12 performers: An audio-guide recording booth

- **prompt_location_065** v2 · grounded · clean · 2–12 performers: A bridge

- **prompt_location_066** v2 · grounded · clean · 2–12 performers: A picnic shelter

- **prompt_location_067** v2 · grounded · clean · 2–12 performers: A parade-float warehouse

- **prompt_location_068** v2 · grounded · clean · 2–12 performers: A small end-of-line railway station

- **prompt_location_069** v2 · grounded · clean · 2–12 performers: A community kitchen

- **prompt_location_070** v2 · grounded · clean · 2–12 performers: A greenhouse

- **prompt_location_071** v2 · grounded · clean · 2–12 performers: A small castle complaints desk

- **prompt_location_072** v2 · playful · clean · 2–12 performers: A garden-gnome spa

- **prompt_location_073** v2 · grounded · clean · 2–12 performers: A sandwich-shop back office

- **prompt_location_075** v3 · playful · clean · 2–12 performers: A dentist’s waiting room

- **prompt_location_076** v3 · grounded · clean · 2–12 performers: A cafe

- **prompt_location_077** v2 · grounded · clean · 2–12 performers: A hotel lobby

- **prompt_location_079** v3 · grounded · clean · 2–12 performers: A ferry lounge

- **prompt_location_080** v3 · playful · clean · 2–12 performers: A lost-and-found office

- **prompt_location_081** v2 · grounded · clean · 2–12 performers: A band's dressing room

- **prompt_location_083** v3 · grounded · clean · 2–12 performers: A cupboard

- **prompt_location_085** v2 · grounded · clean · 2–12 performers: A neighborhood council chamber

- **prompt_location_086** v3 · grounded · clean · 2–12 performers: A bakery testing room

- **prompt_location_087** v2 · grounded · clean · 2–12 performers: A magic-show backstage area

- **prompt_location_088** v2 · grounded · clean · 2–12 performers: An airport lounge

- **prompt_location_091** v3 · grounded · clean · 2–12 performers: A cottage

- **prompt_location_092** v3 · grounded · clean · 2–12 performers: A community cinema

- **prompt_location_2094** v1 · grounded · clean · 2–12 performers: An empty room

- **prompt_location_2095** v1 · grounded · clean · 2–12 performers: A tiny shop

- **prompt_location_2086** v1 · playful · spicy · 2–12 performers: a speed-dating event

- **prompt_location_2087** v1 · playful · spicy · 2–12 performers: a couples’ retreat

- **prompt_location_2088** v1 · playful · spicy · 2–12 performers: a honeymoon suite

- **prompt_location_2089** v1 · playful · spicy · 2–12 performers: a singles cruise

- **prompt_location_2090** v1 · playful · spicy · 2–12 performers: a lingerie shop

- **prompt_location_2091** v1 · playful · spicy · 2–12 performers: a wedding’s singles table

- **prompt_location_2092** v2 · playful · spicy · 2–12 performers: a romantic restaurant

- **prompt_location_2093** v2 · playful · spicy · 2–12 performers: a hotel dining room

### Profession (71)

- **prompt_profession_001** v1 · grounded · clean · 2–12 performers: Museum curator

- **prompt_profession_002** v1 · grounded · clean · 2–12 performers: Wedding planner

- **prompt_profession_003** v1 · grounded · clean · 2–12 performers: Night train conductor

- **prompt_profession_004** v1 · grounded · clean · 2–12 performers: Neighborhood baker

- **prompt_profession_005** v1 · grounded · clean · 2–12 performers: Aquarium guide

- **prompt_profession_006** v1 · grounded · clean · 2–12 performers: Umbrella repairer

- **prompt_profession_007** v1 · grounded · clean · 2–12 performers: Community radio producer

- **prompt_profession_008** v1 · grounded · clean · 2–12 performers: Lighthouse keeper

- **prompt_profession_009** v1 · grounded · clean · 2–12 performers: Costume designer

- **prompt_profession_010** v1 · grounded · clean · 2–12 performers: Piano tuner

- **prompt_profession_011** v1 · grounded · clean · 2–12 performers: Landscape gardener

- **prompt_profession_012** v1 · grounded · clean · 2–12 performers: Festival coordinator

- **prompt_profession_013** v1 · grounded · clean · 2–12 performers: Lost luggage agent

- **prompt_profession_014** v1 · grounded · clean · 2–12 performers: Toy restorer

- **prompt_profession_015** v1 · grounded · clean · 2–12 performers: Town archivist

- **prompt_profession_016** v1 · grounded · clean · 2–12 performers: Boat mechanic

- **prompt_profession_017** v1 · grounded · clean · 2–12 performers: Public librarian

- **prompt_profession_018** v1 · grounded · clean · 2–12 performers: Ceramics teacher

- **prompt_profession_019** v1 · grounded · clean · 2–12 performers: Clockmaker

- **prompt_profession_020** v1 · grounded · clean · 2–12 performers: Food critic

- **prompt_profession_021** v1 · grounded · clean · 2–12 performers: Elevator inspector

- **prompt_profession_022** v1 · grounded · clean · 2–12 performers: Mobile dog groomer

- **prompt_profession_023** v1 · grounded · clean · 2–12 performers: Board game designer

- **prompt_profession_024** v1 · grounded · clean · 2–12 performers: Science museum educator

- **prompt_profession_025** v1 · grounded · clean · 2–12 performers: Sourdough instructor

- **prompt_profession_026** v1 · grounded · clean · 2–12 performers: Theater stage manager

- **prompt_profession_027** v1 · grounded · clean · 2–12 performers: Weather presenter

- **prompt_profession_028** v1 · grounded · clean · 2–12 performers: Miniature railway engineer

- **prompt_profession_029** v1 · grounded · clean · 2–12 performers: Farmers market organizer

- **prompt_profession_030** v1 · grounded · clean · 2–12 performers: Hotel concierge

- **prompt_profession_031** v1 · grounded · clean · 2–12 performers: Orchestra librarian

- **prompt_profession_032** v1 · grounded · clean · 2–12 performers: Bike courier

- **prompt_profession_033** v1 · grounded · clean · 2–12 performers: Wildlife illustrator

- **prompt_profession_034** v1 · grounded · clean · 2–12 performers: Puzzle editor

- **prompt_profession_035** v1 · grounded · clean · 2–12 performers: Art conservator

- **prompt_profession_036** v1 · grounded · clean · 2–12 performers: Chocolate maker

- **prompt_profession_037** v1 · grounded · clean · 2–12 performers: Ferry captain

- **prompt_profession_038** v1 · grounded · clean · 2–12 performers: Planetarium narrator

- **prompt_profession_039** v1 · grounded · clean · 2–12 performers: Ice sculptor

- **prompt_profession_040** v1 · grounded · clean · 2–12 performers: Community mediator

- **prompt_profession_041** v1 · grounded · clean · 2–12 performers: Tea blender

- **prompt_profession_042** v1 · grounded · clean · 2–12 performers: Bookbinder

- **prompt_profession_043** v1 · grounded · clean · 2–12 performers: Walking tour guide

- **prompt_profession_044** v1 · grounded · clean · 2–12 performers: Recycling coordinator

- **prompt_profession_045** v1 · grounded · clean · 2–12 performers: Acoustic consultant

- **prompt_profession_046** v1 · grounded · clean · 2–12 performers: Window dresser

- **prompt_profession_047** v1 · grounded · clean · 2–12 performers: Seed librarian

- **prompt_profession_048** v1 · grounded · clean · 2–12 performers: Auction catalog writer

- **prompt_profession_049** v1 · grounded · clean · 2–12 performers: Model ship builder

- **prompt_profession_050** v1 · grounded · clean · 2–12 performers: Accessibility consultant

- **prompt_profession_051** v1 · playful · clean · 2–12 performers: Official town umbrella inspector

- **prompt_profession_052** v1 · playful · clean · 2–12 performers: Competitive houseplant coach

- **prompt_profession_054** v1 · playful · clean · 2–12 performers: Luxury sandwich consultant

- **prompt_profession_055** v3 · playful · clean · 2–12 performers: Dentist

- **prompt_profession_056** v1 · playful · clean · 2–12 performers: Professional birthday surprise inspector

- **prompt_profession_058** v2 · playful · clean · 2–12 performers: Personal assistant

- **prompt_profession_059** v1 · playful · clean · 2–12 performers: Emergency picnic coordinator

- **prompt_profession_060** v1 · playful · clean · 2–12 performers: Celebrity garden-gnome publicist

- **prompt_profession_061** v2 · playful · clean · 2–12 performers: Chair inspector

- **prompt_profession_062** v2 · playful · clean · 2–12 performers: Motivational speaker

- **prompt_profession_063** v1 · playful · clean · 2–12 performers: Luxury shed interior designer

- **prompt_profession_064** v2 · playful · clean · 2–12 performers: Spoon-polishing judge

- **prompt_profession_065** v2 · playful · clean · 2–12 performers: Crisp-tasting expert

- **prompt_profession_2078** v1 · playful · spicy · 2–12 performers: dating-profile consultant

- **prompt_profession_2079** v1 · playful · spicy · 2–12 performers: speed-dating host

- **prompt_profession_2080** v1 · playful · spicy · 2–12 performers: honeymoon travel agent

- **prompt_profession_2081** v1 · playful · spicy · 2–12 performers: romance audiobook narrator

- **prompt_profession_2082** v1 · playful · spicy · 2–12 performers: breakup coach

- **prompt_profession_2083** v1 · playful · spicy · 2–12 performers: couples’ dance instructor

- **prompt_profession_2084** v2 · playful · spicy · 2–12 performers: bridal concierge

- **prompt_profession_2085** v1 · playful · spicy · 2–12 performers: flirting workshop instructor

### Character role (81)

- **prompt_role_001** v2 · grounded · clean · 2–12 performers: Group leader

- **prompt_role_002** v2 · grounded · clean · 2–12 performers: Newcomer

- **prompt_role_003** v2 · grounded · clean · 2–12 performers: Skeptic

- **prompt_role_004** v2 · grounded · clean · 2–12 performers: Spokesperson

- **prompt_role_005** v2 · grounded · clean · 2–12 performers: Key keeper

- **prompt_role_006** v2 · grounded · clean · 2–12 performers: Instruction reader

- **prompt_role_007** v2 · grounded · clean · 2–12 performers: Volunteer

- **prompt_role_008** v2 · grounded · clean · 2–12 performers: Peacemaker

- **prompt_role_009** v2 · grounded · clean · 2–12 performers: Optimist

- **prompt_role_010** v2 · grounded · clean · 2–12 performers: Problem solver

- **prompt_role_011** v2 · grounded · clean · 2–12 performers: Detail collector

- **prompt_role_012** v2 · grounded · clean · 2–12 performers: Project participant

- **prompt_role_013** v1 · grounded · clean · 2–12 performers: Unofficial historian

- **prompt_role_014** v2 · grounded · clean · 2–12 performers: Substitute

- **prompt_role_015** v2 · grounded · clean · 2–12 performers: Rival

- **prompt_role_016** v2 · grounded · clean · 2–12 performers: Organizer

- **prompt_role_017** v2 · grounded · clean · 2–12 performers: Surprise coordinator

- **prompt_role_018** v2 · grounded · clean · 2–12 performers: Note taker

- **prompt_role_019** v2 · grounded · clean · 2–12 performers: Traveler

- **prompt_role_020** v2 · grounded · clean · 2–12 performers: Expert

- **prompt_role_021** v2 · grounded · clean · 2–12 performers: Explainer

- **prompt_role_022** v2 · grounded · clean · 2–12 performers: Navigator

- **prompt_role_023** v2 · grounded · clean · 2–12 performers: Checklist keeper

- **prompt_role_024** v2 · grounded · clean · 2–12 performers: Welcoming-committee member

- **prompt_role_025** v2 · grounded · clean · 2–12 performers: Mediator

- **prompt_role_026** v2 · grounded · clean · 2–12 performers: Event participant

- **prompt_role_027** v2 · grounded · clean · 2–12 performers: Early arrival

- **prompt_role_028** v2 · grounded · clean · 2–12 performers: Team member

- **prompt_role_029** v2 · grounded · clean · 2–12 performers: First-time speaker

- **prompt_role_030** v2 · grounded · clean · 2–12 performers: Inventor

- **prompt_role_031** v2 · grounded · clean · 2–12 performers: Snack provider

- **prompt_role_032** v1 · grounded · clean · 2–12 performers: Temporary caretaker

- **prompt_role_033** v2 · grounded · clean · 2–12 performers: Mentor

- **prompt_role_034** v2 · grounded · clean · 2–12 performers: Box keeper

- **prompt_role_035** v2 · grounded · clean · 2–12 performers: Opinion collector

- **prompt_role_036** v2 · grounded · clean · 2–12 performers: Returning participant

- **prompt_role_037** v2 · grounded · clean · 2–12 performers: Apology writer

- **prompt_role_038** v2 · grounded · clean · 2–12 performers: New member

- **prompt_role_039** v2 · grounded · clean · 2–12 performers: Traditionalist

- **prompt_role_040** v2 · grounded · clean · 2–12 performers: Process designer

- **prompt_role_041** v3 · grounded · clean · 2–12 performers: Visitor

- **prompt_role_042** v2 · grounded · clean · 2–12 performers: Instruction translator

- **prompt_role_043** v2 · grounded · clean · 2–12 performers: Catchphrase writer

- **prompt_role_044** v2 · grounded · clean · 2–12 performers: Local guide

- **prompt_role_045** v2 · grounded · clean · 2–12 performers: Master of ceremonies

- **prompt_role_046** v2 · grounded · clean · 2–12 performers: Assistant

- **prompt_role_047** v2 · grounded · clean · 2–12 performers: Witness

- **prompt_role_048** v2 · grounded · clean · 2–12 performers: Timekeeper

- **prompt_role_049** v2 · grounded · clean · 2–12 performers: Project member

- **prompt_role_050** v2 · grounded · clean · 2–12 performers: Outgoing coordinator

- **prompt_role_051** v2 · grounded · clean · 2–12 performers: Planner

- **prompt_role_052** v2 · grounded · clean · 2–12 performers: Questioner

- **prompt_role_053** v2 · grounded · clean · 2–12 performers: Backup provider

- **prompt_role_054** v2 · grounded · clean · 2–12 performers: Departing guest

- **prompt_role_055** v2 · grounded · clean · 2–12 performers: Sign seeker

- **prompt_role_056** v2 · grounded · clean · 2–12 performers: Dispute mediator

- **prompt_role_057** v2 · grounded · clean · 2–12 performers: Rehearsal coordinator

- **prompt_role_058** v2 · grounded · clean · 2–12 performers: Returning member

- **prompt_role_059** v2 · grounded · clean · 2–12 performers: Talent-show entrant

- **prompt_role_060** v2 · grounded · clean · 2–12 performers: First-time participant

- **prompt_role_061** v2 · grounded · clean · 2–12 performers: News bearer

- **prompt_role_062** v2 · grounded · clean · 2–12 performers: Promise keeper

- **prompt_role_063** v2 · grounded · clean · 2–12 performers: Inclusion coordinator

- **prompt_role_064** v3 · grounded · clean · 2–12 performers: Manager

- **prompt_role_065** v2 · grounded · clean · 2–12 performers: Risk assessor

- **prompt_role_066** v2 · playful · clean · 2–12 performers: Team uniform coordinator

- **prompt_role_067** v2 · playful · clean · 2–12 performers: Ceremony coordinator

- **prompt_role_068** v2 · playful · clean · 2–12 performers: Fog-machine operator

- **prompt_role_069** v2 · playful · clean · 2–12 performers: Interview candidate

- **prompt_role_070** v2 · playful · clean · 2–12 performers: Sandwich guardian

- **prompt_role_071** v2 · playful · clean · 2–12 performers: Picnic organizer

- **prompt_role_072** v2 · playful · clean · 2–12 performers: Promotion candidate

- **prompt_role_073** v2 · playful · clean · 2–12 performers: Puppeteer

- **prompt_role_074** v2 · playful · clean · 2–12 performers: Rules interpreter

- **prompt_role_075** v2 · playful · clean · 2–12 performers: Announcement recipient

- **prompt_role_076** v3 · playful · clean · 2–12 performers: Representative

- **prompt_role_077** v2 · playful · clean · 2–12 performers: Surprise planner

- **prompt_role_078** v2 · grounded · clean · 2–12 performers: Rule follower

- **prompt_role_079** v1 · playful · clean · 2–12 performers: A goose

- **prompt_role_080** v1 · playful · clean · 2–12 performers: An imaginary dragon

- **prompt_role_081** v1 · playful · clean · 2–12 performers: A duck

### Emotion (51)

- **prompt_emotion_001** v1 · grounded · clean · 2–12 performers: Barely contained excitement

- **prompt_emotion_002** v1 · grounded · clean · 2–12 performers: Quiet disappointment

- **prompt_emotion_003** v1 · grounded · clean · 2–12 performers: Unexpected relief

- **prompt_emotion_004** v1 · grounded · clean · 2–12 performers: Playful suspicion

- **prompt_emotion_005** v1 · grounded · clean · 2–12 performers: Warm nostalgia

- **prompt_emotion_006** v1 · grounded · clean · 2–12 performers: Earnest curiosity

- **prompt_emotion_007** v1 · grounded · clean · 2–12 performers: Gentle impatience

- **prompt_emotion_008** v1 · grounded · clean · 2–12 performers: Delighted disbelief

- **prompt_emotion_009** v1 · grounded · clean · 2–12 performers: Careful optimism

- **prompt_emotion_010** v1 · grounded · clean · 2–12 performers: Awkward gratitude

- **prompt_emotion_011** v1 · grounded · clean · 2–12 performers: Sincere admiration

- **prompt_emotion_012** v1 · grounded · clean · 2–12 performers: Mild bewilderment

- **prompt_emotion_013** v1 · grounded · clean · 2–12 performers: Stubborn hope

- **prompt_emotion_014** v1 · grounded · clean · 2–12 performers: Nervous anticipation

- **prompt_emotion_015** v1 · grounded · clean · 2–12 performers: Sudden confidence

- **prompt_emotion_016** v1 · grounded · clean · 2–12 performers: Affectionate frustration

- **prompt_emotion_017** v1 · grounded · clean · 2–12 performers: A tiny burst of envy

- **prompt_emotion_018** v1 · grounded · clean · 2–12 performers: Peaceful contentment

- **prompt_emotion_019** v1 · grounded · clean · 2–12 performers: Embarrassed pride

- **prompt_emotion_020** v1 · grounded · clean · 2–12 performers: Cheerful determination

- **prompt_emotion_021** v1 · grounded · clean · 2–12 performers: Bittersweet happiness

- **prompt_emotion_022** v1 · grounded · clean · 2–12 performers: Restless enthusiasm

- **prompt_emotion_023** v1 · grounded · clean · 2–12 performers: Polite indignation

- **prompt_emotion_024** v1 · grounded · clean · 2–12 performers: Deep fascination

- **prompt_emotion_025** v1 · grounded · clean · 2–12 performers: Uncertain trust

- **prompt_emotion_026** v1 · grounded · clean · 2–12 performers: Giddy surprise

- **prompt_emotion_027** v1 · grounded · clean · 2–12 performers: Calm resolve

- **prompt_emotion_028** v2 · grounded · clean · 2–12 performers: Self-importance

- **prompt_emotion_029** v1 · grounded · clean · 2–12 performers: Tender concern

- **prompt_emotion_030** v1 · grounded · clean · 2–12 performers: Reluctant amusement

- **prompt_emotion_031** v1 · grounded · clean · 2–12 performers: Startled joy

- **prompt_emotion_032** v1 · grounded · clean · 2–12 performers: Growing courage

- **prompt_emotion_033** v1 · grounded · clean · 2–12 performers: Thoughtful doubt

- **prompt_emotion_034** v1 · grounded · clean · 2–12 performers: Sleepy satisfaction

- **prompt_emotion_035** v1 · grounded · clean · 2–12 performers: Overwhelming wonder

- **prompt_emotion_036** v1 · grounded · clean · 2–12 performers: Secret delight

- **prompt_emotion_037** v1 · grounded · clean · 2–12 performers: Mischievous confidence

- **prompt_emotion_038** v1 · grounded · clean · 2–12 performers: Careful vulnerability

- **prompt_emotion_039** v2 · grounded · clean · 2–12 performers: Patience

- **prompt_emotion_040** v2 · grounded · clean · 2–12 performers: Momentary panic

- **prompt_emotion_041** v1 · grounded · clean · 2–12 performers: Happy exhaustion

- **prompt_emotion_042** v1 · grounded · clean · 2–12 performers: A sense of belonging

- **prompt_emotion_043** v1 · grounded · clean · 2–12 performers: Earnest regret

- **prompt_emotion_044** v1 · grounded · clean · 2–12 performers: Relieved amusement

- **prompt_emotion_045** v1 · grounded · clean · 2–12 performers: Determined kindness

- **prompt_emotion_046** v1 · grounded · clean · 2–12 performers: Growing anticipation

- **prompt_emotion_047** v1 · grounded · clean · 2–12 performers: Protective affection

- **prompt_emotion_048** v1 · grounded · clean · 2–12 performers: Respectful skepticism

- **prompt_emotion_049** v2 · grounded · clean · 2–12 performers: Peace

- **prompt_emotion_050** v2 · grounded · clean · 2–12 performers: Quiet joy

- **prompt_emotion_051** v2 · grounded · clean · 2–12 performers: Seriousness

### Action (172)

- **prompt_action_001** v2 · grounded · clean · 2–12 performers: Repairing an umbrella

- **prompt_action_002** v2 · grounded · clean · 2–12 performers: Hiding a birthday present

- **prompt_action_003** v2 · grounded · clean · 2–12 performers: Packing a suitcase

- **prompt_action_004** v2 · grounded · clean · 2–12 performers: Sorting socks

- **prompt_action_005** v2 · grounded · clean · 2–12 performers: Building a shelf

- **prompt_action_006** v2 · grounded · clean · 2–12 performers: Wrapping a present

- **prompt_action_007** v2 · grounded · clean · 2–12 performers: Folding a map

- **prompt_action_008** v1 · grounded · clean · 2–12 performers: Teaching someone to knead dough

- **prompt_action_009** v2 · grounded · clean · 2–12 performers: Rehearsing a speech

- **prompt_action_010** v2 · grounded · clean · 2–12 performers: Locating a squeak

- **prompt_action_011** v2 · grounded · clean · 2–12 performers: Assembling a model boat

- **prompt_action_012** v2 · grounded · clean · 2–12 performers: Moving a plant

- **prompt_action_013** v2 · grounded · clean · 2–12 performers: Testing an invention

- **prompt_action_014** v2 · grounded · clean · 2–12 performers: Preparing a picnic

- **prompt_action_015** v2 · grounded · clean · 2–12 performers: Labeling boxes

- **prompt_action_016** v1 · grounded · clean · 2–12 performers: Untangling a string of lights

- **prompt_action_017** v2 · grounded · clean · 2–12 performers: Tuning a piano

- **prompt_action_018** v2 · grounded · clean · 2–12 performers: Decorating a cake

- **prompt_action_019** v2 · grounded · clean · 2–12 performers: Practicing a handshake

- **prompt_action_020** v2 · grounded · clean · 2–12 performers: Searching for a screw

- **prompt_action_021** v2 · grounded · clean · 2–12 performers: Sorting photographs

- **prompt_action_022** v2 · grounded · clean · 2–12 performers: Holding a ladder steady

- **prompt_action_023** v2 · grounded · clean · 2–12 performers: Opening a packet

- **prompt_action_024** v2 · grounded · clean · 2–12 performers: Setting a table

- **prompt_action_025** v2 · grounded · clean · 2–12 performers: Mending a jacket

- **prompt_action_026** v2 · grounded · clean · 2–12 performers: Checking train tickets

- **prompt_action_027** v2 · grounded · clean · 2–12 performers: Comparing paint samples

- **prompt_action_028** v2 · grounded · clean · 2–12 performers: Planting seeds

- **prompt_action_029** v2 · grounded · clean · 2–12 performers: Making a sign

- **prompt_action_030** v2 · grounded · clean · 2–12 performers: Catching a paper hat

- **prompt_action_031** v2 · grounded · clean · 2–12 performers: Arranging chairs

- **prompt_action_032** v2 · grounded · clean · 2–12 performers: Measuring a room

- **prompt_action_033** v2 · grounded · clean · 2–12 performers: Demonstrating a remote control

- **prompt_action_034** v2 · grounded · clean · 2–12 performers: Testing a room’s acoustics

- **prompt_action_035** v2 · grounded · clean · 2–12 performers: Showing a shortcut

- **prompt_action_036** v2 · grounded · clean · 2–12 performers: Reorganizing a kitchen drawer

- **prompt_action_037** v2 · grounded · clean · 2–12 performers: Retrieving a kite

- **prompt_action_038** v2 · grounded · clean · 2–12 performers: Putting together a puzzle

- **prompt_action_039** v2 · grounded · clean · 2–12 performers: Practicing a dance

- **prompt_action_040** v2 · grounded · clean · 2–12 performers: Cleaning a window

- **prompt_action_041** v2 · grounded · clean · 2–12 performers: Taking inventory

- **prompt_action_042** v2 · grounded · clean · 2–12 performers: Polishing a trophy

- **prompt_action_043** v2 · grounded · clean · 2–12 performers: Making sandwiches

- **prompt_action_044** v2 · grounded · clean · 2–12 performers: Choosing a picture frame

- **prompt_action_045** v3 · grounded · clean · 2–12 performers: Sharing an umbrella

- **prompt_action_046** v2 · grounded · clean · 2–12 performers: Rehearsing an entrance

- **prompt_action_047** v2 · grounded · clean · 2–12 performers: Sorting the mail

- **prompt_action_048** v2 · grounded · clean · 2–12 performers: Repairing a stage prop

- **prompt_action_049** v2 · grounded · clean · 2–12 performers: Presenting an object for inspection

- **prompt_action_050** v2 · grounded · clean · 2–12 performers: Teaching a board game

- **prompt_action_051** v1 · grounded · clean · 2–12 performers: Filling a time capsule

- **prompt_action_052** v2 · grounded · clean · 2–12 performers: Designing a flag

- **prompt_action_053** v2 · grounded · clean · 2–12 performers: Folding paper animals

- **prompt_action_054** v2 · grounded · clean · 2–12 performers: Testing a chair

- **prompt_action_055** v2 · grounded · clean · 2–12 performers: Transplanting a cactus

- **prompt_action_056** v2 · grounded · clean · 2–12 performers: Building a model town

- **prompt_action_057** v2 · grounded · clean · 2–12 performers: Drawing a route

- **prompt_action_058** v1 · grounded · clean · 2–12 performers: Rehearsing a weather forecast

- **prompt_action_059** v2 · grounded · clean · 2–12 performers: Stacking cups

- **prompt_action_060** v2 · grounded · clean · 2–12 performers: Preparing a room

- **prompt_action_061** v2 · grounded · clean · 2–12 performers: Checking a snack kit

- **prompt_action_062** v2 · grounded · clean · 2–12 performers: Finding the end of a roll of tape

- **prompt_action_063** v2 · grounded · clean · 2–12 performers: Stabilizing a table

- **prompt_action_064** v1 · grounded · clean · 2–12 performers: Arranging a window display

- **prompt_action_065** v2 · grounded · clean · 2–12 performers: Returning borrowed things

- **prompt_action_066** v2 · playful · clean · 2–12 performers: Giving a performance review

- **prompt_action_067** v2 · playful · clean · 2–12 performers: Installing a velvet rope

- **prompt_action_068** v2 · playful · clean · 2–12 performers: Rehearsing an apology

- **prompt_action_069** v2 · playful · clean · 2–12 performers: Making a welcome pack

- **prompt_action_070** v2 · playful · clean · 2–12 performers: Packing a cake

- **prompt_action_071** v2 · playful · clean · 2–12 performers: Organizing a fridge

- **prompt_action_072** v2 · playful · clean · 2–12 performers: Demonstrating a doorbell

- **prompt_action_073** v2 · playful · clean · 2–12 performers: Interviewing a neighbor

- **prompt_action_074** v2 · playful · clean · 2–12 performers: Performing a security check

- **prompt_action_075** v2 · playful · clean · 2–12 performers: Testing a fog machine

- **prompt_action_076** v3 · playful · clean · 2–12 performers: Wrapping a spoon

- **prompt_action_077** v2 · playful · clean · 2–12 performers: Holding a ribbon cutting

- **prompt_action_078** v2 · playful · clean · 2–12 performers: Taking a photograph

- **prompt_action_079** v2 · playful · clean · 2–12 performers: Drawing a seating chart

- **prompt_action_080** v2 · playful · clean · 2–12 performers: Making a complaint

- **prompt_action_081** v3 · grounded · clean · 2–12 performers: Preparing a surprise

- **prompt_action_082** v3 · grounded · clean · 2–12 performers: Coaching a club

- **prompt_action_083** v3 · grounded · clean · 2–12 performers: Maintaining a garden fence

- **prompt_action_084** v2 · grounded · clean · 2–12 performers: Reopening a time capsule

- **prompt_action_085** v3 · grounded · clean · 2–12 performers: Holding a meeting

- **prompt_action_086** v3 · grounded · clean · 2–12 performers: Sorting a shared box

- **prompt_action_087** v3 · grounded · clean · 2–12 performers: Meeting

- **prompt_action_088** v3 · grounded · clean · 2–12 performers: Planning a cake

- **prompt_action_089** v3 · grounded · clean · 2–12 performers: Sharing a greenhouse

- **prompt_action_090** v3 · grounded · clean · 2–12 performers: Rehearsing a pitch

- **prompt_action_091** v2 · grounded · clean · 2–12 performers: Moving house

- **prompt_action_092** v3 · grounded · clean · 2–12 performers: Tuning instruments

- **prompt_action_093** v3 · grounded · clean · 2–12 performers: Fixing a sign

- **prompt_action_094** v3 · grounded · clean · 2–12 performers: Moving belongings

- **prompt_action_095** v3 · grounded · clean · 2–12 performers: Returning a borrowed item

- **prompt_action_096** v3 · grounded · clean · 2–12 performers: Learning a craft

- **prompt_action_097** v3 · grounded · clean · 2–12 performers: Opening a restaurant

- **prompt_action_098** v3 · grounded · clean · 2–12 performers: Planning a reunion

- **prompt_action_099** v3 · grounded · clean · 2–12 performers: Choosing a captain

- **prompt_action_100** v3 · grounded · clean · 2–12 performers: Finishing a project

- **prompt_action_101** v2 · grounded · clean · 2–12 performers: Choosing a club name

- **prompt_action_102** v3 · grounded · clean · 2–12 performers: Choosing items for a time capsule

- **prompt_action_103** v3 · grounded · clean · 2–12 performers: Preparing a show

- **prompt_action_104** v3 · grounded · clean · 2–12 performers: Planning an opening night

- **prompt_action_105** v3 · grounded · clean · 2–12 performers: Coordinating a reunion

- **prompt_action_106** v2 · grounded · clean · 2–12 performers: Entering a flower show

- **prompt_action_107** v3 · grounded · clean · 2–12 performers: Preparing a voyage

- **prompt_action_108** v2 · grounded · clean · 2–12 performers: Planning a public event

- **prompt_action_109** v3 · grounded · clean · 2–12 performers: Organizing a feast

- **prompt_action_110** v3 · grounded · clean · 2–12 performers: Preparing a performance

- **prompt_action_111** v3 · grounded · clean · 2–12 performers: Preparing a broadcast

- **prompt_action_112** v3 · grounded · clean · 2–12 performers: Choosing a fountain

- **prompt_action_113** v3 · grounded · clean · 2–12 performers: Preparing costumes

- **prompt_action_114** v3 · grounded · clean · 2–12 performers: Choosing a song

- **prompt_action_115** v2 · grounded · clean · 2–12 performers: Organizing a boat launch

- **prompt_action_116** v3 · grounded · clean · 2–12 performers: Clearing out a workshop

- **prompt_action_117** v2 · grounded · clean · 2–12 performers: Restoring a miniature railway

- **prompt_action_118** v3 · grounded · clean · 2–12 performers: Organizing a tournament

- **prompt_action_119** v3 · grounded · clean · 2–12 performers: Dividing a harvest

- **prompt_action_120** v2 · grounded · clean · 2–12 performers: Opening a time capsule

- **prompt_action_121** v3 · grounded · clean · 2–12 performers: Making a movie

- **prompt_action_122** v3 · grounded · clean · 2–12 performers: Taking over a food stall

- **prompt_action_123** v2 · grounded · clean · 2–12 performers: Arranging an exhibition

- **prompt_action_124** v2 · grounded · clean · 2–12 performers: Rehearsing a product demonstration

- **prompt_action_125** v3 · grounded · clean · 2–12 performers: Preparing a dinner

- **prompt_action_126** v2 · grounded · clean · 2–12 performers: Choosing a rehearsal space

- **prompt_action_127** v3 · grounded · clean · 2–12 performers: Identifying a find

- **prompt_action_128** v3 · grounded · clean · 2–12 performers: Building a parade float

- **prompt_action_129** v3 · grounded · clean · 2–12 performers: Rehearsing a show

- **prompt_action_130** v3 · grounded · clean · 2–12 performers: Opening a cinema

- **prompt_action_131** v3 · grounded · clean · 2–12 performers: Preparing a birthday performance

- **prompt_action_132** v3 · playful · clean · 2–12 performers: Negotiating ownership

- **prompt_action_133** v3 · playful · clean · 2–12 performers: Covering for someone

- **prompt_action_134** v3 · playful · clean · 2–12 performers: Returning a gift

- **prompt_action_135** v3 · playful · clean · 2–12 performers: Debating a menu

- **prompt_action_136** v3 · playful · clean · 2–12 performers: Opening a hotel

- **prompt_action_137** v3 · playful · clean · 2–12 performers: Planning a picnic

- **prompt_action_138** v3 · playful · clean · 2–12 performers: Writing an apology

- **prompt_action_139** v3 · playful · clean · 2–12 performers: Opening a cafe

- **prompt_action_140** v3 · playful · clean · 2–12 performers: Replacing a trophy

- **prompt_action_141** v3 · playful · clean · 2–12 performers: Rehearsing a formal apology

- **prompt_action_142** v3 · playful · clean · 2–12 performers: Organizing a picnic

- **prompt_action_143** v3 · playful · clean · 2–12 performers: Naming an object

- **prompt_action_144** v3 · playful · clean · 2–12 performers: Rehearsing a magic show

- **prompt_action_145** v2 · grounded · clean · 2–12 performers: Practicing restaurant service

- **prompt_action_146** v2 · grounded · clean · 2–12 performers: Replacing a festival mascot

- **prompt_action_147** v3 · grounded · clean · 2–12 performers: Finishing a task

- **prompt_action_148** v2 · grounded · clean · 2–12 performers: Protecting a surprise

- **prompt_action_149** v3 · grounded · clean · 2–12 performers: Packing for a trip

- **prompt_action_150** v2 · grounded · clean · 2–12 performers: Practicing a speech

- **prompt_action_151** v3 · grounded · clean · 2–12 performers: Guarding a box

- **prompt_action_153** v2 · grounded · clean · 2–12 performers: Testing a catchphrase

- **prompt_action_154** v2 · grounded · clean · 2–12 performers: Handing over responsibility

- **prompt_action_155** v3 · grounded · clean · 2–12 performers: Saying goodbye

- **prompt_action_156** v2 · grounded · clean · 2–12 performers: Practicing delegation

- **prompt_action_157** v3 · grounded · clean · 2–12 performers: Taking a risk

- **prompt_action_158** v3 · playful · clean · 2–12 performers: Printing team jackets

- **prompt_action_159** v3 · playful · clean · 2–12 performers: Holding a ceremony

- **prompt_action_160** v3 · playful · clean · 2–12 performers: Bringing a fog machine

- **prompt_action_161** v2 · playful · clean · 2–12 performers: Protecting a sandwich

- **prompt_action_162** v3 · playful · clean · 2–12 performers: Making a spreadsheet

- **prompt_action_164** v3 · playful · clean · 2–12 performers: Explaining the rules

- **prompt_action_165** v3 · playful · clean · 2–12 performers: Proposing voting rights

- **prompt_action_166** v3 · playful · clean · 2–12 performers: Keeping a surprise

- **prompt_action_167** v3 · grounded · clean · 2–12 performers: Celebrating

- **prompt_action_168** v1 · grounded · clean · 2–12 performers: Delegating tasks

- **prompt_action_169** v1 · playful · clean · 2–12 performers: Posing

- **prompt_action_170** v1 · grounded · clean · 2–12 performers: Rehearsing

- **prompt_action_171** v1 · playful · clean · 2–12 performers: Explaining a parking allocation

- **prompt_action_172** v1 · playful · clean · 2–12 performers: Interviewing a job candidate

- **prompt_action_173** v1 · playful · clean · 2–12 performers: Making an apology

- **prompt_action_174** v1 · grounded · clean · 2–12 performers: Reassuring someone

### Situation (411)

- **prompt_situation_001** v1 · grounded · clean · 2–12 performers: An important visitor has arrived a day early

- **prompt_situation_002** v1 · grounded · clean · 2–12 performers: Two people have promised the same room to different groups

- **prompt_situation_003** v1 · grounded · clean · 2–12 performers: The prize has been delivered to the wrong address

- **prompt_situation_004** v1 · grounded · clean · 2–12 performers: Everyone remembers a different version of the plan

- **prompt_situation_005** v1 · grounded · clean · 2–12 performers: The opening ceremony starts in five minutes

- **prompt_situation_006** v1 · grounded · clean · 2–12 performers: A familiar object has appeared in a strange place

- **prompt_situation_007** v1 · grounded · clean · 2–12 performers: A routine handover includes an unexpected responsibility

- **prompt_situation_008** v1 · grounded · clean · 2–12 performers: The guest of honor wants to stay anonymous

- **prompt_situation_009** v1 · grounded · clean · 2–12 performers: A delivery contains twice as much as expected

- **prompt_situation_010** v1 · grounded · clean · 2–12 performers: The instructions end halfway through

- **prompt_situation_011** v1 · grounded · clean · 2–12 performers: A surprise party has accidentally been announced

- **prompt_situation_012** v1 · grounded · clean · 2–12 performers: The last train is waiting for one missing passenger

- **prompt_situation_013** v1 · grounded · clean · 2–12 performers: Two old rivals have been put on the same team

- **prompt_situation_014** v1 · grounded · clean · 2–12 performers: An apology has been mistaken for an invitation

- **prompt_situation_015** v1 · grounded · clean · 2–12 performers: The backup plan has become the main event

- **prompt_situation_016** v1 · grounded · clean · 2–12 performers: A tiny disagreement is delaying a grand opening

- **prompt_situation_017** v1 · grounded · clean · 2–12 performers: A beloved tradition needs a modern update

- **prompt_situation_018** v1 · grounded · clean · 2–12 performers: Someone has volunteered everyone for a contest

- **prompt_situation_019** v1 · grounded · clean · 2–12 performers: A shared project has attracted unexpected attention

- **prompt_situation_020** v1 · grounded · clean · 2–12 performers: The rehearsal has an audience nobody invited

- **prompt_situation_021** v1 · grounded · clean · 2–12 performers: A map shows a room nobody has noticed before

- **prompt_situation_022** v1 · grounded · clean · 2–12 performers: The wrong trophy has been engraved

- **prompt_situation_023** v1 · grounded · clean · 2–12 performers: A new rule makes the usual solution impossible

- **prompt_situation_024** v1 · grounded · clean · 2–12 performers: An ordinary purchase comes with a ceremonial duty

- **prompt_situation_025** v1 · grounded · clean · 2–12 performers: The person in charge has lost their voice for the day

- **prompt_situation_026** v1 · grounded · clean · 2–12 performers: Two clubs have booked the same parade float

- **prompt_situation_027** v1 · grounded · clean · 2–12 performers: An expert is asked about something outside their expertise

- **prompt_situation_028** v1 · grounded · clean · 2–12 performers: The entire menu depends on one missing ingredient

- **prompt_situation_029** v1 · grounded · clean · 2–12 performers: A mysterious thank-you note has arrived

- **prompt_situation_030** v1 · grounded · clean · 2–12 performers: A retirement party needs a last-minute replacement speaker

- **prompt_situation_031** v1 · grounded · clean · 2–12 performers: The first customer wants something very unusual

- **prompt_situation_032** v1 · grounded · clean · 2–12 performers: A time capsule has been opened too soon

- **prompt_situation_033** v1 · grounded · clean · 2–12 performers: A household object has become a local attraction

- **prompt_situation_034** v1 · grounded · clean · 2–12 performers: The meeting must end before the cake melts

- **prompt_situation_035** v1 · grounded · clean · 2–12 performers: A borrowed costume must be returned in perfect condition

- **prompt_situation_036** v1 · grounded · clean · 2–12 performers: The new sign says the opposite of what was intended

- **prompt_situation_037** v1 · grounded · clean · 2–12 performers: A routine inspection feels strangely important

- **prompt_situation_038** v1 · grounded · clean · 2–12 performers: The family recipe is missing its final instruction

- **prompt_situation_039** v1 · grounded · clean · 2–12 performers: An old promise is suddenly due

- **prompt_situation_040** v1 · grounded · clean · 2–12 performers: A very small event has received enormous decorations

- **prompt_situation_041** v1 · grounded · clean · 2–12 performers: A shortcut has led to a much longer journey

- **prompt_situation_042** v1 · grounded · clean · 2–12 performers: Two neighbors are both sure the plant belongs to them

- **prompt_situation_043** v1 · grounded · clean · 2–12 performers: An invitation asks everyone to bring something impossible

- **prompt_situation_044** v1 · grounded · clean · 2–12 performers: A forgotten rehearsal recording has been discovered

- **prompt_situation_045** v1 · grounded · clean · 2–12 performers: A visitor mistakes volunteers for world-famous experts

- **prompt_situation_046** v1 · grounded · clean · 2–12 performers: A farewell speech turns into a new proposal

- **prompt_situation_047** v1 · grounded · clean · 2–12 performers: A competition has ended in an unexpected tie

- **prompt_situation_048** v1 · grounded · clean · 2–12 performers: A museum display needs a convincing substitute

- **prompt_situation_049** v1 · grounded · clean · 2–12 performers: The new employee knows more about the place than anyone

- **prompt_situation_050** v1 · grounded · clean · 2–12 performers: A secret gift has been given to its own purchaser

- **prompt_situation_051** v1 · grounded · clean · 2–12 performers: An outdoor event must move into a tiny room

- **prompt_situation_052** v1 · grounded · clean · 2–12 performers: A letter is delivered twenty years late

- **prompt_situation_053** v1 · grounded · clean · 2–12 performers: The only working clock is wildly inaccurate

- **prompt_situation_054** v1 · grounded · clean · 2–12 performers: The group has inherited an unfinished sculpture

- **prompt_situation_055** v1 · grounded · clean · 2–12 performers: A planned quiet evening becomes a public demonstration

- **prompt_situation_056** v1 · grounded · clean · 2–12 performers: The directions were written for a building that has changed

- **prompt_situation_057** v1 · grounded · clean · 2–12 performers: A perfectly ordinary chair has gone missing

- **prompt_situation_058** v1 · grounded · clean · 2–12 performers: Someone has labeled every box with a riddle

- **prompt_situation_059** v1 · grounded · clean · 2–12 performers: The festival mascot needs a day off

- **prompt_situation_060** v1 · grounded · clean · 2–12 performers: A long-awaited reunion starts with a mistaken identity

- **prompt_situation_061** v1 · grounded · clean · 2–12 performers: A simple favor has become an annual tradition

- **prompt_situation_062** v1 · grounded · clean · 2–12 performers: The ceremonial ribbon is far too short

- **prompt_situation_063** v1 · grounded · clean · 2–12 performers: Everyone has brought dessert and no main course

- **prompt_situation_064** v2 · grounded · clean · 2–12 performers: An exception to the rules has been proposed

- **prompt_situation_065** v1 · grounded · clean · 2–12 performers: The final page of the guest book contains a surprising message

- **prompt_situation_066** v1 · playful · clean · 2–12 performers: You hired a raccoon to plan your wedding

- **prompt_situation_067** v1 · playful · clean · 2–12 performers: Your roommate is charging your leftovers rent

- **prompt_situation_068** v1 · playful · clean · 2–12 performers: A goose has been appointed manager of your office

- **prompt_situation_069** v1 · playful · clean · 2–12 performers: Your surprise party has been sponsored by a rival surprise party

- **prompt_situation_070** v1 · playful · clean · 2–12 performers: The wedding cake has arrived in a tiny seatbelt

- **prompt_situation_071** v1 · playful · clean · 2–12 performers: Your first customer wants a refund for yesterday’s weather

- **prompt_situation_072** v1 · playful · clean · 2–12 performers: The family group chat has accidentally elected a mayor

- **prompt_situation_073** v1 · playful · clean · 2–12 performers: Your toaster has asked for a performance review

- **prompt_situation_074** v2 · playful · clean · 2–12 performers: The office plant has its own parking space

- **prompt_situation_075** v1 · playful · clean · 2–12 performers: The dog has been put in charge of the neighborhood watch

- **prompt_situation_076** v1 · playful · clean · 2–12 performers: Your restaurant’s only review was written by a pigeon

- **prompt_situation_077** v1 · playful · clean · 2–12 performers: Someone has booked a motivational speaker for your houseplants

- **prompt_situation_078** v1 · playful · clean · 2–12 performers: You accidentally sold your boss an imaginary boat

- **prompt_situation_079** v1 · playful · clean · 2–12 performers: Your roommate has installed a velvet rope around the good chair

- **prompt_situation_080** v1 · playful · clean · 2–12 performers: The museum’s newest exhibit is your missing lunch

- **prompt_situation_081** v1 · playful · clean · 2–12 performers: Your band’s manager has only ever represented magicians

- **prompt_situation_082** v1 · playful · clean · 2–12 performers: The hotel’s wake-up service sends a very disappointed goose

- **prompt_situation_083** v1 · playful · clean · 2–12 performers: The prize for winning the contest is running the contest next year

- **prompt_situation_084** v1 · playful · clean · 2–12 performers: Your cousin has hired a fog machine for a quiet family picnic

- **prompt_situation_085** v1 · playful · clean · 2–12 performers: The town’s new statue is suspiciously similar to your sandwich

- **prompt_situation_086** v1 · playful · clean · 2–12 performers: A moving company has packed the furniture into the wrong imaginary house

- **prompt_situation_087** v1 · playful · clean · 2–12 performers: Your tiny cafe is hosting a very serious spoon convention

- **prompt_situation_088** v2 · playful · clean · 2–12 performers: Someone has taken your job

- **prompt_situation_089** v1 · playful · clean · 2–12 performers: A fancy restaurant has offered you a tasting menu of toast

- **prompt_situation_090** v1 · playful · clean · 2–12 performers: The office printer has started issuing personal invitations

- **prompt_situation_091** v1 · playful · clean · 2–12 performers: Someone gave your dinner party a safety inspection

- **prompt_situation_092** v1 · playful · clean · 2–12 performers: The missing wedding rings are on a very confident pigeon

- **prompt_situation_093** v1 · playful · clean · 2–12 performers: Your neighbor has opened a gift shop for their own garden

- **prompt_situation_094** v1 · playful · clean · 2–12 performers: The landlord has declared your cupboard a luxury apartment

- **prompt_situation_095** v2 · playful · clean · 2–12 performers: An apology is owed to the town scarecrow

- **prompt_situation_096** v2 · grounded · clean · 2–12 performers: A fog delay

- **prompt_situation_097** v2 · grounded · clean · 2–12 performers: The restaurant is very popular

- **prompt_situation_098** v2 · grounded · clean · 2–12 performers: One enormous tomato has grown

- **prompt_situation_099** v2 · grounded · clean · 2–12 performers: It is after midnight

- **prompt_situation_100** v2 · grounded · clean · 2–12 performers: Opening time is approaching

- **prompt_situation_101** v2 · grounded · clean · 2–12 performers: It is the last day of business

- **prompt_situation_102** v2 · grounded · clean · 2–12 performers: There is a power cut

- **prompt_situation_103** v2 · grounded · clean · 2–12 performers: Dawn is approaching

- **prompt_situation_104** v2 · grounded · clean · 2–12 performers: A staff picnic is taking place

- **prompt_situation_105** v2 · grounded · clean · 2–12 performers: Heavy rain

- **prompt_situation_106** v2 · grounded · clean · 2–12 performers: The apartment is crowded

- **prompt_situation_107** v2 · grounded · clean · 2–12 performers: A talent show is about to begin

- **prompt_situation_108** v2 · grounded · clean · 2–12 performers: The microphone is stuck on

- **prompt_situation_109** v2 · grounded · clean · 2–12 performers: The first book signing is taking place

- **prompt_situation_110** v2 · grounded · clean · 2–12 performers: The elevator is stuck between floors

- **prompt_situation_111** v2 · grounded · clean · 2–12 performers: Closing time is approaching

- **prompt_situation_112** v2 · grounded · clean · 2–12 performers: The credits have finished

- **prompt_situation_113** v2 · grounded · clean · 2–12 performers: A charity gala is taking place

- **prompt_situation_114** v2 · grounded · clean · 2–12 performers: Unusually calm weather

- **prompt_situation_115** v2 · grounded · clean · 2–12 performers: A suspiciously modern item has appeared

- **prompt_situation_116** v2 · grounded · clean · 2–12 performers: Two choirs have booked the same space

- **prompt_situation_117** v2 · grounded · clean · 2–12 performers: A new fountain is under discussion

- **prompt_situation_118** v2 · grounded · clean · 2–12 performers: The tourist season has ended

- **prompt_situation_119** v2 · grounded · clean · 2–12 performers: A demonstration is taking place

- **prompt_situation_120** v2 · grounded · clean · 2–12 performers: A cloudy night

- **prompt_situation_121** v2 · grounded · clean · 2–12 performers: Every costume is due back today

- **prompt_situation_122** v2 · grounded · clean · 2–12 performers: The kiln is about to open

- **prompt_situation_123** v2 · grounded · clean · 2–12 performers: An inventory is under way

- **prompt_situation_124** v2 · grounded · clean · 2–12 performers: The canal lock is crowded

- **prompt_situation_125** v2 · grounded · clean · 2–12 performers: Three weddings are scheduled

- **prompt_situation_126** v2 · grounded · clean · 2–12 performers: Two clubs have reserved the same room

- **prompt_situation_127** v2 · grounded · clean · 2–12 performers: It is noon

- **prompt_situation_128** v2 · grounded · clean · 2–12 performers: A delivery is overdue

- **prompt_situation_129** v2 · grounded · clean · 2–12 performers: A windless afternoon

- **prompt_situation_130** v2 · grounded · clean · 2–12 performers: A sculpture is about to be unveiled

- **prompt_situation_131** v2 · grounded · clean · 2–12 performers: An unlabeled box has arrived

- **prompt_situation_132** v2 · grounded · clean · 2–12 performers: League night is about to begin

- **prompt_situation_133** v2 · grounded · clean · 2–12 performers: Only one pair remains for sale

- **prompt_situation_134** v2 · grounded · clean · 2–12 performers: Only one desk is available

- **prompt_situation_135** v2 · grounded · clean · 2–12 performers: A public speaking class is taking place

- **prompt_situation_136** v2 · grounded · clean · 2–12 performers: It is a busy Saturday

- **prompt_situation_137** v2 · grounded · clean · 2–12 performers: The chairs squeak

- **prompt_situation_138** v2 · grounded · clean · 2–12 performers: Parade decorations are up

- **prompt_situation_139** v2 · grounded · clean · 2–12 performers: Unexpected hail

- **prompt_situation_140** v2 · grounded · clean · 2–12 performers: A feast is about to begin

- **prompt_situation_141** v2 · grounded · clean · 2–12 performers: An unexplained footprint has appeared

- **prompt_situation_142** v2 · playful · clean · 2–12 performers: A spoon convention has booked the same venue

- **prompt_situation_143** v2 · playful · clean · 2–12 performers: The cafe has suddenly become famous

- **prompt_situation_144** v2 · playful · clean · 2–12 performers: A strict no-boring-hats policy

- **prompt_situation_145** v2 · playful · clean · 2–12 performers: Only toast is on the menu

- **prompt_situation_146** v2 · playful · clean · 2–12 performers: The entire lounge consists of one folding chair

- **prompt_situation_147** v2 · playful · clean · 2–12 performers: The band has no instruments

- **prompt_situation_148** v2 · playful · clean · 2–12 performers: A cactus talent show is taking place

- **prompt_situation_149** v2 · playful · clean · 2–12 performers: Only enormous pencils are for sale

- **prompt_situation_150** v2 · playful · clean · 2–12 performers: One suspicious duck is under discussion

- **prompt_situation_151** v2 · playful · clean · 2–12 performers: The performers are unprepared

- **prompt_situation_152** v2 · playful · clean · 2–12 performers: The lounge is reserved for prize vegetables

- **prompt_situation_153** v2 · playful · clean · 2–12 performers: Visitors are disappointed with the maze

- **prompt_situation_154** v2 · playful · clean · 2–12 performers: A documentary about a neighbor's shed is showing

- **prompt_situation_155** v3 · grounded · clean · 2–12 performers: A family recipe has been entrusted to someone

- **prompt_situation_156** v2 · grounded · clean · 2–12 performers: The shop's first customer has arrived

- **prompt_situation_157** v2 · grounded · clean · 2–12 performers: The last crossing of the day is under way

- **prompt_situation_158** v2 · grounded · clean · 2–12 performers: A retirement handover is under way

- **prompt_situation_159** v2 · grounded · clean · 2–12 performers: A ten-year-old promise is due

- **prompt_situation_160** v2 · grounded · clean · 2–12 performers: A long sitting is coming to an end

- **prompt_situation_161** v2 · grounded · clean · 2–12 performers: A peculiar object has been donated

- **prompt_situation_162** v2 · grounded · clean · 2–12 performers: A live broadcast is under way

- **prompt_situation_163** v2 · grounded · clean · 2–12 performers: A tiny bookstore has been inherited

- **prompt_situation_164** v2 · grounded · clean · 2–12 performers: A shared garden has been discovered

- **prompt_situation_165** v2 · grounded · clean · 2–12 performers: A local legend has conflicting versions

- **prompt_situation_166** v2 · grounded · clean · 2–12 performers: An unexplained object is about to go on display

- **prompt_situation_167** v2 · grounded · clean · 2–12 performers: A famous visitor is arriving

- **prompt_situation_168** v2 · grounded · clean · 2–12 performers: An enormous order has arrived

- **prompt_situation_169** v2 · grounded · clean · 2–12 performers: The group is lost near its own town

- **prompt_situation_170** v2 · grounded · clean · 2–12 performers: A critic is about to visit

- **prompt_situation_171** v2 · grounded · clean · 2–12 performers: A small planning mistake has been discovered

- **prompt_situation_172** v2 · grounded · clean · 2–12 performers: An old promise has been discovered

- **prompt_situation_173** v2 · grounded · clean · 2–12 performers: An overnight event is being planned

- **prompt_situation_174** v2 · grounded · clean · 2–12 performers: A mysterious group booking has arrived

- **prompt_situation_175** v2 · grounded · clean · 2–12 performers: The mascot is missing

- **prompt_situation_176** v2 · grounded · clean · 2–12 performers: An unrecognizable machine needs repair

- **prompt_situation_177** v2 · playful · clean · 2–12 performers: The garden gnomes are having a public feud

- **prompt_situation_178** v2 · playful · clean · 2–12 performers: The office plant has been promoted

- **prompt_situation_179** v2 · playful · clean · 2–12 performers: The exhibit appears to be someone's missing lunch

- **prompt_situation_180** v2 · playful · clean · 2–12 performers: The band has been booked as magicians

- **prompt_situation_181** v2 · playful · clean · 2–12 performers: A cupboard has been listed as a luxury apartment

- **prompt_situation_182** v2 · playful · clean · 2–12 performers: The office plant may need a business card

- **prompt_situation_183** v2 · playful · clean · 2–12 performers: The wedding planner is a raccoon

- **prompt_situation_184** v2 · playful · clean · 2–12 performers: A duck has become extremely popular

- **prompt_situation_185** v2 · playful · clean · 2–12 performers: A royal toast inspection is approaching

- **prompt_situation_186** v2 · playful · clean · 2–12 performers: The houseplant has become the manager

- **prompt_situation_187** v2 · playful · clean · 2–12 performers: Complaints have arrived from imaginary pets

- **prompt_situation_188** v2 · grounded · clean · 2–12 performers: The theater is struggling

- **prompt_situation_189** v2 · grounded · clean · 2–12 performers: Too many promises have been made

- **prompt_situation_190** v2 · grounded · clean · 2–12 performers: Conflicting memories

- **prompt_situation_191** v2 · playful · clean · 2–12 performers: The meeting may be a secret job interview

- **prompt_situation_192** v2 · playful · clean · 2–12 performers: An imaginary promotion is available

- **prompt_situation_193** v2 · grounded · clean · 2–12 performers: The suitcase will not close

- **prompt_situation_194** v2 · grounded · clean · 2–12 performers: The shelf is unstable

- **prompt_situation_195** v2 · grounded · clean · 2–12 performers: The instructions are missing

- **prompt_situation_196** v2 · grounded · clean · 2–12 performers: Unexpected guests have arrived

- **prompt_situation_197** v2 · grounded · clean · 2–12 performers: There is too little icing

- **prompt_situation_198** v2 · grounded · clean · 2–12 performers: An important meeting is approaching

- **prompt_situation_199** v2 · grounded · clean · 2–12 performers: The packet is noisy

- **prompt_situation_200** v2 · grounded · clean · 2–12 performers: An unusual ceremony is taking place

- **prompt_situation_201** v2 · grounded · clean · 2–12 performers: The containers are unsuitable

- **prompt_situation_202** v2 · grounded · clean · 2–12 performers: One letter is missing

- **prompt_situation_203** v2 · grounded · clean · 2–12 performers: Windy weather

- **prompt_situation_204** v2 · grounded · clean · 2–12 performers: There is one extra puzzle piece

- **prompt_situation_205** v2 · grounded · clean · 2–12 performers: A long journey is ahead

- **prompt_situation_206** v2 · grounded · clean · 2–12 performers: Rainy weather

- **prompt_situation_207** v2 · grounded · clean · 2–12 performers: The curtain is about to rise

- **prompt_situation_208** v2 · grounded · clean · 2–12 performers: A special visitor is expected

- **prompt_situation_209** v2 · playful · clean · 2–12 performers: A vacancy for a best friend

- **prompt_situation_210** v2 · playful · clean · 2–12 performers: A quiet picnic is taking place

- **prompt_situation_211** v3 · playful · clean · 2–12 performers: The gift must remain a surprise

- **prompt_situation_212** v2 · playful · clean · 2–12 performers: A drawer has just been tidied

- **prompt_situation_213** v2 · playful · clean · 2–12 performers: Three party guests are expected

- **prompt_situation_214** v2 · grounded · clean · 2–12 performers: A small problem has arisen

- **prompt_situation_215** v2 · grounded · clean · 2–12 performers: A misunderstanding

- **prompt_situation_216** v2 · playful · clean · 2–12 performers: Luxury-hotel standards

- **prompt_situation_2078** v1 · grounded · clean · 2–12 performers: The umbrella is imaginary

- **prompt_situation_2079** v1 · grounded · clean · 2–12 performers: The invention is imaginary

- **prompt_situation_2080** v1 · grounded · clean · 2–12 performers: A move is approaching

- **prompt_situation_2081** v1 · grounded · clean · 2–12 performers: The piano is imaginary

- **prompt_situation_2082** v1 · grounded · clean · 2–12 performers: Everyone must remain seated

- **prompt_situation_2083** v1 · grounded · clean · 2–12 performers: The train is imaginary

- **prompt_situation_2084** v1 · grounded · clean · 2–12 performers: A club meeting is approaching

- **prompt_situation_2085** v1 · grounded · clean · 2–12 performers: There are no measuring tools

- **prompt_situation_2086** v1 · grounded · clean · 2–12 performers: The shortcut is a secret

- **prompt_situation_2087** v1 · grounded · clean · 2–12 performers: A kite is stuck in a tree

- **prompt_situation_2088** v1 · grounded · clean · 2–12 performers: Only hand movements are possible

- **prompt_situation_2089** v1 · grounded · clean · 2–12 performers: The window is being cleaned from both sides

- **prompt_situation_2090** v1 · grounded · clean · 2–12 performers: The entrance must be a surprise

- **prompt_situation_2091** v1 · grounded · clean · 2–12 performers: The mail belongs to an entire street

- **prompt_situation_2092** v1 · grounded · clean · 2–12 performers: A small club needs a flag

- **prompt_situation_2093** v1 · grounded · clean · 2–12 performers: A paper-animal display is being prepared

- **prompt_situation_2094** v1 · grounded · clean · 2–12 performers: The chair may squeak

- **prompt_situation_2095** v1 · grounded · clean · 2–12 performers: The cactus is imaginary

- **prompt_situation_2096** v1 · grounded · clean · 2–12 performers: The route must be recalled from memory

- **prompt_situation_2097** v1 · grounded · clean · 2–12 performers: A celebration is approaching

- **prompt_situation_2098** v1 · playful · clean · 2–12 performers: An imaginary goat must appear in the family photograph

- **prompt_situation_2099** v1 · playful · clean · 2–12 performers: A cake has been accused of smugness

- **prompt_situation_2100** v1 · grounded · clean · 2–12 performers: Everyone in the meeting has equal standing

- **prompt_situation_2101** v1 · grounded · clean · 2–12 performers: Only one shared box remains

- **prompt_situation_2102** v1 · grounded · clean · 2–12 performers: Everyone is meeting for the first time

- **prompt_situation_2103** v1 · grounded · clean · 2–12 performers: The first pitch is approaching

- **prompt_situation_2104** v1 · grounded · clean · 2–12 performers: A borrowed item is years overdue

- **prompt_situation_2105** v1 · grounded · clean · 2–12 performers: A family reunion is approaching

- **prompt_situation_2106** v1 · grounded · clean · 2–12 performers: A comeback performance is approaching

- **prompt_situation_2107** v1 · grounded · clean · 2–12 performers: A ceremonial voyage is approaching

- **prompt_situation_2108** v1 · grounded · clean · 2–12 performers: The performance must be a surprise

- **prompt_situation_2109** v1 · grounded · clean · 2–12 performers: An anniversary broadcast is approaching

- **prompt_situation_2110** v1 · grounded · clean · 2–12 performers: A community play is approaching

- **prompt_situation_2111** v1 · grounded · clean · 2–12 performers: A band is making a comeback

- **prompt_situation_2112** v1 · grounded · clean · 2–12 performers: A first original movie is being made

- **prompt_situation_2113** v1 · grounded · clean · 2–12 performers: A family food stall is changing hands

- **prompt_situation_2114** v1 · grounded · clean · 2–12 performers: A thank-you dinner is approaching

- **prompt_situation_2115** v1 · grounded · clean · 2–12 performers: A reunion parade is approaching

- **prompt_situation_2116** v1 · playful · clean · 2–12 performers: A hired helper is a raccoon

- **prompt_situation_2117** v1 · playful · clean · 2–12 performers: The gift is unwanted

- **prompt_situation_2118** v1 · playful · clean · 2–12 performers: Only toast is on the tasting menu

- **prompt_situation_2119** v1 · playful · clean · 2–12 performers: The hotel’s guests are imaginary pets

- **prompt_situation_2120** v1 · playful · clean · 2–12 performers: The cafe is staffed by a goose

- **prompt_situation_2121** v1 · playful · clean · 2–12 performers: The picnic has an excessive budget

- **prompt_situation_2122** v1 · playful · clean · 2–12 performers: A magic show has been booked by mistake

- **prompt_situation_2123** v1 · grounded · clean · 2–12 performers: Work must finish early

- **prompt_situation_2124** v1 · grounded · clean · 2–12 performers: Every possible need must be covered

- **prompt_situation_2125** v1 · playful · clean · 2–12 performers: Everyone’s team jacket must match

- **prompt_situation_2126** v1 · playful · clean · 2–12 performers: A minor inconvenience is receiving royal treatment

- **prompt_situation_2127** v1 · playful · clean · 2–12 performers: A fog machine is urgently needed

- **prompt_situation_2128** v1 · playful · clean · 2–12 performers: A picnic requires a spreadsheet

- **prompt_situation_2129** v1 · playful · clean · 2–12 performers: Nobody understands the rules

- **prompt_situation_2130** v1 · playful · clean · 2–12 performers: A plant is being considered for equal voting rights

- **prompt_situation_2131** v1 · grounded · clean · 2–12 performers: Noise must be kept down

- **prompt_situation_2132** v1 · playful · clean · 2–12 performers: Imaginary pets have gone missing

- **prompt_situation_2133** v1 · playful · spicy · 2–12 performers: It is Valentine’s Day

- **prompt_situation_2134** v1 · playful · spicy · 2–12 performers: It is the morning after a singles party

- **prompt_situation_2135** v1 · playful · clean · 2–12 performers: The wedding clients are disorganized pigeons

- **prompt_situation_2136** v1 · playful · clean · 2–12 performers: The museum’s exhibits are mildly disappointing

- **prompt_situation_2137** v1 · playful · clean · 2–12 performers: The chairs are suspiciously comfortable

- **prompt_situation_2138** v1 · grounded · clean · 2–12 performers: An unusual achievement has been recognized

- **prompt_situation_2139** v1 · grounded · clean · 2–12 performers: A postcard has arrived from next door

- **prompt_situation_2140** v1 · grounded · clean · 2–12 performers: The whistle makes no audible sound

- **prompt_situation_2141** v1 · grounded · clean · 2–12 performers: Nobody recognizes the competition

- **prompt_situation_2142** v1 · grounded · clean · 2–12 performers: A cushion has been reserved for an ordinary potato

- **prompt_situation_2143** v1 · grounded · clean · 2–12 performers: The game board is missing

- **prompt_situation_2144** v1 · grounded · clean · 2–12 performers: A garden statue needs a scarf

- **prompt_situation_2145** v1 · grounded · clean · 2–12 performers: A wooden spoon has been awarded a medal

- **prompt_situation_2146** v1 · grounded · clean · 2–12 performers: The nameplate contains a spelling mistake

- **prompt_situation_2147** v1 · playful · clean · 2–12 performers: The invitation is addressed to a toaster

- **prompt_situation_2148** v1 · playful · clean · 2–12 performers: A biscuit has its own velvet-rope barrier

- **prompt_situation_2149** v1 · playful · clean · 2–12 performers: A houseplant has been named employee of the month

- **prompt_situation_2150** v1 · playful · clean · 2–12 performers: An ordinary cupboard is being marketed as luxurious

- **prompt_situation_2151** v1 · playful · clean · 2–12 performers: A sandwich has its own security badge

- **prompt_situation_2152** v1 · playful · clean · 2–12 performers: A pigeon wrote the seating plan

- **prompt_situation_2153** v1 · playful · clean · 2–12 performers: Almost being on time has won an award

- **prompt_situation_2154** v1 · playful · clean · 2–12 performers: The emergency kit contains one fancy napkin

- **prompt_situation_1801** v1 · playful · clean · 2–12 performers: There's a new building rule named after you.

- **prompt_situation_1802** v1 · playful · clean · 2–12 performers: Grandma's been banned from the neighborhood group chat.

- **prompt_situation_1803** v1 · playful · clean · 2–12 performers: The office fridge now has a dress code.

- **prompt_situation_1804** v1 · playful · clean · 2–12 performers: Someone has brought a plus-one to a job interview.

- **prompt_situation_1805** v1 · playful · clean · 2–12 performers: The restaurant is taking its one-star review personally.

- **prompt_situation_1806** v1 · playful · clean · 2–12 performers: Your roommate wants a performance review.

- **prompt_situation_1807** v1 · playful · clean · 2–12 performers: The wedding has assigned seating for grudges.

- **prompt_situation_1808** v1 · playful · clean · 2–12 performers: The elevator has started accepting feedback.

- **prompt_situation_1809** v1 · playful · clean · 2–12 performers: Your neighbor is rehearsing an acceptance speech for a parking space.

- **prompt_situation_1810** v1 · playful · clean · 2–12 performers: The family group chat has appointed a spokesperson.

- **prompt_situation_1811** v1 · playful · clean · 2–12 performers: The apology came with a loyalty card.

- **prompt_situation_1812** v1 · playful · clean · 2–12 performers: Someone has organized a farewell party for a borrowed charger.

- **prompt_situation_1813** v1 · playful · clean · 2–12 performers: The potluck now requires references.

- **prompt_situation_1814** v1 · playful · clean · 2–12 performers: The lost-and-found is holding an auction.

- **prompt_situation_1815** v1 · playful · clean · 2–12 performers: The office plant has its own calendar.

- **prompt_situation_1816** v1 · playful · clean · 2–12 performers: The book club has only read the group chat.

- **prompt_situation_1817** v1 · playful · clean · 2–12 performers: The queue has elected a leader.

- **prompt_situation_1818** v1 · playful · clean · 2–12 performers: Someone has reserved a seat for their emotional baggage.

- **prompt_situation_1819** v1 · playful · clean · 2–12 performers: The bake sale has a complaints department.

- **prompt_situation_1820** v1 · playful · clean · 2–12 performers: The house meeting now has a red carpet.

- **prompt_situation_1821** v1 · playful · clean · 2–12 performers: The hotel breakfast has a strict no-boring-hats policy.

- **prompt_situation_1822** v1 · playful · clean · 2–12 performers: The building's suggestion box has resigned.

- **prompt_situation_1823** v1 · playful · clean · 2–12 performers: Someone is asking for a refund on a compliment.

- **prompt_situation_1824** v1 · playful · clean · 2–12 performers: The neighborhood watch has lost its binoculars.

- **prompt_situation_1901** v1 · playful · spicy · 2–12 performers: The first date has requested a second interview.

- **prompt_situation_1902** v1 · playful · spicy · 2–12 performers: The dating profile has a customer service number.

- **prompt_situation_1903** v1 · playful · spicy · 2–12 performers: The breakup announcement has a sponsor.

- **prompt_situation_1904** v1 · playful · spicy · 2–12 performers: Someone has brought a PowerPoint to a first date.

- **prompt_situation_1905** v1 · playful · spicy · 2–12 performers: The couples therapist has asked for separate reviews.

- **prompt_situation_1906** v1 · playful · spicy · 2–12 performers: The singles mixer has assigned seating for exes.

- **prompt_situation_1907** v1 · playful · spicy · 2–12 performers: The dating app now requires professional references.

- **prompt_situation_1908** v1 · playful · spicy · 2–12 performers: The walk of shame has a concierge.

- **prompt_situation_1909** v1 · playful · spicy · 2–12 performers: The flirting workshop has a waiting list.

- **prompt_situation_1910** v1 · playful · spicy · 2–12 performers: The honeymoon itinerary has a comments section.

- **prompt_situation_1911** v1 · playful · spicy · 2–12 performers: Someone is negotiating a friends-with-benefits renewal.

- **prompt_situation_1912** v1 · playful · spicy · 2–12 performers: The romantic getaway has a shared spreadsheet.

- **prompt_situation_1913** v1 · playful · spicy · 2–12 performers: The bachelor party has an HR department.

- **prompt_situation_1914** v1 · playful · spicy · 2–12 performers: The situationship has scheduled a quarterly review.

- **prompt_situation_1915** v1 · playful · spicy · 2–12 performers: Someone has sent a calendar invite for a booty call.

- **prompt_situation_1916** v1 · playful · spicy · 2–12 performers: The lingerie shop has introduced a loyalty tribunal.

- **prompt_situation_2000** v1 · playful · clean · 2–12 performers: The group chat has appointed a treasurer.

- **prompt_situation_2001** v1 · playful · clean · 2–12 performers: Someone has started charging for emotional support in the office.

- **prompt_situation_2002** v1 · playful · clean · 2–12 performers: The wedding seating plan now has an appeals process.

- **prompt_situation_2003** v1 · playful · clean · 2–12 performers: The neighbors are holding auditions for a new neighbor.

- **prompt_situation_2004** v1 · playful · clean · 2–12 performers: A restaurant is asking customers for references.

- **prompt_situation_2005** v1 · playful · clean · 2–12 performers: Someone brought a PowerPoint to a casual apology.

- **prompt_situation_2006** v1 · playful · clean · 2–12 performers: The family is voting on who gets to say “I told you so.”

- **prompt_situation_2007** v1 · playful · clean · 2–12 performers: The book club has finished exactly one paragraph.

- **prompt_situation_2008** v1 · playful · clean · 2–12 performers: The office has hired a consultant to choose a biscuit.

- **prompt_situation_2009** v1 · playful · clean · 2–12 performers: The apartment viewing includes an interview with the houseplant.

- **prompt_situation_2010** v1 · playful · clean · 2–12 performers: The carpool has introduced business class.

- **prompt_situation_2011** v1 · playful · clean · 2–12 performers: Someone keeps replying “per my last email” out loud.

- **prompt_situation_2012** v1 · playful · clean · 2–12 performers: A dinner guest has brought their own feedback form.

- **prompt_situation_2013** v1 · playful · clean · 2–12 performers: The dog walker has requested a performance review.

- **prompt_situation_2014** v1 · playful · clean · 2–12 performers: The potluck spreadsheet has become legally binding.

- **prompt_situation_2015** v1 · playful · clean · 2–12 performers: A hotel has introduced a strict no-boring-hats policy.

- **prompt_situation_2016** v1 · playful · clean · 2–12 performers: Someone has booked a meeting to discuss fewer meetings.

- **prompt_situation_2017** v1 · playful · clean · 2–12 performers: The neighborhood watch is investigating a suspiciously nice lawn.

- **prompt_situation_2018** v1 · playful · clean · 2–12 performers: The birthday wishes have been ranked by effort.

- **prompt_situation_2019** v1 · playful · clean · 2–12 performers: The family photo now requires a rehearsal.

- **prompt_situation_2020** v1 · playful · clean · 2–12 performers: The office microwave has been given its own calendar.

- **prompt_situation_2021** v1 · playful · clean · 2–12 performers: A roommate has started issuing invoices for small talk.

- **prompt_situation_2022** v1 · playful · clean · 2–12 performers: The reunion has a VIP section for people who replied on time.

- **prompt_situation_2023** v1 · playful · clean · 2–12 performers: Someone has hired a spokesperson for the group chat.

- **prompt_situation_2024** v1 · playful · clean · 2–12 performers: The wedding DJ is taking requests by formal application.

- **prompt_situation_2025** v1 · playful · clean · 2–12 performers: The shared fridge has elected a representative.

- **prompt_situation_2026** v1 · playful · spicy · 2–12 performers: The dating app has added a references section.

- **prompt_situation_2027** v1 · playful · spicy · 2–12 performers: The exes at the wedding have formed a table committee.

- **prompt_situation_2028** v1 · playful · spicy · 2–12 performers: The speed-dating event now has a complaints desk.

- **prompt_situation_2029** v1 · playful · spicy · 2–12 performers: A first date has brought a printed agenda.

- **prompt_situation_2030** v1 · playful · spicy · 2–12 performers: Someone has requested a probation period before becoming exclusive.

- **prompt_situation_2031** v1 · playful · spicy · 2–12 performers: A dating profile has been sent back for revisions.

- **prompt_situation_2032** v1 · playful · spicy · 2–12 performers: The couple’s soft launch has a press embargo.

- **prompt_situation_2033** v1 · playful · spicy · 2–12 performers: The breakup text has been workshopped by six friends.

- **prompt_situation_2034** v1 · playful · spicy · 2–12 performers: The singles mixer has assigned a project manager.

- **prompt_situation_2035** v1 · playful · spicy · 2–12 performers: A flirty message has accidentally become a team discussion.

- **prompt_situation_2036** v1 · playful · spicy · 2–12 performers: The romantic getaway has a chore rota.

- **prompt_situation_2037** v1 · playful · spicy · 2–12 performers: The dating app bio now needs two professional references.

- **prompt_situation_2038** v1 · playful · spicy · 2–12 performers: A love triangle has requested a scheduling app.

- **prompt_situation_2039** v1 · playful · spicy · 2–12 performers: Someone has put “good at texting back” on their résumé.

- **prompt_situation_2040** v1 · playful · spicy · 2–12 performers: The couple’s matching outfits require written approval.

- **prompt_situation_2041** v1 · playful · spicy · 2–12 performers: The honeymoon itinerary has been reviewed by an ex.

- **prompt_situation_2042** v1 · playful · spicy · 2–12 performers: A first kiss has been postponed by a calendar conflict.

- **prompt_situation_2043** v1 · playful · spicy · 2–12 performers: The anniversary gift comes with a customer satisfaction survey.

- **prompt_situation_2044** v1 · playful · spicy · 2–12 performers: The date has asked everyone to keep their flirting receipts.

- **prompt_situation_2045** v1 · playful · spicy · 2–12 performers: A situationship has introduced quarterly check-ins.

- **prompt_situation_2046** v1 · playful · spicy · 2–12 performers: The romantic playlist has been returned with notes.

- **prompt_situation_2047** v1 · playful · spicy · 2–12 performers: Someone has made a spreadsheet of mixed signals.

- **prompt_situation_2048** v1 · playful · spicy · 2–12 performers: The awkward morning-after chat has minutes and action items.

- **prompt_situation_2049** v1 · playful · spicy · 2–12 performers: A couple has brought separate slides to the relationship talk.

- **prompt_situation_2050** v1 · playful · clean · 2–12 performers: My roommate labels the air in our apartment.

- **prompt_situation_2051** v1 · playful · clean · 2–12 performers: I accidentally replied “love you” to my boss.

- **prompt_situation_2052** v1 · playful · clean · 2–12 performers: My neighbor keeps reviewing my parking.

- **prompt_situation_2053** v1 · playful · clean · 2–12 performers: I promised to bring a homemade cake. I don’t own an oven.

- **prompt_situation_2054** v1 · playful · clean · 2–12 performers: My friend keeps borrowing my personality.

- **prompt_situation_2055** v1 · playful · clean · 2–12 performers: I clapped when the plane landed. Everyone knows.

- **prompt_situation_2056** v1 · playful · clean · 2–12 performers: I waved back at someone who was waving behind me.

- **prompt_situation_2057** v1 · playful · clean · 2–12 performers: I’m in charge of a surprise party for someone who hates surprises.

- **prompt_situation_2058** v1 · playful · clean · 2–12 performers: I have two birthday dinners on the same night.

- **prompt_situation_2059** v1 · playful · clean · 2–12 performers: I’ve been calling a coworker the wrong name for a year.

- **prompt_situation_2060** v1 · playful · clean · 2–12 performers: My dog prefers the dog sitter.

- **prompt_situation_2061** v1 · playful · clean · 2–12 performers: I started a book club but haven’t read the book.

- **prompt_situation_2062** v1 · playful · clean · 2–12 performers: My parents keep commenting “who is this” on my photos.

- **prompt_situation_2063** v1 · playful · clean · 2–12 performers: I agreed to run a marathon while trying to leave a conversation.

- **prompt_situation_2064** v1 · playful · clean · 2–12 performers: The group chat thinks I’m good at organizing things.

- **prompt_situation_2065** v1 · playful · clean · 2–12 performers: I’ve forgotten why I called this meeting.

- **prompt_situation_2066** v1 · playful · spicy · 2–12 performers: My date has asked for a reference from an ex.

- **prompt_situation_2067** v1 · playful · spicy · 2–12 performers: I matched with the person who ghosted my friend.

- **prompt_situation_2068** v1 · playful · spicy · 2–12 performers: I sent a flirty text to the wrong group chat.

- **prompt_situation_2069** v1 · playful · spicy · 2–12 performers: My ex and I have the same favorite restaurant.

- **prompt_situation_2070** v1 · playful · spicy · 2–12 performers: I said “we should do this again” and now I have to.

- **prompt_situation_2071** v1 · playful · spicy · 2–12 performers: My date keeps saying “our brand.”

- **prompt_situation_2072** v1 · playful · spicy · 2–12 performers: I like someone who only replies with a thumbs-up.

- **prompt_situation_2073** v1 · playful · spicy · 2–12 performers: I need to look casual about a very carefully planned date.

- **prompt_situation_2074** v1 · playful · spicy · 2–12 performers: The person I’m flirting with thinks I’m networking.

- **prompt_situation_2075** v1 · playful · spicy · 2–12 performers: My situationship wants a job title.

- **prompt_situation_2076** v1 · playful · spicy · 2–12 performers: My date has already rated the evening.

- **prompt_situation_2077** v1 · playful · spicy · 2–12 performers: My friend keeps editing my dating profile in real time.

### Object (94)

- **prompt_object_001** v2 · grounded · clean · 2–12 performers: A large ceremonial key

- **prompt_object_002** v2 · grounded · clean · 2–12 performers: A suitcase

- **prompt_object_003** v1 · grounded · clean · 2–12 performers: A teacup with a tiny compass

- **prompt_object_004** v2 · grounded · clean · 2–12 performers: An achievement trophy

- **prompt_object_005** v1 · grounded · clean · 2–12 performers: A knitted map

- **prompt_object_006** v2 · grounded · clean · 2–12 performers: A suitcase full of envelopes

- **prompt_object_007** v1 · grounded · clean · 2–12 performers: A squeaky folding chair

- **prompt_object_008** v1 · grounded · clean · 2–12 performers: A clock with no numbers

- **prompt_object_009** v1 · grounded · clean · 2–12 performers: A jar labeled emergency sunshine

- **prompt_object_010** v1 · grounded · clean · 2–12 performers: An umbrella shaped like a leaf

- **prompt_object_011** v2 · grounded · clean · 2–12 performers: A rubber stamp

- **prompt_object_012** v2 · grounded · clean · 2–12 performers: A postcard

- **prompt_object_013** v1 · grounded · clean · 2–12 performers: A lopsided birthday cake

- **prompt_object_014** v2 · grounded · clean · 2–12 performers: A whistle

- **prompt_object_015** v1 · grounded · clean · 2–12 performers: A handwritten instruction manual

- **prompt_object_016** v2 · grounded · clean · 2–12 performers: A hat with pockets

- **prompt_object_017** v2 · grounded · clean · 2–12 performers: A competition ribbon

- **prompt_object_018** v1 · grounded · clean · 2–12 performers: A model lighthouse

- **prompt_object_019** v1 · grounded · clean · 2–12 performers: A slightly bent silver spoon

- **prompt_object_020** v2 · grounded · clean · 2–12 performers: A velvet cushion

- **prompt_object_021** v1 · grounded · clean · 2–12 performers: A box of mismatched buttons

- **prompt_object_022** v1 · grounded · clean · 2–12 performers: A tiny portable podium

- **prompt_object_023** v1 · grounded · clean · 2–12 performers: A photograph in an oversized frame

- **prompt_object_024** v1 · grounded · clean · 2–12 performers: A very long shopping list

- **prompt_object_025** v1 · grounded · clean · 2–12 performers: A lantern with a name tag

- **prompt_object_026** v1 · grounded · clean · 2–12 performers: A snow globe of the local bus stop

- **prompt_object_027** v1 · grounded · clean · 2–12 performers: A paintbrush with a ceremonial bow

- **prompt_object_028** v1 · grounded · clean · 2–12 performers: A locked lunchbox

- **prompt_object_029** v1 · grounded · clean · 2–12 performers: An inflatable crown

- **prompt_object_030** v1 · grounded · clean · 2–12 performers: A paper boat with a message

- **prompt_object_031** v1 · grounded · clean · 2–12 performers: A pair of enormous oven mitts

- **prompt_object_032** v1 · grounded · clean · 2–12 performers: A faded concert ticket

- **prompt_object_033** v1 · grounded · clean · 2–12 performers: A polished stone in a gift box

- **prompt_object_034** v2 · grounded · clean · 2–12 performers: A board game

- **prompt_object_035** v1 · grounded · clean · 2–12 performers: A bottle of invisible ink

- **prompt_object_036** v1 · grounded · clean · 2–12 performers: A measuring tape marked with moods

- **prompt_object_037** v1 · grounded · clean · 2–12 performers: A bowl full of spare keys

- **prompt_object_038** v1 · grounded · clean · 2–12 performers: A paperweight shaped like a cloud

- **prompt_object_039** v1 · grounded · clean · 2–12 performers: A miniature red carpet

- **prompt_object_040** v2 · grounded · clean · 2–12 performers: A scarf

- **prompt_object_041** v1 · grounded · clean · 2–12 performers: A giant pencil

- **prompt_object_042** v1 · grounded · clean · 2–12 performers: A watering can with a bell

- **prompt_object_043** v1 · grounded · clean · 2–12 performers: A cassette labeled do not rewind

- **prompt_object_044** v1 · grounded · clean · 2–12 performers: A tin of emergency biscuits

- **prompt_object_045** v1 · grounded · clean · 2–12 performers: A tiny door knocker

- **prompt_object_046** v1 · grounded · clean · 2–12 performers: A pillow embroidered with directions

- **prompt_object_047** v1 · grounded · clean · 2–12 performers: A folding telescope

- **prompt_object_048** v2 · grounded · clean · 2–12 performers: A jar of sand

- **prompt_object_049** v1 · grounded · clean · 2–12 performers: A book with two final chapters

- **prompt_object_050** v2 · grounded · clean · 2–12 performers: A wooden spoon

- **prompt_object_051** v2 · grounded · clean · 2–12 performers: A picnic basket

- **prompt_object_052** v1 · grounded · clean · 2–12 performers: A pocket-sized suggestion box

- **prompt_object_053** v1 · grounded · clean · 2–12 performers: A very small megaphone

- **prompt_object_054** v1 · grounded · clean · 2–12 performers: A bouquet made of paper receipts

- **prompt_object_055** v2 · grounded · clean · 2–12 performers: A map of an island

- **prompt_object_056** v1 · grounded · clean · 2–12 performers: A velvet bag of marbles

- **prompt_object_057** v2 · grounded · clean · 2–12 performers: A brass nameplate

- **prompt_object_058** v1 · grounded · clean · 2–12 performers: An invitation printed on a tea towel

- **prompt_object_059** v1 · grounded · clean · 2–12 performers: A stack of blank certificates

- **prompt_object_060** v1 · grounded · clean · 2–12 performers: A perfectly round jigsaw piece

- **prompt_object_061** v2 · playful · clean · 2–12 performers: A formal invitation

- **prompt_object_062** v2 · playful · clean · 2–12 performers: A small velvet rope

- **prompt_object_063** v2 · playful · clean · 2–12 performers: An employee-of-the-month sash

- **prompt_object_064** v2 · playful · clean · 2–12 performers: A brochure

- **prompt_object_065** v2 · playful · clean · 2–12 performers: A sandwich

- **prompt_object_066** v2 · playful · clean · 2–12 performers: A wedding seating plan

- **prompt_object_067** v2 · playful · clean · 2–12 performers: A punctuality trophy

- **prompt_object_068** v2 · playful · clean · 2–12 performers: An emergency kit

- **prompt_object_069** v2 · playful · clean · 2–12 performers: A customer complaint

- **prompt_object_070** v2 · playful · clean · 2–12 performers: An official permit

- **prompt_object_071** v2 · grounded · clean · 2–12 performers: An honesty box

- **prompt_object_072** v1 · grounded · clean · 2–12 performers: A pile of mismatched socks

- **prompt_object_073** v1 · grounded · clean · 2–12 performers: An awkwardly shaped present

- **prompt_object_074** v1 · grounded · clean · 2–12 performers: A giant map

- **prompt_object_075** v1 · grounded · clean · 2–12 performers: A valuable plant

- **prompt_object_076** v1 · grounded · clean · 2–12 performers: Two nearly identical paint samples

- **prompt_object_077** v1 · grounded · clean · 2–12 performers: A complicated remote control

- **prompt_object_078** v1 · grounded · clean · 2–12 performers: An enormous trophy

- **prompt_object_079** v1 · grounded · clean · 2–12 performers: A family photograph

- **prompt_object_080** v1 · grounded · clean · 2–12 performers: A small umbrella

- **prompt_object_081** v1 · grounded · clean · 2–12 performers: An unidentified object

- **prompt_object_082** v1 · playful · clean · 2–12 performers: A houseplant

- **prompt_object_083** v1 · playful · clean · 2–12 performers: An ordinary chair

- **prompt_object_084** v1 · playful · clean · 2–12 performers: A new toaster

- **prompt_object_085** v1 · playful · clean · 2–12 performers: A bicycle helmet

- **prompt_object_087** v1 · playful · clean · 2–12 performers: An enormous spoon

- **prompt_object_088** v1 · grounded · clean · 2–12 performers: An old instruction manual

- **prompt_object_089** v1 · playful · clean · 2–12 performers: An air fryer

- **prompt_object_090** v1 · playful · clean · 2–12 performers: An enormous fog machine

- **prompt_object_091** v1 · playful · clean · 2–12 performers: An office printer

- **prompt_object_092** v1 · playful · clean · 2–12 performers: A potato

- **prompt_object_093** v1 · playful · clean · 2–12 performers: An ordinary spoon

- **prompt_object_094** v1 · grounded · clean · 2–12 performers: An empty box

- **prompt_object_095** v1 · playful · clean · 2–12 performers: A puppet

### Genre (25)

- **prompt_genre_001** v1 · grounded · clean · 2–12 performers: Film noir

- **prompt_genre_002** v1 · grounded · clean · 2–12 performers: Family sitcom

- **prompt_genre_003** v1 · grounded · clean · 2–12 performers: Space adventure

- **prompt_genre_004** v1 · grounded · clean · 2–12 performers: Cozy mystery

- **prompt_genre_005** v1 · grounded · clean · 2–12 performers: Nature documentary

- **prompt_genre_006** v1 · grounded · clean · 2–12 performers: Historical epic

- **prompt_genre_007** v1 · grounded · clean · 2–12 performers: Silent film

- **prompt_genre_008** v1 · grounded · clean · 2–12 performers: Sports commentary

- **prompt_genre_009** v1 · grounded · clean · 2–12 performers: Fairy tale

- **prompt_genre_010** v1 · grounded · clean · 2–12 performers: Cooking competition

- **prompt_genre_011** v1 · grounded · clean · 2–12 performers: Radio drama

- **prompt_genre_012** v1 · grounded · clean · 2–12 performers: Gentle romantic comedy

- **prompt_genre_013** v1 · grounded · clean · 2–12 performers: Swashbuckling adventure

- **prompt_genre_014** v1 · grounded · clean · 2–12 performers: Public information film

- **prompt_genre_015** v1 · grounded · clean · 2–12 performers: Soap opera

- **prompt_genre_016** v1 · grounded · clean · 2–12 performers: Heist caper

- **prompt_genre_017** v2 · grounded · clean · 2–12 performers: Musical

- **prompt_genre_018** v1 · grounded · clean · 2–12 performers: Retro science fiction

- **prompt_genre_019** v1 · grounded · clean · 2–12 performers: Travel documentary

- **prompt_genre_020** v1 · grounded · clean · 2–12 performers: Courtroom drama

- **prompt_genre_021** v1 · grounded · clean · 2–12 performers: Fantasy quest

- **prompt_genre_022** v1 · grounded · clean · 2–12 performers: Small-town comedy

- **prompt_genre_023** v1 · grounded · clean · 2–12 performers: Detective serial

- **prompt_genre_024** v1 · grounded · clean · 2–12 performers: Mockumentary

- **prompt_genre_025** v1 · grounded · clean · 2–12 performers: Weather broadcast

### Opening line (85)

- **prompt_opening_line_001** v1 · grounded · clean · 2–12 performers: I specifically asked you not to bring that.

- **prompt_opening_line_002** v1 · grounded · clean · 2–12 performers: That is definitely not where we left it.

- **prompt_opening_line_003** v1 · grounded · clean · 2–12 performers: We have five minutes to look like we belong here.

- **prompt_opening_line_004** v1 · grounded · clean · 2–12 performers: I thought you said this was a small gathering.

- **prompt_opening_line_005** v1 · grounded · clean · 2–12 performers: Please tell me you kept the receipt.

- **prompt_opening_line_006** v1 · grounded · clean · 2–12 performers: I have a very reasonable explanation for the balloons.

- **prompt_opening_line_007** v1 · grounded · clean · 2–12 performers: You are going to want to sit down for this.

- **prompt_opening_line_008** v1 · grounded · clean · 2–12 performers: Someone has been rearranging the labels again.

- **prompt_opening_line_009** v1 · grounded · clean · 2–12 performers: Before you open that, I should explain.

- **prompt_opening_line_010** v1 · grounded · clean · 2–12 performers: This is either a very good sign or a very bad map.

- **prompt_opening_line_011** v1 · grounded · clean · 2–12 performers: I practiced this conversation on the bus.

- **prompt_opening_line_012** v1 · grounded · clean · 2–12 performers: The cake knows too much.

- **prompt_opening_line_013** v1 · grounded · clean · 2–12 performers: We cannot keep calling it a temporary solution.

- **prompt_opening_line_014** v1 · grounded · clean · 2–12 performers: I brought the backup, but not the original.

- **prompt_opening_line_015** v1 · grounded · clean · 2–12 performers: Why is my name on the trophy?

- **prompt_opening_line_016** v1 · grounded · clean · 2–12 performers: I promised them we were experts.

- **prompt_opening_line_017** v1 · grounded · clean · 2–12 performers: This was much easier in rehearsal.

- **prompt_opening_line_018** v1 · grounded · clean · 2–12 performers: I know we agreed to keep it simple.

- **prompt_opening_line_019** v1 · grounded · clean · 2–12 performers: Do you hear that, or is it just the refrigerator?

- **prompt_opening_line_020** v1 · grounded · clean · 2–12 performers: Nobody mentioned the matching hats.

- **prompt_opening_line_021** v1 · grounded · clean · 2–12 performers: I think the invitation was meant for next door.

- **prompt_opening_line_022** v1 · grounded · clean · 2–12 performers: We need a plan that fits in this bag.

- **prompt_opening_line_023** v1 · grounded · clean · 2–12 performers: You look exactly like your handwriting.

- **prompt_opening_line_024** v1 · grounded · clean · 2–12 performers: The good news is the key still works.

- **prompt_opening_line_025** v1 · grounded · clean · 2–12 performers: I saved you the quietest chair.

- **prompt_opening_line_026** v1 · grounded · clean · 2–12 performers: That plant has been here longer than both of us.

- **prompt_opening_line_027** v1 · grounded · clean · 2–12 performers: I was hoping you would ask about the ladder.

- **prompt_opening_line_028** v1 · grounded · clean · 2–12 performers: We have very different definitions of ready.

- **prompt_opening_line_029** v1 · grounded · clean · 2–12 performers: They said to bring one meaningful object.

- **prompt_opening_line_030** v1 · grounded · clean · 2–12 performers: I did not realize there would be a ceremony.

- **prompt_opening_line_031** v1 · grounded · clean · 2–12 performers: I remember this room being much bigger.

- **prompt_opening_line_032** v1 · grounded · clean · 2–12 performers: The instructions say to ask a trusted friend.

- **prompt_opening_line_033** v1 · grounded · clean · 2–12 performers: You have been holding that envelope all morning.

- **prompt_opening_line_034** v1 · grounded · clean · 2–12 performers: We both know who moved the fountain.

- **prompt_opening_line_035** v1 · grounded · clean · 2–12 performers: This is the third time the sign has changed.

- **prompt_opening_line_036** v1 · grounded · clean · 2–12 performers: I have been saving the last biscuit for this.

- **prompt_opening_line_037** v1 · grounded · clean · 2–12 performers: There is no graceful way to carry a tuba.

- **prompt_opening_line_038** v1 · grounded · clean · 2–12 performers: You never told me you were the founder.

- **prompt_opening_line_039** v1 · grounded · clean · 2–12 performers: I thought we were voting on the color.

- **prompt_opening_line_040** v1 · grounded · clean · 2–12 performers: I can explain the footprints, but not the glitter.

- **prompt_opening_line_041** v1 · grounded · clean · 2–12 performers: Someone has to make the first announcement.

- **prompt_opening_line_042** v1 · grounded · clean · 2–12 performers: We are not leaving without the little wheel.

- **prompt_opening_line_043** v1 · grounded · clean · 2–12 performers: I kept your terrible drawing.

- **prompt_opening_line_044** v1 · grounded · clean · 2–12 performers: I have one question about the emergency snacks.

- **prompt_opening_line_045** v1 · grounded · clean · 2–12 performers: The neighbors are waiting for our answer.

- **prompt_opening_line_046** v1 · grounded · clean · 2–12 performers: You brought the same thing I did.

- **prompt_opening_line_047** v1 · grounded · clean · 2–12 performers: This is the only photograph where everyone is awake.

- **prompt_opening_line_048** v1 · grounded · clean · 2–12 performers: I need you to pretend this was intentional.

- **prompt_opening_line_049** v1 · grounded · clean · 2–12 performers: The guest book is already full.

- **prompt_opening_line_050** v1 · grounded · clean · 2–12 performers: I learned your shortcut the long way.

- **prompt_opening_line_051** v1 · grounded · clean · 2–12 performers: We have been rehearsing the wrong song.

- **prompt_opening_line_052** v1 · grounded · clean · 2–12 performers: That is a surprisingly confident sandwich.

- **prompt_opening_line_053** v1 · grounded · clean · 2–12 performers: I am ready to return your umbrella.

- **prompt_opening_line_054** v1 · grounded · clean · 2–12 performers: The box was empty when I found it.

- **prompt_opening_line_055** v1 · grounded · clean · 2–12 performers: I do not think the mayor is joking.

- **prompt_opening_line_056** v1 · grounded · clean · 2–12 performers: We can fix this before the parade starts.

- **prompt_opening_line_057** v1 · grounded · clean · 2–12 performers: You have never called me captain before.

- **prompt_opening_line_058** v1 · grounded · clean · 2–12 performers: The last person who tried that became treasurer.

- **prompt_opening_line_059** v1 · grounded · clean · 2–12 performers: I did not know a clock could sound disappointed.

- **prompt_opening_line_060** v1 · grounded · clean · 2–12 performers: Our table is becoming a landmark.

- **prompt_opening_line_061** v1 · grounded · clean · 2–12 performers: The whole committee is outside.

- **prompt_opening_line_062** v1 · grounded · clean · 2–12 performers: I thought today was your first day too.

- **prompt_opening_line_063** v1 · grounded · clean · 2–12 performers: We need to decide what this room is for.

- **prompt_opening_line_064** v1 · grounded · clean · 2–12 performers: I brought something from the old house.

- **prompt_opening_line_065** v1 · grounded · clean · 2–12 performers: You are smiling like you know the password.

- **prompt_opening_line_066** v1 · grounded · clean · 2–12 performers: One of us has to greet the visitors.

- **prompt_opening_line_067** v1 · grounded · clean · 2–12 performers: There is a note inside the note.

- **prompt_opening_line_068** v1 · grounded · clean · 2–12 performers: We have enough ribbon for exactly one chance.

- **prompt_opening_line_069** v1 · grounded · clean · 2–12 performers: I was not expecting you to remember.

- **prompt_opening_line_070** v1 · grounded · clean · 2–12 performers: I think we finally made something that works.

- **prompt_opening_line_071** v1 · playful · clean · 2–12 performers: Before you say anything, the goose is technically our manager.

- **prompt_opening_line_072** v1 · playful · clean · 2–12 performers: I have some concerns about the wedding raccoon.

- **prompt_opening_line_073** v1 · playful · clean · 2–12 performers: Why does the fridge have a VIP section?

- **prompt_opening_line_074** v1 · playful · clean · 2–12 performers: I didn’t realize the picnic had a board of directors.

- **prompt_opening_line_075** v1 · playful · clean · 2–12 performers: The plant has asked to speak to you privately.

- **prompt_opening_line_076** v1 · playful · clean · 2–12 performers: I promised them you were a qualified sandwich expert.

- **prompt_opening_line_077** v1 · playful · clean · 2–12 performers: Someone has given the toaster my parking space.

- **prompt_opening_line_078** v1 · playful · clean · 2–12 performers: I thought the fog machine was included in the apology.

- **prompt_opening_line_079** v1 · playful · clean · 2–12 performers: We cannot keep describing the cupboard as an investment property.

- **prompt_opening_line_080** v1 · playful · clean · 2–12 performers: The cake has requested its own dressing room.

- **prompt_opening_line_081** v1 · playful · clean · 2–12 performers: I would like to appeal the duck’s decision.

- **prompt_opening_line_082** v1 · playful · clean · 2–12 performers: This is a very personal question for a delivery driver.

- **prompt_opening_line_083** v1 · playful · clean · 2–12 performers: We need to talk about your emergency napkin budget.

- **prompt_opening_line_084** v1 · playful · clean · 2–12 performers: I think the landlord has misunderstood the term open-plan.

- **prompt_opening_line_085** v1 · playful · clean · 2–12 performers: For the last time, the imaginary dragon is not a plus-one.

## Relationship role templates
The relationship ingredient remains neutral. Role assignments identify participants; they do not invent personalities or objectives.

- **rel_001** v2 · 2–2 performers: Two adult siblings
  Roles: First adult sibling; Second adult sibling.

- **rel_002** v3 · 2–2 performers: Former teammates
  Roles: First former teammate; Second former teammate.

- **rel_003** v2 · 2–2 performers: Longtime neighbors
  Roles: First neighbor; Second neighbor.

- **rel_004** v2 · 2–2 performers: Old classmates
  Roles: First classmate; Second classmate.

- **rel_005** v2 · 2–2 performers: A mentor and former apprentice
  Roles: Mentor; Former apprentice.

- **rel_006** v2 · 2–2 performers: Two cousins
  Roles: First cousin; Second cousin.

- **rel_007** v2 · 2–2 performers: Former roommates
  Roles: First former roommate; Second former roommate.

- **rel_008** v2 · 2–2 performers: A shop owner and a customer
  Roles: Shop owner; Customer.

- **rel_009** v2 · 2–2 performers: Two pen pals
  Roles: First pen pal; Second pen pal.

- **rel_010** v2 · 2–2 performers: A ferry captain and a regular passenger
  Roles: Ferry captain; Regular passenger.

- **rel_011** v2 · 2–2 performers: A librarian and their replacement
  Roles: Librarian; Replacement librarian.

- **rel_012** v2 · 2–2 performers: Two longtime friends
  Roles: First friend; Second friend.

- **rel_013** v2 · 2–2 performers: A baker and a customer
  Roles: Baker; Customer.

- **rel_014** v2 · 2–2 performers: Two rival gardeners
  Roles: First gardener; Second gardener.

- **rel_015** v2 · 2–2 performers: An artist and a model
  Roles: Artist; Model.

- **rel_016** v2 · 2–2 performers: Two co-founders
  Roles: First co-founder; Second co-founder.

- **rel_017** v2 · 2–2 performers: An adult child and a parent
  Roles: Adult child; Parent.

- **rel_018** v2 · 2–2 performers: A tour guide and a local resident
  Roles: Tour guide; Local resident.

- **rel_019** v2 · 2–2 performers: Two former bandmates
  Roles: First former bandmate; Second former bandmate.

- **rel_020** v2 · 2–2 performers: A wedding planner and a member of the wedding party
  Roles: Wedding planner; Wedding-party member.

- **rel_021** v2 · 2–2 performers: Two volunteers
  Roles: First volunteer; Second volunteer.

- **rel_022** v2 · 2–2 performers: A museum curator and a donor
  Roles: Museum curator; Donor.

- **rel_023** v2 · 2–2 performers: Two longtime chess opponents
  Roles: First chess opponent; Second chess opponent.

- **rel_024** v2 · 2–2 performers: A tenant and a caretaker
  Roles: Tenant; Caretaker.

- **rel_025** v2 · 2–2 performers: Two friends
  Roles: First friend; Second friend.

- **rel_026** v2 · 2–2 performers: An inventor and a tester
  Roles: Inventor; Tester.

- **rel_027** v2 · 2–2 performers: A radio host and their childhood friend
  Roles: Radio host; Childhood friend.

- **rel_028** v2 · 2–2 performers: Two regular train passengers
  Roles: First regular passenger; Second regular passenger.

- **rel_029** v2 · 2–2 performers: A newcomer and a neighborhood greeter
  Roles: Newcomer; Neighborhood greeter.

- **rel_030** v2 · 2–2 performers: Two siblings
  Roles: First sibling; Second sibling.

- **rel_031** v2 · 3–3 performers: Three former roommates
  Roles: First former roommate; Second former roommate; Third former roommate.

- **rel_032** v2 · 3–3 performers: Three adult cousins
  Roles: First adult cousin; Second adult cousin; Third adult cousin.

- **rel_033** v2 · 3–3 performers: Three former teammates
  Roles: First former teammate; Second former teammate; Third former teammate.

- **rel_034** v2 · 3–3 performers: Three co-owners
  Roles: First co-owner; Second co-owner; Third co-owner.

- **rel_035** v2 · 3–3 performers: Three old friends
  Roles: First friend; Second friend; Third friend.

- **rel_036** v2 · 3–3 performers: Three neighbors
  Roles: First neighbor; Second neighbor; Third neighbor.

- **rel_037** v2 · 3–3 performers: Three club founders
  Roles: First founder; Second founder; Third founder.

- **rel_038** v2 · 3–3 performers: Three siblings
  Roles: First sibling; Second sibling; Third sibling.

- **rel_039** v2 · 3–3 performers: Three tour guides
  Roles: First guide; Second guide; Third guide.

- **rel_040** v2 · 3–3 performers: Three fellow performers
  Roles: First performer; Second performer; Third performer.

- **rel_041** v2 · 4–12 performers: Members of a neighborhood theater board
  Roles: Theater board member 1; Theater board member 2; Theater board member 3; Theater board member 4; additional: Theater board member.

- **rel_042** v2 · 4–12 performers: Members of an extended family
  Roles: Family member 1; Family member 2; Family member 3; Family member 4; additional: Family member.

- **rel_043** v2 · 4–12 performers: Fellow volunteer gardeners
  Roles: Volunteer gardener 1; Volunteer gardener 2; Volunteer gardener 3; Volunteer gardener 4; additional: Volunteer gardener.

- **rel_044** v2 · 4–12 performers: Museum colleagues
  Roles: Museum colleague 1; Museum colleague 2; Museum colleague 3; Museum colleague 4; additional: Museum colleague.

- **rel_045** v2 · 4–12 performers: Members of a ferry crew
  Roles: Ferry crew member 1; Ferry crew member 2; Ferry crew member 3; Ferry crew member 4; additional: Ferry crew member.

- **rel_046** v2 · 4–12 performers: Members of a book club
  Roles: Book-club member 1; Book-club member 2; Book-club member 3; Book-club member 4; additional: Book-club member.

- **rel_047** v2 · 4–12 performers: Neighbors on the same street
  Roles: Neighbor 1; Neighbor 2; Neighbor 3; Neighbor 4; additional: Neighbor.

- **rel_048** v2 · 4–12 performers: Members of a choir
  Roles: Choir member 1; Choir member 2; Choir member 3; Choir member 4; additional: Choir member.

- **rel_049** v2 · 4–12 performers: Fellow amateur astronomers
  Roles: Astronomy-club member 1; Astronomy-club member 2; Astronomy-club member 3; Astronomy-club member 4; additional: Astronomy-club member.

- **rel_050** v2 · 4–12 performers: Members of a bakery team
  Roles: Bakery team member 1; Bakery team member 2; Bakery team member 3; Bakery team member 4; additional: Bakery team member.

- **rel_051** v2 · 4–12 performers: Members of a community radio crew
  Roles: Radio crew member 1; Radio crew member 2; Radio crew member 3; Radio crew member 4; additional: Radio crew member.

- **rel_052** v2 · 4–12 performers: Members of a walking club
  Roles: Walking-club member 1; Walking-club member 2; Walking-club member 3; Walking-club member 4; additional: Walking-club member.

- **rel_053** v2 · 4–12 performers: Members of a restaurant team
  Roles: Restaurant team member 1; Restaurant team member 2; Restaurant team member 3; Restaurant team member 4; additional: Restaurant team member.

- **rel_054** v2 · 4–12 performers: Members of a wedding party
  Roles: Wedding-party member 1; Wedding-party member 2; Wedding-party member 3; Wedding-party member 4; additional: Wedding-party member.

- **rel_055** v2 · 4–12 performers: Members of a school reunion committee
  Roles: Reunion committee member 1; Reunion committee member 2; Reunion committee member 3; Reunion committee member 4; additional: Reunion committee member.

- **rel_056** v2 · 4–12 performers: Members of a neighborhood council
  Roles: Council member 1; Council member 2; Council member 3; Council member 4; additional: Council member.

- **rel_057** v2 · 4–12 performers: Members of a costume team
  Roles: Costume team member 1; Costume team member 2; Costume team member 3; Costume team member 4; additional: Costume team member.

- **rel_058** v2 · 4–12 performers: Bandmates
  Roles: Bandmate 1; Bandmate 2; Bandmate 3; Bandmate 4; additional: Bandmate.

- **rel_059** v2 · 4–12 performers: Members of a boat club
  Roles: Boat-club member 1; Boat-club member 2; Boat-club member 3; Boat-club member 4; additional: Boat-club member.

- **rel_060** v2 · 4–12 performers: Members of a family
  Roles: Family member 1; Family member 2; Family member 3; Family member 4; additional: Family member.

- **rel_061** v2 · 4–12 performers: Fellow railway volunteers
  Roles: Railway volunteer 1; Railway volunteer 2; Railway volunteer 3; Railway volunteer 4; additional: Railway volunteer.

- **rel_062** v2 · 4–12 performers: Library colleagues
  Roles: Library colleague 1; Library colleague 2; Library colleague 3; Library colleague 4; additional: Library colleague.

- **rel_063** v2 · 4–12 performers: Members of a chess club
  Roles: Chess-club member 1; Chess-club member 2; Chess-club member 3; Chess-club member 4; additional: Chess-club member.

- **rel_064** v2 · 4–12 performers: Hotel colleagues
  Roles: Hotel colleague 1; Hotel colleague 2; Hotel colleague 3; Hotel colleague 4; additional: Hotel colleague.

- **rel_065** v2 · 4–12 performers: Members of a gardening cooperative
  Roles: Cooperative member 1; Cooperative member 2; Cooperative member 3; Cooperative member 4; additional: Cooperative member.

- **rel_066** v2 · 4–12 performers: Members of a local history society
  Roles: History-society member 1; History-society member 2; History-society member 3; History-society member 4; additional: History-society member.

- **rel_067** v2 · 4–12 performers: Members of a film club
  Roles: Film-club member 1; Film-club member 2; Film-club member 3; Film-club member 4; additional: Film-club member.

- **rel_068** v2 · 4–12 performers: Cousins
  Roles: Cousin 1; Cousin 2; Cousin 3; Cousin 4; additional: Cousin.

- **rel_069** v2 · 4–12 performers: Classmates in a pottery course
  Roles: Pottery classmate 1; Pottery classmate 2; Pottery classmate 3; Pottery classmate 4; additional: Pottery classmate.

- **rel_070** v2 · 4–12 performers: Members of an inventors' team
  Roles: Inventor 1; Inventor 2; Inventor 3; Inventor 4; additional: Inventor.

- **rel_071** v2 · 4–12 performers: Members of a community kitchen team
  Roles: Kitchen team member 1; Kitchen team member 2; Kitchen team member 3; Kitchen team member 4; additional: Kitchen team member.

- **rel_072** v2 · 4–12 performers: Members of a neighborhood orchestra
  Roles: Orchestra member 1; Orchestra member 2; Orchestra member 3; Orchestra member 4; additional: Orchestra member.

- **rel_073** v2 · 4–12 performers: Members of a sailing team
  Roles: Sailing team member 1; Sailing team member 2; Sailing team member 3; Sailing team member 4; additional: Sailing team member.

- **rel_074** v2 · 4–12 performers: Members of an amateur archaeology team
  Roles: Archaeology team member 1; Archaeology team member 2; Archaeology team member 3; Archaeology team member 4; additional: Archaeology team member.

- **rel_075** v2 · 4–12 performers: Members of a festival committee
  Roles: Festival committee member 1; Festival committee member 2; Festival committee member 3; Festival committee member 4; additional: Festival committee member.

- **rel_076** v2 · 4–12 performers: Members of a repair cafe team
  Roles: Repair cafe colleague 1; Repair cafe colleague 2; Repair cafe colleague 3; Repair cafe colleague 4; additional: Repair cafe colleague.

- **rel_077** v2 · 4–12 performers: Former classmates
  Roles: Former classmate 1; Former classmate 2; Former classmate 3; Former classmate 4; additional: Former classmate.

- **rel_078** v2 · 4–12 performers: Members of a planetarium crew
  Roles: Planetarium crew member 1; Planetarium crew member 2; Planetarium crew member 3; Planetarium crew member 4; additional: Planetarium crew member.

- **rel_079** v2 · 4–12 performers: Fellow cinema volunteers
  Roles: Cinema volunteer 1; Cinema volunteer 2; Cinema volunteer 3; Cinema volunteer 4; additional: Cinema volunteer.

- **rel_080** v2 · 4–12 performers: Members of a family band
  Roles: Family band member 1; Family band member 2; Family band member 3; Family band member 4; additional: Family band member.

- **rel_081** v2 · 2–2 performers: Two roommates
  Roles: First roommate; Second roommate.

- **rel_082** v2 · 2–2 performers: Two wedding planners
  Roles: First wedding planner; Second wedding planner.

- **rel_083** v2 · 2–2 performers: Two neighbors
  Roles: First neighbor; Second neighbor.

- **rel_084** v2 · 2–2 performers: An employee and their manager
  Roles: Employee; Manager.

- **rel_086** v2 · 2–2 performers: A chef and a customer
  Roles: Chef; Customer.

- **rel_088** v2 · 2–2 performers: A museum curator and a visitor
  Roles: Museum curator; Visitor.

- **rel_089** v2 · 2–2 performers: Two bandmates
  Roles: First bandmate; Second bandmate.

- **rel_091** v2 · 2–2 performers: A landlord and a tenant
  Roles: Landlord; Tenant.

- **rel_092** v2 · 2–2 performers: Two colleagues
  Roles: First colleague; Second colleague.

- **rel_093** v2 · 3–3 performers: Three friends
  Roles: First friend; Second friend; Third friend.

- **rel_094** v2 · 3–3 performers: Three adult siblings
  Roles: First sibling; Second sibling; Third sibling.

- **rel_096** v2 · 3–3 performers: Three coworkers
  Roles: First coworker; Second coworker; Third coworker.

- **rel_097** v2 · 4–12 performers: Members of a wedding committee
  Roles: Wedding committee member 1; Wedding committee member 2; Wedding committee member 3; Wedding committee member 4; additional: Wedding committee member.

- **rel_099** v2 · 4–12 performers: Members of a cafe team
  Roles: Cafe team member 1; Cafe team member 2; Cafe team member 3; Cafe team member 4; additional: Cafe team member.

- **rel_101** v2 · 4–12 performers: Members of a museum committee
  Roles: Museum committee member 1; Museum committee member 2; Museum committee member 3; Museum committee member 4; additional: Museum committee member.

- **rel_102** v2 · 4–12 performers: Office colleagues
  Roles: Office colleague 1; Office colleague 2; Office colleague 3; Office colleague 4; additional: Office colleague.

## Joke words — P1/P2/P3

- **topic_001**: candle · plural: candles · clean

- **topic_002**: umbrella · plural: umbrellas · clean

- **topic_003**: toaster · plural: toasters · clean

- **topic_004**: bicycle · plural: bicycles · clean

- **topic_005**: teapot · plural: teapots · clean

- **topic_006**: ladder · plural: ladders · clean

- **topic_007**: pillow · plural: pillows · clean

- **topic_008**: sandwich · plural: sandwiches · clean

- **topic_009**: clock · plural: clocks · clean

- **topic_010**: backpack · plural: backpacks · clean

- **topic_011**: telescope · plural: telescopes · clean

- **topic_012**: suitcase · plural: suitcases · clean

- **topic_013**: pencil · plural: pencils · clean

- **topic_014**: mirror · plural: mirrors · clean

- **topic_015**: spoon · plural: spoons · clean

- **topic_016**: fork · plural: forks · clean

- **topic_017**: plate · plural: plates · clean

- **topic_018**: bowl · plural: bowls · clean

- **topic_019**: mug · plural: mugs · clean

- **topic_020**: bottle · plural: bottles · clean

- **topic_021**: kettle · plural: kettles · clean

- **topic_022**: pan · plural: pans · clean

- **topic_023**: whisk · plural: whisks · clean

- **topic_024**: colander · plural: colanders · clean

- **topic_025**: apron · plural: aprons · clean

- **topic_026**: oven · plural: ovens · clean

- **topic_027**: fridge · plural: fridges · clean

- **topic_028**: microwave · plural: microwaves · clean

- **topic_029**: blender · plural: blenders · clean

- **topic_030**: waffle · plural: waffles · clean

- **topic_031**: pancake · plural: pancakes · clean

- **topic_032**: biscuit · plural: biscuits · clean

- **topic_033**: cookie · plural: cookies · clean

- **topic_034**: muffin · plural: muffins · clean

- **topic_035**: bagel · plural: bagels · clean

- **topic_036**: pretzel · plural: pretzels · clean

- **topic_037**: donut · plural: donuts · clean

- **topic_038**: croissant · plural: croissants · clean

- **topic_039**: cupcake · plural: cupcakes · clean

- **topic_040**: pie · plural: pies · clean

- **topic_041**: apple · plural: apples · clean

- **topic_042**: pear · plural: pears · clean

- **topic_043**: peach · plural: peaches · clean

- **topic_044**: plum · plural: plums · clean

- **topic_045**: banana · plural: bananas · clean

- **topic_046**: lemon · plural: lemons · clean

- **topic_047**: lime · plural: limes · clean

- **topic_048**: orange · plural: oranges · clean

- **topic_049**: grape · plural: grapes · clean

- **topic_050**: melon · plural: melons · clean

- **topic_051**: carrot · plural: carrots · clean

- **topic_052**: potato · plural: potatoes · clean

- **topic_053**: tomato · plural: tomatoes · clean

- **topic_054**: onion · plural: onions · clean

- **topic_055**: pumpkin · plural: pumpkins · clean

- **topic_056**: cucumber · plural: cucumbers · clean

- **topic_057**: radish · plural: radishes · clean

- **topic_058**: mushroom · plural: mushrooms · clean

- **topic_059**: pea · plural: peas · clean

- **topic_060**: bean · plural: beans · clean

- **topic_061**: chair · plural: chairs · clean

- **topic_062**: table · plural: tables · clean

- **topic_063**: sofa · plural: sofas · clean

- **topic_064**: desk · plural: desks · clean

- **topic_065**: shelf · plural: shelves · clean

- **topic_066**: cupboard · plural: cupboards · clean

- **topic_067**: drawer · plural: drawers · clean

- **topic_068**: rug · plural: rugs · clean

- **topic_069**: curtain · plural: curtains · clean

- **topic_070**: lamp · plural: lamps · clean

- **topic_071**: window · plural: windows · clean

- **topic_072**: door · plural: doors · clean

- **topic_073**: doormat · plural: doormats · clean

- **topic_074**: key · plural: keys · clean

- **topic_075**: padlock · plural: padlocks · clean

- **topic_076**: bell · plural: bells · clean

- **topic_077**: broom · plural: brooms · clean

- **topic_078**: mop · plural: mops · clean

- **topic_079**: bucket · plural: buckets · clean

- **topic_080**: sponge · plural: sponges · clean

- **topic_081**: sock · plural: socks · clean

- **topic_082**: shoe · plural: shoes · clean

- **topic_083**: boot · plural: boots · clean

- **topic_084**: slipper · plural: slippers · clean

- **topic_085**: hat · plural: hats · clean

- **topic_086**: scarf · plural: scarves · clean

- **topic_087**: glove · plural: gloves · clean

- **topic_088**: coat · plural: coats · clean

- **topic_089**: jacket · plural: jackets · clean

- **topic_090**: button · plural: buttons · clean

- **topic_091**: zipper · plural: zippers · clean

- **topic_092**: belt · plural: belts · clean

- **topic_093**: watch · plural: watches · clean

- **topic_094**: necklace · plural: necklaces · clean

- **topic_095**: bracelet · plural: bracelets · clean

- **topic_096**: brooch · plural: brooches · clean

- **topic_097**: crown · plural: crowns · clean

- **topic_098**: helmet · plural: helmets · clean

- **topic_099**: cape · plural: capes · clean

- **topic_100**: ribbon · plural: ribbons · clean

- **topic_101**: kite · plural: kites · clean

- **topic_102**: balloon · plural: balloons · clean

- **topic_103**: marble · plural: marbles · clean

- **topic_104**: puzzle · plural: puzzles · clean

- **topic_105**: domino · plural: dominoes · clean

- **topic_106**: yo-yo · plural: yo-yos · clean

- **topic_107**: doll · plural: dolls · clean

- **topic_108**: robot · plural: robots · clean

- **topic_109**: puppet · plural: puppets · clean

- **topic_110**: teddy bear · plural: teddy bears · clean

- **topic_111**: drum · plural: drums · clean

- **topic_112**: trumpet · plural: trumpets · clean

- **topic_113**: tuba · plural: tubas · clean

- **topic_114**: violin · plural: violins · clean

- **topic_115**: guitar · plural: guitars · clean

- **topic_116**: piano · plural: pianos · clean

- **topic_117**: flute · plural: flutes · clean

- **topic_118**: cymbal · plural: cymbals · clean

- **topic_119**: harmonica · plural: harmonicas · clean

- **topic_120**: tambourine · plural: tambourines · clean

- **topic_121**: boat · plural: boats · clean

- **topic_122**: canoe · plural: canoes · clean

- **topic_123**: kayak · plural: kayaks · clean

- **topic_124**: train · plural: trains · clean

- **topic_125**: bus · plural: buses · clean

- **topic_126**: tram · plural: trams · clean

- **topic_127**: tractor · plural: tractors · clean

- **topic_128**: scooter · plural: scooters · clean

- **topic_129**: skateboard · plural: skateboards · clean

- **topic_130**: wheelbarrow · plural: wheelbarrows · clean

- **topic_131**: tent · plural: tents · clean

- **topic_132**: compass · plural: compasses · clean

- **topic_133**: map · plural: maps · clean

- **topic_134**: lantern · plural: lanterns · clean

- **topic_135**: thermos · plural: thermoses · clean

- **topic_136**: hammock · plural: hammocks · clean

- **topic_137**: binocular · plural: binoculars · clean

- **topic_138**: paddle · plural: paddles · clean

- **topic_139**: anchor · plural: anchors · clean

- **topic_140**: lifeboat · plural: lifeboats · clean

- **topic_141**: penguin · plural: penguins · clean

- **topic_142**: otter · plural: otters · clean

- **topic_143**: badger · plural: badgers · clean

- **topic_144**: fox · plural: foxes · clean

- **topic_145**: owl · plural: owls · clean

- **topic_146**: goose · plural: geese · clean

- **topic_147**: mouse · plural: mice · clean

- **topic_148**: sheep · plural: sheep · clean

- **topic_149**: deer · plural: deer · clean

- **topic_150**: octopus · plural: octopuses · clean

- **topic_151**: cactus · plural: cacti · clean

- **topic_152**: daisy · plural: daisies · clean

- **topic_153**: tulip · plural: tulips · clean

- **topic_154**: sunflower · plural: sunflowers · clean

- **topic_155**: fern · plural: ferns · clean

- **topic_156**: acorn · plural: acorns · clean

- **topic_157**: pinecone · plural: pinecones · clean

- **topic_158**: leaf · plural: leaves · clean

- **topic_159**: seashell · plural: seashells · clean

- **topic_160**: pebble · plural: pebbles · clean

## Private objectives — Secret Objective

- **goals_001**: Get the other person to help you carry a very awkward box

- **goals_002**: Convince someone to stay for one more cup of tea

- **goals_003**: Find out who left a thank-you note without admitting it matters to you

- **goals_004**: Persuade the group to try your new recipe

- **goals_005**: Get someone to agree to take care of your plant

- **goals_006**: Ask for help fixing something you claimed to understand

- **goals_007**: Work up the courage to offer an apology

- **goals_008**: Get the meeting finished before your cake melts

- **goals_009**: Convince someone to take a different route home

- **goals_010**: Return a borrowed object without revealing how long you kept it

- **goals_011**: Find a partner for an unusual contest

- **goals_012**: Get someone to teach you their signature skill

- **goals_013**: Persuade the group to keep an old tradition

- **goals_014**: Suggest a new tradition without criticizing the old one

- **goals_015**: Get permission to use the room for a secret celebration

- **goals_016**: Convince a friend to read your short poem

- **goals_017**: Find out whether a gift was well received

- **goals_018**: Offer someone a job without making it sound grand

- **goals_019**: Get someone to admit they remember your first meeting

- **goals_020**: Keep everyone nearby until a surprise arrives

- **goals_021**: Persuade someone to bring their instrument tomorrow

- **goals_022**: Get help remembering the words of an old song

- **goals_023**: Convince the group your shortcut is worth trying

- **goals_024**: Get someone to swap seats for a harmless personal reason

- **goals_025**: Ask someone to look after a mystery parcel

- **goals_026**: Get your friend to accept a sincere compliment

- **goals_027**: Find out what name everyone gave the stray garden gnome

- **goals_028**: Persuade someone to display your handmade sign

- **goals_029**: Get a reluctant expert to demonstrate their craft

- **goals_030**: Convince a neighbor to share a garden plot

- **goals_031**: Ask someone to be your emergency contact for a craft fair

- **goals_032**: Get a promise that an embarrassing old photo will be framed kindly

- **goals_033**: Find someone willing to rehearse a speech with you

- **goals_034**: Persuade the group to open a time capsule together

- **goals_035**: Ask a rival for honest advice

- **goals_036**: Get someone to taste a new flavor of jam

- **goals_037**: Convince a friend to help repair a stage prop

- **goals_038**: Get the group to pause for a shared photo

- **goals_039**: Ask someone to keep a small harmless surprise secret

- **goals_040**: Persuade someone to return to a club they once loved

- **goals_041**: Get help choosing a name for your tiny boat

- **goals_042**: Invite someone to your first public performance

- **goals_043**: Convince the group to postpone the vote until everyone arrives

- **goals_044**: Get someone to tell the story behind their hat

- **goals_045**: Ask permission to restore an old object

- **goals_046**: Persuade your friend to take the credit they deserve

- **goals_047**: Get someone to explain a mysterious instruction

- **goals_048**: Invite a newcomer into your old routine

- **goals_049**: Get help finding the right words for a thank-you card

- **goals_050**: Convince the group that your ordinary object belongs in the display

- **goals_051**: Get someone to leave a message in the guest book

- **goals_052**: Ask for a second chance at a small task

- **goals_053**: Persuade a friend to accept a useful hand-me-down

- **goals_054**: Get someone to reveal which song they want to hear

- **goals_055**: Convince the group to use your handmade decorations

- **goals_056**: Get someone to show you the view from their favorite spot

- **goals_057**: Ask an old teammate to join one last friendly game

- **goals_058**: Find out whether the missing key has been found

- **goals_059**: Persuade someone to keep a promise from years ago

- **goals_060**: Get everyone to agree on a small first step

## Private quirks — Party Quirks

- **quirks_001**: You treat every chair as a possible antique

- **quirks_002**: You keep offering to draw a map of the room

- **quirks_003**: You believe every object would make a good hat

- **quirks_004**: You announce tiny changes as major news

- **quirks_005**: You politely try to organize a parade

- **quirks_006**: You think the party is a rehearsal for tomorrow

- **quirks_007**: You keep checking whether objects float

- **quirks_008**: You give every snack a formal introduction

- **quirks_009**: You are secretly planning a tiny museum

- **quirks_010**: You speak as though narrating a nature documentary

- **quirks_011**: You treat the host as an expert gardener

- **quirks_012**: You keep proposing names for the room

- **quirks_013**: You behave as though the floor is a gentle boat deck

- **quirks_014**: You are looking for the perfect place for a plant

- **quirks_015**: You turn ordinary requests into ceremonial speeches

- **quirks_016**: You keep trying to trade imaginary coupons

- **quirks_017**: You believe every conversation needs a title

- **quirks_018**: You think you are here to judge a jam contest

- **quirks_019**: You ask for reviews of ordinary household objects

- **quirks_020**: You insist the room is an excellent film location

- **quirks_021**: You try to make every object more aerodynamic

- **quirks_022**: You behave as though you are testing a hotel

- **quirks_023**: You offer weather reports about different parts of the room

- **quirks_024**: You think everyone is a potential bandmate

- **quirks_025**: You keep suggesting improvements to an imaginary board game

- **quirks_026**: You are trying to find a mascot for a very small club

- **quirks_027**: You treat each arrival as a surprise celebrity guest

- **quirks_028**: You are rehearsing to be a tour guide

- **quirks_029**: You keep protecting an imaginary birthday cake

- **quirks_030**: You believe the furniture is arranged as a treasure map

- **quirks_031**: You are collecting ideas for a community festival

- **quirks_032**: You act as if every sound is a musical cue

- **quirks_033**: You are quietly preparing a ridiculous award ceremony

- **quirks_034**: You believe you have found the world's quietest room

- **quirks_035**: You keep giving imaginary objects little name tags

- **quirks_036**: You want everyone to help choose a lighthouse color

- **quirks_037**: You think the party is the launch of a tiny boat

- **quirks_038**: You treat each drink as a scientific discovery

- **quirks_039**: You are trying to recruit a team for a picnic competition

- **quirks_040**: You believe every doorway deserves a ribbon cutting

## Full game instructions

### P1 — Pickup Lines
Group: 2–12. Performers: 2–12. seated. clean.
Reveal one noun. Players take turns making a funny, clean pickup line related to the noun. In Open Mic, anyone may offer a line; in Battle, two volunteers compete and the group may vote.
Example: Word: candle. “Are you a candle? Because you light up the entire room.”
Coaching: Find a concrete property of the object, then connect it to the person with confidence.
Reflection: Which associations surprised you?

### P2 — Sex With Me Is Like
Group: 2–12. Performers: 2–12. seated. mature_suggestive.
Only show after an explicit 18+ opt-in; never in classroom-clean mode. Reveal an everyday noun. Each player finishes “Sex with me is like [noun] because...” with non-explicit, playful wordplay. Anyone can skip without explanation.
Example: Word: candle. “Sex with me is like a candle: best when there is a little spark.”
Coaching: Keep it witty and lightly suggestive, never graphic, targeted, or humiliating.
Reflection: Was the joke clear and kind?

### P3 — 185 Walk Into a Bar
Group: 2–12. Performers: 2–12. seated. clean.
The app reveals a pluralizable noun. Players begin “185 [plural nouns] walk into a bar...” and improvise a short bartender exchange or payoff. Rotate quickly; encourage absurd logic over perfect puns.
Example: Word: clocks. “185 clocks walk into a bar. The bartender says, ‘We do not have time for this.’”
Coaching: The strongest joke often uses a familiar property of the noun in an unexpected context.
Reflection: What word association made the best payoff?

### P4 — World's Worst
Group: 2–12. Performers: 2–12. seated. clean.
Reveal a profession, event, or occupation. Players step in or take turns delivering one short line or action as the world’s worst example. Reset to the same category for several quick attempts.
Example: Profession: lifeguard. “Has anyone seen my glasses? I cannot actually see the pool.”
Coaching: Be specific and commit to the character; avoid punches aimed at real identities.
Reflection: Did the character choice read immediately?

### P5 — Terrible Advice
Group: 2–12. Performers: 2–12. seated. clean.
Reveal a low-stakes everyday dilemma. Players improvise advice that is obviously absurd, impractical, or backwards. Never use real crisis, medical, or dangerous scenarios.
Example: Dilemma: keeping a houseplant alive. “Teach it to water itself. Independence builds character.”
Coaching: Make the advice comically impractical while keeping the stakes harmless.
Reflection: Did everyone recognize the absurd twist?

### P6 — Never Say That
Group: 2–12. Performers: 2–12. seated. clean.
The app reveals a social situation or location. Players offer one brief statement that would be awkwardly out of place there. Favor playful surprise rather than cruelty.
Example: At a wedding: “Okay, whose turn is it to try the cake first?”
Coaching: Use the normal expectations of the setting as the setup for the reversal.
Reflection: Which line made the setting instantly recognizable?

### G1 — Questions Only
Group: 2–12. Performers: 2–2. seated. clean.
Two performers begin a simple shared scene. Every line must be a question. If a performer makes a statement, they can recover or be replaced by a volunteer in larger groups. Keep the scene coherent, not just a question contest.
Example: A: “Did you invite my boss to dinner?” B: “Was I not supposed to?”
Coaching: Ask questions that give your partner something concrete to respond to.
Reflection: Did the questions still establish a relationship and situation?

### G2 — New Choice
Group: 2–12. Performers: 2–2. seated. clean.
Two performers start an ordinary scene. At spaced intervals the app announces NEW CHOICE. The person who just spoke immediately replaces their last statement with a different one. Continue accepting the most recent choice as true.
Example: A: “I got you roses.” CUE. A: “I got you an entire beehive.” B: “You remembered my favorite animal!”
Coaching: Replace the choice boldly, and have the partner support the new reality.
Reflection: Did the replacements become part of the scene?

### G3 — Emotion Remote
Group: 2–12. Performers: 2–3. seated. clean.
Start a simple scene. The app announces emotions at intervals; performers keep the established facts while altering their characters’ emotional point of view. Avoid choosing emotions that humiliate real participants.
Example: An ordinary hardware-store return shifts from delighted to jealous to suspicious.
Coaching: Let emotions change how you react, not the basic facts of the scene.
Reflection: Did the emotional change affect behavior rather than just volume?

### G4 — Genre Remote
Group: 2–12. Performers: 2–3. seated. clean.
Begin one consistent situation. As the app calls new genres, immediately play the same situation in that style: romantic comedy, film noir, adventure, documentary, and others.
Example: A lost library book becomes a film-noir mystery, then a high-stakes sports documentary.
Coaching: Switch voice, pacing and imagery while preserving who the characters are.
Reflection: Did the genre switch feel clear and playful?

### G5 — Freeze & Replace
Group: 3–12. Performers: 2–3. light_movement. clean.
Two players act. A waiting player calls FREEZE, then the performers stop moving. The caller gently replaces one performer in the pose and begins an entirely new scene suggested by the physical position.
Example: Two people freeze reaching upward. The newcomer says, “Please hold the ladder; I am changing the moon.”
Coaching: Use the physical pose to inspire a new situation; avoid physical contact without permission.
Reflection: Did the new opening justify the frozen pose?

### G6 — Gibberish Translator
Group: 2–12. Performers: 2–2. seated. clean.
One performer speaks in freely invented syllables. The translator explains the meaning to an audience. The speaker reacts to the translation and builds on it. Keep the fictional language playful and do not imitate real ethnic accents.
Example: Speaker: “Blim bozzoya!” Translator: “Naturally, the mayor has declared every Tuesday a festival.”
Coaching: Both players should listen and treat each translation as a real offer.
Reflection: Was the translation accepted and developed?

### G7 — Sound Effects
Group: 3–12. Performers: 3–3. light_movement. clean.
Assign two performers and one Foley artist. Generate a physical situation. The performers act while the third person invents sound effects; performers should react and let the sounds influence events.
Example: An explorer opens a cave door; the Foley artist makes an unmistakable chicken cluck.
Coaching: Make the sound effects offers that the actors can accept rather than distractions.
Reflection: Did the sound effects change what the characters did?

### G8 — Expert Interview
Group: 2–12. Performers: 2–2. seated. clean.
The app reveals an implausible expert topic. One player is a talk-show host and the other is an expert. The host asks curious specific questions; the expert answers with commitment. Exchange roles on replay.
Example: Topic: professional cloud naming. Expert: “Cirrus is very traditional, but cumulus is coming back.”
Coaching: Specific, grounded answers are funnier than nonstop random nonsense.
Reflection: Did the interviewer help the expert look brilliant?

### G9 — Surprise Line
Group: 2–12. Performers: 2–3. seated. clean.
Two people begin a scene. At spaced intervals the app reveals a short new line to the screen or announces it. A performer must say it naturally and everyone treats it as an honest part of the shared reality.
Example: Line: “This is not what I meant by a surprise.” Said naturally during a family celebration.
Coaching: Do not apologize for the surprise sentence; justify it within the scene.
Reflection: Did the unexpected line become meaningful?

### G10 — Half-Life
Group: 2–12. Performers: 2–2. seated. clean.
Perform a complete short scene once. Then repeat its major beats in 30 seconds, 15 seconds and 5 seconds as prompted by the app. The app controls segment countdowns; keep the essential story recognizable.
Example: A lost-package scene shrinks from a detailed argument to “Parcel?” “Mine!” “No!”
Coaching: Replay the relationship and major turning points, not every exact word.
Reflection: What was the essential beat that survived every replay?

### G11 — Ridiculous Infomercial
Group: 2–12. Performers: 2–3. seated. clean.
The app combines an everyday object with an impossible benefit. Two hosts alternate features, testimonials and demonstrations. They must support each invented claim as real.
Example: Product: the self-filling umbrella. “It catches your rain and delivers it back as soup.”
Coaching: Escalate one consistent absurd invention instead of changing products each line.
Reflection: Did the two hosts support a shared product idea?

### S1 — Open Scene
Group: 2–12. Performers: 2–12. seated. clean.
Select any number of Prompt Studio categories, including none for a completely open scene. Choose two to four primary performers and begin. Additional group members can watch or rotate on another round.
Example: Relationship: former rivals. The performers discover their history and location by listening.
Coaching: Define something concrete early; do not wait for the perfect joke.
Reflection: Did both performers develop the same shared reality?

### S2 — Relationship First
Group: 2–12. Performers: 2–4. seated. clean.
Generate a two- to four-person relationship in Prompt Studio and reveal it. Start the scene without specifying location or situation. Performers should show how they feel about each other through specific behavior.
Example: Relationship: two siblings competing to host the family reunion.
Coaching: Show the relationship through what you care about and the way you treat your partner.
Reflection: Did we understand how these people relate?

### S3 — Who, What, Where
Group: 2–12. Performers: 2–4. seated. clean.
Use Prompt Studio to reveal role or relationship, action or situation, and location. Give performers a few seconds to read and then have them demonstrate the shared reality through specific dialogue and behavior.
Example: A museum conservator and apprentice are restoring a suspiciously noisy portrait.
Coaching: Do not announce an exposition checklist; let the reality emerge naturally.
Reflection: Was the scene reality clear without excessive explanation?

### S4 — Secret Objective
Group: 2–12. Performers: 2–4. seated. clean.
Assign two to four performers. Show each player a unique private desire using pass-and-hide reveal before starting. The goals must be compatible with a single premise. Nobody can read the other players’ objectives unless they reveal them in character.
Example: One person wants an apology; another wants to leave early. Both are at the same reunion.
Coaching: Pursue your want while still hearing and accepting your partner.
Reflection: Did hidden wants create interesting choices without blocking?

### S5 — Status Shift
Group: 2–12. Performers: 2–4. seated. clean.
Give characters different starting status relationships, then run a scene. Halfway through, offer a subtle cue that lets the status relationship change. Status concerns behavior and confidence, not a person’s inherent worth.
Example: The nervous customer gains confidence when the powerful manager realizes they made an error.
Coaching: Play status through choices, physical behavior, and who accommodates whom.
Reflection: How did the relationship shift without narrating it?

### S6 — Three-Line Scene
Group: 2–12. Performers: 2–2. seated. clean.
Give two performers a simple relationship or location. They deliver only three total spoken lines before stopping. The aim is to make clear choices and get on the same page, not to cram in a whole story.
Example: A: “Dad, they sold the boat.” B: “After all those summers?” A: “I kept your captain’s hat.”
Coaching: Make one strong, concrete offer rather than packing in exposition.
Reflection: What can the audience infer after only three lines?

### S7 — Make the Mundane Matter
Group: 2–12. Performers: 2–3. seated. clean.
The app reveals a mundane statement or action. One performer says or does it naturally. The other responds as if it matters deeply to their relationship, without arbitrarily raising the stakes to catastrophe.
Example: A: “I put the cups away.” B: “You remembered where Mom used to keep them.”
Coaching: Connect emotional importance to a relationship, not a random emergency.
Reflection: Did an ordinary offer create a relationship?

### S8 — Heighten the Pattern
Group: 2–12. Performers: 2–4. seated. clean.
Begin a scene with one unusual behavior that makes sense to the character. Rather than adding unrelated oddities, repeat and meaningfully heighten the original pattern while the other performer supports the relationship.
Example: A neighbor politely asks permission before each increasingly tiny favor.
Coaching: Heighten through clearer consequences and reactions, not only louder or stranger choices.
Reflection: What recurring pattern did the group recognize?

### S9 — Invisible World
Group: 2–12. Performers: 2–4. light_movement. clean.
Reveal a physical location or task. Performers establish imaginary object size, weight and placement before speaking, then allow the activity to launch a scene. Leave room to move safely.
Example: Two watchmakers silently carry a huge invisible clock onto a crowded shelf.
Coaching: Remember where you placed objects and share a consistent physical space.
Reflection: Did both performers believe in the same environment?

### W1 — Yes, And
Group: 2–12. Performers: 2–12. seated. clean.
One person makes a simple fictional offer. The next acknowledges the fact and adds a useful detail; continue in a circle. Players need not literally say “yes, and” each time.
Example: “We bought a boat.” “And we named it after Grandma.” “She is demanding a captain’s hat.”
Coaching: Accept the substance of the offer, then add a detail that gives the next person room.
Reflection: Did we make one coherent world together?

### W2 — Word-at-a-Time Story
Group: 2–12. Performers: 2–12. seated. clean.
The group forms an order. Each player contributes exactly one word, moving quickly around the circle. Avoid trying to control where the story goes; practice noticing grammar and the last offer.
Example: Players: “Yesterday” / “our” / “neighbor” / “discovered” / “a” / “dragon.”
Coaching: Listen for the next possible word instead of planning a whole sentence.
Reflection: How much did the story change from the idea you expected?

### W3 — Sentence Chain
Group: 2–12. Performers: 2–12. seated. clean.
Start from one opening situation. Move in a fixed order, with each participant adding exactly one sentence that accepts the story so far. Avoid unrelated new plots.
Example: “A package arrived with no return address.” “Inside was a map of our own apartment.”
Coaching: Pick up one detail already established and make it more important.
Reflection: Did the ending connect to the beginning?

### W4 — Fortunately / Unfortunately
Group: 2–12. Performers: 2–12. seated. clean.
A player begins with an ordinary story event. Participants alternate new sentences starting Fortunately and Unfortunately. Each twist should grow from the previous turn rather than reset the story.
Example: “Unfortunately, the bus broke down.” “Fortunately, it stopped outside a bakery.”
Coaching: Make every new twist a consequence of what just happened.
Reflection: Did the story escalate logically?

### W5 — Mirror
Group: 2–12. Performers: 2–12. light_movement. clean.
Players stand or sit in pairs. One slowly moves and the other mirrors. Switch the leader, then try to move together without declaring a leader. Offer seated or hands-only options for accessibility.
Example: Two partners raise their hands together, then silently change direction as one.
Coaching: Move slowly enough that your partner can stay connected; do not turn this into a trick.
Reflection: When did it become hard to identify the leader?

### W6 — Association Chain
Group: 2–12. Performers: 2–12. seated. clean.
Reveal a starting word. Players respond in turn with the first harmless association it sparks. There are no incorrect answers; do not require explanations or criticize unexpected connections.
Example: “Rain” → “boots” → “puddles” → “frogs” → “pond.”
Coaching: Trust your first usable thought and keep the rhythm moving.
Reflection: Did anyone surprise themselves with an association?

### W7 — Character Walk
Group: 2–12. Performers: 2–12. full_movement. clean.
Offer a posture, tempo, energy, or imaginary physical trait. Players move around safely or do a seated version, letting movement suggest voice and personality. Never imitate protected characteristics.
Example: Explore a character who feels as if their shoes are much too heavy for their feet.
Coaching: Change one physical variable at a time to notice how it influences character.
Reflection: What physical adjustment instantly suggested a new person?

### W8 — Listening Echo
Group: 2–12. Performers: 2–12. seated. clean.
A player shares one fictional observation in character. The next person briefly repeats or paraphrases a key meaningful detail and contributes a new related detail. Repeat in pairs or a circle; avoid robotic verbatim repetition.
Example: A: “My boat leaves tonight.” B: “Tonight? I thought you were staying for the festival.”
Coaching: Use the echo to prove that you heard the offer and are affected by it.
Reflection: Did your response truly connect to what was said?

### T1 — Invented Shared History
Group: 2–12. Performers: 2–4. seated. clean.
Two to four performers receive a relationship and an occasion. One mentions a shared memory; the others confidently add details without contradicting the established history. Other players can take the next round.
Example: “Remember when we opened that lemonade stand?” “And it ended up on the evening news?”
Coaching: Treat your partner’s detail as something your character remembers too.
Reflection: Did the memory become specific and mutually owned?

### T2 — Character Hot Seat
Group: 2–12. Performers: 1–1. seated. clean.
The app gives a volunteer a character role. Everyone else asks short, imaginative questions. The character answers immediately while maintaining a consistent point of view. Switch volunteers each round.
Example: Character: an overconfident lighthouse keeper. “How do you sleep?” “I wink at the ships one at a time.”
Coaching: Build a consistent character perspective rather than chase random jokes.
Reflection: What did you learn about the character?

### T3 — Party Quirks
Group: 3–12. Performers: 3–6. light_movement. clean.
Assign one host and two to five guests. Show each guest a distinct harmless character quirk privately through pass-and-hide screens while the host looks away. The host then mingles and guesses each quirk. Pass and reveal must never expose other guests’ assignments.
Example: One guest thinks every chair is a celebrity; another treats the party like an international summit.
Coaching: Guests should demonstrate quirks through behavior and conversation, not simply announce them.
Reflection: Did the host receive enough clues to make fair guesses?

### T4 — Scene Relay
Group: 3–12. Performers: 2–4. seated. clean.
Two performers begin a scene. On a timed or manual rotation cue, a waiting player replaces one performer and continues the same established scene. The new person accepts the original relationships, location and situation.
Example: A cafe scene continues as new employees rotate in, each accepting the missing birthday cake.
Coaching: Carry forward at least one concrete fact from before the switch.
Reflection: Did the story stay recognizable across replacements?

### T5 — Group Statue
Group: 3–12. Performers: 3–12. full_movement. clean.
Give the group a location or event. Everyone takes a comfortable pose to form a still image; one by one, performers briefly speak a character thought, then the group brings the image to life. Provide a fully seated option.
Example: The group freezes as a chaotic airport baggage carousel and then begins speaking as employees and travelers.
Coaching: Make visual relationships legible and keep the physical space comfortable and safe.
Reflection: What story did the statue communicate before anyone spoke?

## Preserved combined examples
These original combinations remain curated references to separate ingredients. They are not misclassified as single Location or Relationship ingredients.

- **curated_prompt_location_001**: A ferry terminal during a fog delay
  Original: prompt_location_001 v1, pack 1.1.0. Ingredients: location=prompt_location_001 v2; situation=prompt_situation_096 v2.

- **curated_prompt_location_002**: The tiny kitchen of a very popular restaurant
  Original: prompt_location_002 v1, pack 1.1.0. Ingredients: location=prompt_location_002 v3; situation=prompt_situation_097 v2.

- **curated_prompt_location_004**: A rooftop garden with one enormous tomato
  Original: prompt_location_004 v1, pack 1.1.0. Ingredients: location=prompt_location_004 v2; situation=prompt_situation_098 v2.

- **curated_prompt_location_005**: An airport baggage office after midnight
  Original: prompt_location_005 v1, pack 1.1.0. Ingredients: location=prompt_location_005 v2; situation=prompt_situation_099 v2.

- **curated_prompt_location_006**: A museum gift shop before opening
  Original: prompt_location_006 v1, pack 1.1.0. Ingredients: location=prompt_location_006 v2; situation=prompt_situation_100 v2.

- **curated_prompt_location_008**: A laundromat on its last day of business
  Original: prompt_location_008 v1, pack 1.1.0. Ingredients: location=prompt_location_008 v2; situation=prompt_situation_101 v2.

- **curated_prompt_location_009**: A wedding venue during a power cut
  Original: prompt_location_009 v1, pack 1.1.0. Ingredients: location=prompt_location_009 v2; situation=prompt_situation_102 v2.

- **curated_prompt_location_010**: A neighborhood bakery before dawn
  Original: prompt_location_010 v1, pack 1.1.0. Ingredients: location=prompt_location_010 v2; situation=prompt_situation_103 v2.

- **curated_prompt_location_014**: A bus depot during a staff picnic
  Original: prompt_location_014 v1, pack 1.1.0. Ingredients: location=prompt_location_014 v2; situation=prompt_situation_104 v2.

- **curated_prompt_location_015**: A garden center in heavy rain
  Original: prompt_location_015 v1, pack 1.1.0. Ingredients: location=prompt_location_015 v2; situation=prompt_situation_105 v2.

- **curated_prompt_location_016**: The balcony of a crowded apartment
  Original: prompt_location_016 v1, pack 1.1.0. Ingredients: location=prompt_location_016 v2; situation=prompt_situation_106 v2.

- **curated_prompt_location_017**: A village hall set up for a talent show
  Original: prompt_location_017 v1, pack 1.1.0. Ingredients: location=prompt_location_017 v2; situation=prompt_situation_107 v2.

- **curated_prompt_location_018**: A radio studio with the microphone stuck on
  Original: prompt_location_018 v1, pack 1.1.0. Ingredients: location=prompt_location_018 v2; situation=prompt_situation_108 v2.

- **curated_prompt_location_020**: A campsite beside a very small lake
  Original: prompt_location_020 v1, pack 1.1.0. Ingredients: location=prompt_location_020 v2.

- **curated_prompt_location_021**: A bookstore hosting its first signing
  Original: prompt_location_021 v1, pack 1.1.0. Ingredients: location=prompt_location_021 v2; situation=prompt_situation_109 v2.

- **curated_prompt_location_022**: A hotel elevator between floors
  Original: prompt_location_022 v1, pack 1.1.0. Ingredients: location=prompt_location_022 v2; situation=prompt_situation_110 v2.

- **curated_prompt_location_023**: A community fridge at closing time
  Original: prompt_location_023 v1, pack 1.1.0. Ingredients: location=prompt_location_023 v2; situation=prompt_situation_111 v2.

- **curated_prompt_location_025**: An empty cinema after the credits
  Original: prompt_location_025 v1, pack 1.1.0. Ingredients: location=prompt_location_025 v2; situation=prompt_situation_112 v2.

- **curated_prompt_location_026**: A crowded coat check at a charity gala
  Original: prompt_location_026 v1, pack 1.1.0. Ingredients: location=prompt_location_026 v2; situation=prompt_situation_113 v2.

- **curated_prompt_location_028**: A weather station on a calm day
  Original: prompt_location_028 v1, pack 1.1.0. Ingredients: location=prompt_location_028 v2; situation=prompt_situation_114 v2.

- **curated_prompt_location_029**: An antique shop with a suspiciously modern item
  Original: prompt_location_029 v1, pack 1.1.0. Ingredients: location=prompt_location_029 v2; situation=prompt_situation_115 v2.

- **curated_prompt_location_030**: A rehearsal room shared by two choirs
  Original: prompt_location_030 v1, pack 1.1.0. Ingredients: location=prompt_location_030 v2; situation=prompt_situation_116 v2.

- **curated_prompt_location_031**: A town council meeting about a fountain
  Original: prompt_location_031 v1, pack 1.1.0. Ingredients: location=prompt_location_031 v2; situation=prompt_situation_117 v2.

- **curated_prompt_location_033**: A beach kiosk in the off season
  Original: prompt_location_033 v1, pack 1.1.0. Ingredients: location=prompt_location_033 v2; situation=prompt_situation_118 v2.

- **curated_prompt_location_034**: A kitchen showroom during a demonstration
  Original: prompt_location_034 v1, pack 1.1.0. Ingredients: location=prompt_location_034 v2; situation=prompt_situation_119 v2.

- **curated_prompt_location_035**: A tent at an amateur archaeology dig
  Original: prompt_location_035 v1, pack 1.1.0. Ingredients: location=prompt_location_035 v2.

- **curated_prompt_location_036**: An observatory on a cloudy night
  Original: prompt_location_036 v1, pack 1.1.0. Ingredients: location=prompt_location_036 v2; situation=prompt_situation_120 v2.

- **curated_prompt_location_037**: A costume rental shop on return day
  Original: prompt_location_037 v1, pack 1.1.0. Ingredients: location=prompt_location_037 v2; situation=prompt_situation_121 v2.

- **curated_prompt_location_038**: A pottery studio before the kiln opens
  Original: prompt_location_038 v1, pack 1.1.0. Ingredients: location=prompt_location_038 v2; situation=prompt_situation_122 v2.

- **curated_prompt_location_040**: A frozen food aisle during inventory
  Original: prompt_location_040 v1, pack 1.1.0. Ingredients: location=prompt_location_040 v2; situation=prompt_situation_123 v2.

- **curated_prompt_location_041**: A narrowboat at a crowded lock
  Original: prompt_location_041 v1, pack 1.1.0. Ingredients: location=prompt_location_041 v2; situation=prompt_situation_124 v2.

- **curated_prompt_location_042**: A florist preparing for three weddings
  Original: prompt_location_042 v1, pack 1.1.0. Ingredients: location=prompt_location_042 v2; situation=prompt_situation_125 v2.

- **curated_prompt_location_043**: A library room reserved by two clubs
  Original: prompt_location_043 v1, pack 1.1.0. Ingredients: location=prompt_location_043 v2; situation=prompt_situation_126 v2.

- **curated_prompt_location_045**: A small aquarium feeding station
  Original: prompt_location_045 v1, pack 1.1.0. Ingredients: location=prompt_location_045 v2.

- **curated_prompt_location_046**: A clock repair workshop at noon
  Original: prompt_location_046 v1, pack 1.1.0. Ingredients: location=prompt_location_046 v2; situation=prompt_situation_127 v2.

- **curated_prompt_location_047**: A roadside diner waiting for a delivery
  Original: prompt_location_047 v1, pack 1.1.0. Ingredients: location=prompt_location_047 v2; situation=prompt_situation_128 v2.

- **curated_prompt_location_050**: A public piano in a train station
  Original: prompt_location_050 v1, pack 1.1.0. Ingredients: location=prompt_location_050 v2.

- **curated_prompt_location_051**: A farm stand with an honesty box
  Original: prompt_location_051 v1, pack 1.1.0. Ingredients: location=prompt_location_051 v2; object=prompt_object_071 v2.

- **curated_prompt_location_052**: A sailing club during a windless afternoon
  Original: prompt_location_052 v1, pack 1.1.0. Ingredients: location=prompt_location_052 v2; situation=prompt_situation_129 v2.

- **curated_prompt_location_053**: An outdoor sculpture unveiling
  Original: prompt_location_053 v1, pack 1.1.0. Ingredients: location=prompt_location_053 v2; situation=prompt_situation_130 v2.

- **curated_prompt_location_054**: A town archive with an unlabeled box
  Original: prompt_location_054 v1, pack 1.1.0. Ingredients: location=prompt_location_054 v2; situation=prompt_situation_131 v2.

- **curated_prompt_location_055**: A bowling alley before league night
  Original: prompt_location_055 v1, pack 1.1.0. Ingredients: location=prompt_location_055 v2; situation=prompt_situation_132 v2.

- **curated_prompt_location_056**: A shoe shop selling its final pair
  Original: prompt_location_056 v1, pack 1.1.0. Ingredients: location=prompt_location_056 v2; situation=prompt_situation_133 v2.

- **curated_prompt_location_057**: A new coworking space with one desk
  Original: prompt_location_057 v1, pack 1.1.0. Ingredients: location=prompt_location_057 v2; situation=prompt_situation_134 v2.

- **curated_prompt_location_058**: A public speaking class in a basement
  Original: prompt_location_058 v1, pack 1.1.0. Ingredients: location=prompt_location_058 v2; situation=prompt_situation_135 v2.

- **curated_prompt_location_059**: A toy repair cafe on a busy Saturday
  Original: prompt_location_059 v1, pack 1.1.0. Ingredients: location=prompt_location_059 v2; situation=prompt_situation_136 v2.

- **curated_prompt_location_061**: A birdwatching hide with squeaky chairs
  Original: prompt_location_061 v1, pack 1.1.0. Ingredients: location=prompt_location_061 v2; situation=prompt_situation_137 v2.

- **curated_prompt_location_062**: A maze's customer service booth
  Original: prompt_location_062 v1, pack 1.1.0. Ingredients: location=prompt_location_062 v2.

- **curated_prompt_location_064**: A recording booth for an audio guide
  Original: prompt_location_064 v1, pack 1.1.0. Ingredients: location=prompt_location_064 v2.

- **curated_prompt_location_065**: A bridge decorated for a parade
  Original: prompt_location_065 v1, pack 1.1.0. Ingredients: location=prompt_location_065 v2; situation=prompt_situation_138 v2.

- **curated_prompt_location_066**: A picnic shelter during unexpected hail
  Original: prompt_location_066 v1, pack 1.1.0. Ingredients: location=prompt_location_066 v2; situation=prompt_situation_139 v2.

- **curated_prompt_location_067**: A warehouse storing parade floats
  Original: prompt_location_067 v1, pack 1.1.0. Ingredients: location=prompt_location_067 v2.

- **curated_prompt_location_068**: A tiny station at the end of the line
  Original: prompt_location_068 v1, pack 1.1.0. Ingredients: location=prompt_location_068 v2.

- **curated_prompt_location_069**: A community kitchen before a feast
  Original: prompt_location_069 v1, pack 1.1.0. Ingredients: location=prompt_location_069 v2; situation=prompt_situation_140 v2.

- **curated_prompt_location_070**: A greenhouse with an unexplained footprint
  Original: prompt_location_070 v1, pack 1.1.0. Ingredients: location=prompt_location_070 v2; situation=prompt_situation_141 v2.

- **curated_prompt_location_071**: The complaints desk at a very small castle
  Original: prompt_location_071 v1, pack 1.1.0. Ingredients: location=prompt_location_071 v2.

- **curated_prompt_location_072**: A luxury spa for exhausted garden gnomes
  Original: prompt_location_072 v1, pack 1.1.0. Ingredients: location=prompt_location_072 v2.

- **curated_prompt_location_073**: The back office of a competitive sandwich shop
  Original: prompt_location_073 v1, pack 1.1.0. Ingredients: location=prompt_location_073 v2.

- **curated_prompt_location_074**: A wedding venue shared with a spoon convention
  Original: prompt_location_074 v1, pack 1.1.0. Ingredients: location=prompt_location_009 v2; situation=prompt_situation_142 v2.

- **curated_prompt_location_075**: The waiting room of an imaginary dragon dentist
  Original: prompt_location_075 v1, pack 1.1.0. Ingredients: location=prompt_location_075 v3; role=prompt_role_080 v1.

- **curated_prompt_location_076**: A tiny cafe on its first day of being famous
  Original: prompt_location_076 v1, pack 1.1.0. Ingredients: location=prompt_location_076 v3; situation=prompt_situation_143 v2.

- **curated_prompt_location_077**: A hotel lobby with a strict no-boring-hats policy
  Original: prompt_location_077 v1, pack 1.1.0. Ingredients: location=prompt_location_077 v2; situation=prompt_situation_144 v2.

- **curated_prompt_location_078**: The kitchen of a restaurant that only serves toast
  Original: prompt_location_078 v1, pack 1.1.0. Ingredients: location=prompt_location_002 v3; situation=prompt_situation_145 v2.

- **curated_prompt_location_079**: A ferry’s VIP lounge, which is one folding chair
  Original: prompt_location_079 v1, pack 1.1.0. Ingredients: location=prompt_location_079 v3; situation=prompt_situation_146 v2.

- **curated_prompt_location_080**: A very official lost-and-found for imaginary pets
  Original: prompt_location_080 v1, pack 1.1.0. Ingredients: location=prompt_location_080 v3; situation=prompt_situation_2132 v1.

- **curated_prompt_location_081**: The dressing room of a band with no instruments
  Original: prompt_location_081 v1, pack 1.1.0. Ingredients: location=prompt_location_081 v2; situation=prompt_situation_147 v2.

- **curated_prompt_location_082**: A garden center hosting a cactus talent show
  Original: prompt_location_082 v1, pack 1.1.0. Ingredients: location=prompt_location_015 v2; situation=prompt_situation_148 v2.

- **curated_prompt_location_083**: The mayor’s emergency biscuit cupboard
  Original: prompt_location_083 v1, pack 1.1.0. Ingredients: location=prompt_location_083 v3; object=prompt_object_044 v1.

- **curated_prompt_location_084**: A museum gift shop that only sells enormous pencils
  Original: prompt_location_084 v1, pack 1.1.0. Ingredients: location=prompt_location_006 v2; situation=prompt_situation_149 v2.

- **curated_prompt_location_085**: A neighborhood council meeting about one suspicious duck
  Original: prompt_location_085 v1, pack 1.1.0. Ingredients: location=prompt_location_085 v2; situation=prompt_situation_150 v2.

- **curated_prompt_location_086**: A bakery’s secret cake-testing room
  Original: prompt_location_086 v1, pack 1.1.0. Ingredients: location=prompt_location_086 v3.

- **curated_prompt_location_087**: The backstage area of a deeply unprepared magic show
  Original: prompt_location_087 v1, pack 1.1.0. Ingredients: location=prompt_location_087 v2; situation=prompt_situation_151 v2.

- **curated_prompt_location_088**: An airport lounge reserved for prize vegetables
  Original: prompt_location_088 v1, pack 1.1.0. Ingredients: location=prompt_location_088 v2; situation=prompt_situation_152 v2.

- **curated_prompt_location_089**: A customer-service booth at a very disappointing maze
  Original: prompt_location_089 v1, pack 1.1.0. Ingredients: location=prompt_location_062 v2; situation=prompt_situation_153 v2.

- **curated_prompt_location_090**: A cinema showing a documentary about your neighbor’s shed
  Original: prompt_location_090 v1, pack 1.1.0. Ingredients: location=prompt_location_025 v2; situation=prompt_situation_154 v2.

- **curated_prompt_relationship_001**: Two adult siblings preparing a surprise for a parent
  Original: prompt_relationship_001 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_001 v2; action=prompt_action_081 v3.

- **curated_prompt_relationship_002**: Former teammates asked to coach their old club
  Original: prompt_relationship_002 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_002 v3; action=prompt_action_082 v3.

- **curated_prompt_relationship_003**: Longtime neighbors sharing a garden fence
  Original: prompt_relationship_003 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_003 v2; action=prompt_action_083 v3.

- **curated_prompt_relationship_004**: Old classmates reopening a time capsule
  Original: prompt_relationship_004 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_004 v2; action=prompt_action_084 v2.

- **curated_prompt_relationship_005**: A mentor and former apprentice meeting as equals
  Original: prompt_relationship_005 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_005 v2; action=prompt_action_085 v3; situation=prompt_situation_2100 v1.

- **curated_prompt_relationship_006**: Two cousins entrusted with a family recipe
  Original: prompt_relationship_006 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_006 v2; situation=prompt_situation_155 v3.

- **curated_prompt_relationship_007**: Former roommates sorting their final shared box
  Original: prompt_relationship_007 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_007 v2; action=prompt_action_086 v3; situation=prompt_situation_2101 v1.

- **curated_prompt_relationship_008**: A shop owner and their very first customer
  Original: prompt_relationship_008 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_008 v2; situation=prompt_situation_156 v2.

- **curated_prompt_relationship_009**: Two pen pals finally meeting at a station
  Original: prompt_relationship_009 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_009 v2; action=prompt_action_087 v3; situation=prompt_situation_2102 v1.

- **curated_prompt_relationship_010**: A ferry captain and a regular passenger on the last crossing
  Original: prompt_relationship_010 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_010 v2; situation=prompt_situation_157 v2.

- **curated_prompt_relationship_011**: A retiring librarian and their replacement
  Original: prompt_relationship_011 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_011 v2; situation=prompt_situation_158 v2.

- **curated_prompt_relationship_012**: Two friends who made a promise ten years ago
  Original: prompt_relationship_012 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_012 v2; situation=prompt_situation_159 v2.

- **curated_prompt_relationship_013**: A baker and a customer planning an unusual cake
  Original: prompt_relationship_013 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_013 v2; action=prompt_action_088 v3.

- **curated_prompt_relationship_014**: Two rival gardeners sharing one greenhouse
  Original: prompt_relationship_014 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_014 v2; action=prompt_action_089 v3.

- **curated_prompt_relationship_015**: An artist and a patient model after a long sitting
  Original: prompt_relationship_015 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_015 v2; situation=prompt_situation_160 v2.

- **curated_prompt_relationship_016**: Two co-founders rehearsing their first pitch
  Original: prompt_relationship_016 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_016 v2; action=prompt_action_090 v3; situation=prompt_situation_2103 v1.

- **curated_prompt_relationship_017**: An adult child helping a parent move house
  Original: prompt_relationship_017 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_017 v2; action=prompt_action_091 v2.

- **curated_prompt_relationship_018**: A tour guide and someone who grew up on the route
  Original: prompt_relationship_018 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_018 v2.

- **curated_prompt_relationship_019**: Two former bandmates tuning up again
  Original: prompt_relationship_019 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_019 v2; action=prompt_action_092 v3.

- **curated_prompt_relationship_020**: A wedding planner and a nervous best friend
  Original: prompt_relationship_020 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_020 v2; emotion=prompt_emotion_014 v1.

- **curated_prompt_relationship_021**: Two volunteers assigned to fix an old sign
  Original: prompt_relationship_021 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_021 v2; action=prompt_action_093 v3.

- **curated_prompt_relationship_022**: A curator and the donor of a peculiar object
  Original: prompt_relationship_022 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_022 v2; situation=prompt_situation_161 v2.

- **curated_prompt_relationship_023**: Two longtime chess opponents away from the board
  Original: prompt_relationship_023 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_023 v2.

- **curated_prompt_relationship_024**: A tenant and a caretaker on moving day
  Original: prompt_relationship_024 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_024 v2; action=prompt_action_094 v3.

- **curated_prompt_relationship_025**: Two friends returning something they borrowed years ago
  Original: prompt_relationship_025 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_025 v2; action=prompt_action_095 v3; situation=prompt_situation_2104 v1.

- **curated_prompt_relationship_026**: An inventor and their most honest tester
  Original: prompt_relationship_026 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_026 v2.

- **curated_prompt_relationship_027**: A radio host and their childhood friend on air
  Original: prompt_relationship_027 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_027 v2; situation=prompt_situation_162 v2.

- **curated_prompt_relationship_028**: Two people who always meet on the same train
  Original: prompt_relationship_028 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_028 v2.

- **curated_prompt_relationship_029**: A newcomer and the neighborhood's unofficial greeter
  Original: prompt_relationship_029 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_029 v2.

- **curated_prompt_relationship_030**: Two siblings learning a craft from the same old manual
  Original: prompt_relationship_030 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_030 v2; action=prompt_action_096 v3; object=prompt_object_088 v1.

- **curated_prompt_relationship_031**: Three former roommates opening a restaurant together
  Original: prompt_relationship_031 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_031 v2; action=prompt_action_097 v3.

- **curated_prompt_relationship_032**: Three adult cousins planning a family reunion
  Original: prompt_relationship_032 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_032 v2; action=prompt_action_098 v3; situation=prompt_situation_2105 v1.

- **curated_prompt_relationship_033**: Three old teammates choosing a new captain
  Original: prompt_relationship_033 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_033 v2; action=prompt_action_099 v3.

- **curated_prompt_relationship_034**: Three co-owners inheriting a tiny bookstore
  Original: prompt_relationship_034 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_034 v2; situation=prompt_situation_163 v2.

- **curated_prompt_relationship_035**: Three friends reuniting to finish an old project
  Original: prompt_relationship_035 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_035 v2; action=prompt_action_100 v3.

- **curated_prompt_relationship_036**: Three neighbors sharing a newly discovered garden
  Original: prompt_relationship_036 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_036 v2; situation=prompt_situation_164 v2.

- **curated_prompt_relationship_037**: Three club founders choosing a name at last
  Original: prompt_relationship_037 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_037 v2; action=prompt_action_101 v2.

- **curated_prompt_relationship_038**: Three siblings deciding what to put in a time capsule
  Original: prompt_relationship_038 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_038 v2; action=prompt_action_102 v3.

- **curated_prompt_relationship_039**: Three tour guides disagreeing about a local legend
  Original: prompt_relationship_039 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_039 v2; situation=prompt_situation_165 v2.

- **curated_prompt_relationship_040**: Three performers preparing their comeback show
  Original: prompt_relationship_040 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_040 v2; action=prompt_action_103 v3; situation=prompt_situation_2106 v1.

- **curated_prompt_relationship_041**: Board members of a struggling neighborhood theater planning opening night
  Original: prompt_relationship_041 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_041 v2; action=prompt_action_104 v3; situation=prompt_situation_188 v2.

- **curated_prompt_relationship_042**: Relatives coordinating a family reunion at a tiny cottage
  Original: prompt_relationship_042 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_042 v2; action=prompt_action_105 v3; location=prompt_location_091 v3; situation=prompt_situation_2105 v1.

- **curated_prompt_relationship_043**: Volunteer gardeners entering their first flower show
  Original: prompt_relationship_043 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_043 v2; action=prompt_action_106 v2.

- **curated_prompt_relationship_044**: Museum staff preparing to display an unexplained object
  Original: prompt_relationship_044 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_044 v2; situation=prompt_situation_166 v2.

- **curated_prompt_relationship_045**: A ferry crew preparing for a ceremonial voyage
  Original: prompt_relationship_045 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_045 v2; action=prompt_action_107 v3; situation=prompt_situation_2107 v1.

- **curated_prompt_relationship_046**: Members of a book club planning their first public event
  Original: prompt_relationship_046 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_046 v2; action=prompt_action_108 v2.

- **curated_prompt_relationship_047**: Neighbors organizing a street feast
  Original: prompt_relationship_047 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_047 v2; action=prompt_action_109 v3.

- **curated_prompt_relationship_048**: A choir preparing a surprise performance
  Original: prompt_relationship_048 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_048 v2; action=prompt_action_110 v3; situation=prompt_situation_2108 v1.

- **curated_prompt_relationship_049**: Amateur astronomers welcoming a famous visitor
  Original: prompt_relationship_049 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_049 v2; situation=prompt_situation_167 v2.

- **curated_prompt_relationship_050**: A bakery team filling an enormous unusual order
  Original: prompt_relationship_050 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_050 v2; situation=prompt_situation_168 v2.

- **curated_prompt_relationship_051**: A community radio crew preparing an anniversary broadcast
  Original: prompt_relationship_051 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_051 v2; action=prompt_action_111 v3; situation=prompt_situation_2109 v1.

- **curated_prompt_relationship_052**: Members of a walking club lost near their own town
  Original: prompt_relationship_052 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_052 v2; situation=prompt_situation_169 v2.

- **curated_prompt_relationship_053**: A restaurant team practicing for a critic's visit
  Original: prompt_relationship_053 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_053 v2; situation=prompt_situation_170 v2; action=prompt_action_145 v2.

- **curated_prompt_relationship_054**: A wedding party repairing a small planning mistake
  Original: prompt_relationship_054 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_054 v2; situation=prompt_situation_171 v2.

- **curated_prompt_relationship_055**: A school reunion committee discovering an old promise
  Original: prompt_relationship_055 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_055 v2; situation=prompt_situation_172 v2.

- **curated_prompt_relationship_056**: A neighborhood council choosing a new fountain
  Original: prompt_relationship_056 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_056 v2; action=prompt_action_112 v3.

- **curated_prompt_relationship_057**: A costume team preparing for a community play
  Original: prompt_relationship_057 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_057 v2; action=prompt_action_113 v3; situation=prompt_situation_2110 v1.

- **curated_prompt_relationship_058**: A band trying to agree on its comeback song
  Original: prompt_relationship_058 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_058 v2; action=prompt_action_114 v3; situation=prompt_situation_2111 v1.

- **curated_prompt_relationship_059**: Members of a boat club organizing a launch
  Original: prompt_relationship_059 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_059 v2; action=prompt_action_115 v2.

- **curated_prompt_relationship_060**: A family clearing out a beloved old workshop
  Original: prompt_relationship_060 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_060 v2; action=prompt_action_116 v3.

- **curated_prompt_relationship_061**: Volunteers restoring a miniature railway
  Original: prompt_relationship_061 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_061 v2; action=prompt_action_117 v2.

- **curated_prompt_relationship_062**: A library team preparing its first overnight event
  Original: prompt_relationship_062 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_062 v2; situation=prompt_situation_173 v2.

- **curated_prompt_relationship_063**: Members of a chess club organizing a friendly tournament
  Original: prompt_relationship_063 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_063 v2; action=prompt_action_118 v3.

- **curated_prompt_relationship_064**: A hotel staff welcoming a mysterious group booking
  Original: prompt_relationship_064 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_064 v2; situation=prompt_situation_174 v2.

- **curated_prompt_relationship_065**: A gardening cooperative dividing its first harvest
  Original: prompt_relationship_065 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_065 v2; action=prompt_action_119 v3.

- **curated_prompt_relationship_066**: A local history society opening a time capsule
  Original: prompt_relationship_066 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_066 v2; action=prompt_action_120 v2.

- **curated_prompt_relationship_067**: A film club making its first original movie
  Original: prompt_relationship_067 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_067 v2; action=prompt_action_121 v3; situation=prompt_situation_2112 v1.

- **curated_prompt_relationship_068**: A group of cousins taking over a family food stall
  Original: prompt_relationship_068 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_068 v2; action=prompt_action_122 v3; situation=prompt_situation_2113 v1.

- **curated_prompt_relationship_069**: A pottery class arranging its first exhibition
  Original: prompt_relationship_069 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_069 v2; action=prompt_action_123 v2.

- **curated_prompt_relationship_070**: A team of inventors rehearsing a product demonstration
  Original: prompt_relationship_070 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_070 v2; action=prompt_action_124 v2.

- **curated_prompt_relationship_071**: A community kitchen team preparing a thank-you dinner
  Original: prompt_relationship_071 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_071 v2; action=prompt_action_125 v3; situation=prompt_situation_2114 v1.

- **curated_prompt_relationship_072**: A neighborhood orchestra choosing a new rehearsal space
  Original: prompt_relationship_072 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_072 v2; action=prompt_action_126 v2.

- **curated_prompt_relationship_073**: Members of a sailing team waiting for the wind
  Original: prompt_relationship_073 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_073 v2; situation=prompt_situation_129 v2.

- **curated_prompt_relationship_074**: An amateur archaeology team identifying its first find
  Original: prompt_relationship_074 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_074 v2; action=prompt_action_127 v3.

- **curated_prompt_relationship_075**: A festival committee replacing a missing mascot
  Original: prompt_relationship_075 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_075 v2; situation=prompt_situation_175 v2; action=prompt_action_146 v2.

- **curated_prompt_relationship_076**: A repair cafe team trying to fix an unrecognizable machine
  Original: prompt_relationship_076 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_076 v2; situation=prompt_situation_176 v2.

- **curated_prompt_relationship_077**: A group of old classmates building a reunion float
  Original: prompt_relationship_077 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_077 v2; action=prompt_action_128 v3; situation=prompt_situation_2115 v1.

- **curated_prompt_relationship_078**: A planetarium crew rehearsing a new show
  Original: prompt_relationship_078 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_078 v2; action=prompt_action_129 v3.

- **curated_prompt_relationship_079**: Volunteers opening a tiny community cinema
  Original: prompt_relationship_079 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_079 v2; action=prompt_action_130 v3; location=prompt_location_092 v3.

- **curated_prompt_relationship_080**: A family band preparing to play at a relative's birthday
  Original: prompt_relationship_080 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_080 v2; action=prompt_action_131 v3.

- **curated_prompt_relationship_081**: Two roommates negotiating custody of an air fryer
  Original: prompt_relationship_081 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_081 v2; action=prompt_action_132 v3; object=prompt_object_089 v1.

- **curated_prompt_relationship_082**: Two wedding planners covering for the raccoon they hired
  Original: prompt_relationship_082 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_082 v2; action=prompt_action_133 v3; situation=prompt_situation_2116 v1.

- **curated_prompt_relationship_083**: Two neighbors whose garden gnomes are having a very public feud
  Original: prompt_relationship_083 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_083 v2; situation=prompt_situation_177 v2.

- **curated_prompt_relationship_084**: An employee asking their manager why the plant got promoted
  Original: prompt_relationship_084 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_084 v2; situation=prompt_situation_178 v2.

- **curated_prompt_relationship_085**: Two adult siblings trying to return the same terrible family gift
  Original: prompt_relationship_085 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_001 v2; action=prompt_action_134 v3; situation=prompt_situation_2117 v1.

- **curated_prompt_relationship_086**: A chef and a customer debating whether toast counts as a tasting menu
  Original: prompt_relationship_086 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_086 v2; action=prompt_action_135 v3; situation=prompt_situation_2118 v1.

- **curated_prompt_relationship_087**: Two friends opening a luxury hotel for imaginary pets
  Original: prompt_relationship_087 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_025 v2; action=prompt_action_136 v3; situation=prompt_situation_2119 v1.

- **curated_prompt_relationship_088**: A museum curator and a visitor who recognizes the exhibit as their lunch
  Original: prompt_relationship_088 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_088 v2; situation=prompt_situation_179 v2.

- **curated_prompt_relationship_089**: Two bandmates discovering their manager booked them as magicians
  Original: prompt_relationship_089 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_089 v2; situation=prompt_situation_180 v2.

- **curated_prompt_relationship_090**: Two cousins planning a small picnic with an enormous fog machine
  Original: prompt_relationship_090 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_006 v2; action=prompt_action_137 v3; object=prompt_object_090 v1.

- **curated_prompt_relationship_091**: A landlord and a tenant debating the cupboard’s new luxury listing
  Original: prompt_relationship_091 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_091 v2; situation=prompt_situation_181 v2.

- **curated_prompt_relationship_092**: Two colleagues writing an apology to the office printer
  Original: prompt_relationship_092 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_092 v2; action=prompt_action_138 v3; object=prompt_object_091 v1.

- **curated_prompt_relationship_093**: Three friends opening a cafe staffed by one very confident goose
  Original: prompt_relationship_093 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_093 v2; action=prompt_action_139 v3; situation=prompt_situation_2120 v1.

- **curated_prompt_relationship_094**: Three adult siblings secretly replacing a family trophy with a potato
  Original: prompt_relationship_094 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_094 v2; action=prompt_action_140 v3; object=prompt_object_092 v1.

- **curated_prompt_relationship_095**: Three neighbors rehearsing a formal apology to a duck
  Original: prompt_relationship_095 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_036 v2; action=prompt_action_141 v3; role=prompt_role_081 v1.

- **curated_prompt_relationship_096**: Three coworkers deciding whether the office plant needs a business card
  Original: prompt_relationship_096 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_096 v2; situation=prompt_situation_182 v2.

- **curated_prompt_relationship_097**: A wedding committee discovering their planner is a raccoon
  Original: prompt_relationship_097 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_097 v2; situation=prompt_situation_183 v2.

- **curated_prompt_relationship_098**: A neighborhood council deciding what to do about an extremely popular duck
  Original: prompt_relationship_098 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_056 v2; situation=prompt_situation_184 v2.

- **curated_prompt_relationship_099**: A cafe team preparing for a royal inspection of their toast
  Original: prompt_relationship_099 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_099 v2; situation=prompt_situation_185 v2.

- **curated_prompt_relationship_100**: A family organizing a tiny picnic with a wildly excessive budget
  Original: prompt_relationship_100 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_060 v2; action=prompt_action_142 v3; situation=prompt_situation_2121 v1.

- **curated_prompt_relationship_101**: A museum committee choosing a dramatic name for a very ordinary spoon
  Original: prompt_relationship_101 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_101 v2; action=prompt_action_143 v3; object=prompt_object_093 v1.

- **curated_prompt_relationship_102**: An office team welcoming the houseplant as their new manager
  Original: prompt_relationship_102 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_102 v2; situation=prompt_situation_186 v2.

- **curated_prompt_relationship_103**: A band rehearsing the magic show they were accidentally booked to perform
  Original: prompt_relationship_103 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_058 v2; action=prompt_action_144 v3; situation=prompt_situation_2122 v1.

- **curated_prompt_relationship_104**: A hotel team handling complaints from imaginary pets
  Original: prompt_relationship_104 v1, pack 1.1.0. Ingredients: relationship=prompt_relationship_064 v2; situation=prompt_situation_187 v2.

- **curated_prompt_role_001**: Self-appointed leader
  Original: prompt_role_001 v1, pack 1.1.0. Ingredients: role=prompt_role_001 v2.

- **curated_prompt_role_002**: Enthusiastic newcomer
  Original: prompt_role_002 v1, pack 1.1.0. Ingredients: role=prompt_role_002 v2.

- **curated_prompt_role_003**: Patient skeptic
  Original: prompt_role_003 v1, pack 1.1.0. Ingredients: role=prompt_role_003 v2.

- **curated_prompt_role_004**: Reluctant spokesperson
  Original: prompt_role_004 v1, pack 1.1.0. Ingredients: role=prompt_role_004 v2.

- **curated_prompt_role_005**: Keeper of the spare key
  Original: prompt_role_005 v1, pack 1.1.0. Ingredients: role=prompt_role_005 v2.

- **curated_prompt_role_006**: Person who read every instruction
  Original: prompt_role_006 v1, pack 1.1.0. Ingredients: role=prompt_role_006 v2.

- **curated_prompt_role_007**: Overprepared volunteer
  Original: prompt_role_007 v1, pack 1.1.0. Ingredients: role=prompt_role_007 v2.

- **curated_prompt_role_008**: Unflappable peacemaker
  Original: prompt_role_008 v1, pack 1.1.0. Ingredients: role=prompt_role_008 v2.

- **curated_prompt_role_009**: Secret optimist
  Original: prompt_role_009 v1, pack 1.1.0. Ingredients: role=prompt_role_009 v2.

- **curated_prompt_role_010**: Practical problem solver
  Original: prompt_role_010 v1, pack 1.1.0. Ingredients: role=prompt_role_010 v2.

- **curated_prompt_role_011**: Collector of tiny details
  Original: prompt_role_011 v1, pack 1.1.0. Ingredients: role=prompt_role_011 v2.

- **curated_prompt_role_012**: Person determined to finish early
  Original: prompt_role_012 v1, pack 1.1.0. Ingredients: role=prompt_role_012 v2; action=prompt_action_147 v3; situation=prompt_situation_2123 v1.

- **curated_prompt_role_014**: Last-minute substitute
  Original: prompt_role_014 v1, pack 1.1.0. Ingredients: role=prompt_role_014 v2.

- **curated_prompt_role_015**: Friendly rival
  Original: prompt_role_015 v1, pack 1.1.0. Ingredients: role=prompt_role_015 v2.

- **curated_prompt_role_016**: Newly promoted organizer
  Original: prompt_role_016 v1, pack 1.1.0. Ingredients: role=prompt_role_016 v2.

- **curated_prompt_role_017**: Person protecting a surprise
  Original: prompt_role_017 v1, pack 1.1.0. Ingredients: role=prompt_role_017 v2; action=prompt_action_148 v2.

- **curated_prompt_role_018**: Very literal note taker
  Original: prompt_role_018 v1, pack 1.1.0. Ingredients: role=prompt_role_018 v2.

- **curated_prompt_role_019**: Person who packed for everything
  Original: prompt_role_019 v1, pack 1.1.0. Ingredients: role=prompt_role_019 v2; action=prompt_action_149 v3; situation=prompt_situation_2124 v1.

- **curated_prompt_role_020**: Quiet expert
  Original: prompt_role_020 v1, pack 1.1.0. Ingredients: role=prompt_role_020 v2.

- **curated_prompt_role_021**: Chronic overexplainer
  Original: prompt_role_021 v1, pack 1.1.0. Ingredients: role=prompt_role_021 v2.

- **curated_prompt_role_022**: Designated navigator
  Original: prompt_role_022 v1, pack 1.1.0. Ingredients: role=prompt_role_022 v2.

- **curated_prompt_role_023**: Person who loves a checklist
  Original: prompt_role_023 v1, pack 1.1.0. Ingredients: role=prompt_role_023 v2.

- **curated_prompt_role_024**: Unofficial welcoming committee
  Original: prompt_role_024 v1, pack 1.1.0. Ingredients: role=prompt_role_024 v2.

- **curated_prompt_role_025**: Person trying to stay impartial
  Original: prompt_role_025 v1, pack 1.1.0. Ingredients: role=prompt_role_025 v2.

- **curated_prompt_role_026**: Person who promised too much
  Original: prompt_role_026 v1, pack 1.1.0. Ingredients: role=prompt_role_026 v2; situation=prompt_situation_189 v2.

- **curated_prompt_role_027**: The only early arrival
  Original: prompt_role_027 v1, pack 1.1.0. Ingredients: role=prompt_role_027 v2.

- **curated_prompt_role_028**: Person afraid to disappoint
  Original: prompt_role_028 v1, pack 1.1.0. Ingredients: role=prompt_role_028 v2.

- **curated_prompt_role_029**: Someone practicing confidence
  Original: prompt_role_029 v1, pack 1.1.0. Ingredients: role=prompt_role_029 v2; action=prompt_action_150 v2.

- **curated_prompt_role_030**: Person with an unusual solution
  Original: prompt_role_030 v1, pack 1.1.0. Ingredients: role=prompt_role_030 v2.

- **curated_prompt_role_031**: Person who always brings snacks
  Original: prompt_role_031 v1, pack 1.1.0. Ingredients: role=prompt_role_031 v2.

- **curated_prompt_role_033**: Unexpected mentor
  Original: prompt_role_033 v1, pack 1.1.0. Ingredients: role=prompt_role_033 v2.

- **curated_prompt_role_034**: Person guarding an empty box
  Original: prompt_role_034 v1, pack 1.1.0. Ingredients: role=prompt_role_034 v2; action=prompt_action_151 v3; object=prompt_object_094 v1.

- **curated_prompt_role_035**: Collector of everyone else's opinions
  Original: prompt_role_035 v1, pack 1.1.0. Ingredients: role=prompt_role_035 v2.

- **curated_prompt_role_036**: Person who wants a fresh start
  Original: prompt_role_036 v1, pack 1.1.0. Ingredients: role=prompt_role_036 v2.

- **curated_prompt_role_037**: Person rehearsing an apology
  Original: prompt_role_037 v1, pack 1.1.0. Ingredients: role=prompt_role_037 v2; action=prompt_action_068 v2.

- **curated_prompt_role_038**: New member with big ambitions
  Original: prompt_role_038 v1, pack 1.1.0. Ingredients: role=prompt_role_038 v2.

- **curated_prompt_role_039**: Person who trusts the old method
  Original: prompt_role_039 v1, pack 1.1.0. Ingredients: role=prompt_role_039 v2.

- **curated_prompt_role_040**: Person who wants to simplify everything
  Original: prompt_role_040 v1, pack 1.1.0. Ingredients: role=prompt_role_040 v2.

- **curated_prompt_role_041**: Person trying to be mysterious
  Original: prompt_role_041 v1, pack 1.1.0. Ingredients: role=prompt_role_041 v3.

- **curated_prompt_role_042**: Unofficial translator of instructions
  Original: prompt_role_042 v1, pack 1.1.0. Ingredients: role=prompt_role_042 v2.

- **curated_prompt_role_043**: Person testing a new catchphrase
  Original: prompt_role_043 v1, pack 1.1.0. Ingredients: role=prompt_role_043 v2; action=prompt_action_153 v2.

- **curated_prompt_role_044**: Person who knows the shortcut
  Original: prompt_role_044 v1, pack 1.1.0. Ingredients: role=prompt_role_044 v2.

- **curated_prompt_role_045**: Accidental master of ceremonies
  Original: prompt_role_045 v1, pack 1.1.0. Ingredients: role=prompt_role_045 v2.

- **curated_prompt_role_046**: Someone determined to be helpful
  Original: prompt_role_046 v1, pack 1.1.0. Ingredients: role=prompt_role_046 v2.

- **curated_prompt_role_047**: Person who remembers a different version
  Original: prompt_role_047 v1, pack 1.1.0. Ingredients: role=prompt_role_047 v2; situation=prompt_situation_190 v2.

- **curated_prompt_role_048**: Designated timekeeper
  Original: prompt_role_048 v1, pack 1.1.0. Ingredients: role=prompt_role_048 v2.

- **curated_prompt_role_049**: Person secretly proud of the project
  Original: prompt_role_049 v1, pack 1.1.0. Ingredients: role=prompt_role_049 v2.

- **curated_prompt_role_050**: Person trying to hand over responsibility
  Original: prompt_role_050 v1, pack 1.1.0. Ingredients: role=prompt_role_050 v2; action=prompt_action_154 v2.

- **curated_prompt_role_051**: Someone who cannot stop making plans
  Original: prompt_role_051 v1, pack 1.1.0. Ingredients: role=prompt_role_051 v2.

- **curated_prompt_role_052**: Person with one final question
  Original: prompt_role_052 v1, pack 1.1.0. Ingredients: role=prompt_role_052 v2.

- **curated_prompt_role_053**: Person who brought a backup
  Original: prompt_role_053 v1, pack 1.1.0. Ingredients: role=prompt_role_053 v2.

- **curated_prompt_role_054**: Someone preparing to say goodbye
  Original: prompt_role_054 v1, pack 1.1.0. Ingredients: role=prompt_role_054 v2; action=prompt_action_155 v3.

- **curated_prompt_role_055**: Person looking for a sign
  Original: prompt_role_055 v1, pack 1.1.0. Ingredients: role=prompt_role_055 v2.

- **curated_prompt_role_056**: Person who enjoys solving disputes
  Original: prompt_role_056 v1, pack 1.1.0. Ingredients: role=prompt_role_056 v2.

- **curated_prompt_role_057**: Person who insists on a rehearsal
  Original: prompt_role_057 v1, pack 1.1.0. Ingredients: role=prompt_role_057 v2.

- **curated_prompt_role_058**: Someone returning after years away
  Original: prompt_role_058 v1, pack 1.1.0. Ingredients: role=prompt_role_058 v2.

- **curated_prompt_role_059**: Person with an overlooked talent
  Original: prompt_role_059 v1, pack 1.1.0. Ingredients: role=prompt_role_059 v2.

- **curated_prompt_role_060**: Someone who has never been asked before
  Original: prompt_role_060 v1, pack 1.1.0. Ingredients: role=prompt_role_060 v2.

- **curated_prompt_role_061**: Person hiding happy news
  Original: prompt_role_061 v1, pack 1.1.0. Ingredients: role=prompt_role_061 v2.

- **curated_prompt_role_062**: Keeper of an unfinished promise
  Original: prompt_role_062 v1, pack 1.1.0. Ingredients: role=prompt_role_062 v2.

- **curated_prompt_role_063**: Person who wants everyone included
  Original: prompt_role_063 v1, pack 1.1.0. Ingredients: role=prompt_role_063 v2.

- **curated_prompt_role_064**: Person learning to delegate
  Original: prompt_role_064 v1, pack 1.1.0. Ingredients: role=prompt_role_064 v3; action=prompt_action_156 v2.

- **curated_prompt_role_065**: Someone determined to take a small risk
  Original: prompt_role_065 v1, pack 1.1.0. Ingredients: role=prompt_role_065 v2; action=prompt_action_157 v3.

- **curated_prompt_role_066**: Person who has already printed matching team jackets
  Original: prompt_role_066 v1, pack 1.1.0. Ingredients: role=prompt_role_066 v2; action=prompt_action_158 v3; situation=prompt_situation_2125 v1.

- **curated_prompt_role_067**: Person treating a minor inconvenience like a royal ceremony
  Original: prompt_role_067 v1, pack 1.1.0. Ingredients: role=prompt_role_067 v2; action=prompt_action_159 v3; situation=prompt_situation_2126 v1.

- **curated_prompt_role_068**: Person who brought an emergency fog machine
  Original: prompt_role_068 v1, pack 1.1.0. Ingredients: role=prompt_role_068 v2; action=prompt_action_160 v3; situation=prompt_situation_2127 v1.

- **curated_prompt_role_069**: Person convinced this is a secret job interview
  Original: prompt_role_069 v1, pack 1.1.0. Ingredients: role=prompt_role_069 v2; situation=prompt_situation_191 v2.

- **curated_prompt_role_070**: Person protecting a very ordinary sandwich
  Original: prompt_role_070 v1, pack 1.1.0. Ingredients: role=prompt_role_070 v2; action=prompt_action_161 v2.

- **curated_prompt_role_071**: Person who has made a spreadsheet for the picnic
  Original: prompt_role_071 v1, pack 1.1.0. Ingredients: role=prompt_role_071 v2; action=prompt_action_162 v3; situation=prompt_situation_2128 v1.

- **curated_prompt_role_072**: Person trying to get an imaginary promotion
  Original: prompt_role_072 v1, pack 1.1.0. Ingredients: role=prompt_role_072 v2; situation=prompt_situation_192 v2.

- **curated_prompt_role_073**: Person who has rehearsed their apology with a puppet
  Original: prompt_role_073 v1, pack 1.1.0. Ingredients: role=prompt_role_073 v2; action=prompt_action_068 v2; object=prompt_object_095 v1.

- **curated_prompt_role_074**: Person pretending to understand the very simple rules
  Original: prompt_role_074 v1, pack 1.1.0. Ingredients: role=prompt_role_074 v2; action=prompt_action_164 v3; situation=prompt_situation_2129 v1.

- **curated_prompt_role_075**: Person who assumes every announcement is about them
  Original: prompt_role_075 v1, pack 1.1.0. Ingredients: role=prompt_role_075 v2.

- **curated_prompt_role_076**: Person determined to give the plant equal voting rights
  Original: prompt_role_076 v1, pack 1.1.0. Ingredients: role=prompt_role_076 v3; action=prompt_action_165 v3; object=prompt_object_082 v1; situation=prompt_situation_2130 v1.

- **curated_prompt_role_077**: Person trying to keep a surprise from an extremely obvious person
  Original: prompt_role_077 v1, pack 1.1.0. Ingredients: role=prompt_role_077 v2; action=prompt_action_166 v3.

- **curated_prompt_action_003**: Packing a suitcase that will not close
  Original: prompt_action_003 v1, pack 1.1.0. Ingredients: action=prompt_action_003 v2; situation=prompt_situation_193 v2.

- **curated_prompt_action_005**: Building a very unstable shelf
  Original: prompt_action_005 v1, pack 1.1.0. Ingredients: action=prompt_action_005 v2; situation=prompt_situation_194 v2.

- **curated_prompt_action_011**: Assembling a model boat without instructions
  Original: prompt_action_011 v1, pack 1.1.0. Ingredients: action=prompt_action_011 v2; situation=prompt_situation_195 v2.

- **curated_prompt_action_014**: Preparing a picnic for unexpected guests
  Original: prompt_action_014 v1, pack 1.1.0. Ingredients: action=prompt_action_014 v2; situation=prompt_situation_196 v2.

- **curated_prompt_action_018**: Decorating a cake with too little icing
  Original: prompt_action_018 v1, pack 1.1.0. Ingredients: action=prompt_action_018 v2; situation=prompt_situation_197 v2.

- **curated_prompt_action_019**: Practicing a handshake for an important meeting
  Original: prompt_action_019 v1, pack 1.1.0. Ingredients: action=prompt_action_019 v2; situation=prompt_situation_198 v2.

- **curated_prompt_action_023**: Trying to quietly open a noisy packet
  Original: prompt_action_023 v1, pack 1.1.0. Ingredients: action=prompt_action_023 v2; situation=prompt_situation_199 v2.

- **curated_prompt_action_024**: Setting a table for an unusual ceremony
  Original: prompt_action_024 v1, pack 1.1.0. Ingredients: action=prompt_action_024 v2; situation=prompt_situation_200 v2.

- **curated_prompt_action_028**: Planting seeds in the wrong containers
  Original: prompt_action_028 v1, pack 1.1.0. Ingredients: action=prompt_action_028 v2; situation=prompt_situation_201 v2.

- **curated_prompt_action_029**: Making a sign with one letter missing
  Original: prompt_action_029 v1, pack 1.1.0. Ingredients: action=prompt_action_029 v2; situation=prompt_situation_202 v2.

- **curated_prompt_action_030**: Trying to catch a paper hat in the wind
  Original: prompt_action_030 v1, pack 1.1.0. Ingredients: action=prompt_action_030 v2; situation=prompt_situation_203 v2.

- **curated_prompt_action_038**: Putting together a puzzle with one extra piece
  Original: prompt_action_038 v1, pack 1.1.0. Ingredients: action=prompt_action_038 v2; situation=prompt_situation_204 v2.

- **curated_prompt_action_043**: Making sandwiches for a long journey
  Original: prompt_action_043 v1, pack 1.1.0. Ingredients: action=prompt_action_043 v2; situation=prompt_situation_205 v2.

- **curated_prompt_action_045**: Trying to stay dry under one small umbrella
  Original: prompt_action_045 v1, pack 1.1.0. Ingredients: action=prompt_action_045 v3; situation=prompt_situation_206 v2; object=prompt_object_080 v1.

- **curated_prompt_action_048**: Repairing a stage prop before the curtain rises
  Original: prompt_action_048 v1, pack 1.1.0. Ingredients: action=prompt_action_048 v2; situation=prompt_situation_207 v2.

- **curated_prompt_action_060**: Preparing a room for a special visitor
  Original: prompt_action_060 v1, pack 1.1.0. Ingredients: action=prompt_action_060 v2; situation=prompt_situation_208 v2.

- **curated_prompt_action_073**: Interviewing a neighbor for the position of best friend
  Original: prompt_action_073 v1, pack 1.1.0. Ingredients: action=prompt_action_073 v2; situation=prompt_situation_209 v2.

- **curated_prompt_action_075**: Testing a fog machine at a very quiet picnic
  Original: prompt_action_075 v1, pack 1.1.0. Ingredients: action=prompt_action_075 v2; situation=prompt_situation_210 v2.

- **curated_prompt_action_076**: Trying to wrap an enormous spoon without anyone noticing
  Original: prompt_action_076 v1, pack 1.1.0. Ingredients: action=prompt_action_076 v3; situation=prompt_situation_211 v3; object=prompt_object_087 v1.

- **curated_prompt_action_077**: Holding a ribbon cutting for a newly tidied drawer
  Original: prompt_action_077 v1, pack 1.1.0. Ingredients: action=prompt_action_077 v2; situation=prompt_situation_212 v2.

- **curated_prompt_action_079**: Drawing up a seating chart for a party of three
  Original: prompt_action_079 v1, pack 1.1.0. Ingredients: action=prompt_action_079 v2; situation=prompt_situation_213 v2.

- **curated_prompt_profession_055**: Part-time imaginary dragon dentist
  Original: prompt_profession_055 v1, pack 1.1.0. Ingredients: profession=prompt_profession_055 v3; role=prompt_role_080 v1.

- **curated_prompt_profession_065**: Very serious crisp-tasting expert
  Original: prompt_profession_065 v1, pack 1.1.0. Ingredients: profession=prompt_profession_065 v2; emotion=prompt_emotion_051 v2.

- **curated_prompt_emotion_040**: Momentary panic about a small problem
  Original: prompt_emotion_040 v1, pack 1.1.0. Ingredients: emotion=prompt_emotion_040 v2; situation=prompt_situation_214 v2.

- **curated_prompt_emotion_049**: Peace after a misunderstanding
  Original: prompt_emotion_049 v1, pack 1.1.0. Ingredients: emotion=prompt_emotion_049 v2; situation=prompt_situation_215 v2.

- **curated_prompt_emotion_050**: An urge to celebrate quietly
  Original: prompt_emotion_050 v1, pack 1.1.0. Ingredients: emotion=prompt_emotion_050 v2; action=prompt_action_167 v3; situation=prompt_situation_2131 v1.

- **curated_prompt_situation_064**: A person who always follows rules proposes breaking a small one
  Original: prompt_situation_064 v1, pack 1.1.0. Ingredients: situation=prompt_situation_064 v2; role=prompt_role_078 v2.

- **curated_prompt_action_071**: Organizing the fridge like a luxury hotel
  Original: prompt_action_071 v1, pack 1.1.0. Ingredients: action=prompt_action_071 v2; situation=prompt_situation_216 v2.

- **curated_review_prompt_action_001_v1**: Repairing an imaginary umbrella
  Original: prompt_action_001 v1, pack 2.2.1. Ingredients: action=prompt_action_001 v2; situation=prompt_situation_2078 v1.

- **curated_review_prompt_action_002_v1**: Hiding a birthday surprise
  Original: prompt_action_002 v1, pack 2.2.1. Ingredients: action=prompt_action_002 v2.

- **curated_review_prompt_action_004_v1**: Sorting a mountain of mismatched socks
  Original: prompt_action_004 v1, pack 2.2.1. Ingredients: action=prompt_action_004 v2; object=prompt_object_072 v1.

- **curated_review_prompt_action_006_v1**: Wrapping an awkwardly shaped present
  Original: prompt_action_006 v1, pack 2.2.1. Ingredients: action=prompt_action_006 v2; object=prompt_object_073 v1.

- **curated_review_prompt_action_007_v1**: Trying to fold a giant map
  Original: prompt_action_007 v1, pack 2.2.1. Ingredients: action=prompt_action_007 v2; object=prompt_object_074 v1.

- **curated_review_prompt_action_009_v1**: Rehearsing a welcome speech
  Original: prompt_action_009 v1, pack 2.2.1. Ingredients: action=prompt_action_009 v2.

- **curated_review_prompt_action_010_v1**: Finding the source of a mysterious squeak
  Original: prompt_action_010 v1, pack 2.2.1. Ingredients: action=prompt_action_010 v2.

- **curated_review_prompt_action_012_v1**: Moving a very precious plant
  Original: prompt_action_012 v1, pack 2.2.1. Ingredients: action=prompt_action_012 v2; object=prompt_object_075 v1.

- **curated_review_prompt_action_013_v1**: Testing an imaginary invention
  Original: prompt_action_013 v1, pack 2.2.1. Ingredients: action=prompt_action_013 v2; situation=prompt_situation_2079 v1.

- **curated_review_prompt_action_015_v1**: Labeling boxes for a move
  Original: prompt_action_015 v1, pack 2.2.1. Ingredients: action=prompt_action_015 v2; situation=prompt_situation_2080 v1.

- **curated_review_prompt_action_017_v1**: Tuning an imaginary piano
  Original: prompt_action_017 v1, pack 2.2.1. Ingredients: action=prompt_action_017 v2; situation=prompt_situation_2081 v1.

- **curated_review_prompt_action_020_v1**: Searching for a tiny missing screw
  Original: prompt_action_020 v1, pack 2.2.1. Ingredients: action=prompt_action_020 v2.

- **curated_review_prompt_action_021_v1**: Sorting a box of old photographs
  Original: prompt_action_021 v1, pack 2.2.1. Ingredients: action=prompt_action_021 v2.

- **curated_review_prompt_action_022_v1**: Holding a ladder steady from a seated position
  Original: prompt_action_022 v1, pack 2.2.1. Ingredients: action=prompt_action_022 v2; situation=prompt_situation_2082 v1.

- **curated_review_prompt_action_025_v1**: Mending a beloved old jacket
  Original: prompt_action_025 v1, pack 2.2.1. Ingredients: action=prompt_action_025 v2.

- **curated_review_prompt_action_026_v1**: Checking tickets for an imaginary train
  Original: prompt_action_026 v1, pack 2.2.1. Ingredients: action=prompt_action_026 v2; situation=prompt_situation_2083 v1.

- **curated_review_prompt_action_027_v1**: Comparing two nearly identical paint samples
  Original: prompt_action_027 v1, pack 2.2.1. Ingredients: action=prompt_action_027 v2; object=prompt_object_076 v1.

- **curated_review_prompt_action_031_v1**: Arranging chairs for a club meeting
  Original: prompt_action_031 v1, pack 2.2.1. Ingredients: action=prompt_action_031 v2; situation=prompt_situation_2084 v1.

- **curated_review_prompt_action_032_v1**: Measuring a room with footsteps
  Original: prompt_action_032 v1, pack 2.2.1. Ingredients: action=prompt_action_032 v2; situation=prompt_situation_2085 v1.

- **curated_review_prompt_action_033_v1**: Demonstrating a very complicated remote control
  Original: prompt_action_033 v1, pack 2.2.1. Ingredients: action=prompt_action_033 v2; object=prompt_object_077 v1.

- **curated_review_prompt_action_034_v1**: Testing the acoustics of an empty room
  Original: prompt_action_034 v1, pack 2.2.1. Ingredients: action=prompt_action_034 v2; location=prompt_location_2094 v1.

- **curated_review_prompt_action_035_v1**: Showing someone a secret shortcut
  Original: prompt_action_035 v1, pack 2.2.1. Ingredients: action=prompt_action_035 v2; situation=prompt_situation_2086 v1.

- **curated_review_prompt_action_036_v1**: Reorganizing a shared kitchen drawer
  Original: prompt_action_036 v1, pack 2.2.1. Ingredients: action=prompt_action_036 v2.

- **curated_review_prompt_action_037_v1**: Trying to get a kite out of a tree
  Original: prompt_action_037 v1, pack 2.2.1. Ingredients: action=prompt_action_037 v2; situation=prompt_situation_2087 v1.

- **curated_review_prompt_action_039_v1**: Practicing a dance using only hands
  Original: prompt_action_039 v1, pack 2.2.1. Ingredients: action=prompt_action_039 v2; situation=prompt_situation_2088 v1.

- **curated_review_prompt_action_040_v1**: Cleaning a window on opposite sides
  Original: prompt_action_040 v1, pack 2.2.1. Ingredients: action=prompt_action_040 v2; situation=prompt_situation_2089 v1.

- **curated_review_prompt_action_041_v1**: Taking inventory of a tiny shop
  Original: prompt_action_041 v1, pack 2.2.1. Ingredients: action=prompt_action_041 v2; location=prompt_location_2095 v1.

- **curated_review_prompt_action_042_v1**: Polishing an enormous trophy
  Original: prompt_action_042 v1, pack 2.2.1. Ingredients: action=prompt_action_042 v2; object=prompt_object_078 v1.

- **curated_review_prompt_action_044_v1**: Choosing a frame for a family photo
  Original: prompt_action_044 v1, pack 2.2.1. Ingredients: action=prompt_action_044 v2; object=prompt_object_079 v1.

- **curated_review_prompt_action_045_v2**: Sharing a small umbrella
  Original: prompt_action_045 v2, pack 2.2.1. Ingredients: action=prompt_action_045 v3; object=prompt_object_080 v1.

- **curated_review_prompt_action_046_v1**: Rehearsing the timing of a surprise entrance
  Original: prompt_action_046 v1, pack 2.2.1. Ingredients: action=prompt_action_046 v2; situation=prompt_situation_2090 v1.

- **curated_review_prompt_action_047_v1**: Sorting the mail for a whole street
  Original: prompt_action_047 v1, pack 2.2.1. Ingredients: action=prompt_action_047 v2; situation=prompt_situation_2091 v1.

- **curated_review_prompt_action_049_v1**: Presenting a mysterious object for inspection
  Original: prompt_action_049 v1, pack 2.2.1. Ingredients: action=prompt_action_049 v2; object=prompt_object_081 v1.

- **curated_review_prompt_action_050_v1**: Trying to teach a new board game
  Original: prompt_action_050 v1, pack 2.2.1. Ingredients: action=prompt_action_050 v2.

- **curated_review_prompt_action_052_v1**: Designing a flag for a very small club
  Original: prompt_action_052 v1, pack 2.2.1. Ingredients: action=prompt_action_052 v2; situation=prompt_situation_2092 v1.

- **curated_review_prompt_action_053_v1**: Folding paper animals for a display
  Original: prompt_action_053 v1, pack 2.2.1. Ingredients: action=prompt_action_053 v2; situation=prompt_situation_2093 v1.

- **curated_review_prompt_action_054_v1**: Testing whether a chair squeaks
  Original: prompt_action_054 v1, pack 2.2.1. Ingredients: action=prompt_action_054 v2; situation=prompt_situation_2094 v1.

- **curated_review_prompt_action_055_v1**: Transplanting an imaginary cactus
  Original: prompt_action_055 v1, pack 2.2.1. Ingredients: action=prompt_action_055 v2; situation=prompt_situation_2095 v1.

- **curated_review_prompt_action_056_v1**: Building a miniature town
  Original: prompt_action_056 v1, pack 2.2.1. Ingredients: action=prompt_action_056 v2.

- **curated_review_prompt_action_057_v1**: Drawing a route from memory
  Original: prompt_action_057 v1, pack 2.2.1. Ingredients: action=prompt_action_057 v2; situation=prompt_situation_2096 v1.

- **curated_review_prompt_action_059_v1**: Stacking cups for a celebration
  Original: prompt_action_059 v1, pack 2.2.1. Ingredients: action=prompt_action_059 v2; situation=prompt_situation_2097 v1.

- **curated_review_prompt_action_061_v1**: Checking the contents of an emergency snack kit
  Original: prompt_action_061 v1, pack 2.2.1. Ingredients: action=prompt_action_061 v2.

- **curated_review_prompt_action_062_v1**: Searching for the end of a roll of tape
  Original: prompt_action_062 v1, pack 2.2.1. Ingredients: action=prompt_action_062 v2.

- **curated_review_prompt_action_063_v1**: Trying to make a wobbly table stable
  Original: prompt_action_063 v1, pack 2.2.1. Ingredients: action=prompt_action_063 v2.

- **curated_review_prompt_action_065_v1**: Returning borrowed things to their owners
  Original: prompt_action_065 v1, pack 2.2.1. Ingredients: action=prompt_action_065 v2.

- **curated_review_prompt_action_066_v1**: Giving a houseplant a very serious performance review
  Original: prompt_action_066 v1, pack 2.2.1. Ingredients: action=prompt_action_066 v2; object=prompt_object_082 v1.

- **curated_review_prompt_action_067_v1**: Installing a velvet rope around an ordinary chair
  Original: prompt_action_067 v1, pack 2.2.1. Ingredients: action=prompt_action_067 v2; object=prompt_object_083 v1.

- **curated_review_prompt_action_068_v1**: Rehearsing an apology to a ceremonial goose
  Original: prompt_action_068 v1, pack 2.2.1. Ingredients: action=prompt_action_068 v2; role=prompt_role_079 v1.

- **curated_review_prompt_action_069_v1**: Making a tiny welcome pack for a new toaster
  Original: prompt_action_069 v1, pack 2.2.1. Ingredients: action=prompt_action_069 v2; object=prompt_object_084 v1.

- **curated_review_prompt_action_070_v1**: Trying to fit a wedding cake into a bicycle helmet
  Original: prompt_action_070 v1, pack 2.2.1. Ingredients: action=prompt_action_070 v2; object=prompt_object_085 v1.

- **curated_review_prompt_action_072_v1**: Teaching an imaginary dragon how to use a doorbell
  Original: prompt_action_072 v1, pack 2.2.1. Ingredients: action=prompt_action_072 v2; role=prompt_role_080 v1.

- **curated_review_prompt_action_074_v1**: Giving a sandwich an overcomplicated security check
  Original: prompt_action_074 v1, pack 2.2.1. Ingredients: action=prompt_action_074 v2; object=prompt_object_065 v2.

- **curated_review_prompt_action_076_v2**: Wrapping an enormous spoon
  Original: prompt_action_076 v2, pack 2.2.1. Ingredients: action=prompt_action_076 v3; object=prompt_object_087 v1.

- **curated_review_prompt_action_078_v1**: Taking an emergency family photograph with an imaginary goat
  Original: prompt_action_078 v1, pack 2.2.1. Ingredients: action=prompt_action_078 v2; situation=prompt_situation_2098 v1.

- **curated_review_prompt_action_080_v1**: Making an official complaint about a very smug cake
  Original: prompt_action_080 v1, pack 2.2.1. Ingredients: action=prompt_action_080 v2; situation=prompt_situation_2099 v1.

- **curated_review_prompt_action_081_v2**: Preparing a surprise for a parent
  Original: prompt_action_081 v2, pack 2.2.1. Ingredients: action=prompt_action_081 v3; relationship=prompt_relationship_017 v2.

- **curated_review_prompt_action_082_v2**: Coaching their old club
  Original: prompt_action_082 v2, pack 2.2.1. Ingredients: action=prompt_action_082 v3.

- **curated_review_prompt_action_083_v2**: Sharing a garden fence
  Original: prompt_action_083 v2, pack 2.2.1. Ingredients: action=prompt_action_083 v3.

- **curated_review_prompt_action_085_v2**: Meeting as equals
  Original: prompt_action_085 v2, pack 2.2.1. Ingredients: action=prompt_action_085 v3; situation=prompt_situation_2100 v1.

- **curated_review_prompt_action_086_v2**: Sorting their final shared box
  Original: prompt_action_086 v2, pack 2.2.1. Ingredients: action=prompt_action_086 v3; situation=prompt_situation_2101 v1.

- **curated_review_prompt_action_087_v2**: Meeting for the first time
  Original: prompt_action_087 v2, pack 2.2.1. Ingredients: action=prompt_action_087 v3; situation=prompt_situation_2102 v1.

- **curated_review_prompt_action_088_v2**: Planning an unusual cake
  Original: prompt_action_088 v2, pack 2.2.1. Ingredients: action=prompt_action_088 v3.

- **curated_review_prompt_action_089_v2**: Sharing one greenhouse
  Original: prompt_action_089 v2, pack 2.2.1. Ingredients: action=prompt_action_089 v3.

- **curated_review_prompt_action_090_v2**: Rehearsing their first pitch
  Original: prompt_action_090 v2, pack 2.2.1. Ingredients: action=prompt_action_090 v3; situation=prompt_situation_2103 v1.

- **curated_review_prompt_action_092_v2**: Tuning up together
  Original: prompt_action_092 v2, pack 2.2.1. Ingredients: action=prompt_action_092 v3.

- **curated_review_prompt_action_093_v2**: Fixing an old sign
  Original: prompt_action_093 v2, pack 2.2.1. Ingredients: action=prompt_action_093 v3.

- **curated_review_prompt_action_094_v2**: Moving day
  Original: prompt_action_094 v2, pack 2.2.1. Ingredients: action=prompt_action_094 v3.

- **curated_review_prompt_action_095_v2**: Returning something borrowed years ago
  Original: prompt_action_095 v2, pack 2.2.1. Ingredients: action=prompt_action_095 v3; situation=prompt_situation_2104 v1.

- **curated_review_prompt_action_096_v2**: Learning a craft from an old manual
  Original: prompt_action_096 v2, pack 2.2.1. Ingredients: action=prompt_action_096 v3; object=prompt_object_088 v1.

- **curated_review_prompt_action_097_v2**: Opening a restaurant together
  Original: prompt_action_097 v2, pack 2.2.1. Ingredients: action=prompt_action_097 v3.

- **curated_review_prompt_action_098_v2**: Planning a family reunion
  Original: prompt_action_098 v2, pack 2.2.1. Ingredients: action=prompt_action_098 v3; situation=prompt_situation_2105 v1.

- **curated_review_prompt_action_099_v2**: Choosing a new captain
  Original: prompt_action_099 v2, pack 2.2.1. Ingredients: action=prompt_action_099 v3.

- **curated_review_prompt_action_100_v2**: Finishing an old project
  Original: prompt_action_100 v2, pack 2.2.1. Ingredients: action=prompt_action_100 v3.

- **curated_review_prompt_action_102_v2**: Deciding what to put in a time capsule
  Original: prompt_action_102 v2, pack 2.2.1. Ingredients: action=prompt_action_102 v3.

- **curated_review_prompt_action_103_v2**: Preparing a comeback show
  Original: prompt_action_103 v2, pack 2.2.1. Ingredients: action=prompt_action_103 v3; situation=prompt_situation_2106 v1.

- **curated_review_prompt_action_104_v2**: Planning opening night
  Original: prompt_action_104 v2, pack 2.2.1. Ingredients: action=prompt_action_104 v3.

- **curated_review_prompt_action_105_v2**: Coordinating a family reunion
  Original: prompt_action_105 v2, pack 2.2.1. Ingredients: action=prompt_action_105 v3; situation=prompt_situation_2105 v1.

- **curated_review_prompt_action_107_v2**: Preparing a ceremonial voyage
  Original: prompt_action_107 v2, pack 2.2.1. Ingredients: action=prompt_action_107 v3; situation=prompt_situation_2107 v1.

- **curated_review_prompt_action_109_v2**: Organizing a street feast
  Original: prompt_action_109 v2, pack 2.2.1. Ingredients: action=prompt_action_109 v3.

- **curated_review_prompt_action_110_v2**: Preparing a surprise performance
  Original: prompt_action_110 v2, pack 2.2.1. Ingredients: action=prompt_action_110 v3; situation=prompt_situation_2108 v1.

- **curated_review_prompt_action_111_v2**: Preparing an anniversary broadcast
  Original: prompt_action_111 v2, pack 2.2.1. Ingredients: action=prompt_action_111 v3; situation=prompt_situation_2109 v1.

- **curated_review_prompt_action_112_v2**: Choosing a new fountain
  Original: prompt_action_112 v2, pack 2.2.1. Ingredients: action=prompt_action_112 v3.

- **curated_review_prompt_action_113_v2**: Preparing costumes for a community play
  Original: prompt_action_113 v2, pack 2.2.1. Ingredients: action=prompt_action_113 v3; situation=prompt_situation_2110 v1.

- **curated_review_prompt_action_114_v2**: Choosing a comeback song
  Original: prompt_action_114 v2, pack 2.2.1. Ingredients: action=prompt_action_114 v3; situation=prompt_situation_2111 v1.

- **curated_review_prompt_action_116_v2**: Clearing out an old workshop
  Original: prompt_action_116 v2, pack 2.2.1. Ingredients: action=prompt_action_116 v3.

- **curated_review_prompt_action_118_v2**: Organizing a friendly tournament
  Original: prompt_action_118 v2, pack 2.2.1. Ingredients: action=prompt_action_118 v3.

- **curated_review_prompt_action_119_v2**: Dividing the first harvest
  Original: prompt_action_119 v2, pack 2.2.1. Ingredients: action=prompt_action_119 v3.

- **curated_review_prompt_action_121_v2**: Making a first original movie
  Original: prompt_action_121 v2, pack 2.2.1. Ingredients: action=prompt_action_121 v3; situation=prompt_situation_2112 v1.

- **curated_review_prompt_action_122_v2**: Taking over a family food stall
  Original: prompt_action_122 v2, pack 2.2.1. Ingredients: action=prompt_action_122 v3; situation=prompt_situation_2113 v1.

- **curated_review_prompt_action_125_v2**: Preparing a thank-you dinner
  Original: prompt_action_125 v2, pack 2.2.1. Ingredients: action=prompt_action_125 v3; situation=prompt_situation_2114 v1.

- **curated_review_prompt_action_127_v2**: Identifying a first find
  Original: prompt_action_127 v2, pack 2.2.1. Ingredients: action=prompt_action_127 v3.

- **curated_review_prompt_action_128_v2**: Building a reunion float
  Original: prompt_action_128 v2, pack 2.2.1. Ingredients: action=prompt_action_128 v3; situation=prompt_situation_2115 v1.

- **curated_review_prompt_action_129_v2**: Rehearsing a new show
  Original: prompt_action_129 v2, pack 2.2.1. Ingredients: action=prompt_action_129 v3.

- **curated_review_prompt_action_130_v2**: Opening a community cinema
  Original: prompt_action_130 v2, pack 2.2.1. Ingredients: action=prompt_action_130 v3.

- **curated_review_prompt_action_131_v2**: Preparing for a relative's birthday performance
  Original: prompt_action_131 v2, pack 2.2.1. Ingredients: action=prompt_action_131 v3.

- **curated_review_prompt_action_132_v2**: Negotiating custody of an air fryer
  Original: prompt_action_132 v2, pack 2.2.1. Ingredients: action=prompt_action_132 v3; object=prompt_object_089 v1.

- **curated_review_prompt_action_133_v2**: Covering for a hired raccoon
  Original: prompt_action_133 v2, pack 2.2.1. Ingredients: action=prompt_action_133 v3; situation=prompt_situation_2116 v1.

- **curated_review_prompt_action_134_v2**: Returning a terrible family gift
  Original: prompt_action_134 v2, pack 2.2.1. Ingredients: action=prompt_action_134 v3; situation=prompt_situation_2117 v1.

- **curated_review_prompt_action_135_v2**: Debating whether toast counts as a tasting menu
  Original: prompt_action_135 v2, pack 2.2.1. Ingredients: action=prompt_action_135 v3; situation=prompt_situation_2118 v1.

- **curated_review_prompt_action_136_v2**: Opening a luxury hotel for imaginary pets
  Original: prompt_action_136 v2, pack 2.2.1. Ingredients: action=prompt_action_136 v3; situation=prompt_situation_2119 v1.

- **curated_review_prompt_action_137_v2**: Planning a small picnic with an enormous fog machine
  Original: prompt_action_137 v2, pack 2.2.1. Ingredients: action=prompt_action_137 v3; object=prompt_object_090 v1.

- **curated_review_prompt_action_138_v2**: Writing an apology to the office printer
  Original: prompt_action_138 v2, pack 2.2.1. Ingredients: action=prompt_action_138 v3; object=prompt_object_091 v1.

- **curated_review_prompt_action_139_v2**: Opening a cafe staffed by a goose
  Original: prompt_action_139 v2, pack 2.2.1. Ingredients: action=prompt_action_139 v3; situation=prompt_situation_2120 v1.

- **curated_review_prompt_action_140_v2**: Replacing a family trophy with a potato
  Original: prompt_action_140 v2, pack 2.2.1. Ingredients: action=prompt_action_140 v3; object=prompt_object_092 v1.

- **curated_review_prompt_action_141_v2**: Rehearsing a formal apology to a duck
  Original: prompt_action_141 v2, pack 2.2.1. Ingredients: action=prompt_action_141 v3; role=prompt_role_081 v1.

- **curated_review_prompt_action_142_v2**: Organizing a tiny picnic with an excessive budget
  Original: prompt_action_142 v2, pack 2.2.1. Ingredients: action=prompt_action_142 v3; situation=prompt_situation_2121 v1.

- **curated_review_prompt_action_143_v2**: Choosing a dramatic name for an ordinary spoon
  Original: prompt_action_143 v2, pack 2.2.1. Ingredients: action=prompt_action_143 v3; object=prompt_object_093 v1.

- **curated_review_prompt_action_144_v2**: Rehearsing a magic show booked by mistake
  Original: prompt_action_144 v2, pack 2.2.1. Ingredients: action=prompt_action_144 v3; situation=prompt_situation_2122 v1.

- **curated_review_prompt_action_147_v2**: Finishing early
  Original: prompt_action_147 v2, pack 2.2.1. Ingredients: action=prompt_action_147 v3; situation=prompt_situation_2123 v1.

- **curated_review_prompt_action_149_v2**: Packing for every possibility
  Original: prompt_action_149 v2, pack 2.2.1. Ingredients: action=prompt_action_149 v3; situation=prompt_situation_2124 v1.

- **curated_review_prompt_action_151_v2**: Guarding an empty box
  Original: prompt_action_151 v2, pack 2.2.1. Ingredients: action=prompt_action_151 v3; object=prompt_object_094 v1.

- **curated_review_prompt_action_155_v2**: Preparing to say goodbye
  Original: prompt_action_155 v2, pack 2.2.1. Ingredients: action=prompt_action_155 v3.

- **curated_review_prompt_action_157_v2**: Taking a small risk
  Original: prompt_action_157 v2, pack 2.2.1. Ingredients: action=prompt_action_157 v3.

- **curated_review_prompt_action_158_v2**: Printing matching team jackets
  Original: prompt_action_158 v2, pack 2.2.1. Ingredients: action=prompt_action_158 v3; situation=prompt_situation_2125 v1.

- **curated_review_prompt_action_159_v2**: Treating a minor inconvenience as a royal ceremony
  Original: prompt_action_159 v2, pack 2.2.1. Ingredients: action=prompt_action_159 v3; situation=prompt_situation_2126 v1.

- **curated_review_prompt_action_160_v2**: Bringing an emergency fog machine
  Original: prompt_action_160 v2, pack 2.2.1. Ingredients: action=prompt_action_160 v3; situation=prompt_situation_2127 v1.

- **curated_review_prompt_action_162_v2**: Making a picnic spreadsheet
  Original: prompt_action_162 v2, pack 2.2.1. Ingredients: action=prompt_action_162 v3; situation=prompt_situation_2128 v1.

- **curated_review_prompt_action_163_v2**: Rehearsing an apology with a puppet
  Original: prompt_action_163 v2, pack 2.2.1. Ingredients: action=prompt_action_068 v2; object=prompt_object_095 v1.

- **curated_review_prompt_action_164_v2**: Pretending to understand the rules
  Original: prompt_action_164 v2, pack 2.2.1. Ingredients: action=prompt_action_164 v3; situation=prompt_situation_2129 v1.

- **curated_review_prompt_action_165_v2**: Proposing equal voting rights for a plant
  Original: prompt_action_165 v2, pack 2.2.1. Ingredients: action=prompt_action_165 v3; situation=prompt_situation_2130 v1.

- **curated_review_prompt_action_166_v2**: Trying to keep a surprise
  Original: prompt_action_166 v2, pack 2.2.1. Ingredients: action=prompt_action_166 v3.

- **curated_review_prompt_action_167_v2**: Celebrating quietly
  Original: prompt_action_167 v2, pack 2.2.1. Ingredients: action=prompt_action_167 v3; situation=prompt_situation_2131 v1.

- **curated_review_prompt_location_002_v2**: A tiny restaurant kitchen
  Original: prompt_location_002 v2, pack 2.2.1. Ingredients: location=prompt_location_002 v3.

- **curated_review_prompt_location_007_v1**: The quiet carriage of a sleeper train
  Original: prompt_location_007 v1, pack 2.2.1. Ingredients: location=prompt_location_007 v2.

- **curated_review_prompt_location_013_v1**: A cramped orchestra pit
  Original: prompt_location_013 v1, pack 2.2.1. Ingredients: location=prompt_location_013 v2.

- **curated_review_prompt_location_075_v2**: An imaginary dragon dentist's waiting room
  Original: prompt_location_075 v2, pack 2.2.1. Ingredients: location=prompt_location_075 v3; role=prompt_role_080 v1.

- **curated_review_prompt_location_076_v2**: A tiny cafe
  Original: prompt_location_076 v2, pack 2.2.1. Ingredients: location=prompt_location_076 v3.

- **curated_review_prompt_location_079_v2**: A ferry VIP lounge
  Original: prompt_location_079 v2, pack 2.2.1. Ingredients: location=prompt_location_079 v3.

- **curated_review_prompt_location_080_v2**: An imaginary-pet lost-and-found
  Original: prompt_location_080 v2, pack 2.2.1. Ingredients: location=prompt_location_080 v3; situation=prompt_situation_2132 v1.

- **curated_review_prompt_location_083_v2**: The mayor's emergency biscuit cupboard
  Original: prompt_location_083 v2, pack 2.2.1. Ingredients: location=prompt_location_083 v3; object=prompt_object_044 v1.

- **curated_review_prompt_location_086_v2**: A secret bakery cake-testing room
  Original: prompt_location_086 v2, pack 2.2.1. Ingredients: location=prompt_location_086 v3.

- **curated_review_prompt_location_091_v2**: A tiny cottage
  Original: prompt_location_091 v2, pack 2.2.1. Ingredients: location=prompt_location_091 v3.

- **curated_review_prompt_location_092_v2**: A tiny community cinema
  Original: prompt_location_092 v2, pack 2.2.1. Ingredients: location=prompt_location_092 v3.

- **curated_review_prompt_location_2092_v1**: a romantic restaurant on Valentine’s Day
  Original: prompt_location_2092 v1, pack 2.2.1. Ingredients: location=prompt_location_2092 v2; situation=prompt_situation_2133 v1.

- **curated_review_prompt_location_2093_v1**: a very quiet hotel breakfast after a singles party
  Original: prompt_location_2093 v1, pack 2.2.1. Ingredients: location=prompt_location_2093 v2; situation=prompt_situation_2134 v1.

- **curated_review_prompt_profession_053_v1**: Wedding planner for very disorganized pigeons
  Original: prompt_profession_053 v1, pack 2.2.1. Ingredients: profession=prompt_profession_002 v1; situation=prompt_situation_2135 v1.

- **curated_review_prompt_profession_055_v2**: Imaginary dragon dentist
  Original: prompt_profession_055 v2, pack 2.2.1. Ingredients: profession=prompt_profession_055 v3; role=prompt_role_080 v1.

- **curated_review_prompt_profession_057_v1**: Museum curator of mildly disappointing objects
  Original: prompt_profession_057 v1, pack 2.2.1. Ingredients: profession=prompt_profession_001 v1; situation=prompt_situation_2136 v1.

- **curated_review_prompt_profession_058_v1**: Personal assistant to an extremely busy goose
  Original: prompt_profession_058 v1, pack 2.2.1. Ingredients: profession=prompt_profession_058 v2; role=prompt_role_079 v1.

- **curated_review_prompt_profession_061_v1**: Inspector of suspiciously comfortable chairs
  Original: prompt_profession_061 v1, pack 2.2.1. Ingredients: profession=prompt_profession_061 v2; situation=prompt_situation_2137 v1.

- **curated_review_prompt_profession_062_v1**: Motivational speaker for office printers
  Original: prompt_profession_062 v1, pack 2.2.1. Ingredients: profession=prompt_profession_062 v2; object=prompt_object_091 v1.

- **curated_review_prompt_profession_064_v1**: Competitive spoon-polishing judge
  Original: prompt_profession_064 v1, pack 2.2.1. Ingredients: profession=prompt_profession_064 v2.

- **curated_review_prompt_profession_2084_v1**: wedding-night hotel concierge
  Original: prompt_profession_2084 v1, pack 2.2.1. Ingredients: profession=prompt_profession_2084 v2.

- **curated_review_prompt_role_041_v2**: Mysterious visitor
  Original: prompt_role_041 v2, pack 2.2.1. Ingredients: role=prompt_role_041 v3.

- **curated_review_prompt_role_064_v2**: Delegating manager
  Original: prompt_role_064 v2, pack 2.2.1. Ingredients: role=prompt_role_064 v3; action=prompt_action_168 v1.

- **curated_review_prompt_role_076_v2**: Plant representative
  Original: prompt_role_076 v2, pack 2.2.1. Ingredients: role=prompt_role_076 v3; object=prompt_object_082 v1.

- **curated_review_prompt_object_001_v1**: An enormous ceremonial key
  Original: prompt_object_001 v1, pack 2.2.1. Ingredients: object=prompt_object_001 v2.

- **curated_review_prompt_object_002_v1**: A mysterious suitcase
  Original: prompt_object_002 v1, pack 2.2.1. Ingredients: object=prompt_object_002 v2.

- **curated_review_prompt_object_004_v1**: A trophy for an unusual achievement
  Original: prompt_object_004 v1, pack 2.2.1. Ingredients: object=prompt_object_004 v2; situation=prompt_situation_2138 v1.

- **curated_review_prompt_object_006_v1**: A suitcase full of empty envelopes
  Original: prompt_object_006 v1, pack 2.2.1. Ingredients: object=prompt_object_006 v2.

- **curated_review_prompt_object_011_v1**: A very important rubber stamp
  Original: prompt_object_011 v1, pack 2.2.1. Ingredients: object=prompt_object_011 v2.

- **curated_review_prompt_object_012_v1**: A postcard from next door
  Original: prompt_object_012 v1, pack 2.2.1. Ingredients: object=prompt_object_012 v2; situation=prompt_situation_2139 v1.

- **curated_review_prompt_object_014_v1**: A whistle nobody can hear
  Original: prompt_object_014 v1, pack 2.2.1. Ingredients: object=prompt_object_014 v2; situation=prompt_situation_2140 v1.

- **curated_review_prompt_object_016_v1**: A hat with too many pockets
  Original: prompt_object_016 v1, pack 2.2.1. Ingredients: object=prompt_object_016 v2.

- **curated_review_prompt_object_017_v1**: A ribbon from an unknown competition
  Original: prompt_object_017 v1, pack 2.2.1. Ingredients: object=prompt_object_017 v2; situation=prompt_situation_2141 v1.

- **curated_review_prompt_object_020_v1**: A velvet cushion for an ordinary potato
  Original: prompt_object_020 v1, pack 2.2.1. Ingredients: object=prompt_object_020 v2; situation=prompt_situation_2142 v1.

- **curated_review_prompt_object_034_v1**: A board game missing its board
  Original: prompt_object_034 v1, pack 2.2.1. Ingredients: object=prompt_object_034 v2; situation=prompt_situation_2143 v1.

- **curated_review_prompt_object_040_v1**: A scarf for a garden statue
  Original: prompt_object_040 v1, pack 2.2.1. Ingredients: object=prompt_object_040 v2; situation=prompt_situation_2144 v1.

- **curated_review_prompt_object_048_v1**: A jar of perfectly ordinary sand
  Original: prompt_object_048 v1, pack 2.2.1. Ingredients: object=prompt_object_048 v2.

- **curated_review_prompt_object_050_v1**: A wooden spoon with a medal
  Original: prompt_object_050 v1, pack 2.2.1. Ingredients: object=prompt_object_050 v2; situation=prompt_situation_2145 v1.

- **curated_review_prompt_object_051_v1**: An unusually formal picnic basket
  Original: prompt_object_051 v1, pack 2.2.1. Ingredients: object=prompt_object_051 v2.

- **curated_review_prompt_object_055_v1**: A map of an imaginary island
  Original: prompt_object_055 v1, pack 2.2.1. Ingredients: object=prompt_object_055 v2.

- **curated_review_prompt_object_057_v1**: A brass nameplate with a spelling mistake
  Original: prompt_object_057 v1, pack 2.2.1. Ingredients: object=prompt_object_057 v2; situation=prompt_situation_2146 v1.

- **curated_review_prompt_object_061_v1**: A formal invitation addressed to your toaster
  Original: prompt_object_061 v1, pack 2.2.1. Ingredients: object=prompt_object_061 v2; situation=prompt_situation_2147 v1.

- **curated_review_prompt_object_062_v1**: A tiny velvet rope for a very important biscuit
  Original: prompt_object_062 v1, pack 2.2.1. Ingredients: object=prompt_object_062 v2; situation=prompt_situation_2148 v1.

- **curated_review_prompt_object_063_v1**: An employee-of-the-month sash for a houseplant
  Original: prompt_object_063 v1, pack 2.2.1. Ingredients: object=prompt_object_063 v2; situation=prompt_situation_2149 v1.

- **curated_review_prompt_object_064_v1**: A luxury brochure for an ordinary cupboard
  Original: prompt_object_064 v1, pack 2.2.1. Ingredients: object=prompt_object_064 v2; situation=prompt_situation_2150 v1.

- **curated_review_prompt_object_065_v1**: A sandwich with its own security badge
  Original: prompt_object_065 v1, pack 2.2.1. Ingredients: object=prompt_object_065 v2; situation=prompt_situation_2151 v1.

- **curated_review_prompt_object_066_v1**: A wedding seating plan written by a pigeon
  Original: prompt_object_066 v1, pack 2.2.1. Ingredients: object=prompt_object_066 v2; situation=prompt_situation_2152 v1.

- **curated_review_prompt_object_067_v1**: A trophy for being almost on time
  Original: prompt_object_067 v1, pack 2.2.1. Ingredients: object=prompt_object_067 v2; situation=prompt_situation_2153 v1.

- **curated_review_prompt_object_068_v1**: An emergency kit containing one extremely fancy napkin
  Original: prompt_object_068 v1, pack 2.2.1. Ingredients: object=prompt_object_068 v2; situation=prompt_situation_2154 v1.

- **curated_review_prompt_object_069_v1**: A customer complaint from an imaginary dragon
  Original: prompt_object_069 v1, pack 2.2.1. Ingredients: object=prompt_object_069 v2; role=prompt_role_080 v1.

- **curated_review_prompt_object_070_v1**: An official permit to look mysterious
  Original: prompt_object_070 v1, pack 2.2.1. Ingredients: object=prompt_object_070 v2; action=prompt_action_169 v1.

- **curated_review_prompt_genre_017_v1**: Musical rehearsal
  Original: prompt_genre_017 v1, pack 2.2.1. Ingredients: genre=prompt_genre_017 v2; action=prompt_action_170 v1.

- **curated_review_prompt_situation_074_v1**: You must explain why the office plant has its own parking space
  Original: prompt_situation_074 v1, pack 2.2.1. Ingredients: situation=prompt_situation_074 v2; action=prompt_action_171 v1.

- **curated_review_prompt_situation_088_v1**: You have to interview the person who stole your imaginary job
  Original: prompt_situation_088 v1, pack 2.2.1. Ingredients: situation=prompt_situation_088 v2; action=prompt_action_172 v1.

- **curated_review_prompt_situation_095_v1**: You have to apologize to the official town scarecrow
  Original: prompt_situation_095 v1, pack 2.2.1. Ingredients: situation=prompt_situation_095 v2; action=prompt_action_173 v1.

- **curated_review_prompt_situation_155_v2**: A family recipe has been entrusted to them
  Original: prompt_situation_155 v2, pack 2.2.1. Ingredients: situation=prompt_situation_155 v3.

- **curated_review_prompt_situation_211_v2**: The wrapping must go unnoticed
  Original: prompt_situation_211 v2, pack 2.2.1. Ingredients: situation=prompt_situation_211 v3.

- **curated_review_prompt_emotion_028_v1**: Comic self-importance
  Original: prompt_emotion_028 v1, pack 2.2.1. Ingredients: emotion=prompt_emotion_028 v2.

- **curated_review_prompt_emotion_039_v1**: Patient reassurance
  Original: prompt_emotion_039 v1, pack 2.2.1. Ingredients: emotion=prompt_emotion_039 v2; action=prompt_action_174 v1.
