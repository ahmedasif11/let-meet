import React from 'react';

export interface PreCallSetupRoomProps {
  isOpen: boolean;
  onJoinCall: (settings: CallSettings) => void;
  onClose: () => void;
  meetingInfo: {
    title: string;
    host: string;
    participants: number;
    scheduledTime: Date;
  };
  callSettings: CallSettings;
  setCallSettings: React.Dispatch<React.SetStateAction<CallSettings>>;
}

export interface CallSettings {
  camera: {
    enabled: boolean;
    deviceId: string;
    resolution: string;
  };
  microphone: {
    enabled: boolean;
    deviceId: string;
    volume: number;
  };
  speaker: {
    deviceId: string;
    volume: number;
  };
  displayName: string;
  backgroundBlur: boolean;
}

export interface DeviceInfo {
  deviceId: string;
  label: string;
  kind: string;
}

export interface TestResults {
  camera: 'pending' | 'good' | 'warning' | 'error';
  microphone: 'pending' | 'good' | 'warning' | 'error';
  speaker: 'pending' | 'good' | 'warning' | 'error';
  network: 'pending' | 'good' | 'warning' | 'error';
}

export interface Devices {
  cameras: DeviceInfo[];
  microphones: DeviceInfo[];
  speakers: DeviceInfo[];
}

export interface DeviceAvailability {
  hasCamera: boolean;
  hasMicrophone: boolean;
  hasSpeaker: boolean;
  cameraError?: string;
  microphoneError?: string;
  speakerError?: string;
}

export interface Step {
  title: string;
  icon: React.ComponentType<{ className?: string }>; // Lucide icon component
}
