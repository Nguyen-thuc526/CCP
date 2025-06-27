export interface WalletData {
  remaining: number;
}

export interface WalletResponse {
  success: boolean;
  data: WalletData;
  error?: string | null;
}
