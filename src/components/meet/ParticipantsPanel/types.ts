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

export interface ParticipantsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  currentUserId?: string;
  isHost?: boolean;
  className?: string;
}
