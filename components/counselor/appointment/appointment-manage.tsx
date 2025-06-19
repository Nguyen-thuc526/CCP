"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, History } from "lucide-react"
import { AppointmentHistory } from "@/components/counselor/appointment/appointment-history"
import AppointmentsList from "./appointment-list"
import { bookingService } from "@/services/bookingService"
import { parseISO, format, differenceInMinutes } from "date-fns"
import { useErrorLoadingWithUI } from "@/hooks/useErrorLoading"


interface Appointment {
  id: string
  member: string
  avatar: string
  avatar2?: string
  date: string
  time: string
  duration: string
  type: string
  status: "Đã lên lịch" | "Đã hủy" | "Đã hoàn thành"
  issue: string
  notes?: string
  canCancel: boolean
  cancellationReason?: string
  requestedAt?: string
  appointmentType: "couple" | "individual"
  additionalInfo?: string
}

interface Booking {
  id: string
  note: string | null
  timeStart: string
  timeEnd: string
  status: number
  member: {
    id: string
    accountId: string
    fullname: string
    avatar: string | null
  }
  member2: {
    id: string
    accountId: string
    fullname: string
    avatar: string | null
  } | null
  subCategories: { id: string; name: string; status: number }[]
}

interface BookingResponse {
  success: boolean
  data: Booking[]
  error: string | null
}

export default function AppointmentsManage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Sử dụng hook loading
  const { loading, error, startLoading, stopLoading, setErrorMessage } = useErrorLoadingWithUI()

  const fetchBookings = async () => {
    try {
      startLoading()
      const response: BookingResponse = await bookingService.getMyBookings()
      if (response.success) {
        const mappedAppointments: Appointment[] = response.data.map((booking) => {
          const startDate = parseISO(booking.timeStart)
          const endDate = parseISO(booking.timeEnd)
          const duration = differenceInMinutes(endDate, startDate)

          return {
            id: booking.id,
            member: booking.member2
              ? `${booking.member.fullname} & ${booking.member2.fullname}`
              : booking.member.fullname,
            avatar: booking.member.avatar || "/placeholder.svg?height=40&width=40",
            avatar2: booking.member2?.avatar || (booking.member2 ? "/placeholder.svg?height=40&width=40" : undefined),
            date: format(startDate, "dd/MM/yyyy"),
            time: format(startDate, "HH:mm"),
            duration: `${duration} phút`,
            type: "Cuộc gọi video",
            status: booking.status === 1 ? "Đã lên lịch" : "Đã hoàn thành",
            issue: booking.subCategories.map((sub) => sub.name).join(", ") || "Không xác định",
            notes: booking.note || undefined,
            canCancel: booking.status === 1,
            requestedAt: format(new Date(), "dd/MM/yyyy"),
            appointmentType: booking.member2 ? "couple" : "individual",
            additionalInfo: booking.note || undefined,
          }
        })
        setAppointments(mappedAppointments)
      } else {
        setErrorMessage("Không thể tải danh sách lịch hẹn. Vui lòng thử lại.")
      }
    } catch (err) {
      setErrorMessage("Đã xảy ra lỗi khi tải lịch hẹn. Vui lòng kiểm tra kết nối mạng.")
    } finally {
      stopLoading()
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <TabsList>
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Lịch hẹn sắp tới
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Lịch sử
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <AppointmentsList
          appointments={appointments}
          setAppointments={setAppointments}
          isLoading={loading}
          error={error}
          onRetry={fetchBookings}
        />
      </TabsContent>

      <TabsContent value="history">
        <AppointmentHistory />
      </TabsContent>
    </Tabs>
  )
}
