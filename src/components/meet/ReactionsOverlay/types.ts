export interface Reaction {
  id: string;
  emoji: string;
  userId: string;
  userName: string;
  timestamp: number;
}

export interface ReactionsOverlayProps {
  reactions: Reaction[];
  className?: string;
}
