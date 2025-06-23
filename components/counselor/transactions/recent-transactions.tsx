"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"

interface Transaction {
  id: string
  type: "income" | "withdrawal" | "pending"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
}

export function RecentTransactions() {
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "income",
      amount: 1500000,
      description: "Buổi tư vấn - Nguyễn Văn A",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "2",
      type: "income",
      amount: 1500000,
      description: "Buổi tư vấn - Trần Thị B",
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: "3",
      type: "withdrawal",
      amount: 5000000,
      description: "Rút tiền về tài khoản",
      date: "2024-01-13",
      status: "completed",
    },
    {
      id: "4",
      type: "pending",
      amount: 1500000,
      description: "Buổi tư vấn - Lê Văn C",
      date: "2024-01-12",
      status: "pending",
    },
    {
      id: "5",
      type: "income",
      amount: 2250000,
      description: "Buổi tư vấn 90 phút - Phạm Thị D",
      date: "2024-01-11",
      status: "completed",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
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
    <Card>
      <CardHeader>
        <CardTitle>Giao dịch gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getTransactionIcon(transaction.type)}
                <div>
                  <div className="font-medium text-sm">{transaction.description}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(transaction.date)}</div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-medium ${
                    transaction.type === "income" || transaction.type === "pending" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.type === "withdrawal" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </div>
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
