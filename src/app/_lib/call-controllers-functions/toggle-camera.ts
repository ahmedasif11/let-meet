import localMediaStreamsStore from '@/app/_lib/store/localMeidaStreamsStore';
import peerConnectionManager from '@/app/_lib/peer-connection/peerConnectionManager';

let isCameraOn = true;

export const toggleCamera = () => {
  const streams = localMediaStreamsStore.getLocalMediaStreams();
  const videoTracks = streams
    ?.flatMap((stream) => stream.getVideoTracks())
    .find(Boolean);

  if (!videoTracks) return;

  const connections = peerConnectionManager.getAllConnections?.();
  if (!connections) return;

  Object.values(connections).forEach((connection) => {
    const senders = connection.peer?.getSenders?.() || [];
    const videoSender = senders.find((s) => s.track?.kind === 'video');

    if (!videoSender) return;

    if (isCameraOn) {
      videoSender.replaceTrack(null);
    } else {
      videoSender.replaceTrack(videoTracks);
    }
  });

  isCameraOn = !isCameraOn;
};
