export interface WalletData {
   currentBalance: number;
   thisMonthIncome: number;
   pendingPayment: number;
   withdrawnTotal: number;
   pendingDeposit: number;
}

export interface WalletResponse {
   success: boolean;
   data: WalletData;
   error?: string | null;
}

export interface WithdrawRequest {
   total: number;
   stk: string;
   bankName: string;
   accountName: string;
}
export interface WithdrawResponse {
   success: boolean;
   data?: any; // hoặc cụ thể hơn nếu bạn biết response trả về
   error?: string | null;
}
export interface WithdrawItem {
   id: string;
   walletId: string;
   total: number;
   stk: string;
   bankName: string;
   accountName: string;
   createDate: string; // ISO
   cancelReason: string | null;
   status: 1 | 2 | 3; // 1: pending, 2: approved, 3: rejected
   counselor: any | null;
}
export interface WithdrawListResponse {
   success: boolean;
   data: WithdrawItem[];
   error?: string | null;
}

export interface WithdrawResponse {
   success: boolean;
   data?: any;
   error?: string | null;
}
