"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Video, X, MessageSquare, Users, User, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { BookingStatus } from "@/utils/enum"

interface Member {
  id: string
  accountId: string
  fullname: string
  avatar: string | null
  phone: string | null
  status: number
}

interface AppointmentSidebarProps {
  appointmentId: string
  member: Member
  member2: Member | null
  isCouple: boolean
  status: BookingStatus
  hasNotes: boolean
  timeStart: string
  /**
   * Indicates if this is a customer report case (customer reported counselor)
   * When true with Report status, shows refund message instead of view report button
   */
  isReport?: boolean
  onOpenNoteDialog: () => void
  onOpenCancelDialog: () => void
}

const AppointmentSidebar: React.FC<AppointmentSidebarProps> = ({
  appointmentId,
  member,
  member2,
  isCouple,
  status,
  hasNotes,
  timeStart,
  isReport = false,
  onOpenNoteDialog,
  onOpenCancelDialog,
}) => {
  const [timeUntilStart, setTimeUntilStart] = useState<number>(0)
  const [canJoin, setCanJoin] = useState(false)

  useEffect(() => {
    const calculateTimeUntilStart = () => {
      const now = new Date().getTime()
      const appointmentTime = new Date(timeStart).getTime()
      const timeDiff = appointmentTime - now
      const fiveMinutesInMs = 5 * 60 * 1000 // 5 minutes in milliseconds

      setTimeUntilStart(timeDiff)
      setCanJoin(timeDiff <= fiveMinutesInMs)
    }

    calculateTimeUntilStart()

    const interval = setInterval(calculateTimeUntilStart, 1000)

    return () => clearInterval(interval)
  }, [timeStart])

  const formatCountdown = (milliseconds: number) => {
    if (milliseconds <= 0) return "Có thể tham gia"

    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const memberName = member2 ? `${member.fullname} & ${member2.fullname}` : member.fullname

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin {isCouple ? "cặp đôi" : "thành viên"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar || "/placeholder.svg?height=40&width=40" || "/placeholder.svg"} />
              <AvatarFallback>{member.fullname.split(" ")[0][0]}</AvatarFallback>
            </Avatar>
            {isCouple && member2 && (
              <Avatar className="h-12 w-12">
                <AvatarImage src={member2.avatar || "/placeholder.svg?height=40&width=40" || "/placeholder.svg"} />
                <AvatarFallback>{member2.fullname.split(" ")[0][0]}</AvatarFallback>
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
              <p className="text-sm text-muted-foreground">{member.phone || "Không có số điện thoại"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hành động</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {status === BookingStatus.Confirm && (
            <>
              {canJoin ? (
                <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full" asChild>
                  <Link href={`/counselor/appointments/call/${appointmentId}`}>
                    <Video className="mr-2 h-4 w-4" />
                    Tham gia
                  </Link>
                </Button>
              ) : (
                <Button size="sm" className="bg-gray-400 cursor-not-allowed w-full" disabled>
                  <Clock className="mr-2 h-4 w-4" />
                  {formatCountdown(timeUntilStart)}
                </Button>
              )}
              <Button variant="destructive" onClick={onOpenCancelDialog} className="w-full">
                <X className="mr-2 h-4 w-4" />
                Hủy lịch hẹn
              </Button>
            </>
          )}

          {status === BookingStatus.MemberCancel && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Đã hoàn 50% tiền về ví của bạn</span>
              </div>
            </div>
          )}

          {status === BookingStatus.Report && isReport && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Hoàn tiền về khách hàng</span>
              </div>
            </div>
          )}

          {status === BookingStatus.Report && !isReport && (
            <Button
              variant="outline"
              onClick={() => {
                console.log("Xem báo cáo")
              }}
              className="w-full"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Xem báo cáo
            </Button>
          )}

          {status === BookingStatus.Refund && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Đã hoàn tiền về ví của khách hàng</span>
              </div>
            </div>
          )}

          {status === BookingStatus.Finish && (
            <Button variant="outline" onClick={onOpenNoteDialog} className="w-full bg-transparent">
              <MessageSquare className="mr-2 h-4 w-4" />
              {hasNotes ? "Xem/Sửa ghi chú" : "Thêm ghi chú"}
            </Button>
          )}

          {status === BookingStatus.Complete && (
            <Button variant="outline" onClick={onOpenNoteDialog} className="w-full bg-transparent">
              <MessageSquare className="mr-2 h-4 w-4" />
              Xem/Sửa ghi chú
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AppointmentSidebar
