export interface MeetingNotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  meetingInfo: {
    title: string;
    date: Date;
    participants: string[];
  };
  callDuration: number;
}

export interface Note {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
  type: 'note' | 'action' | 'decision' | 'question';
  tags: string[];
  isStarred: boolean;
  isCompleted?: boolean;
}

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: Date;
}

export type NoteType = 'note' | 'action' | 'decision' | 'question';
export type Priority = 'low' | 'medium' | 'high';
