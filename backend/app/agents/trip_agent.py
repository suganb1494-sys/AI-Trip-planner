from .requirement_extractor import extract
from .itinerary_agent import generate
def plan_request(prompt: str):
    requirements = extract(prompt)
    return requirements, generate(requirements.model_dump()) if requirements.start_date else None
