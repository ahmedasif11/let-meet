import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Avatar } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  MicOff,
  VideoOff,
  Monitor,
  Pin,
  UserX,
  Hand,
  AlertTriangle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ParticipantVideoProps } from './types';
import { getConnectionColor, getConnectionIcon } from './utils';
import { monitorAudioLevel } from '../../../lib/utils/monitorAudioLevel';
import localMediaStreamsStore from '@/lib/store/localMediaStreamsStore';
import { setupMediaStream } from '@/lib/peer-connection/setUpMediaStream';
import remoteStreamsStore from '@/lib/store/remoteStreamsStore';

// ================= Device Alert Modal =================
const DeviceAlertModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = ({ isOpen, onClose, title, description, icon }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-full">{icon}</div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 mb-6">{description}</p>
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                OK
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ================= Main Component =================
export function ParticipantVideo({
  participant,
  isLarge = false,
  isPinned = false,
  className = '',
  onPin,
  onRemove,
  showControls = false,
}: ParticipantVideoProps) {
  const {
    id,
    name,
    avatar,
    isVideoOn,
    isAudioOn,
    isScreenSharing,
    connectionQuality,
    isHandRaised,
    isSpeaking,
    isHost,
    isYou,
  } = participant;

  const [audioLevel, setAudioLevel] = useState(0);
  const [isLocalSpeaking, setIsLocalSpeaking] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [trackStateVersion, setTrackStateVersion] = useState(0);
  const [deviceAvailability, setDeviceAvailability] = useState({
    hasCamera: true,
    hasMicrophone: true,
    cameraError: '',
    microphoneError: '',
  });

  const [videoEnabled, setVideoEnabled] = useState(isVideoOn);
  const [audioEnabled, setAudioEnabled] = useState(isAudioOn);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ================= Sync with Participant Props =================
  useEffect(() => {
    setVideoEnabled(isVideoOn);
    setAudioEnabled(isAudioOn);
  }, [isVideoOn, isAudioOn]);

  // ================= Device Check =================
  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some((d) => d.kind === 'videoinput');
        const hasMicrophone = devices.some((d) => d.kind === 'audioinput');
        setDeviceAvailability({
          hasCamera,
          hasMicrophone,
          cameraError: hasCamera ? '' : 'No camera device detected',
          microphoneError: hasMicrophone ? '' : 'No microphone device detected',
        });
      } catch {
        setDeviceAvailability({
          hasCamera: false,
          hasMicrophone: false,
          cameraError: 'Error checking camera',
          microphoneError: 'Error checking microphone',
        });
      }
    };
    checkDevices();
  }, []);

  // ================= Local vs Remote Stream =================
  useEffect(() => {
    if (isYou) {
      const streams = localMediaStreamsStore.getLocalMediaStreams();
      if (streams?.length) {
        setStream(streams[0]);
      } else {
        setupMediaStream().then((newStream) => {
          localMediaStreamsStore.setLocalMediaStreams([newStream]);
          setStream(newStream);
        });
      }
    } else {
      const handleUpdate = (streams: { [key: string]: MediaStream }) => {
        const updated = streams[id];
        if (updated) {
          setStream(updated);
          setTrackStateVersion((prev) => prev + 1);
        }
      };
      remoteStreamsStore.subscribe(handleUpdate);
      const initial = remoteStreamsStore.getStream(id);
      if (initial) setStream(initial);
      return () => remoteStreamsStore.unsubscribe(handleUpdate);
    }
  }, [id, isYou]);

  // ================= Real-time Track State Updates =================
  useEffect(() => {
    if (!stream) return;

    // For local participants, poll the actual stream tracks
    // For remote participants, trust the participant state from the hook
    if (isYou) {
      const updateTrackStates = () => {
        const video = stream.getVideoTracks().some((t) => t.enabled);
        const audio = stream.getAudioTracks().some((t) => t.enabled);
        setVideoEnabled(video);
        setAudioEnabled(audio);
      };

      updateTrackStates();
      const interval = setInterval(updateTrackStates, 500); // Poll every 500ms
      return () => clearInterval(interval);
    }
    // For remote participants, we rely on the participant state from the hook
    // which is updated via handleMediaStatusChange
  }, [stream, trackStateVersion, isYou]);

  // ================= Video & Audio Element Binding =================
  useEffect(() => {
    if (videoRef.current && stream) {
      const videoTracks = stream.getVideoTracks();
      videoRef.current.srcObject =
        videoTracks.length > 0 && videoEnabled ? stream : null;
    }
  }, [stream, videoEnabled]);

  useEffect(() => {
    if (audioRef.current && stream) {
      const audioTracks = stream.getAudioTracks();
      audioRef.current.srcObject =
        audioTracks.length > 0 && audioEnabled ? stream : null;
    }
  }, [stream, audioEnabled]);

  // ================= Audio Level Detection =================
  useEffect(() => {
    if (!stream || !audioEnabled) {
      setAudioLevel(0);
      setIsLocalSpeaking(false);
      return;
    }
    const cleanup = monitorAudioLevel({
      stream,
      onLevelChange: (level) => {
        setAudioLevel(level);
        setIsLocalSpeaking(level > 8);
      },
    });
    return cleanup;
  }, [stream, audioEnabled]);

  const isCurrentlySpeaking = isYou ? isLocalSpeaking : isSpeaking;

  // ================= JSX Rendering =================
  return (
    <motion.div
      className={`relative bg-slate-800 rounded-xl overflow-hidden group ${className} ${
        isCurrentlySpeaking ? 'ring-2 ring-green-500' : ''
      } ${isHandRaised ? 'ring-2 ring-yellow-500' : ''} min-h-0 flex-shrink-0`}
      animate={
        isCurrentlySpeaking
          ? { boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.5)' }
          : {}
      }
      transition={{ duration: 0.2 }}
      style={{ minHeight: '200px' }}
    >
      {/* Video or Avatar */}
      {videoEnabled && stream ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted={isYou}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-700">
          <Avatar
            className={isLarge ? 'w-24 h-24' : 'w-16 h-16'}
            src={avatar}
            alt={name}
            fallback={name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          />
        </div>
      )}

      {/* Hidden Audio */}
      {stream && <audio ref={audioRef} autoPlay playsInline muted={isYou} />}

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
          {onPin && (
            <Button
              size="sm"
              variant={isPinned ? 'default' : 'secondary'}
              onClick={onPin}
            >
              <Pin className="w-4 h-4" />
            </Button>
          )}
          {onRemove && !isYou && (
            <Button size="sm" variant="destructive" onClick={onRemove}>
              <UserX className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}

      {/* Left side: badges + raise hand in a row so they don't overlap connection (right) */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 max-w-[calc(100%-4rem)]">
        {isHost && (
          <Badge className="bg-blue-600 text-xs shrink-0">
            Host
          </Badge>
        )}
        {isScreenSharing && (
          <Badge className="bg-green-600 text-xs flex items-center gap-1 shrink-0">
            <Monitor className="w-3 h-3" /> Screen
          </Badge>
        )}
        {isHandRaised && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex items-center justify-center w-7 h-7 rounded-md bg-black/40 text-yellow-400 shrink-0"
          >
            <Hand className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      {/* Connection Quality - top-right so it doesn't overlap raise hand (top-left) */}
      <div
        className={`absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-md bg-black/40 ${getConnectionColor(connectionQuality)} z-10`}
      >
        {(() => {
          const Icon = getConnectionIcon(connectionQuality);
          return <Icon className="w-4 h-4" />;
        })()}
      </div>

      {/* Audio/Video Icons */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium">
            {name} {isYou && '(You)'}
          </span>
          <div className="flex gap-1">
            {!audioEnabled && (
              <div className="p-1.5 bg-red-600 rounded-full">
                <MicOff className="w-3 h-3 text-white" />
              </div>
            )}
            {!videoEnabled && (
              <div className="p-1.5 bg-red-600 rounded-full">
                <VideoOff className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
