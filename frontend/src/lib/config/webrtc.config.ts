export const WebRTCConfig = {
  iceServers: [
    // Primary STUN servers (more reliable)
    {
      urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
    },
    // Free TURN servers (remove problematic ones)
    {
      urls: ['turn:openrelay.metered.ca:80', 'turn:openrelay.metered.ca:443'],
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    // Remove Twilio TURN servers that are causing errors
    // Add more reliable free TURN servers
    {
      urls: ['turn:relay.metered.ca:80', 'turn:relay.metered.ca:443'],
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],

  peerConnectionConfig: {
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle' as RTCBundlePolicy,
    rtcpMuxPolicy: 'require' as RTCRtcpMuxPolicy,
    iceTransportPolicy: 'all' as RTCIceTransportPolicy,
    // Add connection optimization settings
    iceCandidateTimeout: 10000, // 10 seconds timeout for ICE candidates
  },

  mediaConstraints: {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 },
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  },

  socketConfig: {
    transports: ['websocket', 'polling'],
    upgrade: true,
    rememberUpgrade: true,
    timeout: 20000,
    forceNew: true,
  },

  connectionTimeouts: {
    iceGatheringTimeout: 10000,
    connectionTimeout: 30000,
    offerTimeout: 15000,
  },
};

export default WebRTCConfig;
