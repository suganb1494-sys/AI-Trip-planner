from datetime import datetime
from .budget import calculate_budget
from . import tools


def build_plan(req: dict, modification: str | None = None) -> dict:
    flights = tools.search_flights(req)
    hotels = tools.search_hotels(req)
    attractions = tools.search_places(req)
    restaurants = tools.search_restaurants(req)
    weather = tools.get_weather(req)
    rag = tools.rag_search(req)
    if modification and "cheaper" in modification.lower() and "safari" in modification.lower():
        attractions = [a for a in attractions if a["name"] != "Desert safari"]
    selected = attractions[:req["duration_days"]]
    budget = calculate_budget(req, flights[0]["price"], hotels[0]["price"], selected)
    itinerary = []
    for index in range(req["duration_days"]):
        attraction = selected[index % len(selected)]
        restaurant = restaurants[index % len(restaurants)]
        itinerary.append({
            "day": index + 1,
            "date": (req["start_date"] + __import__("datetime").timedelta(days=index)).isoformat(),
            "theme": attraction["location"],
            "daily_cost": round(attraction["price"] * req["travelers"] + 1800 * req["travelers"] + 1100, 2),
            "items": [
                {"time": "09:00", "title": attraction["name"], "location": attraction["location"], "cost": attraction["price"] * req["travelers"], "data_type": attraction["data_type"]},
                {"time": "13:00", "title": f"Lunch at {restaurant['name']}", "location": restaurant["location"], "cost": restaurant["price"] * req["travelers"], "data_type": restaurant["data_type"]},
                {"time": "17:00", "title": "Flexible neighborhood exploration", "location": attraction["location"], "cost": 0, "data_type": "estimated"},
            ],
        })
    return {
        "trip_summary": req,
        "flights": flights,
        "hotels": hotels,
        "restaurants": restaurants,
        "attractions": attractions,
        "weather": weather,
        "budget": budget,
        "itinerary": itinerary,
        "assumptions": ["Prices are demo estimates and not booking quotes.", "Hotel cost uses duration minus one night.", "Availability must be confirmed with a live provider."],
        "sources": [{"name": rag["source"], "data_type": rag["data_type"]}, {"name": "demo-provider", "data_type": "estimated"}],
        "rag_context": rag["snippets"],
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "modification": modification,
    }
