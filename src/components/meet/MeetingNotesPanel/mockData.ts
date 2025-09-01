import { Note, ActionItem } from './types';

export const sampleNotes: Note[] = [
  {
    id: '1',
    content:
      'Discussed Q4 roadmap priorities. Focus on user experience improvements.',
    timestamp: new Date(Date.now() - 600000),
    author: 'Alice Johnson',
    type: 'note',
    tags: ['roadmap', 'Q4'],
    isStarred: true,
  },
  {
    id: '2',
    content: 'Decision: Move forward with new design system implementation.',
    timestamp: new Date(Date.now() - 480000),
    author: 'You',
    type: 'decision',
    tags: ['design-system'],
    isStarred: false,
  },
  {
    id: '3',
    content: 'Question: What is the timeline for the mobile app release?',
    timestamp: new Date(Date.now() - 360000),
    author: 'Bob Smith',
    type: 'question',
    tags: ['mobile', 'timeline'],
    isStarred: false,
  },
];

export const sampleActionItems: ActionItem[] = [
  {
    id: '1',
    task: 'Prepare user research presentation for next week',
    assignee: 'Carol Davis',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'high',
    isCompleted: false,
    createdAt: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    task: 'Review and approve design mockups',
    assignee: 'Alice Johnson',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    isCompleted: true,
    createdAt: new Date(Date.now() - 240000),
  },
];
