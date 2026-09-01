import uuid
import re
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .config import settings
from .db import Base, engine, get_db
from .extractor import extract_requirements
from .models import Message, Trip
from .planner import build_plan
from .schemas import ChatRequest, MessageOut, TripCreate

Base.metadata.create_all(bind=engine)
app = FastAPI(title="AI Trip Planner POC", version="2.0")
app.add_middleware(CORSMiddleware, allow_origins=[x.strip() for x in settings.cors_origins.split(",")], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


def serialize(trip: Trip):
    return {"id": trip.id, "status": trip.status, "requirements": trip.requirements, "plan": trip.plan, "created_at": trip.created_at, "updated_at": trip.updated_at}


@app.get("/health")
def health():
    return {"status": "ok", "data_mode": settings.data_mode}


@app.post("/api/trips", status_code=status.HTTP_201_CREATED)
def create_trip(payload: TripCreate, db: Session = Depends(get_db)):
    req = extract_requirements(payload.request)
    trip = Trip(id=str(uuid.uuid4()), request_text=payload.request, requirements=req.model_dump(mode="json"), status="needs_clarification" if not req.start_date else "ready")
    db.add(trip)
    db.add(Message(trip=trip, role="user", content=payload.request))
    if not req.start_date:
        db.add(Message(trip=trip, role="assistant", content="What dates would you like to travel? Dates are required for price and weather searches."))
    db.commit()
    return serialize(trip)


def get_trip_or_404(trip_id: str, db: Session):
    trip = db.get(Trip, trip_id)
    if not trip:
        raise HTTPException(404, "Trip not found")
    return trip


@app.get("/api/trips/{trip_id}")
def get_trip(trip_id: str, db: Session = Depends(get_db)):
    return serialize(get_trip_or_404(trip_id, db))


@app.post("/api/trips/{trip_id}/plan")
def generate_plan(trip_id: str, db: Session = Depends(get_db)):
    trip = get_trip_or_404(trip_id, db)
    if not trip.requirements.get("start_date"):
        raise HTTPException(422, "Start date is required; ask the user instead of inventing it")
    req = dict(trip.requirements)
    req["start_date"] = __import__("datetime").date.fromisoformat(req["start_date"])
    trip.plan = build_plan(req)
    trip.status = "planned"
    db.add(Message(trip=trip, role="assistant", content="Your budget-aware itinerary is ready."))
    db.commit()
    return serialize(trip)


@app.post("/api/trips/{trip_id}/chat")
def chat(trip_id: str, payload: ChatRequest, db: Session = Depends(get_db)):
    trip = get_trip_or_404(trip_id, db)
    db.add(Message(trip=trip, role="user", content=payload.message))
    if re.search(r"\b(?:plan|create|make)\b.*\btrip\s+to\b", payload.message, re.I):
        replacement = extract_requirements(payload.message)
        trip.request_text = payload.message
        trip.requirements = replacement.model_dump(mode="json")
    if not trip.requirements.get("start_date"):
        parsed = extract_requirements(payload.message)
        if parsed.start_date:
            req = dict(trip.requirements)
            req["start_date"], req["end_date"] = parsed.start_date.isoformat(), parsed.end_date.isoformat()
            trip.requirements = req
        else:
            db.add(Message(trip=trip, role="assistant", content="Please provide a start date, including the year."))
            db.commit()
            return serialize(trip)
    req = dict(trip.requirements)
    req["start_date"] = __import__("datetime").date.fromisoformat(req["start_date"])
    trip.plan = build_plan(req, payload.message)
    trip.status = "planned"
    db.add(Message(trip=trip, role="assistant", content="I updated the itinerary while preserving the rest of your trip context."))
    db.commit()
    return serialize(trip)


@app.get("/api/trips/{trip_id}/messages", response_model=list[MessageOut])
def messages(trip_id: str, db: Session = Depends(get_db)):
    return get_trip_or_404(trip_id, db).messages


@app.get("/api/trips/{trip_id}/budget")
def budget(trip_id: str, db: Session = Depends(get_db)):
    plan = get_trip_or_404(trip_id, db).plan
    return plan.get("budget") if plan else {}


@app.get("/api/trips/{trip_id}/weather")
def weather(trip_id: str, db: Session = Depends(get_db)):
    plan = get_trip_or_404(trip_id, db).plan
    return plan.get("weather") if plan else []


@app.get("/api/trips/{trip_id}/map")
def map_data(trip_id: str, db: Session = Depends(get_db)):
    plan = get_trip_or_404(trip_id, db).plan
    return {"stops": [{"day": day["day"], "title": item["title"], "location": item["location"]} for day in (plan or {}).get("itinerary", []) for item in day["items"]]}
