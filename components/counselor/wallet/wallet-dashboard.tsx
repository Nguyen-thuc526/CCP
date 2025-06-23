"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: string
  type: "income" | "withdrawal" | "pending"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  clientName?: string
}

export function WalletDashboard() {
  const walletData = {
    balance: 15750000,
    monthlyEarnings: 8500000,
    pendingPayments: 2250000,
    totalWithdrawn: 45000000,
    availableForWithdrawal: 13500000,
  }

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "income",
      amount: 1500000,
      description: "Buổi tư vấn 60 phút",
      clientName: "Nguyễn Văn A",
      date: "2024-01-15T10:00:00",
      status: "completed",
    },
    {
      id: "2",
      type: "income",
      amount: 1500000,
      description: "Buổi tư vấn 60 phút",
      clientName: "Trần Thị B",
      date: "2024-01-14T14:30:00",
      status: "completed",
    },
    {
      id: "3",
      type: "withdrawal",
      amount: 5000000,
      description: "Rút tiền về tài khoản VCB",
      date: "2024-01-13T09:15:00",
      status: "completed",
    },
    {
      id: "4",
      type: "pending",
      amount: 1500000,
      description: "Buổi tư vấn 60 phút",
      clientName: "Lê Văn C",
      date: "2024-01-12T16:00:00",
      status: "pending",
    },
    {
      id: "5",
      type: "income",
      amount: 2250000,
      description: "Buổi tư vấn 90 phút",
      clientName: "Phạm Thị D",
      date: "2024-01-11T11:00:00",
      status: "completed",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "withdrawal":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Hoàn thành
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            Chờ xử lý
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Thất bại</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
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
            <p className="text-xs text-muted-foreground">Sẽ được xử lý trong 24h</p>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>
              <ArrowDownRight className="mr-2 h-4 w-4" />
              Rút tiền
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
            <Button variant="outline">Cài đặt tự động rút</Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lịch sử giao dịch</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm..." className="pl-8 w-[200px]" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Lọc theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="income">Thu nhập</SelectItem>
                  <SelectItem value="withdrawal">Rút tiền</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
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

            <TabsContent value="all" className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      {transaction.clientName && (
                        <div className="text-sm text-muted-foreground">Khách hàng: {transaction.clientName}</div>
                      )}
                      <div className="text-xs text-muted-foreground">{formatDateTime(transaction.date)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium text-lg ${
                        transaction.type === "income" || transaction.type === "pending"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "withdrawal" ? "-" : "+"}
                      {formatCurrency(transaction.amount)}
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
