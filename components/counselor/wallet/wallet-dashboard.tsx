"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownRight } from "lucide-react";
import { useErrorLoadingWithUI } from "@/hooks/useErrorLoading";

import type { WalletResponse, WalletData } from "@/types/wallet";
import { WalletService } from "@/services/walletService";
import { TransactionService } from "@/services/transactionService";

import {
  Transaction, // UI model
  TransactionApiResponse, // resp bookings
  BookingTransactionItem,
  WithdrawListResponse, // resp withdraws
  WithdrawItem,
} from "@/types/transaction";

import { WalletOverview } from "./wallet-overview";
import { TransactionList } from "./transaction-list";
import { WithdrawModal } from "./withdraw-modal";

export function WalletDashboard() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { loading, error, startLoading, stopLoading, setErrorMessage } = useErrorLoadingWithUI();
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const fetchWalletData = async () => {
    try {
      startLoading();

      // ===== Ví (gọi API counselor-wallet)
      const walletResponse: WalletResponse = await WalletService.getMyBalance();

      if (walletResponse.success && walletResponse.data) {
        // API đã trả đúng shape: currentBalance, thisMonthIncome, pendingPayment, withdrawnTotal, pendingDeposit
        setWalletData(walletResponse.data);
      } else {
        setErrorMessage(walletResponse.error || "Không thể tải dữ liệu ví. Vui lòng thử lại.");
      }

      // ===== Bookings (thu nhập - completed)
      const transactionResponse: TransactionApiResponse = await TransactionService.getTransactions(1, 10);
      let mappedTransactions: Transaction[] = [];

      if (transactionResponse.success && transactionResponse.data) {
        const completedBookings: Transaction[] = transactionResponse.data.items.map(
          (item: BookingTransactionItem, index: number) => ({
            id: item.transactionId || `booking-${index + 1}`,
            type: "income",
            amount: Math.abs(item.amount),
            description: item.description || "Thu nhập từ booking",
            date: item.createDate,
            status: "completed",
            clientName: item.clientName,
          })
        );
        mappedTransactions = [...completedBookings];
      } else {
        setErrorMessage(transactionResponse.error || "Không thể tải dữ liệu giao dịch. Vui lòng thử lại.");
      }

      // ===== Withdraws (pending + completed)
      const withdrawApiResponse: WithdrawListResponse = await TransactionService.getMyWithdraws();

      if (withdrawApiResponse?.success && Array.isArray(withdrawApiResponse.data)) {
        const pendingWithdrawals: Transaction[] = withdrawApiResponse.data
          .filter((item: WithdrawItem) => item.status === 1)
          .map((item: WithdrawItem) => ({
            id: `withdraw-${item.id}`,
            type: "pending",
            amount: item.total,
            description: `Yêu cầu rút tiền về ${item.bankName} (${item.stk})`,
            date: item.createDate,
            status: "pending",
            clientName: item.accountName,
          }));

        const completedWithdrawals: Transaction[] = withdrawApiResponse.data
          .filter((item: WithdrawItem) => item.status === 2)
          .map((item: WithdrawItem) => ({
            id: `withdraw-completed-${item.id}`,
            type: "withdrawal",
            amount: item.total,
            description: `Đã rút tiền về ${item.bankName} (${item.stk})`,
            date: item.createDate,
            status: "completed",
            clientName: item.accountName,
          }));

        mappedTransactions = [...mappedTransactions, ...pendingWithdrawals, ...completedWithdrawals];
      } else {
        setErrorMessage("Không thể tải dữ liệu rút tiền. Vui lòng thử lại.");
      }

      // Sort newest first
      mappedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(mappedTransactions);
    } catch {
      setErrorMessage("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng kiểm tra kết nối mạng.");
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-36" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-36" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg mb-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-4" />
                  <div>
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24 mt-2" />
                    <Skeleton className="h-3 w-32 mt-1" />
                  </div>
                </div>
                <div className="text-right">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16 mt-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Lỗi: {error} <Button onClick={fetchWalletData}>Thử lại</Button>
      </div>
    );
  }

  if (!walletData) return null;

  return (
    <div className="space-y-6">
      <WalletOverview walletData={walletData} />

      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={() => setIsWithdrawModalOpen(true)}>
              <ArrowDownRight className="mr-2 h-4 w-4" />
              Rút tiền
            </Button>
          </div>
        </CardContent>
      </Card>

      <TransactionList transactions={transactions} />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={fetchWalletData}
      />
    </div>
  );
}
