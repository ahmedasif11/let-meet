import { ParticipantVideo } from '../ParticipantVideo';
import { ScrollArea } from '../../ui/scroll-area';
import { ParticipantSidebarProps } from './types';
import {
  filterSidebarParticipants,
  shouldShowMainParticipantInSidebar,
} from './utils';

export function ParticipantSidebar({
  participants,
  mainParticipant,
  screenSharingParticipant,
}: ParticipantSidebarProps) {
  const sidebarParticipants = filterSidebarParticipants(
    participants,
    mainParticipant.id
  );
  const showMainInSidebar = shouldShowMainParticipantInSidebar(
    screenSharingParticipant,
    mainParticipant
  );

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 h-full">
      {/* Main video area */}
      <div className="flex-1">
        <ParticipantVideo
          participant={screenSharingParticipant || mainParticipant}
          isLarge={true}
          className="h-48 md:h-full"
        />
      </div>

      {/* Sidebar with thumbnails */}
      <div className="w-full md:w-48 h-32 md:h-full">
        <ScrollArea className="h-full">
          <div className="flex md:flex-col gap-2 p-2">
            {/* Show main participant in sidebar if someone is screen sharing */}
            {showMainInSidebar && (
              <ParticipantVideo
                participant={mainParticipant}
                className="w-24 h-16 md:w-full md:h-24 flex-shrink-0"
              />
            )}

            {sidebarParticipants.map((participant) => (
              <ParticipantVideo
                key={participant.id}
                participant={participant}
                className="w-24 h-16 md:w-full md:h-24 flex-shrink-0"
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
