import { api } from "./api";
import type { Trip } from "../types/trip";
export const createTrip = (request: string) => api<Trip>("/api/trips", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ request }) });
export const planTrip = (id: string) => api<Trip>(`/api/trips/${id}/plan`, { method: "POST" });
export const getTrip = (id: string) => api<Trip>(`/api/trips/${id}`);
