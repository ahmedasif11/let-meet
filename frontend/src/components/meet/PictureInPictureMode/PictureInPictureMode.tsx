import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ParticipantVideo } from '../ParticipantVideo';
import {
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  X,
  Move,
  MoreHorizontal,
} from 'lucide-react';
import { PictureInPictureModeProps, PipPosition } from './types';
import { formatDuration, getPositionStyles } from './utils';
import { usePictureInPicture } from './hooks/usePictureInPicture';

export function PictureInPictureMode({
  isActive,
  onToggle,
  onEndCall,
  participants,
  callDuration,
  isAudioOn,
  isVideoOn,
  onToggleAudio,
  onToggleVideo,
  className = '',
}: PictureInPictureModeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { position, isDragging, handleMouseDown } = usePictureInPicture();

  const mainParticipant = participants.find((p) => p.isYou) || participants[0];
  const otherParticipants = participants.filter((p) => !p.isYou).slice(0, 3);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`${getPositionStyles(position)} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          layout
          className={`bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden ${
            isExpanded ? 'w-96 h-64' : 'w-80 h-48'
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          whileDrag={{ scale: 1.05 }}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">
                  {formatDuration(callDuration)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {participants.length}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-6 h-6 p-0 text-white hover:bg-white/20"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-3 h-3" />
                  ) : (
                    <Maximize2 className="w-3 h-3" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="w-6 h-6 p-0 text-white hover:bg-white/20"
                >
                  <Maximize2 className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggle()}
                  className="w-6 h-6 p-0 text-white hover:bg-white/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main video area */}
          <div className="relative w-full h-full">
            {mainParticipant && (
              <ParticipantVideo
                participant={mainParticipant}
                className="w-full h-full"
                showControls={false}
              />
            )}

            {/* Other participants thumbnails */}
            {otherParticipants.length > 0 && isExpanded && (
              <div className="absolute bottom-12 right-2 flex flex-col gap-1">
                {otherParticipants.map((participant) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-16 h-12 rounded-lg overflow-hidden border border-white/20"
                  >
                    <ParticipantVideo
                      participant={participant}
                      className="w-full h-full"
                      showControls={false}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <AnimatePresence>
            {(isHovered || isExpanded) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3"
              >
                <div className="flex items-center justify-center gap-2">
                  {/* Audio toggle */}
                  <Button
                    variant={isAudioOn ? 'secondary' : 'destructive'}
                    size="sm"
                    onClick={onToggleAudio}
                    className="w-8 h-8 p-0 rounded-full"
                  >
                    {isAudioOn ? (
                      <Mic className="w-3 h-3" />
                    ) : (
                      <MicOff className="w-3 h-3" />
                    )}
                  </Button>

                  {/* Video toggle */}
                  <Button
                    variant={isVideoOn ? 'secondary' : 'destructive'}
                    size="sm"
                    onClick={onToggleVideo}
                    className="w-8 h-8 p-0 rounded-full"
                  >
                    {isVideoOn ? (
                      <Video className="w-3 h-3" />
                    ) : (
                      <VideoOff className="w-3 h-3" />
                    )}
                  </Button>

                  {/* More options */}
                  {isExpanded && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-8 h-8 p-0 rounded-full"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  )}

                  {/* End call */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onEndCall}
                    className="w-8 h-8 p-0 rounded-full bg-red-600 hover:bg-red-700"
                  >
                    <Phone className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drag indicator */}
          {isDragging && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 rounded-lg p-2">
              <Move className="w-4 h-4 text-white" />
            </div>
          )}
        </motion.div>

        {/* Position indicators */}
        {isDragging && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {(
              [
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
              ] as PipPosition[]
            ).map((pos) => {
              const isActive = position === pos;
              const positionClasses = {
                'top-left': 'top-4 left-4',
                'top-right': 'top-4 right-4',
                'bottom-left': 'bottom-4 left-4',
                'bottom-right': 'bottom-4 right-4',
              };

              return (
                <motion.div
                  key={pos}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute ${positionClasses[pos]} w-20 h-12 rounded-lg border-2 ${
                    isActive
                      ? 'border-blue-500 bg-blue-500/20'
                      : 'border-gray-500 bg-gray-500/10'
                  } transition-colors`}
                />
              );
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
