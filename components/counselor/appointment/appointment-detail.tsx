"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, Clock, Video, MessageSquare, X, Users, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface AppointmentDetailProps {
  appointmentId: string
}

export function AppointmentDetail({ appointmentId }: AppointmentDetailProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [appointmentNote, setAppointmentNote] = useState("")

  // Mock data - trong thực tế sẽ fetch từ API
  const [appointment, setAppointment] = useState({
    id: appointmentId,
    member: {
      name: "Nguyễn Văn A & Nguyễn Thị B",
      avatar: "/placeholder.svg?height=40&width=40",
      email: "nguyenvana@example.com",
      phone: "0987654321",
    },
    date: "2024-01-20",
    time: "10:00",
    duration: 60,
    issue: "Kỹ năng giao tiếp",
    description:
      "Chúng tôi đang gặp khó khăn trong việc giao tiếp với nhau và muốn được tư vấn để cải thiện mối quan hệ. Đặc biệt là trong việc lắng nghe và thể hiện cảm xúc một cách tích cực.",
    status: "scheduled", // scheduled, cancelled, completed
    createdAt: "2024-01-15T09:00:00",
    cancellationReason: "",
    notes: "",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    appointmentType: "couple" as "couple" | "individual",
  })

  const handleCancel = () => {
    if (cancellationReason.trim()) {
      setAppointment((prev) => ({
        ...prev,
        status: "cancelled",
        cancellationReason,
      }))
      setShowCancelDialog(false)
      setCancellationReason("")
    }
  }

  const handleSaveNote = () => {
    setAppointment((prev) => ({
      ...prev,
      notes: appointmentNote,
      status: "completed",
    }))
    setShowNoteDialog(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="default">Đã lên lịch</Badge>
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>
      case "completed":
        return (
          <Badge variant="secondary" className="bg-blue-500">
            Hoàn thành
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/counselor/appointments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          {appointment.appointmentType === "couple" ? (
            <Users className="h-6 w-6 text-primary" />
          ) : (
            <User className="h-6 w-6 text-primary" />
          )}
          <h1 className="text-3xl font-bold">
            Chi tiết lịch hẹn {appointment.appointmentType === "couple" ? "cặp đôi" : "cá nhân"}
          </h1>
        </div>
        {getStatusBadge(appointment.status)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin lịch hẹn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Ngày</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Giờ</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {appointment.time} ({appointment.duration} phút)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Loại tư vấn</Label>
                <div className="flex items-center gap-2 mt-1">
                  {appointment.appointmentType === "couple" ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {appointment.appointmentType === "couple" ? "Tư vấn cặp đôi" : "Tư vấn cá nhân"}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Vấn đề cần tư vấn</Label>
                <p className="mt-1 font-medium">{appointment.issue}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Mô tả chi tiết</Label>
                <p className="mt-1 text-sm">{appointment.description}</p>
              </div>

              {appointment.meetingLink && appointment.status === "scheduled" && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Link cuộc họp</Label>
                  <div className="mt-1">
                    <Button variant="outline" size="sm" asChild>
                      <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-4 w-4" />
                        Tham gia cuộc họp
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {appointment.cancellationReason && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Label className="text-sm font-medium text-orange-800">Lý do hủy</Label>
                  <p className="mt-1 text-sm text-orange-700">{appointment.cancellationReason}</p>
                </div>
              )}

              {appointment.notes && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">Ghi chú buổi tư vấn</Label>
                  <p className="mt-1 text-sm text-blue-700">{appointment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Member Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin {appointment.appointmentType === "couple" ? "cặp đôi" : "thành viên"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={appointment.member.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {appointment.member.name.split(" ")[0][0]}
                    {appointment.appointmentType === "couple" && appointment.member.name.split(" ")[3]?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    {appointment.appointmentType === "couple" ? (
                      <Users className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                    <p className="font-medium">{appointment.member.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{appointment.member.email}</p>
                  <p className="text-sm text-muted-foreground">{appointment.member.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointment.status === "scheduled" && (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Video className="mr-2 h-4 w-4" />
                      Tham gia cuộc họp
                    </a>
                  </Button>
                  <Button variant="destructive" onClick={() => setShowCancelDialog(true)} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Hủy lịch hẹn
                  </Button>
                </>
              )}

              {(appointment.status === "scheduled" || appointment.status === "completed") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setAppointmentNote(appointment.notes)
                    setShowNoteDialog(true)
                  }}
                  className="w-full"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {appointment.notes ? "Xem/Sửa ghi chú" : "Thêm ghi chú"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Yêu cầu được tạo: {formatDateTime(appointment.createdAt)}</span>
                </div>
                {appointment.status !== "scheduled" && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        appointment.status === "completed" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span>{appointment.status === "cancelled" ? "Đã hủy" : "Hoàn thành"}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy lịch hẹn</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm">
                <strong>{appointment.appointmentType === "couple" ? "Cặp đôi" : "Thành viên"}:</strong>{" "}
                {appointment.member.name}
              </p>
              <p className="text-sm">
                <strong>Thời gian:</strong> {formatDate(appointment.date)} - {appointment.time}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancellation-reason">Lý do hủy *</Label>
              <Textarea
                id="cancellation-reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Vui lòng nhập lý do hủy lịch hẹn..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleCancel} disabled={!cancellationReason.trim()}>
                Hủy lịch hẹn
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {appointment.notes ? "Xem/Sửa ghi chú" : "Thêm ghi chú"} - {appointment.member.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Ngày & Giờ</Label>
                <p>
                  {formatDate(appointment.date)} - {appointment.time}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Vấn đề</Label>
                <p>{appointment.issue}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú buổi tư vấn</Label>
              <Textarea
                id="note"
                value={appointmentNote}
                onChange={(e) => setAppointmentNote(e.target.value)}
                placeholder="Nhập ghi chú về buổi tư vấn, kết quả, và các bước tiếp theo..."
                rows={6}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveNote}>Lưu ghi chú</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
