"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, User, Video, Clock, FileText } from "lucide-react"

interface CallHeaderProps {
  roomName: string
  userName: string
  callStartTime: Date
  onFinishClick: () => void
  onNotesClick: () => void
  isNotesOpen?: boolean
}

export default function CallHeader({
  roomName,
  userName,
  callStartTime,
  onFinishClick,
  onNotesClick,
  isNotesOpen = false,
}: CallHeaderProps) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Video className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-1 sm:gap-2 truncate">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                <span className="truncate">{roomName}</span>
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Tư vấn viên: {userName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span>Bắt đầu: {callStartTime.toLocaleTimeString("vi-VN")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse" />
              Đang kết nối
            </Badge>

            <div className="flex gap-1 sm:gap-2 flex-1 sm:flex-initial">
              <Button
                onClick={onNotesClick}
                variant={isNotesOpen ? "default" : "outline"}
                size="sm"
                className={
                  isNotesOpen
                    ? "bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-3"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 text-xs sm:text-sm px-2 sm:px-3"
                }
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Ghi chú cuộc gọi</span>
              </Button>

              <Button
                onClick={onFinishClick}
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm px-2 sm:px-3"
              >
                <PhoneOff className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Kết thúc cuộc gọi</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
