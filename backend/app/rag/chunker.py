def chunk(text: str, size: int = 400) -> list[str]: return [text[i:i+size] for i in range(0, len(text), size)]
