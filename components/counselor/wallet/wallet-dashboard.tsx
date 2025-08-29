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

      // ===== System transactions: render đúng theo API (7 = income, 8 = pending, 10 = failed)
      const txResp: TransactionApiResponse = await TransactionService.getTransactions(1, 50);
      let mapped: Transaction[] = [];

      if (txResp.success && txResp.data) {
        const items = txResp.data.items || [];

        const sysMapped: Transaction[] = items
          .filter((i: any) => ["7", "8", "10"].includes(String(i.transactionType)))
          .map((i: any) => {
            const t = String(i.transactionType);

            if (t === "7") {
              // Thu nhập (completed)
              return {
                id: i.id,
                type: "income",
                amount: Math.abs(i.amount),
                description: i.description, // lấy thẳng từ API
                date: i.createDate,
                status: "completed",
              } as Transaction;
            }

            if (t === "8") {
              // Rút tiền chờ xử lý
              return {
                id: i.id,
                type: "pending",
                amount: Math.abs(i.amount), // UI hiển thị dấu '-'
                description: i.description, // lấy thẳng từ API
                date: i.createDate,
                status: "pending",
              } as Transaction;
            }

            // t === "10" → rút tiền bị từ chối
            return {
              id: i.id,
              type: "withdrawal",
              amount: Math.abs(i.amount), // UI hiển thị dấu '+'
              description: i.description, // lấy thẳng từ API
              date: i.createDate,
              status: "failed",
            } as Transaction;
          });

        mapped = sysMapped;
      } else {
        setErrorMessage(txResp.error || "Không thể tải lịch sử giao dịch.");
      }

      // Sắp xếp mới nhất trước
      mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(mapped);
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
