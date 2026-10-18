"""Compile the explicitly authored 2.7 independent bank without editing history."""
import argparse
import hashlib
import json
from collections import Counter
from copy import deepcopy
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
EDITORIAL = PROJECT / "content/editorial"
SOURCE_PATH = EDITORIAL / "ingredient-purity-2.6.1.json"
AUTHORING_PATH = EDITORIAL / "atomic-authoring-2.7.0.json"
AUDIT_PATH = EDITORIAL / "atomic-audit-2.7.0.json"
APPROVAL_PATH = EDITORIAL / "ingredient-purity-2.7.0.json"
TASK_TAGS = {
    "mundane_action", "character_walk", "association_seed",
    "familiar_profession", "beginner_emotion",
}
GAME_TAGS = {"party_seed", "party_advice", "advice_problem"}
RATING_TAGS = {"clean", "spicy", "mature_suggestive"}


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load(path):
    return json.loads(path.read_text())


def write_if_changed(path, data):
    content = encoded(data)
    if not path.exists() or path.read_bytes() != content:
        path.write_bytes(content)


def prompt_id(category, suffix):
    return f"prompt_{category}_{suffix}"


def keyed_lines(rows, parts=2):
    result = {}
    for row in rows:
        values = row.split("|")
        if len(values) != parts or values[0] in result:
            raise ValueError("Duplicate or malformed explicit authoring row: " + row)
        result[values[0]] = values[1:] if parts > 2 else values[1]
    return result


def canonical_key(entry):
    text = entry["text"].casefold().rstrip(".")
    cast = (entry["minPlayers"], entry["maxPlayers"]) if entry["category"] == "relationship" else ()
    return (entry["category"], cast, text)


def compile_review(source, authoring, audit):
    originals = source["approvedEntries"]
    source_by_id = {entry["id"]: entry for entry in originals}
    source_templates = {entry["id"]: entry for entry in source["approvedRelationshipTemplates"]}
    decisions = {row["id"]: row for row in audit["ingredientDecisions"]}
    template_decisions = {row["id"]: row for row in audit["relationshipTemplateDecisions"]}
    if len(originals) != 1326 or len(source_templates) != 96:
        raise ValueError("The immutable source must be the full approved 2.6.1 bank.")
    if len(decisions) != 1326 or set(decisions) != set(source_by_id):
        raise ValueError("Every original ingredient needs exactly one audit decision.")
    if len(template_decisions) != 96 or set(template_decisions) != set(source_templates):
        raise ValueError("Every original template needs exactly one audit decision.")
    if authoring["sourcePackVersion"] != "2.6.1" or authoring["targetPackVersion"] != "2.7.0":
        raise ValueError("Incorrect authoring lifecycle.")
    for entry in originals:
        decision = decisions[entry["id"]]
        if (decision["text"], decision["category"], decision["rating"]) != (
            entry["text"], entry["category"], entry["contentRating"]
        ):
            raise ValueError("Audit does not describe the frozen original: " + entry["id"])
    for tid, entry in source_templates.items():
        decision = template_decisions[tid]
        for key in ("premise", "minPlayers", "maxPlayers", "namedRoles", "expandableRole"):
            if decision[key] != entry[key]:
                raise ValueError("Template audit does not describe the frozen original: " + tid)

    rewrites = {}
    for category, rows in authoring["rewrites"].items():
        for suffix, text in keyed_lines(rows).items():
            rewrites[prompt_id(category, suffix)] = text
    merges = {}
    for category, rows in authoring["semanticMerges"].items():
        for suffix, target in keyed_lines(rows).items():
            merges[prompt_id(category, suffix)] = prompt_id(category, target)
    templates = deepcopy(source_templates)
    relationship_rows = keyed_lines(authoring["relationshipRewrites"], 3)
    for suffix, (premise, roles_text) in relationship_rows.items():
        template = templates[f"rel_{suffix}"]
        rewrites[prompt_id("relationship", suffix)] = premise
        template["premise"] = premise
        if template["maxPlayers"] > template["minPlayers"]:
            if ";" in roles_text:
                raise ValueError("An ensemble needs one reviewed expandable role.")
            template["namedRoles"] = [
                f"{roles_text} {number}" for number in range(1, template["minPlayers"] + 1)
            ]
            template["expandableRole"] = roles_text
        else:
            template["namedRoles"] = roles_text.split(";")
            template["expandableRole"] = None
        template["tags"] = ["atomic"]
    referenced = set(rewrites) | set(merges) | set(merges.values()) | set(authoring["metadata"])
    if not referenced <= set(source_by_id):
        raise ValueError("Unknown original in authoring: " + str(sorted(referenced - set(source_by_id))))
    for identity, decision in decisions.items():
        if decision["decision"] != "keep" and identity not in rewrites and identity not in merges:
            raise ValueError("Flagged original has no hand-authored treatment: " + identity)
    for tid, decision in template_decisions.items():
        suffix = tid.removeprefix("rel_")
        if decision["decision"] != "keep" and suffix not in relationship_rows:
            raise ValueError("Flagged template roles have no hand-authored treatment: " + tid)

    entries = deepcopy(source_by_id)
    for identity, entry in entries.items():
        entry["flavor"] = entry.get("flavor", "grounded")
        entry["tags"] = [
            tag for tag in entry["tags"] if tag not in GAME_TAGS | RATING_TAGS
        ]
        if identity in rewrites:
            entry["text"] = rewrites[identity]
            entry["tags"] = ["atomic"] + [tag for tag in entry["tags"] if tag in TASK_TAGS]
            entry["domains"] = []
            entry["contentRating"] = "clean"
            entry["flavor"] = "grounded"
            if entry["category"] == "situation":
                entry["compositionForm"] = "clause"
        entry.update(authoring["metadata"].get(identity, {}))

    def merge_target(identity):
        seen = set()
        while identity in merges:
            if identity in seen:
                raise ValueError("Semantic alias cycle: " + identity)
            seen.add(identity)
            target = merges[identity]
            before, after = entries[identity], entries[target]
            if before["category"] != after["category"] or (
                before["category"] == "relationship"
                and (before["minPlayers"], before["maxPlayers"]) !=
                (after["minPlayers"], after["maxPlayers"])
            ):
                raise ValueError("Unsafe same-category/cast consolidation: " + identity)
            identity = target
        return identity

    roots = {identity: merge_target(identity) for identity in entries}
    candidates = [entry for identity, entry in entries.items() if roots[identity] == identity]
    # Prefer an unchanged original over a rewritten duplicate (e.g. Note taker).
    candidates.sort(key=lambda entry: (
        entry["text"] != source_by_id[entry["id"]]["text"],
        list(source_by_id).index(entry["id"]),
    ))
    selected = {}
    exact_aliases = {}
    for entry in candidates:
        key = canonical_key(entry)
        if key not in selected:
            selected[key] = entry
        exact_aliases[entry["id"]] = selected[key]["id"]
    aliases = {
        identity: exact_aliases[roots[identity]]
        for identity in source_by_id
    }
    canonical = {entry["id"]: entry for entry in selected.values()}
    for identity, target in aliases.items():
        destination = canonical[target]
        for task in sorted(TASK_TAGS):
            if task in source_by_id[identity]["tags"] and task not in destination["tags"]:
                destination["tags"].append(task)
    for suffix in authoring["takesObject"]:
        identity = prompt_id("action", suffix)
        if identity not in aliases:
            raise ValueError("Unknown reviewed direct-transitive Action: " + identity)
        entry = canonical[aliases[identity]]
        if "takes_object" not in entry["tags"]:
            entry["tags"].append("takes_object")

    active_templates = []
    for entry in canonical.values():
        if entry["category"] != "relationship":
            continue
        template = templates[entry["relationshipTemplateId"]]
        template["premise"] = entry["text"]
        template["contentRating"] = entry["contentRating"]
        old = source_templates[template["id"]]
        if template != old:
            template["version"] = old["version"] + 1
        active_templates.append(template)
    for identity, entry in canonical.items():
        old = source_by_id[identity]
        if entry != old or (
            entry["category"] == "relationship" and
            templates[entry["relationshipTemplateId"]] != source_templates[entry["relationshipTemplateId"]]
        ):
            entry["version"] = old["version"] + 1

    for category, rows in authoring["additions"].items():
        for suffix, (text, rating, flavor) in keyed_lines(rows, 4).items():
            identity = prompt_id(category, suffix)
            if identity in entries or identity in canonical or int(suffix) < 4000:
                raise ValueError("New values need unused 4000+ IDs: " + identity)
            entry = {
                "id": identity, "category": category, "text": text, "tags": ["atomic"],
                "flavor": flavor, "domains": [],
                "compositionForm": "clause" if category in {"situation", "opening_line"} else "noun",
                "contentRating": rating, "minPlayers": 2, "maxPlayers": 12, "version": 1,
            }
            if category == "object":
                entry["tags"].append("association_seed")
            elif category == "profession":
                entry["tags"].append("familiar_profession")
            canonical[identity] = entry
    for suffix, (text, rating, roles) in keyed_lines(authoring["newRelationships"], 4).items():
        identity = prompt_id("relationship", suffix)
        tid = f"rel_{suffix}"
        if identity in entries or tid in source_templates or int(suffix) < 4000:
            raise ValueError("New relationship identity is not new: " + identity)
        template = {
            "id": tid, "premise": text, "minPlayers": 2, "maxPlayers": 2,
            "namedRoles": roles.split(";"), "expandableRole": None,
            "tags": ["atomic"], "contentRating": rating, "version": 1,
        }
        active_templates.append(template)
        canonical[identity] = {
            "id": identity, "category": "relationship", "text": text,
            "tags": ["atomic"], "flavor": "grounded", "domains": [],
            "compositionForm": "people", "contentRating": rating,
            "minPlayers": 2, "maxPlayers": 2, "version": 1,
            "relationshipTemplateId": tid,
        }

    order = {entry["id"]: n for n, entry in enumerate(originals)}
    prompts = sorted(canonical.values(), key=lambda entry: (order.get(entry["id"], 10000), entry["id"]))
    active_templates.sort(key=lambda template: template["id"])
    archive = []
    approved_decisions = []
    template_by_id = {template["id"]: template for template in active_templates}
    for old in originals:
        identity = old["id"]
        current = canonical[aliases[identity]]
        old_template = source_templates.get(old.get("relationshipTemplateId"))
        new_template = template_by_id.get(current.get("relationshipTemplateId"))
        roles_changed = old_template and (
            old_template["namedRoles"] != new_template["namedRoles"] or
            old_template["expandableRole"] != new_template["expandableRole"]
        )
        if old["text"] != current["text"] or identity != current["id"] or roles_changed:
            example = {
                "id": f"curated_atomic_{identity}_v{old['version']}",
                "originalText": old["text"],
                "source": {
                    "id": identity, "category": old["category"],
                    "version": old["version"], "packVersion": "2.6.1",
                },
                "ingredients": [{
                    "category": current["category"], "id": current["id"],
                    "version": current["version"],
                }],
            }
            if old_template:
                example["originalRoles"] = old_template["namedRoles"]
                example["originalExpandableRole"] = old_template["expandableRole"]
            archive.append(example)
        disposition = (
            "consolidate" if identity != current["id"] else
            "rewrite" if old != current or roles_changed else "keep"
        )
        if "party_advice" in old["tags"]:
            disposition = "historical_game_input"
        elif decisions[identity]["decision"] == "move":
            disposition = (
                "historical_activity_seed" if identity in {
                    "prompt_situation_119", "prompt_situation_123",
                    "prompt_situation_162", "prompt_situation_2112",
                } else "reclassified_role" if old["category"] == "role"
                else "historical_performance_constraint"
            )
        approved_decisions.append({
            "id": identity, "category": old["category"],
            "sourceText": old["text"], "sourceVersion": old["version"],
            "auditDecision": decisions[identity]["decision"],
            "disposition": disposition, "canonicalId": current["id"],
            "approvedText": current["text"], "approvedRating": current["contentRating"],
            "reason": decisions[identity]["reason"],
            "reviewStatus": "approved",
        })
    approved_template_decisions = []
    prompt_for_template = {
        entry["relationshipTemplateId"]: entry for entry in originals if entry["category"] == "relationship"
    }
    for tid, old in source_templates.items():
        original_prompt = prompt_for_template[tid]
        current = canonical[aliases[original_prompt["id"]]]
        template = template_by_id[current["relationshipTemplateId"]]
        approved_template_decisions.append({
            "id": tid, "auditDecision": template_decisions[tid]["decision"],
            "sourcePremise": old["premise"], "sourceVersion": old["version"],
            "originalRoles": old["namedRoles"], "originalExpandableRole": old["expandableRole"],
            "canonicalTemplateId": template["id"], "approvedPremise": template["premise"],
            "approvedRoles": template["namedRoles"], "approvedExpandableRole": template["expandableRole"],
            "minPlayers": old["minPlayers"], "maxPlayers": old["maxPlayers"],
            "reviewStatus": "approved",
        })
    if len({canonical_key(entry) for entry in prompts}) != len(prompts):
        raise ValueError("New authoring introduced a duplicate canonical value.")
    for category in {entry["category"] for entry in originals}:
        for players in range(2, 13):
            if not any(entry["category"] == category and entry["contentRating"] == "clean"
                       and entry["minPlayers"] <= players <= entry["maxPlayers"] for entry in prompts):
                raise ValueError(f"Missing clean category/cast coverage: {category}/{players}")
    review = {
        "sourcePackVersion": "2.6.1", "targetPackVersion": "2.7.0",
        "previousReview": SOURCE_PATH.name,
        "policy": authoring["policy"], "editorialNotes": authoring["editorialNotes"],
        "sourceApprovalSha256": digest(SOURCE_PATH),
        "authoringSha256": digest(AUTHORING_PATH), "auditSha256": digest(AUDIT_PATH),
        "sourceReviewedIngredientIds": list(source_by_id),
        "sourceReviewedRelationshipTemplateIds": list(source_templates),
        "reviewedIngredientIds": [entry["id"] for entry in prompts],
        "approvedValues": [
            {key: entry[key] for key in ("id", "category", "text", "version")} for entry in prompts
        ],
        "approvedEntries": prompts,
        "reviewedRelationshipTemplateIds": [entry["id"] for entry in active_templates],
        "approvedRelationshipTemplates": active_templates,
        "decisions": approved_decisions,
        "relationshipDecisions": approved_template_decisions,
        "approvedAliases": aliases, "approvedArchive": archive,
        "counts": {
            "canonicalIngredients": len(prompts), "canonicalTemplates": len(active_templates),
            "aliases": len(aliases), "archivedOriginals": len(archive),
            "byCategory": dict(sorted(Counter(entry["category"] for entry in prompts).items())),
            "byCategoryAndRating": {
                category: dict(sorted(Counter(entry["contentRating"] for entry in prompts
                                              if entry["category"] == category).items()))
                for category in sorted({entry["category"] for entry in prompts})
            },
        },
    }
    return review


def verify_approval(review, approve=False):
    if approve:
        write_if_changed(APPROVAL_PATH, review)
    elif not APPROVAL_PATH.exists() or APPROVAL_PATH.read_bytes() != encoded(review):
        raise ValueError(
            "Atomic authoring differs from its frozen approval; explicit editorial approval "
            "requires --approve-atomic-ingredients."
        )


def apply_review(root, approve=False, audit_directory=None):
    root = Path(root)
    if not AUDIT_PATH.exists():
        if not approve or audit_directory is None:
            raise ValueError("Initial approval requires the complete original audit directory.")
        audit_directory = Path(audit_directory)
        audit = {
            "sourcePackVersion": "2.6.1",
            "ingredientDecisions": load(audit_directory / "ingredient-decisions.json"),
            "relationshipTemplateDecisions": load(audit_directory / "relationship-template-decisions.json"),
        }
        write_if_changed(AUDIT_PATH, audit)
    review = compile_review(load(SOURCE_PATH), load(AUTHORING_PATH), load(AUDIT_PATH))
    verify_approval(review, approve)
    outputs = {
        "atomic-ingredients-2.7.json": review["approvedEntries"],
        "atomic-relationships-2.7.json": review["approvedRelationshipTemplates"],
        "atomic-aliases-2.7.json": review["approvedAliases"],
        "atomic-archive-2.7.json": review["approvedArchive"],
    }
    for name, data in outputs.items():
        write_if_changed(root / name, data)
    print(json.dumps({"pack": "2.7.0", **review["counts"]}, sort_keys=True))
    return review


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--approve-atomic-ingredients", action="store_true")
    parser.add_argument("--audit-directory", type=Path)
    args = parser.parse_args()
    apply_review(
        PROJECT / "src/content/v2",
        approve=args.approve_atomic_ingredients,
        audit_directory=args.audit_directory,
    )
