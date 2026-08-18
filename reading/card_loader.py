import json
import random
from pathlib import Path

TAROT_PATH = Path("data/tarot")
TIME_ORACLE_PATH = Path("data/time-oracle/cards.json")


def get_random_time_cards(count=26):
    cards = load_time_oracle_cards()

    random.shuffle(cards)

    return cards[:count]

def load_card(slug):
    file_path = TAROT_PATH / f"{slug}.json"

    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_random_cards(count=26):
    cards = []

    for file in TAROT_PATH.glob("*.json"):

        with open(file, "r", encoding="utf-8") as f:
            card = json.load(f)

        cards.append({
            "slug": file.stem,
            "name": card["name"],
            "image": card["image"]
        })

    random.shuffle(cards)

    return cards[:count]

def random_orientation():
    return random.choice(["upright", "reversed"])

def load_time_oracle_cards():
    with open(TIME_ORACLE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_random_time_oracle_card():
    cards = load_time_oracle_cards()

    return random.choice(cards)


def load_time_card(slug):
    cards = load_time_oracle_cards()

    for card in cards:
        if card["slug"] == slug:
            return card

    return None

def get_daily_card():
    files = list(TAROT_PATH.glob("*.json"))
    file = random.choice(files)
    with open(file, "r", encoding="utf-8") as f:
        card = json.load(f)

    card["slug"] = file.stem
    card["orientation"] = random_orientation()

    return card

def load_all_cards():
    cards = []
    for file in TAROT_PATH.glob("*.json"):
        with open(file, "r", encoding="utf-8") as f:
            card = json.load(f)
        card["slug"] = file.stem
        cards.append(card)
    return cards