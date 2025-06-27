import { BookingStatus } from "@/utils/enum";
import { CategoryDetail } from "./certification";
import { Member } from "./member";
import { Counselor } from "./counselor";

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

export interface BookingAdmin {
  id: string;
  memberId: string;
  member2Id: string | null;
  counselorId: string;
  note: string;
  timeStart: string;
  timeEnd: string;
  price: number;
  cancelReason: string | null;
  createAt: string;
  rating: number | null;
  feedback: string | null;
  isCouple: boolean | null;
  problemSummary: string | null;
  problemAnalysis: string | null;
  guides: string | null;
  isReport: boolean | null;
  reportMessage: string | null;
  status: BookingStatus;
  member: Member;
  member2: Member | null;
  counselor: Counselor;
}
export interface BookingQuery {
  PageNumber: number;
  PageSize: number;
  Status?: number; 
}


export interface BookingPagingResponse {
  items: BookingAdmin[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}