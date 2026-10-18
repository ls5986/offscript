"""Apply the explicit, reviewed 2.3 editorial patch; never infer semantic edits at runtime."""
import json, re
from copy import deepcopy
from pathlib import Path

def apply_review(root, lexicon):
    review = json.loads((Path(__file__).resolve().parent.parent / 'content/editorial/ingredient-purity-2.3.0.json').read_text())
    paths = [root / 'ingredients.json', root / 'party-ingredients.json']
    banks = [json.loads(p.read_text()) for p in paths]
    combined = banks[0] + banks[1]
    by_id = {p['id']: p for p in combined}
    curated_path = root / 'curated-scenes.json'
    curated = json.loads(curated_path.read_text())
    counters = {c: max(int(p['id'].rsplit('_', 1)[1]) for p in combined if p['category'] == c) for c in {p['category'] for p in combined}}
    additions = []
    changes = {}
    for row in review['corrections']:
        p = by_id[row['id']]
        if p['text'] not in [row['before'], row['after']]:
            raise ValueError('Review no longer matches source: ' + row['id'])
        parent = deepcopy(p)
        p['text'] = row['after']
        p['version'] = row['sourceVersion'] + 1
        refs = [{'category': p['category'], 'id': p['id']}]
        for extra in row['extras']:
            match = next((x for x in combined + additions if x['category'] == extra['category'] and x['text'].casefold() == extra['text'].casefold()), None)
            if match is None:
                counters[extra['category']] += 1
                match = {**deepcopy(parent), 'id': f"prompt_{extra['category']}_{counters[extra['category']]:03}", 'category': extra['category'], 'text': extra['text'], 'version': 1, 'minPlayers': 2, 'maxPlayers': 12, 'domains': [], 'tags': ['editorial_split']}
                match.pop('relationshipTemplateId', None)
                match['compositionForm'] = {'action': 'gerund', 'location': 'place', 'role': 'noun', 'object': 'noun', 'emotion': 'noun'}.get(extra['category'], 'clause' if any(w in extra['text'].lower().split() for w in ['is', 'are', 'has', 'have', 'must', 'needs', 'makes', 'contains', 'wrote']) else 'condition')
                # Carry source semantic domains as compatibility hints, never as displayed details.
                match['domains'] = parent.get('domains', [])
                additions.append(match)
            refs.append({'category': match['category'], 'id': match['id']})
        changes[p['id']] = refs[1:]
        curated.append({'id': f"curated_review_{p['id']}_v{row['sourceVersion']}", 'originalText': row['before'], 'source': {'id': p['id'], 'category': p['category'], 'version': row['sourceVersion'], 'packVersion': review['sourcePackVersion']}, 'ingredients': refs})
    # Preserve older composed examples' useful extras, without adding a second value to a category.
    for example in curated:
        present = {r['category'] for r in example['ingredients']}
        for ref in list(example['ingredients']):
            for extra in changes.get(ref['id'], []):
                if extra['category'] not in present:
                    example['ingredients'].append(deepcopy(extra))
                    present.add(extra['category'])
    # Collapse equivalent ingredients, keeping every old source/value in the curated archive.
    seen, aliases, keep = {}, {}, []
    for p in combined + additions:
        key = (p['category'], p['text'].casefold())
        if key in seen:
            aliases[p['id']] = seen[key]['id']
        else:
            seen[key] = p
            keep.append(p)
    for p in keep:
        p['domains'] = [d for d, pattern in lexicon.items() if re.search(pattern, p['text'], re.I)]
    live = {p['id']: p for p in keep}
    for example in curated:
        for ref in example['ingredients']:
            ref['id'] = aliases.get(ref['id'], ref['id'])
            ref['version'] = live[ref['id']]['version']
    # Existing base IDs retain their bank; newly reusable values live in the base ingredient bank.
    party_ids = {p['id'] for p in banks[1]}
    outputs = [[p for p in keep if p['id'] not in party_ids], [p for p in keep if p['id'] in party_ids]]
    for path, value in zip(paths + [curated_path, root / 'ingredient-aliases.json'], outputs + [curated, aliases]):
        path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({'reviewed': len(review['reviewedIngredientIds']), 'corrected': len(review['corrections']), 'retiredDuplicateIds': len(aliases), 'ingredients': len(keep), 'curated': len(curated)}))

if __name__ == '__main__':
    import runpy
    runpy.run_path(str(Path(__file__).with_name('build-ingredient-pack.py')))
