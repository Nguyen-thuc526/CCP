"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LiveKitRoom, GridLayout, ParticipantTile, RoomAudioRenderer, ControlBar } from "@livekit/components-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, UserX } from "lucide-react"

interface VideoRoomProps {
  roomName: string
  participantName: string
  token?: string
}

export function VideoRoom({ roomName, participantName, token }: VideoRoomProps) {
  const router = useRouter()
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roomToken, setRoomToken] = useState<string | undefined>(token)

  useEffect(() => {
    // Trong ứng dụng thực tế, bạn sẽ gọi API để lấy token
    // Đây là mô phỏng việc lấy token từ server
    const getToken = async () => {
      try {
        setIsConnecting(true)
        // Mô phỏng gọi API
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Trong ứng dụng thực tế, bạn sẽ gọi API endpoint để lấy token
        // const response = await fetch('/api/livekit/get-token', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ roomName, participantName }),
        // })
        // const data = await response.json()
        // setRoomToken(data.token)

        // Mô phỏng token cho demo
        setRoomToken("mock_token_for_demo_purposes")
        setIsConnecting(false)
      } catch (err) {
        console.error("Failed to get token:", err)
        setError("Không thể kết nối đến phòng họp. Vui lòng thử lại sau.")
        setIsConnecting(false)
      }
    }

    if (!token) {
      getToken()
    } else {
      setIsConnecting(false)
    }
  }, [roomName, participantName, token])

  const handleDisconnect = () => {
    router.back()
  }

  if (isConnecting) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
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

  if (error || !roomToken) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Lỗi kết nối</CardTitle>
            <CardDescription className="text-center">
              {error || "Không thể kết nối đến phòng họp. Vui lòng thử lại sau."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <UserX className="h-12 w-12 text-destructive" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleDisconnect}>Quay lại</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Sử dụng một URL LiveKit mặc định nếu không có biến môi trường
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://demo.livekit.cloud"

  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden rounded-lg border bg-card">
      <LiveKitRoom
        token={roomToken}
        serverUrl={serverUrl}
        // Đảm bảo Room được khởi tạo trước khi render các component con
        connect={true}
        video={true}
        audio={true}
        data-lk-theme="default"
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
      </LiveKitRoom>
    </div>
  )
}
