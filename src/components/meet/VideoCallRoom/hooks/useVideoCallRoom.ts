import { useState, useEffect } from 'react';
import {
  Participant,
  Reaction,
  BackgroundOption,
  LayoutMode,
  ConnectionStatus,
  CallSettings,
} from '../types';
import { mockParticipants } from '../mockData';

export const useVideoCallRoom = () => {
  const [participants, setParticipants] =
    useState<Participant[]>(mockParticipants);
  const [participantCount, setParticipantCount] = useState(4);
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

  // Enhanced features state
  const [isVirtualBackgroundsOpen, setIsVirtualBackgroundsOpen] =
    useState(false);
  const [isPictureInPictureMode, setIsPictureInPictureMode] = useState(false);
  const [isCallQualityOpen, setIsCallQualityOpen] = useState(false);
  const [isPreCallSetupOpen, setIsPreCallSetupOpen] = useState(false);
  const [isMeetingNotesOpen, setIsMeetingNotesOpen] = useState(false);
  const [isAdvancedAudioOpen, setIsAdvancedAudioOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
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

  const activeParticipants = participants.slice(0, participantCount);
  const screenSharingParticipant = activeParticipants.find(
    (p) => p.isScreenSharing
  );
  const mainParticipant = activeParticipants[0];

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate speaking participants
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          isSpeaking: Math.random() > 0.8 && p.isAudioOn,
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-remove reactions after 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReactions((prev) => prev.filter((r) => now - r.timestamp < 3000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEndCall = () => {
    if (confirm('Are you sure you want to end the call?')) {
      alert('Call ended!');
    }
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadMessages(0);
    }
  };

  const handleToggleParticipants = () => {
    setIsParticipantsOpen(!isParticipantsOpen);
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    setParticipants((prev) =>
      prev.map((p) => (p.isYou ? { ...p, isHandRaised: !isHandRaised } : p))
    );
  };

  const handleSendReaction = (emoji: string) => {
    const reaction: Reaction = {
      id: Date.now().toString(),
      emoji,
      userId: 'you',
      userName: 'You',
      timestamp: Date.now(),
    };
    setReactions((prev) => [...prev, reaction]);
  };

  const handleParticipantCountChange = (count: number) => {
    setParticipantCount(Math.min(count, participants.length));
  };

  const handleJoinCall = (settings: CallSettings) => {
    setIsPreCallSetupOpen(false);
    setShowPreCallFirst(false);
    setIsAudioOn(settings.microphone.enabled);
    setIsVideoOn(settings.camera.enabled);
    if (settings.backgroundBlur) {
      setCurrentBackground({
        id: 'blur',
        type: 'blur',
        name: 'Blur Background',
        blurAmount: 50,
      });
    }
  };

  const handleTogglePictureInPicture = () => {
    setIsPictureInPictureMode(!isPictureInPictureMode);
  };

  const handleBackgroundChange = (background: BackgroundOption) => {
    setCurrentBackground(background);
  };

  const toggleVirtualBackgrounds = () => {
    setIsVirtualBackgroundsOpen(!isVirtualBackgroundsOpen);
  };

  const toggleCallQuality = () => {
    setIsCallQualityOpen(!isCallQualityOpen);
  };

  const toggleMeetingNotes = () => {
    setIsMeetingNotesOpen(!isMeetingNotesOpen);
  };

  const toggleAdvancedAudio = () => {
    setIsAdvancedAudioOpen(!isAdvancedAudioOpen);
  };

  const handleAudioSettingsChange = (newSettings: any) => {
    setAudioSettings(newSettings);
  };

  const handleToggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    setParticipants((prev) =>
      prev.map((p) => (p.isYou ? { ...p, isAudioOn: !isAudioOn } : p))
    );
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    setParticipants((prev) =>
      prev.map((p) => (p.isYou ? { ...p, isVideoOn: !isVideoOn } : p))
    );
  };

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
    currentBackground,
    showPreCallFirst,
    audioSettings,
    activeParticipants,
    screenSharingParticipant,
    mainParticipant,

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

    // Handlers
    handleEndCall,
    handleToggleChat,
    handleToggleParticipants,
    handleRaiseHand,
    handleSendReaction,
    handleParticipantCountChange,
    handleJoinCall,
    handleTogglePictureInPicture,
    handleBackgroundChange,
    toggleVirtualBackgrounds,
    toggleCallQuality,
    toggleMeetingNotes,
    toggleAdvancedAudio,
    handleAudioSettingsChange,
    handleToggleAudio,
    handleToggleVideo,
  };
};
