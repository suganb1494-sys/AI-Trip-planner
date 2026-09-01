import re
from datetime import datetime, timedelta
from dateutil import parser as date_parser
from .schemas import Requirements


DESTINATIONS = {"dubai": "United Arab Emirates", "paris": "France", "singapore": "Singapore", "goa": "India", "tokyo": "Japan"}


def extract_requirements(text: str) -> Requirements:
    lower = text.lower()
    destination_match = re.search(r"(?:trip|travel|vacation|holiday)\s+to\s+([A-Za-z][A-Za-z .'-]*?)(?=\s+(?:for|from|under|within|starting|on|with|budget|include|including)\b|[,.;]|$)", text, re.I)
    destination = destination_match.group(1).strip().title() if destination_match else next((name.title() for name in DESTINATIONS if name in lower), "Dubai")
    country = DESTINATIONS.get(destination.lower())
    days_match = re.search(r"(\d+)\s*[- ]?day", lower)
    people_match = re.search(r"(?:for|with)\s+(\d+)\s+(?:people|persons|travellers|travelers|adults)", lower)
    money_match = re.search(r"(?:₹|inr|rs\.?)[\s]*([\d,]+)", lower)
    if not money_match:
        money_match = re.search(r"(?:under|budget(?: of)?)\s+([\d,]+)", lower)
    from_match = re.search(r"\bfrom\s+([a-zA-Z ]+?)(?:\s+under|\s+for|,|\s+starting|\s+on|$)", text, re.I)
    start = _extract_date(text)
    duration = int(days_match.group(1)) if days_match else 5
    preferences = [p for p in ["culture", "food", "shopping", "adventure", "family", "luxury"] if p in lower]
    return Requirements(
        destination=destination,
        country=country,
        duration_days=duration,
        travelers=int(people_match.group(1)) if people_match else 2,
        budget=float(money_match.group(1).replace(",", "")) if money_match else 150000,
        departure_city=from_match.group(1).strip().title() if from_match else None,
        start_date=start,
        end_date=start + timedelta(days=duration - 1) if start else None,
        preferences=preferences,
    )


def _extract_date(text: str):
    patterns = [r"(?:starting|start(?:ing)? on|from|on)\s+(\d{1,2}\s+[A-Za-z]+\s+20\d{2})", r"(20\d{2}-\d{2}-\d{2})"]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        if match:
            try:
                return date_parser.parse(match.group(1), dayfirst=True).date()
            except ValueError:
                pass
    return None
