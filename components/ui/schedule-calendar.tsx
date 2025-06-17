"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, X, Settings, Edit3, Save, CheckCircle, Repeat, FileText, Timer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { useToast, ToastType } from "@/hooks/useToast"

import { workScheduleService } from "@/services/workScheduleService"
import type { WorkSchedule } from "@/types/workSchedule"

interface ScheduleSettings {
  defaultDuration: number
  bufferTime: number
  maxAdvanceBooking: number
  minAdvanceBooking: number
}

export function ScheduleCalendar() {
  const [selectedSlotDetail, setSelectedSlotDetail] = useState<WorkSchedule | null>(null)
  const [showSlotDetailDialog, setShowSlotDetailDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showSlotDialog, setShowSlotDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    defaultDuration: 60,
    bufferTime: 15,
    maxAdvanceBooking: 30,
    minAdvanceBooking: 24,
  })
  const [timeSlots, setTimeSlots] = useState<WorkSchedule[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      const res = await workScheduleService.getMySchedules()
      if (res.success && Array.isArray(res.data)) {
        setTimeSlots(res.data)
      } else {
        setTimeSlots([])
        console.warn("Fetched data is not an array:", res)
      }
    } catch (error: any) {
      console.error("Error fetching schedules:", error.message)
      showToast("Không thể tải danh sách lịch rảnh.", ToastType.Error)
      setTimeSlots([])
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split(".")[0] + "Z"
  }

  const getSlotsForDate = (date: Date) => {
    const yyyyMMdd = date.toISOString().split("T")[0]
    const dayOfWeek = date.getDay()

    return (timeSlots || []).filter((slot) => {
      const slotDate = new Date(slot.workDate).toISOString().split("T")[0]
      if (slotDate === yyyyMMdd) return true
      if (slot.isRecurring && slot.dayOfWeek === dayOfWeek) return true
      return false
    })
  }

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(diffMins / 60)
    const minutes = diffMins % 60

    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  const handleSubmit = async (
    values: {
      startTime: string
      endTime: string
      description: string
      isRecurring: boolean
    },
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void },
  ) => {
    try {
      const buildDateTime = (date: Date, timeStr: string): Date => {
        const [hh, mm] = timeStr.split(":").map(Number)
        const d = new Date(date)
        d.setHours(hh, mm, 0, 0)
        return d
      }

      const formatDateLocal = (date: Date): string => {
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, "0")
        const dd = String(date.getDate()).padStart(2, "0")
        const hh = String(date.getHours()).padStart(2, "0")
        const mi = String(date.getMinutes()).padStart(2, "0")
        const ss = String(date.getSeconds()).padStart(2, "0")
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`
      }

      const startDate = buildDateTime(selectedDate, values.startTime)
      const endDate = buildDateTime(selectedDate, values.endTime)

      const workDate = formatDateLocal(startDate).split("T")[0] + "T00:00:00"

      const newSlot: WorkSchedule = {
        workDate,
        startTime: formatDateLocal(startDate),
        endTime: formatDateLocal(endDate),
        description: values.description || undefined,
      }

      const res = await workScheduleService.setWorkSchedule(newSlot)
      showToast("Đặt lịch rảnh thành công!", ToastType.Success)
      fetchSchedules()
      resetForm()
      setShowSlotDialog(false)
    } catch (error: any) {
      console.error("Work schedule error:", error.message)
      showToast(error.message || "Đặt lịch rảnh thất bại.", ToastType.Error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (
    values: {
      startTime: string
      endTime: string
      description: string
      isRecurring: boolean
    },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      if (!selectedSlotDetail) return

      // Simulate edit (no API yet)
      const updatedSlot: WorkSchedule = {
        ...selectedSlotDetail,
        startTime: values.startTime,
        endTime: values.endTime,
        description: values.description || undefined,
        isRecurring: values.isRecurring,
      }

      setTimeSlots((prev) => prev.map((slot) => (slot.id === updatedSlot.id ? updatedSlot : slot)))
      showToast("Cập nhật lịch thành công!", ToastType.Success)
      setIsEditing(false)
      setShowSlotDetailDialog(false)
    } catch (error: any) {
      console.error("Edit schedule error:", error.message)
      showToast("Cập nhật lịch thất bại.", ToastType.Error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = () => {
    if (!selectedSlotDetail) return
    // Simulate delete (no API yet)
    setTimeSlots((prev) => prev.filter((slot) => slot.id !== selectedSlotDetail.id))
    showToast("Xóa lịch thành công!", ToastType.Success)
    setShowSlotDetailDialog(false)
  }

  const removeTimeSlot = (slotId: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== slotId))
  }

  const generateRecurringSlots = () => {
    console.log("Generating recurring slots...")
  }

  return (
    <div className="space-y-6">
      {/* Header with Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quản lý lịch rảnh
            </CardTitle>
            <div className="flex items-center gap-2">
              <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Cài đặt
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cài đặt lịch làm việc</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-duration">Thời lượng mặc định (phút)</Label>
                      <Select
                        value={scheduleSettings.defaultDuration.toString()}
                        onValueChange={(value) =>
                          setScheduleSettings((prev) => ({
                            ...prev,
                            defaultDuration: Number.parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 phút</SelectItem>
                          <SelectItem value="45">45 phút</SelectItem>
                          <SelectItem value="60">60 phút</SelectItem>
                          <SelectItem value="90">90 phút</SelectItem>
                          <SelectItem value="120">120 phút</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buffer-time">Thời gian nghỉ giữa các buổi (phút)</Label>
                      <Select
                        value={scheduleSettings.bufferTime.toString()}
                        onValueChange={(value) =>
                          setScheduleSettings((prev) => ({
                            ...prev,
                            bufferTime: Number.parseInt(value),
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Không nghỉ</SelectItem>
                          <SelectItem value="5">5 phút</SelectItem>
                          <SelectItem value="10">10 phút</SelectItem>
                          <SelectItem value="15">15 phút</SelectItem>
                          <SelectItem value="30">30 phút</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-advance">Cho phép đặt lịch trước tối đa (ngày)</Label>
                      <Input
                        id="max-advance"
                        type="number"
                        value={scheduleSettings.maxAdvanceBooking}
                        onChange={(e) =>
                          setScheduleSettings((prev) => ({
                            ...prev,
                            maxAdvanceBooking: Number.parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-advance">Yêu cầu đặt lịch trước tối thiểu (giờ)</Label>
                      <Input
                        id="min-advance"
                        type="number"
                        value={scheduleSettings.minAdvanceBooking}
                        onChange={(e) =>
                          setScheduleSettings((prev) => ({
                            ...prev,
                            minAdvanceBooking: Number.parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                        Hủy
                      </Button>
                      <Button onClick={() => setShowSettingsDialog(false)}>Lưu cài đặt</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setMonth(newDate.getMonth() - 1)
                  setSelectedDate(newDate)
                }}
              >
                ←
              </Button>
              <span className="font-medium min-w-[200px] text-center">
                Tháng {selectedDate.getMonth() + 1}, {selectedDate.getFullYear()}
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  const newDate = new Date(selectedDate)
                  newDate.setMonth(newDate.getMonth() + 1)
                  setSelectedDate(newDate)
                }}
              >
                →
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
              <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(selectedDate).map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2 h-24"></div>
              }
              const daySlots = getSlotsForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()
              const isPast = day < new Date()
              return (
                <div
                  key={day.toISOString()}
                  className={`p-2 h-24 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                    isToday ? "bg-primary/10 border-primary" : ""
                  } ${isPast ? "opacity-50" : ""}`}
                  onClick={() => {
                    if (!isPast) {
                      setSelectedDate(day)
                      setShowSlotDialog(true)
                    }
                  }}
                >
                  <div className="font-medium text-sm">{day.getDate()}</div>
                  <div className="space-y-1 mt-1">
                    {daySlots.slice(0, 2).map((slot) => (
                      <div
                        key={slot.id}
                        className="text-xs p-1 rounded bg-green-100 text-green-800 flex items-center justify-between cursor-pointer hover:bg-green-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSlotDetail(slot)
                          setShowSlotDetailDialog(true)
                        }}
                      >
                        <span>
                          {new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {slot.isRecurring && (
                          <Badge variant="outline" className="text-xs px-1">
                            R
                          </Badge>
                        )}
                      </div>
                    ))}
                    {daySlots.length > 2 && (
                      <div className="text-xs text-muted-foreground">+{daySlots.length - 2} khác</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Lịch rảnh ngày {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm khung giờ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm khung giờ rảnh</DialogTitle>
                </DialogHeader>
                <Formik
                  initialValues={{
                    workDate: "",
                    startTime: "",
                    endTime: "",
                    description: "",
                    isRecurring: false,
                  }}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, values }) => (
                    <Form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-time">Giờ bắt đầu</Label>
                          <Field as={Input} id="start-time" name="startTime" type="time" value={values.startTime} />
                          <ErrorMessage name="startTime" component="p" className="text-red-500 text-sm" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-time">Giờ kết thúc</Label>
                          <Field as={Input} id="end-time" name="endTime" type="time" value={values.endTime} />
                          <ErrorMessage name="endTime" component="p" className="text-red-500 text-sm" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Field as={Input} id="description" name="description" placeholder="Nhập mô tả (tùy chọn)" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="recurring" name="isRecurring" />
                        <Label htmlFor="recurring">Lặp lại hàng tuần</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowSlotDialog(false)}>
                          Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Đang xử lý..." : "Thêm"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getSlotsForDate(selectedDate).map((slot) => (
              <Card key={slot.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {new Date(slot.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {new Date(slot.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {slot.isRecurring && <Badge variant="outline">Lặp lại hàng tuần</Badge>}
                    {slot.description && <Badge variant="secondary">{slot.description}</Badge>}
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Trống
                    </Badge>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => removeTimeSlot(slot.id)}>
                    <X className="mr-2 h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </Card>
            ))}
            {getSlotsForDate(selectedDate).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Chưa có khung giờ nào. Nhấn 'Thêm khung giờ' để tạo lịch rảnh.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Schedule Detail Dialog */}
      <Dialog
        open={showSlotDetailDialog}
        onOpenChange={(open) => {
          setShowSlotDetailDialog(open)
          if (!open) setIsEditing(false)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {isEditing ? "Chỉnh sửa lịch rảnh" : "Chi tiết lịch rảnh"}
              </DialogTitle>
              {!isEditing && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Có sẵn
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedSlotDetail && (
            <div className="space-y-6">
              {!isEditing ? (
                // View Mode - Enhanced Design
                <div className="space-y-6">
                  {/* Time Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-blue-900">Thời gian</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-sm text-blue-700">Bắt đầu</Label>
                        <p className="text-lg font-medium text-blue-900">
                          {new Date(selectedSlotDetail.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm text-blue-700">Kết thúc</Label>
                        <p className="text-lg font-medium text-blue-900">
                          {new Date(selectedSlotDetail.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">Thời lượng:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {formatDuration(selectedSlotDetail.startTime, selectedSlotDetail.endTime)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <FileText className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-purple-900">Mô tả</h3>
                    </div>
                    <p className="text-purple-800 bg-white/50 rounded p-3 min-h-[60px] flex items-center">
                      {selectedSlotDetail.description || (
                        <span className="text-purple-500 italic">Không có mô tả cụ thể</span>
                      )}
                    </p>
                  </div>

                  {/* Status Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <Repeat className="h-4 w-4 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-green-900">Trạng thái lặp lại</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedSlotDetail.isRecurring ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          Lặp lại hàng tuần
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600">
                          Chỉ một lần
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setShowSlotDetailDialog(false)} className="min-w-[100px]">
                      Đóng
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(true)}
                      className="min-w-[100px] flex items-center gap-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      className="min-w-[100px] flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Xóa
                    </Button>
                  </div>
                </div>
              ) : (
                // Edit Mode - Enhanced Form
                <Formik
                  initialValues={{
                    startTime: new Date(selectedSlotDetail.startTime).toTimeString().slice(0, 5),
                    endTime: new Date(selectedSlotDetail.endTime).toTimeString().slice(0, 5),
                    description: selectedSlotDetail.description || "",
                    isRecurring: selectedSlotDetail.isRecurring || false,
                  }}
                  onSubmit={handleEditSubmit}
                >
                  {({ isSubmitting, values }) => (
                    <Form className="space-y-6">
                      {/* Time Input Section */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-blue-900">Chỉnh sửa thời gian</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="start-time" className="text-blue-700 font-medium">
                              Giờ bắt đầu
                            </Label>
                            <Field
                              as={Input}
                              id="start-time"
                              name="startTime"
                              type="time"
                              value={values.startTime}
                              className="bg-white border-blue-200 focus:border-blue-400"
                            />
                            <ErrorMessage
                              name="startTime"
                              component="p"
                              className="text-red-500 text-sm flex items-center gap-1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="end-time" className="text-blue-700 font-medium">
                              Giờ kết thúc
                            </Label>
                            <Field
                              as={Input}
                              id="end-time"
                              name="endTime"
                              type="time"
                              value={values.endTime}
                              className="bg-white border-blue-200 focus:border-blue-400"
                            />
                            <ErrorMessage
                              name="endTime"
                              component="p"
                              className="text-red-500 text-sm flex items-center gap-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description Input Section */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <h3 className="font-semibold text-purple-900">Mô tả</h3>
                        </div>
                        <div className="space-y-2">
                          <Field
                            as={Input}
                            id="description"
                            name="description"
                            placeholder="Nhập mô tả cho khung giờ này..."
                            value={values.description}
                            className="bg-white border-purple-200 focus:border-purple-400"
                          />
                        </div>
                      </div>

                      {/* Recurring Toggle Section */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Repeat className="h-4 w-4 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-green-900">Tùy chọn lặp lại</h3>
                        </div>
                        <div className="flex items-center space-x-3 bg-white/50 rounded p-3">
                          <Field as={Switch} id="isRecurring" name="isRecurring" checked={values.isRecurring} />
                          <Label htmlFor="isRecurring" className="text-green-800 font-medium">
                            Lặp lại hàng tuần
                          </Label>
                        </div>
                      </div>

                      <Separator />

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="min-w-[100px]">
                          Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="min-w-[100px] flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
