import { api } from "./api";
import type { Trip } from "../types/trip";
export const sendTripMessage = (id: string, message: string) => api<Trip>(`/api/trips/${id}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
