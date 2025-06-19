"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, Phone, AlertCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { bookingService } from "@/services/bookingService";

const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};

interface PreJoinProps {
  appointmentId: string;
  memberName: string;
  onJoin: (
    video: boolean,
    audio: boolean,
    token: string,
    participantName: string,
    roomName: string,
    serverUrl: string
  ) => void;
  onCancel: () => void;
}

export function PreJoin({ appointmentId, memberName, onJoin, onCancel }: PreJoinProps) {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupMedia = async () => {
      try {
        if (videoStream) {
          videoStream.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoEnabled,
          audio: audioEnabled,
        });

        setVideoStream(stream);
        setMediaError(null);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        let errorMessage = "Đã xảy ra lỗi khi truy cập thiết bị media.";
        if (err instanceof DOMException) {
          if (err.name === "NotFoundError") {
            errorMessage = "Không tìm thấy camera hoặc microphone. Vui lòng kiểm tra thiết bị của bạn.";
          } else if (err.name === "NotAllowedError") {
            errorMessage = "Bạn đã từ chối quyền truy cập camera hoặc microphone. Vui lòng cấp quyền để tiếp tục.";
          } else {
            errorMessage = `Lỗi khi truy cập thiết bị: ${err.message}`;
          }
        }
        setMediaError(errorMessage);
        if (videoEnabled) setVideoEnabled(false);
      }
    };

    setupMedia();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoEnabled, audioEnabled]);

  const toggleVideo = () => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach((track) => {
        track.enabled = !videoEnabled;
      });
    }
    setVideoEnabled(!videoEnabled);
  };

  const toggleAudio = () => {
    if (videoStream) {
      videoStream.getAudioTracks().forEach((track) => {
        track.enabled = !audioEnabled;
      });
    }
    setAudioEnabled(!audioEnabled);
  };

  const fetchToken = async () => {
    try {
      const response = await bookingService.getLivekitToken(appointmentId);
      console.log("Fetched token and serverUrl:", response.data);
      const { token, serverUrl } = response.data;
      setToken(token);
      setServerUrl(serverUrl);
      return { token, serverUrl };
    } catch (err) {
      console.error("Error fetching LiveKit token:", err);
      throw new Error("Không thể lấy token LiveKit. Vui lòng thử lại.");
    }
  };

  const handleJoin = async () => {
    setJoinError(null);
    try {
      let tokenToUse = token;
      let serverUrlToUse = serverUrl;
      if (!tokenToUse || !serverUrlToUse) {
        console.log("Fetching new token and serverUrl...");
        const { token, serverUrl } = await fetchToken();
        tokenToUse = token;
        serverUrlToUse = serverUrl;
      }

      const decodedToken = decodeToken(tokenToUse);
      const participantNameFromToken = decodedToken?.name || memberName;
      const roomNameFromToken = decodedToken?.room || `room_${appointmentId}`;

      console.log("Decoded token:", { participantName: participantNameFromToken, room: roomNameFromToken });
      onJoin(videoEnabled, audioEnabled, tokenToUse, participantNameFromToken, roomNameFromToken, serverUrlToUse);

      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.error("Error joining room:", err);
      setJoinError(err instanceof Error ? err.message : "Không thể tham gia phòng. Vui lòng thử lại.");
    }
  };

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
          {joinError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi tham gia</AlertTitle>
              <AlertDescription>{joinError}</AlertDescription>
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
  );
}