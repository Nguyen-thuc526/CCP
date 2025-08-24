import axiosInstance from './axiosInstance';
import { NotificateResponse } from '@/types/notificate';

export const NotificatiService = {
   async getMyNotifications(): Promise<NotificateResponse> {
      const response = await axiosInstance.get(
         '/api/Notification/my-notifications'
      );
      return response.data as NotificateResponse;
   },
   async getSummary(noCache = false) {
      const cfg = noCache
         ? {
              params: { _: Date.now() }, // cache-buster
              headers: { 'Cache-Control': 'no-cache' }, // tránh proxy/browser cache
           }
         : undefined;

      const response = await axiosInstance.get(
         '/api/Notification/summary',
         cfg
      );
      return response.data; // chấp nhận cả 2 dạng: có/không bọc data
   },
};
