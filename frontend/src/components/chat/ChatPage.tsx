'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Video,
  Phone,
  UserPlus,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

export function ChatPage() {
  const { data: session } = useSession();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = {
    id: session?.user?._id || '1',
    name: session?.user?.name || 'You',
    avatar: session?.user?.image || '',
  };

  const demoConversations: Conversation[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
      lastMessage: 'Hey, are we still on for the meeting?',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: 'm1',
          senderId: '2',
          senderName: 'Alice Johnson',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
          text: 'Hey, are we still on for the meeting?',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isRead: false,
        },
        {
          id: 'm2',
          senderId: '1',
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: 'Yes, see you at 3 PM!',
          timestamp: new Date(Date.now() - 3 * 60 * 1000),
          isRead: true,
        },
      ],
    },
    {
      id: '2',
      name: 'Team Alpha',
      avatar: '',
      lastMessage: 'Sarah: The design looks great!',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 0,
      isOnline: false,
      messages: [
        {
          id: 'm3',
          senderId: '3',
          senderName: 'Sarah',
          senderAvatar: '',
          text: 'The design looks great!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: true,
        },
      ],
    },
    {
      id: '3',
      name: 'Bob Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
      lastMessage: 'Thanks for the help!',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      isOnline: true,
      messages: [
        {
          id: 'm4',
          senderId: '4',
          senderName: 'Bob Smith',
          senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
          text: 'Thanks for the help!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true,
        },
      ],
    },
  ];

  const selectedConv = demoConversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedConversation) return;
    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv?.messages]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full sm:w-80 lg:w-96 border-r bg-card flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Messages
              </h1>
              <Button variant="ghost" size="icon">
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="p-2 space-y-1">
              {demoConversations.map(conversation => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedConversation === conversation.id
                      ? 'bg-accent'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="h-12 w-12"
                      />
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2 h-5 min-w-5 px-1.5 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          {selectedConv ? (
            <>
              <div className="p-4 border-b bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={selectedConv.avatar}
                    alt={selectedConv.name}
                    className="h-10 w-10"
                  />
                  <div>
                    <h2 className="font-semibold">{selectedConv.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedConv.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConv.messages.map(msg => {
                    const isOwn = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isOwn && (
                          <Avatar
                            src={msg.senderAvatar}
                            alt={msg.senderName}
                            className="h-8 w-8"
                          />
                        )}
                        <div
                          className={`max-w-[70%] sm:max-w-[60%] ${
                            isOwn ? 'order-1' : 'order-2'
                          }`}
                        >
                          {!isOwn && (
                            <p className="text-xs text-muted-foreground mb-1 px-2">
                              {msg.senderName}
                            </p>
                          )}
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              isOwn
                                ? 'bg-blue-600 text-white'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? 'text-blue-100' : 'text-muted-foreground'
                              }`}
                            >
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                        {isOwn && (
                          <Avatar
                            src={msg.senderAvatar}
                            alt={msg.senderName}
                            className="h-8 w-8 order-2"
                          />
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-card">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
