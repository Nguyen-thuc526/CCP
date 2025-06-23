"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Eye, CheckCircle, XCircle, Search, Clock, FileText } from "lucide-react"

interface UserReport {
  id: string
  reporterId: string
  reporterName: string
  reporterAvatar: string
  reportedUserId: string
  reportedUserName: string
  reportedUserAvatar: string
  reportedUserRole: "member" | "counselor"
  type: "inappropriate_behavior" | "spam" | "harassment" | "fake_profile" | "other"
  category: "content" | "behavior" | "technical" | "policy_violation"
  title: string
  description: string
  evidence?: string[]
  status: "pending" | "investigating" | "resolved" | "dismissed"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: string
  updatedAt: string
  assignedTo?: string
  resolution?: string
  adminNotes?: string
}

export function UserReportManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null)
  const [showReportDetail, setShowReportDetail] = useState(false)

  const [reports, setReports] = useState<UserReport[]>([
    {
      id: "1",
      reporterId: "user1",
      reporterName: "Nguyễn Văn A",
      reporterAvatar: "/placeholder.svg?height=40&width=40",
      reportedUserId: "user2",
      reportedUserName: "Dr. Trần Thị B",
      reportedUserAvatar: "/placeholder.svg?height=40&width=40",
      reportedUserRole: "counselor",
      type: "inappropriate_behavior",
      category: "behavior",
      title: "Tư vấn viên có hành vi không phù hợp",
      description:
        "Trong buổi tư vấn, tư vấn viên đã có những lời nói không phù hợp và thiếu chuyên nghiệp. Tôi cảm thấy không thoải mái và muốn báo cáo vấn đề này.",
      evidence: ["screenshot1.png", "recording1.mp3"],
      status: "pending",
      priority: "high",
      createdAt: "2024-01-20T10:30:00",
      updatedAt: "2024-01-20T10:30:00",
    },
    {
      id: "2",
      reporterId: "user3",
      reporterName: "Lê Văn C",
      reporterAvatar: "/placeholder.svg?height=40&width=40",
      reportedUserId: "user4",
      reportedUserName: "Phạm Thị D",
      reportedUserAvatar: "/placeholder.svg?height=40&width=40",
      reportedUserRole: "member",
      type: "spam",
      category: "content",
      title: "Spam tin nhắn trong hệ thống",
      description: "Người dùng này liên tục gửi tin nhắn spam và quảng cáo không liên quan đến tư vấn.",
      status: "investigating",
      priority: "medium",
      createdAt: "2024-01-19T14:15:00",
      updatedAt: "2024-01-20T09:00:00",
      assignedTo: "admin1",
    },
    {
      id: "3",
      reporterId: "user5",
      reporterName: "Hoàng Văn E",
      reporterAvatar: "/placeholder.svg?height=40&width=40",
      reportedUserId: "user6",
      reportedUserName: "Dr. Nguyễn Thị F",
      reportedUserAvatar: "/placeholder.svg?height=40&width=40",
      reportedUserRole: "counselor",
      type: "fake_profile",
      category: "policy_violation",
      title: "Hồ sơ tư vấn viên giả mạo",
      description: "Tôi nghi ngờ tư vấn viên này sử dụng thông tin giả mạo về bằng cấp và kinh nghiệm.",
      status: "resolved",
      priority: "high",
      createdAt: "2024-01-18T16:45:00",
      updatedAt: "2024-01-20T11:30:00",
      assignedTo: "admin2",
      resolution: "Đã xác minh thông tin và tạm khóa tài khoản tư vấn viên.",
    },
    {
      id: "4",
      reporterId: "user7",
      reporterName: "Trần Văn G",
      reporterAvatar: "/placeholder.svg?height=40&width=40",
      reportedUserId: "user8",
      reportedUserName: "Lê Thị H",
      reportedUserAvatar: "/placeholder.svg?height=40&width=40",
      reportedUserRole: "member",
      type: "harassment",
      category: "behavior",
      title: "Quấy rối qua tin nhắn",
      description: "Người dùng này liên tục gửi tin nhắn quấy rối và không phù hợp sau khi tôi từ chối lời mời hẹn hò.",
      status: "dismissed",
      priority: "medium",
      createdAt: "2024-01-17T11:20:00",
      updatedAt: "2024-01-19T15:45:00",
      assignedTo: "admin1",
      resolution: "Sau khi điều tra, không tìm thấy bằng chứng đủ để xác nhận vi phạm.",
    },
  ])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedUserName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesType = typeFilter === "all" || report.type === typeFilter
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesType && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Chờ xử lý</Badge>
      case "investigating":
        return (
          <Badge variant="default" className="bg-blue-500">
            Đang điều tra
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-500">
            Đã giải quyết
          </Badge>
        )
      case "dismissed":
        return <Badge variant="secondary">Đã bác bỏ</Badge>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Thấp
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Trung bình
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            Cao
          </Badge>
        )
      case "urgent":
        return <Badge variant="destructive">Khẩn cấp</Badge>
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      inappropriate_behavior: "Hành vi không phù hợp",
      spam: "Spam",
      harassment: "Quấy rối",
      fake_profile: "Hồ sơ giả mạo",
      other: "Khác",
    }
    return typeLabels[type as keyof typeof typeLabels] || type
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const handleStatusChange = (reportId: string, newStatus: string) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, status: newStatus as any, updatedAt: new Date().toISOString() } : report,
      ),
    )
  }

  const openReportDetail = (report: UserReport) => {
    setSelectedReport(report)
    setShowReportDetail(true)
  }

  const getStats = () => {
    const totalReports = reports.length
    const pendingReports = reports.filter((r) => r.status === "pending").length
    const investigatingReports = reports.filter((r) => r.status === "investigating").length
    const resolvedReports = reports.filter((r) => r.status === "resolved").length
    const urgentReports = reports.filter((r) => r.priority === "urgent").length

    return { totalReports, pendingReports, investigatingReports, resolvedReports, urgentReports }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <div className="text-sm text-muted-foreground">Tổng báo cáo</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.pendingReports}</div>
              <div className="text-sm text-muted-foreground">Chờ xử lý</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.investigatingReports}</div>
              <div className="text-sm text-muted-foreground">Đang điều tra</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.resolvedReports}</div>
              <div className="text-sm text-muted-foreground">Đã giải quyết</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.urgentReports}</div>
              <div className="text-sm text-muted-foreground">Khẩn cấp</div>
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
                  placeholder="Tìm kiếm báo cáo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="investigating">Đang điều tra</SelectItem>
                  <SelectItem value="resolved">Đã giải quyết</SelectItem>
                  <SelectItem value="dismissed">Đã bác bỏ</SelectItem>
                </SelectContent>
              </Select>
              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Loại báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="inappropriate_behavior">Hành vi không phù hợp</SelectItem>
                  <SelectItem value="spam">Spam</SelectItem>
                  <SelectItem value="harassment">Quấy rối</SelectItem>
                  <SelectItem value="fake_profile">Hồ sơ giả mạo</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
              {/* Priority Filter */}
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="urgent">Khẩn cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách báo cáo ({filteredReports.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 text-left font-medium">Báo cáo</th>
                    <th className="h-12 px-4 text-left font-medium">Người báo cáo</th>
                    <th className="h-12 px-4 text-left font-medium">Người bị báo cáo</th>
                    <th className="h-12 px-4 text-left font-medium">Loại</th>
                    <th className="h-12 px-4 text-left font-medium">Mức độ</th>
                    <th className="h-12 px-4 text-left font-medium">Trạng thái</th>
                    <th className="h-12 px-4 text-left font-medium">Ngày tạo</th>
                    <th className="h-12 px-4 text-left font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-top max-w-[250px]">
                        <div title={report.title}>
                          <div className="font-medium line-clamp-1">{report.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2" title={report.description}>
                            {report.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2 max-w-[180px] overflow-hidden">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={report.reporterAvatar || "/placeholder.svg"} alt={report.reporterName} />
                            <AvatarFallback>{report.reporterName[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate" title={report.reporterName}>
                            {report.reporterName}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2 max-w-[180px] overflow-hidden">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={report.reportedUserAvatar || "/placeholder.svg"}
                              alt={report.reportedUserName}
                            />
                            <AvatarFallback>{report.reportedUserName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="truncate">
                            <div className="text-sm font-medium" title={report.reportedUserName}>
                              {report.reportedUserName}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {report.reportedUserRole === "counselor" ? "Tư vấn viên" : "Thành viên"}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
                      </td>
                      <td className="p-4 align-middle">{getPriorityBadge(report.priority)}</td>
                      <td className="p-4 align-middle">{getStatusBadge(report.status)}</td>
                      <td className="p-4 align-middle">{formatDateTime(report.createdAt)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openReportDetail(report)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {report.status === "pending" && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleStatusChange(report.id, "investigating")}>
                                <Clock className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleStatusChange(report.id, "resolved")}>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleStatusChange(report.id, "dismissed")}>
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
      </div>

      {/* Report Detail Dialog */}
      <Dialog open={showReportDetail} onOpenChange={setShowReportDetail}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết báo cáo</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedReport.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{getTypeLabel(selectedReport.type)}</Badge>
                    {getPriorityBadge(selectedReport.priority)}
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">ID: {selectedReport.id}</div>
              </div>

              {/* Users Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Người báo cáo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={selectedReport.reporterAvatar || "/placeholder.svg"}
                          alt={selectedReport.reporterName}
                        />
                        <AvatarFallback>{selectedReport.reporterName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedReport.reporterName}</div>
                        <div className="text-sm text-muted-foreground">ID: {selectedReport.reporterId}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Người bị báo cáo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={selectedReport.reportedUserAvatar || "/placeholder.svg"}
                          alt={selectedReport.reportedUserName}
                        />
                        <AvatarFallback>{selectedReport.reportedUserName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{selectedReport.reportedUserName}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedReport.reportedUserRole === "counselor" ? "Tư vấn viên" : "Thành viên"} - ID:{" "}
                          {selectedReport.reportedUserId}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Report Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Nội dung báo cáo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedReport.description}</p>
                </CardContent>
              </Card>

              {/* Evidence */}
              {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Bằng chứng đính kèm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedReport.evidence.map((evidence, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{evidence}</span>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Thời gian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Ngày tạo:</strong> {formatDateTime(selectedReport.createdAt)}
                    </div>
                    <div>
                      <strong>Cập nhật cuối:</strong> {formatDateTime(selectedReport.updatedAt)}
                    </div>
                    {selectedReport.assignedTo && (
                      <div>
                        <strong>Được giao cho:</strong> {selectedReport.assignedTo}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Resolution */}
              {selectedReport.resolution && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Kết quả xử lý</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedReport.resolution}</p>
                  </CardContent>
                </Card>
              )}

              {/* Admin Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Ghi chú của Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Thêm ghi chú về báo cáo này..."
                    value={selectedReport.adminNotes || ""}
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              {selectedReport.status === "pending" && (
                <div className="flex gap-2">
                  <Button onClick={() => handleStatusChange(selectedReport.id, "investigating")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Bắt đầu điều tra
                  </Button>
                  <Button variant="outline" onClick={() => handleStatusChange(selectedReport.id, "resolved")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Đánh dấu đã giải quyết
                  </Button>
                  <Button variant="outline" onClick={() => handleStatusChange(selectedReport.id, "dismissed")}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Bác bỏ báo cáo
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
