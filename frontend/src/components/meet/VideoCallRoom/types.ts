export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing?: boolean;
  connectionQuality: 'good' | 'poor' | 'disconnected';
  isHandRaised?: boolean;
  isSpeaking?: boolean;
  isHost?: boolean;
  isYou?: boolean;
  joinedAt: string;
}

export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
  timestamp: number;
}

export interface BackgroundOption {
  id: string;
  type: 'none' | 'blur' | 'image' | 'color';
  name: string;
  value?: string; // image URL or color value
  blurAmount?: number;
  thumbnail?: string;
  isPremium?: boolean;
}

export interface MeetingInfo {
  title: string;
  host: string;
  participants: number;
  scheduledTime: Date;
}

export interface NotesMeetingInfo {
  title: string;
  date: Date;
  participants: string[];
}

export interface AudioSettings {
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
}

export interface CallSettings {
  microphone: {
    enabled: boolean;
    deviceId: string;
    volume: number;
  };
  camera: {
    enabled: boolean;
    deviceId: string;
    resolution: string;
  };
  speaker: {
    deviceId: string;
    volume: number;
  };
  displayName: string;
  backgroundBlur: boolean;
  avatar?: string;
}

export type LayoutMode = 'grid' | 'speaker' | 'sidebar';
export type ConnectionStatus = 'connected' | 'reconnecting' | 'disconnected';
