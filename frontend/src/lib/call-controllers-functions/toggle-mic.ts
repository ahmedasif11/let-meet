import localMediaStreamsStore from '@/lib/store/localMediaStreamsStore';

let isMicOn = true;

export const toggleMic = () => {
  const streams = localMediaStreamsStore.getLocalMediaStreams();

  if (!streams || streams.length === 0) {
    console.warn('No local media streams found for mic toggle');
    return;
  }

  const audioTrack = streams
    .flatMap((stream) => stream.getAudioTracks())
    .find(Boolean);

  if (!audioTrack) {
    console.warn('No audio track found for mic toggle');
    return;
  }

  audioTrack.enabled = !isMicOn;
  isMicOn = !isMicOn;

  console.log(`Microphone ${isMicOn ? 'enabled' : 'disabled'}`);
};
