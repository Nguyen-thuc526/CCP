"use client";

import React from "react";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";

const FeedbackModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50">
      <h4 className="text-lg font-semibold mb-2">Feedback</h4>
      <p className="mb-4">Provide your feedback for the session.</p>
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Submit
        </button>
        <button
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

interface RoomProps {
  roomName: string;
  token: string;
  participantName: string;
  serverUrl: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  onLeave: () => void;
}

const Room: React.FC<RoomProps> = ({
  roomName,
  token,
  participantName,
  serverUrl,
  videoEnabled,
  audioEnabled,
  onLeave,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);

  const handleDisconnected = () => {
    setShowFeedback(true);
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    onLeave();
  };

  return (
    <div className="min-h-screen bg-white">
      <h3 className="text-center text-black text-2xl font-semibold pt-6">
        📹 Video Call - Booking ID: {roomName}
      </h3>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-screen">
          <span className="text-red-500 text-lg">{error}</span>
        </div>
      ) : (
        <LiveKitRoom
          video={videoEnabled}
          audio={audioEnabled}
          token={token}
          serverUrl={serverUrl}
          data-lk-theme="default"
          style={{ height: "calc(100vh - 60px)" }}
          onDisconnected={handleDisconnected}
        >
          <MyVideoConference />
          <RoomAudioRenderer />
          <ControlBar />
          <button
            className="absolute bottom-5 left-5 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => setShowFeedback(true)}
          >
            Thoát
          </button>
          <FeedbackModal visible={showFeedback} onClose={handleFeedbackClose} />
        </LiveKitRoom>
      )}
    </div>
  );
};

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <GridLayout tracks={tracks} style={{ height: "calc(100vh - var(--lk-control-bar-height) - 60px)" }}>
      <ParticipantTile />
    </GridLayout>
  );
}

export default Room;