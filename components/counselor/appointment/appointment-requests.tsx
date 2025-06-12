"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, CheckCircle, XCircle, Eye } from "lucide-react"
import { AppointmentFilters } from "./appointment-filters"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface AppointmentRequest {
  id: number
  member: string
  avatar: string
  date: string
  time: string
  duration: string
  type: string
  status: "pending" | "approved" | "rejected"
  issue: string
  requestedAt: string
  membershipTier: string
  additionalInfo?: string
}

export function AppointmentRequests() {
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const [requests, setRequests] = useState<AppointmentRequest[]>([
    {
      id: 1,
      member: "Nguyễn Văn A & Nguyễn Thị B",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "20/05/2025",
      time: "10:00",
      duration: "60 phút",
      type: "Cuộc gọi video",
      status: "pending",
      issue: "Kỹ năng giao tiếp",
      requestedAt: "15/05/2025",
      membershipTier: "Premium",
      additionalInfo: "Chúng tôi đang gặp vấn đề trong giao tiếp hàng ngày và muốn cải thiện kỹ năng lắng nghe.",
    },
    {
      id: 2,
      member: "Lê Văn D & Lê Thị E",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "21/05/2025",
      time: "14:30",
      duration: "60 phút",
      type: "Cuộc gọi video",
      status: "pending",
      issue: "Giải quyết xung đột",
      requestedAt: "15/05/2025",
      membershipTier: "Basic",
    },
    {
      id: 3,
      member: "Hoàng Văn G & Hoàng Thị H",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "22/05/2025",
      time: "11:15",
      duration: "90 phút",
      type: "Cuộc gọi video",
      status: "pending",
      issue: "Hướng dẫn nuôi dạy con",
      requestedAt: "16/05/2025",
      membershipTier: "VIP",
      additionalInfo:
        "Con chúng tôi đang trong giai đoạn tuổi teen và chúng tôi đang gặp khó khăn trong việc giao tiếp.",
    },
  ])

  const approveRequest = (requestId: number) => {
    setRequests((prev) =>
      prev.map((request) => (request.id === requestId ? { ...request, status: "approved" } : request)),
    )
  }

  const openRejectDialog = (request: AppointmentRequest) => {
    setSelectedRequest(request)
    setRejectionReason("")
    setShowRejectDialog(true)
  }

  const rejectRequest = () => {
    if (selectedRequest && rejectionReason) {
      setRequests((prev) =>
        prev.map((request) => (request.id === selectedRequest.id ? { ...request, status: "rejected" } : request)),
      )
      setShowRejectDialog(false)
    }
  }

  const pendingRequests = requests.filter((request) => request.status === "pending")

  return (
    <div className="space-y-4">
      <AppointmentFilters />

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Thành viên</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Ngày & Giờ</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Thời lượng</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Loại</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Vấn đề</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Membership</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.member} />
                            <AvatarFallback>
                              {request.member.split(" ")[0][0]}
                              {request.member.split(" ")[3]?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          {request.member}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{request.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{request.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{request.duration}</td>
                      <td className="p-4 align-middle">{request.type}</td>
                      <td className="p-4 align-middle">{request.issue}</td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={
                            request.membershipTier === "Basic"
                              ? "outline"
                              : request.membershipTier === "Premium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {request.membershipTier}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          <Button size="sm" variant="default" onClick={() => approveRequest(request.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Chấp nhận
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => openRejectDialog(request)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Từ chối
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/counselor/appointments/${request.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Chi tiết
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      Không có yêu cầu lịch hẹn nào đang chờ xử lý.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Từ chối yêu cầu lịch hẹn</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedRequest?.avatar || "/placeholder.svg"} alt={selectedRequest?.member} />
                  <AvatarFallback>
                    {selectedRequest?.member.split(" ")[0][0]}
                    {selectedRequest?.member.split(" ")[3]?.[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="font-medium">{selectedRequest?.member}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Ngày & Giờ:</span>{" "}
                  <span>
                    {selectedRequest?.date} - {selectedRequest?.time}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Vấn đề:</span> <span>{selectedRequest?.issue}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rejection-reason">
                Lý do từ chối <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Vui lòng nhập lý do từ chối yêu cầu lịch hẹn này..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Lý do từ chối sẽ được gửi đến thành viên để họ hiểu rõ và có thể đặt lịch lại.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={rejectRequest} disabled={!rejectionReason.trim()}>
                Xác nhận từ chối
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
