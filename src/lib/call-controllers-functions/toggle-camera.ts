import localMediaStreamsStore from '@/lib/store/localMediaStreamsStore';
import cameraStateStore from '../store/cameraStateChangeStore';

let isCameraOn = true;

export const toggleCamera = () => {
  const streams = localMediaStreamsStore.getLocalMediaStreams();

  if (!streams || streams.length === 0) {
    console.warn('No local media streams found for camera toggle');
    return;
  }

  const videoTrack = streams
    .flatMap((stream) => stream.getVideoTracks())
    .find(Boolean);

  if (!videoTrack) {
    console.warn('No video track found for camera toggle');
    return;
  }

  videoTrack.enabled = !isCameraOn;
  isCameraOn = !isCameraOn;

  console.log(`Camera ${isCameraOn ? 'enabled' : 'disabled'}:`, videoTrack);
  cameraStateStore.setCameraEnabled(isCameraOn);
};
