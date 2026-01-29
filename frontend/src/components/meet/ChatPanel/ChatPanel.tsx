import { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { Badge } from '../../ui/badge';
import { Avatar } from '../../ui/avatar';
import { Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatPanelProps, ChatMessage } from './types';
import { formatTime } from './utils';
import { initialMessages } from './mockData';

export function ChatPanel({ isOpen, onClose, className = '' }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: 'you',
        userName: 'You',
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'message',
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-full sm:w-80 max-w-full bg-card backdrop-blur-xl border-l border-border z-50 flex flex-col shadow-xl ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-foreground font-semibold">Chat</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.type === 'system' ? 'justify-center' : ''}`}
                >
                  {message.type === 'system' ? (
                    <Badge variant="secondary" className="text-xs">
                      {message.message}
                    </Badge>
                  ) : (
                    <>
                      <Avatar
                        className="w-8 h-8 flex-shrink-0"
                        src={message.avatar}
                        fallback={message.userName.split(' ').map((n) => n[0]).join('')}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground truncate">{message.userName}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground break-words">
                          {message.message}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon" className="rounded-full shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
