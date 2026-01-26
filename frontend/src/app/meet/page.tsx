'use client';

import { VideoCallRoom } from '@/components/meet/index';
import { MeetLanding } from '@/components/meet/MeetLanding';
import { StoreProvider } from '@/context/store-provider';
import { useSearchParams } from 'next/navigation';

export default function MeetPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const action = searchParams.get('action');

  // Show landing page if no roomId
  if (!roomId) {
    return <MeetLanding />;
  }

  // Show VideoCallRoom if roomId exists
  return (
    <StoreProvider>
      <VideoCallRoom />
    </StoreProvider>
  );
}
