import { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { Badge } from '../../ui/badge';
import { Avatar } from '../../ui/avatar';
import { Separator } from '../../ui/separator';
import {
  X,
  Search,
  UserPlus,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Crown,
  Hand,
  MoreVertical,
  UserX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ParticipantsPanelProps, Participant } from './types';
import { getConnectionColor } from './utils';

export function ParticipantsPanel({
  isOpen,
  onClose,
  participants,
  currentUserId = 'you',
  isHost = false,
  className = '',
}: ParticipantsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null
  );

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleParticipantAction = (participantId: string, action: string) => {
    console.log(`${action} for participant ${participantId}`);
    setSelectedParticipant(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl border-l border-white/10 z-50 flex flex-col ${className}`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div>
              <h3 className="text-white">Participants</h3>
              <p className="text-sm text-gray-400">
                {participants.length} in call
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search and invite */}
          <div className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search participants..."
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite others
            </Button>
          </div>

          <Separator className="bg-white/10" />

          {/* Participants list */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredParticipants.map((participant) => (
                <motion.div
                  key={participant.id}
                  layout
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
                >
                  {/* Avatar and status */}
                  <div className="relative">
                    <Avatar
                      className="w-10 h-10"
                      src={participant.avatar}
                      fallback={participant.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    />

                    {/* Connection quality indicator */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                        participant.connectionQuality === 'good'
                          ? 'bg-green-500'
                          : participant.connectionQuality === 'poor'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    />
                  </div>

                  {/* Participant info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm truncate">
                        {participant.name}
                        {participant.isYou && ' (You)'}
                      </span>

                      {participant.isHost && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}

                      {participant.isHandRaised && (
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="text-sm"
                        >
                          ✋
                        </motion.span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      {/* Audio/Video status */}
                      <div
                        className={`p-0.5 rounded ${participant.isAudioOn ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {participant.isAudioOn ? (
                          <Mic className="w-3 h-3" />
                        ) : (
                          <MicOff className="w-3 h-3" />
                        )}
                      </div>

                      <div
                        className={`p-0.5 rounded ${participant.isVideoOn ? 'text-green-500' : 'text-red-500'}`}
                      >
                        {participant.isVideoOn ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <VideoOff className="w-3 h-3" />
                        )}
                      </div>

                      {participant.isSpeaking && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-600 text-white"
                        >
                          Speaking
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Participant controls (for hosts) */}
                  {isHost && !participant.isYou && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setSelectedParticipant(
                            selectedParticipant === participant.id
                              ? null
                              : participant.id
                          )
                        }
                        className="h-8 w-8 text-gray-400 hover:text-white"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>

                      <AnimatePresence>
                        {selectedParticipant === participant.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -10 }}
                            className="absolute right-4 mt-2 bg-gray-800 rounded-lg shadow-xl border border-white/10 py-2 z-10"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleParticipantAction(participant.id, 'mute')
                              }
                              className="w-full justify-start text-left px-4 py-2 text-sm"
                            >
                              {participant.isAudioOn ? (
                                <MicOff className="w-4 h-4 mr-2" />
                              ) : (
                                <Mic className="w-4 h-4 mr-2" />
                              )}
                              {participant.isAudioOn ? 'Mute' : 'Unmute'}
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleParticipantAction(
                                  participant.id,
                                  'remove'
                                )
                              }
                              className="w-full justify-start text-left px-4 py-2 text-sm text-red-400 hover:text-red-300"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
