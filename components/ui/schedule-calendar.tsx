"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, X, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface TimeSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isRecurring: boolean
  dayOfWeek?: number
}

interface ScheduleSettings {
  defaultDuration: number
  bufferTime: number
  maxAdvanceBooking: number
  minAdvanceBooking: number
}

export function ScheduleCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showSlotDialog, setShowSlotDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [newSlot, setNewSlot] = useState({
    startTime: "",
    endTime: "",
    isRecurring: false,
  })

  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    defaultDuration: 60,
    bufferTime: 15,
    maxAdvanceBooking: 30,
    minAdvanceBooking: 24,
  })

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "10:00",
      isRecurring: false,
    },
    {
      id: "2",
      date: "2024-01-15",
      startTime: "14:00",
      endTime: "15:30",
      isRecurring: false,
    },
    {
      id: "3",
      date: "2024-01-16",
      startTime: "10:00",
      endTime: "11:00",
      isRecurring: true,
      dayOfWeek: 2, // Tuesday
    },
  ])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getSlotsForDate = (date: Date) => {
    const dateString = getDateString(date)
    const dayOfWeek = date.getDay()

    return timeSlots.filter((slot) => {
      // Regular slots for specific date
      if (slot.date === dateString) return true

      // Recurring slots for this day of week
      if (slot.isRecurring && slot.dayOfWeek === dayOfWeek) return true

      return false
    })
  }

  const addTimeSlot = () => {
    if (newSlot.startTime && newSlot.endTime) {
      const slot: TimeSlot = {
        id: Date.now().toString(),
        date: getDateString(selectedDate),
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        isRecurring: newSlot.isRecurring,
        dayOfWeek: newSlot.isRecurring ? selectedDate.getDay() : undefined,
      }
      setTimeSlots([...timeSlots, slot])
      setNewSlot({ startTime: "", endTime: "", isRecurring: false })
      setShowSlotDialog(false)
    }
  }

  const removeTimeSlot = (slotId: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== slotId))
  }

  const generateRecurringSlots = () => {
    // Logic to generate recurring slots for the next few months
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
                          setScheduleSettings((prev) => ({ ...prev, defaultDuration: Number.parseInt(value) }))
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
                          setScheduleSettings((prev) => ({ ...prev, bufferTime: Number.parseInt(value) }))
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
          {/* Calendar Grid */}
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
                  className={`p-2 h-24 border rounded-lg cursor-pointer hover:bg-muted/50 ${
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
                        className="text-xs p-1 rounded bg-green-100 text-green-800 flex items-center justify-between"
                      >
                        <span>{slot.startTime}</span>
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
            <Dialog open={showSlotDialog} onOpenChange={setShowSlotDialog}>
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
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Giờ bắt đầu</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot((prev) => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">Giờ kết thúc</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot((prev) => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recurring"
                      checked={newSlot.isRecurring}
                      onCheckedChange={(checked) => setNewSlot((prev) => ({ ...prev, isRecurring: checked }))}
                    />
                    <Label htmlFor="recurring">Lặp lại hàng tuần</Label>
                  </div>

                  {newSlot.isRecurring && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Khung giờ này sẽ lặp lại vào thứ{" "}
                        {selectedDate.getDay() === 0 ? "Chủ nhật" : `${selectedDate.getDay() + 1}`} hàng tuần
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowSlotDialog(false)}>
                      Hủy
                    </Button>
                    <Button onClick={addTimeSlot}>Thêm</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getSlotsForDate(selectedDate).map((slot) => (
              <Card key={slot.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>

                    {slot.isRecurring && <Badge variant="outline">Lặp lại hàng tuần</Badge>}

                    <Badge variant="secondary">Trống</Badge>
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
    </div>
  )
}
