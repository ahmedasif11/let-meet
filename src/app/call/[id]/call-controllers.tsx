import { Button } from '@/components/ui/button';
import { Mic, MonitorUp, PhoneOff, Video, LucideIcon } from 'lucide-react';

interface ControlButton {
  icon: LucideIcon;
  label: string;
  className?: string;
}

const controlButtons: ControlButton[] = [
  {
    icon: Mic,
    label: 'Toggle Microphone',
    className: 'hover:bg-gray-300',
  },

  {
    icon: Video,
    label: 'Toggle Camera',
    className: 'hover:bg-gray-300',
  },

  {
    icon: MonitorUp,
    label: 'Share Screen',
    className: 'hover:bg-gray-300',
  },

  {
    icon: PhoneOff,
    label: 'End Call',
    className: 'bg-red-500 text-white hover:bg-red-600',
  },
];

export default function CallControllers() {
  return (
    <div className="flex gap-3 mt-10 bg-gray-100 p-2 rounded-lg absolute bottom-10 ">
      {controlButtons.map((control) => (
        <Button
          className={control.className}
          key={control.label}
          title={control.label}
          aria-label={control.label}
        >
          <control.icon />
        </Button>
      ))}
    </div>
  );
}
