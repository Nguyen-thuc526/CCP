"use client"

import { Card, CardContent } from "@/components/ui/card"

interface CallInterfaceProps {
  joinUrl: string
  callStartTime: Date
  sidebarOpen: boolean
}

export default function CallInterface({ joinUrl, callStartTime, sidebarOpen }: CallInterfaceProps) {
  const formatCallDuration = () => {
    const now = new Date()
    const duration = Math.floor((now.getTime() - callStartTime.getTime()) / 1000 / 60)
    return `${duration} phút`
  }

  return (
    <div className={`transition-all duration-300 mt-16 ${sidebarOpen ? "mr-96" : "mr-0"}`}>
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
    </div>
  )
}
