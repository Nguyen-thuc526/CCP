// VideoRoom.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
} from "@livekit/components-react"
import "@livekit/components-styles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, UserX } from "lucide-react"

interface VideoRoomProps {
  roomName: string
  participantName: string
  token: string
  serverUrl: string
}

interface FeedbackModalProps {
  visible: boolean
  roomName: string
  onClose: () => void
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ visible, roomName, onClose }) => {
  if (!visible) return null
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Đánh giá cuộc gọi</CardTitle>
          <CardDescription>Vui lòng gửi đánh giá cho cuộc gọi với ID: {roomName}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Form đánh giá sẽ được thêm vào đây.</p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onClose}>Gửi</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function VideoRoom({ roomName, participantName, token, serverUrl }: VideoRoomProps) {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (!token) {
      console.error("Error: No token provided for LiveKit connection")
      setError("Không thể kết nối đến phòng họp do thiếu token. Vui lòng thử lại.")
      setIsConnecting(false)
    } else if (!roomName || !participantName) {
      console.error("Error: Missing roomName or participantName", { roomName, participantName })
      setError("Thông tin phòng hoặc người tham gia không hợp lệ. Vui lòng thử lại.")
      setIsConnecting(false)
    } else if (!serverUrl) {
      console.error("Error: Missing serverUrl")
      setError("Không thể kết nối do thiếu URL máy chủ. Vui lòng thử lại.")
      setIsConnecting(false)
    } else {
      console.log("Attempting to connect to LiveKit room:", { roomName, participantName, serverUrl })
    }
  }, [token, roomName, participantName, serverUrl])

  const handleDisconnect = () => {
    console.log("Disconnecting from room:", { roomName, participantName })
    setShowFeedback(true)
  }

  const handleFeedbackSubmitted = () => {
    setShowFeedback(false)
    router.push("/mybooking")
  }

  if (isConnecting) {
    console.log("Connecting to LiveKit room:", { roomName, participantName, serverUrl })
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center">Đang kết nối...</CardTitle>
            <CardDescription className="text-center">Đang thiết lập kết nối đến phòng họp</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !token || !serverUrl) {
    console.error("VideoRoom error state:", { error, token: token ? "Token present" : "Token missing", serverUrl: serverUrl ? "ServerUrl present" : "ServerUrl missing" })
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Lỗi kết nối</CardTitle>
            <CardDescription className="text-center">{error || "Không thể kết nối đến phòng họp."}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <UserX className="h-12 w-12 text-destructive" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/mybooking")}>Quay lại</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <h3 className="pt-6 text-center text-2xl font-semibold text-foreground">
        📹 Video Call - Booking ID: {roomName}
      </h3>
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect={true}
        video={true}
        audio={true}
        data-lk-theme="default"
        className="h-[calc(100vh-60px)]"
        onConnected={() => {
          console.log("Successfully connected to LiveKit room:", { roomName, participantName, serverUrl })
          setIsConnecting(false)
        }}
        onDisconnected={(reason) => {
          console.log("Disconnected from LiveKit room:", { roomName, participantName, reason })
          handleDisconnect()
        }}
        onError={(err) => {
          console.error("LiveKit connection error:", { roomName, participantName, error: err.message })
          setError(`Không thể kết nối đến phòng họp: ${err.message}`)
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <GridLayout>
              <ParticipantTile />
            </GridLayout>
          </div>
          <div className="p-4">
            <ControlBar />
          </div>
          <RoomAudioRenderer />
        </div>
        <Button
          variant="outline"
          onClick={handleDisconnect}
          className="absolute bottom-5 left-5"
        >
          Thoát
        </Button>
      </LiveKitRoom>
      <FeedbackModal
        visible={showFeedback}
        roomName={roomName}
        onClose={handleFeedbackSubmitted}
      />
    </div>
  )
}