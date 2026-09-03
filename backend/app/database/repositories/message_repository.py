from ...models import Message
class MessageRepository:
    def __init__(self, db): self.db = db
    def for_trip(self, trip_id: str): return self.db.query(Message).filter(Message.trip_id == trip_id).all()
