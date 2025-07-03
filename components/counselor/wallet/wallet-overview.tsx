'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, Clock, ArrowDownRight } from 'lucide-react';
import { WalletData } from '@/types/wallet';

const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
   }).format(amount);
};

export function WalletOverview({
   walletData,
}: {
   walletData: WalletData | null;
}) {
   if (!walletData) return null;

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Số dư hiện tại
               </CardTitle>
               <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(walletData.balance)}
               </div>
               <p className="text-xs text-muted-foreground">
                  Có thể rút:{' '}
                  {formatCurrency(walletData.availableForWithdrawal)}
               </p>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Thu nhập tháng này
               </CardTitle>
               <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">
                  {formatCurrency(walletData.monthlyEarnings)}
               </div>
               <p className="text-xs text-muted-foreground">
                  +12.5% so với tháng trước
               </p>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">
                  Chờ thanh toán
               </CardTitle>
               <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(walletData.pendingPayments)}
               </div>
               <p className="text-xs text-muted-foreground">
                  Sẽ được xử lý trong 24h
               </p>
            </CardContent>
         </Card>

         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Đã rút</CardTitle>
               <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="text-2xl font-bold">
                  {formatCurrency(walletData.totalWithdrawn)}
               </div>
               <p className="text-xs text-muted-foreground">
                  Tổng số tiền đã rút
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
