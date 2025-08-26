import peerConnectionManager from '@/lib/peer-connection/peerConnectionManager';
import localMediaStreamsStore from '@/lib/store/localMeidaStreamsStore';
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
