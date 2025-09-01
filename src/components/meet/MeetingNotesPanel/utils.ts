import { Note, ActionItem } from './types';

export const extractTags = (text: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const matches = text.match(tagRegex);
  return matches ? matches.map((tag) => tag.slice(1)) : [];
};

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getNoteTypeIcon = (type: string) => {
  switch (type) {
    case 'action':
      return 'CheckSquare';
    case 'decision':
      return 'Star';
    case 'question':
      return 'Tag';
    default:
      return 'FileText';
  }
};

export const getNoteTypeColor = (type: string) => {
  switch (type) {
    case 'action':
      return 'border-l-blue-500';
    case 'decision':
      return 'border-l-green-500';
    case 'question':
      return 'border-l-yellow-500';
    default:
      return 'border-l-gray-500';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'low':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

export const exportNotes = (
  meetingInfo: any,
  callDuration: number,
  notes: Note[],
  actionItems: ActionItem[]
) => {
  const content = `
# ${meetingInfo.title}
**Date:** ${meetingInfo.date.toLocaleDateString()}
**Duration:** ${formatDuration(callDuration)}
**Participants:** ${meetingInfo.participants.join(', ')}

## Notes
${notes
  .map(
    (note) => `
### ${note.type.charAt(0).toUpperCase() + note.type.slice(1)} - ${formatTime(note.timestamp)}
**Author:** ${note.author}
${note.content}
${note.tags.length > 0 ? `**Tags:** ${note.tags.map((tag) => `#${tag}`).join(', ')}` : ''}
`
  )
  .join('\n')}

## Action Items
${actionItems
  .map(
    (action) => `
- [${action.isCompleted ? 'x' : ' '}] ${action.task}
  - **Assignee:** ${action.assignee}
  - **Priority:** ${action.priority}
  - **Created:** ${formatTime(action.createdAt)}
  ${action.dueDate ? `- **Due:** ${action.dueDate.toLocaleDateString()}` : ''}
`
  )
  .join('\n')}
  `.trim();

  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${meetingInfo.title.replace(/\s+/g, '_')}_notes.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
