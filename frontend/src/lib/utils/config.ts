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
// This should be set to your backend server URL in production (same as backend API)
// For local development, it should point to http://localhost:3001 (or your backend server port)
// For ngrok: Set NEXT_PUBLIC_BACKEND_URL to your ngrok URL (e.g., https://xxx.ngrok-free.app)
// For production: Set NEXT_PUBLIC_BACKEND_URL to your Railway backend URL
export function getSocketUrl(): string {
  // NEXT_PUBLIC_* variables are available on both client and server in Next.js
  // Check environment variable first (highest priority)
  const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  // If environment variable is set and not the default placeholder, use it
  if (envUrl && 
      envUrl.trim() !== '' && 
      envUrl.trim() !== 'http://localhost:3001' &&
      envUrl.trim() !== 'your_backend_url_here') {
    const url = envUrl.trim();
    // Remove trailing slash if present
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }

  // Client-side: Check if we're on localhost
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If we're on localhost, use localhost backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001';
    }
    // If we're on ngrok or production domain, this is an error
    if (hostname.includes('ngrok') || hostname.includes('vercel.app') || hostname.includes('railway.app')) {
      console.error('❌ NEXT_PUBLIC_BACKEND_URL is not set!');
      console.error('Current hostname:', hostname);
      console.error('Please set NEXT_PUBLIC_BACKEND_URL in your .env.local file');
      // Still return localhost so the app doesn't crash, but it won't work
      return 'http://localhost:3001';
    }
  }

  // Server-side fallback
  if (typeof window === 'undefined') {
    console.warn('⚠️  NEXT_PUBLIC_BACKEND_URL not set. Using localhost fallback for SSR.');
  }

  return 'http://localhost:3001';
}
