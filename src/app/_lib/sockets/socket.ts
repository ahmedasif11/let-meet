import io from 'socket.io-client';
import { getSocketUrl } from '../config';
import WebRTCConfig from '../config/webrtc.config';

let socket: any;

function initSocket(): any {
  if (!socket) {
    const socketUrl = getSocketUrl();

    console.log('Connecting to socket server:', socketUrl);

    socket = io(socketUrl, WebRTCConfig.socketConfig);

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    socket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('Socket disconnected:', reason);
    });
  }
  return socket;
}

const socketInstance = initSocket();

export default socketInstance;
