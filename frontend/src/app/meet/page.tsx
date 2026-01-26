'use client';

import { Suspense } from 'react';
import { VideoCallRoom } from '@/components/meet/index';
import { MeetLanding } from '@/components/meet/MeetLanding';
import { StoreProvider } from '@/context/store-provider';
import { useSearchParams } from 'next/navigation';

function MeetPageContent() {
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

export default function MeetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <MeetPageContent />
    </Suspense>
  );
}
