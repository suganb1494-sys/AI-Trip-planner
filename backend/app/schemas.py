from datetime import date, datetime
from pydantic import BaseModel, Field


class TripCreate(BaseModel):
    request: str = Field(min_length=5, max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=2000)


class Requirements(BaseModel):
    destination: str
    country: str | None = None
    duration_days: int = Field(ge=1, le=30)
    travelers: int = Field(ge=1, le=20)
    budget: float = Field(gt=0)
    currency: str = "INR"
    departure_city: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    preferences: list[str] = []
    trip_type: str = "leisure"


class MessageOut(BaseModel):
    role: str
    content: str
    created_at: datetime
    model_config = {"from_attributes": True}
