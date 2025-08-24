import { BookingStatus } from '@/utils/enum';
import { CategoryDetail } from './certification';
import { Member } from './member';
import { Counselor } from './counselor';

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
   subCategories?: SubCategory[];
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
   success: boolean;
   data: T;
   error: string | null;
}
export interface SubCategory {
   id: string;
   name: string;
   status: number;
}

export interface UpdateBookingStatusPayload {
   bookingId: string;
   status: number;
}

export interface PersonTypeItem {
   surveyId: string;
   result: string;
   description: string | null;
   scores: Record<string, number>;
}

export interface PersonTypeBeforeBookingRequest {
   memberId: string;
   surveyId: string;
   bookingId: string;
}
export interface CoupleByBookingRequest {
   bookingId: string;
}
export interface PersonTypeByNameRequest {
   name: string;
   surveyId: string;
}
export type CoupleByBookingResponse = ApiResponse<Record<string, any>>;
// nếu có schema trả về sau này, chỉ cần đổi Record<string, any> thành interface cụ thể
export type PersonTypeBeforeBookingResponse = ApiResponse<PersonTypeItem[]>;
export type PersonTypeByNameResponse = ApiResponse<PersonTypeItem | null>;
