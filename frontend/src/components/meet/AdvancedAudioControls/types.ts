export interface AdvancedAudioControlsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: AudioSettings) => void;
}

export interface AudioSettings {
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoGainControl: boolean;
  highPassFilter: boolean;
  voiceEnhancement: boolean;
  musicMode: boolean;
  noiseSuppressionLevel: number;
  echoCancellationLevel: number;
  inputVolume: number;
  outputVolume: number;
  sampleRate: number;
  bitrate: number;
}

export interface AudioLevels {
  input: number;
  output: number;
  noise: number;
}

export interface ProcessingStats {
  latency: number;
  cpuUsage: number;
  quality: number;
}

export type TestMode = 'none' | 'microphone' | 'speaker' | 'echo';
