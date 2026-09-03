from .catalog import DATA, item
def attractions(req): return [item(name, location, price, kind="attraction") for name, location, price in DATA.get(req["destination"], [(f"{req['destination']} city highlights", req["destination"], 1200)])]
def restaurants(req): return [item("Popular local restaurant", req["destination"], 900, kind="restaurant")]
