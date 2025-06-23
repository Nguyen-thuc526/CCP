import { AccessToken } from "livekit-server-sdk"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { roomName, participantName } = body

    if (!roomName || !participantName) {
      return NextResponse.json({ error: "Missing roomName or participantName" }, { status: 400 })
    }

    // Lấy API key và API secret từ biến môi trường
    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET

    if (!apiKey || !apiSecret) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    }

    // Tạo token truy cập
    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
    })

    // Cấp quyền cho người tham gia
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    })

    // Tạo JWT token
    const token = at.toJwt()

    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error creating token:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
