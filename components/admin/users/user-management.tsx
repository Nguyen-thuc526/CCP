"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, UserPlus, Search, MoreHorizontal, Ban, CheckCircle, XCircle, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: "member" | "counselor"
  status: "active" | "inactive" | "suspended" | "pending"
  joinDate: string
  lastActive: string
  membershipPlan?: string
  specialization?: string
  experience?: string
  totalAppointments?: number
  rating?: number
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetail, setShowUserDetail] = useState(false)

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20T10:30:00",
      membershipPlan: "Premium",
      totalAppointments: 5,
    },
    {
      id: "2",
      name: "Dr. Trần Thị B",
      email: "tranthib@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "counselor",
      status: "active",
      joinDate: "2023-12-01",
      lastActive: "2024-01-20T14:15:00",
      specialization: "Tư vấn hôn nhân",
      experience: "5 năm",
      totalAppointments: 120,
      rating: 4.8,
    },
    {
      id: "3",
      name: "Lê Văn C",
      email: "levanc@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      status: "inactive",
      joinDate: "2024-01-10",
      lastActive: "2024-01-18T09:20:00",
      membershipPlan: "Basic",
      totalAppointments: 2,
    },
    {
      id: "4",
      name: "Dr. Phạm Thị D",
      email: "phamthid@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "counselor",
      status: "pending",
      joinDate: "2024-01-18",
      lastActive: "2024-01-19T16:45:00",
      specialization: "Tư vấn gia đình",
      experience: "3 năm",
      totalAppointments: 0,
      rating: 0,
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "member",
      status: "suspended",
      joinDate: "2024-01-05",
      lastActive: "2024-01-17T11:10:00",
      membershipPlan: "Premium",
      totalAppointments: 8,
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const members = filteredUsers.filter((user) => user.role === "member")
  const counselors = filteredUsers.filter((user) => user.role === "counselor")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            Hoạt động
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>
      case "suspended":
        return <Badge variant="destructive">Tạm khóa</Badge>
      case "pending":
        return <Badge variant="outline">Chờ duyệt</Badge>
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "member":
        return <Badge variant="outline">Thành viên</Badge>
      case "counselor":
        return <Badge variant="default">Tư vấn viên</Badge>
      default:
        return null
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, status: newStatus as any } : user)))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const openUserDetail = (user: User) => {
    setSelectedUser(user)
    setShowUserDetail(true)
  }

  const getStats = () => {
    const totalUsers = users.length
    const activeUsers = users.filter((u) => u.status === "active").length
    const totalMembers = users.filter((u) => u.role === "member").length
    const totalCounselors = users.filter((u) => u.role === "counselor").length
    const pendingCounselors = users.filter((u) => u.role === "counselor" && u.status === "pending").length

    return { totalUsers, activeUsers, totalMembers, totalCounselors, pendingCounselors }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="text-sm text-muted-foreground">Tổng người dùng</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <div className="text-sm text-muted-foreground">Đang hoạt động</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalMembers}</div>
            <div className="text-sm text-muted-foreground">Thành viên</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.totalCounselors}</div>
            <div className="text-sm text-muted-foreground">Tư vấn viên</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.pendingCounselors}</div>
            <div className="text-sm text-muted-foreground">Chờ duyệt</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="member">Thành viên</SelectItem>
                <SelectItem value="counselor">Tư vấn viên</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="suspended">Tạm khóa</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm người dùng mới</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ tên</Label>
                      <Input id="name" placeholder="Nhập họ tên" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Nhập email" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Vai trò</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Thành viên</SelectItem>
                        <SelectItem value="counselor">Tư vấn viên</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Hủy
                    </Button>
                    <Button onClick={() => setShowCreateDialog(false)}>Tạo người dùng</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* User Tables */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({filteredUsers.length})</TabsTrigger>
          <TabsTrigger value="members">Thành viên ({members.length})</TabsTrigger>
          <TabsTrigger value="counselors">Tư vấn viên ({counselors.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Người dùng</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Vai trò</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Trạng thái</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Ngày tham gia</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Hoạt động cuối</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{getRoleBadge(user.role)}</td>
                        <td className="p-4 align-middle">{getStatusBadge(user.status)}</td>
                        <td className="p-4 align-middle">{formatDate(user.joinDate)}</td>
                        <td className="p-4 align-middle">{formatDateTime(user.lastActive)}</td>
                        <td className="p-4 align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openUserDetail(user)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              {user.status === "active" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Tạm khóa
                                </DropdownMenuItem>
                              )}
                              {user.status === "suspended" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Kích hoạt
                                </DropdownMenuItem>
                              )}
                              {user.status === "pending" && user.role === "counselor" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Duyệt
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Từ chối
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Thành viên ({members.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Thành viên</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Gói membership</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Lịch hẹn</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Trạng thái</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((user) => (
                      <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant={user.membershipPlan === "Premium" ? "default" : "secondary"}>
                            {user.membershipPlan}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">{user.totalAppointments}</td>
                        <td className="p-4 align-middle">{getStatusBadge(user.status)}</td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openUserDetail(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counselors">
          <Card>
            <CardHeader>
              <CardTitle>Tư vấn viên ({counselors.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium">Tư vấn viên</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Chuyên môn</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Kinh nghiệm</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Đánh giá</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Lịch hẹn</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Trạng thái</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counselors.map((user) => (
                      <tr key={user.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{user.specialization}</td>
                        <td className="p-4 align-middle">{user.experience}</td>
                        <td className="p-4 align-middle">
                          {user.rating ? (
                            <div className="flex items-center gap-1">
                              <span>{user.rating}</span>
                              <span className="text-yellow-500">★</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Chưa có</span>
                          )}
                        </td>
                        <td className="p-4 align-middle">{user.totalAppointments}</td>
                        <td className="p-4 align-middle">{getStatusBadge(user.status)}</td>
                        <td className="p-4 align-middle">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openUserDetail(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.status === "pending" && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleStatusChange(user.id, "active")}>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusChange(user.id, "suspended")}
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      <Dialog open={showUserDetail} onOpenChange={setShowUserDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Ngày tham gia</Label>
                  <p>{formatDate(selectedUser.joinDate)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Hoạt động cuối</Label>
                  <p>{formatDateTime(selectedUser.lastActive)}</p>
                </div>
                {selectedUser.role === "member" && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Gói membership</Label>
                      <p>{selectedUser.membershipPlan}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tổng lịch hẹn</Label>
                      <p>{selectedUser.totalAppointments}</p>
                    </div>
                  </>
                )}
                {selectedUser.role === "counselor" && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Chuyên môn</Label>
                      <p>{selectedUser.specialization}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Kinh nghiệm</Label>
                      <p>{selectedUser.experience}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Đánh giá</Label>
                      <p>{selectedUser.rating ? `${selectedUser.rating}/5 ⭐` : "Chưa có đánh giá"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tổng lịch hẹn</Label>
                      <p>{selectedUser.totalAppointments}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
