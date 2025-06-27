import axiosInstance from "@/services/axiosInstance";
import {
  ApiResponse,
  BookingResponse,
  CounselorCancelRequest,
  CounselorCancelResponse,
  LivekitTokenResponse,
  UpdateBookingStatusPayload,
  UpdateNoteRequest,
  UpdateNoteResponse,
} from "@/types/booking";

export const bookingService = {
  async getMyBookings(): Promise<BookingResponse> {
    const response = await axiosInstance.get('/api/Booking/my-bookings');
    return response.data;
  },

  async getBookingDetail(bookingId: string): Promise<BookingResponse> {
    const response = await axiosInstance.get(`/api/Booking/booking-detail/${bookingId}`);
    return response.data;
  },

  async getRoomUrl(bookingId: string): Promise<LivekitTokenResponse> {
    const response = await axiosInstance.get(`/api/Booking/${bookingId}/GetRoomUrl`);
    return response.data;
  },

  async cancelByCounselor(payload: CounselorCancelRequest): Promise<CounselorCancelResponse> {
    const response = await axiosInstance.put('/api/Booking/counselor-cancel', payload);
    return response.data;
  },
  async finishBooking(bookingId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const response = await axiosInstance.put(`/api/Booking/${bookingId}/finish`);
    return response.data;
  },
  async updateNote(payload: UpdateNoteRequest): Promise<UpdateNoteResponse> {
    const response = await axiosInstance.put('/api/Booking/update-note', payload);
    return response.data;
  },
};



export const updateBookingStatus = async (
  payload: UpdateBookingStatusPayload
): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.put<ApiResponse<null>>('/api/Booking/change-status', payload)
  return response.data
}
