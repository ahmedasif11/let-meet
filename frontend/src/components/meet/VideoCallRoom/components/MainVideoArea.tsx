import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { MessageSquare, Users } from 'lucide-react';
import { Participant, LayoutMode } from '../types';
import { ParticipantGrid } from '../../ParticipantGrid';

interface MainVideoAreaProps {
  activeParticipants: Participant[];
  screenSharingParticipant?: Participant;
  mainParticipant: Participant;
  layoutMode: LayoutMode;
  handleToggleChat: () => void;
  handleToggleParticipants: () => void;
  unreadMessages: number;
}

export const MainVideoArea: React.FC<MainVideoAreaProps> = ({
  activeParticipants,
  screenSharingParticipant,
  mainParticipant,
  layoutMode,
  handleToggleChat,
  handleToggleParticipants,
  unreadMessages,
}) => {
  return (
    <div className="flex-1 px-6 py-4 overflow-hidden relative min-w-0 min-h-0">
      <motion.div
        layout
        className="h-full w-full"
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <ParticipantGrid
          participants={activeParticipants}
          screenSharingParticipant={screenSharingParticipant}
        />
      </motion.div>

      {/* Quick action buttons (mobile) */}
      <div className="absolute top-4 right-4 md:hidden flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleToggleChat}
          className="rounded-full relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/80"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadMessages > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-600">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </Badge>
          )}
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={handleToggleParticipants}
          className="rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/80"
        >
          <Users className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
