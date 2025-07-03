export interface Transaction {
  id: string;
  transactionType: string | number; // Maps to API's transactionType, could be refined to an enum
  docNo: string;
  amount: number;
  createDate: string;
  description: string;
  type?: "income" | "withdrawal" | "pending" | "booking"; // Inferred from transactionType or description
  status?: "completed" | "pending" | "failed"; // Inferred from description (e.g., "hoàn thành" suggests "completed")
  clientName?: string; // Extracted from description if present
  date?: string; // Alias for createDate for compatibility
}

export interface TransactionApiResponse {
  success: boolean;
  data: {
    items: Transaction[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  error: string | null;
}
export interface WithdrawResponse {
  id: string;
  walletId: string;
  total: number;
  stk: string;
  bankName: string;
  accountName: string;
  createAt: string;
  status: number;
}
