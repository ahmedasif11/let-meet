import React from 'react';
import { motion } from 'motion/react';
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
      {/* Chat & Participants on mobile: only in toolbar More menu (no overlay to avoid hiding Host badge) */}
    </div>
  );
};
