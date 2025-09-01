import { Button } from '../../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { Badge } from '../../ui/badge';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  MonitorOff,
  Phone,
  Settings,
  Users,
  MessageSquare,
  Hand,
  Smile,
  Circle,
  MoreHorizontal,
  Camera,
  Volume2,
  VolumeX,
  Maximize,
  Grid3X3,
  Palette,
  Activity,
  FileText,
  Minimize2,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoToolbarProps } from './types';
import { reactions } from './constants';

export function VideoToolbar({
  onEndCall,
  onToggleChat,
  onToggleParticipants,
  onRaiseHand,
  onSendReaction,
  onToggleVirtualBackgrounds,
  onToggleCallQuality,
  onToggleMeetingNotes,
  onTogglePictureInPicture,
  onToggleAdvancedAudio,
  onToggleAudio,
  onToggleVideo,
  unreadMessages = 0,
  isHandRaised = false,
  isRecording = false,
  isAudioOn = true,
  isVideoOn = true,
  className = '',
}: VideoToolbarProps) {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showMoreControls, setShowMoreControls] = useState(false);

  const handleAudioToggle = () => {
    if (onToggleAudio) {
      onToggleAudio();
    }
  };

  const handleVideoToggle = () => {
    if (onToggleVideo) {
      onToggleVideo();
    }
  };

  const handleReaction = (reaction: string) => {
    onSendReaction(reaction);
    setShowReactions(false);
  };

  return (
    <TooltipProvider>
      <div
        className={`relative flex items-center justify-between gap-2 p-4 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 ${className}`}
      >
        {/* Left controls - Communication */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isAudioOn ? 'secondary' : 'destructive'}
                size="icon"
                onClick={handleAudioToggle}
                className="rounded-full w-12 h-12 relative"
              >
                {isAudioOn ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isAudioOn ? 'Mute' : 'Unmute'}</TooltipContent>
          </Tooltip>

          {/* Video toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isVideoOn ? 'secondary' : 'destructive'}
                size="icon"
                onClick={handleVideoToggle}
                className="rounded-full w-12 h-12"
              >
                {isVideoOn ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <VideoOff className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            </TooltipContent>
          </Tooltip>

          {/* Screen share toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isScreenSharing ? 'default' : 'secondary'}
                size="icon"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className="rounded-full w-12 h-12"
              >
                {isScreenSharing ? (
                  <MonitorOff className="w-5 h-5" />
                ) : (
                  <Monitor className="w-5 h-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isScreenSharing ? 'Stop sharing' : 'Share screen'}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Center controls - Interaction & Enhanced Features */}
        <div className="flex items-center gap-2">
          {/* Reactions */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setShowReactions(!showReactions)}
                  className="rounded-full w-12 h-12"
                >
                  <Smile className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reactions</TooltipContent>
            </Tooltip>

            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-2xl p-3 shadow-2xl border border-white/10"
                >
                  <div className="flex gap-2">
                    {reactions.map((reaction, index) => (
                      <motion.button
                        key={reaction}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleReaction(reaction)}
                        className="text-2xl hover:scale-110 transition-transform p-1 rounded-lg hover:bg-white/10"
                      >
                        {reaction}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Virtual Backgrounds */}
          {onToggleVirtualBackgrounds && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onToggleVirtualBackgrounds}
                  className="rounded-full w-12 h-12"
                >
                  <Palette className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Virtual Backgrounds</TooltipContent>
            </Tooltip>
          )}

          {/* Call Quality */}
          {onToggleCallQuality && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onToggleCallQuality}
                  className="rounded-full w-12 h-12"
                >
                  <Activity className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Call Quality</TooltipContent>
            </Tooltip>
          )}

          {/* Meeting Notes */}
          {onToggleMeetingNotes && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onToggleMeetingNotes}
                  className="rounded-full w-12 h-12"
                >
                  <FileText className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Meeting Notes</TooltipContent>
            </Tooltip>
          )}

          {/* Advanced Audio */}
          {onToggleAdvancedAudio && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={onToggleAdvancedAudio}
                  className="rounded-full w-12 h-12"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Advanced Audio</TooltipContent>
            </Tooltip>
          )}

          {/* Raise hand */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isHandRaised ? 'default' : 'secondary'}
                size="icon"
                onClick={onRaiseHand}
                className="rounded-full w-12 h-12 relative"
              >
                <Hand className="w-5 h-5" />
                {isHandRaised && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isHandRaised ? 'Lower hand' : 'Raise hand'}
            </TooltipContent>
          </Tooltip>

          {/* Chat */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={onToggleChat}
                className="rounded-full w-12 h-12 relative"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-red-600">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Chat {unreadMessages > 0 && `(${unreadMessages})`}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right controls - Management */}
        <div className="flex items-center gap-2">
          {/* Recording indicator */}
          {isRecording && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-full"
            >
              <Circle className="w-4 h-4 text-white fill-current" />
              <span className="text-white text-sm">REC</span>
            </motion.div>
          )}

          {/* Participants */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={onToggleParticipants}
                className="rounded-full w-12 h-12"
              >
                <Users className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Participants</TooltipContent>
          </Tooltip>

          {/* More controls */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setShowMoreControls(!showMoreControls)}
                  className="rounded-full w-12 h-12"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More</TooltipContent>
            </Tooltip>

            <AnimatePresence>
              {showMoreControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  className="absolute bottom-16 right-0 bg-gray-800 rounded-xl p-2 shadow-2xl border border-white/10 min-w-48"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3"
                  >
                    <Circle className="w-4 h-4" />
                    {isRecording ? 'Stop recording' : 'Start recording'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3"
                  >
                    <Maximize className="w-4 h-4" />
                    Fullscreen
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-3"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Layout
                  </Button>
                  {onTogglePictureInPicture && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-3"
                      onClick={onTogglePictureInPicture}
                    >
                      <Minimize2 className="w-4 h-4" />
                      Picture in Picture
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* End call */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={onEndCall}
                className="rounded-full bg-red-600 hover:bg-red-700 w-12 h-12 ml-2"
              >
                <Phone className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>End call</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
