import { ApiResponse } from '@/types/booking';
import axiosInstance from './axiosInstance';
import { UpdateWithdrawStatusPayload, Withdraw } from '@/types/withdraw';

export const getWithdrawByStatus = async (
   status: Number
): Promise<Withdraw[]> => {
   const response = await axiosInstance.get<ApiResponse<Withdraw[]>>(
      `/api/Deposit/status/${status}`
   );
   const { success, data, error } = response.data;

   if (success) {
      return data;
   } else {
      throw new Error(error || 'Failed to fetch withdraw request');
   }
};

export const updateWithdrawStatus = async (
   payload: UpdateWithdrawStatusPayload
): Promise<boolean> => {
   try {
      const response = await axiosInstance.put<ApiResponse<null>>(
         '/api/Deposit/change-status',
         payload
      );

      const { success, error } = response.data;

      if (success) {
         return true;
      } else {
         throw new Error(error || 'Failed to update withdraw status');
      }
   } catch (err) {
      console.error('Error updating withdraw status:', err);
      throw err;
   }
};
