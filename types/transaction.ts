// Transaction types dùng cho UI + đúng shape API

// ===== Booking (thu nhập) từ API getTransactions
export interface BookingTransactionItem {
  transactionId: string;
  amount: number;
  description: string;
  createDate: string;
  clientName: string;
}

export interface TransactionApiResponse {
  success: boolean;
  data: {
    items: BookingTransactionItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
  error: string | null;
}

// ===== Withdraw list từ API getMyWithdraws
export interface WithdrawItem {
  id: string;
  walletId: string;
  total: number;
  stk: string;
  bankName: string;
  accountName: string;
  createDate: string;
  status: number; // 1 = pending, 2 = completed
}

export interface WithdrawListResponse {
  success: boolean;
  data: WithdrawItem[];
  error: string | null;
}

// ===== Model dùng hiển thị trên UI (TransactionList)
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO datetime dùng để sort/hiển thị
  type: 'income' | 'withdrawal' | 'pending';
  status: 'completed' | 'pending' | 'failed';
  clientName?: string;

  // raw fields (tùy dùng)
  transactionType?: string | number;
  docNo?: string;
  createDate?: string;
  transactionId?: string;
}
