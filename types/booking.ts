import { CategoryDetail } from "./certification";

export interface Booking {
  id: string;
  name: string; // e.g., booking title or description
  date: string; // e.g., booking date/time
  status: number; // e.g., 0 for pending, 1 for confirmed, etc.
  categories?: CategoryDetail[]; // Optional, if bookings have categories like certificates
  // Add other fields as per your API response (e.g., price, location, etc.)
}

export interface BookingResponse {
  success: boolean;
  data: Booking[];
  error?: string;
}