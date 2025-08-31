
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
  Transaction,
  TransactionApiResponse,
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

      // ===== Ví
      const walletResponse: WalletResponse = await WalletService.getMyBalance();
      if (walletResponse.success && walletResponse.data) {
        setWalletData(walletResponse.data);
      } else {
        setErrorMessage(walletResponse.error || "Không thể tải dữ liệu ví. Vui lòng thử lại.");
      }

      // ===== Transactions: Chỉ lấy income từ SysTransaction (transactionType = 7)
      const txResp: TransactionApiResponse = await TransactionService.getTransactions(1, 50);
      let incomeMapped: Transaction[] = [];
      if (txResp.success && txResp.data) {
        const items = txResp.data.items || [];
        incomeMapped = items
          .filter((i: any) => String(i.transactionType) === "7")
          .map((i: any) => ({
            id: i.id,
            type: "income",
            amount: Math.abs(i.amount),
            description: i.description, // lấy thẳng từ API
            date: i.createDate,
            status: "completed",
          }) as Transaction);
      } else {
        setErrorMessage(txResp.error || "Không thể tải lịch sử giao dịch.");
      }

      // ===== Withdraws: lấy từ API riêng /api/Deposit/my-withdraws
      const wdResp: any = await TransactionService.getMyWithdraws();
      let withdrawMapped: Transaction[] = [];
      if (wdResp?.success && Array.isArray(wdResp.data)) {
        withdrawMapped = wdResp.data
          .map((w: any) => {
            const baseDesc = `Rút tiền về ${w.bankName} - ${w.stk} (${w.accountName})`;
            if (Number(w.status) === 1) {
              // 1 = yêu cầu rút tiền -> pending
              return {
                id: w.id,
                type: "pending",
                amount: Math.abs(w.total), // UI hiển thị '-'
                description: baseDesc,
                date: w.createDate,
                status: "pending",
              } as Transaction;
            }
            if (Number(w.status) === 2) {
              // 2 = admin duyệt -> withdrawal completed
              return {
                id: w.id,
                type: "withdrawal",
                amount: Math.abs(w.total), // UI hiển thị '-'
                description: baseDesc + " (đã duyệt)",
                date: w.createDate,
                status: "completed",
              } as Transaction;
            }
            if (Number(w.status) === 3) {
              // 3 = admin từ chối -> withdrawal failed (tiền không trừ)
              return {
                id: w.id,
                type: "withdrawal",
                amount: Math.abs(w.total), // UI hiển thị '+' theo logic TransactionList
                description: w.cancelReason
                  ? `${baseDesc} (bị từ chối: ${w.cancelReason})`
                  : `${baseDesc} (bị từ chối)`,
                date: w.createDate,
                status: "failed",
              } as Transaction;
            }
            return null;
          })
          .filter(Boolean) as Transaction[];
      } else if (!wdResp?.success) {
        setErrorMessage(wdResp?.error || "Không thể tải danh sách rút tiền.");
      }

      // ===== Merge & sort desc theo thời gian
      const all = [...incomeMapped, ...withdrawMapped].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(all);
    } catch (e) {
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
