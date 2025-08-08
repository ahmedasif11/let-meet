import peerConnectionManager from '@/app/_lib/peer-connection/peerConnectionManager';
import localMediaStreamsStore from '@/app/_lib/store/localMeidaStreamsStore';
import socket from '../sockets/socket';

export const endCall = () => {
  peerConnectionManager.resetAllConnections?.();

  const localStreams = localMediaStreamsStore.getLocalMediaStreams();
  localStreams.forEach((stream) => {
    stream.getTracks().forEach((track) => track.stop());
  });
  localMediaStreamsStore.setLocalMediaStreams([]);

  socket.emit('end-call');
};
