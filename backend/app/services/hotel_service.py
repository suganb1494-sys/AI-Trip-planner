from .catalog import item
def search(req): return [item(f"{req['destination']} city stay", req["destination"], {"Dubai":7200,"Goa":4200,"Paris":11500,"Singapore":8500}.get(req["destination"],6500), 4.3, "hotel")]
