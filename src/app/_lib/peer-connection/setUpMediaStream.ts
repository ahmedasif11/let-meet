export async function setupMediaStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('Browser does not support getUserMedia API');
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasAudioInput = devices.some(
      (device) => device.kind === 'audioinput'
    );
    const hasVideoInput = devices.some(
      (device) => device.kind === 'videoinput'
    );

    if (!hasAudioInput && !hasVideoInput) {
      throw new Error('No audio or video input devices found.');
    }

    const constraints: MediaStreamConstraints = {
      audio: hasAudioInput
        ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          }
        : false,
      video: hasVideoInput
        ? {
            width: 1280,
            height: 720,
            frameRate: 30,
            facingMode: 'user',
            aspectRatio: 16 / 9,
          }
        : false,
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error;
  }
}
