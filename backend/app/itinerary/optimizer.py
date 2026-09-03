def group_by_location(items: list[dict]) -> list[dict]: return sorted(items, key=lambda item: item.get("location", ""))
