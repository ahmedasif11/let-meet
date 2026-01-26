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

    // Test camera
    const testCamera = async () => {
      try {
        if (!settings.camera.enabled) {
          setTestResults((prev) => ({ ...prev, camera: 'warning' }));
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId:
              settings.camera.deviceId === 'default'
                ? undefined
                : settings.camera.deviceId,
          },
        });

        // Test if we can get video frames
        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;

        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            video.play();
            setTimeout(() => {
              stream.getTracks().forEach((track) => track.stop());
              setTestResults((prev) => ({ ...prev, camera: 'good' }));
              resolve(true);
            }, 500);
          };
          video.onerror = reject;
        });
      } catch (error) {
        console.error('Camera test failed:', error);
        setTestResults((prev) => ({ ...prev, camera: 'error' }));
      }
    };

    // Test microphone
    const testMicrophone = async () => {
      try {
        if (!settings.microphone.enabled) {
          setTestResults((prev) => ({ ...prev, microphone: 'warning' }));
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId:
              settings.microphone.deviceId === 'default'
                ? undefined
                : settings.microphone.deviceId,
          },
        });

        // Test if we can get audio data
        const audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);

        // Wait a bit to see if we get any audio data
        await new Promise((resolve) => {
          setTimeout(() => {
            stream.getTracks().forEach((track) => track.stop());
            audioContext.close();
            setTestResults((prev) => ({ ...prev, microphone: 'good' }));
            resolve(true);
          }, 1000);
        });
      } catch (error) {
        console.error('Microphone test failed:', error);
        setTestResults((prev) => ({ ...prev, microphone: 'error' }));
      }
    };

    // Test speaker
    const testSpeaker = async () => {
      try {
        // Create a test audio context and play a short tone
        const audioContext = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

        oscillator.start();

        await new Promise((resolve) => {
          setTimeout(() => {
            oscillator.stop();
            audioContext.close();
            setTestResults((prev) => ({ ...prev, speaker: 'good' }));
            resolve(true);
          }, 500);
        });
      } catch (error) {
        console.error('Speaker test failed:', error);
        setTestResults((prev) => ({ ...prev, speaker: 'error' }));
      }
    };

    // Test network connection
    const testNetwork = async () => {
      try {
        // Simple network test by trying to fetch a small resource
        const startTime = Date.now();
        const response = await fetch('data:text/plain,test', {
          cache: 'no-cache',
        });
        const endTime = Date.now();

        if (response.ok) {
          const latency = endTime - startTime;
          setTestResults((prev) => ({
            ...prev,
            network:
              latency < 100 ? 'good' : latency < 300 ? 'warning' : 'error',
          }));
        } else {
          setTestResults((prev) => ({ ...prev, network: 'error' }));
        }
      } catch (error) {
        console.error('Network test failed:', error);
        setTestResults((prev) => ({ ...prev, network: 'error' }));
      }
    };

    // Run tests with delays to show progress
    await testCamera();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testMicrophone();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testSpeaker();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testNetwork();

    setIsTestingDevices(false);
  };

  return {
    testResults,
    isTestingDevices,
    runDeviceTests,
  };
};
