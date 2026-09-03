from ..planner import build_plan
def build(requirements: dict, modification: str | None = None): return build_plan(requirements, modification)
