import { TransactionApiResponse, WithdrawResponse } from '@/types/transaction';
import axiosInstance from './axiosInstance';

export const TransactionService = {
   async getTransactions(
      pageNumber: number,
      pageSize: number
   ): Promise<TransactionApiResponse> {
      const response = await axiosInstance.get(
         'api/SysTransaction/my-transactions',
         {
            params: {
               pageNumber,
               pageSize,
            },
         }
      );
      return response.data;
   },
   async getMyWithdraws(): Promise<any> {
      const response = await axiosInstance.get('/api/Deposit/my-withdraws');
      return response.data;
   },
};
