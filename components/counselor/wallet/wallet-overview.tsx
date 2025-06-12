"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, TrendingDown, DollarSign, ArrowUpRight } from "lucide-react"

export function WalletOverview() {
  const walletData = {
    balance: 15750000,
    monthlyEarnings: 8500000,
    pendingPayments: 2250000,
    totalEarnings: 125000000,
    monthlyChange: 12.5,
    weeklyChange: -3.2,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Tổng quan ví
          </CardTitle>
          <Button variant="outline" size="sm">
            Rút tiền
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Balance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Số dư hiện tại
            </div>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(walletData.balance)}</div>
          </div>

          {/* Monthly Earnings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Thu nhập tháng này
            </div>
            <div className="text-2xl font-bold">{formatCurrency(walletData.monthlyEarnings)}</div>
            <div className="flex items-center gap-1 text-sm">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+{walletData.monthlyChange}%</span>
              <span className="text-muted-foreground">so với tháng trước</span>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4" />
              Chờ thanh toán
            </div>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(walletData.pendingPayments)}</div>
          </div>

          {/* Total Earnings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Tổng thu nhập
            </div>
            <div className="text-2xl font-bold">{formatCurrency(walletData.totalEarnings)}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-6">
          <Button variant="default" size="sm">
            Xem chi tiết giao dịch
          </Button>
          <Button variant="outline" size="sm">
            Lịch sử rút tiền
          </Button>
          <Button variant="outline" size="sm">
            Báo cáo thu nhập
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
