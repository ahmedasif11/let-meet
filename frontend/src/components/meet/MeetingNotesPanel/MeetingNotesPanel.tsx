import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { ScrollArea } from '../../ui/scroll-area';
import { Separator } from '../../ui/separator';
import {
  FileText,
  Plus,
  Download,
  Share2,
  Clock,
  User,
  Tag,
  Search,
  Trash2,
  Edit3,
  Save,
  X,
  CheckSquare,
  Square,
  Mic,
  Camera,
  Link,
  Copy,
  Star,
  StarOff,
} from 'lucide-react';
import { MeetingNotesPanelProps, Note, ActionItem, NoteType } from './types';
import {
  extractTags,
  formatDuration,
  formatTime,
  getNoteTypeIcon,
  getNoteTypeColor,
  getPriorityColor,
  exportNotes,
} from './utils';
import { sampleNotes, sampleActionItems } from './mockData';

export function MeetingNotesPanel({
  isOpen,
  onClose,
  meetingInfo,
  callDuration,
}: MeetingNotesPanelProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteType, setNoteType] = useState<NoteType>('note');
  const [newActionItem, setNewActionItem] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sample initial data
  useEffect(() => {
    setNotes(sampleNotes);
    setActionItems(sampleActionItems);
  }, []);

  const addNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentNote.trim(),
        timestamp: new Date(),
        author: 'You',
        type: noteType,
        tags: extractTags(currentNote),
        isStarred: false,
        isCompleted: noteType === 'action' ? false : undefined,
      };

      setNotes((prev) => [newNote, ...prev]);
      setCurrentNote('');
      setNoteType('note');
    }
  };

  const addActionItem = () => {
    if (newActionItem.trim() && selectedAssignee) {
      const actionItem: ActionItem = {
        id: Date.now().toString(),
        task: newActionItem.trim(),
        assignee: selectedAssignee,
        priority: 'medium',
        isCompleted: false,
        createdAt: new Date(),
      };

      setActionItems((prev) => [actionItem, ...prev]);
      setNewActionItem('');
      setSelectedAssignee('');
    }
  };

  const toggleNoteStarred = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
      )
    );
  };

  const toggleActionCompleted = (actionId: string) => {
    setActionItems((prev) =>
      prev.map((action) =>
        action.id === actionId
          ? { ...action, isCompleted: !action.isCompleted }
          : action
      )
    );
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  const updateNote = (noteId: string, newContent: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId
          ? { ...note, content: newContent, tags: extractTags(newContent) }
          : note
      )
    );
    setEditingNote(null);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => note.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)));

  const handleExportNotes = () => {
    exportNotes(meetingInfo, callDuration, notes, actionItems);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:w-96 max-w-full bg-card backdrop-blur-xl border-border overflow-hidden"
      >
        <SheetHeader className="shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Meeting Notes
          </SheetTitle>
          <div className="text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(callDuration)}</span>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-y-auto mt-4 pr-2">
          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4 mt-4">
              {/* Add new note */}
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4 space-y-3">
                  {/* Note type selector */}
                  <div className="flex gap-2">
                    {(['note', 'action', 'decision', 'question'] as const).map(
                      (type) => (
                        <Button
                          key={type}
                          variant={noteType === type ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setNoteType(type)}
                          className="capitalize"
                        >
                          {getNoteTypeIcon(type) === 'CheckSquare' && (
                            <CheckSquare className="w-4 h-4" />
                          )}
                          {getNoteTypeIcon(type) === 'Star' && (
                            <Star className="w-4 h-4" />
                          )}
                          {getNoteTypeIcon(type) === 'Tag' && (
                            <Tag className="w-4 h-4" />
                          )}
                          {getNoteTypeIcon(type) === 'FileText' && (
                            <FileText className="w-4 h-4" />
                          )}
                          <span className="ml-1">{type}</span>
                        </Button>
                      )
                    )}
                  </div>

                  <Textarea
                    ref={textareaRef}
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Add a note... Use #tags to categorize"
                    className="bg-background border-input resize-none"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        addNote();
                      }
                    }}
                  />

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      {currentNote.length > 0 && <span>Cmd+Enter to save</span>}
                    </div>
                    <Button
                      onClick={addNote}
                      disabled={!currentNote.trim()}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Search and filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-foreground text-sm"
                  />
                </div>

                {/* Tags filter */}
                {allTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? 'default' : 'secondary'
                        }
                        className="cursor-pointer text-xs"
                        onClick={() => {
                          setSelectedTags((prev) =>
                            prev.includes(tag)
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes list */}
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-muted/30 border border-border rounded-lg p-3 border-l-2 ${getNoteTypeColor(note.type)}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {getNoteTypeIcon(note.type) === 'CheckSquare' && (
                            <CheckSquare className="w-4 h-4 text-blue-500" />
                          )}
                          {getNoteTypeIcon(note.type) === 'Star' && (
                            <Star className="w-4 h-4 text-green-500" />
                          )}
                          {getNoteTypeIcon(note.type) === 'Tag' && (
                            <Tag className="w-4 h-4 text-yellow-500" />
                          )}
                          {getNoteTypeIcon(note.type) === 'FileText' && (
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(note.timestamp)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            by {note.author}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleNoteStarred(note.id)}
                            className="w-6 h-6 p-0"
                          >
                            {note.isStarred ? (
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            ) : (
                              <StarOff className="w-3 h-3 text-muted-foreground" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingNote(note.id)}
                            className="w-6 h-6 p-0"
                          >
                            <Edit3 className="w-3 h-3 text-muted-foreground" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                            className="w-6 h-6 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {editingNote === note.id ? (
                        <div className="space-y-2">
                          <Textarea
                            defaultValue={note.content}
                            className="bg-background border-input text-sm"
                            rows={2}
                            onKeyDown={(e) => {
                              if (
                                e.key === 'Enter' &&
                                (e.metaKey || e.ctrlKey)
                              ) {
                                updateNote(
                                  note.id,
                                  (e.target as HTMLTextAreaElement).value
                                );
                              } else if (e.key === 'Escape') {
                                setEditingNote(null);
                              }
                            }}
                            onBlur={(e) => updateNote(note.id, e.target.value)}
                            autoFocus
                          />
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingNote(null)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-foreground text-sm mb-2">
                          {note.content}
                        </p>
                      )}

                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {filteredNotes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      {searchQuery || selectedTags.length > 0 ? (
                        <p>No notes match your filters</p>
                      ) : (
                        <p>No notes yet. Start taking notes!</p>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-4">
              {/* Add new action item */}
              <Card className="bg-muted/50 border-border">
                <CardContent className="p-4 space-y-3">
                  <Textarea
                    value={newActionItem}
                    onChange={(e) => setNewActionItem(e.target.value)}
                    placeholder="Add an action item..."
                    className="bg-background border-input resize-none"
                    rows={2}
                  />

                  <div className="flex gap-2">
                    <select
                      value={selectedAssignee}
                      onChange={(e) => setSelectedAssignee(e.target.value)}
                      className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm"
                    >
                      <option value="">Select assignee</option>
                      {meetingInfo.participants.map((participant) => (
                        <option key={participant} value={participant}>
                          {participant}
                        </option>
                      ))}
                    </select>

                    <Button
                      onClick={addActionItem}
                      disabled={!newActionItem.trim() || !selectedAssignee}
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action items list */}
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {actionItems.map((action) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-muted/30 border border-border rounded-lg p-3 ${
                        action.isCompleted ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActionCompleted(action.id)}
                          className="w-6 h-6 p-0 mt-1"
                        >
                          {action.isCompleted ? (
                            <CheckSquare className="w-4 h-4 text-green-500" />
                          ) : (
                            <Square className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>

                        <div className="flex-1">
                          <p
                            className={`text-foreground text-sm mb-2 ${
                              action.isCompleted ? 'line-through' : ''
                            }`}
                          >
                            {action.task}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{action.assignee}</span>
                            </div>

                            <span className={getPriorityColor(action.priority)}>
                              {action.priority} priority
                            </span>

                            {action.dueDate && (
                              <span>
                                Due: {action.dueDate.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {actionItems.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No action items yet</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Export/Share actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportNotes}
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
