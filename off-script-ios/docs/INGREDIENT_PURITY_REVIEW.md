# Ingredient purity and short-place review

## Current bounded 2.5 review

The [complete 2.5 approval](../content/editorial/ingredient-purity-2.5.0.json)
preserves all 1,182 ingredient IDs and the historical 2.3/2.4 records. Sixteen
emotion changes, eight bounded social-situation rewrites and task/grammar
metadata corrections produce 583 preserved originals. Shared task pools, exact locks, unique role labels
and optional composition are covered by the
[2.5 engine review](../content/editorial/prompt-engine-2.5.0.md).
The sections below retain the historical earlier passes.

The 2.3.0 review covered every one of the 1,075 ingredients in the prior live library, all 96 relationship templates and the newly separated ingredients. It made 181 text corrections and neutralized the former-teammates role labels, producing 1,182 ingredients and 463 preserved original examples. Six duplicate IDs resolve to equivalent canonical ingredients.

## Short places — current pack 2.4.0

All 96 locations now use explicitly reviewed, unique place names of no more than three words and 24 characters. For example, `The repair counter of an umbrella shop` becomes **Repair shop**. Each gets a new version; every previous location remains archived with its exact source text, version and 2.3.0 pack provenance. The library still has 1,182 ingredients, with 559 preserved originals. IDs, ratings, player limits and Party seed tags remain unchanged.

Studio defaults to one grounded location. Relationships, situations and roles are opt-in. A lone location copies as its bare name; extra mixing controls appear only for multiple ingredients. Existing custom recipes, saved prompts and locked originals are not reset.

The [2.4 review](../content/editorial/ingredient-purity-2.4.0.json) approves all current values and records each of the 96 place changes. The [place review script](../scripts/apply-simple-location-review.py) applies that explicit mapping, not runtime truncation. The full historical rebuild restores original Party location metadata before applying the earlier splits, then applies the new place review. This prevents the new grounded place flavor from changing unrelated situation cards.

The tables below remain the historical **2.3.0** review.

## Rules used

- Action: one activity, with the object needed to identify it; no appended scene, special method, prop, deadline or payoff.
- Location: a place, without an attached time, event or social rule.
- Relationship: how people are connected, with neutral participant labels rather than extra status or goals.
- Role/Profession: an identity or job, without an attached behavior, client personality or scene problem.
- Emotion: a feeling or emotional attitude, without a prescribed cause or performance instruction.
- Object: a prop, allowing physical descriptions but separating added recipients, events and directions.
- Genre: a style or format, without an attached activity.
- Situation: one event, problem or external condition; no appended instruction telling a player what to do.
- Opening line: an actual utterance. Its fictional detail is intentional dialogue, not an instruction attached to another category.

No runtime word-stripping or AI rewriting was introduced. Changes are explicit editorial records. Extra details are separate reusable values linked to the original combined example; generation only includes selected categories.

## Coverage

| Category | Prior values reviewed | Text corrections | Current values |
|---|---:|---:|---:|
| location | 95 | 13 | 96 |
| profession | 73 | 8 | 71 |
| role | 78 | 3 | 81 |
| emotion | 51 | 2 | 51 |
| action | 167 | 122 | 172 |
| situation | 334 | 5 | 411 |
| object | 71 | 27 | 94 |
| genre | 25 | 1 | 25 |
| opening_line | 85 | 0 | 85 |
| relationship | 96 | 0 | 96 |

## Saved compatibility

Existing snapshots, locks, IDs and source versions remain exact. The existing Update ingredients action upgrades an editable copy without selecting new categories. Historical lookup now matches both ID and original text, so several old values of one ingredient remain recognizable. Archived examples retain their original text; current references point at valid versioned ingredients.

## All text corrections

| Source ID | Before | New standalone value |
|---|---|---|
| prompt_action_001 | Repairing an imaginary umbrella | Repairing an umbrella |
| prompt_action_002 | Hiding a birthday surprise | Hiding a birthday present |
| prompt_action_004 | Sorting a mountain of mismatched socks | Sorting socks |
| prompt_action_006 | Wrapping an awkwardly shaped present | Wrapping a present |
| prompt_action_007 | Trying to fold a giant map | Folding a map |
| prompt_action_009 | Rehearsing a welcome speech | Rehearsing a speech |
| prompt_action_010 | Finding the source of a mysterious squeak | Locating a squeak |
| prompt_action_012 | Moving a very precious plant | Moving a plant |
| prompt_action_013 | Testing an imaginary invention | Testing an invention |
| prompt_action_015 | Labeling boxes for a move | Labeling boxes |
| prompt_action_017 | Tuning an imaginary piano | Tuning a piano |
| prompt_action_020 | Searching for a tiny missing screw | Searching for a screw |
| prompt_action_021 | Sorting a box of old photographs | Sorting photographs |
| prompt_action_022 | Holding a ladder steady from a seated position | Holding a ladder steady |
| prompt_action_025 | Mending a beloved old jacket | Mending a jacket |
| prompt_action_026 | Checking tickets for an imaginary train | Checking train tickets |
| prompt_action_027 | Comparing two nearly identical paint samples | Comparing paint samples |
| prompt_action_031 | Arranging chairs for a club meeting | Arranging chairs |
| prompt_action_032 | Measuring a room with footsteps | Measuring a room |
| prompt_action_033 | Demonstrating a very complicated remote control | Demonstrating a remote control |
| prompt_action_034 | Testing the acoustics of an empty room | Testing a room’s acoustics |
| prompt_action_035 | Showing someone a secret shortcut | Showing a shortcut |
| prompt_action_036 | Reorganizing a shared kitchen drawer | Reorganizing a kitchen drawer |
| prompt_action_037 | Trying to get a kite out of a tree | Retrieving a kite |
| prompt_action_039 | Practicing a dance using only hands | Practicing a dance |
| prompt_action_040 | Cleaning a window on opposite sides | Cleaning a window |
| prompt_action_041 | Taking inventory of a tiny shop | Taking inventory |
| prompt_action_042 | Polishing an enormous trophy | Polishing a trophy |
| prompt_action_044 | Choosing a frame for a family photo | Choosing a picture frame |
| prompt_action_045 | Sharing a small umbrella | Sharing an umbrella |
| prompt_action_046 | Rehearsing the timing of a surprise entrance | Rehearsing an entrance |
| prompt_action_047 | Sorting the mail for a whole street | Sorting the mail |
| prompt_action_049 | Presenting a mysterious object for inspection | Presenting an object for inspection |
| prompt_action_050 | Trying to teach a new board game | Teaching a board game |
| prompt_action_052 | Designing a flag for a very small club | Designing a flag |
| prompt_action_053 | Folding paper animals for a display | Folding paper animals |
| prompt_action_054 | Testing whether a chair squeaks | Testing a chair |
| prompt_action_055 | Transplanting an imaginary cactus | Transplanting a cactus |
| prompt_action_056 | Building a miniature town | Building a model town |
| prompt_action_057 | Drawing a route from memory | Drawing a route |
| prompt_action_059 | Stacking cups for a celebration | Stacking cups |
| prompt_action_061 | Checking the contents of an emergency snack kit | Checking a snack kit |
| prompt_action_062 | Searching for the end of a roll of tape | Finding the end of a roll of tape |
| prompt_action_063 | Trying to make a wobbly table stable | Stabilizing a table |
| prompt_action_065 | Returning borrowed things to their owners | Returning borrowed things |
| prompt_action_066 | Giving a houseplant a very serious performance review | Giving a performance review |
| prompt_action_067 | Installing a velvet rope around an ordinary chair | Installing a velvet rope |
| prompt_action_068 | Rehearsing an apology to a ceremonial goose | Rehearsing an apology |
| prompt_action_069 | Making a tiny welcome pack for a new toaster | Making a welcome pack |
| prompt_action_070 | Trying to fit a wedding cake into a bicycle helmet | Packing a cake |
| prompt_action_072 | Teaching an imaginary dragon how to use a doorbell | Demonstrating a doorbell |
| prompt_action_074 | Giving a sandwich an overcomplicated security check | Performing a security check |
| prompt_action_076 | Wrapping an enormous spoon | Wrapping a spoon |
| prompt_action_078 | Taking an emergency family photograph with an imaginary goat | Taking a photograph |
| prompt_action_080 | Making an official complaint about a very smug cake | Making a complaint |
| prompt_action_081 | Preparing a surprise for a parent | Preparing a surprise |
| prompt_action_082 | Coaching their old club | Coaching a club |
| prompt_action_083 | Sharing a garden fence | Maintaining a garden fence |
| prompt_action_085 | Meeting as equals | Holding a meeting |
| prompt_action_086 | Sorting their final shared box | Sorting a shared box |
| prompt_action_087 | Meeting for the first time | Meeting |
| prompt_action_088 | Planning an unusual cake | Planning a cake |
| prompt_action_089 | Sharing one greenhouse | Sharing a greenhouse |
| prompt_action_090 | Rehearsing their first pitch | Rehearsing a pitch |
| prompt_action_092 | Tuning up together | Tuning instruments |
| prompt_action_093 | Fixing an old sign | Fixing a sign |
| prompt_action_094 | Moving day | Moving belongings |
| prompt_action_095 | Returning something borrowed years ago | Returning a borrowed item |
| prompt_action_096 | Learning a craft from an old manual | Learning a craft |
| prompt_action_097 | Opening a restaurant together | Opening a restaurant |
| prompt_action_098 | Planning a family reunion | Planning a reunion |
| prompt_action_099 | Choosing a new captain | Choosing a captain |
| prompt_action_100 | Finishing an old project | Finishing a project |
| prompt_action_102 | Deciding what to put in a time capsule | Choosing items for a time capsule |
| prompt_action_103 | Preparing a comeback show | Preparing a show |
| prompt_action_104 | Planning opening night | Planning an opening night |
| prompt_action_105 | Coordinating a family reunion | Coordinating a reunion |
| prompt_action_107 | Preparing a ceremonial voyage | Preparing a voyage |
| prompt_action_109 | Organizing a street feast | Organizing a feast |
| prompt_action_110 | Preparing a surprise performance | Preparing a performance |
| prompt_action_111 | Preparing an anniversary broadcast | Preparing a broadcast |
| prompt_action_112 | Choosing a new fountain | Choosing a fountain |
| prompt_action_113 | Preparing costumes for a community play | Preparing costumes |
| prompt_action_114 | Choosing a comeback song | Choosing a song |
| prompt_action_116 | Clearing out an old workshop | Clearing out a workshop |
| prompt_action_118 | Organizing a friendly tournament | Organizing a tournament |
| prompt_action_119 | Dividing the first harvest | Dividing a harvest |
| prompt_action_121 | Making a first original movie | Making a movie |
| prompt_action_122 | Taking over a family food stall | Taking over a food stall |
| prompt_action_125 | Preparing a thank-you dinner | Preparing a dinner |
| prompt_action_127 | Identifying a first find | Identifying a find |
| prompt_action_128 | Building a reunion float | Building a parade float |
| prompt_action_129 | Rehearsing a new show | Rehearsing a show |
| prompt_action_130 | Opening a community cinema | Opening a cinema |
| prompt_action_131 | Preparing for a relative's birthday performance | Preparing a birthday performance |
| prompt_action_132 | Negotiating custody of an air fryer | Negotiating ownership |
| prompt_action_133 | Covering for a hired raccoon | Covering for someone |
| prompt_action_134 | Returning a terrible family gift | Returning a gift |
| prompt_action_135 | Debating whether toast counts as a tasting menu | Debating a menu |
| prompt_action_136 | Opening a luxury hotel for imaginary pets | Opening a hotel |
| prompt_action_137 | Planning a small picnic with an enormous fog machine | Planning a picnic |
| prompt_action_138 | Writing an apology to the office printer | Writing an apology |
| prompt_action_139 | Opening a cafe staffed by a goose | Opening a cafe |
| prompt_action_140 | Replacing a family trophy with a potato | Replacing a trophy |
| prompt_action_141 | Rehearsing a formal apology to a duck | Rehearsing a formal apology |
| prompt_action_142 | Organizing a tiny picnic with an excessive budget | Organizing a picnic |
| prompt_action_143 | Choosing a dramatic name for an ordinary spoon | Naming an object |
| prompt_action_144 | Rehearsing a magic show booked by mistake | Rehearsing a magic show |
| prompt_action_147 | Finishing early | Finishing a task |
| prompt_action_149 | Packing for every possibility | Packing for a trip |
| prompt_action_151 | Guarding an empty box | Guarding a box |
| prompt_action_155 | Preparing to say goodbye | Saying goodbye |
| prompt_action_157 | Taking a small risk | Taking a risk |
| prompt_action_158 | Printing matching team jackets | Printing team jackets |
| prompt_action_159 | Treating a minor inconvenience as a royal ceremony | Holding a ceremony |
| prompt_action_160 | Bringing an emergency fog machine | Bringing a fog machine |
| prompt_action_162 | Making a picnic spreadsheet | Making a spreadsheet |
| prompt_action_163 | Rehearsing an apology with a puppet | Rehearsing an apology |
| prompt_action_164 | Pretending to understand the rules | Explaining the rules |
| prompt_action_165 | Proposing equal voting rights for a plant | Proposing voting rights |
| prompt_action_166 | Trying to keep a surprise | Keeping a surprise |
| prompt_action_167 | Celebrating quietly | Celebrating |
| prompt_location_002 | A tiny restaurant kitchen | A restaurant kitchen |
| prompt_location_007 | The quiet carriage of a sleeper train | A sleeper-train carriage |
| prompt_location_013 | A cramped orchestra pit | An orchestra pit |
| prompt_location_075 | An imaginary dragon dentist's waiting room | A dentist’s waiting room |
| prompt_location_076 | A tiny cafe | A cafe |
| prompt_location_079 | A ferry VIP lounge | A ferry lounge |
| prompt_location_080 | An imaginary-pet lost-and-found | A lost-and-found office |
| prompt_location_083 | The mayor's emergency biscuit cupboard | A cupboard |
| prompt_location_086 | A secret bakery cake-testing room | A bakery testing room |
| prompt_location_091 | A tiny cottage | A cottage |
| prompt_location_092 | A tiny community cinema | A community cinema |
| prompt_location_2092 | a romantic restaurant on Valentine’s Day | a romantic restaurant |
| prompt_location_2093 | a very quiet hotel breakfast after a singles party | a hotel dining room |
| prompt_profession_053 | Wedding planner for very disorganized pigeons | Wedding planner |
| prompt_profession_055 | Imaginary dragon dentist | Dentist |
| prompt_profession_057 | Museum curator of mildly disappointing objects | Museum curator |
| prompt_profession_058 | Personal assistant to an extremely busy goose | Personal assistant |
| prompt_profession_061 | Inspector of suspiciously comfortable chairs | Chair inspector |
| prompt_profession_062 | Motivational speaker for office printers | Motivational speaker |
| prompt_profession_064 | Competitive spoon-polishing judge | Spoon-polishing judge |
| prompt_profession_2084 | wedding-night hotel concierge | bridal concierge |
| prompt_role_041 | Mysterious visitor | Visitor |
| prompt_role_064 | Delegating manager | Manager |
| prompt_role_076 | Plant representative | Representative |
| prompt_object_001 | An enormous ceremonial key | A large ceremonial key |
| prompt_object_002 | A mysterious suitcase | A suitcase |
| prompt_object_004 | A trophy for an unusual achievement | An achievement trophy |
| prompt_object_006 | A suitcase full of empty envelopes | A suitcase full of envelopes |
| prompt_object_011 | A very important rubber stamp | A rubber stamp |
| prompt_object_012 | A postcard from next door | A postcard |
| prompt_object_014 | A whistle nobody can hear | A whistle |
| prompt_object_016 | A hat with too many pockets | A hat with pockets |
| prompt_object_017 | A ribbon from an unknown competition | A competition ribbon |
| prompt_object_020 | A velvet cushion for an ordinary potato | A velvet cushion |
| prompt_object_034 | A board game missing its board | A board game |
| prompt_object_040 | A scarf for a garden statue | A scarf |
| prompt_object_048 | A jar of perfectly ordinary sand | A jar of sand |
| prompt_object_050 | A wooden spoon with a medal | A wooden spoon |
| prompt_object_051 | An unusually formal picnic basket | A picnic basket |
| prompt_object_055 | A map of an imaginary island | A map of an island |
| prompt_object_057 | A brass nameplate with a spelling mistake | A brass nameplate |
| prompt_object_061 | A formal invitation addressed to your toaster | A formal invitation |
| prompt_object_062 | A tiny velvet rope for a very important biscuit | A small velvet rope |
| prompt_object_063 | An employee-of-the-month sash for a houseplant | An employee-of-the-month sash |
| prompt_object_064 | A luxury brochure for an ordinary cupboard | A brochure |
| prompt_object_065 | A sandwich with its own security badge | A sandwich |
| prompt_object_066 | A wedding seating plan written by a pigeon | A wedding seating plan |
| prompt_object_067 | A trophy for being almost on time | A punctuality trophy |
| prompt_object_068 | An emergency kit containing one extremely fancy napkin | An emergency kit |
| prompt_object_069 | A customer complaint from an imaginary dragon | A customer complaint |
| prompt_object_070 | An official permit to look mysterious | An official permit |
| prompt_genre_017 | Musical rehearsal | Musical |
| prompt_situation_074 | You must explain why the office plant has its own parking space | The office plant has its own parking space |
| prompt_situation_088 | You have to interview the person who stole your imaginary job | Someone has taken your job |
| prompt_situation_095 | You have to apologize to the official town scarecrow | An apology is owed to the town scarecrow |
| prompt_situation_155 | A family recipe has been entrusted to them | A family recipe has been entrusted to someone |
| prompt_situation_211 | The wrapping must go unnoticed | The gift must remain a surprise |
| prompt_emotion_028 | Comic self-importance | Self-importance |
| prompt_emotion_039 | Patient reassurance | Patience |

## Duplicate aliases

| Retired ID | Canonical ID |
|---|---|
| prompt_location_078 | prompt_location_002 |
| prompt_profession_053 | prompt_profession_002 |
| prompt_profession_057 | prompt_profession_001 |
| prompt_action_152 | prompt_action_068 |
| prompt_action_163 | prompt_action_068 |
| prompt_object_086 | prompt_object_065 |

## Reproducible sources

- `content/editorial/ingredient-purity-2.3.0.json`: complete source coverage, corrections, reusable extras and approved current values.
- `python3 scripts/build-ingredient-pack.py`: regenerates the historical splits and applies the reviewed pass; repeated output hashes were identical.
- `tests/unit/ingredient-purity.test.ts`: complete review coverage, all corrected single-category generations, every corrected historical upgrade/lock, and multiple historical values sharing an ID.

The private-goal and game-instruction banks intentionally describe behaviors and are outside the ten Studio ingredient categories. They were not stripped into neutral ingredients.

## Executed verification

97 unit/storage tests, all 32 browser scenarios, final Studio composition regressions, strict typecheck, content review validation, targeted ESLint, production web export, identical repeated authoring hashes and the targeted mixed-card upgrade check passed. iOS preparation remains paused.
