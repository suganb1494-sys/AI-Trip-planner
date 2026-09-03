from ..services.weather_service import forecast
def get_weather(req): return forecast(req)
