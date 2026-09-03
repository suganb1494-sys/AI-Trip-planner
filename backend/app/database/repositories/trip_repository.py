from ...models import Trip
class TripRepository:
    def __init__(self, db): self.db = db
    def get(self, trip_id: str): return self.db.get(Trip, trip_id)
    def save(self, trip: Trip): self.db.add(trip); self.db.commit(); return trip
