'use client';

import io from 'socket.io-client';
import { getSocketUrl } from '../utils/config';
import WebRTCConfig from '../config/webrtc.config';

type SocketType = ReturnType<typeof io>;

let socket: SocketType | null = null;

function initSocket(): SocketType {
  // Only initialize on client-side
  if (typeof window === 'undefined') {
    // Return a no-op socket for SSR
    return {
      on: () => {},
      emit: () => {},
      connect: () => {},
      disconnect: () => {},
      connected: false,
    } as unknown as SocketType;
  }

  if (!socket) {
    // Get socket URL - must be called on client-side
    const socketUrl = getSocketUrl();

    console.log('🔌 Connecting to socket server:', socketUrl);
    console.log('🔌 NEXT_PUBLIC_BACKEND_URL:', process.env.NEXT_PUBLIC_BACKEND_URL || 'not set');
    
    // Warn if using localhost in production-like environment
    if (socketUrl.includes('localhost') && window.location.hostname !== 'localhost') {
      console.warn('⚠️  WARNING: Using localhost backend URL in non-localhost environment!');
      console.warn('⚠️  Set NEXT_PUBLIC_BACKEND_URL in your .env.local file');
    }

    // Enhanced socket config for production and ngrok
    const socketConfig = {
      ...WebRTCConfig.socketConfig,
      // Force polling first, then upgrade to websocket (better for ngrok/production)
      transports: ['polling', 'websocket'],
      // Auto reconnect on disconnect
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      // Timeout settings
      timeout: 20000,
      // Handle both HTTP and HTTPS
      forceNew: false,
      // Allow credentials for CORS
      withCredentials: true,
    };

    socket = io(socketUrl, socketConfig);

    socket.on('connect', () => {
      console.log('✅ Socket connected successfully');
    });

    socket.on('connect_error', (error: Error) => {
      console.error('❌ Socket connection error:', error);
      console.error('Socket URL:', socketUrl);
      console.error('Make sure NEXT_PUBLIC_BACKEND_URL is set correctly');
    });

    socket.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect' && socket) {
        // Server disconnected the socket, reconnect manually
        socket.connect();
      }
    });

    socket.on('reconnect', (attemptNumber: number) => {
      console.log('✅ Socket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log('🔄 Attempting to reconnect...', attemptNumber);
    });

    socket.on('reconnect_error', (error: Error) => {
      console.error('❌ Reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
    });
  }
  return socket;
}

// Initialize socket - this will be called when module loads on client-side
// For SSR, it returns a no-op socket
if (typeof window !== 'undefined' && !socket) {
  socket = initSocket();
}

// Export socket instance
// On client-side: real socket.io instance
// On server-side: no-op mock (via initSocket)
export default socket || initSocket();
