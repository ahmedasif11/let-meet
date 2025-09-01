import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
} from 'lucide-react';

// Import from extracted modules
import { PreCallSetupRoomProps, CallSettings, Devices, Step } from './types';
import { formatTime, canProceedToNextStep } from './utils';
import { useDeviceTesting } from './hooks/useDeviceTesting';
import { Step0CameraMic } from './components/Step0CameraMic';
import { Step1AudioSettings } from './components/Step1AudioSettings';
import { Step2DeviceTesting } from './components/Step2DeviceTesting';
import { Step3ReadyToJoin } from './components/Step3ReadyToJoin';
import { getMediaDevices } from '../../../lib/peer-connection/setUpMediaStream';
import { monitorAudioLevel } from '@/lib/utils/monitorAudioLevel';
import localMediaStreamsStore from '@/lib/store/localMeidaStreamsStore';

export function PreCallSetupRoom({
  isOpen,
  onJoinCall,
  onClose,
  meetingInfo,
}: PreCallSetupRoomProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [settings, setSettings] = useState<CallSettings>({
    camera: { enabled: true, deviceId: 'default', resolution: '720p' },
    microphone: { enabled: true, deviceId: 'default', volume: 80 },
    speaker: { deviceId: 'default', volume: 70 },
    displayName: 'John Doe',
    backgroundBlur: false,
  });

  const [devices, setDevices] = useState<Devices>({
    cameras: [],
    microphones: [],
    speakers: [],
  });

  const [audioLevel, setAudioLevel] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Use the device testing hook
  const { testResults, isTestingDevices, runDeviceTests } =
    useDeviceTesting(settings);

  const steps: Step[] = [
    { title: 'Camera & Microphone', icon: Camera },
    { title: 'Audio Settings', icon: Headphones },
    { title: 'Device Testing', icon: Settings },
    { title: 'Ready to Join', icon: CheckCircle },
  ];

  // Mock device enumeration
  useEffect(() => {
    getMediaDevices().then((devices: Devices) => {
      console.log('devices', devices);
      setDevices(devices);
      const currentStream = localMediaStreamsStore.getLocalMediaStreams()[0];
      setStream(currentStream);
    });
    // setDevices({
    //   cameras: [
    //     { deviceId: 'default', label: 'Default Camera', kind: 'videoinput' },
    //     { deviceId: 'hd-webcam', label: 'HD Webcam', kind: 'videoinput' },
    //     {
    //       deviceId: 'integrated-camera',
    //       label: 'Integrated Camera',
    //       kind: 'videoinput',
    //     },
    //   ],
    //   microphones: [
    //     {
    //       deviceId: 'default',
    //       label: 'Default Microphone',
    //       kind: 'audioinput',
    //     },
    //     { deviceId: 'usb-mic', label: 'USB Microphone', kind: 'audioinput' },
    //     {
    //       deviceId: 'built-in-mic',
    //       label: 'Built-in Microphone',
    //       kind: 'audioinput',
    //     },
    //   ],
    //   speakers: [
    //     { deviceId: 'default', label: 'Default Speakers', kind: 'audiooutput' },
    //     {
    //       deviceId: 'headphones',
    //       label: 'Bluetooth Headphones',
    //       kind: 'audiooutput',
    //     },
    //     {
    //       deviceId: 'built-in-speakers',
    //       label: 'Built-in Speakers',
    //       kind: 'audiooutput',
    //     },
    //   ],
    // });
  }, []);

  // Simulate audio level monitoring
  useEffect(() => {
    if (settings.microphone.enabled && stream) {
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
  }, [settings.microphone.enabled, stream]);

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
        <div className="w-80 bg-gray-800/50 p-6 flex flex-col">
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
                checked={settings.backgroundBlur}
                onCheckedChange={(checked: boolean) =>
                  setSettings((prev) => ({ ...prev, backgroundBlur: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white text-lg">{steps[currentStep].title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Step content */}
          <div className="flex-1 p-6 overflow-auto">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <Step0CameraMic
                  settings={settings}
                  setSettings={setSettings}
                  devices={devices}
                  audioLevel={audioLevel}
                />
              )}

              {currentStep === 1 && (
                <Step1AudioSettings
                  settings={settings}
                  setSettings={setSettings}
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
                <Step3ReadyToJoin settings={settings} onJoinCall={onJoinCall} />
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
                  onJoinCall(settings);
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
