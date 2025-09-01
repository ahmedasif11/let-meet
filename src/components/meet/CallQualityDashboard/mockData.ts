import {
  CallStats,
  NetworkStats,
  DeviceStats,
  PerformanceData,
  Alert,
} from './types';

export const mockCallStats: CallStats = {
  duration: 1847, // 30 minutes 47 seconds
  participants: 8,
  bitrate: 1240, // kbps
  fps: 28,
  resolution: '1920x1080',
  codec: 'H.264',
};

export const mockNetworkStats: NetworkStats = {
  latency: 45, // ms
  jitter: 12, // ms
  packetLoss: 0.2, // %
  bandwidth: 25000, // kbps
  connectionType: 'Wi-Fi',
  signalStrength: 85, // %
};

export const mockDeviceStats: DeviceStats = {
  cpuUsage: 35, // %
  memoryUsage: 68, // %
  gpuUsage: 42, // %
  batteryLevel: 78, // %
  temperature: 45, // °C
};

export const mockPerformanceData: PerformanceData[] = [
  {
    timestamp: Date.now() - 300000,
    latency: 42,
    bitrate: 1200,
    fps: 30,
    packetLoss: 0.1,
  },
  {
    timestamp: Date.now() - 240000,
    latency: 38,
    bitrate: 1250,
    fps: 29,
    packetLoss: 0.2,
  },
  {
    timestamp: Date.now() - 180000,
    latency: 45,
    bitrate: 1180,
    fps: 28,
    packetLoss: 0.3,
  },
  {
    timestamp: Date.now() - 120000,
    latency: 52,
    bitrate: 1150,
    fps: 27,
    packetLoss: 0.4,
  },
  {
    timestamp: Date.now() - 60000,
    latency: 48,
    bitrate: 1220,
    fps: 29,
    packetLoss: 0.2,
  },
  {
    timestamp: Date.now(),
    latency: 45,
    bitrate: 1240,
    fps: 28,
    packetLoss: 0.2,
  },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Network latency increased to 52ms',
    timestamp: Date.now() - 120000,
    resolved: true,
  },
  {
    id: '2',
    type: 'info',
    message: 'Call quality optimized automatically',
    timestamp: Date.now() - 60000,
    resolved: true,
  },
];
