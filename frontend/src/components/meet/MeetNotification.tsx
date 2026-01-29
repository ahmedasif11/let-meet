import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { X, Check } from 'lucide-react';
import { Participant } from './VideoCallRoom/types';

interface MeetNotificationProps {
  isOpen: boolean;
  participant: Participant;
  onAccept: (participant: Participant) => void;
  onReject: (participant: Participant) => void;
  onClose: () => void;
}

export function MeetNotification({
  isOpen,
  participant,
  onAccept,
  onReject,
  onClose,
}: MeetNotificationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="fixed left-2 right-2 sm:left-auto sm:right-6 sm:max-w-sm z-50 bottom-20 sm:bottom-24"
        >
          <div className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-lg">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
              {participant.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary text-sm font-medium">
                  {participant.name?.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {participant.name || 'Someone'}
              </p>
              <p className="text-xs text-muted-foreground">Wants to join</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReject(participant)}
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => onAccept(participant)}
                className="h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 gap-1.5"
              >
                <Check className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">Admit</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
