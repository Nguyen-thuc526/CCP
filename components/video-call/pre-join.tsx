"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, Phone, AlertCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PreJoinProps {
  appointmentId: string
  memberName: string
  onJoin: (video: boolean, audio: boolean) => void
  onCancel: () => void
}

export function PreJoin({ appointmentId, memberName, onJoin, onCancel }: PreJoinProps) {
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Yêu cầu quyền truy cập camera và microphone
    const setupMedia = async () => {
      try {
        // Dừng stream hiện tại nếu có
        if (videoStream) {
          videoStream.getTracks().forEach((track) => track.stop())
        }

        // Yêu cầu quyền truy cập mới
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoEnabled,
          audio: audioEnabled,
        })

        setVideoStream(stream)
        setMediaError(null)

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Error accessing media devices:", err)

        // Hiển thị thông báo lỗi phù hợp
        if (err instanceof DOMException) {
          if (err.name === "NotFoundError") {
            setMediaError("Không tìm thấy camera hoặc microphone. Vui lòng kiểm tra thiết bị của bạn.")
          } else if (err.name === "NotAllowedError") {
            setMediaError("Bạn đã từ chối quyền truy cập camera hoặc microphone. Vui lòng cấp quyền để tiếp tục.")
          } else {
            setMediaError(`Lỗi khi truy cập thiết bị: ${err.message}`)
          }
        } else {
          setMediaError("Đã xảy ra lỗi khi truy cập thiết bị media.")
        }

        // Nếu không thể truy cập camera, tắt video
        if (videoEnabled) setVideoEnabled(false)
      }
    }

    setupMedia()

    // Cleanup khi component unmount
    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [videoEnabled, audioEnabled])

  const toggleVideo = () => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled
      })
    }
    setVideoEnabled(!videoEnabled)
  }

  const toggleAudio = () => {
    if (videoStream) {
      videoStream.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled
      })
    }
    setAudioEnabled(!audioEnabled)
  }

  const handleJoin = () => {
    // Dừng stream hiện tại trước khi tham gia
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop())
    }
    onJoin(videoEnabled, audioEnabled)
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-center">Chuẩn bị tham gia buổi tư vấn</CardTitle>
          <CardDescription className="text-center">Kiểm tra camera và microphone trước khi tham gia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mediaError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi thiết bị</AlertTitle>
              <AlertDescription>{mediaError}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <div className="relative h-64 w-64 overflow-hidden rounded-full bg-muted">
              {videoEnabled && videoStream ? (
                <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" />
                    <AvatarFallback className="text-4xl">TC</AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium">Buổi tư vấn với {memberName}</h3>
            <p className="text-sm text-muted-foreground">ID: {appointmentId}</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant={videoEnabled ? "default" : "outline"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={toggleVideo}
            >
              {videoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>

            <Button
              variant={audioEnabled ? "default" : "outline"}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={toggleAudio}
            >
              {audioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={handleJoin}>
            <Phone className="mr-2 h-4 w-4" />
            Tham gia ngay
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
