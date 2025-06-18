import axiosInstance from "@/services/axiosInstance"; // Assuming this is your configured axios instance
import { BookingResponse } from "@/types/booking";



export const bookingService = {
  async getMyBookings(): Promise<BookingResponse> {
    const response = await axiosInstance.get('/api/Booking/my-bookings');
    return response.data;
  },
};