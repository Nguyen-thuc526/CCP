"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, Clock, Video, MessageSquare, X, Users, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { bookingService } from "@/services/bookingService"
import type { SubCategory } from "@/types/certification"
import { useErrorLoadingWithUI } from "@/hooks/useErrorLoading"

interface Member {
  id: string
  accountId: string
  fullname: string
  avatar: string | null
  phone: string | null
  status: number
}

interface BookingDetail {
  id: string
  memberId: string
  member2Id: string | null
  counselorId: string
  note: string | null
  timeStart: string
  timeEnd: string
  price: number
  cancelReason: string | null
  createAt: string
  rating: number | null
  feedback: string | null
  isCouple: boolean | null
  problemSummary: string | null
  problemAnalysis: string | null
  guides: string | null
  isReport: boolean | null
  reportMessage: string | null
  status: number
  member: Member
  member2: Member | null
  subCategories: SubCategory[]
}

export default function AppointmentDetail({ appointmentId }: { appointmentId: string }) {
  const [appointment, setAppointment] = useState<BookingDetail | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [cancellationReason, setCancellationReason] = useState("")
  const [appointmentNote, setAppointmentNote] = useState("")

  const { loading, error, startLoading, stopLoading, setErrorMessage, renderStatus, renderDetailSkeleton } =
    useErrorLoadingWithUI()

  const fetchAppointmentDetail = async () => {
    try {
      startLoading()
      const response = await bookingService.getBookingDetail(appointmentId)
      if (response) {
        setAppointment(response)
      } else {
        setErrorMessage("Không thể tải chi tiết lịch hẹn. Vui lòng thử lại.")
      }
    } catch (err) {
      setErrorMessage("Đã xảy ra lỗi khi tải chi tiết lịch hẹn. Vui lòng kiểm tra kết nối mạng.")
    } finally {
      stopLoading()
    }
  }

  useEffect(() => {
    fetchAppointmentDetail()
  }, [appointmentId])

  const handleCancel = () => {
    if (cancellationReason.trim() && appointment) {
      setAppointment({
        ...appointment,
        status: 0, // Giả định 0 là trạng thái hủy
        cancelReason: cancellationReason,
      })
      setShowCancelDialog(false)
      setCancellationReason("")
      // Gửi yêu cầu hủy lên server nếu cần
    }
  }

  const handleSaveNote = () => {
    if (appointment) {
      setAppointment({
        ...appointment,
        note: appointmentNote,
        status: 2, // Giả định 2 là trạng thái hoàn thành
      })
      setShowNoteDialog(false)
      // Gửi ghi chú lên server nếu cần
    }
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

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant="default">Đã lên lịch</Badge>
      case 0:
        return <Badge variant="destructive">Đã hủy</Badge>
      case 2:
        return <Badge variant="secondary" className="bg-blue-500">Hoàn thành</Badge>
      default:
        return null
    }
  }

  // Hiển thị skeleton khi đang tải
  if (loading) {
    return renderDetailSkeleton()
  }

  // Hiển thị trạng thái lỗi với nút retry
  if (error) {
    return renderStatus({
      onRetry: fetchAppointmentDetail,
      retryText: "Tải lại chi tiết",
    })
  }

  if (!appointment) return null

  const isCouple = appointment.member2 !== null || appointment.isCouple === true
  const memberName = appointment.member2
    ? `${appointment.member.fullname} & ${appointment.member2.fullname}`
    : appointment.member.fullname
  const startDate = new Date(appointment.timeStart)
  const duration = Math.floor((new Date(appointment.timeEnd).getTime() - startDate.getTime()) / (1000 * 60))

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
          {isCouple ? <Users className="h-6 w-6 text-primary" /> : <User className="h-6 w-6 text-primary" />}
          <h1 className="text-3xl font-bold">Chi tiết lịch hẹn {isCouple ? "cặp đôi" : "cá nhân"}</h1>
        </div>
        {getStatusBadge(appointment.status)}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
                    <span>{formatDate(appointment.timeStart)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Giờ</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ({duration} phút)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Loại tư vấn</Label>
                <div className="flex items-center gap-2 mt-1">
                  {isCouple ? <Users className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  <span className="font-medium">{isCouple ? "Tư vấn cặp đôi" : "Tư vấn cá nhân"}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Vấn đề cần tư vấn</Label>
                <p className="mt-1 font-medium">
                  {appointment.subCategories.map((sub) => sub.name).join(", ") || "Không xác định"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Mô tả chi tiết</Label>
                <p className="mt-1 text-sm">{appointment.note || "Không có mô tả"}</p>
              </div>

              {appointment.status === 1 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Link cuộc họp</Label>
                  <div className="mt-1">
                    <Button variant="outline" size="sm" disabled>
                      <Video className="mr-2 h-4 w-4" />
                      Chưa có link (Cần tích hợp backend)
                    </Button>
                  </div>
                </div>
              )}

              {appointment.cancelReason && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <Label className="text-sm font-medium text-orange-800">Lý do hủy</Label>
                  <p className="mt-1 text-sm text-orange-700">{appointment.cancelReason}</p>
                </div>
              )}

              {appointment.note && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label className="text-sm font-medium text-blue-800">Ghi chú buổi tư vấn</Label>
                  <p className="mt-1 text-sm text-blue-700">{appointment.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        {appointment && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin {isCouple ? "cặp đôi" : "thành viên"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={appointment.member.avatar || "/placeholder.svg?height=40&width=40"} />
                    <AvatarFallback>{appointment.member.fullname.split(" ")[0][0]}</AvatarFallback>
                  </Avatar>
                  {isCouple && appointment.member2 && (
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={appointment.member2.avatar || "/placeholder.svg?height=40&width=40"} />
                      <AvatarFallback>{appointment.member2.fullname.split(" ")[0][0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      {isCouple ? (
                        <Users className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                      <p className="font-medium">{memberName}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.member.email || "Không có email"}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.member.phone || "Không có số điện thoại"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hành động</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {appointment.status === 1 && (
                  <>
                    <Button variant="outline" className="w-full" disabled>
                      <Video className="mr-2 h-4 w-4" />
                      Tham gia cuộc họp (Cần link)
                    </Button>
                    <Button variant="destructive" onClick={() => setShowCancelDialog(true)} className="w-full">
                      <X className="mr-2 h-4 w-4" />
                      Hủy lịch hẹn
                    </Button>
                  </>
                )}

                {(appointment.status === 1 || appointment.status === 2) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAppointmentNote(appointment.note || "")
                      setShowNoteDialog(true)
                    }}
                    className="w-full"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {appointment.note ? "Xem/Sửa ghi chú" : "Thêm ghi chú"}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lịch sử</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Yêu cầu được tạo: {formatDateTime(appointment.createAt)}</span>
                  </div>
                  {appointment.status !== 1 && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${appointment.status === 2 ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                      <span>{appointment.status === 0 ? "Đã hủy" : "Hoàn thành"}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
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
                <strong>{isCouple ? "Cặp đôi" : "Thành viên"}:</strong> {memberName}
              </p>
              <p className="text-sm">
                <strong>Thời gian:</strong> {formatDate(appointment.timeStart)} -{" "}
                {startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
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
              {appointment.note ? "Xem/Sửa ghi chú" : "Thêm ghi chú"} - {memberName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Ngày & Giờ</Label>
                <p>
                  {formatDate(appointment.timeStart)} -{" "}
                  {startDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Vấn đề</Label>
                <p>{appointment.subCategories.map((sub) => sub.name).join(", ") || "Không xác định"}</p>
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