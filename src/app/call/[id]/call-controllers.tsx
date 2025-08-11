'use client';

import { Button } from '@/components/ui/button';
import {
  Mic,
  MonitorUp,
  PhoneOff,
  Video,
  MicOff,
  VideoOff,
  MonitorOff,
} from 'lucide-react';
import {
  toggleCamera,
  toggleMic,
  toggleScreenShare,
  endCall,
} from '@/app/_lib/call-controllers-functions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CallControllers() {
  const router = useRouter();

  // state for toggles
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  return (
    <div className="flex gap-3 mt-10 bg-gray-100 p-2 rounded-lg absolute bottom-10">
      <Button
        className="hover:bg-gray-300"
        title="Toggle Microphone"
        onClick={() => {
          toggleMic();
          setMicOn((prev) => !prev);
        }}
      >
        {micOn ? <Mic /> : <MicOff />}
      </Button>

      <Button
        className="hover:bg-gray-300"
        title="Toggle Camera"
        onClick={() => {
          toggleCamera();
          setCameraOn((prev) => !prev);
        }}
      >
        {cameraOn ? <Video /> : <VideoOff />}
      </Button>

      <Button
        className="hover:bg-gray-300"
        title="Share Screen"
        onClick={() => {
          toggleScreenShare();
          setScreenSharing((prev) => !prev);
        }}
      >
        {screenSharing ? <MonitorOff /> : <MonitorUp />}
      </Button>

      <Button
        className="bg-red-500 text-white hover:bg-red-600"
        title="End Call"
        onClick={() => {
          endCall();
          router.push('/');
        }}
      >
        <PhoneOff />
      </Button>
    </div>
  );
}
