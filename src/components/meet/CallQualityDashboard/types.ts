export interface CallQualityDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  callStats: CallStats;
  networkStats: NetworkStats;
  deviceStats: DeviceStats;
}

export interface CallStats {
  duration: number;
  participants: number;
  bitrate: number;
  fps: number;
  resolution: string;
  codec: string;
}

export interface NetworkStats {
  latency: number;
  jitter: number;
  packetLoss: number;
  bandwidth: number;
  connectionType: string;
  signalStrength: number;
}

export interface DeviceStats {
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage?: number;
  batteryLevel?: number;
  temperature?: number;
}

export interface QualityMetrics {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  audio: 'excellent' | 'good' | 'fair' | 'poor';
  video: 'excellent' | 'good' | 'fair' | 'poor';
  network: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface PerformanceData {
  timestamp: number;
  latency: number;
  bitrate: number;
  fps: number;
  packetLoss: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  resolved: boolean;
}
