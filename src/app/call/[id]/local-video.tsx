'use client';

import { useEffect, useRef } from 'react';
import { setupMediaStream } from '@/app/_lib/peer-connection/setUpMediaStream';
import localMediaStreamsStore from '@/app/_lib/store/localMeidaStreamsStore';

export default function LocalVideo({ className }: { className: string }) {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  async function setupMedia() {
    try {
      const stream = await setupMediaStream();
      localMediaStreamsStore.setLocalMediaStreams([stream]);
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
    return () => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div>
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className={className}
      />
    </div>
  );
}
