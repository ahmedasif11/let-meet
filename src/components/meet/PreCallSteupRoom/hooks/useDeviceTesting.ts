import { useState } from 'react';
import { TestResults, CallSettings } from '../types';

export const useDeviceTesting = (settings: CallSettings) => {
  const [testResults, setTestResults] = useState<TestResults>({
    camera: 'pending',
    microphone: 'pending',
    speaker: 'pending',
    network: 'pending',
  });

  const [isTestingDevices, setIsTestingDevices] = useState(false);

  const runDeviceTests = async () => {
    setIsTestingDevices(true);

    // Reset test results
    setTestResults({
      camera: 'pending',
      microphone: 'pending',
      speaker: 'pending',
      network: 'pending',
    });

    // Simulate testing each device with delays
    const testCamera = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          setTestResults((prev) => ({
            ...prev,
            camera: settings.camera.enabled ? 'good' : 'warning',
          }));
          resolve(true);
        }, 1000);
      });

    const testMicrophone = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          setTestResults((prev) => ({
            ...prev,
            microphone: settings.microphone.enabled ? 'good' : 'warning',
          }));
          resolve(true);
        }, 1500);
      });

    const testSpeaker = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          setTestResults((prev) => ({ ...prev, speaker: 'good' }));
          resolve(true);
        }, 2000);
      });

    const testNetwork = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          setTestResults((prev) => ({
            ...prev,
            network: Math.random() > 0.2 ? 'good' : 'warning',
          }));
          resolve(true);
        }, 2500);
      });

    await Promise.all([
      testCamera(),
      testMicrophone(),
      testSpeaker(),
      testNetwork(),
    ]);
    setIsTestingDevices(false);
  };

  return {
    testResults,
    isTestingDevices,
    runDeviceTests,
  };
};
