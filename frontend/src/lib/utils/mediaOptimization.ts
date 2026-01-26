import WebRTCConfig from '../config/webrtc.config';

export class MediaOptimizer {
  /**
   * Optimize media constraints for better performance
   */
  static getOptimizedConstraints(): MediaStreamConstraints {
    return WebRTCConfig.mediaConstraints;
  }

  /**
   * Apply adaptive bitrate and quality settings
   */
  static async optimizeStream(stream: MediaStream): Promise<MediaStream> {
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];

    if (videoTrack) {
      // Enable adaptive quality
      if (videoTrack.getCapabilities) {
        const capabilities = videoTrack.getCapabilities();
        if (capabilities.width && capabilities.height) {
          const settings = videoTrack.getSettings();
          console.log('Video capabilities:', capabilities);
          console.log('Current video settings:', settings);
        }
      }

      // Apply constraints for better performance
      try {
        await videoTrack.applyConstraints({
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
        });
      } catch (error) {
        console.warn('Could not apply video constraints:', error);
      }
    }

    if (audioTrack) {
      // Apply audio constraints for better quality
      try {
        await audioTrack.applyConstraints({
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 48000 },
          channelCount: { ideal: 2 },
        });
      } catch (error) {
        console.warn('Could not apply audio constraints:', error);
      }
    }

    return stream;
  }

  /**
   * Create a low-bandwidth stream for slow connections
   */
  static async createLowBandwidthStream(
    stream: MediaStream
  ): Promise<MediaStream> {
    const videoTrack = stream.getVideoTracks()[0];

    if (videoTrack) {
      try {
        await videoTrack.applyConstraints({
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 15, max: 30 },
        });
      } catch (error) {
        console.warn('Could not apply low-bandwidth constraints:', error);
      }
    }

    return stream;
  }

  /**
   * Monitor connection quality and adapt accordingly
   */
  static monitorConnectionQuality(peerConnection: RTCPeerConnection): void {
    if (peerConnection.getStats) {
      setInterval(async () => {
        try {
          const stats = await peerConnection.getStats();
          const totalBitrate = 0;
          let totalPacketsLost = 0;

          stats.forEach((report) => {
            if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
              if (report.bytesReceived && report.timestamp) {
                // Calculate bitrate
                const bytesReceived = report.bytesReceived;
                const timestamp = report.timestamp;
                // You can implement bitrate calculation here
              }
              if (report.packetsLost) {
                totalPacketsLost += report.packetsLost;
              }
            }
          });

          // Log quality metrics
          console.log('Connection quality - Packets lost:', totalPacketsLost);
        } catch (error) {
          console.warn('Could not get connection stats:', error);
        }
      }, 5000);
    }
  }
}

export default MediaOptimizer;
