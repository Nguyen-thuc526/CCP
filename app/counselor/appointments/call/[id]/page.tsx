"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { bookingService } from "@/services/bookingService"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Phone, PhoneOff, User, Video, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface CallPageProps {
  params: Promise<{ id: string }>
}

export default function CallPage({ params }: CallPageProps) {
  const router = useRouter()
  const [joinUrl, setJoinUrl] = useState<string | null>(null)
  const [roomName, setRoomName] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [appointmentId, setAppointmentId] = useState<string>("")
  const [showFinishDialog, setShowFinishDialog] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [callStartTime] = useState(new Date())

  useEffect(() => {
    const fetchRoomUrl = async () => {
      const { id } = await params
      setAppointmentId(id)
      try {
        const response = await bookingService.getRoomUrl(id)
        if (response.success) {
          const { joinUrl, roomName, userName } = response.data
          const encodedUserName = encodeURIComponent(userName)
          setJoinUrl(`${joinUrl}?userName=${encodedUserName}`)
          setRoomName(roomName)
          setUserName(userName)
        } else {
          toast({
            title: "Lỗi",
            description: "Không thể tải phòng gọi. Vui lòng thử lại.",
            variant: "destructive",
          })
          router.back()
        }
      } catch (error) {
        console.error("Failed to fetch room URL:", error)
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi khi tải phòng gọi.",
          variant: "destructive",
        })
        router.back()
      }
    }
    fetchRoomUrl()
  }, [params, router])

  const handleFinishClick = () => {
    setShowFinishDialog(true)
  }

  const handleConfirmFinish = async () => {
    setIsFinishing(true)
    try {
      const response = await bookingService.finishBooking(appointmentId)
      if (response.success) {
        toast({
          title: "Thành công",
          description: "Cuộc gọi đã được kết thúc thành công.",
        })
        router.push("/counselor/appointments")
      } else {
        toast({
          title: "Lỗi",
          description: response.error || "Không thể kết thúc cuộc gọi. Vui lòng thử lại.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Finish failed:", error)
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi kết thúc cuộc gọi.",
        variant: "destructive",
      })
    } finally {
      setIsFinishing(false)
      setShowFinishDialog(false)
    }
  }

  const formatCallDuration = () => {
    const now = new Date()
    const duration = Math.floor((now.getTime() - callStartTime.getTime()) / 1000 / 60)
    return `${duration} phút`
  }

  if (!joinUrl) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[600px] w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-500" />
                  {roomName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Tư vấn viên: {userName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Bắt đầu: {callStartTime.toLocaleTimeString("vi-VN")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Đang kết nối
              </Badge>
              <Button onClick={handleFinishClick} variant="destructive" className="bg-red-600 hover:bg-red-700">
                <PhoneOff className="mr-2 h-4 w-4" />
                Kết thúc cuộc gọi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Call Interface */}
      <div className="max-w-7xl mx-auto p-4">
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="relative">
              <iframe
                src={joinUrl}
                title="Call Room"
                className="w-full h-[700px] rounded-lg"
                frameBorder="0"
                allow="microphone; camera; display-capture"
                allowFullScreen
              />

              {/* Overlay controls */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <div className="text-white text-sm font-medium">Thời gian: {formatCallDuration()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finish Confirmation Dialog */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PhoneOff className="h-5 w-5 text-red-600" />
              Kết thúc cuộc gọi
            </DialogTitle>
            <DialogDescription className="text-left">
              Bạn có chắc chắn muốn kết thúc cuộc gọi tư vấn này không?
              <br />
              <br />
              <strong>Lưu ý:</strong> Sau khi kết thúc, bạn sẽ không thể tiếp tục cuộc gọi này nữa.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 rounded-lg p-4 my-4">
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Phòng gọi:</span>
                <span className="font-medium">{roomName}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian gọi:</span>
                <span className="font-medium">{formatCallDuration()}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFinishDialog(false)} disabled={isFinishing}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmFinish}
              disabled={isFinishing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isFinishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang kết thúc...
                </>
              ) : (
                <>
                  <PhoneOff className="mr-2 h-4 w-4" />
                  Kết thúc cuộc gọi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
