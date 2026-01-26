import localMediaStreamsStore from '../store/localMediaStreamsStore';

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

export async function stopMediaStream(stream: MediaStream) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

interface Devices {
  cameras: MediaDeviceInfo[];
  microphones: MediaDeviceInfo[];
  speakers: MediaDeviceInfo[];
}

interface DeviceAvailability {
  hasCamera: boolean;
  hasMicrophone: boolean;
  hasSpeaker: boolean;
  cameraError?: string;
  microphoneError?: string;
  speakerError?: string;
}

export async function getMediaDevices(): Promise<Devices> {
  if (!navigator.mediaDevices?.enumerateDevices) {
    throw new Error('Browser does not support enumerateDevices API');
  }

  if (!localMediaStreamsStore.getLocalMediaStreams().length) {
    const stream = await setupMediaStream();
    localMediaStreamsStore.setLocalMediaStreams([stream]);
  }

  try {
    const deviceList = await navigator.mediaDevices.enumerateDevices();

    console.log('deviceList', deviceList);

    const cameras = deviceList.filter((device) => device.kind === 'videoinput');
    const microphones = deviceList.filter(
      (device) => device.kind === 'audioinput'
    );
    const speakers = deviceList.filter(
      (device) => device.kind === 'audiooutput'
    );

    return { cameras, microphones, speakers };
  } catch (error) {
    console.error('Error getting media devices:', error);
    return { cameras: [], microphones: [], speakers: [] };
  }
}

export async function checkDeviceAvailability(): Promise<DeviceAvailability> {
  const availability: DeviceAvailability = {
    hasCamera: false,
    hasMicrophone: false,
    hasSpeaker: false,
  };

  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Browser does not support getUserMedia API');
    }

    // Check camera availability
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      availability.hasCamera = true;
      videoStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      availability.cameraError =
        error instanceof Error ? error.message : 'Camera access denied';
    }

    // Check microphone availability
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      availability.hasMicrophone = true;
      audioStream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      availability.microphoneError =
        error instanceof Error ? error.message : 'Microphone access denied';
    }

    // Check speaker availability (this is harder to test without playing audio)
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      availability.hasSpeaker = devices.some(
        (device) => device.kind === 'audiooutput'
      );
    } catch (error) {
      availability.speakerError =
        error instanceof Error ? error.message : 'Speaker detection failed';
    }
  } catch (error) {
    console.error('Error checking device availability:', error);
  }

  return availability;
}
