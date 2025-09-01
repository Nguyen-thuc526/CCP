import {
   WalletResponse,
   WithdrawRequest,
   WithdrawResponse,
} from '@/types/wallet';
import axiosInstance from './axiosInstance';

export const WalletService = {
   async getMyBalance(): Promise<WalletResponse> {
      const response = await axiosInstance.get(
         '/api/Dashboard/counselor-wallet'
      );
      return response.data;
   },
   async withdraw(data: WithdrawRequest): Promise<WithdrawResponse> {
      const response = await axiosInstance.post('/api/Deposit/withdraw', data);
      return response.data;
   },
};
