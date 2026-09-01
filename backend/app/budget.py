def calculate_budget(requirements: dict, flight_fare: float, hotel_nightly: float, activities: list[dict]) -> dict:
    travelers = requirements["travelers"]
    days = requirements["duration_days"]
    nights = max(days - 1, 1)
    flight = round(flight_fare * travelers, 2)
    hotel = round(hotel_nightly * nights, 2)
    food = round(1800 * travelers * days, 2)
    activity_total = round(sum(a["price"] * travelers for a in activities), 2)
    transport = round(1100 * days, 2)
    other = round(requirements["budget"] * 0.03, 2)
    total = round(flight + hotel + food + activity_total + transport + other, 2)
    return {"flight": flight, "hotel": hotel, "food": food, "activities": activity_total, "transport": transport, "other": other, "total": total, "remaining": round(requirements["budget"] - total, 2), "currency": requirements["currency"]}
