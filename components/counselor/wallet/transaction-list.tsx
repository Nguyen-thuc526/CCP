"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Transaction } from "@/types/transaction"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("vi-VN")
}

const getTransactionIcon = (type: string, status: string) => {
  if (type === "pending" || status === "pending") {
    return <Clock className="h-4 w-4 text-orange-500" />
  }

  switch (type) {
    case "income":
      return <ArrowUpRight className="h-4 w-4 text-green-500" />
    case "withdrawal":
      return <ArrowDownRight className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-orange-500" />
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

const getTransactionTypeLabel = (type: string) => {
  switch (type) {
    case "income":
      return "Thu nhập"
    case "withdrawal":
      return "Rút tiền"
    case "pending":
      return "Chờ xử lý"
    default:
      return "Khác"
  }
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const filteredTransactions = (tabValue: string, selectValue: string) => {
    let filtered = [...transactions]

    // Filter by tab
    if (tabValue === "pending") {
      filtered = filtered.filter((t) => t.type === "pending" || t.status === "pending")
    } else if (tabValue === "income") {
      filtered = filtered.filter((t) => t.type === "income")
    } else if (tabValue === "withdrawal") {
      filtered = filtered.filter((t) => t.type === "withdrawal")
    }
    // "all" shows everything

    // Additional filter by select (if different from tab)
    if (selectValue !== "all" && selectValue !== tabValue) {
      if (selectValue === "pending") {
        filtered = filtered.filter((t) => t.type === "pending" || t.status === "pending")
      } else {
        filtered = filtered.filter((t) => t.type === selectValue)
      }
    }

    return filtered
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Lịch sử giao dịch</div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm..." className="pl-8 w-[200px]" />
            </div>
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

          {["all", "income", "withdrawal", "pending"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              {filteredTransactions(tabValue, "all").length > 0 ? (
                filteredTransactions(tabValue, "all").map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(transaction.type, transaction.status)}
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Loại: {getTransactionTypeLabel(transaction.type)}
                        </div>
                        {transaction.clientName && (
                          <div className="text-sm text-muted-foreground">Khách hàng: {transaction.clientName}</div>
                        )}
                        <div className="text-xs text-muted-foreground">{formatDateTime(transaction.date)}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-medium text-lg ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : transaction.type === "pending"
                              ? "text-orange-600"
                              : "text-red-600"
                        }`}
                      >
                        {/* 
                          - Income (completed bookings): +amount (green)
                          - Pending withdrawals: -amount (orange) 
                          - Completed withdrawals: -amount (red)
                        */}
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-lg mb-2">Không có giao dịch nào</div>
                  <div className="text-sm">
                    {tabValue === "all" && "Chưa có giao dịch nào được thực hiện."}
                    {tabValue === "income" && "Chưa có thu nhập nào từ booking."}
                    {tabValue === "withdrawal" && "Chưa có giao dịch rút tiền nào hoàn thành."}
                    {tabValue === "pending" && "Không có yêu cầu rút tiền nào đang chờ xử lý."}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
