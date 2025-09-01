export interface VideoToolbarProps {
  onEndCall: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onRaiseHand: () => void;
  onSendReaction: (reaction: string) => void;
  onToggleVirtualBackgrounds?: () => void;
  onToggleCallQuality?: () => void;
  onToggleMeetingNotes?: () => void;
  onTogglePictureInPicture?: () => void;
  onToggleAdvancedAudio?: () => void;
  onToggleAudio?: () => void;
  onToggleVideo?: () => void;
  unreadMessages?: number;
  isHandRaised?: boolean;
  isRecording?: boolean;
  isAudioOn?: boolean;
  isVideoOn?: boolean;
  className?: string;
}
