import { useState } from "react";
import type { Trip } from "../types/trip";
export function useTrip() { const [trip, setTrip] = useState<Trip | null>(null); return { trip, setTrip }; }
