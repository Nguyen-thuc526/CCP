
"use client";

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

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString('vi-VN');

const getTransactionIcon = (type: string, status: string) => {
  if (status === 'failed') return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  if (type === 'pending' || status === 'pending') return <Clock className="h-4 w-4 text-orange-500" />;
  if (type === 'income') return <ArrowUpRight className="h-4 w-4 text-green-500" />;
  if (type === 'withdrawal') return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  return <Clock className="h-4 w-4 text-orange-500" />;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Hoàn thành</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Chờ xử lý</Badge>;
    case 'failed':
      return <Badge variant="destructive">Thất bại</Badge>;
    default:
      return null;
  }
};

const getTransactionTypeLabel = (type: string, status: string) => {
  if (type === 'withdrawal' && status === 'completed') return 'Rút tiền';
  if (status === 'failed') return 'Rút tiền (bị từ chối)';
  if (status === 'pending') return 'Rút tiền (chờ xử lý)';
  if (type === 'income') return 'Thu nhập';
  return 'Khác';
};

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const filteredTransactions = (tabValue: string) => {
    let filtered = [...transactions];

    // Tab filter
    if (tabValue === 'pending') {
      filtered = filtered.filter((t) => t.status === 'pending' || t.type === 'pending');
    } else if (tabValue === 'income') {
      filtered = filtered.filter((t) => t.type === 'income');
    } else if (tabValue === 'withdrawal') {
      // gồm failed và completed
      filtered = filtered.filter((t) => t.type === 'withdrawal');
    }

    // Month/Year filter
    if (selectedMonth !== 'all' || selectedYear !== 'all') {
      filtered = filtered.filter((t) => {
        const d = new Date(t.date);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();
        const mOk = selectedMonth === 'all' || Number(selectedMonth) === m;
        const yOk = selectedYear === 'all' || Number(selectedYear) === y;
        return mOk && yOk;
      });
    }

    return filtered;
  };

  const getAvailableYears = () =>
    [...new Set(transactions.map((t) => new Date(t.date).getFullYear()))].sort((a, b) => b - a);

  const months = [
    { value: '1', label: 'Tháng 1' }, { value: '2', label: 'Tháng 2' }, { value: '3', label: 'Tháng 3' },
    { value: '4', label: 'Tháng 4' }, { value: '5', label: 'Tháng 5' }, { value: '6', label: 'Tháng 6' },
    { value: '7', label: 'Tháng 7' }, { value: '8', label: 'Tháng 8' }, { value: '9', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' }, { value: '11', label: 'Tháng 11' }, { value: '12', label: 'Tháng 12' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Lịch sử giao dịch</div>
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Chọn tháng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tháng</SelectItem>
                {months.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả năm</SelectItem>
                {getAvailableYears().map((y) => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
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

          {['all', 'income', 'withdrawal', 'pending'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filteredTransactions(tab).length > 0 ? (
                filteredTransactions(tab).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(t.type, t.status)}
                      <div>
                        <div className="font-medium">{t.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Loại: {getTransactionTypeLabel(t.type, t.status)}
                        </div>
                        <div className="text-xs text-muted-foreground">{formatDateTime(t.date)}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-medium text-lg ${
                          t.status === 'failed' ? 'text-green-600'
                            : t.type === 'income' ? 'text-green-600'
                            : t.type === 'pending' || t.status === 'pending' ? 'text-orange-600'
                            : 'text-red-600'
                        }`}
                      >
                        {/* Thu nhập & rút tiền bị từ chối: '+' ; Còn lại: '-' */}
                        {t.type === 'income' || t.status === 'failed' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </div>
                      {getStatusBadge(t.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-lg mb-2">Không có giao dịch nào</div>
                  <div className="text-sm">
                    {tab === 'all' && 'Chưa có giao dịch nào được thực hiện.'}
                    {tab === 'income' && 'Chưa có thu nhập nào từ booking.'}
                    {tab === 'withdrawal' && 'Chưa có giao dịch rút tiền nào.'}
                    {tab === 'pending' && 'Không có yêu cầu rút tiền nào đang chờ xử lý.'}
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
