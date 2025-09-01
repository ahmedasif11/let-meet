import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import {
  Maximize,
  Minimize,
  Monitor,
  Grid3X3,
  Users,
  MessageSquare,
  Palette,
  Activity,
  FileText,
  Settings,
} from 'lucide-react';
import { ConnectionStatus, LayoutMode } from '../types';
import {
  formatDuration,
  getConnectionIcon,
  getConnectionColor,
  getConnectionStatusText,
} from '../utils';

interface TopBarProps {
  callDuration: number;
  activeParticipantsCount: number;
  connectionStatus: ConnectionStatus;
  isRecording: boolean;
  participantCount: number;
  handleParticipantCountChange: (count: number) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleVirtualBackgrounds: () => void;
  toggleCallQuality: () => void;
  toggleMeetingNotes: () => void;
  toggleAdvancedAudio: () => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  callDuration,
  activeParticipantsCount,
  connectionStatus,
  isRecording,
  participantCount,
  handleParticipantCountChange,
  layoutMode,
  setLayoutMode,
  toggleVirtualBackgrounds,
  toggleCallQuality,
  toggleMeetingNotes,
  toggleAdvancedAudio,
  isFullscreen,
  setIsFullscreen,
}) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-xl border-b border-white/10"
    >
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg">Team Standup</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span>{formatDuration(callDuration)}</span>
            <span>•</span>
            <span>{activeParticipantsCount} participants</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              {(() => {
                const Icon = getConnectionIcon(connectionStatus);
                return (
                  <Icon
                    className={`w-4 h-4 ${getConnectionColor(connectionStatus)}`}
                  />
                );
              })()}
              <span className={getConnectionColor(connectionStatus)}>
                {connectionStatus === 'reconnecting'
                  ? 'Reconnecting...'
                  : getConnectionStatusText(connectionStatus)}
              </span>
            </div>
          </div>
        </div>

        {isRecording && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full"
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm">Recording</span>
          </motion.div>
        )}
      </div>

      {/* Demo controls and layout toggles */}
      <div className="flex items-center gap-2">
        {/* Participant count controls (demo) */}
        <div className="hidden md:flex gap-1">
          {[1, 2, 3, 4, 5, 6].map((count) => (
            <Button
              key={count}
              variant={participantCount === count ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleParticipantCountChange(count)}
              className="w-8 h-8 text-xs"
            >
              {count}
            </Button>
          ))}
        </div>

        {/* Enhanced controls */}
        <div className="hidden md:flex gap-1 ml-4">
          {/* Layout controls */}
          <Button
            variant={layoutMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setLayoutMode('grid')}
            className="w-8 h-8"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={layoutMode === 'speaker' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setLayoutMode('speaker')}
            className="w-8 h-8"
          >
            <Monitor className="w-4 h-4" />
          </Button>

          {/* Enhanced feature buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVirtualBackgrounds}
            className="w-8 h-8"
            title="Virtual Backgrounds"
          >
            <Palette className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCallQuality}
            className="w-8 h-8"
            title="Call Quality"
          >
            <Activity className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMeetingNotes}
            className="w-8 h-8"
            title="Meeting Notes"
          >
            <FileText className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAdvancedAudio}
            className="w-8 h-8"
            title="Advanced Audio"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* Fullscreen toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-8 h-8"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.div>
  );
};
