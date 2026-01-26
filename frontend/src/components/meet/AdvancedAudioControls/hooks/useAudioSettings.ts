import { useState, useEffect } from 'react';
import {
  AudioSettings,
  AudioLevels,
  ProcessingStats,
  TestMode,
} from '../types';

export const useAudioSettings = (
  onSettingsChange: (settings: AudioSettings) => void
) => {
  const [settings, setSettings] = useState<AudioSettings>({
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
  });

  const [audioLevels, setAudioLevels] = useState<AudioLevels>({
    input: 0,
    output: 0,
    noise: 0,
  });

  const [processingStats, setProcessingStats] = useState<ProcessingStats>({
    latency: 12,
    cpuUsage: 15,
    quality: 92,
  });

  const [testMode, setTestMode] = useState<TestMode>('none');
  const [isProcessingTest, setIsProcessingTest] = useState(false);

  // Simulate real-time audio level monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioLevels({
        input: Math.random() * 100,
        output: Math.random() * 80,
        noise: settings.noiseSuppression
          ? Math.random() * 20
          : Math.random() * 60,
      });

      setProcessingStats((prev) => ({
        latency: Math.max(
          5,
          Math.min(25, prev.latency + (Math.random() - 0.5) * 2)
        ),
        cpuUsage: Math.max(
          5,
          Math.min(30, prev.cpuUsage + (Math.random() - 0.5) * 3)
        ),
        quality: Math.max(
          80,
          Math.min(100, prev.quality + (Math.random() - 0.5) * 2)
        ),
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [settings.noiseSuppression]);

  const updateSetting = <K extends keyof AudioSettings>(
    key: K,
    value: AudioSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const runAudioTest = async (type: 'microphone' | 'speaker' | 'echo') => {
    setTestMode(type);
    setIsProcessingTest(true);

    // Simulate test duration
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsProcessingTest(false);
    setTimeout(() => setTestMode('none'), 2000);
  };

  const resetToDefaults = () => {
    const defaultSettings: AudioSettings = {
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
    setSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  return {
    settings,
    audioLevels,
    processingStats,
    testMode,
    isProcessingTest,
    updateSetting,
    runAudioTest,
    resetToDefaults,
  };
};
