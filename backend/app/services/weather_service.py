from datetime import timedelta
def forecast(req): return [{"date": (req["start_date"] + timedelta(days=i)).isoformat(), "summary":"Estimated weather; check live forecast", "high_c": 30, "low_c": 22, "source":"demo-weather", "data_type":"estimated"} for i in range(req["duration_days"])]
