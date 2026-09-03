import type { Budget } from "../../types/trip";
import { CostBreakdown } from "./CostBreakdown";
export const BudgetDashboard = ({ budget }: { budget: Budget }) => <section><h2>Budget</h2><CostBreakdown budget={budget} /><b>Total: ₹{budget.total.toLocaleString("en-IN")}</b></section>;
