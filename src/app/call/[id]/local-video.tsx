'use client';

import { useEffect, useRef, useState } from 'react';
import localMediaStreamsStore from '@/app/_lib/store/localMeidaStreamsStore';
import cameraStateChangeStore from '@/app/_lib/store/cameraStateChangeStore';
import { setupMediaStream } from '@/app/_lib/peer-connection/setUpMediaStream';

export default function LocalVideo({ className }: { className: string }) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [cameraEnabled, setCameraEnabled] = useState(
    cameraStateChangeStore.getCameraEnabled()
  );

  async function setupMedia() {
    let stream: MediaStream | undefined;
    try {
      const localMediaStreams = localMediaStreamsStore.getLocalMediaStreams();
      if (localMediaStreams && localMediaStreams.length > 0) {
        stream = localMediaStreams[0];
        if (!stream) {
          throw new Error('No local media stream found');
        }
      } else {
        stream = await setupMediaStream();
        localMediaStreamsStore.setLocalMediaStreams([stream]);
        console.log('Local media stream added to store:', stream);
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      console.log('Local media stream setup successfully');
    } catch (error: any) {
      console.error('Failed to setup media:', error.message);
    }
  }

  useEffect(() => {
    setupMedia();
    const handleCameraChange = (enabled: boolean) => {
      setCameraEnabled(enabled);
    };
    cameraStateChangeStore.subscribe(handleCameraChange);

    return () => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      cameraStateChangeStore.unsubscribe(handleCameraChange);
    };
  }, []);

  return (
    <div className="relative">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className={className}
      />
      {!cameraEnabled && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center text-white text-xl z-10">
          Camera Off
        </div>
      )}
    </div>
  );
}
