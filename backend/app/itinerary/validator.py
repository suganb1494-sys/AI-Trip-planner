def validate(days: list[dict], expected_days: int) -> bool: return len(days) == expected_days and all(len({x["time"] for x in day["items"]}) == len(day["items"]) for day in days)
