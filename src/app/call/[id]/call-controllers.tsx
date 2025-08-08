'use client';

import { Button } from '@/components/ui/button';
import { Mic, MonitorUp, PhoneOff, Video, LucideIcon } from 'lucide-react';
import {
  toggleCamera,
  toggleMic,
  toggleScreenShare,
  endCall,
} from '@/app/_lib/call-controllers-functions';
import { useRouter } from 'next/navigation';

interface ControlButton {
  icon: LucideIcon;
  label: string;
  className?: string;
  onClick?: () => void;
}

export default function CallControllers() {
  const router = useRouter();

  const controlButtons: ControlButton[] = [
    {
      icon: Mic,
      label: 'Toggle Microphone',
      className: 'hover:bg-gray-300',
      onClick: toggleMic,
    },
    {
      icon: Video,
      label: 'Toggle Camera',
      className: 'hover:bg-gray-300',
      onClick: toggleCamera,
    },
    {
      icon: MonitorUp,
      label: 'Share Screen',
      className: 'hover:bg-gray-300',
      onClick: toggleScreenShare,
    },
    {
      icon: PhoneOff,
      label: 'End Call',
      className: 'bg-red-500 text-white hover:bg-red-600',
      onClick: () => {
        endCall();
        router.push('/');
      },
    },
  ];

  return (
    <div className="flex gap-3 mt-10 bg-gray-100 p-2 rounded-lg absolute bottom-10">
      {controlButtons.map((control) => (
        <Button
          className={control.className}
          key={control.label}
          title={control.label}
          aria-label={control.label}
          onClick={control.onClick}
        >
          <control.icon />
        </Button>
      ))}
    </div>
  );
}
