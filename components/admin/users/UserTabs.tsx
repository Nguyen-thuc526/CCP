import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreHorizontal, Ban, CheckCircle, XCircle, Eye } from "lucide-react"
import { User, Role, Status } from "@/types/user"

interface UserTabsProps {
  users: User[]
  searchTerm: string
  statusFilter: string
  roleFilter: string
  handleStatusChange: (userId: string, newStatus: string) => void
  handleDeleteUser: (userId: string) => void
  openUserDetail: (user: User) => void
}

export default function UserTabs({
  users,
  searchTerm,
  statusFilter,
  roleFilter,
  handleStatusChange,
  handleDeleteUser,
  openUserDetail,
}: UserTabsProps) {
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status.toString() === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const members = filteredUsers.filter((user) => user.role === Role.Member)
  const counselors = filteredUsers.filter((user) => user.role === Role.Counselor)

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.Active:
        return <Badge variant="default" className="bg-green-500">Hoạt động</Badge>
      case Status.Inactive:
        return <Badge variant="secondary">Không hoạt động</Badge>
      case Status.Suspended:
        return <Badge variant="destructive">Tạm khóa</Badge>
      case Status.Pending:
        return <Badge variant="outline">Chờ duyệt</Badge>
      default:
        return null
    }
  }

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.Admin:
        return <Badge variant="default" className="bg-red-500">Quản trị</Badge>
      case Role.Member:
        return <Badge variant="outline">Thành viên</Badge>
      case Role.Counselor:
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

  return (
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
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName || user.email} />
                            <AvatarFallback>{(user.fullName || user.email)[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName || user.email}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{getRoleBadge(user.role)}</td>
                      <td className="p-4 align-middle">{getStatusBadge(user.status)}</td>
                      <td className="p-4 align-middle">{formatDate(user.createAt)}</td>
                      <td className="p-4 align-middle">
                        {user.lastActive ? formatDateTime(user.lastActive) : "Chưa có"}
                      </td>
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
                            {user.status === Status.Active && (
                              <DropdownMenuItem onClick={() => handleStatusChange(user.id, Status.Suspended.toString())}>
                                <Ban className="mr-2 h-4 w-4" />
                                Tạm khóa
                              </DropdownMenuItem>
                            )}
                            {user.status === Status.Suspended && (
                              <DropdownMenuItem onClick={() => handleStatusChange(user.id, Status.Active.toString())}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Kích hoạt
                              </DropdownMenuItem>
                            )}
                            {user.status === Status.Pending && user.role === Role.Counselor && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, Status.Active.toString())}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, Status.Suspended.toString())}>
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
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName || user.email} />
                            <AvatarFallback>{(user.fullName || user.email)[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName || user.email}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={user.membershipPlan === "Premium" ? "default" : "secondary"}>
                          {user.membershipPlan || "Chưa có"}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">{user.totalAppointments || 0}</td>
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
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName || user.email} />
                            <AvatarFallback>{(user.fullName || user.email)[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName || user.email}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{user.specialization || "Chưa có"}</td>
                      <td className="p-4 align-middle">{user.experience || "Chưa có"}</td>
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
                      <td className="p-4 align-middle">{user.totalAppointments || 0}</td>
                      <td className="p-4 align-middle">{getStatusBadge(user.status)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openUserDetail(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === Status.Pending && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(user.id, Status.Active.toString())}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusChange(user.id, Status.Suspended.toString())}
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
  )
}