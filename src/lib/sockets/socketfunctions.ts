import socket from './socket';
import peerConnectionManager from '../peer-connection/peerConnectionManager';
import localMediaStreamsStore from '../store/localMeidaStreamsStore';
import { setupMediaStream } from '@/lib/peer-connection/setUpMediaStream';
import remoteStreamsStore from '../store/remoteStreamsStore';
import { toggleCamera, toggleMic } from '../call-controllers-functions';

const newUserJoined = async (socketId: string) => {
  console.log(
    `[newUserJoined] Setting up connection for new user: ${socketId}`
  );

  const peerConnection = peerConnectionManager.createConnection(socketId);
  const localMediaStreams = localMediaStreamsStore.getLocalMediaStreams();

  if (localMediaStreams.length === 0) {
    console.log(
      `[newUserJoined] No local media streams found! This is the problem.`
    );
    return;
  }

  localMediaStreams.forEach((stream) => {
    stream.getTracks().forEach((track) => {
      const transceiver = peerConnection.peer?.addTransceiver(track.kind, {
        direction: 'sendrecv',
        streams: [stream],
      });
      transceiver?.sender.replaceTrack(track);
    });
  });

  if (peerConnection.getSignalingState() !== 'stable') {
    peerConnection.reset();
  }

  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log('New User Joined and offer sent:', { socketId, offer });

    socket.emit('send-offer', {
      offer,
      to: socketId,
    });
  } catch (error) {
    console.error('Error sending offer:', error);
    peerConnection.reset();
  }
};

const receiveOffer = async ({
  offer,
  from,
}: {
  offer: RTCSessionDescriptionInit;
  from: string;
}) => {
  console.log(`[receiveOffer] Received offer from ${from}`);

  const peerConnection = peerConnectionManager.createConnection(from);
  let localMediaStreams = localMediaStreamsStore.getLocalMediaStreams();

  if (!localMediaStreams || localMediaStreams.length === 0) {
    const stream = await setupMediaStream();
    localMediaStreamsStore.setLocalMediaStreams([stream]);
    localMediaStreams = [stream];
    toggleCamera();
    toggleMic();
  }

  localMediaStreams.forEach((stream) => {
    stream.getTracks().forEach((track) => {
      peerConnection.peer?.addTrack(track, stream);
    });
  });

  if (peerConnection.getSignalingState() !== 'stable') {
    peerConnection.reset();
  }

  try {
    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    console.log('Answer Created and answer sent:', { from, answer });

    socket.emit('send-answer', {
      answer,
      to: from,
    });
  } catch (error) {
    console.error('Error handling received offer:', error);
    peerConnection.reset();
  }
};

const receiveAnswer = async ({
  answer,
  from,
}: {
  answer: RTCSessionDescriptionInit;
  from: string;
}) => {
  const peerConnection = peerConnectionManager.getConnection(from);

  if (!peerConnection) {
    return;
  }

  try {
    await peerConnection.setRemoteDescription(answer);
    console.log('Answer received and remote description set:', { from });
    socket.emit('call-connected', { to: from });
  } catch (error) {
    console.error('Error handling received answer:', error);
    peerConnection.reset();
  }
};

const receiveIceCandidate = async ({
  candidate,
  from,
}: {
  candidate: RTCIceCandidate;
  from: string;
}) => {
  const peerConnection = peerConnectionManager.getConnection(from);

  if (!peerConnection) {
    return;
  }

  try {
    await peerConnection.addIceCandidate(candidate);
    console.log('ICE candidate added:', { candidate, from });
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
  }
};

const userDisconnected = (socketId: string) => {
  const peerConnection = peerConnectionManager.getConnection(socketId);
  remoteStreamsStore.removeStream(socketId);
  peerConnectionManager.removeConnection(socketId);
  peerConnection?.peer?.close();
};

const newUserJoiningRoom = (socketId: string) => {
  // This function is now handled directly in the main component
  // Keeping it for backward compatibility but it's not used anymore
  console.log('New user joining room (legacy function):', socketId);
};

export {
  newUserJoined,
  receiveOffer,
  receiveAnswer,
  receiveIceCandidate,
  userDisconnected,
  newUserJoiningRoom,
};
