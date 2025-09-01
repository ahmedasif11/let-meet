import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import { Label } from '../../../ui/label';
import { Slider } from '../../../ui/slider';
import { Progress } from '../../../ui/progress';
import { Mic, Volume2 } from 'lucide-react';
import { CallSettings, Devices } from '../types';
import { testSpeaker } from '../../../../lib/utils/testSpeaker';

interface Step1AudioSettingsProps {
  settings: CallSettings;
  setSettings: React.Dispatch<React.SetStateAction<CallSettings>>;
  devices: Devices;
  audioLevel: number;
}

export const Step1AudioSettings: React.FC<Step1AudioSettingsProps> = ({
  settings,
  setSettings,
  devices,
  audioLevel,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/test-sound.wav');
      audioRef.current.preload = 'auto';
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (typeof audioRef.current.setSinkId === 'function') {
      audioRef.current
        .setSinkId(settings.speaker.deviceId)
        .then(() => {
          console.log('Sink ID set to:', settings.speaker.deviceId);
        })
        .catch((err) => {
          console.warn('Error setting sink ID:', err);
        });
    } else {
      console.warn('setSinkId not supported by your browser');
    }
  }, [settings.speaker.deviceId]);

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Microphone Settings */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Microphone Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Microphone Device Select */}
          <div>
            <Label className="text-white mb-2 block">Microphone Device</Label>
            <Select
              value={settings.microphone.deviceId}
              onValueChange={(value: string) =>
                setSettings((prev) => ({
                  ...prev,
                  microphone: {
                    ...prev.microphone,
                    deviceId: value,
                  },
                }))
              }
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {devices.microphones.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Microphone Volume Slider */}
          <div>
            <Label className="text-white mb-2 block">
              Input Volume: {settings.microphone.volume}%
            </Label>
            <Slider
              value={[settings.microphone.volume]}
              onValueChange={([value]: number[]) =>
                setSettings((prev) => ({
                  ...prev,
                  microphone: { ...prev.microphone, volume: value },
                }))
              }
              max={100}
              min={0}
              className="w-full"
            />
          </div>

          {/* Microphone Test Visual */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">Microphone Test</span>
            </div>
            <Progress value={audioLevel} className="w-full h-3" />
            <p className="text-gray-400 text-xs mt-1">
              Speak to test your microphone
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Speaker Settings */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Speaker Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Speaker Device Select */}
          <div>
            <Label className="text-white mb-2 block">Speaker Device</Label>
            <Select
              value={settings.speaker.deviceId}
              onValueChange={(value: string) =>
                setSettings((prev) => ({
                  ...prev,
                  speaker: { ...prev.speaker, deviceId: value },
                }))
              }
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {devices.speakers.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speaker Volume Slider */}
          <div>
            <Label className="text-white mb-2 block">
              Output Volume: {settings.speaker.volume}%
            </Label>
            <Slider
              value={[settings.speaker.volume]}
              onValueChange={([value]: number[]) =>
                setSettings((prev) => ({
                  ...prev,
                  speaker: { ...prev.speaker, volume: value },
                }))
              }
              max={100}
              min={0}
              className="w-full"
            />
          </div>

          {/* Test Speaker Button */}
          <Button
            variant="secondary"
            className="w-full"
            onClick={() =>
              audioRef.current &&
              testSpeaker({
                volume: settings.speaker.volume,
                sound: audioRef.current,
              })
            }
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Test Speaker
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
