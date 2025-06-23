import { CategoryDetail } from "./certification";

// Booking model
export interface Booking {
  id: string;
  name: string;
  date: string;
  status: number;
  categories?: CategoryDetail[];
}

// Response for multiple bookings
export interface BookingResponse {
  success: boolean;
  data: Booking[];
  error?: string;
}

export interface LivekitTokenResponse {
  success: boolean;
  data: {
    token: string;
    serverUrl: string;
  };
  error: string | null;
}
export interface CounselorCancelRequest {
  bookingId: string;
  cancelReason: string;
}
export interface CounselorCancelResponse {
  success: boolean;
  message: string;
  error?: string;
}
export interface UpdateNoteRequest {
  bookingId: string;
  problemSummary: string;
  problemAnalysis: string;
  guides: string;
}

export interface UpdateNoteResponse {
  success: boolean;
  message?: string;
  error?: string;
}