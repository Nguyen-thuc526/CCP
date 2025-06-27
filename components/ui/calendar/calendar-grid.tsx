import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Settings } from "lucide-react"
import type { WorkSchedule } from "@/types/workSchedule"

interface CalendarGridProps {
  selectedDate: Date
  setSelectedDate: (date: Date) => void
  timeSlots: WorkSchedule[]
  setShowSlotDialog: (show: boolean) => void
  setSelectedSlotDetail: (slot: WorkSchedule | null) => void
  setShowSlotDetailDialog: (show: boolean) => void
  showSettingsDialog: boolean
  setShowSettingsDialog: (show: boolean) => void
}

export function CalendarGrid({
  selectedDate,
  setSelectedDate,
  timeSlots,
  setShowSlotDialog,
  setSelectedSlotDetail,
  setShowSlotDetailDialog,
  showSettingsDialog,
  setShowSettingsDialog,
}: CalendarGridProps) {
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

  const getSlotsForDate = (date: Date) => {
    const yyyyMMdd = date.toISOString().split("T")[0]
    const dayOfWeek = date.getDay()

    return timeSlots.filter((slot) => {
      const slotDate = new Date(slot.workDate).toISOString().split("T")[0]
      if (slotDate === yyyyMMdd) return true
      if (slot.isRecurring && slot.dayOfWeek === dayOfWeek) return true
      return false
    })
  }

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

  // Check if a date is within the editable range (today to 7 days in the future)
  const isDateEditable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize to start of day
    const maxEditableDate = new Date(today)
    maxEditableDate.setDate(today.getDate() + 7) // 7 days from today
    return date >= today && date <= maxEditableDate
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Quản lý lịch rảnh
          </CardTitle>
          <div className="flex items-center gap-2">
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
            const isEditable = isDateEditable(day)

            return (
              <div
                key={day.toISOString()}
                className={`p-2 h-24 border rounded-lg transition-colors ${
                  isEditable ? "cursor-pointer hover:bg-muted/50" : "cursor-default opacity-50"
                } ${isToday ? "bg-primary/10 border-primary" : ""}`}
                onClick={() => {
                  if (isEditable) {
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
                        {formatTimeDisplay(slot.startTime)} - {formatTimeDisplay(slot.endTime)} (
                        {formatDuration(slot.startTime, slot.endTime)})
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
  )
}