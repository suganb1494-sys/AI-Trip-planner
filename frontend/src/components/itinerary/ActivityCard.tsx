import type { Activity } from "../../types/trip";
export const ActivityCard = ({ item }: { item: Activity }) => (
  <p>
    <time>{item.time}</time> <b>{item.title}</b> · {item.location}
  </p>
);
