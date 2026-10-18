"""Apply the bounded 2.5 task-fit/grammar review after the immutable 2.4 pass."""
import json
from copy import deepcopy
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
REVIEW = PROJECT / "content/editorial/ingredient-purity-2.5.0.json"
SOURCE_PACK = "2.4.0"
TARGET_PACK = "2.5.0"
EMOTIONS = {
    1: "Excitement", 2: "Disappointment", 3: "Relief", 6: "Curiosity",
    7: "Impatience", 8: "Surprise", 9: "Optimism", 12: "Confusion",
    14: "Nervousness", 15: "Confidence", 18: "Contentment", 23: "Anger",
    38: "Vulnerability", 40: "Panic", 48: "Skepticism", 50: "Joy",
}
PARTY_SCENES = {
    1808: "You just closed the elevator on your boss.",
    1813: "You brought a store-bought dish and called it homemade.",
    2008: "You both claimed the same idea was yours.",
    2020: "Your boss walks in while you are rehearsing an excuse.",
    1904: "Your date has already planned your next holiday.",
    1916: "You run into your ex while buying an anniversary gift.",
    2032: "One of you has told everyone you are a couple.",
    2049: "You agreed to keep it casual. One of you made anniversary plans.",
}
CLAUSES = [7, 10, 24, 45, 46, 55, 66, 76, 78, 82, 91, 2091, 2094, 2101, 2128, 2129, 2141]
TASK_TAGS = {
    "familiar_profession": ("profession", [
        1, 2, 3, 4, 5, 9, 11, 13, 16, 17, 18, 20, 22, 26, 27, 30,
        32, 36, 37, 43, 55, 58, 62,
    ]),
    "beginner_emotion": ("emotion", [
        1, 2, 3, 6, 7, 8, 9, 12, 14, 15, 18, 23, 40, 49, 50,
    ]),
    "association_seed": ("object", [
        2, 4, 11, 12, 14, 17, 18, 20, 28, 29, 32, 34, 40, 41,
        47, 48, 50, 51, 57, 61, 64, 65, 68, 70, 71,
    ]),
    "mundane_action": ("action", [
        3, 4, 5, 6, 7, 12, 14, 15, 16, 18, 20, 21, 23, 24, 25, 27,
        28, 29, 31, 32, 36, 38, 40, 42, 43, 44, 47, 53, 54, 59, 62, 63, 71,
    ]),
    "character_walk": ("action", [3, 12, 22, 37, 45, 59]),
}


def write(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def values(bank):
    return [{key: entry[key] for key in ("id", "category", "text", "version")} for entry in bank]


def edited(bank, lexicon):
    result = deepcopy(bank)
    for entry in result:
        number = int(entry["id"].split("_")[-1])
        before = deepcopy(entry)
        if entry["category"] == "emotion" and number in EMOTIONS:
            entry["text"] = EMOTIONS[number]
        if entry["category"] == "situation" and number in PARTY_SCENES:
            entry["text"] = PARTY_SCENES[number]
            entry["compositionForm"] = "clause"
        if entry["category"] == "situation" and number in CLAUSES:
            entry["compositionForm"] = "clause"
        for tag, (category, numbers) in TASK_TAGS.items():
            if entry["category"] == category and number in numbers:
                entry["tags"] = [*entry["tags"], tag]
        if entry != before:
            entry["version"] += 1
            # Text edits retain the established semantic-domain authoring pipeline.
            if entry["text"] != before["text"]:
                import re
                entry["domains"] = [
                    domain for domain, pattern in lexicon.items()
                    if re.search(pattern, entry["text"], re.I)
                ]
    return result


def restore_party_source(root):
    """Regeneration starts from historical party values, not this pass's metadata."""
    if not REVIEW.exists():
        return
    review = json.loads(REVIEW.read_text())
    source = {entry["id"]: entry for entry in review["sourceEntries"]}
    approved = {entry["id"]: entry for entry in review["approvedEntries"]}
    path = Path(root) / "party-ingredients.json"
    bank = json.loads(path.read_text())
    for index, entry in enumerate(bank):
        if entry["id"] in source and entry == approved[entry["id"]]:
            bank[index] = source[entry["id"]]
    write(path, bank)


def apply_review(root, lexicon, approve_party_scenes=False):
    root = Path(root)
    paths = [root / "ingredients.json", root / "party-ingredients.json"]
    banks = [json.loads(path.read_text()) for path in paths]
    combined = banks[0] + banks[1]
    templates = json.loads((root / "relationships.json").read_text())
    if REVIEW.exists() and approve_party_scenes:
        prior = json.loads(REVIEW.read_text())
        approved = edited(combined, lexicon)
        if [entry["id"] for entry in approved] != prior["reviewedIngredientIds"]:
            raise ValueError("Party tone approval cannot add, remove or reorder ingredients.")
        changed = {
            before["id"] for before, after in zip(prior["approvedEntries"], approved)
            if before != after
        }
        expected = {f"prompt_situation_{number}" for number in PARTY_SCENES}
        if changed and changed != expected:
            raise ValueError("Party tone approval must change exactly the eight approved existing scene seeds.")
        for before, after in zip(prior["approvedEntries"], approved):
            if before["id"] in changed:
                if before["tags"] != after["tags"] or before["contentRating"] != after["contentRating"]:
                    raise ValueError("Party tone approval cannot change tags or ratings.")
                if "party_seed" not in before["tags"] or "party_advice" in before["tags"]:
                    raise ValueError("Party tone approval applies only to scene seeds, never advice.")
    if not REVIEW.exists() or approve_party_scenes:
        previous = json.loads((PROJECT / "content/editorial/ingredient-purity-2.4.0.json").read_text())
        if values(combined) != previous["approvedValues"]:
            raise ValueError("The 2.5 review must start from the approved 2.4 baseline.")
        approved = edited(combined, lexicon)
        changes = [(old, new) for old, new in zip(combined, approved) if old != new]
        review = {
            "sourcePackVersion": SOURCE_PACK,
            "targetPackVersion": TARGET_PACK,
            "previousReview": "ingredient-purity-2.4.0.json",
            "policy": {
                "scope": "Bounded beginner emotion edits, eight human-stakes Party scene revisions, complete-clause grammar metadata, and additive game-task suitability tags. All IDs, counts, ratings and existing task tags retained.",
                "partyScenes": "Exactly four clean and four spicy existing scene seeds replace repeated bureaucratic props with immediate human stakes. Advice text stays unchanged; 2.4 originals remain archived.",
                "professions": "Recognizable jobs are tagged for World's Worst; whimsical professions remain available in Studio.",
                "movement": "Character Walk uses safe, mimable physical tasks; no speed, terrain or dangerous-movement instructions.",
                "relationships": "All 96 templates reviewed unchanged. Assignment formatting continues numbering after fixed slots; loading and locking never rewrite literal saved roles.",
            },
            "reviewedIngredientIds": [entry["id"] for entry in combined],
            "corrections": [{
                "id": old["id"], "category": old["category"],
                "before": old["text"], "after": new["text"],
                "sourceVersion": old["version"], "extras": [],
            } for old, new in changes if old["text"] != new["text"]],
            "metadataCorrections": [{
                "id": old["id"], "sourceVersion": old["version"],
                "changes": {key: {"before": old.get(key), "after": new[key]}
                            for key in new if key not in ("text", "version") and old.get(key) != new[key]},
            } for old, new in changes if any(old.get(key) != new[key] for key in new if key not in ("text", "version"))],
            "sourceEntries": [old for old, _ in changes],
            "approvedValues": values(approved),
            "approvedEntries": approved,
            "reviewedRelationshipTemplateIds": [entry["id"] for entry in templates],
            "approvedRelationshipTemplates": templates,
        }
        write(REVIEW, review)
    review = json.loads(REVIEW.read_text())
    if values(combined) != json.loads((PROJECT / "content/editorial/ingredient-purity-2.4.0.json").read_text())["approvedValues"]:
        raise ValueError("Run the historical pipeline before applying 2.5.")
    approved = edited(combined, lexicon)
    if approved != review["approvedEntries"] or templates != review["approvedRelationshipTemplates"]:
        raise ValueError("Generated content differs from the approved complete 2.5 review.")
    live = {entry["id"]: entry for entry in approved}
    archive_path = root / "curated-scenes.json"
    archive = json.loads(archive_path.read_text())
    for row in review["corrections"]:
        archive.append({
            "id": f"curated_v1_review_{row['id']}_v{row['sourceVersion']}",
            "originalText": row["before"],
            "source": {"id": row["id"], "category": row["category"], "version": row["sourceVersion"], "packVersion": SOURCE_PACK},
            "ingredients": [{"id": row["id"], "category": row["category"], "version": live[row["id"]]["version"]}],
        })
    for example in archive:
        for reference in example["ingredients"]:
            reference["version"] = live[reference["id"]]["version"]
    party_ids = {entry["id"] for entry in banks[1]}
    for path, bank in zip(paths, [
        [entry for entry in approved if entry["id"] not in party_ids],
        [entry for entry in approved if entry["id"] in party_ids],
    ]):
        write(path, bank)
    write(archive_path, archive)
    print(json.dumps({"pack": TARGET_PACK, "reviewedIngredients": len(approved),
                      "reviewedTemplates": len(templates), "textEdits": len(review["corrections"]),
                      "metadataEdits": len(review["metadataCorrections"])}))


if __name__ == "__main__":
    import runpy
    runpy.run_path(str(Path(__file__).with_name("build-ingredient-pack.py")))
