export interface PermissionStatus {
  camera: PermissionState | 'not-supported';
  microphone: PermissionState | 'not-supported';
}

export async function checkDevicePermissions(): Promise<PermissionStatus> {
  const status: PermissionStatus = {
    camera: 'not-supported',
    microphone: 'not-supported',
  };

  try {
    if (!navigator.permissions) {
      return status;
    }

    // Check camera permission
    try {
      const cameraPermission = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });
      status.camera = cameraPermission.state;
    } catch (error) {
      console.warn('Camera permission check not supported:', error);
    }

    // Check microphone permission
    try {
      const microphonePermission = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      });
      status.microphone = microphonePermission.state;
    } catch (error) {
      console.warn('Microphone permission check not supported:', error);
    }
  } catch (error) {
    console.error('Error checking device permissions:', error);
  }

  return status;
}

export function getPermissionErrorMessage(
  permission: PermissionState | 'not-supported'
): string {
  switch (permission) {
    case 'denied':
      return 'Permission denied. Please enable camera/microphone access in your browser settings.';
    case 'prompt':
      return 'Permission not granted yet. You may be prompted to allow access.';
    case 'granted':
      return 'Permission granted.';
    case 'not-supported':
      return 'Permission API not supported in this browser.';
    default:
      return 'Unknown permission state.';
  }
}

export async function requestDevicePermissions(): Promise<{
  camera: boolean;
  microphone: boolean;
  error?: string;
}> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const hasVideo = stream.getVideoTracks().length > 0;
    const hasAudio = stream.getAudioTracks().length > 0;

    // Stop the stream immediately
    stream.getTracks().forEach((track) => track.stop());

    return {
      camera: hasVideo,
      microphone: hasAudio,
    };
  } catch (error) {
    console.error('Error requesting device permissions:', error);
    return {
      camera: false,
      microphone: false,
      error:
        error instanceof Error ? error.message : 'Failed to access devices',
    };
  }
}
