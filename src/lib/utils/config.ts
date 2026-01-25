// Configuration for different environments
export const config = {
  // WebRTC configuration
  webrtc: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  },
};

// Get the socket URL from environment variable
// This should be set to your Railway socket server URL in production
// For local development, it should point to http://localhost:3001 (or your socket server port)
export function getSocketUrl(): string {
  // NEXT_PUBLIC_* variables are available on both client and server in Next.js
  // Priority: Use NEXT_PUBLIC_SOCKET_URL if set, otherwise fallback to localhost for dev
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }

  // Fallback for local development if env var not set
  // Default to localhost:3001 (standard socket server port)
  return 'http://localhost:3001';
}
