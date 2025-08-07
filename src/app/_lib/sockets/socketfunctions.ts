import socket from './socket';
import peerConnectionManager from '../peer-connection/peerConnectionManager';
import localMediaStreamsStore from '../store/localMeidaStreamsStore';

const newUserJoined = async (socketId: string) => {
  const peerConnection = peerConnectionManager.createConnection(socketId);
  const localMediaStreams = localMediaStreamsStore.getLocalMediaStreams();

  localMediaStreams.forEach((stream) => {
    stream.getTracks().forEach((kind) => {
      peerConnection.peer?.addTransceiver(kind, {
        direction: 'sendrecv',
      });
      peerConnection.peer?.addTrack(kind, stream);
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
    peerConnection.reset();
  }
};

const receiveOffer = async ({ offer, from }: { offer: any; from: any }) => {
  const peerConnection = peerConnectionManager.createConnection(from);

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
    peerConnection.reset();
  }
};

const receiveAnswer = async ({ answer, from }: { answer: any; from: any }) => {
  const peerConnection = peerConnectionManager.getConnection(from);

  if (!peerConnection) {
    return;
  }

  try {
    await peerConnection.setRemoteDescription(answer);
    console.log('Answer received and remote description set:', { from });
    socket.emit('call-connected', { to: from });
  } catch (error) {
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

const callConnected = async ({ from }: { from: any }) => {
  console.log('Call Connected:', { from });
  socket.emit('i-am-connected', { to: from });
};

export {
  newUserJoined,
  receiveOffer,
  receiveAnswer,
  receiveIceCandidate,
  callConnected,
};
