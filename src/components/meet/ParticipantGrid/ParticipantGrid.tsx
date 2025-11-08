import React from 'react';
import { ParticipantVideo } from '../ParticipantVideo';
import { ParticipantGridProps } from './types';

export function ParticipantGrid({
  participants,
  screenSharingParticipant,
}: ParticipantGridProps) {
  const count = participants.length;

  // For 5+ participants, show 2x2 main grid with sidebar
  if (count > 4) {
    const mainParticipants = participants.slice(0, 4);
    const sidebarParticipants = participants.slice(4);

    return (
      <div className="flex h-full gap-4">
        {/* Main 2x2 Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {mainParticipants.map((participant, index) => (
            <ParticipantVideo
              key={participant.id}
              participant={participant}
              className="w-full h-full"
            />
          ))}
        </div>

        {/* Sidebar for additional participants */}
        <div className="w-80 flex flex-col gap-3">
          <div className="text-sm text-gray-400 mb-2 px-2">
            +{sidebarParticipants.length} more participants
          </div>
          {sidebarParticipants.map((participant, index) => (
            <ParticipantVideo
              key={participant.id}
              participant={participant}
              className="w-full aspect-video"
            />
          ))}
        </div>
      </div>
    );
  }

  // Responsive layouts for 1-4 participants
  if (count === 1) {
    return (
      <div className="h-full w-full">
        <ParticipantVideo
          participant={participants[0]}
          className="w-full h-full"
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        {participants.map((participant, index) => (
          <ParticipantVideo
            key={participant.id}
            participant={participant}
            className="w-full h-full"
          />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* All three users get equal space in a row */}
        <ParticipantVideo
          participant={participants[0]}
          className="w-full h-full"
        />
        <ParticipantVideo
          participant={participants[1]}
          className="w-full h-full"
        />
        <ParticipantVideo
          participant={participants[2]}
          className="w-full h-full"
        />
      </div>
    );
  }

  // For 4 participants, use 2x2 grid
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {participants.map((participant, index) => (
        <ParticipantVideo
          key={participant.id}
          participant={participant}
          className="w-full h-full"
        />
      ))}
    </div>
  );
}
