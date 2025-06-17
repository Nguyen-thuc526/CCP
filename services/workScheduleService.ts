import { WorkSchedule, WorkScheduleResponse } from '@/types/workSchedule';
import axiosInstance from './axiosInstance';

export const workScheduleService = {
  // API đặt lịch rảnh cho Counselor
  async setWorkSchedule(data: WorkSchedule): Promise<WorkSchedule> {
    const response = await axiosInstance.post('/api/WorkSchedule', data);
    console.log('WorkSchedule response:', response.data);
    return response.data;
  },

  // API lấy danh sách lịch rảnh của Counselor
  async getMySchedules(): Promise<WorkScheduleResponse> {
    const response = await axiosInstance.get('/api/WorkSchedule/my-schedules');
    console.log('My schedules response:', response.data);
    return response.data;
  }
};
