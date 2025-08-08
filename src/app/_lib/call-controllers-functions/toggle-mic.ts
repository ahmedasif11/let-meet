import localMediaStreamsStore from '@/app/_lib/store/localMeidaStreamsStore';
import peerConnectionManager from '@/app/_lib/peer-connection/peerConnectionManager';

let isMicOn = true;

export const toggleMic = () => {
  const streams = localMediaStreamsStore.getLocalMediaStreams();

  const audioTrack = streams
    .flatMap((stream) => stream.getAudioTracks())
    .find(Boolean);

  if (!audioTrack) return;

  const connections = peerConnectionManager.getAllConnections?.();
  if (!connections) return;

  Object.values(connections).forEach((connection) => {
    const senders = connection.peer?.getSenders?.() || [];
    const audioSender = senders.find((s) => s.track?.kind === 'audio');

    if (!audioSender) return;

    if (isMicOn) {
      audioSender.replaceTrack(null);
    } else {
      audioSender.replaceTrack(audioTrack);
    }
  });

  isMicOn = !isMicOn;
};
