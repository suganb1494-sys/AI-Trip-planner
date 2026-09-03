class ItineraryRepository:
    def __init__(self, db): self.db = db
    def save_plan(self, trip, plan: dict): trip.plan = plan; self.db.add(trip); self.db.commit(); return trip
