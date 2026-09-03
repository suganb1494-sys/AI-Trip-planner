from .catalog import FARES, item
def search(req): return [item(f"{req.get('departure_city') or 'India'} to {req['destination']}", req["destination"], FARES.get(req["destination"], 18000), 4.2, "flight", duration="Estimated route")]
