"""Apply the explicit 2.4 place-name review and preserve earlier values."""
import json
from copy import deepcopy
from pathlib import Path

PROJECT = Path(__file__).resolve().parent.parent
SOURCE_PACK = "2.3.0"
TARGET_PACK = "2.4.0"
PLACES = {
    f"prompt_location_{number.zfill(3)}": text
    for number, text in (
        line.split("|", 1)
        for line in """001|Ferry terminal
002|Restaurant
003|Theater
004|Rooftop
005|Airport
006|Museum
007|Train
008|Laundromat
009|Wedding venue
010|Bakery
011|Lighthouse
012|Swimming pool
013|Concert hall
014|Bus depot
015|Garden center
016|Apartment
017|Village hall
018|Radio station
019|Pet salon
020|Campsite
021|Bookstore
022|Elevator
023|Food bank
024|Cable car station
025|Cinema
026|Coat check
027|Repair shop
028|Weather station
029|Antique shop
030|Rehearsal studio
031|City hall
032|Train yard
033|Beach
034|Showroom
035|Dig site
036|Observatory
037|Costume shop
038|Pottery studio
039|School
040|Grocery store
041|Boat
042|Florist
043|Library
044|Chess club
045|Aquarium
046|Workshop
047|Diner
048|Post office
049|Planetarium
050|Train station
051|Farm
052|Sailing club
053|Sculpture garden
054|Archive
055|Bowling alley
056|Shoe store
057|Office
058|Classroom
059|Toy store
060|Cafeteria
061|Nature reserve
062|Maze
063|Fairground
064|Recording studio
065|Bridge
066|Picnic area
067|Warehouse
068|Station
069|Kitchen
070|Greenhouse
071|Castle
072|Spa
073|Sandwich shop
075|Dentist office
076|Cafe
077|Hotel
079|Lounge
080|Lost property office
081|Dressing room
083|Storage room
085|Meeting room
086|Test kitchen
087|Backstage
088|Airport lounge
091|Cottage
092|Community cinema
2086|Speed dating event
2087|Couples retreat
2088|Honeymoon suite
2089|Singles cruise
2090|Lingerie shop
2091|Singles party
2092|Romantic restaurant
2093|Hotel restaurant
2094|Room
2095|Shop""".splitlines()
    )
}


def values(bank):
    return [{key: entry[key] for key in ("id", "category", "text", "version")} for entry in bank]


def write(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def restore_party_source(root):
    """Historical splits must inherit original metadata, not the 2.4 place flavor."""
    path = Path(root) / "party-ingredients.json"
    party = json.loads(path.read_text())
    review = json.loads((PROJECT / "content/editorial/ingredient-purity-2.4.0.json").read_text())
    corrections = {row["id"]: row for row in review["corrections"]}
    for entry in party:
        row = corrections.get(entry["id"])
        if row and entry["text"] == row["after"]:
            if entry["version"] != row["sourceVersion"] + 1:
                raise ValueError("Cannot restore an unrecognized place version: " + entry["id"])
            entry["text"] = row["before"]
            entry["version"] = row["sourceVersion"]
            entry["flavor"] = row["sourceFlavor"]
    write(path, party)


def apply_review(root):
    root = Path(root)
    paths = [root / "ingredients.json", root / "party-ingredients.json"]
    banks = [json.loads(path.read_text()) for path in paths]
    combined = banks[0] + banks[1]
    locations = [entry for entry in combined if entry["category"] == "location"]
    if set(PLACES) != {entry["id"] for entry in locations}:
        raise ValueError("Every current location needs an explicit place-name review.")
    if len(set(text.casefold() for text in PLACES.values())) != len(PLACES):
        raise ValueError("Place names must be unique.")
    if any(len(text) > 24 or len(text.split()) > 3 for text in PLACES.values()):
        raise ValueError("Place names must stay within three words and 24 characters.")

    review_path = PROJECT / "content/editorial/ingredient-purity-2.4.0.json"
    if not review_path.exists():
        previous = json.loads((PROJECT / "content/editorial/ingredient-purity-2.3.0.json").read_text())
        if values(combined) != previous["approvedValues"]:
            raise ValueError("Create the review only from the approved 2.3 baseline.")
        approved = deepcopy(combined)
        for entry in approved:
            if entry["id"] in PLACES:
                entry["text"] = PLACES[entry["id"]]
                entry["version"] += 1
        party_ids = {entry["id"] for entry in banks[1]}
        review = {
            "sourcePackVersion": SOURCE_PACK,
            "targetPackVersion": TARGET_PACK,
            "previousReview": "ingredient-purity-2.3.0.json",
            "locationPolicy": {"maxWords": 3, "maxCharacters": 24, "description": "An ordinary place, not a miniature scene."},
            "reviewedIngredientIds": [entry["id"] for entry in combined],
            "reviewedLocationIds": [entry["id"] for entry in locations],
            "corrections": [{
                "id": entry["id"], "category": "location",
                "before": entry["text"], "after": PLACES[entry["id"]],
                "sourceVersion": entry["version"], "extras": [],
                **({"sourceFlavor": entry["flavor"]} if entry["id"] in party_ids else {}),
            } for entry in locations],
            "approvedValues": values(approved),
            "reviewedRelationshipTemplateIds": previous["reviewedRelationshipTemplateIds"],
            "approvedRelationshipTemplates": previous["approvedRelationshipTemplates"],
        }
        write(review_path, review)
    else:
        review = json.loads(review_path.read_text())

    by_id = {entry["id"]: entry for entry in combined}
    curated_path = root / "curated-scenes.json"
    curated = json.loads(curated_path.read_text())
    archive_ids = {entry["id"] for entry in curated}
    for row in review["corrections"]:
        entry = by_id[row["id"]]
        expected_version = row["sourceVersion"] + 1
        if (entry["text"], entry["version"]) not in [
            (row["before"], row["sourceVersion"]), (row["after"], expected_version)
        ]:
            raise ValueError("Review no longer matches location: " + row["id"])
        if row["after"] != PLACES[row["id"]]:
            raise ValueError("Approved place name differs from the explicit review.")
        entry["text"] = row["after"]
        entry["version"] = expected_version
        entry["flavor"] = "grounded"
        archive_id = f"curated_simple_place_{row['id']}_v{row['sourceVersion']}"
        if archive_id not in archive_ids:
            curated.append({
                "id": archive_id,
                "originalText": row["before"],
                "source": {"id": row["id"], "category": "location", "version": row["sourceVersion"], "packVersion": SOURCE_PACK},
                "ingredients": [{"category": "location", "id": row["id"], "version": expected_version}],
            })
            archive_ids.add(archive_id)
    for example in curated:
        for reference in example["ingredients"]:
            reference["version"] = by_id[reference["id"]]["version"]
    if values(combined) != review["approvedValues"]:
        raise ValueError("Changes outside the approved place-name review.")
    for path, data in zip(paths, banks):
        write(path, data)
    write(curated_path, curated)
    print(json.dumps({"pack": TARGET_PACK, "reviewedPlaces": len(locations), "ingredients": len(combined), "preservedOriginals": len(curated)}))


if __name__ == "__main__":
    apply_review(PROJECT / "src/content/v2")
