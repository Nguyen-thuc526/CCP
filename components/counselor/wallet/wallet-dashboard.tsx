// WalletDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownRight, Download } from 'lucide-react';
import { useErrorLoadingWithUI } from '@/hooks/useErrorLoading';
import { WalletResponse, WalletData } from '@/types/wallet';
import { WalletService } from '@/services/walletService';
import { TransactionApiResponse, WithdrawResponse } from '@/types/transaction';
import { WalletOverview } from './wallet-overview';
import { TransactionList } from './transaction-list';
import { TransactionService } from '@/services/transactionService';
import { WithdrawModal } from './withdraw-modal';

interface Transaction {
   id: string;
   type: 'income' | 'withdrawal' | 'pending';
   amount: number;
   description: string;
   date: string;
   status: 'completed' | 'pending' | 'failed';
   clientName?: string;
}

export function WalletDashboard() {
   const [walletData, setWalletData] = useState<WalletData | null>(null);
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const { loading, error, startLoading, stopLoading, setErrorMessage } =
      useErrorLoadingWithUI();
   const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

   const fetchWalletData = async () => {
      try {
         startLoading();

         // Fetch wallet balance
         const walletResponse: WalletResponse =
            await WalletService.getMyBalance();
         if (
            walletResponse.success &&
            walletResponse.data &&
            typeof walletResponse.data.remaining === 'number'
         ) {
            setWalletData({
               balance: walletResponse.data.remaining,
               monthlyEarnings: 8500000,
               pendingPayments: 2250000,
               totalWithdrawn: 45000000,
               availableForWithdrawal: walletResponse.data.remaining,
            });
         } else {
            setErrorMessage(
               walletResponse.error ||
                  'Không thể tải dữ liệu ví. Vui lòng thử lại.'
            );
         }

         // Fetch transactions
         const transactionResponse: TransactionApiResponse =
            await TransactionService.getTransactions(1, 10);
         let mappedTransactions: Transaction[] = [];

         if (transactionResponse.success && transactionResponse.data) {
            mappedTransactions = transactionResponse.data.items.map(
               (item, index) => ({
                  id: item.transactionId || `${index + 1}`,
                  type: item.transactionType === '7' ? 'income' : 'withdrawal',
                  amount: Math.abs(item.amount),
                  description: item.description,
                  date: item.createDate,
                  status:
                     item.status === '0'
                        ? 'pending'
                        : item.status === '1'
                        ? 'completed'
                        : 'failed',
                  clientName: item.clientName,
               })
            );
         } else {
            setErrorMessage(
               transactionResponse.error ||
                  'Không thể tải dữ liệu giao dịch. Vui lòng thử lại.'
            );
         }

         // Fetch all withdrawals (only pending)
         const withdrawApiResponse = await TransactionService.getMyWithdraws();
         if (
            withdrawApiResponse?.success &&
            Array.isArray(withdrawApiResponse.data)
         ) {
            const withdrawTransactions: Transaction[] = withdrawApiResponse.data
               .filter((item) => item.status === 1) // Only include WithdrawRequestPending
               .map((item) => ({
                  id: item.id,
                  type: 'pending' as const,
                  amount: item.total,
                  description: `Rút tiền về ${item.bankName} (${item.stk})`,
                  date: item.createDate,
                  status: 'pending', // Map status = 1 to 'pending'
                  clientName: item.accountName,
               }));
            mappedTransactions = [
               ...mappedTransactions,
               ...withdrawTransactions,
            ];
         } else {
            setErrorMessage(
               'Không thể tải dữ liệu rút tiền. Vui lòng thử lại.'
            );
         }

         setTransactions(mappedTransactions);
      } catch (err) {
         setErrorMessage(
            'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng kiểm tra kết nối mạng.'
         );
      } finally {
         stopLoading();
      }
   };

   useEffect(() => {
      fetchWalletData();
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
                     <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg mb-4"
                     >
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

   if (error)
      return (
         <div>
            Lỗi: {error} <Button onClick={fetchWalletData}>Thử lại</Button>
         </div>
      );
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
                  <Button variant="outline">
                     <Download className="mr-2 h-4 w-4" />
                     Xuất báo cáo
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