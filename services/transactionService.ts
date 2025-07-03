<<<<<<< HEAD

import { TransactionApiResponse, WithdrawResponse } from "@/types/transaction";
import axiosInstance from "./axiosInstance";

export const TransactionService = {
  async getTransactions(pageNumber: number, pageSize: number): Promise<TransactionApiResponse> {
    const response = await axiosInstance.get("api/SysTransaction/my-transactions", {
      params: {
        pageNumber,
        pageSize,
      },
    });
    return response.data;
  },
   async getMyWithdraws(): Promise<WithdrawResponse> {
    const response = await axiosInstance.get("/api/Deposit/my-withdraws");
    return response.data;
  }
};
=======
import { TransactionApiResponse } from '@/types/transaction';
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
};
>>>>>>> c82cf247b0197f3174a5256ec47b043fa21f1c2b
