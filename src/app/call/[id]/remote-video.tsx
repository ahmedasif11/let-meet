'use client';

import { useEffect, useRef } from 'react';

export default function RemoteVideo({
  className,
  stream,
}: {
  className: string;
  stream: MediaStream;
}) {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteVideoRef.current && stream) {
      remoteVideoRef.current.srcObject = stream;
    }

    return () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  return (
    <div>
      <video ref={remoteVideoRef} autoPlay playsInline className={className} />
    </div>
  );
}
