"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Formik, Form, Field, ErrorMessage } from "formik"
import { Calendar, Clock, CheckCircle, Repeat, FileText, Timer, Edit3, Save, X } from "lucide-react"
import type { WorkSchedule } from "@/types/workSchedule"
import { useToast, ToastType } from "@/hooks/useToast"

interface SlotDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSlotDetail: WorkSchedule | null
  setTimeSlots: (slots: WorkSchedule[]) => void
  deleteWorkSchedule: (scheduleId: string) => Promise<void>
}

const HOUR_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6
  return { value: hour.toString(), label: `${hour}h` }
})

export function SlotDetailDialog({
  open,
  onOpenChange,
  selectedSlotDetail,
  setTimeSlots,
  deleteWorkSchedule,
}: SlotDetailDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { showToast } = useToast()

  const formatTimeDisplay = (timeString: string) => {
    const date = new Date(timeString)
    const hours = date.getHours()
    return `${hours}h`
  }

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    return `${diffHours}h`
  }

  // Check if the schedule is in the past
  const isPastSchedule = (schedule: WorkSchedule | null) => {
    if (!schedule) return true
    const scheduleDate = new Date(schedule.workDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return scheduleDate < today
  }

  const handleEditSubmit = async (
    values: {
      startHour: string
      endHour: string
      description: string
      isRecurring: boolean
    },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      if (!selectedSlotDetail) return

      const buildDateTime = (date: Date, hour: string): Date => {
        const d = new Date(date)
        d.setHours(Number.parseInt(hour), 0, 0, 0)
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

      const workDate = new Date(selectedSlotDetail.workDate)
      const startDate = buildDateTime(workDate, values.startHour)
      const endDate = buildDateTime(workDate, values.endHour)

      const updatedSlot: WorkSchedule = {
        ...selectedSlotDetail,
        startTime: formatDateLocal(startDate),
        endTime: formatDateLocal(endDate),
        description: values.description || undefined,
        isRecurring: values.isRecurring,
      }

      setTimeSlots((prev) => prev.map((slot) => (slot.id === updatedSlot.id ? updatedSlot : slot)))
      showToast("Cập nhật lịch thành công!", ToastType.Success)
      setIsEditing(false)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Edit schedule error:", error.message)
      showToast("Cập nhật lịch thất bại.", ToastType.Error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedSlotDetail) return
    try {
      await deleteWorkSchedule(selectedSlotDetail.id)
      setTimeSlots((prev) => prev.filter((slot) => slot.id !== selectedSlotDetail.id))
      showToast("Xóa lịch thành công!", ToastType.Success)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error deleting schedule:", error.message)
      showToast("Xóa lịch thất bại.", ToastType.Error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) setIsEditing(false)
      }}
    >
      <DialogContent aria-describedby="slot-detail-description" className="max-w-2xl">
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
        <p id="slot-detail-description" className="sr-only">
          {isEditing ? "Form để chỉnh sửa chi tiết lịch rảnh" : "Chi tiết thông tin lịch rảnh"}
        </p>

        {selectedSlotDetail && (
          <div className="space-y-6">
            {!isEditing ? (
              <div className="space-y-6">
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
                        {formatTimeDisplay(selectedSlotDetail.startTime)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-blue-700">Kết thúc</Label>
                      <p className="text-lg font-medium text-blue-900">
                        {formatTimeDisplay(selectedSlotDetail.endTime)}
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

                {isPastSchedule(selectedSlotDetail) && (
                  <div className="text-sm text-muted-foreground italic">
                    Lịch trong quá khứ chỉ có thể xem, không thể chỉnh sửa hoặc xóa.
                  </div>
                )}

                <Separator />

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)} className="min-w-[100px]">
                    Đóng
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                    className="min-w-[100px] flex items-center gap-2"
                    disabled={isPastSchedule(selectedSlotDetail)}
                  >
                    <Edit3 className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="min-w-[100px] flex items-center gap-2"
                    disabled={isPastSchedule(selectedSlotDetail)}
                  >
                    <X className="h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </div>
            ) : (
              <Formik
                initialValues={{
                  startHour: new Date(selectedSlotDetail.startTime).getHours().toString(),
                  endHour: new Date(selectedSlotDetail.endTime).getHours().toString(),
                  description: selectedSlotDetail.description || "",
                  isRecurring: selectedSlotDetail.isRecurring || false,
                }}
                validate={(values) => {
                  const errors: any = {}
                  if (!values.startHour) {
                    errors.startHour = "Vui lòng chọn giờ bắt đầu"
                  }
                  if (!values.endHour) {
                    errors.endHour = "Vui lòng chọn giờ kết thúc"
                  }
                  if (
                    values.startHour &&
                    values.endHour &&
                    Number.parseInt(values.startHour) >= Number.parseInt(values.endHour)
                  ) {
                    errors.endHour = "Giờ kết thúc phải sau giờ bắt đầu"
                  }
                  return errors
                }}
                onSubmit={handleEditSubmit}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-blue-900">Chỉnh sửa thời gian</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-hour" className="text-blue-700 font-medium">
                            Giờ bắt đầu
                          </Label>
                          <Select
                            value={values.startHour}
                            onValueChange={(value) => setFieldValue("startHour", value)}
                          >
                            <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400">
                              <SelectValue placeholder="Chọn giờ bắt đầu" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOUR_OPTIONS.map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <ErrorMessage
                            name="startHour"
                            component="p"
                            className="text-red-500 text-sm flex items-center gap-1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-hour" className="text-blue-700 font-medium">
                            Giờ kết thúc
                          </Label>
                          <Select value={values.endHour} onValueChange={(value) => setFieldValue("endHour", value)}>
                            <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400">
                              <SelectValue placeholder="Chọn giờ kết thúc" />
                            </SelectTrigger>
                            <SelectContent>
                              {HOUR_OPTIONS.filter(
                                (hour) => Number.parseInt(hour.value) > Number.parseInt(values.startHour || "0"),
                              ).map((hour) => (
                                <SelectItem key={hour.value} value={hour.value}>
                                  {hour.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <ErrorMessage
                            name="endHour"
                            component="p"
                            className="text-red-500 text-sm flex items-center gap-1"
                          />
                        </div>
                      </div>
                    </div>

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

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Repeat className="h-4 w-4 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-green-900">Tùy chọn lặp lại</h3>
                      </div>
                      <div className="flex items-center space-x-3 bg-white/50 rounded p-3">
                        <Field
                          as={Switch}
                          id="isRecurring"
                          name="isRecurring"
                          checked={values.isRecurring}
                          onCheckedChange={(checked: boolean) => setFieldValue("isRecurring", checked)}
                        />
                        <Label htmlFor="isRecurring" className="text-green-800 font-medium">
                          Lặp lại hàng tuần
                        </Label>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="min-w-[100px]"
                      >
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
  )
}