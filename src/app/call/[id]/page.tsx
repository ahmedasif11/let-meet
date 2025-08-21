'use client';

import { useEffect, useState } from 'react';
import CallControllers from './call-controllers';
import LocalVideo from './local-video';
import RemoteVideo from './remote-video';
import socket from '../../_lib/sockets/socket';
import remoteStreamsStore from '@/app/_lib/store/remoteStreamsStore';
import localMediaStreamsStore from '../../_lib/store/localMeidaStreamsStore';
import Notification from './notification';

import {
  newUserJoined,
  receiveOffer,
  receiveAnswer,
  receiveIceCandidate,
  userDisconnected,
} from '@/app/_lib/sockets/socketfunctions';
import { useParams } from 'next/navigation';
import JoiningCall from './joining-call';

export default function CallPage() {
  const [isJoinedCall, setIsJoinedCall] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [isRejected, setIsRejected] = useState(false);
  const [pendingUsers, setPendingUsers] = useState<string[]>([]);

  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    socket.emit('joining-request', id);

    const handleJoinedAsAdmin = () => {
      console.log('[Socket] Joined as admin');
      setIsJoinedCall(true);
    };

    const handleJoiningAccepted = () => {
      console.log('[Socket] Joining request accepted');
      setIsJoinedCall(true);
    };

    const handleJoiningRejected = () => {
      console.log('[Socket] Joining request rejected');
      setIsRejected(true);
      setIsJoinedCall(false);
    };

    const handleNewUserJoining = (socketId: string) => {
      console.log('[Socket] New user wants to join:', socketId);
      setPendingUsers((prev) => [...prev, socketId]);
    };

    const handleUserAcceptedAndConnected = (socketId: string) => {
      newUserJoined(socketId);
      console.log('[Socket] newUserJoined called successfully');
    };

    socket.on('joined-as-admin', handleJoinedAsAdmin);
    socket.on('new-user-joining-room', handleNewUserJoining);
    socket.on('joining-request-accepted', handleJoiningAccepted);
    socket.on('joining-request-rejected', handleJoiningRejected);
    socket.on('user-accepted-and-connected', handleUserAcceptedAndConnected);
    socket.on('receive-offer', receiveOffer);
    socket.on('receive-answer', receiveAnswer);
    socket.on('receive-ice-candidate', receiveIceCandidate);
    socket.on('user-disconnected', userDisconnected);

    return () => {
      socket.off('joined-as-admin', handleJoinedAsAdmin);
      socket.off('new-user-joining-room', handleNewUserJoining);
      socket.off('joining-request-accepted', handleJoiningAccepted);
      socket.off('joining-request-rejected', handleJoiningRejected);
      socket.off('user-accepted-and-connected', handleUserAcceptedAndConnected);
      socket.off('receive-offer', receiveOffer);
      socket.off('receive-answer', receiveAnswer);
      socket.off('receive-ice-candidate', receiveIceCandidate);
      socket.off('user-disconnected', userDisconnected);
    };
  }, [id]);

  useEffect(() => {
    const handleRemoteStreams = (streams: { [key: string]: MediaStream }) => {
      setRemoteStreams(Object.values(streams));
    };

    remoteStreamsStore.subscribe(handleRemoteStreams);
    return () => {
      remoteStreamsStore.unsubscribe(handleRemoteStreams);
    };
  }, []);

  const handleAcceptUser = (socketId: string) => {
    const localMediaStreams = localMediaStreamsStore.getLocalMediaStreams();
    if (!localMediaStreams || localMediaStreams.length === 0) {
      console.log('[Admin] No media streams ready, cannot accept user yet');
      alert(
        'Please wait for your camera/microphone to be ready before accepting users'
      );
      return;
    }

    socket.emit('joining-request-accepted', socketId);
    setPendingUsers((prev) => prev.filter((id) => id !== socketId));
  };

  const handleRejectUser = (socketId: string) => {
    socket.emit('joining-request-rejected', socketId);
    setPendingUsers((prev) => prev.filter((id) => id !== socketId));
  };

  if (!isJoinedCall) {
    return <JoiningCall isRejected={isRejected} id={id as string} />;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen relative">
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-4 max-h-screen overflow-y-auto">
        {pendingUsers.map((socketId) => (
          <Notification
            key={socketId}
            socketId={socketId}
            onAccept={() => handleAcceptUser(socketId)}
            onReject={() => handleRejectUser(socketId)}
          />
        ))}
      </div>

      <div className="flex md:flex-row flex-col md:gap-16 gap-4 flex-wrap justify-center items-center mb-18 md:mb-0">
        <LocalVideo className="call-container-rectangular" />
        {remoteStreams.map((stream) => (
          <RemoteVideo
            key={stream.id}
            className="call-container-rectangular"
            stream={stream}
          />
        ))}
      </div>
      <CallControllers />
    </div>
  );
}
