import { Participant } from './types';

export const filterSidebarParticipants = (
  participants: Participant[],
  mainParticipantId: string
): Participant[] => {
  return participants.filter((p) => p.id !== mainParticipantId);
};

export const shouldShowMainParticipantInSidebar = (
  screenSharingParticipant: Participant | undefined,
  mainParticipant: Participant
): boolean => {
  return !!(
    screenSharingParticipant &&
    mainParticipant.id !== screenSharingParticipant.id
  );
};
