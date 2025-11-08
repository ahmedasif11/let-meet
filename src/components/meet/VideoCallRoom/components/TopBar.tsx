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
      className="flex items-center justify-between px-6 py-4 bg-slate-800/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-white text-lg font-medium">Team Standup</h1>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span>{formatDuration(callDuration)}</span>
            <span>•</span>
            <span>
              {activeParticipantsCount} participant
              {activeParticipantsCount !== 1 ? 's' : ''}
            </span>
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
              <span
                className={`${getConnectionColor(connectionStatus)} text-green-500`}
              >
                connected
              </span>
            </div>
          </div>
        </div>

        {isRecording && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full text-white"
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm font-medium">Recording</span>
          </motion.div>
        )}
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Page numbers */}
        <div className="hidden lg:flex items-center gap-1 px-3 py-1 bg-slate-700/50 rounded-lg">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
            <Button
              key={count}
              variant={count === 6 ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleParticipantCountChange(count)}
              className="w-8 h-8 text-xs rounded-md"
            >
              {count}
            </Button>
          ))}
        </div>

        {/* Global controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Layout controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-700/50 rounded-lg">
            <Button
              variant={layoutMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setLayoutMode('grid')}
              className="w-8 h-8 rounded-md"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={layoutMode === 'speaker' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setLayoutMode('speaker')}
              className="w-8 h-8 rounded-md"
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </div>

          {/* Global feature buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVirtualBackgrounds}
              className="w-8 h-8 rounded-md hover:bg-slate-600/50"
              title="Virtual Backgrounds"
            >
              <Palette className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCallQuality}
              className="w-8 h-8 rounded-md hover:bg-slate-600/50"
              title="Call Quality"
            >
              <Activity className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMeetingNotes}
              className="w-8 h-8 rounded-md hover:bg-slate-600/50"
              title="Meeting Notes"
            >
              <FileText className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAdvancedAudio}
              className="w-8 h-8 rounded-md hover:bg-slate-600/50"
              title="Advanced Audio"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Fullscreen toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-8 h-8 rounded-md hover:bg-slate-600/50"
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
