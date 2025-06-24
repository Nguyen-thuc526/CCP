"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, Video, Eye, Users, Search, FileText, Edit3 } from "lucide-react"
import { AppointmentNoteDialog } from "./appointmentNoteDialog"

import Link from "next/link"
import type { Appointment } from "@/types/appointment"
import { format } from "date-fns"
import type { BookingStatus } from "@/utils/enum"
import { bookingService } from "@/services/bookingService"
import { toast } from "@/components/ui/use-toast"

interface AppointmentsCompletedListProps {
  appointments: Appointment[]
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
  statusFilter?: BookingStatus
}

export default function AppointmentsCompletedList({
  appointments,
  setAppointments,
  isLoading = false,
  error = null,
  onRetry,
  statusFilter,
}: AppointmentsCompletedListProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [noteForm, setNoteForm] = useState({
    problemSummary: "",
    problemAnalysis: "",
    guides: "",
  })
  const [formErrors, setFormErrors] = useState({
    problemSummary: "",
    guides: "",
  })
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const filteredAppointments = useMemo(() => {
    return statusFilter 
      ? appointments.filter(appointment => appointment.status === statusFilter)
      : appointments
  }, [appointments, statusFilter])

  const openNoteDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setNoteForm({
      problemSummary: appointment.notes?.problemSummary || "",
      problemAnalysis: appointment.notes?.problemAnalysis || "",
      guides: appointment.notes?.guides || "",
    })
    setFormErrors({ problemSummary: "", guides: "" })
    const hasNotes = appointment.notes && 
      (appointment.notes.problemSummary || appointment.notes.problemAnalysis || appointment.notes.guides)
    setIsEditing(!hasNotes)
    setShowNoteDialog(true)
  }

  const validateForm = () => {
    const errors = { problemSummary: "", guides: "" }
    let isValid = true

    if (!noteForm.problemSummary.trim()) {
      errors.problemSummary = "Tóm tắt vấn đề là bắt buộc."
      isValid = false
    }
    if (!noteForm.guides.trim()) {
      errors.guides = "Hướng dẫn là bắt buộc."
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const saveNote = async () => {
    if (!selectedAppointment) return

    if (!validateForm()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ các trường bắt buộc.",
        variant: "destructive",
      })
      return
    }

    try {
      const payload = {
        bookingId: selectedAppointment.id,
        problemSummary: noteForm.problemSummary,
        problemAnalysis: noteForm.problemAnalysis,
        guides: noteForm.guides,
      }

      const response = await bookingService.updateNote(payload)
      if (response.success) {
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === selectedAppointment.id ? { ...appointment, notes: { ...noteForm } } : appointment,
          ),
        )
        toast({
          title: "Thành công",
          description: "Ghi chú đã được lưu thành công.",
        })
        setFormErrors({ problemSummary: "", guides: "" })
      } else {
        toast({
          title: "Lỗi",
          description: response.error || "Không thể lưu ghi chú. Vui lòng thử lại.",
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi lưu ghi chú. Vui lòng kiểm tra kết nối mạng.",
        variant: "destructive",
      })
    }
  }

  const closeNoteDialog = () => {
    setShowNoteDialog(false)
    setSelectedAppointment(null)
    setIsEditing(false)
    setNoteForm({
      problemSummary: "",
      problemAnalysis: "",
      guides: "",
    })
    setFormErrors({ problemSummary: "", guides: "" })
  }

  const renderNoteButton = (appointment: Appointment) => {
    const hasNotes =
      appointment.notes &&
      (appointment.notes.problemSummary || appointment.notes.problemAnalysis || appointment.notes.guides)

    if (hasNotes) {
      return (
        <Button size="sm" variant="outline" onClick={() => openNoteDialog(appointment)} className="gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Xem ghi chú</span>
        </Button>
      )
    }

    return (
      <Button size="sm" variant="outline" onClick={() => openNoteDialog(appointment)} className="gap-2">
        <Edit3 className="h-4 w-4" />
        <span className="hidden sm:inline">Thêm ghi chú</span>
      </Button>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <p className="text-red-600 font-medium">{error}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Tải lại danh sách
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderTableSkeleton = (rows: number, cols: number) => {
    return Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex} className="border-b">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <td key={colIndex} className="p-6 align-middle">
            <Skeleton className="h-4 w-3/4" />
          </td>
        ))}
      </tr>
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách lịch hẹn đã hoàn thành</h1>
          <p className="text-sm text-gray-600 mt-1">Xem và quản lý các buổi tư vấn đã hoàn tất</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{isLoading ? "..." : `${filteredAppointments.length} lịch hẹn`}</span>
          </Badge>
        </div>
      </div>

      <div className="hidden lg:block">
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 border-b">
                  <tr>
                    <th className="h-12 px-6 text-left align-middle font-semibold text-gray-900">Thành viên</th>
                    <th className="h-12 px-6 text-left align-middle font-semibold text-gray-900">Ngày & Giờ</th>
                    <th className="h-12 px-6 text-left align-middle font-semibold text-gray-900">Thời lượng</th>
                    <th className="h-12 px-6 text-left align-middle font-semibold text-gray-900">Loại</th>
                    <th className="h-12 px-6 text-left align-middle font-semibold text-gray-900">Vấn đề</th>
                    <th className="h-12 px-6 text-left align-middle font-semibold text-gray-900">Trạng thái</th>
                    <th className="h-12 px-6 text-left align-middle font-semibold text-gray-900">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && renderTableSkeleton(5, 7)}
                  {!isLoading && filteredAppointments.length > 0
                    ? filteredAppointments.map((appointment, index) => (
                        <tr
                          key={appointment.id}
                          className={`border-b hover:bg-gray-50/50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/20"
                          }`}
                        >
                          <td className="p-6 align-middle">
                            <div className="flex items-center gap-3">
                              {appointment.appointmentType === "couple" ? (
                                <div className="flex -space-x-2">
                                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={appointment.avatar || "/placeholder.svg?height=40&width=40"} />
                                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                      {appointment.member.split(" ")[0][0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={appointment.avatar2 || "/placeholder.svg?height=40&width=40"} />
                                    <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                                      {appointment.member.split(" ")[3]?.[0] || "?"}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              ) : (
                                <Avatar className="h-10 w-10 shadow-sm">
                                  <AvatarImage src={appointment.avatar || "/placeholder.svg?height=40&width=40"} />
                                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                    {appointment.member.split(" ")[0][0]}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">{appointment.member}</span>
                                  {appointment.appointmentType === "couple" && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs font-medium px-2 py-0.5 h-5 bg-purple-50 text-purple-700 border-purple-200"
                                    >
                                      <Users className="h-3 w-3 mr-1" />
                                      Cặp đôi
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-gray-900">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">{appointment.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 align-middle">
                            <span className="font-medium text-gray-900">{appointment.duration}</span>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 rounded-md">
                                <Video className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="text-gray-900">{appointment.type}</span>
                            </div>
                          </td>
                          <td className="p-6 align-middle">
                            <span className="text-gray-700 text-sm leading-relaxed">{appointment.issue}</span>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="text-sm font-medium text-green-700">Đã hoàn thành</span>
                            </div>
                          </td>
                          <td className="p-6 align-middle">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <Link href={`/counselor/appointments/${appointment.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Chi tiết
                                </Link>
                              </Button>
                              {renderNoteButton(appointment)}
                            </div>
                          </td>
                        </tr>
                      ))
                    : !isLoading && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="p-3 bg-gray-100 rounded-full">
                                <Search className="h-6 w-6 text-gray-400" />
                              </div>
                              <div>
                                <p className="text-gray-900 font-medium">Không tìm thấy lịch hẹn</p>
                                <p className="text-gray-500 text-sm">Không có lịch hẹn phù hợp</p>
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
      </div>

      <div className="lg:hidden space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {appointment.appointmentType === "couple" ? (
                      <div className="flex -space-x-2">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={appointment.avatar || "/placeholder.svg?height=40&width=40"} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                            {appointment.member.split(" ")[0][0]}
                          </AvatarFallback>
                        </Avatar>
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={appointment.avatar2 || "/placeholder.svg?height=40&width=40"} />
                          <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                            {appointment.member.split(" ")[3]?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <Avatar className="h-10 w-10 shadow-sm">
                        <AvatarImage src={appointment.avatar || "/placeholder.svg?height=40&width=40"} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                          {appointment.member.split(" ")[0][0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{appointment.member}</h3>
                        {appointment.appointmentType === "couple" && (
                          <Badge
                            variant="outline"
                            className="text-xs font-medium px-2 py-0.5 h-5 bg-purple-50 text-purple-700 border-purple-200"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            Cặp đôi
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200 border font-medium px-2 py-1 text-xs">
                        Đã kết thúc
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{appointment.date}</span>
                    <Clock className="h-4 w-4 text-gray-500 ml-2" />
                    <span className="text-gray-600">{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1 bg-blue-100 rounded">
                      <Video className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-gray-900">{appointment.type}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{appointment.duration}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-700 leading-relaxed">{appointment.issue}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <Link href={`/counselor/appointments/${appointment.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Chi tiết
                    </Link>
                  </Button>
                  {renderNoteButton(appointment)}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Không tìm thấy lịch hẹn</p>
                  <p className="text-gray-500 text-sm">Không có lịch hẹn phù hợp</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AppointmentNoteDialog
        isOpen={showNoteDialog}
        onClose={closeNoteDialog}
        appointment={selectedAppointment}
        noteForm={noteForm}
        setNoteForm={setNoteForm}
        formErrors={formErrors}
        onSave={saveNote}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  )
}