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
import { useState, useRef, useEffect } from 'react';
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
  onToggleScreenShare,
  unreadMessages = 0,
  participantCount = 0,
  isHandRaised = false,
  isRecording = false,
  isAudioOn = true,
  isVideoOn = true,
  isScreenSharing = false,
  className = '',
}: VideoToolbarProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [showMoreControls, setShowMoreControls] = useState(false);
  const [showReactionsInMore, setShowReactionsInMore] = useState(false); // mobile: show emoji strip inside More menu
  const reactionsRef = useRef<HTMLDivElement>(null);
  const moreControlsRef = useRef<HTMLDivElement>(null);

  // Close reactions/more menus on click outside or when opening another panel
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (showReactions && reactionsRef.current && !reactionsRef.current.contains(target)) {
        setShowReactions(false);
      }
      if (showMoreControls && moreControlsRef.current && !moreControlsRef.current.contains(target)) {
        setShowMoreControls(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showReactions, showMoreControls]);

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

  const handleScreenShareToggle = () => {
    if (onToggleScreenShare) {
      onToggleScreenShare();
    }
  };

  const handleReaction = (reaction: string) => {
    onSendReaction(reaction);
    setShowReactions(false);
  };

  return (
    <TooltipProvider>
      <div
        className={`relative flex flex-wrap items-center justify-center sm:justify-between gap-3 sm:gap-6 p-3 sm:p-4 bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl ${className}`}
      >
        {/* Left controls - Communication */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isAudioOn ? 'outline' : 'destructive'}
                size="icon"
                onClick={handleAudioToggle}
                className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 relative hover:scale-105 transition-transform ${isAudioOn ? 'border-2 border-border bg-background hover:bg-muted' : ''}`}
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isVideoOn ? 'outline' : 'destructive'}
                size="icon"
                onClick={handleVideoToggle}
                className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:scale-105 transition-transform ${isVideoOn ? 'border-2 border-border bg-background hover:bg-muted' : ''}`}
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isScreenSharing ? 'default' : 'outline'}
                size="icon"
                onClick={handleScreenShareToggle}
                className={`rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:scale-105 transition-transform ${!isScreenSharing ? 'border-2 border-border bg-background hover:bg-muted' : ''}`}
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

        {/* Center controls - on mobile only More is visible; rest are in More menu */}
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {/* Reactions - hidden on mobile */}
          <div className="relative hidden md:block" ref={reactionsRef}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    setShowReactions((prev) => !prev);
                    setShowMoreControls(false);
                  }}
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:scale-105 transition-transform border-2 border-border bg-background hover:bg-muted"
                >
                  <Smile className="w-4 h-4" />
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
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-popover text-popover-foreground backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-border"
                >
                  <div className="flex gap-2">
                    {reactions.map((reaction, index) => (
                      <motion.button
                        key={reaction}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleReaction(reaction)}
                        className="text-2xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-accent"
                      >
                        {reaction}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Virtual Backgrounds - hidden on mobile */}
          {onToggleVirtualBackgrounds && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => { setShowReactions(false); setShowMoreControls(false); onToggleVirtualBackgrounds(); }}
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:scale-105 transition-transform border-2 border-border bg-background hover:bg-muted hidden md:flex"
                >
                  <Palette className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Virtual Backgrounds</TooltipContent>
            </Tooltip>
          )}

          {onToggleCallQuality && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => { setShowReactions(false); setShowMoreControls(false); onToggleCallQuality(); }}
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:scale-105 transition-transform border-2 border-border bg-background hover:bg-muted hidden md:flex"
                >
                  <Activity className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Call Quality</TooltipContent>
            </Tooltip>
          )}

          {onToggleMeetingNotes && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => { setShowReactions(false); setShowMoreControls(false); onToggleMeetingNotes(); }}
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:scale-105 transition-transform border-2 border-border bg-background hover:bg-muted hidden md:flex"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Meeting Notes</TooltipContent>
            </Tooltip>
          )}

          {onToggleAdvancedAudio && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => { setShowReactions(false); setShowMoreControls(false); onToggleAdvancedAudio(); }}
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:scale-105 transition-transform border-2 border-border bg-background hover:bg-muted hidden md:flex"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Advanced Audio</TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isHandRaised ? 'default' : 'secondary'}
                size="icon"
                onClick={onRaiseHand}
                className={`rounded-full w-9 h-9 sm:w-10 sm:h-10 relative hover:scale-105 transition-transform hidden md:flex ${!isHandRaised ? 'border-2 border-border bg-background hover:bg-muted' : ''}`}
              >
                <Hand className="w-4 h-4" />
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => { setShowReactions(false); setShowMoreControls(false); onToggleChat(); }}
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 relative hover:scale-105 transition-transform border-2 border-border bg-background hover:bg-muted hidden md:flex"
              >
                <MessageSquare className="w-4 h-4" />
                {unreadMessages > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Chat {unreadMessages > 0 && `(${unreadMessages})`}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => { setShowReactions(false); setShowMoreControls(false); onToggleParticipants(); }}
                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:scale-105 transition-transform border-2 border-border bg-background hover:bg-muted hidden md:flex"
              >
                <Users className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Participants</TooltipContent>
          </Tooltip>

          {/* More button - always visible; on mobile it contains Chat, Participants, Reactions, etc. */}
          <div className="relative" ref={moreControlsRef}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => {
                    setShowMoreControls((prev) => !prev);
                    setShowReactions(false);
                  }}
                  className="rounded-full w-9 h-9 sm:w-10 sm:h-10 hover:scale-105 transition-transform border-2 border-border bg-background hover:bg-muted"
                >
                  <MoreHorizontal className="w-4 h-4" />
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
                  className="absolute bottom-full right-0 mb-2 bg-popover text-popover-foreground backdrop-blur-xl rounded-xl p-2 shadow-2xl border border-border min-w-48 max-h-[70vh] overflow-y-auto"
                >
                  {/* Mobile-only: Chat, Participants, Reactions, VB, Quality, Notes, Audio, Raise hand */}
                  <div className="md:hidden space-y-0.5 pb-2 mb-2 border-b border-border">
                    {showReactionsInMore ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Reactions</span>
                          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setShowReactionsInMore(false)}>Back</Button>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {reactions.map((reaction) => (
                            <button
                              key={reaction}
                              type="button"
                              onClick={() => { handleReaction(reaction); setShowReactionsInMore(false); setShowMoreControls(false); }}
                              className="text-2xl hover:scale-110 transition-transform p-2 rounded-lg hover:bg-accent"
                            >
                              {reaction}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent relative" onClick={() => { setShowMoreControls(false); onToggleChat(); }}>
                      <MessageSquare className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-left">Chat</span>
                      {unreadMessages > 0 && (
                        <Badge className="h-5 min-w-5 rounded-full px-1.5 text-xs bg-destructive text-destructive-foreground shrink-0">
                          {unreadMessages > 9 ? '9+' : unreadMessages}
                        </Badge>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent relative" onClick={() => { setShowMoreControls(false); onToggleParticipants(); }}>
                      <Users className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-left">Participants</span>
                      <Badge variant="secondary" className="h-5 min-w-5 rounded-full px-1.5 text-xs shrink-0">
                        {participantCount}
                      </Badge>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent" onClick={() => setShowReactionsInMore(true)}>
                      <Smile className="w-4 h-4" />
                      Reactions
                    </Button>
                    {onToggleVirtualBackgrounds && (
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent" onClick={() => { setShowMoreControls(false); onToggleVirtualBackgrounds(); }}>
                        <Palette className="w-4 h-4" />
                        Virtual Backgrounds
                      </Button>
                    )}
                    {onToggleCallQuality && (
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent" onClick={() => { setShowMoreControls(false); onToggleCallQuality(); }}>
                        <Activity className="w-4 h-4" />
                        Call Quality
                      </Button>
                    )}
                    {onToggleMeetingNotes && (
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent" onClick={() => { setShowMoreControls(false); onToggleMeetingNotes(); }}>
                        <FileText className="w-4 h-4" />
                        Meeting Notes
                      </Button>
                    )}
                    {onToggleAdvancedAudio && (
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent" onClick={() => { setShowMoreControls(false); onToggleAdvancedAudio(); }}>
                        <Settings className="w-4 h-4" />
                        Advanced Audio
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent" onClick={() => { setShowMoreControls(false); onRaiseHand(); }}>
                      <Hand className="w-4 h-4" />
                      {isHandRaised ? 'Lower hand' : 'Raise hand'}
                    </Button>
                      </>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent">
                    <Circle className="w-4 h-4" />
                    {isRecording ? 'Stop recording' : 'Start recording'}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent">
                    <Maximize className="w-4 h-4" />
                    Fullscreen
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent">
                    <Grid3X3 className="w-4 h-4" />
                    Layout
                  </Button>
                  {onTogglePictureInPicture && (
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:bg-accent" onClick={onTogglePictureInPicture}>
                      <Minimize2 className="w-4 h-4" />
                      Picture in Picture
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right controls - Management */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isRecording && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-destructive text-destructive-foreground rounded-full"
            >
              <Circle className="w-3 h-3 fill-current" />
              <span className="text-xs sm:text-sm font-medium">REC</span>
            </motion.div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={onEndCall}
                className="rounded-full w-10 h-10 sm:w-12 sm:h-12 hover:scale-105 transition-transform"
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
