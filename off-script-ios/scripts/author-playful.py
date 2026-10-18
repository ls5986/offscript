import json,pathlib
out=pathlib.Path('src/content/v1')
base=json.load(open(out/'prompts.json'))
banks={
'situation':'''You hired a raccoon to plan your wedding|Your roommate is charging your leftovers rent|A goose has been appointed manager of your office|Your surprise party has been sponsored by a rival surprise party|The wedding cake has arrived in a tiny seatbelt|Your first customer wants a refund for yesterday’s weather|The family group chat has accidentally elected a mayor|Your toaster has asked for a performance review|You must explain why the office plant has its own parking space|The dog has been put in charge of the neighborhood watch|Your restaurant’s only review was written by a pigeon|Someone has booked a motivational speaker for your houseplants|You accidentally sold your boss an imaginary boat|Your roommate has installed a velvet rope around the good chair|The museum’s newest exhibit is your missing lunch|Your band’s manager has only ever represented magicians|The hotel’s wake-up service sends a very disappointed goose|The prize for winning the contest is running the contest next year|Your cousin has hired a fog machine for a quiet family picnic|The town’s new statue is suspiciously similar to your sandwich|A moving company has packed the furniture into the wrong imaginary house|Your tiny cafe is hosting a very serious spoon convention|You have to interview the person who stole your imaginary job|A fancy restaurant has offered you a tasting menu of toast|The office printer has started issuing personal invitations|Someone gave your dinner party a safety inspection|The missing wedding rings are on a very confident pigeon|Your neighbor has opened a gift shop for their own garden|The landlord has declared your cupboard a luxury apartment|You have to apologize to the official town scarecrow''',
'location':'''The complaints desk at a very small castle|A luxury spa for exhausted garden gnomes|The back office of a competitive sandwich shop|A wedding venue shared with a spoon convention|The waiting room of an imaginary dragon dentist|A tiny cafe on its first day of being famous|A hotel lobby with a strict no-boring-hats policy|The kitchen of a restaurant that only serves toast|A ferry’s VIP lounge, which is one folding chair|A very official lost-and-found for imaginary pets|The dressing room of a band with no instruments|A garden center hosting a cactus talent show|The mayor’s emergency biscuit cupboard|A museum gift shop that only sells enormous pencils|A neighborhood council meeting about one suspicious duck|A bakery’s secret cake-testing room|The backstage area of a deeply unprepared magic show|An airport lounge reserved for prize vegetables|A customer-service booth at a very disappointing maze|A cinema showing a documentary about your neighbor’s shed''',
'profession':'''Official town umbrella inspector|Competitive houseplant coach|Wedding planner for very disorganized pigeons|Luxury sandwich consultant|Part-time imaginary dragon dentist|Professional birthday surprise inspector|Museum curator of mildly disappointing objects|Personal assistant to an extremely busy goose|Emergency picnic coordinator|Celebrity garden-gnome publicist|Inspector of suspiciously comfortable chairs|Motivational speaker for office printers|Luxury shed interior designer|Competitive spoon-polishing judge|Very serious crisp-tasting expert''',
'role':'''Person who has already printed matching team jackets|Person treating a minor inconvenience like a royal ceremony|Person who brought an emergency fog machine|Person convinced this is a secret job interview|Person protecting a very ordinary sandwich|Person who has made a spreadsheet for the picnic|Person trying to get an imaginary promotion|Person who has rehearsed their apology with a puppet|Person pretending to understand the very simple rules|Person who assumes every announcement is about them|Person determined to give the plant equal voting rights|Person trying to keep a surprise from an extremely obvious person''',
'action':'''Giving a houseplant a very serious performance review|Installing a velvet rope around an ordinary chair|Rehearsing an apology to a ceremonial goose|Making a tiny welcome pack for a new toaster|Trying to fit a wedding cake into a bicycle helmet|Organizing the fridge like a luxury hotel|Teaching an imaginary dragon how to use a doorbell|Interviewing a neighbor for the position of best friend|Giving a sandwich an overcomplicated security check|Testing a fog machine at a very quiet picnic|Trying to wrap an enormous spoon without anyone noticing|Holding a ribbon cutting for a newly tidied drawer|Taking an emergency family photograph with an imaginary goat|Drawing up a seating chart for a party of three|Making an official complaint about a very smug cake''',
'object':'''A formal invitation addressed to your toaster|A tiny velvet rope for a very important biscuit|An employee-of-the-month sash for a houseplant|A luxury brochure for an ordinary cupboard|A sandwich with its own security badge|A wedding seating plan written by a pigeon|A trophy for being almost on time|An emergency kit containing one extremely fancy napkin|A customer complaint from an imaginary dragon|An official permit to look mysterious''',
'opening_line':'''Before you say anything, the goose is technically our manager.|I have some concerns about the wedding raccoon.|Why does the fridge have a VIP section?|I didn’t realize the picnic had a board of directors.|The plant has asked to speak to you privately.|I promised them you were a qualified sandwich expert.|Someone has given the toaster my parking space.|I thought the fog machine was included in the apology.|We cannot keep describing the cupboard as an investment property.|The cake has requested its own dressing room.|I would like to appeal the duck’s decision.|This is a very personal question for a delivery driver.|We need to talk about your emergency napkin budget.|I think the landlord has misunderstood the term open-plan.|For the last time, the imaginary dragon is not a plus-one.'''
}
def tags(s):
 s=s.lower()
 for name,words in [('celebration',['wedding','birthday','party','picnic','cake']),('workplace',['office','manager','job','review','employee','printer']),('domestic',['roommate','fridge','cupboard','landlord','neighbor','chair','toaster']),('arts',['band','museum','magic','cinema'])]:
  if any(w in s for w in words):return [name,'playful']
 return ['everyday','playful']
entries=[]
for cat,text in banks.items():
 offset=max(int(p['id'].split('_')[-1]) for p in base if p['category']==cat)
 for i,t in enumerate(text.split('|')):
  entries.append(dict(id=f'prompt_{cat}_{offset+i+1:03}',category=cat,text=t,tags=tags(t),contentRating='clean',minPlayers=2,maxPlayers=12,version=1,flavor='playful'))
rels=[]
def rel(text,minp,maxp,roles,expand=None):
 i=len(rels)+81;r=dict(id=f'rel_{i:03}',premise=text,minPlayers=minp,maxPlayers=maxp,namedRoles=roles,expandableRole=expand,tags=tags(text),contentRating='clean',version=1,flavor='playful');rels.append(r)
for text,a,b in [
('Two roommates negotiating custody of an air fryer','Roommate keeping the air fryer','Roommate demanding visiting rights'),
('Two wedding planners covering for the raccoon they hired','Planner defending the raccoon','Planner talking to the couple'),
('Two neighbors whose garden gnomes are having a very public feud','Neighbor demanding an apology','Neighbor defending the gnome'),
('An employee asking their manager why the plant got promoted','Employee making their case','Manager defending the promotion'),
('Two adult siblings trying to return the same terrible family gift','Sibling holding the receipt','Sibling who already thanked everyone'),
('A chef and a customer debating whether toast counts as a tasting menu','Chef defending the menu','Customer who booked an anniversary meal'),
('Two friends opening a luxury hotel for imaginary pets','Friend managing the bookings','Friend handling imaginary complaints'),
('A museum curator and a visitor who recognizes the exhibit as their lunch','Curator protecting the display','Visitor who packed that sandwich'),
('Two bandmates discovering their manager booked them as magicians','Bandmate trying to cancel','Bandmate learning a single trick'),
('Two cousins planning a small picnic with an enormous fog machine','Cousin setting up the fog','Cousin who promised a quiet picnic'),
('A landlord and a tenant debating the cupboard’s new luxury listing','Landlord presenting the brochure','Tenant pointing out the mops'),
('Two colleagues writing an apology to the office printer','Colleague defending the wording','Colleague who caused the jam')]:rel(text,2,2,[a,b])
for text,roles in [
('Three friends opening a cafe staffed by one very confident goose',['Friend taking the orders','Friend translating the goose','Friend explaining the business plan']),
('Three adult siblings secretly replacing a family trophy with a potato',['Sibling guarding the trophy','Sibling decorating the potato','Sibling expecting the family soon']),
('Three neighbors rehearsing a formal apology to a duck',['Neighbor reading the speech','Neighbor holding the gift','Neighbor who upset the duck']),
('Three coworkers deciding whether the office plant needs a business card',['Plant’s unofficial manager','Person paying for stationery','Person competing with the plant'])]:rel(text,3,3,roles)
for text in [
'A wedding committee discovering their planner is a raccoon',
'A neighborhood council deciding what to do about an extremely popular duck',
'A cafe team preparing for a royal inspection of their toast',
'A family organizing a tiny picnic with a wildly excessive budget',
'A museum committee choosing a dramatic name for a very ordinary spoon',
'An office team welcoming the houseplant as their new manager',
'A band rehearsing the magic show they were accidentally booked to perform',
'A hotel team handling complaints from imaginary pets']:
 rel(text,4,12,['Overconfident organizer','Person controlling the budget','Person defending the strange plan','Newest person asking reasonable questions'],'Committee member')
for i,r in enumerate(rels):entries.append(dict(id=f'prompt_relationship_{81+i:03}',category='relationship',text=r['premise'],tags=r['tags'],contentRating='clean',minPlayers=r['minPlayers'],maxPlayers=r['maxPlayers'],version=1,flavor='playful',relationshipTemplateId=r['id']))
(out/'playful-prompts.json').write_text(json.dumps(entries,indent=2)+'\n')
(out/'playful-relationships.json').write_text(json.dumps(rels,indent=2)+'\n')
print('Authored playful prompts:',len(entries),'structured relationships:',len(rels))
