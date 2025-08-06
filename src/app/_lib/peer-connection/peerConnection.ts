import socket from '../sockets/socket';

class PeerConnection {
  peer: RTCPeerConnection | null = null;
  targetSocketId: string | null = null;

  constructor(targetSocketId?: string) {
    this.targetSocketId = targetSocketId || null;
    this.initializePeerConnection();
  }

  private initializePeerConnection() {
    this.peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: ['stun:stun.l.google.com:19302'],
        },
      ],
    });

    this.peer.onicecandidate = (event) => {
      if (event.candidate && this.targetSocketId) {
        socket.emit('send-ice-candidate', {
          candidate: event.candidate,
          to: this.targetSocketId,
        });
      }
    };
  }

  async createOffer() {
    if (!this.peer) throw new Error('Peer connection not initialized');
    const offer = await this.peer.createOffer();
    return offer;
  }

  async createAnswer() {
    if (!this.peer) throw new Error('Peer connection not initialized');
    const answer = await this.peer.createAnswer();
    return answer;
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit) {
    if (!this.peer) throw new Error('Peer connection not initialized');

    try {
      await this.peer.setRemoteDescription(description);
    } catch (error) {
      throw error;
    }
  }

  async setLocalDescription(description: RTCSessionDescriptionInit) {
    if (!this.peer) throw new Error('Peer connection not initialized');

    try {
      await this.peer.setLocalDescription(description);
    } catch (error) {
      throw error;
    }
  }

  async addIceCandidate(candidate: RTCIceCandidate) {
    if (!this.peer) throw new Error('Peer connection not initialized');
    await this.peer.addIceCandidate(candidate);
  }

  async close() {
    if (this.peer) {
      this.peer.close();
    }
  }

  getSignalingState() {
    return this.peer?.signalingState || 'closed';
  }

  reset() {
    if (this.peer) {
      this.peer.close();
    }
    this.initializePeerConnection();
  }

  setTargetSocketId(socketId: string) {
    this.targetSocketId = socketId;
  }
}

export default PeerConnection;
