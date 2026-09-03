from datetime import datetime, timedelta

def item(name, location, price, rating=4.4, kind="place", **extra):
    return {"name": name, "location": location, "price": price, "currency": "INR", "rating": rating, "source": "demo-provider", "data_type": "estimated", "retrieved_at": datetime.utcnow().isoformat() + "Z", "kind": kind, **extra}

DATA = {
    "Dubai": [("Burj Khalifa & Dubai Mall", "Downtown", 3900), ("Al Fahidi Historical District", "Bur Dubai", 0), ("Dubai Creek abra ride", "Deira", 120), ("Desert safari", "Lahbab", 4500)],
    "Goa": [("Calangute Beach morning", "North Goa", 0), ("Fort Aguada", "Candolim", 100), ("Basilica of Bom Jesus", "Old Goa", 0), ("Dudhsagar Falls", "Mollem", 1800)],
    "Singapore": [("Gardens by the Bay", "Marina Bay", 1900), ("Singapore Zoo", "Mandai", 3300), ("Chinatown heritage walk", "Chinatown", 0), ("Sentosa beach day", "Sentosa", 1200)],
    "Paris": [("Eiffel Tower", "7th arrondissement", 2800), ("Louvre Museum", "1st arrondissement", 2200), ("Montmartre walk", "Montmartre", 0)],
}
FARES = {"Dubai": 24500, "Goa": 6500, "Paris": 46000, "Singapore": 18500}
