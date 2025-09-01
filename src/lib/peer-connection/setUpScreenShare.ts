export const setupScreenShare = async (audio = true) => {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error('getDisplayMedia is not supported in this browser.');
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        width: 1280,
        height: 720,
        frameRate: 15,
      },
      audio: audio,
    });

    return stream;
  } catch (error) {
    console.error('Error setting up screen share:', error);
    return null;
  }
};
