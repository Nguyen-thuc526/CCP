"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, Clock, ArrowDownRight, Info, Hourglass } from "lucide-react"
import type { WalletData } from "@/types/wallet"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)

export function WalletOverview({ walletData }: { walletData: WalletData | null }) {
  if (!walletData) return null

  // Có thể rút = số dư hiện tại trừ tiền đang chờ rút (nếu có)
  const availableForWithdrawal = Math.max(0, walletData.currentBalance - (walletData.pendingDeposit ?? 0))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư hiện tại</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(walletData.currentBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Có thể rút: {formatCurrency(availableForWithdrawal)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thu nhập tháng này</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletData.thisMonthIncome)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ thanh toán (24h)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(walletData.pendingPayment)}
            </div>
            <p className="text-xs text-muted-foreground">Về ví sau 24h từ lúc booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ rút</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletData.pendingDeposit)}
            </div>
            <p className="text-xs text-muted-foreground">Yêu cầu rút đang xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã rút</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(walletData.withdrawnTotal)}
            </div>
            <p className="text-xs text-muted-foreground">Tổng số tiền đã rút</p>
          </CardContent>
        </Card>
      </div>

      {walletData.pendingPayment > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Thông tin về thanh toán</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Tiền từ các buổi tư vấn sẽ được tự động chuyển vào ví của bạn sau <strong>24 giờ</strong> kể từ thời
                  gian booking được thực hiện.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
