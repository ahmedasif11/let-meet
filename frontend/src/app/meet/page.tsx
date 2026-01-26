'use client';

import { VideoCallRoom } from '@/components/meet/index';
import { StoreProvider } from '@/context/store-provider';

export default function MeetPage() {
  return (
    <StoreProvider>
      <VideoCallRoom />
    </StoreProvider>
  );
}
