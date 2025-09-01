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
}

export interface ParticipantVideoProps {
  participant: Participant;
  isLarge?: boolean;
  isPinned?: boolean;
  className?: string;
  onPin?: () => void;
  onRemove?: () => void;
  showControls?: boolean;
}
