import type { CardItem } from "../../types/trip";
export const HotelCard = ({ item }: { item: CardItem }) => <article><b>{item.name}</b><p>★ {item.rating} · ₹{item.price.toLocaleString("en-IN")}</p></article>;
