import type { CardItem } from "../../types/trip";
export const FlightCard = ({ item }: { item: CardItem }) => (
  <article>
    <b>{item.name}</b>
    <p>
      {item.location} · ₹{item.price.toLocaleString("en-IN")}
    </p>
  </article>
);
