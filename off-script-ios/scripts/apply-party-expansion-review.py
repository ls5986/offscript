"""Append the explicitly authored 2.6 inputs after the immutable 2.3/2.4/2.5 passes."""
import json
import re
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
EDITORIAL = PROJECT / "content/editorial"
AUTHORING = EDITORIAL / "party-authoring-2.6.0.json"
REVIEW = EDITORIAL / "ingredient-purity-2.6.0.json"


def write(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def authored(baseline):
    source = json.loads(AUTHORING.read_text())
    require(set(source) == {"existingSceneHints", "ratings"}, "Unexpected authoring fields.")
    require(set(source["ratings"]) == {"spicy", "mature_suggestive"}, "Exactly two rated additions required.")
    entries, hints, advice = [], [], []
    scenes = [
        entry for entry in baseline
        if entry["category"] == "situation" and "party_seed" in entry["tags"]
    ]
    require(len(scenes) == 90, "Historical scene coverage changed.")
    require(set(source["existingSceneHints"]) == {entry["id"] for entry in scenes},
            "Every historical scene needs one explicitly authored hint.")

    def hint(entry, opening):
        require(isinstance(opening, str) and 12 < len(opening) <= 180,
                "Opening hint must be a short spoken start: " + entry["id"])
        require(re.search(r"\b(I|I'm|I've|I'd|I'll|my|we|we're|our)\b", opening, re.I),
                "Opening hint needs a natural first-person perspective: " + entry["id"])
        require(not re.search(r"fortunately|unfortunately|you should|punchline|ba[ -]?dum|plot twist", opening, re.I),
                "Hints are optional base lines, not prefixed game output or jokes.")
        hints.append({
            "id": entry["id"], "text": entry["text"],
            "openingLine": opening, "contentRating": entry["contentRating"],
        })

    for entry in scenes:
        hint(entry, source["existingSceneHints"][entry["id"]])
    for rating, start in [("spicy", 3000), ("mature_suggestive", 3100)]:
        group = source["ratings"][rating]
        require(set(group) == {"scenes", "advice", "professions", "locations", "openingLines"},
                "Unexpected rated authoring fields.")
        require(len(group["scenes"]) == 32 and len(group["advice"]) == 16,
                "Each rating needs exactly 32 scenes and 16 advice requests.")
        require(all(len(group[key]) == 8 for key in ["professions", "locations", "openingLines"]),
                "Each rating needs eight jobs, places and opening lines.")

        def entry(category, number, text, tag, form):
            require(isinstance(text, str) and 3 <= len(text) <= 280, "Invalid authored text.")
            tags = [tag, rating]
            if category == "situation":
                tags.append("social")
            if category == "profession":
                tags.append("familiar_profession")
            value = {
                "id": f"prompt_{category}_{number}", "category": category,
                "text": text, "tags": tags, "flavor": "grounded", "domains": [],
                "compositionForm": form, "contentRating": rating,
                "minPlayers": 2, "maxPlayers": 12, "version": 1,
            }
            entries.append(value)
            return value

        for index, row in enumerate(group["scenes"]):
            require(len(row) == 2, "Scene authoring requires text and one opening hint.")
            hint(entry("situation", start + index, row[0], "party_seed", "clause"), row[1])
        for index, row in enumerate(group["advice"]):
            require(len(row) == 3, "Advice authoring requires text, question and example.")
            require(re.match(r"^(I |My )", row[0]), "Advice problem must use the fictional friend's first-person voice.")
            value = entry("situation", start + 32 + index, row[0], "party_advice", "clause")
            require(row[1].endswith("?") and row[2].startswith("You should "),
                    "Advice needs an explicit question and matching harmless fictional example.")
            advice.append({"id": value["id"], "question": row[1], "example": row[2]})
        for key, category, form in [
            ("professions", "profession", "noun"),
            ("locations", "location", "place"),
            ("openingLines", "opening_line", "clause"),
        ]:
            for index, text in enumerate(group[key]):
                if category != "opening_line":
                    require(len(text.split()) <= 3 and len(text) <= 24
                            and not re.match(r"^(a|an|the)\s", text, re.I),
                            "Jobs and places must be short ordinary labels.")
                entry(category, start + index, text, "party_seed", form)
    require(len(entries) == 144 and len(hints) == 154 and len(advice) == 32,
            "Unexpected expansion inventory.")
    require(len({row["openingLine"] for row in hints}) == 154, "Repeated opening hint.")
    combined = baseline + entries
    require(len({row["id"] for row in combined}) == 1326, "Duplicate or missing ingredient ID.")
    for category in {row["category"] for row in combined}:
        texts = [row["text"].strip().casefold() for row in combined if row["category"] == category]
        require(len(set(texts)) == len(texts), "Duplicate category text: " + category)
    return entries, hints, advice


def apply_review(root, approve=False):
    root = Path(root)
    previous = json.loads((EDITORIAL / "ingredient-purity-2.5.0.json").read_text())
    baseline = previous["approvedEntries"]
    old = json.loads((root / "ingredients.json").read_text()) + json.loads((root / "party-ingredients.json").read_text())
    require(old == baseline, "2.6 must start after the unchanged complete 2.5 pass.")
    templates = json.loads((root / "relationships.json").read_text())
    require(templates == previous["approvedRelationshipTemplates"], "Historical relationship templates changed.")
    entries, hints, advice = authored(baseline)
    approved = baseline + entries
    expected = {
        "sourcePackVersion": "2.5.0",
        "targetPackVersion": "2.6.0",
        "previousReview": "ingredient-purity-2.5.0.json",
        "authoringSource": AUTHORING.name,
        "policy": {
            "scope": "Additive only: 72 spicy and 72 mature_suggestive ingredients. All 1,182 historical records and 96 relationship templates remain exact.",
            "tone": "Fictional adult dating, breakups, implied consensual intimacy, shared money and social awkwardness. No graphic sex, minors, coercion, personal disclosure tasks, harm or identity-based targeting.",
            "ordinaryInputs": "Short recognizable dating/adult-topic jobs and ordinary places, not jobs made adult by a rating label. Opening lines are already spoken inputs.",
            "openingHints": "One source-exact, first-person contextual start for each of 154 party_seed situations. No extra joke, advice or game-specific Fortunately prefix.",
            "advice": "32 distinct first-person I/My party_advice situations, never party_seed; each has an authored question and a harmless fictional You should example.",
        },
        "reviewedIngredientIds": [row["id"] for row in approved],
        "addedIngredientIds": [row["id"] for row in entries],
        "corrections": [],
        "metadataCorrections": [],
        "sourceEntries": baseline,
        "approvedValues": [
            {key: row[key] for key in ("id", "category", "text", "version")}
            for row in approved
        ],
        "approvedEntries": approved,
        "reviewedRelationshipTemplateIds": previous["reviewedRelationshipTemplateIds"],
        "approvedRelationshipTemplates": templates,
        "reviewedOpeningHintIds": [row["id"] for row in hints],
        "reviewedOpeningHints": hints,
        "reviewedAdviceRequestIds": [row["id"] for row in advice],
        "reviewedAdviceRequests": advice,
    }
    if approve:
        write(REVIEW, expected)
    require(REVIEW.exists(), "New 2.6 authoring requires --approve-party-expansion.")
    require(json.loads(REVIEW.read_text()) == expected,
            "2.6 authoring differs from the complete editorial approval; review deliberately.")
    for filename, data in [
        ("party-expansion-2.6.json", entries),
        ("party-opening-hints.json", hints),
        ("party-advice-expansion.json", advice),
    ]:
        write(root / filename, data)
    print(json.dumps({
        "pack": "2.6.0", "ingredients": len(approved), "added": len(entries),
        "sceneHints": len(hints), "newAdviceRequests": len(advice),
    }))


if __name__ == "__main__":
    import sys
    apply_review(PROJECT / "src/content/v2", "--approve-party-expansion" in sys.argv)
