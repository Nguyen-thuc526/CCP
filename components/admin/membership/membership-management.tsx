"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Star, Gem, Users, Plus, Edit } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface MembershipTier {
  id: string
  name: string
  level: number
  price: number
  description: string
  features: string[]
  color: string
  icon: React.ReactNode
  memberCount: number
}

export function MembershipManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([
    {
      id: "1",
      name: "Basic",
      level: 1,
      price: 299000,
      description: "Gói cơ bản cho người mới bắt đầu",
      features: ["1 buổi tư vấn/tháng", "Truy cập khóa học cơ bản", "Hỗ trợ qua email", "Tài liệu PDF"],
      color: "bg-gray-100 border-gray-300",
      icon: <Users className="h-6 w-6 text-gray-600" />,
      memberCount: 45,
    },
    {
      id: "2",
      name: "Premium",
      level: 2,
      price: 599000,
      description: "Gói nâng cao với nhiều tính năng",
      features: [
        "3 buổi tư vấn/tháng",
        "Truy cập tất cả khóa học",
        "Hỗ trợ qua chat trực tiếp",
        "Video call 1-1",
        "Tài liệu độc quyền",
      ],
      color: "bg-blue-50 border-blue-300",
      icon: <Star className="h-6 w-6 text-blue-600" />,
      memberCount: 28,
    },
    {
      id: "3",
      name: "VIP",
      level: 3,
      price: 1299000,
      description: "Gói cao cấp với dịch vụ toàn diện",
      features: [
        "Không giới hạn buổi tư vấn",
        "Truy cập tất cả nội dung",
        "Hỗ trợ 24/7",
        "Tư vấn nhóm",
        "Workshop độc quyền",
        "Ưu tiên đặt lịch",
      ],
      color: "bg-purple-50 border-purple-300",
      icon: <Crown className="h-6 w-6 text-purple-600" />,
      memberCount: 12,
    },
    {
      id: "4",
      name: "Diamond",
      level: 4,
      price: 2499000,
      description: "Gói đặc biệt dành cho khách hàng VIP",
      features: [
        "Tất cả tính năng VIP",
        "Tư vấn tại nhà",
        "Chương trình cá nhân hóa",
        "Mentor 1-1 cả tháng",
        "Sự kiện riêng tư",
        "Hotline riêng",
      ],
      color: "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400",
      icon: <Gem className="h-6 w-6 text-yellow-600" />,
      memberCount: 5,
    },
  ])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getTierBadge = (level: number) => {
    const badges = [
      { label: "Cấp 1", variant: "secondary" as const },
      { label: "Cấp 2", variant: "default" as const },
      { label: "Cấp 3", variant: "secondary" as const },
      { label: "Cấp 4", variant: "secondary" as const },
    ]
    return badges[level - 1] || badges[0]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Các gói Membership</h2>
          <p className="text-muted-foreground">Quản lý các gói membership với cấp bậc từ thấp đến cao</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo gói mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo gói Membership mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên gói</Label>
                  <Input id="name" placeholder="VD: Premium Plus" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VNĐ)</Label>
                  <Input id="price" type="number" placeholder="999000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" placeholder="Mô tả chi tiết về gói membership" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Tính năng (mỗi dòng một tính năng)</Label>
                <Textarea
                  id="features"
                  placeholder="Tư vấn không giới hạn&#10;Truy cập tất cả khóa học&#10;Hỗ trợ 24/7"
                  rows={5}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setShowCreateDialog(false)}>Tạo gói</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Membership Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {membershipTiers
          .sort((a, b) => a.level - b.level)
          .map((tier) => (
            <Card key={tier.id} className={`relative overflow-hidden ${tier.color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tier.icon}
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                  </div>
                  <Badge {...getTierBadge(tier.level)} className="text-xs">
                    {getTierBadge(tier.level).label}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(tier.price)}
                  <span className="text-sm font-normal text-muted-foreground">/tháng</span>
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Tính năng:</div>
                  <ul className="space-y-1">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Thành viên:</span>
                    <span className="font-medium">{tier.memberCount} người</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="mr-2 h-3 w-3" />
                    Sửa
                  </Button>
                  <Button variant="outline" size="sm">
                    Chi tiết
                  </Button>
                </div>
              </CardContent>

              {/* Level indicator */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-primary/20">
                <span className="absolute -top-6 -right-2 text-xs font-bold text-primary">{tier.level}</span>
              </div>
            </Card>
          ))}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê Membership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">90</div>
              <div className="text-sm text-muted-foreground">Tổng thành viên</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(45890000)}</div>
              <div className="text-sm text-muted-foreground">Doanh thu tháng này</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">Premium</div>
              <div className="text-sm text-muted-foreground">Gói phổ biến nhất</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15%</div>
              <div className="text-sm text-muted-foreground">Tăng trưởng tháng này</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
