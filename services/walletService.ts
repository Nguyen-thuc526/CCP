import { WalletResponse } from '@/types/wallet';
import axiosInstance from './axiosInstance';

export const WalletService = {
   async getMyBalance(): Promise<WalletResponse> {
      const response = await axiosInstance.get('api/Account/wallet-balance');
      return response.data;
   },
};
