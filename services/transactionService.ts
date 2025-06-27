
import { TransactionApiResponse } from "@/types/transaction";
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
};