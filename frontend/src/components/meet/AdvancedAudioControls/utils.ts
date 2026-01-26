import { AudioSettings } from './types';

export const getQualityColor = (value: number) => {
  if (value >= 90) return 'text-green-500';
  if (value >= 75) return 'text-yellow-500';
  return 'text-red-500';
};

export const getTestIcon = (testMode: string, isProcessingTest: boolean) => {
  if (testMode === 'none') return 'Play';
  if (isProcessingTest) return 'Settings';
  return 'CheckCircle';
};

export const resetToDefaults = (): AudioSettings => {
  return {
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
    highPassFilter: false,
    voiceEnhancement: true,
    musicMode: false,
    noiseSuppressionLevel: 75,
    echoCancellationLevel: 80,
    inputVolume: 80,
    outputVolume: 70,
    sampleRate: 48000,
    bitrate: 128,
  };
};
