import localMediaStreamsStore from '@/lib/store/localMeidaStreamsStore';

let isMicOn = true;

export const toggleMic = () => {
  const streams = localMediaStreamsStore.getLocalMediaStreams();

  const audioTrack = streams
    .flatMap((stream) => stream.getAudioTracks())
    .find(Boolean);

  if (!audioTrack) return;

  audioTrack.enabled = !isMicOn;

  isMicOn = !isMicOn;
};
