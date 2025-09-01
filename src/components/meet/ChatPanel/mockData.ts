import { ChatMessage } from './types';

export const initialMessages: ChatMessage[] = [
  {
    id: '1',
    userId: 'system',
    userName: 'System',
    message:
      'Welcome to the video call. Chat messages are visible to all participants.',
    timestamp: new Date(Date.now() - 300000),
    type: 'system',
  },
  {
    id: '2',
    userId: 'alice',
    userName: 'Alice Johnson',
    message: "Thanks for joining everyone! Let's get started.",
    timestamp: new Date(Date.now() - 120000),
    type: 'message',
  },
  {
    id: '3',
    userId: 'bob',
    userName: 'Bob Smith',
    message: 'Can everyone hear me clearly?',
    timestamp: new Date(Date.now() - 60000),
    type: 'message',
  },
];
