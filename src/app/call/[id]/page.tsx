'use client';

import { useEffect, useState } from 'react';
import CallControllers from './call-controllers';
import LocalVideo from './local-video';
import RemoteVideo from './remote-video';
import socket from '../../_lib/sockets/socket';
import remoteStreamsStore from '@/app/_lib/store/remoteStreamsStore';

import {
  newUserJoined,
  receiveOffer,
  receiveAnswer,
  receiveIceCandidate,
} from '@/app/_lib/sockets/socketfunctions';
import { useParams } from 'next/navigation';

export default function CallPage() {
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      socket.emit('join-room', id);
    }
    socket.on('new-user-joined', newUserJoined);
    socket.on('receive-offer', receiveOffer);
    socket.on('receive-answer', receiveAnswer);
    socket.on('receive-ice-candidate', receiveIceCandidate);

    return () => {
      socket.off('join-room', id);
      socket.off('new-user-joined', newUserJoined);
      socket.off('receive-offer', receiveOffer);
      socket.off('receive-answer', receiveAnswer);
      socket.off('receive-ice-candidate', receiveIceCandidate);
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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
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
