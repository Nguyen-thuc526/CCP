export interface WalletData {
  remaining: number;
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
  data?: any;         // hoặc cụ thể hơn nếu bạn biết response trả về
  error?: string | null;
}