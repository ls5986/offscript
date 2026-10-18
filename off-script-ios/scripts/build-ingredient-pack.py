from pathlib import Path
from copy import deepcopy
import json,re
root=Path(__file__).resolve().parent.parent/'src/content'
bank=json.loads((root/'v1/prompts.json').read_text())+json.loads((root/'v1/playful-prompts.json').read_text())
rels=json.loads((root/'v1/relationships.json').read_text())+json.loads((root/'v1/playful-relationships.json').read_text())
byid={p['id']:deepcopy(p) for p in bank}; original={p['id']:deepcopy(p) for p in bank}
curated=[]
# Explicit editorial splits. A location retains only a place; the second value is a separate condition/event.
locations='''A ferry terminal|A fog delay
A tiny restaurant kitchen|The restaurant is very popular
Backstage at a community theater|
A rooftop garden|One enormous tomato has grown
An airport baggage office|It is after midnight
A museum gift shop|Opening time is approaching
The quiet carriage of a sleeper train|
A laundromat|It is the last day of business
A wedding venue|There is a power cut
A neighborhood bakery|Dawn is approaching
A lighthouse visitor center|
The lost property room at a swimming pool|
A cramped orchestra pit|
A bus depot|A staff picnic is taking place
A garden center|Heavy rain
An apartment balcony|The apartment is crowded
A village hall|A talent show is about to begin
A radio studio|The microphone is stuck on
The waiting room of a pet grooming salon|
A lakeside campsite|
A bookstore|The first book signing is taking place
A hotel elevator|The elevator is stuck between floors
A community fridge|Closing time is approaching
A mountain cable car station|
A cinema|The credits have finished
A coat check|A charity gala is taking place
The repair counter of an umbrella shop|
A weather station|Unusually calm weather
An antique shop|A suspiciously modern item has appeared
A rehearsal room|Two choirs have booked the same space
A town council chamber|A new fountain is under discussion
The control booth of a miniature railway|
A beach kiosk|The tourist season has ended
A kitchen showroom|A demonstration is taking place
An archaeology dig tent|
An observatory|A cloudy night
A costume rental shop|Every costume is due back today
A pottery studio|The kiln is about to open
A school reunion registration desk|
A frozen food aisle|An inventory is under way
A narrowboat|The canal lock is crowded
A florist's shop|Three weddings are scheduled
A library meeting room|Two clubs have reserved the same room
A chess tournament refreshment table|
An aquarium feeding station|
A clock repair workshop|It is noon
A roadside diner|A delivery is overdue
The sorting room of a local post office|
A planetarium dressing room|
A train station piano area|
A farm stand|An honesty box
A sailing club|A windless afternoon
An outdoor sculpture garden|A sculpture is about to be unveiled
A town archive|An unlabeled box has arrived
A bowling alley|League night is about to begin
A shoe shop|Only one pair remains for sale
A coworking space|Only one desk is available
A basement classroom|A public speaking class is taking place
A toy repair cafe|It is a busy Saturday
A ferry's onboard cafeteria|
A birdwatching hide|The chairs squeak
A maze customer-service booth|
A jam competition judging tent|
An audio-guide recording booth|
A bridge|Parade decorations are up
A picnic shelter|Unexpected hail
A parade-float warehouse|
A small end-of-line railway station|
A community kitchen|A feast is about to begin
A greenhouse|An unexplained footprint has appeared
A small castle complaints desk|
A garden-gnome spa|
A sandwich-shop back office|
A wedding venue|A spoon convention has booked the same venue
An imaginary dragon dentist's waiting room|
A tiny cafe|The cafe has suddenly become famous
A hotel lobby|A strict no-boring-hats policy
A restaurant kitchen|Only toast is on the menu
A ferry VIP lounge|The entire lounge consists of one folding chair
An imaginary-pet lost-and-found|
A band's dressing room|The band has no instruments
A garden center|A cactus talent show is taking place
The mayor's emergency biscuit cupboard|
A museum gift shop|Only enormous pencils are for sale
A neighborhood council chamber|One suspicious duck is under discussion
A secret bakery cake-testing room|
A magic-show backstage area|The performers are unprepared
An airport lounge|The lounge is reserved for prize vegetables
A maze customer-service booth|Visitors are disappointed with the maze
A cinema|A documentary about a neighbor's shed is showing'''.splitlines()
assert len(locations)==90
new=[]
counts={c:max(int(p['id'].split('_')[-1]) for p in bank if p['category']==c) for c in {p['category'] for p in bank}}

def ingredient(category,text,parent,form=None):
    for p in list(byid.values())+new:
        if p['category']==category and p['text'].casefold()==text.casefold():return p['id']
    counts[category]+=1
    p={'id':f'prompt_{category}_{counts[category]:03}','category':category,'text':text,'tags':list(parent['tags']),'contentRating':'clean','minPlayers':parent.get('minPlayers',2),'maxPlayers':parent.get('maxPlayers',12),'version':2,'flavor':parent.get('flavor','grounded')}
    if category!='relationship':p['minPlayers']=2;p['maxPlayers']=12
    if form:p['compositionForm']=form
    new.append(p);return p['id']

def preserve(source,refs,roles=None):
    rec={'id':'curated_'+source['id'],'originalText':source['text'],'source':{'id':source['id'],'category':source['category'],'version':source['version'],'packVersion':'1.1.0'},'ingredients':[{'category':c,'id':i} for c,i in refs]}
    if roles:rec['originalRoles']=roles['namedRoles'];rec['originalExpandableRole']=roles['expandableRole']
    curated.append(rec)

for n,line in enumerate(locations,1):
    identity,condition=line.split('|');pid=f'prompt_location_{n:03}';p=byid[pid]
    if p['text']!=identity:
        p['text']=identity;p['version']=2
        refs=[('location',pid)]
        if condition:
            form='condition' if not re.search(r'\b(is|are|has|have|consists|remains|squeak)\b',condition,re.I) else 'clause'
            refs.append(('object',ingredient('object',condition,original[pid])) if n == 51 else ('situation',ingredient('situation',condition,original[pid],form)))
        preserve(original[pid],refs)

# Relationships express only how people are connected. No assigned goals, personalities or scene event.
relationships='''Two adult siblings|Preparing a surprise for a parent|First adult sibling;Second adult sibling
Former teammates|Coaching their old club|First former teammate;Second former teammate
Longtime neighbors|Sharing a garden fence|First neighbor;Second neighbor
Old classmates|Reopening a time capsule|First classmate;Second classmate
A mentor and former apprentice|Meeting as equals|Mentor;Former apprentice
Two cousins|A family recipe has been entrusted to them|First cousin;Second cousin
Former roommates|Sorting their final shared box|First former roommate;Second former roommate
A shop owner and a customer|The shop's first customer has arrived|Shop owner;Customer
Two pen pals|Meeting for the first time|First pen pal;Second pen pal
A ferry captain and a regular passenger|The last crossing of the day is under way|Ferry captain;Regular passenger
A librarian and their replacement|A retirement handover is under way|Librarian;Replacement librarian
Two longtime friends|A ten-year-old promise is due|First friend;Second friend
A baker and a customer|Planning an unusual cake|Baker;Customer
Two rival gardeners|Sharing one greenhouse|First gardener;Second gardener
An artist and a model|A long sitting is coming to an end|Artist;Model
Two co-founders|Rehearsing their first pitch|First co-founder;Second co-founder
An adult child and a parent|Moving house|Adult child;Parent
A tour guide and a local resident||Tour guide;Local resident
Two former bandmates|Tuning up together|First former bandmate;Second former bandmate
A wedding planner and a member of the wedding party||Wedding planner;Wedding-party member
Two volunteers|Fixing an old sign|First volunteer;Second volunteer
A museum curator and a donor|A peculiar object has been donated|Museum curator;Donor
Two longtime chess opponents||First chess opponent;Second chess opponent
A tenant and a caretaker|Moving day|Tenant;Caretaker
Two friends|Returning something borrowed years ago|First friend;Second friend
An inventor and a tester||Inventor;Tester
A radio host and their childhood friend|A live broadcast is under way|Radio host;Childhood friend
Two regular train passengers||First regular passenger;Second regular passenger
A newcomer and a neighborhood greeter||Newcomer;Neighborhood greeter
Two siblings|Learning a craft from an old manual|First sibling;Second sibling
Three former roommates|Opening a restaurant together|First former roommate;Second former roommate;Third former roommate
Three adult cousins|Planning a family reunion|First adult cousin;Second adult cousin;Third adult cousin
Three former teammates|Choosing a new captain|First former teammate;Second former teammate;Third former teammate
Three co-owners|A tiny bookstore has been inherited|First co-owner;Second co-owner;Third co-owner
Three old friends|Finishing an old project|First friend;Second friend;Third friend
Three neighbors|A shared garden has been discovered|First neighbor;Second neighbor;Third neighbor
Three club founders|Choosing a club name|First founder;Second founder;Third founder
Three siblings|Deciding what to put in a time capsule|First sibling;Second sibling;Third sibling
Three tour guides|A local legend has conflicting versions|First guide;Second guide;Third guide
Three fellow performers|Preparing a comeback show|First performer;Second performer;Third performer
Members of a neighborhood theater board|Planning opening night|Theater board member
Members of an extended family|Coordinating a family reunion|Family member
Fellow volunteer gardeners|Entering a flower show|Volunteer gardener
Museum colleagues|An unexplained object is about to go on display|Museum colleague
Members of a ferry crew|Preparing a ceremonial voyage|Ferry crew member
Members of a book club|Planning a public event|Book-club member
Neighbors on the same street|Organizing a street feast|Neighbor
Members of a choir|Preparing a surprise performance|Choir member
Fellow amateur astronomers|A famous visitor is arriving|Astronomy-club member
Members of a bakery team|An enormous order has arrived|Bakery team member
Members of a community radio crew|Preparing an anniversary broadcast|Radio crew member
Members of a walking club|The group is lost near its own town|Walking-club member
Members of a restaurant team|A critic is about to visit|Restaurant team member
Members of a wedding party|A small planning mistake has been discovered|Wedding-party member
Members of a school reunion committee|An old promise has been discovered|Reunion committee member
Members of a neighborhood council|Choosing a new fountain|Council member
Members of a costume team|Preparing costumes for a community play|Costume team member
Bandmates|Choosing a comeback song|Bandmate
Members of a boat club|Organizing a boat launch|Boat-club member
Members of a family|Clearing out an old workshop|Family member
Fellow railway volunteers|Restoring a miniature railway|Railway volunteer
Library colleagues|An overnight event is being planned|Library colleague
Members of a chess club|Organizing a friendly tournament|Chess-club member
Hotel colleagues|A mysterious group booking has arrived|Hotel colleague
Members of a gardening cooperative|Dividing the first harvest|Cooperative member
Members of a local history society|Opening a time capsule|History-society member
Members of a film club|Making a first original movie|Film-club member
Cousins|Taking over a family food stall|Cousin
Classmates in a pottery course|Arranging an exhibition|Pottery classmate
Members of an inventors' team|Rehearsing a product demonstration|Inventor
Members of a community kitchen team|Preparing a thank-you dinner|Kitchen team member
Members of a neighborhood orchestra|Choosing a rehearsal space|Orchestra member
Members of a sailing team|A windless afternoon|Sailing team member
Members of an amateur archaeology team|Identifying a first find|Archaeology team member
Members of a festival committee|The mascot is missing|Festival committee member
Members of a repair cafe team|An unrecognizable machine needs repair|Repair cafe colleague
Former classmates|Building a reunion float|Former classmate
Members of a planetarium crew|Rehearsing a new show|Planetarium crew member
Fellow cinema volunteers|Opening a community cinema|Cinema volunteer
Members of a family band|Preparing for a relative's birthday performance|Family band member
Two roommates|Negotiating custody of an air fryer|First roommate;Second roommate
Two wedding planners|Covering for a hired raccoon|First wedding planner;Second wedding planner
Two neighbors|The garden gnomes are having a public feud|First neighbor;Second neighbor
An employee and their manager|The office plant has been promoted|Employee;Manager
Two adult siblings|Returning a terrible family gift|First adult sibling;Second adult sibling
A chef and a customer|Debating whether toast counts as a tasting menu|Chef;Customer
Two friends|Opening a luxury hotel for imaginary pets|First friend;Second friend
A museum curator and a visitor|The exhibit appears to be someone's missing lunch|Museum curator;Visitor
Two bandmates|The band has been booked as magicians|First bandmate;Second bandmate
Two cousins|Planning a small picnic with an enormous fog machine|First cousin;Second cousin
A landlord and a tenant|A cupboard has been listed as a luxury apartment|Landlord;Tenant
Two colleagues|Writing an apology to the office printer|First colleague;Second colleague
Three friends|Opening a cafe staffed by a goose|First friend;Second friend;Third friend
Three adult siblings|Replacing a family trophy with a potato|First sibling;Second sibling;Third sibling
Three neighbors|Rehearsing a formal apology to a duck|First neighbor;Second neighbor;Third neighbor
Three coworkers|The office plant may need a business card|First coworker;Second coworker;Third coworker
Members of a wedding committee|The wedding planner is a raccoon|Wedding committee member
Members of a neighborhood council|A duck has become extremely popular|Council member
Members of a cafe team|A royal toast inspection is approaching|Cafe team member
Members of a family|Organizing a tiny picnic with an excessive budget|Family member
Members of a museum committee|Choosing a dramatic name for an ordinary spoon|Museum committee member
Office colleagues|The houseplant has become the manager|Office colleague
Bandmates|Rehearsing a magic show booked by mistake|Bandmate
Hotel colleagues|Complaints have arrived from imaginary pets|Hotel colleague'''.splitlines()
assert len(relationships)==104
for n,line in enumerate(relationships,1):
    identity,extra,roles=line.split('|');pid=f'prompt_relationship_{n:03}';p=byid[pid];r=rels[n-1];oldr=deepcopy(r)
    p['text']=identity;p['version']=2;p['relationshipTemplateId']=r['id']
    r['premise']=identity;r['version']=2
    named=roles.split(';')
    if len(named)==1:named=[f'{named[0]} {i+1}' for i in range(r['minPlayers'])]
    r['namedRoles']=named;r['expandableRole']=roles if r['maxPlayers']>len(named) else None
    refs=[('relationship',pid)]
    if extra:
        is_action=bool(re.match(r'^(Preparing|Coaching|Sharing|Reopening|Meeting|Sorting|Planning|Rehearsing|Moving|Tuning|Fixing|Returning|Learning|Opening|Choosing|Finishing|Deciding|Entering|Coordinating|Organizing|Restoring|Dividing|Making|Taking|Arranging|Identifying|Clearing|Covering|Building|Negotiating|Debating|Writing|Replacing)\b',extra))
        refs.append(('action' if is_action else 'situation',ingredient('action' if is_action else 'situation',extra,original[pid],'gerund' if is_action else None)))
    if n == 2: p['version']=3;r['version']=3
    preserve(original[pid],refs,oldr)

# Recover additional independent ingredients in the larger original combinations.
for source_n, category, text in [(20,'emotion','Nervous anticipation'),(41,'situation','The theater is struggling'),(42,'location','A tiny cottage'),(53,'action','Practicing restaurant service'),(75,'action','Replacing a festival mascot'),(79,'location','A tiny community cinema')]:
    pid=f'prompt_relationship_{source_n:03}'
    record=next(c for c in curated if c['source']['id']==pid)
    if not any(ref["category"]==category for ref in record['ingredients']):
        record['ingredients'].append({'category':category,'id':ingredient(category,text,original[pid])})

# Pure character roles. Original performances/goals survive as curated examples, not defaults assigned to a relationship.
roles='''Group leader|\nNewcomer|\nSkeptic|\nSpokesperson|\nKey keeper|\nInstruction reader|\nVolunteer|\nPeacemaker|\nOptimist|\nProblem solver|\nDetail collector|\nProject participant|Finishing early\nUnofficial historian|\nSubstitute|\nRival|\nOrganizer|\nSurprise coordinator|Protecting a surprise\nNote taker|\nTraveler|Packing for every possibility\nExpert|\nExplainer|\nNavigator|\nChecklist keeper|\nWelcoming-committee member|\nMediator|\nEvent participant|Too many promises have been made\nEarly arrival|\nTeam member|\nFirst-time speaker|Practicing a speech\nInventor|\nSnack provider|\nTemporary caretaker|\nMentor|\nBox keeper|Guarding an empty box\nOpinion collector|\nReturning participant|\nApology writer|Rehearsing an apology\nNew member|\nTraditionalist|\nProcess designer|\nMysterious visitor|\nInstruction translator|\nCatchphrase writer|Testing a catchphrase\nLocal guide|\nMaster of ceremonies|\nAssistant|\nWitness|Conflicting memories\nTimekeeper|\nProject member|\nOutgoing coordinator|Handing over responsibility\nPlanner|\nQuestioner|\nBackup provider|\nDeparting guest|Preparing to say goodbye\nSign seeker|\nDispute mediator|\nRehearsal coordinator|\nReturning member|\nTalent-show entrant|\nFirst-time participant|\nNews bearer|\nPromise keeper|\nInclusion coordinator|\nDelegating manager|Practicing delegation\nRisk assessor|Taking a small risk\nTeam uniform coordinator|Printing matching team jackets\nCeremony coordinator|Treating a minor inconvenience as a royal ceremony\nFog-machine operator|Bringing an emergency fog machine\nInterview candidate|The meeting may be a secret job interview\nSandwich guardian|Protecting a sandwich\nPicnic organizer|Making a picnic spreadsheet\nPromotion candidate|An imaginary promotion is available\nPuppeteer|Rehearsing an apology with a puppet\nRules interpreter|Pretending to understand the rules\nAnnouncement recipient|\nPlant representative|Proposing equal voting rights for a plant\nSurprise planner|Trying to keep a surprise'''.splitlines()
assert len(roles)==77
for n,line in enumerate(roles,1):
    identity,extra=line.split('|');pid=f'prompt_role_{n:03}';p=byid[pid]
    if p['text']==identity:continue
    p['text']=identity;p['version']=2;refs=[('role',pid)]
    if extra:refs.append(('action',ingredient('action',extra,original[pid],'gerund')) if re.match(r'^(Finishing|Protecting|Packing|Practicing|Guarding|Rehearsing|Testing|Handing|Preparing|Taking|Printing|Treating|Bringing|Making|Pretending|Proposing|Trying)',extra) else ('situation',ingredient('situation',extra,original[pid])))
    preserve(original[pid],refs)

# The two action entries with explicit independent time conditions are split too.
for pid,text,condition in [('prompt_action_003','Packing a suitcase','The suitcase will not close'),('prompt_action_005','Building a shelf','The shelf is unstable'),('prompt_action_011','Assembling a model boat','The instructions are missing'),('prompt_action_014','Preparing a picnic','Unexpected guests have arrived'),('prompt_action_018','Decorating a cake','There is too little icing'),('prompt_action_019','Practicing a handshake','An important meeting is approaching'),('prompt_action_023','Opening a packet','The packet is noisy'),('prompt_action_024','Setting a table','An unusual ceremony is taking place'),('prompt_action_028','Planting seeds','The containers are unsuitable'),('prompt_action_029','Making a sign','One letter is missing'),('prompt_action_030','Catching a paper hat','Windy weather'),('prompt_action_038','Putting together a puzzle','There is one extra puzzle piece'),('prompt_action_043','Making sandwiches','A long journey is ahead'),('prompt_action_045','Sharing a small umbrella','Rainy weather'),('prompt_action_048','Repairing a stage prop','The curtain is about to rise'),('prompt_action_060','Preparing a room','A special visitor is expected'),('prompt_action_073','Interviewing a neighbor','A vacancy for a best friend'),('prompt_action_075','Testing a fog machine','A quiet picnic is taking place'),('prompt_action_076','Wrapping an enormous spoon','The wrapping must go unnoticed'),('prompt_action_077','Holding a ribbon cutting','A drawer has just been tidied'),('prompt_action_079','Drawing a seating chart','Three party guests are expected')]:
    p=byid[pid];p['text']=text;p['version']=2;preserve(original[pid],[('action',pid),('situation',ingredient('situation',condition,original[pid]))])
# A job title must not prescribe an attitude.
for pid,text,emotion in [('prompt_profession_055','Imaginary dragon dentist',None),('prompt_profession_065','Crisp-tasting expert','Seriousness')]:
    p=byid[pid];p['text']=text;p['version']=2;refs=[('profession',pid)]
    if emotion:refs.append(('emotion',ingredient('emotion',emotion,original[pid],'noun')))
    preserve(original[pid],refs)

# Feelings stay feelings: causes and activities are optional, separately selected ingredients.
for pid, pure_text, category, extra in [
    ('prompt_emotion_040','Momentary panic','situation','A small problem has arisen'),
    ('prompt_emotion_049','Peace','situation','A misunderstanding'),
    ('prompt_emotion_050','Quiet joy','action','Celebrating quietly'),
    ('prompt_situation_064','An exception to the rules has been proposed','role','Rule follower'),
]:
    old = original[pid]
    # Match the source text when an older numbering differs; never reinterpret an unrelated entry.
    if pid == 'prompt_emotion_040':
        pid = next(k for k,v in original.items() if v['text'] == 'Momentary panic about a small problem'); old=original[pid]
    byid[pid]['text']=pure_text;byid[pid]['version']=2
    preserve(old,[(byid[pid]['category'],pid),(category,ingredient(category,extra,old))])

# A manner/comparison is optional scene information, not part of the Action ingredient.
# Append after existing splits so previously published ingredient IDs remain stable.
pid='prompt_action_071'
byid[pid]['text']='Organizing a fridge'
byid[pid]['version']=2
preserve(original[pid],[('action',pid),('situation',ingredient('situation','Luxury-hotel standards',original[pid],'condition'))])

# Deduplicate pure bases, retaining original IDs in curated provenance. Never invent a difference just to keep a count.
allp=list(byid.values())+new; canonical={}; redirects={}; pure=[]
for p in allp:
    key=(p['category'],p['text'].casefold())
    if key in canonical:redirects[p['id']]=canonical[key]['id'];continue
    canonical[key]=p;pure.append(p)
for c in curated:
    for ref in c['ingredients']:ref['id']=redirects.get(ref['id'],ref['id'])
    # Each example links only one value per category; no hidden additional card.
    refs={r['category']:r for r in c['ingredients']};c['ingredients']=list(refs.values())
pp={p['id']:p for p in pure}
relids={p['relationshipTemplateId'] for p in pure if p['category']=='relationship'}
rels=[r for r in rels if r['id'] in relids]
# Explicit grammar and semantic domains are content metadata, separate from displayed ingredient text.
lexicon={
'family':r'sibling|cousin|family|parent|relative|adult child',
'food':r'bakery|baker|cafe|restaurant|kitchen|chef|sandwich|toast|cake|diner|food|picnic|feast|menu|fridge|biscuit|crisp|culinary',
'arts':r'theater|theatre|stage|perform|band|choir|orchestra|music|cinema|film|concert|magic|costume|rehears|actor|piano|song|sculpture|artist|pottery',
'civic':r'council|mayor|town|neighbo|community|volunteer|committee|parade|festival|street',
'work':r'office|colleague|cowork|employee|manager|co-founder|organizer|coordinator|board|project|promotion|business|printer',
'hospitality':r'hotel|guest|lobby|wedding|gala|party|celebration|venue',
'learning':r'school|class|student|mentor|apprentice|library|librarian|book|museum|curator|history|archive|planetarium|observatory|astronom|archaeolog|aquarium',
'outdoors':r'garden|greenhouse|plant|flower|farm|bird|campsite|lake|rain|hail|sail|boat|wind|cactus|outdoor',
'journey':r'ferry|train|rail|airport|lounge|baggage|travel|roadside|bus|station|cable car|crossing|voyage|route',
'home':r'roommate|tenant|landlord|apartment|cupboard|laundry|laundromat|house|home|moving|caretaker',
'sport':r'team|club|chess|bowling|captain|coach|tournament|competition|sport',
'fantasy':r'imaginary|dragon|gnome|goose|raccoon|pigeon|duck|scarecrow|toaster',
}
for p in pure:
    text=p['text']
    if p['category'] in ('location','relationship') and not re.search(r'imaginary|dragon|gnome',text,re.I):p['flavor']='grounded'
    if p['category']=='emotion' and p.get('version')==2:p['flavor']='grounded'
    p['domains']=[d for d,pat in lexicon.items() if re.search(pat,text,re.I)]
    if p['category']=='action':p['compositionForm']='gerund'
    if p['category']=='situation' and 'compositionForm' not in p:
        p['compositionForm']='clause' if re.search(r'\b(is|are|has|have|must|may|will|can|should|appears|seems|feels|belongs|wants|needs|starts|ends|depends|makes|says|knows|remembers|proposes|contains|asks|arrives|consists|squeak|remains)\b',text,re.I) else 'condition'
    if p['category']=='relationship':p['compositionForm']='people'
    if p['category']=='location':p['compositionForm']='place'
for c in curated:
    for ref in c['ingredients']:ref['version']=pp[ref['id']]['version']
# A specific original profile may simplify to a neutral role with no separate reusable fact.
# Such originals stay archived as examples; they never overwrite the role ingredient.
for filename,value in [('ingredients.json',pure),('relationships.json',rels),('curated-scenes.json',curated)]:
    (root/'v2'/filename).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'ingredients':len(pure),'relationships':len(rels),'curatedExamples':len(curated),'byCategory':{c:sum(p['category']==c for p in pure) for c in counts},'retiredAliases':redirects}))

# The complete category-purity editorial pass is applied after the stable historical decomposition.
import runpy
v1_review = runpy.run_path(str(Path(__file__).with_name("apply-v1-prompt-review.py")))
v1_review["restore_party_source"](root/"v2")
location_review = runpy.run_path(str(Path(__file__).with_name("apply-simple-location-review.py")))
location_review["restore_party_source"](root/"v2")
runpy.run_path(str(Path(__file__).with_name("apply-ingredient-review.py")))["apply_review"](root/"v2",lexicon)
location_review["apply_review"](root/"v2")
import sys
v1_review["apply_review"](root/"v2", lexicon, approve_party_scenes="--approve-party-scenes" in sys.argv)
runpy.run_path(str(Path(__file__).with_name("apply-party-expansion-review.py")))["apply_review"](
    root/"v2", approve="--approve-party-expansion" in sys.argv
)

# Keep the setting in the location, not in the colleague relationship or roles.
review_root = root.parent.parent / "content/editorial"
previous = json.loads((review_root / "ingredient-purity-2.6.0.json").read_text())
approved = deepcopy(previous["approvedEntries"])
templates = deepcopy(previous["approvedRelationshipTemplates"])
entry = next(item for item in approved if item["id"] == "prompt_relationship_102")
template = next(item for item in templates if item["id"] == "rel_102")
before = deepcopy(entry)
before_template = deepcopy(template)
if entry["text"] != "Office colleagues" or entry["version"] != 2:
    raise ValueError("Colleague wording review must start from the approved original.")
entry.update(text="Colleagues", version=3)
template.update(
    premise="Colleagues", version=3, expandableRole="Colleague",
    namedRoles=[f"Colleague {number}" for number in range(1, 5)],
)
wording_review = {
    "sourcePackVersion": "2.6.0",
    "targetPackVersion": "2.6.1",
    "previousReview": "ingredient-purity-2.6.0.json",
    "policy": "Remove the office setting from one relationship and its numbered roles. Preserve IDs, ratings, task metadata and all other source values.",
    "corrections": [{
        "id": entry["id"], "category": "relationship",
        "before": before["text"], "after": entry["text"],
        "sourceVersion": before["version"], "extras": [],
    }],
    "sourceEntries": [before],
    "sourceRelationshipTemplates": [before_template],
    "reviewedIngredientIds": [item["id"] for item in approved],
    "approvedValues": [
        {key: item[key] for key in ("id", "category", "text", "version")}
        for item in approved
    ],
    "approvedEntries": approved,
    "reviewedRelationshipTemplateIds": [item["id"] for item in templates],
    "approvedRelationshipTemplates": templates,
}
review_path = review_root / "ingredient-purity-2.6.1.json"
if review_path.exists():
    if json.loads(review_path.read_text()) != wording_review:
        raise ValueError("Colleague wording differs from the approved 2.6.1 review.")
elif "--approve-relationship-wording" not in sys.argv:
    raise ValueError("Approve the colleague wording with --approve-relationship-wording.")
else:
    review_path.write_text(json.dumps(wording_review, ensure_ascii=False, indent=2) + "\n")
path = root / "v2/ingredients.json"
ingredients = json.loads(path.read_text())
ingredients = [entry if item["id"] == entry["id"] else item for item in ingredients]
path.write_text(json.dumps(ingredients, ensure_ascii=False, indent=2) + "\n")
(root / "v2/relationships.json").write_text(json.dumps(templates, ensure_ascii=False, indent=2) + "\n")
path = root / "v2/curated-scenes.json"
archive = json.loads(path.read_text())
archive.append({
    "id": "curated_colleague_wording_prompt_relationship_102_v2",
    "originalText": before["text"],
    "source": {"id": before["id"], "category": "relationship", "version": 2, "packVersion": "2.6.0"},
    "ingredients": [{"category": "relationship", "id": entry["id"], "version": entry["version"]}],
    "originalRoles": before_template["namedRoles"],
    "originalExpandableRole": before_template["expandableRole"],
})
for example in archive:
    for reference in example["ingredients"]:
        if reference["id"] == entry["id"]:
            reference["version"] = entry["version"]
path.write_text(json.dumps(archive, ensure_ascii=False, indent=2) + "\n")

# The independent bank supersedes fresh generation, never the frozen source banks.
runpy.run_path(str(Path(__file__).with_name("apply-atomic-review.py")))["apply_review"](
    root / "v2", approve="--approve-atomic-ingredients" in sys.argv
)
