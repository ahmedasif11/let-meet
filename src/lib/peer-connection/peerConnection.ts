import socket from '../sockets/socket';
import remoteStreamsStore from '../store/remoteStreamsStore';
import WebRTCConfig from '../config/webrtc.config';

class PeerConnection {
  peer: RTCPeerConnection | null = null;
  targetSocketId: string | null = null;

  constructor(targetSocketId?: string) {
    this.targetSocketId = targetSocketId || null;
    this.initializePeerConnection();
  }

  private initializePeerConnection() {
    this.peer = new RTCPeerConnection({
      iceServers: WebRTCConfig.iceServers,
      ...WebRTCConfig.peerConnectionConfig,
    });

    this.peer.onicecandidate = (event) => {
      if (event.candidate && this.targetSocketId) {
        console.log('Ice Candidates: ', event.candidate);

        socket.emit('send-ice-candidate', {
          candidate: event.candidate,
          to: this.targetSocketId,
        });
      }
    };

    this.peer.ontrack = (event) => {
      let stream = event.streams[0];
      if (!stream) {
        stream = new MediaStream([event.track]);
      }
      if (event.track.kind === 'audio') {
        console.log('Received audio track:', event.track);
      }
      console.log(
        'Adding remote stream:',
        stream,
        'for socket ID:',
        this.targetSocketId
      );
      if (this.targetSocketId && stream) {
        remoteStreamsStore.addStream(stream, this.targetSocketId);
      }
    };

    // Add connection state monitoring
    this.peer.onconnectionstatechange = () => {
      console.log('Connection state:', this.peer?.connectionState);
    };

    this.peer.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peer?.iceConnectionState);
    };

    this.peer.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', this.peer?.iceGatheringState);
    };

    // Optimize for better performance and reduce error logging
    this.peer.onicecandidateerror = (event) => {
      // Only log critical ICE errors, not all candidate failures
      if (event.errorCode && event.errorCode !== 701) {
        console.warn('ICE candidate error:', {
          errorCode: event.errorCode,
          errorText: event.errorText,
          url: event.url,
        });
      }
    };
  }

  async createOffer() {
    if (!this.peer) throw new Error('Peer connection not initialized');
    const offer = await this.peer.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });
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
    if (candidate) {
      await this.peer.addIceCandidate(candidate);
    }
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
