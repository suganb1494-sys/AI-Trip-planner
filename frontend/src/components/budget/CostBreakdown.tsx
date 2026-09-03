import type { Budget } from "../../types/trip";
export const CostBreakdown = ({ budget }: { budget: Budget }) => (
  <>
    {["flight", "hotel", "food", "activities", "transport", "other"].map(
      (key) => (
        <p key={key}>
          {key}: ₹{Number(budget[key as keyof Budget]).toLocaleString("en-IN")}
        </p>
      ),
    )}
  </>
);
