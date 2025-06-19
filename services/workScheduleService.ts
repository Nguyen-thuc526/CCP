import { WorkSchedule, WorkScheduleResponse } from '@/types/workSchedule';
import axiosInstance from './axiosInstance';

export const workScheduleService = {
   // API đặt lịch rảnh cho Counselor
   async setWorkSchedule(data: WorkSchedule): Promise<WorkSchedule> {
      const response = await axiosInstance.post('/api/WorkSchedule', data);
      return response.data;
   },

   async getMySchedules(): Promise<WorkScheduleResponse> {
      const response = await axiosInstance.get(
         '/api/WorkSchedule/my-schedules'
      );
      return response.data;
   },
   async deleteWorkSchedule(scheduleId: string): Promise<void> {
      const response = await axiosInstance.delete(
         `/api/WorkSchedule/${scheduleId}`
      );
      return response.data; // Assuming the API returns no data on success (204 or 200 with empty body)
   },
};
