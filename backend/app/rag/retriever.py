from .loader import load_documents
def retrieve(req: dict) -> dict:
    text = load_documents().get(req["destination"], f"Group nearby {req['destination']} attractions to reduce travel time.")
    return {"destination":req["destination"],"snippets":[text],"source":"curated-destination-guide","data_type":"cached"}
