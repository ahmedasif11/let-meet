// Configuration for different environments
export const config = {
  // Socket server configuration
  socket: {
    // For local development
    local: 'http://localhost:3000',
    // For ngrok or external access - will be auto-detected
    external:
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000',
  },

  // WebRTC configuration
  webrtc: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  },
};

// Get the appropriate socket URL based on environment
export function getSocketUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side, use local
    return config.socket.local;
  }

  // Client-side, detect automatically
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('192.168.');

  if (isLocalhost) {
    return config.socket.local;
  }

  // External access (ngrok, etc.)
  return config.socket.external;
}
