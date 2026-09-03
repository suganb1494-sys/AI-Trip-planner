from ..planner import build_plan
def generate(requirements: dict, modification: str | None = None): return build_plan(requirements, modification)
