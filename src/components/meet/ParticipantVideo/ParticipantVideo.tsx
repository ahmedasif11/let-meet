import React, { useState, useEffect } from 'react';
import { Avatar } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Pin,
  UserX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ParticipantVideoProps } from './types';
import { getConnectionColor, getConnectionIcon } from './utils';

export function ParticipantVideo({
  participant,
  isLarge = false,
  isPinned = false,
  className = '',
  onPin,
  onRemove,
  showControls = false,
}: ParticipantVideoProps) {
  const {
    name,
    avatar,
    isVideoOn,
    isAudioOn,
    isScreenSharing,
    connectionQuality,
    isHandRaised,
    isSpeaking,
    isHost,
    isYou,
  } = participant;

  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate audio level for speaking indicator
  useEffect(() => {
    if (isSpeaking && isAudioOn) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isSpeaking, isAudioOn]);

  return (
    <motion.div
      className={`relative bg-gray-900 rounded-xl overflow-hidden group ${className}`}
      animate={
        isSpeaking
          ? {
              boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.5)',
            }
          : {}
      }
      transition={{ duration: 0.2 }}
    >
      {/* Video or Avatar */}
      {isVideoOn ? (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center relative">
          {isScreenSharing ? (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <Monitor className="w-8 h-8 text-white opacity-50" />
              <span className="ml-2 text-white opacity-75">Screen Share</span>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="text-white opacity-50 text-sm">Camera Feed</span>
              {/* Simulated video overlay */}
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <Avatar
            className={isLarge ? 'w-24 h-24' : 'w-16 h-16'}
            src={avatar}
            alt={name}
            fallback={name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          />
        </div>
      )}

      {/* Hand raised indicator */}
      <AnimatePresence>
        {isHandRaised && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="absolute top-2 right-2 text-2xl z-10"
          >
            ✋
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen sharing indicator */}
      {isScreenSharing && (
        <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-600 z-10">
          <Monitor className="w-3 h-3 mr-1" />
          Screen
        </Badge>
      )}

      {/* Host indicator */}
      {isHost && (
        <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-600 z-10">
          Host
        </Badge>
      )}

      {/* Connection quality indicator */}
      <div
        className={`absolute top-2 right-2 ${getConnectionColor(connectionQuality)} z-10`}
      >
        {(() => {
          const Icon = getConnectionIcon(connectionQuality);
          return <Icon className="w-4 h-4" />;
        })()}
      </div>

      {/* Audio visualizer */}
      {isSpeaking && isAudioOn && (
        <div className="absolute bottom-16 left-2 flex items-end gap-1 z-10">
          {[1, 2, 3, 4].map((bar) => (
            <motion.div
              key={bar}
              className="w-1 bg-green-500 rounded-full"
              animate={{
                height: Math.max(4, (audioLevel / 100) * 16 * Math.random()),
              }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
      )}

      {/* Participant controls overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
          {onPin && (
            <Button
              size="sm"
              variant={isPinned ? 'default' : 'secondary'}
              onClick={onPin}
            >
              <Pin className="w-4 h-4" />
            </Button>
          )}

          {onRemove && !isYou && (
            <Button size="sm" variant="destructive" onClick={onRemove}>
              <UserX className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Participant name and status */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-black/50 text-white hover:bg-black/50 backdrop-blur-sm text-xs"
            >
              {name} {isYou && '(You)'}
            </Badge>
          </div>

          {/* Audio/Video status indicators */}
          <div className="flex gap-1">
            {!isAudioOn && (
              <div className="p-1.5 bg-red-600 rounded-full">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}

            {!isVideoOn && (
              <div className="p-1.5 bg-red-600 rounded-full">
                <VideoOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
