import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { MessageSquare, Users } from 'lucide-react';
import { Participant, LayoutMode } from '../types';

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
    <div className="flex-1 p-4 overflow-hidden relative">
      <motion.div
        layout
        className="h-full"
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        {activeParticipants.length <= 4 && layoutMode === 'grid' ? (
          <div className="grid gap-2 md:gap-4 h-full grid-cols-2 grid-rows-2">
            {activeParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className={`bg-gray-800 rounded-lg overflow-hidden ${
                  participant.isScreenSharing ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                      {participant.avatar ? (
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <span className="text-xl font-bold">
                          {participant.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{participant.name}</p>
                    {participant.isScreenSharing && (
                      <p className="text-xs">Screen Sharing</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full bg-gray-800 rounded-lg overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {mainParticipant.avatar ? (
                    <img
                      src={mainParticipant.avatar}
                      alt={mainParticipant.name}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-2xl font-bold">
                      {mainParticipant.name.charAt(0)}
                    </span>
                  )}
                </div>
                <p className="text-lg">{mainParticipant.name}</p>
                {mainParticipant.isScreenSharing && (
                  <p className="text-sm">Screen Sharing</p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick action buttons (mobile) */}
      <div className="absolute top-4 right-4 md:hidden flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleToggleChat}
          className="rounded-full relative"
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
          className="rounded-full"
        >
          <Users className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
