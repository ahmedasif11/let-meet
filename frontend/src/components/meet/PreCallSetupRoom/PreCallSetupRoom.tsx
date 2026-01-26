import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';

import {
  Camera,
  CheckCircle,
  X,
  Monitor,
  Users,
  Headphones,
  Settings,
  AlertTriangle,
} from 'lucide-react';

// Import from extracted modules
import {
  PreCallSetupRoomProps,
  CallSettings,
  Devices,
  Step,
  DeviceAvailability,
} from './types';
import { formatTime, canProceedToNextStep } from './utils';
import { useDeviceTesting } from './hooks/useDeviceTesting';
import { Step0CameraMic } from './components/Step0CameraMic';
import { Step1AudioSettings } from './components/Step1AudioSettings';
import { Step2DeviceTesting } from './components/Step2DeviceTesting';
import { Step3ReadyToJoin } from './components/Step3ReadyToJoin';
import {
  getMediaDevices,
  checkDeviceAvailability,
} from '../../../lib/peer-connection/setUpMediaStream';
import { monitorAudioLevel } from '@/lib/utils/monitorAudioLevel';
import localMediaStreamsStore from '@/lib/store/localMediaStreamsStore';

export function PreCallSetupRoom({
  isOpen,
  onJoinCall,
  onClose,
  meetingInfo,
  callSettings,
  setCallSettings,
}: PreCallSetupRoomProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const [devices, setDevices] = useState<Devices>({
    cameras: [],
    microphones: [],
    speakers: [],
  });

  const [deviceAvailability, setDeviceAvailability] =
    useState<DeviceAvailability>({
      hasCamera: false,
      hasMicrophone: false,
      hasSpeaker: false,
    });

  const [audioLevel, setAudioLevel] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const refreshDevices = async () => {
    setIsLoadingDevices(true);
    setDeviceError(null);

    try {
      const availability = await checkDeviceAvailability();
      setDeviceAvailability(availability);

      const deviceList = await getMediaDevices();
      setDevices(deviceList);

      if (!availability.hasCamera && !availability.hasMicrophone) {
        setDeviceError(
          'No camera or microphone devices detected. Please check your device connections and browser permissions.'
        );
      }
    } catch (error) {
      console.error('Error refreshing devices:', error);
      setDeviceError(
        error instanceof Error ? error.message : 'Failed to refresh devices'
      );
    } finally {
      setTimeout(() => setIsLoadingDevices(false), 1000);
    }
  };

  // Use the device testing hook
  const { testResults, isTestingDevices, runDeviceTests } =
    useDeviceTesting(callSettings);

  const steps: Step[] = [
    { title: 'Camera & Microphone', icon: Camera },
    { title: 'Audio Settings', icon: Headphones },
    { title: 'Device Testing', icon: Settings },
    { title: 'Ready to Join', icon: CheckCircle },
  ];

  // Device enumeration and availability checking
  useEffect(() => {
    const initializeDevices = async () => {
      setIsLoadingDevices(true);
      setDeviceError(null);

      try {
        // Check device availability first
        const availability = await checkDeviceAvailability();
        setDeviceAvailability(availability);

        // Get device list
        const deviceList = await getMediaDevices();
        setDevices(deviceList);

        // Update settings based on availability
        setCallSettings((prev) => ({
          ...prev,
          camera: {
            ...prev.camera,
            enabled: availability.hasCamera && prev.camera.enabled,
          },
          microphone: {
            ...prev.microphone,
            enabled: availability.hasMicrophone && prev.microphone.enabled,
          },
        }));

        // Get current stream if available
        const currentStream = localMediaStreamsStore.getLocalMediaStreams()[0];
        setStream(currentStream);

        // Check if we have any devices at all
        if (!availability.hasCamera && !availability.hasMicrophone) {
          setDeviceError(
            'No camera or microphone devices detected. Please check your device connections and browser permissions.'
          );
        }
      } catch (error) {
        console.error('Error initializing devices:', error);
        setDeviceError(
          error instanceof Error
            ? error.message
            : 'Failed to initialize devices'
        );
      } finally {
        setTimeout(() => setIsLoadingDevices(false), 1000);
      }
    };

    initializeDevices();
  }, []);

  // Simulate audio level monitoring
  useEffect(() => {
    if (callSettings.microphone.enabled && stream) {
      const stopMonitoring = monitorAudioLevel({
        stream,
        onLevelChange: setAudioLevel,
      });
      return () => {
        stopMonitoring();
      };
    } else {
      setAudioLevel(0);
    }
  }, [callSettings.microphone.enabled, stream]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl h-[80vh] flex overflow-hidden"
      >
        {/* Left sidebar - Meeting info and progress */}
        <div className="w-80 flex-shrink-0 bg-gray-800/50 p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-white text-xl mb-2">Join Meeting</h2>
            <div className="space-y-2 text-gray-300">
              <p className="text-sm">{meetingInfo.title}</p>
              <p className="text-sm text-gray-400">
                Hosted by {meetingInfo.host}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{meetingInfo.participants} participants</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Monitor className="w-4 h-4" />
                <span>
                  Scheduled for {formatTime(meetingInfo.scheduledTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4 flex-1">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 border border-blue-600/50'
                      : isCompleted
                        ? 'bg-green-600/20'
                        : 'bg-gray-700/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive
                        ? 'bg-blue-600'
                        : isCompleted
                          ? 'bg-green-600'
                          : 'bg-gray-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isActive
                        ? 'text-white'
                        : isCompleted
                          ? 'text-green-400'
                          : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Settings */}
          <div className="space-y-3 mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <Label className="text-gray-300 text-sm">Background Blur</Label>
              <Switch
                checked={callSettings.backgroundBlur}
                onCheckedChange={(checked: boolean) =>
                  setCallSettings((prev) => ({
                    ...prev,
                    backgroundBlur: checked,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white text-lg">{steps[currentStep].title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Step content */}
          <div className="flex-1 min-w-0 p-6 overflow-auto overflow-x-hidden">
            {/* Device Error Display */}
            {deviceError && (
              <div className="mb-6 bg-red-600/20 border border-red-600/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm flex-1">
                    <p className="text-red-400 font-medium mb-1">
                      Device Setup Error
                    </p>
                    <p className="text-red-300 mb-3">{deviceError}</p>
                    <Button
                      onClick={refreshDevices}
                      variant="outline"
                      size="sm"
                      disabled={isLoadingDevices}
                      className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                    >
                      {isLoadingDevices ? 'Refreshing...' : 'Refresh Devices'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <Step0CameraMic
                  settings={callSettings}
                  setSettings={setCallSettings}
                  devices={devices}
                  audioLevel={audioLevel}
                  deviceAvailability={deviceAvailability}
                  isLoadingDevices={isLoadingDevices}
                />
              )}

              {currentStep === 1 && (
                <Step1AudioSettings
                  settings={callSettings}
                  setSettings={setCallSettings}
                  devices={devices}
                  audioLevel={audioLevel}
                />
              )}

              {currentStep === 2 && (
                <Step2DeviceTesting
                  testResults={testResults}
                  isTestingDevices={isTestingDevices}
                  runDeviceTests={runDeviceTests}
                />
              )}

              {currentStep === 3 && (
                <Step3ReadyToJoin
                  settings={callSettings}
                  onJoinCall={onJoinCall}
                  deviceAvailability={deviceAvailability}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer navigation */}
          <div className="p-6 border-t border-gray-700 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                        ? 'bg-green-600'
                        : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={() => {
                if (currentStep === steps.length - 1) {
                  onJoinCall(callSettings);
                } else {
                  setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
                }
              }}
              disabled={!canProceedToNextStep(currentStep, isTestingDevices)}
            >
              {currentStep === steps.length - 1 ? 'Join Meeting' : 'Next'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
