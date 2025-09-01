import React from 'react';
import { ParticipantVideo } from '../ParticipantVideo';
import { ParticipantGridProps } from './types';
import { getGridClasses, getParticipantSize } from './utils';

export function ParticipantGrid({
  participants,
  screenSharingParticipant,
}: ParticipantGridProps) {
  const count = participants.length;

  // Special layout for 3 participants
  const renderThreeParticipants = () => (
    <>
      <ParticipantVideo
        participant={participants[0]}
        className="col-span-2 h-48 md:h-64"
      />
      <ParticipantVideo
        participant={participants[1]}
        className="h-32 md:h-48"
      />
      <ParticipantVideo
        participant={participants[2]}
        className="h-32 md:h-48"
      />
    </>
  );

  return (
    <div className={`grid gap-2 md:gap-4 h-full ${getGridClasses(count)}`}>
      {count === 3
        ? renderThreeParticipants()
        : participants.map((participant, index) => (
            <ParticipantVideo
              key={participant.id}
              participant={participant}
              className={getParticipantSize(count)}
            />
          ))}
    </div>
  );
}
