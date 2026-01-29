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
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-2xl border border-border w-full max-w-4xl min-h-[70vh] max-h-[95vh] flex flex-col lg:flex-row overflow-hidden shadow-xl"
      >
        {/* Left sidebar - Meeting info and progress (stacked on mobile) */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-muted/30 p-4 sm:p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-border">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-foreground text-lg sm:text-xl font-semibold mb-2">Join Meeting</h2>
            <div className="space-y-2 text-muted-foreground text-sm">
              <p className="font-medium text-foreground">{meetingInfo.title}</p>
              <p>Hosted by {meetingInfo.host}</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 shrink-0" />
                <span>{meetingInfo.participants} participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 shrink-0" />
                <span>Scheduled for {formatTime(meetingInfo.scheduledTime)}</span>
              </div>
            </div>
          </div>

          {/* Progress Steps - horizontal on mobile, vertical on desktop */}
          <div className="flex lg:flex-col gap-2 sm:gap-4 flex-1 overflow-x-auto pb-2 lg:pb-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;
              const isCompleted = currentStep > index;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors shrink-0 lg:shrink ${
                    isActive
                      ? 'bg-primary/20 border border-primary/50'
                      : isCompleted
                        ? 'bg-green-600/20 dark:bg-green-500/20'
                        : 'bg-muted/50'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                          ? 'bg-green-600 dark:bg-green-500 text-white'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm whitespace-nowrap ${
                      isActive ? 'text-foreground font-medium' : isCompleted ? 'text-green-700 dark:text-green-400' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Background Blur</Label>
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
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between shrink-0">
            <h3 className="text-foreground text-base sm:text-lg font-medium">{steps[currentStep].title}</h3>
            <Button variant="outline" size="icon" onClick={onClose} className="shrink-0 border-border">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 min-w-0 p-4 sm:p-6 overflow-auto overflow-x-hidden">
            {/* Device Error Display */}
            {deviceError && (
              <div className="mb-6 bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="text-sm flex-1">
                    <p className="text-destructive font-medium mb-1">Device Setup Error</p>
                    <p className="text-muted-foreground mb-3">{deviceError}</p>
                    <Button onClick={refreshDevices} variant="outline" size="sm" disabled={isLoadingDevices} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
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

          <div className="p-4 sm:p-6 border-t border-border flex items-center justify-between gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="shrink-0 border-border"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-primary' : index < currentStep ? 'bg-green-600' : 'bg-muted'
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
              className="shrink-0"
            >
              {currentStep === steps.length - 1 ? 'Join Meeting' : 'Next'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
