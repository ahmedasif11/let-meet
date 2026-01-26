export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'system';
}

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}
