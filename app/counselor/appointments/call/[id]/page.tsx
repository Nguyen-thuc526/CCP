"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "@/services/bookingService";

export default function CallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [joinUrl, setJoinUrl] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchRoomUrl = async () => {
      const { id: appointmentId } = await params;
      try {
        const response = await bookingService.getRoomUrl(appointmentId);
        if (response.success) {
          let { joinUrl, roomName, userName } = response.data;

          // Encode userName để tránh lỗi URL
          const encodedUserName = encodeURIComponent(userName);

          // Giả sử nền tảng gọi hỗ trợ `userName` trong query
          const updatedJoinUrl = `${joinUrl}?userName=${encodedUserName}`;

          setJoinUrl(updatedJoinUrl);
          setRoomName(roomName);
          setUserName(userName);
        } else {
          router.back();
        }
      } catch (error) {
        console.error("Failed to fetch room URL:", error);
        router.back();
      }
    };
    fetchRoomUrl();
  }, [params, router]);

  const handleCancel = () => {
    console.log("Canceling call, navigating back");
    router.back();
  };

  if (!joinUrl) {
    return <div>Loading room URL...</div>;
  }

  return (
    <div>
      <h1>Call Room: {roomName}</h1>
      <p>Welcome, {userName}!</p>
      <iframe
        src={joinUrl}
        title="Call Room"
        width="100%"
        height="600px"
        frameBorder="0"
        allow="microphone; camera"
      />
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}
