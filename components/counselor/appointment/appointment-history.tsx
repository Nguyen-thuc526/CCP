
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MessageSquare, Eye, Download, Search } from "lucide-react"
import { AppointmentFilters } from "./appointment-filters"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import type { Appointment } from "@/types/appointment"

import { format } from "date-fns"
import { BookingStatus } from "@/utils/enum"

interface AppointmentHistoryProps {
  appointments: Appointment[]
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

export function AppointmentHistory({
  appointments = [], // Default to empty array to prevent undefined
  setAppointments,
  isLoading = false,
  error = null,
  onRetry,
}: AppointmentHistoryProps) {
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [filters, setFilters] = useState({
    date: undefined as Date | undefined,
    issueType: "all",
    searchTerm: "",
    appointmentType: "all",
  })

  const filteredHistory = useMemo(() => {
    if (!appointments) return [] // Defensive check for undefined/null

    let result = appointments.filter((appointment) => appointment.status !== BookingStatus.Confirm)

    if (filters.appointmentType !== "all") {
      result = result.filter((appointment) => appointment.appointmentType === filters.appointmentType)
    }

    if (filters.date) {
      const filterDate = format(filters.date, "dd/MM/yyyy")
      result = result.filter((appointment) => appointment.date === filterDate)
    }

    if (filters.issueType !== "all") {
      const issueMap: Record<string, string> = {
        communication: "Kỹ năng giao tiếp",
        conflict: "Giải quyết xung đột",
        parenting: "Hướng dẫn nuôi dạy con",
        financial: "Lập kế hoạch tài chính",
        trust: "Xây dựng lòng tin",
        stress: "Quản lý căng thẳng",
        confidence: "Tự tin bản thân",
        chores: "Việc nhà công bằng",
        finance: "Trách nhiệm tài chính",
      }
      result = result.filter((appointment) => appointment.issue.includes(issueMap[filters.issueType]))
    }

    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      result = result.filter((appointment) => appointment.member.toLowerCase().includes(searchTerm))
    }

    return result
  }, [filters, appointments])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const openNotesDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowNotesDialog(true)
  }

  const getStatusDisplay = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Finish:
        return "Đã kết thúc"
      case BookingStatus.Reschedule:
        return "Đề xuất lịch mới"
      case BookingStatus.MemberCancel:
        return "Đã hủy"
      case BookingStatus.Report:
        return "Báo cáo"
      case BookingStatus.Refund:
        return "Hoàn tiền"
      case BookingStatus.Complete:
        return "Đã hoàn thành"
      default:
        return "Không xác định"
    }
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Finish:
      case BookingStatus.Complete:
        return <Badge variant="secondary">{getStatusDisplay(status)}</Badge>
      case BookingStatus.MemberCancel:
      case BookingStatus.Refund:
        return <Badge variant="destructive">{getStatusDisplay(status)}</Badge>
      case BookingStatus.Reschedule:
      case BookingStatus.Report:
        return (
          <Badge variant="outline" className="border-destructive text-destructive">
            {getStatusDisplay(status)}
          </Badge>
        )
      default:
        return <Badge variant="outline">{getStatusDisplay(status)}</Badge>
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600">{error}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-4">
            Thử lại
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <AppointmentFilters onFilterChange={handleFilterChange} />
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

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
                  <th className="h-12 px-4 text-left align-middle font-medium">Trạng thái</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredHistory.length > 0 ? (
                  filteredHistory.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          {appointment.appointmentType === "couple" ? (
                            <div className="flex -space-x-2">
                              <Avatar>
                                <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.member} />
                                <AvatarFallback>{appointment.member.split(" ")[0][0]}</AvatarFallback>
                              </Avatar>
                              <Avatar>
                                <AvatarImage src={appointment.avatar2 || "/placeholder.svg"} alt={appointment.member} />
                                <AvatarFallback>{appointment.member.split(" ")[3]?.[0] || ""}</AvatarFallback>
                              </Avatar>
                            </div>
                          ) : (
                            <Avatar>
                              <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.member} />
                              <AvatarFallback>{appointment.member.split(" ")[0][0]}</AvatarFallback>
                            </Avatar>
                          )}
                          {appointment.member}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{appointment.duration}</td>
                      <td className="p-4 align-middle">{appointment.type}</td>
                      <td className="p-4 align-middle">{appointment.issue}</td>
                      <td className="p-4 align-middle">{getStatusBadge(appointment.status)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          {(appointment.status === BookingStatus.Complete ||
                            appointment.status === BookingStatus.Finish) &&
                            appointment.notes && (
                              <Button size="sm" variant="outline" onClick={() => openNotesDialog(appointment)}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Xem ghi chú
                              </Button>
                            )}

                          {(appointment.status === BookingStatus.MemberCancel ||
                            appointment.status === BookingStatus.Refund ||
                            appointment.status === BookingStatus.Reschedule ||
                            appointment.status === BookingStatus.Report) && (
                              <Button size="sm" variant="outline" onClick={() => openNotesDialog(appointment)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem lý do
                              </Button>
                            )}

                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/counselor/appointments/${appointment.id}`}>
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
                    <td colSpan={7} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-full">
                          <Search className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">Không tìm thấy lịch hẹn</p>
                          <p className="text-gray-500 text-sm">Thử điều chỉnh bộ lọc để xem thêm kết quả</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {(selectedAppointment?.status === BookingStatus.Complete ||
                selectedAppointment?.status === BookingStatus.Finish)
                ? "Ghi chú buổi tư vấn"
                : selectedAppointment?.status === BookingStatus.MemberCancel
                  ? "Lý do hủy"
                  : selectedAppointment?.status === BookingStatus.Refund
                    ? "Lý do hoàn tiền"
                    : selectedAppointment?.status === BookingStatus.Reschedule
                      ? "Lý do đề xuất lịch mới"
                      : "Lý do báo cáo"}{" "}
              - {selectedAppointment?.member}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Ngày & Giờ</Label>
                <p>
                  {selectedAppointment?.date} - {selectedAppointment?.time}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Vấn đề</Label>
                <p>{selectedAppointment?.issue}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Thời lượng</Label>
                <p>{selectedAppointment?.duration}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Trạng thái</Label>
                {selectedAppointment && getStatusBadge(selectedAppointment.status)}
              </div>
            </div>

            <div className="space-y-2">
              <Label>
                {(selectedAppointment?.status === BookingStatus.Complete ||
                  selectedAppointment?.status === BookingStatus.Finish)
                  ? "Ghi chú"
                  : selectedAppointment?.status === BookingStatus.MemberCancel
                    ? "Lý do hủy"
                    : selectedAppointment?.status === BookingStatus.Refund
                      ? "Lý do hoàn tiền"
                      : selectedAppointment?.status === BookingStatus.Reschedule
                        ? "Lý do đề xuất lịch mới"
                        : "Lý do báo cáo"}
              </Label>
              <div className="p-4 bg-muted rounded-lg whitespace-pre-line">
                {(selectedAppointment?.status === BookingStatus.Complete ||
                  selectedAppointment?.status === BookingStatus.Finish)
                  ? selectedAppointment?.notes
                  : selectedAppointment?.cancellationReason || "Không có lý do"}
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
