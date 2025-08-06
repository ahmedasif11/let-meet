'use client';

import { useEffect, useRef } from 'react';

export default function RemoteVideo({ className }: { className: string }) {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {}, []);

  return (
    <div>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        muted
        className={className}
      />
    </div>
  );
}
