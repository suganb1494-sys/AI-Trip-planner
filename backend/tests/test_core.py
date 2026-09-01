from datetime import date
from app.budget import calculate_budget
from app.extractor import extract_requirements
from app.planner import build_plan


def test_extraction_and_dates():
    req = extract_requirements("Plan a 5-day trip to Dubai for 2 people from Chennai under ₹1,50,000 starting 15 October 2026")
    assert req.destination == "Dubai"
    assert req.travelers == 2
    assert req.budget == 150000
    assert req.start_date == date(2026, 10, 15)


def test_missing_date_is_not_invented():
    assert extract_requirements("Plan a 5-day trip to Dubai for 2 people under ₹1,50,000").start_date is None


def test_arbitrary_country_name():
    req = extract_requirements("Plan a 6-day trip to New Zealand for 3 people under ₹4,00,000 starting 8 March 2027")
    assert req.destination == "New Zealand"
    assert req.duration_days == 6
    assert req.travelers == 3


def test_budget_is_programmatic():
    req = {"travelers": 2, "duration_days": 5, "budget": 150000, "currency": "INR"}
    result = calculate_budget(req, 20000, 7000, [{"price": 1000}, {"price": 2000}])
    assert result["flight"] == 40000
    assert result["hotel"] == 28000
    assert result["total"] == sum(result[k] for k in ["flight", "hotel", "food", "activities", "transport", "other"])


def test_itinerary_exact_day_count():
    req = extract_requirements("5-day Dubai trip for 2 people under ₹150,000 starting 15 October 2026").model_dump()
    assert len(build_plan(req)["itinerary"]) == 5
