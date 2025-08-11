export async function setupMediaStream() {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available'
    );
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 1280,
        height: 720,
        frameRate: 30,
        facingMode: 'user',
        deviceId: 'default',
        aspectRatio: 16 / 9,
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        deviceId: 'default',
      },
    });

    if (!stream) {
      throw new Error('Failed to get media stream');
    }

    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw error; // Re-throw to handle in the component
  }
}
