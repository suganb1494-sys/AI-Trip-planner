from datetime import datetime, timedelta


def _item(name, location, price, rating, source="demo-provider", data_type="estimated", **extra):
    return {"name": name, "location": location, "price": price, "currency": "INR", "rating": rating, "source": source, "data_type": data_type, "retrieved_at": datetime.utcnow().isoformat() + "Z", **extra}


def search_flights(req):
    fares = {"Dubai": 24500, "Goa": 6500, "Paris": 46000, "Singapore": 18500, "Tokyo": 41000}
    return [_item(f"{req.get('departure_city') or 'India'} to {req['destination']}", req["destination"], fares.get(req["destination"], 18000), 4.2, duration="Estimated route", kind="flight")]


def search_hotels(req):
    hotels = {
        "Dubai": [("Citymax Business Bay", "Business Bay", 7200), ("Rove Downtown", "Downtown Dubai", 9100)],
        "Goa": [("Goa family beach stay", "North Goa", 4200), ("Heritage village stay", "South Goa", 5100)],
        "Paris": [("Paris central hotel", "Montparnasse", 11500), ("Left Bank boutique stay", "Latin Quarter", 13800)],
        "Singapore": [("Singapore city hotel", "Lavender", 8500), ("Bugis family hotel", "Bugis", 9900)],
    }
    return [_item(name, location, price, 4.3, kind="hotel") for name, location, price in hotels.get(req["destination"], [(f"{req['destination']} city stay", req["destination"], 6500)])]


def search_places(req):
    catalogs = {
        "Dubai": [("Burj Khalifa & Dubai Mall", "Downtown", 3900), ("Al Fahidi Historical District", "Bur Dubai", 0), ("Dubai Creek abra ride", "Deira", 120), ("Desert safari", "Lahbab", 4500), ("Jumeirah Beach", "Jumeirah", 0)],
        "Goa": [("Calangute Beach morning", "North Goa", 0), ("Fort Aguada", "Candolim", 100), ("Basilica of Bom Jesus", "Old Goa", 0), ("Dudhsagar Falls family excursion", "Mollem", 1800), ("Colva Beach sunset", "South Goa", 0)],
        "Paris": [("Eiffel Tower", "7th arrondissement", 2800), ("Louvre Museum", "1st arrondissement", 2200), ("Montmartre walk", "Montmartre", 0), ("Seine river cruise", "Pont Neuf", 1800)],
        "Singapore": [("Gardens by the Bay", "Marina Bay", 1900), ("Singapore Zoo", "Mandai", 3300), ("Chinatown heritage walk", "Chinatown", 0), ("Sentosa beach day", "Sentosa", 1200)],
    }
    destination = req["destination"]
    names = catalogs.get(destination, [
        (f"{destination} city highlights", f"{destination} city centre", 1200),
        (f"{destination} heritage and culture tour", f"Historic {destination}", 900),
        (f"{destination} nature and scenic experience", f"{destination} region", 700),
        (f"{destination} local market visit", f"Central {destination}", 0),
        (f"{destination} family leisure day", f"{destination} waterfront or park", 500),
    ])
    return [_item(n, loc, price, 4.5, kind="attraction") for n, loc, price in names]


def search_restaurants(req):
    catalogs = {
        "Dubai": [("Arabian Tea House", "Al Fahidi", 1600), ("Operation Falafel", "Downtown", 900)],
        "Goa": [("Vinayak Family Restaurant", "Assagao", 650), ("Mum's Kitchen", "Panaji", 900)],
        "Paris": [("Bouillon Chartier", "Grands Boulevards", 1700), ("Café de Flore", "Saint-Germain", 2200)],
        "Singapore": [("Maxwell Food Centre", "Chinatown", 700), ("Lau Pa Sat", "Downtown", 900)],
    }
    return [_item(name, location, price, 4.5, kind="restaurant") for name, location, price in catalogs.get(req["destination"], [("Popular local restaurant", req["destination"], 900)])]


def get_weather(req):
    start = req["start_date"]
    return [{"date": (start + timedelta(days=i)).isoformat(), "summary": "Warm and mostly clear", "high_c": 33, "low_c": 24, "source": "demo-weather", "data_type": "estimated"} for i in range(req["duration_days"])]


def rag_search(req):
    snippets = {
        "Dubai": ["The Dubai Metro connects the airport, Downtown, and Dubai Marina.", "Group Al Fahidi and Deira together."],
        "Goa": ["Group North Goa beaches together and keep Old Goa heritage sights on a separate day.", "Allow extra road time for a Dudhsagar excursion."],
        "Paris": ["Use the Metro and group central riverbank attractions together."],
        "Singapore": ["The MRT efficiently connects Marina Bay, Chinatown, and Sentosa."],
    }
    return {"destination": req["destination"], "snippets": snippets.get(req["destination"], [f"Group nearby {req['destination']} attractions to reduce travel time."]), "source": "curated-destination-guide", "data_type": "cached"}
