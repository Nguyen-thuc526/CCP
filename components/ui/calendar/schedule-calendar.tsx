
"use client"

import { useState, useEffect } from "react"
import { CalendarGrid } from "./calendar-grid"
import { SlotList } from "./slot-list"
import { SlotDialog } from "./slot-dialog"

import { SlotDetailDialog } from "./slot-detail-dialog"
import { workScheduleService } from "@/services/workScheduleService"
import type { WorkSchedule } from "@/types/workSchedule"
import { useToast, ToastType } from "@/hooks/useToast"
import { SettingsDialog } from "./setting-dialog"

interface ScheduleSettings {
  defaultDuration: number
  bufferTime: number
  maxAdvanceBooking: number
  minAdvanceBooking: number
}

export function ScheduleCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [timeSlots, setTimeSlots] = useState<WorkSchedule[]>([])
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    defaultDuration: 60,
    bufferTime: 15,
    maxAdvanceBooking: 30,
    minAdvanceBooking: 24,
  })
  const [selectedSlotDetail, setSelectedSlotDetail] = useState<WorkSchedule | null>(null)
  const [showSlotDetailDialog, setShowSlotDetailDialog] = useState(false)
  const [showSlotDialog, setShowSlotDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
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

  const deleteWorkSchedule = async (scheduleId: string) => {
    await workScheduleService.deleteWorkSchedule(scheduleId);
  };

  return (
    <div className="space-y-6">
      <CalendarGrid
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        timeSlots={timeSlots}
        setShowSlotDialog={setShowSlotDialog}
        setSelectedSlotDetail={setSelectedSlotDetail}
        setShowSlotDetailDialog={setShowSlotDetailDialog}
        showSettingsDialog={showSettingsDialog}
        setShowSettingsDialog={setShowSettingsDialog}
      />
      <SlotList
        selectedDate={selectedDate}
        timeSlots={timeSlots}
        deleteWorkSchedule={deleteWorkSchedule}
        setTimeSlots={setTimeSlots}
        setShowSlotDialog={setShowSlotDialog}
      />
      <SlotDialog
        open={showSlotDialog}
        onOpenChange={setShowSlotDialog}
        selectedDate={selectedDate}
        onSubmit={fetchSchedules}
      />
      <SettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        scheduleSettings={scheduleSettings}
        setScheduleSettings={setScheduleSettings}
      />
      <SlotDetailDialog
        open={showSlotDetailDialog}
        onOpenChange={setShowSlotDetailDialog}
        selectedSlotDetail={selectedSlotDetail}
        setTimeSlots={setTimeSlots}
        deleteWorkSchedule={deleteWorkSchedule}
      />
    </div>
  )
}
