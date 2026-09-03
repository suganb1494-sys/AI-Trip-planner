export type DataType = "estimated" | "cached" | "live";
export interface TripRequirements { destination: string; departure_city: string; start_date: string; duration_days: number; travelers: number; budget: number; }
export interface Budget { flight: number; hotel: number; food: number; activities: number; transport: number; other: number; total: number; remaining: number; currency: string; }
export interface Activity { time: string; title: string; location: string; cost: number; }
export interface DayPlan { day: number; date: string; theme: string; daily_cost: number; items: Activity[]; }
export interface TripPlan { itinerary: DayPlan[]; budget: Budget; flights: CardItem[]; hotels: CardItem[]; rag_context: string[]; }
export interface CardItem { name: string; location: string; rating: number; price: number; data_type: DataType; }
export interface Trip { id: string; requirements: TripRequirements; plan?: TripPlan; }
