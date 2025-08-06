'use client';

import { useEffect, useRef } from 'react';
import { setupMediaStream } from '@/app/_lib/peer-connection/setUpMediaStream';
import peerConnection from '@/app/_lib/peer-connection/peerConnectionManager';
import socket from '../../_lib/sockets/socket';

export default function LocalVideo({ className }: { className: string }) {
  const localVideoRef = useRef<HTMLVideoElement>(null);

  async function setupMedia() {
    try {
      const stream = await setupMediaStream();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;

        stream.getTracks().forEach((track: MediaStreamTrack) => {
          peerConnection.peer?.addTransceiver(track, { direction: 'sendrecv' });
        });

        stream.getTracks().forEach((track: MediaStreamTrack) => {
          peerConnection.peer?.addTrack(track, stream);
        });
      }
    } catch (error: any) {
      console.error('Failed to setup media:', error.message);
    }
  }

  useEffect(() => {
    setupMedia();

    return () => {
      if (localVideoRef.current?.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
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
