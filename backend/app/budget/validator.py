def validate_budget(budget: dict) -> bool: return budget["total"] >= 0 and budget["total"] == round(sum(budget[key] for key in ("flight","hotel","food","activities","transport","other")), 2)
