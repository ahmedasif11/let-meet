import { useState, useEffect, useCallback } from 'react';
import {
  Participant,
  Reaction,
  BackgroundOption,
  LayoutMode,
  ConnectionStatus,
  CallSettings,
} from '../types';
import { AudioSettings } from '../../AdvancedAudioControls/types';
import socket from '@/lib/sockets/socket';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/store/redux/store';
import {
  newUserJoined,
  receiveAnswer,
  receiveIceCandidate,
  receiveOffer,
  userDisconnected,
} from '@/lib/sockets/socketfunctions';

import {
  toggleMic,
  toggleCamera,
  endCall,
  toggleScreenShare,
} from '../../../../lib/call-controllers-functions/index';
import { useRouter } from 'next/navigation';
import screenShareStateStore from '@/lib/store/screenShareStore';

export const useVideoCallRoom = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantCount, setParticipantCount] = useState(0);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('connected');
  const [callDuration, setCallDuration] = useState(0);

  const [isVirtualBackgroundsOpen, setIsVirtualBackgroundsOpen] =
    useState(false);
  const [isPictureInPictureMode, setIsPictureInPictureMode] = useState(false);
  const [isCallQualityOpen, setIsCallQualityOpen] = useState(false);
  const [isPreCallSetupOpen, setIsPreCallSetupOpen] = useState(false);
  const [isMeetingNotesOpen, setIsMeetingNotesOpen] = useState(false);
  const [isAdvancedAudioOpen, setIsAdvancedAudioOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<BackgroundOption>({
    id: 'none',
    type: 'none',
    name: 'None',
  });
  const [showPreCallFirst, setShowPreCallFirst] = useState(true);
  const [audioSettings, setAudioSettings] = useState({
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
  });

  const [callSettings, setCallSettings] = useState<CallSettings>({
    camera: { enabled: true, deviceId: 'default', resolution: '720p' },
    microphone: { enabled: true, deviceId: 'default', volume: 80 },
    speaker: { deviceId: 'default', volume: 70 },
    displayName: 'John Doe',
    avatar: '',
    backgroundBlur: false,
  });

  const [pendingParticipants, setPendingParticipants] = useState<Participant[]>(
    []
  );

  const [joiningCall, setJoiningCall] = useState<boolean>(false);
  const [admin, setAdmin] = useState<boolean>(false);
  const activeParticipants = participants;
  const screenSharingParticipant = activeParticipants.find(
    (p) => p.isScreenSharing
  );
  const mainParticipant = activeParticipants[0];

  const dispatch = useDispatch<AppDispatch>();
  const participantsFromStore = useSelector(
    (state: RootState) => state.participant.participants
  );

  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          isSpeaking: Math.random() > 0.8 && p.isAudioOn,
        }))
      );
    }, 2000);
    // Removed excessive logging that was causing performance issues
    return () => clearInterval(interval);
  }, []); // Removed participants dependency to prevent unnecessary re-renders

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReactions((prev) => prev.filter((r) => now - r.timestamp < 3000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on('joined-as-admin', handleJoinedAsAdmin);
    socket.on('new-user-joining-room', handleNewUserJoining);
    socket.on('joining-request-accepted', handleJoiningAccepted);
    socket.on('user-accepted-and-connected', newUserConnected);
    socket.on('receive-offer', receiveOffer);
    socket.on('receive-answer', receiveAnswer);
    socket.on('receive-ice-candidate', receiveIceCandidate);
    socket.on('user-disconnected', handleUserDisconnected);
    socket.on('media-status-change', handleMediaStatusChange);
    socket.on('screen-share-status-change', handleScreenShareStatusChange);

    return () => {
      socket.off('joined-as-admin', handleJoinedAsAdmin);
      socket.off('new-user-joining-room', handleNewUserJoining);
      socket.off('joining-request-accepted', handleJoiningAccepted);
      socket.off('user-accepted-and-connected', newUserConnected);
      socket.off('receive-offer', receiveOffer);
      socket.off('receive-answer', receiveAnswer);
      socket.off('receive-ice-candidate', receiveIceCandidate);
      socket.off('user-disconnected', handleUserDisconnected);
      socket.off('media-status-change', handleMediaStatusChange);
      socket.off('screen-share-status-change', handleScreenShareStatusChange);
    };
  }, []);

  useEffect(() => {
    setParticipants(participantsFromStore);
  }, [participantsFromStore]);

  // Subscribe to screen sharing state changes
  useEffect(() => {
    const handleScreenShareStateChange = (isSharing: boolean) => {
      setIsScreenSharing(isSharing);
    };

    screenShareStateStore.subscribe(handleScreenShareStateChange);

    return () => {
      screenShareStateStore.unsubscribe(handleScreenShareStateChange);
    };
  }, []);

  const handleNewUserJoining = useCallback((user: Participant) => {
    console.log('New user joining: ', user);
    user = { ...user, isYou: false, isHost: false };
    setPendingParticipants((prev) => [...prev, user]);
  }, []);

  const handleJoiningAccepted = useCallback(
    (newParticipants: Participant[]) => {
      console.log('Joining accepted: ', newParticipants);
      setParticipants((prev) => [
        ...prev,
        ...newParticipants,
        {
          id: socket.id,
          name: callSettings?.displayName || 'You',
          avatar: callSettings?.avatar || '',
          isVideoOn: callSettings?.camera.enabled || true,
          isAudioOn: callSettings?.microphone.enabled || true,
          connectionQuality: 'good',
          isHost: false,
          isYou: true,
          joinedAt: new Date().toISOString(),
        },
      ]);

      const effectiveSettings = callSettings;
      setJoiningCall(false);
      setIsPreCallSetupOpen(false);
      setShowPreCallFirst(false);
      setIsAudioOn(effectiveSettings.microphone.enabled);
      setIsVideoOn(effectiveSettings.camera.enabled);
      if (effectiveSettings.backgroundBlur) {
        setCurrentBackground({
          id: 'blur',
          type: 'blur',
          name: 'Blur Background',
          blurAmount: 50,
        });
      }
    },
    [callSettings]
  );

  const handleJoinedAsAdmin = useCallback(() => {
    setTimeout(() => {
      setParticipants((prev) => [
        ...prev,
        {
          id: socket.id,
          name: callSettings?.displayName || 'You',
          avatar: callSettings?.avatar || '',
          isVideoOn: callSettings?.camera.enabled || false,
          isAudioOn: callSettings?.microphone.enabled || false,
          connectionQuality: 'good',
          isYou: true,
          isHost: true,
          joinedAt: new Date().toISOString(),
        },
      ]);

      console.log('Joined as admin');
      const effectiveSettings = callSettings;
      setJoiningCall(false);
      setAdmin(true);
      setIsPreCallSetupOpen(false);
      setShowPreCallFirst(false);
      setIsAudioOn(effectiveSettings.microphone.enabled);
      setIsVideoOn(effectiveSettings.camera.enabled);
      if (effectiveSettings.backgroundBlur) {
        setCurrentBackground({
          id: 'blur',
          type: 'blur',
          name: 'Blur Background',
          blurAmount: 50,
        });
      }
    }, 1000);
  }, [callSettings]);

  const handleJoinCall = useCallback((settings: CallSettings) => {
    console.log('Joining call: ', settings);
    const participant = {
      id: socket.id,
      name: settings.displayName,
      avatar: settings.avatar || '',
      isVideoOn: settings.camera.enabled,
      isAudioOn: settings.microphone.enabled,
    };
    console.log('Joining call: ', participant);
    socket.emit('joining-request', { participant, roomId: '123' });
    setJoiningCall(true);
  }, []);

  const newUserConnected = useCallback((participant: Participant) => {
    setParticipants((prev) => [...prev, participant]);
    newUserJoined(participant.id);
  }, []);

  const onRequestAccepted = useCallback((participant: Participant) => {
    console.log('Request accepted: ', participant);
    setPendingParticipants((prev) =>
      prev.filter((p) => p.id !== participant.id)
    );
    socket.emit('joining-request-accepted', { participant });
  }, []);

  const onRequestRejected = useCallback((participant: Participant) => {
    setPendingParticipants((prev) =>
      prev.filter((p) => p.id !== participant.id)
    );
    socket.emit('joining-request-rejected', participant.id);
  }, []);

  const handleEndCall = useCallback(() => {
    endCall();
    router?.push('/');
  }, []);

  const handleUserDisconnected = (participantId: string) => {
    console.log(participantId);
    console.log(participants);

    setParticipants((prev) => prev.filter((p) => p.id != participantId));
    userDisconnected(participantId);
  };

  const handleMediaStatusChange = useCallback(
    ({
      id,
      videoEnabled,
      audioEnabled,
    }: {
      id: string;
      videoEnabled: boolean;
      audioEnabled: boolean;
    }) => {
      console.log('Media status change received:', {
        id,
        videoEnabled,
        audioEnabled,
      });

      setParticipants((prevParticipants) => {
        console.log('Participant states before updating: ', prevParticipants);

        const updatedParticipants = prevParticipants.map((p) =>
          p.id === id
            ? { ...p, isVideoOn: videoEnabled, isAudioOn: audioEnabled }
            : p
        );

        console.log('Participant states after updating: ', updatedParticipants);
        return updatedParticipants;
      });
    },
    []
  );

  const handleScreenShareStatusChange = useCallback(
    ({
      id,
      isScreenSharing: isSharing,
    }: {
      id: string;
      isScreenSharing: boolean;
    }) => {
      console.log('Screen share status change received:', {
        id,
        isScreenSharing: isSharing,
      });

      setParticipants((prevParticipants) => {
        const updatedParticipants = prevParticipants.map((p) =>
          p.id === id ? { ...p, isScreenSharing: isSharing } : p
        );

        return updatedParticipants;
      });
    },
    []
  );

  const handleToggleChat = useCallback(() => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadMessages(0);
    }
  }, [isChatOpen]);

  const handleToggleParticipants = useCallback(() => {
    setIsParticipantsOpen(!isParticipantsOpen);
  }, [isParticipantsOpen]);

  const handleRaiseHand = useCallback(() => {
    const newHandRaisedState = !isHandRaised;
    setIsHandRaised(newHandRaisedState);
    setParticipants((prev) =>
      prev.map((p) =>
        p.isYou ? { ...p, isHandRaised: newHandRaisedState } : p
      )
    );
  }, [isHandRaised]);

  const handleSendReaction = useCallback((emoji: string) => {
    const reaction: Reaction = {
      id: Date.now().toString(),
      emoji,
      userId: 'you',
      userName: 'You',
      timestamp: Date.now(),
    };
    setReactions((prev) => [...prev, reaction]);
  }, []);

  const handleParticipantCountChange = useCallback(
    (count: number) => {
      setParticipantCount(Math.min(count, participants.length));
    },
    [participants.length]
  );

  const handleTogglePictureInPicture = useCallback(() => {
    setIsPictureInPictureMode(!isPictureInPictureMode);
  }, [isPictureInPictureMode]);

  const handleBackgroundChange = useCallback((background: BackgroundOption) => {
    setCurrentBackground(background);
  }, []);

  const toggleVirtualBackgrounds = useCallback(() => {
    setIsVirtualBackgroundsOpen(!isVirtualBackgroundsOpen);
  }, [isVirtualBackgroundsOpen]);

  const toggleCallQuality = useCallback(() => {
    setIsCallQualityOpen(!isCallQualityOpen);
  }, [isCallQualityOpen]);

  const toggleMeetingNotes = useCallback(() => {
    setIsMeetingNotesOpen(!isMeetingNotesOpen);
  }, [isMeetingNotesOpen]);

  const toggleAdvancedAudio = useCallback(() => {
    setIsAdvancedAudioOpen(!isAdvancedAudioOpen);
  }, [isAdvancedAudioOpen]);

  const handleAudioSettingsChange = useCallback((newSettings: AudioSettings) => {
    setAudioSettings(newSettings);
  }, []);

  const handleToggleAudio = useCallback(() => {
    const newAudioState = !isAudioOn;
    toggleMic();
    setIsAudioOn(newAudioState);

    // Emit the NEW state values, not the old ones
    socket.emit('media-status-change', {
      videoEnabled: isVideoOn,
      audioEnabled: newAudioState,
    });

    setParticipants((prev) =>
      prev.map((p) => (p.isYou ? { ...p, isAudioOn: newAudioState } : p))
    );
  }, [isAudioOn, isVideoOn]);

  const handleToggleVideo = useCallback(() => {
    const newVideoState = !isVideoOn;
    toggleCamera();
    setIsVideoOn(newVideoState);

    // Emit the NEW state values, not the old ones
    socket.emit('media-status-change', {
      videoEnabled: newVideoState,
      audioEnabled: isAudioOn,
    });

    setParticipants((prev) =>
      prev.map((p) => (p.isYou ? { ...p, isVideoOn: newVideoState } : p))
    );
  }, [isVideoOn, isAudioOn]);

  const handleToggleScreenShare = useCallback(async () => {
    try {
      await toggleScreenShare();
      const newScreenSharingState = !isScreenSharing;
      setIsScreenSharing(newScreenSharingState);

      // Update participant state
      setParticipants((prev) =>
        prev.map((p) =>
          p.isYou ? { ...p, isScreenSharing: newScreenSharingState } : p
        )
      );

      // Emit screen sharing status change
      socket.emit('screen-share-status-change', {
        isScreenSharing: newScreenSharingState,
      });
    } catch (error) {
      console.error('Failed to toggle screen share:', error);
      // Optionally show user notification about the error
    }
  }, [isScreenSharing]);

  return {
    // State
    participants,
    participantCount,
    isChatOpen,
    isParticipantsOpen,
    isFullscreen,
    layoutMode,
    reactions,
    unreadMessages,
    isHandRaised,
    isRecording,
    connectionStatus,
    callDuration,
    isVirtualBackgroundsOpen,
    isPictureInPictureMode,
    isCallQualityOpen,
    isPreCallSetupOpen,
    isMeetingNotesOpen,
    isAdvancedAudioOpen,
    isAudioOn,
    isVideoOn,
    isScreenSharing,
    currentBackground,
    showPreCallFirst,
    audioSettings,
    activeParticipants,
    screenSharingParticipant,
    mainParticipant,
    callSettings,
    joiningCall,
    admin,
    pendingParticipants,
    // Setters
    setIsChatOpen,
    setIsParticipantsOpen,
    setIsFullscreen,
    setLayoutMode,
    setUnreadMessages,
    setIsRecording,
    setConnectionStatus,
    setIsVirtualBackgroundsOpen,
    setIsPictureInPictureMode,
    setIsCallQualityOpen,
    setIsPreCallSetupOpen,
    setIsMeetingNotesOpen,
    setIsAdvancedAudioOpen,
    setCurrentBackground,
    setShowPreCallFirst,
    setAudioSettings,
    setCallSettings,
    setJoiningCall,
    setAdmin,
    setPendingParticipants,
    // Handlers
    handleEndCall,
    handleToggleChat,
    handleToggleParticipants,
    handleRaiseHand,
    handleSendReaction,
    handleParticipantCountChange,
    handleJoinCall,
    handleJoiningAccepted,
    handleJoinedAsAdmin,
    handleTogglePictureInPicture,
    handleBackgroundChange,
    toggleVirtualBackgrounds,
    toggleCallQuality,
    toggleMeetingNotes,
    toggleAdvancedAudio,
    handleAudioSettingsChange,
    handleToggleAudio,
    handleToggleVideo,
    handleToggleScreenShare,
    onRequestAccepted,
    onRequestRejected,
    handleMediaStatusChange,
  };
};
