'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import type { Transaction } from '@/types/transaction';
import { useState } from 'react';

const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
   }).format(amount);
};

const formatDateTime = (dateString: string) => {
   return new Date(dateString).toLocaleString('vi-VN');
};

const getTransactionIcon = (type: string, status: string) => {
   if (type === 'pending' || status === 'pending') {
      return <Clock className="h-4 w-4 text-orange-500" />;
   }

   switch (type) {
      case 'income':
         return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
         return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
         return <Clock className="h-4 w-4 text-orange-500" />;
   }
};

const getStatusBadge = (status: string) => {
   switch (status) {
      case 'completed':
         return (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
               Hoàn thành
            </Badge>
         );
      case 'pending':
         return (
            <Badge
               variant="secondary"
               className="bg-orange-100 text-orange-800"
            >
               Chờ xử lý
            </Badge>
         );
      case 'failed':
         return <Badge variant="destructive">Thất bại</Badge>;
      default:
         return null;
   }
};

const getTransactionTypeLabel = (type: string) => {
   switch (type) {
      case 'income':
         return 'Thu nhập';
      case 'withdrawal':
         return 'Rút tiền';
      case 'pending':
         return 'Chờ xử lý';
      default:
         return 'Khác';
   }
};

export function TransactionList({
   transactions,
}: {
   transactions: Transaction[];
}) {
   const [selectedMonth, setSelectedMonth] = useState<string>('all');
   const [selectedYear, setSelectedYear] = useState<string>('all');

   const filteredTransactions = (tabValue: string) => {
      let filtered = [...transactions];

      // Filter by tab
      if (tabValue === 'pending') {
         filtered = filtered.filter(
            (t) => t.type === 'pending' || t.status === 'pending'
         );
      } else if (tabValue === 'income') {
         filtered = filtered.filter((t) => t.type === 'income');
      } else if (tabValue === 'withdrawal') {
         filtered = filtered.filter((t) => t.type === 'withdrawal');
      }

      // Filter by month and year
      if (selectedMonth !== 'all' || selectedYear !== 'all') {
         filtered = filtered.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const transactionMonth = transactionDate.getMonth() + 1; // getMonth() returns 0-11
            const transactionYear = transactionDate.getFullYear();

            const monthMatch =
               selectedMonth === 'all' ||
               Number.parseInt(selectedMonth) === transactionMonth;
            const yearMatch =
               selectedYear === 'all' ||
               Number.parseInt(selectedYear) === transactionYear;

            return monthMatch && yearMatch;
         });
      }

      return filtered;
   };

   const getAvailableYears = () => {
      const years = [
         ...new Set(transactions.map((t) => new Date(t.date).getFullYear())),
      ];
      return years.sort((a, b) => b - a); // Sort descending (newest first)
   };

   const months = [
      { value: '1', label: 'Tháng 1' },
      { value: '2', label: 'Tháng 2' },
      { value: '3', label: 'Tháng 3' },
      { value: '4', label: 'Tháng 4' },
      { value: '5', label: 'Tháng 5' },
      { value: '6', label: 'Tháng 6' },
      { value: '7', label: 'Tháng 7' },
      { value: '8', label: 'Tháng 8' },
      { value: '9', label: 'Tháng 9' },
      { value: '10', label: 'Tháng 10' },
      { value: '11', label: 'Tháng 11' },
      { value: '12', label: 'Tháng 12' },
   ];

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <div className="text-lg font-semibold">Lịch sử giao dịch</div>
               <div className="flex gap-2">
                  <Select
                     value={selectedMonth}
                     onValueChange={setSelectedMonth}
                  >
                     <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Chọn tháng" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả tháng</SelectItem>
                        {months.map((month) => (
                           <SelectItem key={month.value} value={month.value}>
                              {month.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                     <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Chọn năm" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả năm</SelectItem>
                        {getAvailableYears().map((year) => (
                           <SelectItem key={year} value={year.toString()}>
                              {year}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>
         </CardHeader>
         <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
               <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="income">Thu nhập</TabsTrigger>
                  <TabsTrigger value="withdrawal">Rút tiền</TabsTrigger>
                  <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
               </TabsList>

               {['all', 'income', 'withdrawal', 'pending'].map((tabValue) => (
                  <TabsContent
                     key={tabValue}
                     value={tabValue}
                     className="space-y-4"
                  >
                     {filteredTransactions(tabValue).length > 0 ? (
                        filteredTransactions(tabValue).map((transaction) => (
                           <div
                              key={transaction.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                           >
                              <div className="flex items-center gap-4">
                                 {getTransactionIcon(
                                    transaction.type,
                                    transaction.status
                                 )}
                                 <div>
                                    <div className="font-medium">
                                       {transaction.description}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                       Loại:{' '}
                                       {getTransactionTypeLabel(
                                          transaction.type
                                       )}
                                    </div>
                                    {transaction.clientName && (
                                       <div className="text-sm text-muted-foreground">
                                          Tên tài khoản:{' '}
                                          {transaction.clientName}
                                       </div>
                                    )}
                                    <div className="text-xs text-muted-foreground">
                                       {formatDateTime(transaction.date)}
                                    </div>
                                 </div>
                              </div>

                              <div className="text-right">
                                 <div
                                    className={`font-medium text-lg ${
                                       transaction.type === 'income'
                                          ? 'text-green-600'
                                          : transaction.type === 'pending'
                                            ? 'text-orange-600'
                                            : 'text-red-600'
                                    }`}
                                 >
                                    {transaction.type === 'income' ? '+' : '-'}
                                    {formatCurrency(transaction.amount)}
                                 </div>
                                 {getStatusBadge(transaction.status)}
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-center text-muted-foreground py-8">
                           <div className="text-lg mb-2">
                              Không có giao dịch nào
                           </div>
                           <div className="text-sm">
                              {tabValue === 'all' &&
                                 'Chưa có giao dịch nào được thực hiện.'}
                              {tabValue === 'income' &&
                                 'Chưa có thu nhập nào từ booking.'}
                              {tabValue === 'withdrawal' &&
                                 'Chưa có giao dịch rút tiền nào hoàn thành.'}
                              {tabValue === 'pending' &&
                                 'Không có yêu cầu rút tiền nào đang chờ xử lý.'}
                           </div>
                        </div>
                     )}
                  </TabsContent>
               ))}
            </Tabs>
         </CardContent>
      </Card>
   );
}
