"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MessageSquare, Video, X, Eye } from "lucide-react"
import { AppointmentFilters } from "./appointment-filters"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface Appointment {
  id: number
  member: string
  avatar: string
  date: string
  time: string
  duration: string
  type: string
  status: string
  issue: string
  notes?: string
  canCancel: boolean
}

export function AppointmentList() {
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [appointmentNote, setAppointmentNote] = useState("")
  const [filters, setFilters] = useState({
    date: undefined as Date | undefined,
    status: "all",
    issueType: "all",
    searchTerm: "",
  })

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      member: "Nguyễn Văn A & Nguyễn Thị B",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "15/05/2025",
      time: "10:00",
      duration: "60 phút",
      type: "Cuộc gọi video",
      status: "Sắp tới",
      issue: "Kỹ năng giao tiếp",
      canCancel: true,
    },
    {
      id: 2,
      member: "Lê Văn D & Lê Thị E",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "15/05/2025",
      time: "14:30",
      duration: "60 phút",
      type: "Cuộc gọi video",
      status: "Sắp tới",
      issue: "Giải quyết xung đột",
      canCancel: true,
    },
    {
      id: 3,
      member: "Hoàng Văn G & Hoàng Thị H",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "16/05/2025",
      time: "11:15",
      duration: "90 phút",
      type: "Cuộc gọi video",
      status: "Đã lên lịch",
      issue: "Hướng dẫn nuôi dạy con",
      canCancel: true,
    },
    {
      id: 4,
      member: "Đỗ Văn J & Đỗ Thị K",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "16/05/2025",
      time: "15:45",
      duration: "60 phút",
      type: "Cuộc gọi video",
      status: "Đã lên lịch",
      issue: "Lập kế hoạch tài chính",
      canCancel: false,
    },
    {
      id: 5,
      member: "Trần Văn M & Trần Thị N",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "14/05/2025",
      time: "13:00",
      duration: "60 phút",
      type: "Cuộc gọi video",
      status: "Đã hoàn thành",
      issue: "Xây dựng lòng tin",
      notes:
        "Buổi tư vấn diễn ra tốt. Cặp đôi đã hiểu rõ hơn về vấn đề giao tiếp và cam kết thực hiện các bước cải thiện mà chúng tôi đã thảo luận.",
      canCancel: false,
    },
  ])

  useEffect(() => {
    let result = [...appointments]

    // Lọc theo ngày
    if (filters.date) {
      const filterDate = format(filters.date, "dd/MM/yyyy")
      result = result.filter((appointment) => appointment.date === filterDate)
    }

    // Lọc theo trạng thái
    if (filters.status !== "all") {
      const statusMap: Record<string, string> = {
        upcoming: "Sắp tới",
        scheduled: "Đã lên lịch",
        completed: "Đã hoàn thành",
        cancelled: "Đã hủy",
      }
      result = result.filter((appointment) => appointment.status === statusMap[filters.status])
    }

    // Lọc theo loại vấn đề
    if (filters.issueType !== "all") {
      const issueMap: Record<string, string> = {
        communication: "Kỹ năng giao tiếp",
        conflict: "Giải quyết xung đột",
        parenting: "Hướng dẫn nuôi dạy con",
        financial: "Lập kế hoạch tài chính",
        trust: "Xây dựng lòng tin",
      }
      result = result.filter((appointment) => appointment.issue === issueMap[filters.issueType])
    }

    // Lọc theo từ khóa tìm kiếm
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase()
      result = result.filter((appointment) => appointment.member.toLowerCase().includes(searchTerm))
    }

    setFilteredAppointments(result)
  }, [filters, appointments])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const cancelAppointment = (appointmentId: number) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status: "Đã hủy", canCancel: false } : appointment,
      ),
    )
  }

  const openNoteDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setAppointmentNote(appointment.notes || "")
    setShowNoteDialog(true)
  }

  const saveNote = () => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === selectedAppointment.id
            ? { ...appointment, notes: appointmentNote, status: "Đã hoàn thành" }
            : appointment,
        ),
      )
      setShowNoteDialog(false)
      setAppointmentNote("")
      setSelectedAppointment(null)
    }
  }

  // Hàm định dạng ngày
  function format(date: Date, formatStr: string): string {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className="space-y-4">
      <AppointmentFilters onFilterChange={handleFilterChange} />
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
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.member} />
                            <AvatarFallback>
                              {appointment.member.split(" ")[0][0]}
                              {appointment.member.split(" ")[3]?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
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
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.type}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{appointment.issue}</td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={
                            appointment.status === "Sắp tới" || appointment.status === "Đã lên lịch"
                              ? "default"
                              : appointment.status === "Đã hoàn thành"
                                ? "secondary"
                                : appointment.status === "Đã hủy"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          {(appointment.status === "Sắp tới" || appointment.status === "Đã lên lịch") && (
                            <>
                              <Button size="sm" variant="default" asChild>
                                <Link href={`/counselor/appointments/call/${appointment.id}`}>
                                  <Video className="mr-2 h-4 w-4" />
                                  Tham gia
                                </Link>
                              </Button>
                              {appointment.canCancel && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => cancelAppointment(appointment.id)}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Hủy
                                </Button>
                              )}
                            </>
                          )}
                          <Button size="sm" variant="outline" onClick={() => openNoteDialog(appointment)}>
                            {appointment.notes ? (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem ghi chú
                              </>
                            ) : (
                              <>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Thêm ghi chú
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      Không tìm thấy lịch hẹn nào phù hợp với bộ lọc
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAppointment?.notes ? "Xem/Sửa ghi chú" : "Thêm ghi chú"} - {selectedAppointment?.member}
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
                <Badge variant="outline">{selectedAppointment?.status}</Badge>
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
              <Button onClick={saveNote}>Lưu ghi chú</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
