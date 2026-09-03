import type { DayPlan as Day } from "../../types/trip";
import { ActivityCard } from "./ActivityCard";
export const DayPlan = ({ day }: { day: Day }) => <article><h3>Day {day.day}: {day.theme}</h3>{day.items.map((item) => <ActivityCard item={item} key={item.time + item.title} />)}</article>;
