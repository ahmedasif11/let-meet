import { QualityMetrics, NetworkStats, CallStats, DeviceStats } from './types';

export const assessQuality = (
  networkStats: NetworkStats,
  callStats: CallStats,
  deviceStats: DeviceStats
): QualityMetrics => {
  const networkScore = calculateNetworkScore(networkStats);
  const callScore = calculateCallScore(callStats);
  const deviceScore = calculateDeviceScore(deviceStats);

  const overallScore = (networkScore + callScore + deviceScore) / 3;

  return {
    overall: getQualityLevel(overallScore),
    network: getQualityLevel(networkScore),
    video: getQualityLevel(callScore),
    audio: getQualityLevel(callScore * 0.8 + networkScore * 0.2),
  };
};

const calculateNetworkScore = (stats: NetworkStats): number => {
  let score = 100;

  // Latency penalty
  if (stats.latency > 200) score -= 30;
  else if (stats.latency > 100) score -= 15;
  else if (stats.latency > 50) score -= 5;

  // Packet loss penalty
  score -= stats.packetLoss * 2;

  // Jitter penalty
  if (stats.jitter > 50) score -= 20;
  else if (stats.jitter > 20) score -= 10;

  return Math.max(0, Math.min(100, score));
};

const calculateCallScore = (stats: CallStats): number => {
  let score = 100;

  // FPS penalty
  if (stats.fps < 15) score -= 40;
  else if (stats.fps < 25) score -= 20;
  else if (stats.fps < 30) score -= 10;

  // Bitrate penalty
  if (stats.bitrate < 500) score -= 30;
  else if (stats.bitrate < 1000) score -= 15;

  return Math.max(0, Math.min(100, score));
};

const calculateDeviceScore = (stats: DeviceStats): number => {
  let score = 100;

  // CPU usage penalty
  if (stats.cpuUsage > 90) score -= 40;
  else if (stats.cpuUsage > 75) score -= 20;
  else if (stats.cpuUsage > 60) score -= 10;

  // Memory usage penalty
  if (stats.memoryUsage > 90) score -= 30;
  else if (stats.memoryUsage > 75) score -= 15;

  return Math.max(0, Math.min(100, score));
};

const getQualityLevel = (
  score: number
): 'excellent' | 'good' | 'fair' | 'poor' => {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
};

export const formatBitrate = (bitrate: number): string => {
  if (bitrate >= 1000) {
    return `${(bitrate / 1000).toFixed(1)} Mbps`;
  }
  return `${bitrate} kbps`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getQualityColor = (quality: string): string => {
  switch (quality) {
    case 'excellent':
      return 'text-green-500';
    case 'good':
      return 'text-blue-500';
    case 'fair':
      return 'text-yellow-500';
    case 'poor':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getSignalStrengthIcon = (strength: number): string => {
  if (strength >= 80) return 'wifi';
  if (strength >= 60) return 'wifi-3';
  if (strength >= 40) return 'wifi-2';
  if (strength >= 20) return 'wifi-1';
  return 'wifi-0';
};
