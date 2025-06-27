"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, Clock, Search } from "lucide-react"
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

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  // Filter transactions based on the selected tab
  const filteredTransactions = (tabValue: string, selectValue: string) => {
    let filtered = [...transactions];
    if (tabValue !== "all") {
      filtered = filtered.filter((t) => t.type === tabValue);
    }
    if (selectValue !== "all" && selectValue !== tabValue) {
      filtered = filtered.filter((t) => t.type === selectValue);
    }
    return filtered;
  };

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

          {["all", "income", "withdrawal", "pending"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4">
              {filteredTransactions(tabValue, "all").length > 0 ? (
                filteredTransactions(tabValue, "all").map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        {transaction.clientName && (
                          <div className="text-sm text-muted-foreground">
                            Khách hàng: {transaction.clientName}
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
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  Không có giao dịch nào.
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}