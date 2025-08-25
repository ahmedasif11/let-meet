import localMediaStreamsStore from '@/lib/store/localMeidaStreamsStore';
import cameraStateStore from '../store/cameraStateChangeStore';

let isCameraOn = true;

export const toggleCamera = () => {
  const streams = localMediaStreamsStore.getLocalMediaStreams();

  const videoTrack = streams
    ?.flatMap((stream) => stream.getVideoTracks())
    .find(Boolean);

  if (!videoTrack) return;

  videoTrack.enabled = !isCameraOn;

  console.log(videoTrack);

  isCameraOn = !isCameraOn;

  cameraStateStore.setCameraEnabled(isCameraOn);
};
