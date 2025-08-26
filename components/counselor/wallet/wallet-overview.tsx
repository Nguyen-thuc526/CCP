"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, Clock, ArrowDownRight, Info } from "lucide-react"
import type { WalletData } from "@/types/wallet"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export function WalletOverview({
  walletData,
}: {
  walletData: WalletData | null
}) {
  if (!walletData) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư hiện tại</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(walletData.balance)}</div>
            <p className="text-xs text-muted-foreground">
              Có thể rút: {formatCurrency(walletData.availableForWithdrawal)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thu nhập tháng này</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletData.monthlyEarnings)}</div>
            <p className="text-xs text-muted-foreground">+12.5% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(walletData.pendingPayments)}</div>
            <p className="text-xs text-muted-foreground">Sẽ được chuyển vào ví sau 24h từ lúc booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã rút</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(walletData.totalWithdrawn)}</div>
            <p className="text-xs text-muted-foreground">Tổng số tiền đã rút</p>
          </CardContent>
        </Card>
      </div>

      {walletData.pendingPayments > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Thông tin về thanh toán</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Tiền từ các buổi tư vấn sẽ được tự động chuyển vào ví của bạn sau <strong>24 giờ</strong> kể từ thời
                  gian booking được thực hiện. Điều này đảm bảo chất lượng dịch vụ và bảo vệ quyền lợi của cả hai bên.
                </p>
                <p className="text-xs text-blue-700">
                  💡 Bạn có thể theo dõi trạng thái các khoản thanh toán trong mục "Lịch sử giao dịch" bên dưới.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
