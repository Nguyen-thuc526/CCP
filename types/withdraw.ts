import { WithdrawStatus } from '@/utils/enum';
import { Counselor } from './counselor';

export interface Withdraw {
   id: string;
   walletId: string;
   total: number;
   stk: string;
   bankName: string;
   accountName: string;
   createDate: string;
   cancelReason: string | null;
   status: WithdrawStatus;
   counselor: Counselor;
}

export interface UpdateWithdrawStatusPayload {
   depositId: string;
   newStatus: number;
   cancelReason?: string;
}
