def require_api_key(value: str | None, expected: str | None) -> bool: return not expected or value == expected
