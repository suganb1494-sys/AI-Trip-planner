import type { DayPlan } from "../../types/trip";
import { DayPlan as Day } from "./DayPlan";
export const ItineraryTimeline = ({ days }: { days: DayPlan[] }) => (
  <section>
    {days.map((day) => (
      <Day day={day} key={day.day} />
    ))}
  </section>
);
