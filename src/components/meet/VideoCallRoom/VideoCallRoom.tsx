import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VideoToolbar } from '../VideoToolbar';
import { ChatPanel } from '../ChatPanel';
import { ParticipantsPanel } from '../ParticipantsPanel';
import { ReactionsOverlay } from '../ReactionsOverlay';
import { VirtualBackgroundsPanel } from '../VirtualBackgroundsPanel';
import { CallQualityDashboard } from '../CallQualityDashboard';
import {
  mockCallStats,
  mockNetworkStats,
  mockDeviceStats,
} from '../CallQualityDashboard/mockData';
import { MeetingNotesPanel } from '../MeetingNotesPanel';
import { AdvancedAudioControls } from '../AdvancedAudioControls';
import { PictureInPictureMode } from '../PictureInPictureMode';
import { PreCallSetupRoom } from '../PreCallSteupRoom';
import { TopBar } from './components/TopBar';
import { MainVideoArea } from './components/MainVideoArea';
import { ConnectionStatusOverlay } from './components/ConnectionStatusOverlay';
import { useVideoCallRoom } from './hooks/useVideoCallRoom';
import { MeetingInfo, NotesMeetingInfo } from './types';

export function VideoCallRoom() {
  const {
    // State
    activeParticipants,
    screenSharingParticipant,
    mainParticipant,
    layoutMode,
    reactions,
    unreadMessages,
    isHandRaised,
    isRecording,
    connectionStatus,
    callDuration,
    isChatOpen,
    isParticipantsOpen,
    isVirtualBackgroundsOpen,
    isCallQualityOpen,
    isMeetingNotesOpen,
    isAdvancedAudioOpen,
    isPictureInPictureMode,
    isAudioOn,
    isVideoOn,
    currentBackground,
    showPreCallFirst,
    audioSettings,

    // Setters
    setIsChatOpen,
    setIsParticipantsOpen,
    setIsFullscreen,
    setLayoutMode,
    setUnreadMessages,
    setIsRecording,
    setConnectionStatus,
    setIsVirtualBackgroundsOpen,
    setIsCallQualityOpen,
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
    participantCount,
    isFullscreen,
  } = useVideoCallRoom();

  // Mock meeting info for PreCallSetupRoom
  const preCallMeetingInfo: MeetingInfo = {
    title: 'Team Standup',
    host: 'Alice Johnson',
    participants: activeParticipants.length,
    scheduledTime: new Date(),
  };

  // Mock meeting info for MeetingNotesPanel
  const notesMeetingInfo: NotesMeetingInfo = {
    title: 'Team Standup',
    date: new Date(),
    participants: activeParticipants.map((p) => p.name),
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col overflow-hidden">
      {/* Top bar */}
      <TopBar
        callDuration={callDuration}
        activeParticipantsCount={activeParticipants.length}
        connectionStatus={connectionStatus}
        isRecording={isRecording}
        participantCount={participantCount}
        handleParticipantCountChange={handleParticipantCountChange}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        toggleVirtualBackgrounds={toggleVirtualBackgrounds}
        toggleCallQuality={toggleCallQuality}
        toggleMeetingNotes={toggleMeetingNotes}
        toggleAdvancedAudio={toggleAdvancedAudio}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
      />

      {/* Main video area */}
      <MainVideoArea
        activeParticipants={activeParticipants}
        screenSharingParticipant={screenSharingParticipant}
        mainParticipant={mainParticipant}
        layoutMode={layoutMode}
        handleToggleChat={handleToggleChat}
        handleToggleParticipants={handleToggleParticipants}
        unreadMessages={unreadMessages}
      />

      {/* Bottom toolbar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4"
      >
        <VideoToolbar
          onEndCall={handleEndCall}
          onToggleChat={handleToggleChat}
          onToggleParticipants={handleToggleParticipants}
          onRaiseHand={handleRaiseHand}
          onSendReaction={handleSendReaction}
          onToggleVirtualBackgrounds={toggleVirtualBackgrounds}
          onToggleCallQuality={toggleCallQuality}
          onToggleMeetingNotes={toggleMeetingNotes}
          onTogglePictureInPicture={handleTogglePictureInPicture}
          onToggleAdvancedAudio={toggleAdvancedAudio}
          unreadMessages={unreadMessages}
          isHandRaised={isHandRaised}
          isRecording={isRecording}
          isAudioOn={isAudioOn}
          isVideoOn={isVideoOn}
          onToggleAudio={handleToggleAudio}
          onToggleVideo={handleToggleVideo}
        />
      </motion.div>

      {/* Side panels */}
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <ParticipantsPanel
        isOpen={isParticipantsOpen}
        onClose={() => setIsParticipantsOpen(false)}
        participants={activeParticipants}
        currentUserId="you"
        isHost={true}
      />

      {/* Reactions overlay */}
      <ReactionsOverlay reactions={reactions} />

      {/* Enhanced Feature Panels */}
      <VirtualBackgroundsPanel
        isOpen={isVirtualBackgroundsOpen}
        onClose={() => setIsVirtualBackgroundsOpen(false)}
        onBackgroundChange={handleBackgroundChange}
        currentBackground={currentBackground}
      />

      <CallQualityDashboard
        isOpen={isCallQualityOpen}
        onClose={() => setIsCallQualityOpen(false)}
        callStats={{
          ...mockCallStats,
          duration: callDuration,
          participants: activeParticipants.length,
        }}
        networkStats={mockNetworkStats}
        deviceStats={mockDeviceStats}
      />

      <MeetingNotesPanel
        isOpen={isMeetingNotesOpen}
        onClose={() => setIsMeetingNotesOpen(false)}
        meetingInfo={notesMeetingInfo}
        callDuration={callDuration}
      />

      <AdvancedAudioControls
        isOpen={isAdvancedAudioOpen}
        onClose={() => setIsAdvancedAudioOpen(false)}
        onSettingsChange={handleAudioSettingsChange}
      />

      {/* Pre-call Setup Room */}
      {showPreCallFirst && (
        <PreCallSetupRoom
          isOpen={showPreCallFirst}
          onJoinCall={handleJoinCall}
          onClose={() => setShowPreCallFirst(false)}
          meetingInfo={preCallMeetingInfo}
        />
      )}

      {/* Picture in Picture Mode */}
      <PictureInPictureMode
        isActive={isPictureInPictureMode}
        onToggle={handleTogglePictureInPicture}
        onEndCall={handleEndCall}
        participants={activeParticipants}
        callDuration={callDuration}
        isAudioOn={isAudioOn}
        isVideoOn={isVideoOn}
        onToggleAudio={handleToggleAudio}
        onToggleVideo={handleToggleVideo}
      />

      {/* Connection status overlay */}
      <ConnectionStatusOverlay connectionStatus={connectionStatus} />
    </div>
  );
}
