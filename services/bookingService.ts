import axiosInstance from "@/services/axiosInstance"; // Assuming this is your configured axios instance
import { BookingResponse } from "@/types/booking";

export const bookingService = {
  async getMyBookings(): Promise<BookingResponse> {
    const response = await axiosInstance.get('/api/Booking/my-bookings');
    return response.data;
  },
  async getBookingDetail(bookingId: string): Promise<BookingResponse> {
    const response = await axiosInstance.get(`/api/Booking/booking-detail/${bookingId}`);
    return response.data;
  },

  async getRoomUrl(bookingId: string): Promise<any> {
    const response = await axiosInstance.get(`/api/Booking/${bookingId}/GetRoomUrl`);
    return response.data;
  },
};