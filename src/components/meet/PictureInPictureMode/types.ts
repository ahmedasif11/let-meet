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

export interface PictureInPictureModeProps {
  isActive: boolean;
  onToggle: () => void;
  onEndCall: () => void;
  participants: Participant[];
  callDuration: number;
  isAudioOn: boolean;
  isVideoOn: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  className?: string;
}

export type PipPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';
