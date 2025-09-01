import peerConnectionManager from '@/lib/peer-connection/peerConnectionManager';
import localMediaStreamsStore from '@/lib/store/localMeidaStreamsStore';
import { setupMediaStream } from '@/lib/peer-connection/setUpMediaStream';
import cameraStateChangeStore from '@/lib/store/cameraStateChangeStore';
import screenShareStateStore from '@/lib/store/screenShareStore';
import { setupScreenShare } from '../peer-connection/setUpScreenShare';

export async function toggleScreenShare() {
  const isScreenSharing = screenShareStateStore.isScreenSharing();

  let newVideoTrack: MediaStreamTrack | null = null;
  let newStream: MediaStream;

  if (!isScreenSharing) {
    const screenStream = await setupScreenShare();
    if (!screenStream) throw new Error('Failed to setup screen share');

    const screenTrack = screenStream.getVideoTracks()[0];
    if (!screenTrack) throw new Error('No video track found in screen stream');

    newVideoTrack = screenTrack;

    const audioTracks = localMediaStreamsStore
      .getLocalMediaStreams()
      .flatMap((s) => s.getAudioTracks());

    newStream = new MediaStream([screenTrack, ...audioTracks]);
    screenShareStateStore.setScreenSharing(true);
  } else {
    const cameraStream = await setupMediaStream();
    const cameraTrack = cameraStream.getVideoTracks()[0];
    if (!cameraTrack) throw new Error('No video track in camera stream');

    const shouldEnableCamera = cameraStateChangeStore.getCameraEnabled();
    cameraTrack.enabled = shouldEnableCamera;

    const audioTracks = cameraStream.getAudioTracks();
    newVideoTrack = cameraTrack;
    newStream = new MediaStream([cameraTrack, ...audioTracks]);
    screenShareStateStore.setScreenSharing(false);
  }

  const peerConnections = peerConnectionManager.getAllConnections();
  for (const socketId in peerConnections) {
    const connection = peerConnections[socketId].peer;
    if (!connection || !newVideoTrack) continue;

    const sender = connection
      .getSenders()
      .find((s) => s.track?.kind === 'video');

    if (sender) {
      await sender.replaceTrack(newVideoTrack);
    } else {
      const localStreams = localMediaStreamsStore.getLocalMediaStreams();
      const stream = localStreams.length > 0 ? localStreams[0] : newStream;
      connection.addTrack(newVideoTrack, stream);
    }
  }

  localMediaStreamsStore.setLocalMediaStreams([newStream]);
}
