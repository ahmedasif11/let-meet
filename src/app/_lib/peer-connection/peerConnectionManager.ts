import PeerConnection from './peerConnection';

class PeerConnectionManager {
  private connections: { [socketId: string]: PeerConnection } = {};

  createConnection(socketId: string): PeerConnection {
    if (!this.connections[socketId]) {
      this.connections[socketId] = new PeerConnection(socketId);
    }
    return this.connections[socketId];
  }

  getConnection(socketId: string): PeerConnection | null {
    return this.connections[socketId] || null;
  }

  removeConnection(socketId: string): void {
    if (this.connections[socketId]) {
      this.connections[socketId].close();
      delete this.connections[socketId];
    }
  }

  getAllConnections(): { [socketId: string]: PeerConnection } {
    return this.connections;
  }
}

const peerConnectionManager = new PeerConnectionManager();

export default peerConnectionManager;
