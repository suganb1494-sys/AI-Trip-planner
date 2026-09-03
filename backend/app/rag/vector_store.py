class VectorStore:
    def __init__(self): self.documents: dict[str, str] = {}
    def add(self, key: str, text: str): self.documents[key] = text
    def get(self, key: str): return self.documents.get(key)
