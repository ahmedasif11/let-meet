import io from 'socket.io-client';

let socket: any;

function initSocket(): any {
  if (!socket) {
    socket = io('http://localhost:3000');
  }
  return socket;
}

const socketInstance = initSocket();

export default socketInstance;
