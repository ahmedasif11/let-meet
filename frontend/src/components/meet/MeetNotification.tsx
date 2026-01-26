import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar } from '../ui/avatar';
import { X, Check, Clock } from 'lucide-react';
import { Participant } from './VideoCallRoom/types';

interface MeetNotificationProps {
  isOpen: boolean;
  participant: Participant;
  onAccept: (participant: Participant) => void;
  onReject: (participant: Participant) => void;
  onClose: () => void;
}

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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 max-w-md w-full mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-white">
                  Join Request
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Participant Info */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-12 h-12">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {participant.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </Avatar>
              <div className="flex-1">
                <h4 className="text-white font-medium text-lg">
                  {participant.name || 'Unknown User'}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-blue-600/20 text-blue-300 text-xs"
                  >
                    Wants to join
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    Just now
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => onReject(participant)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Decline
              </Button>
              <Button
                onClick={() => onAccept(participant)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Accept
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 text-center">
                This user wants to join your meet. Accept to start the video
                call.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
