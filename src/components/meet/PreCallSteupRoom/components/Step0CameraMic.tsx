import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import { Label } from '../../../ui/label';
import { Progress } from '../../../ui/progress';
import { Camera, CameraOff, Mic, MicOff, Video } from 'lucide-react';
import { CallSettings, Devices } from '../types';

interface Step0CameraMicProps {
  settings: CallSettings;
  setSettings: React.Dispatch<React.SetStateAction<CallSettings>>;
  devices: Devices;
  audioLevel: number;
}

export const Step0CameraMic: React.FC<Step0CameraMicProps> = ({
  settings,
  setSettings,
  devices,
  audioLevel,
}) => {
  return (
    <motion.div
      key="step0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Video Preview */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative mb-4">
            {settings.camera.enabled ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-12 h-12 mx-auto mb-2" />
                  <p>Camera Preview</p>
                  <p className="text-sm text-gray-300">
                    HD • {settings.camera.resolution}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <CameraOff className="w-12 h-12 mx-auto mb-2" />
                  <p>Camera Off</p>
                </div>
              </div>
            )}

            {/* Audio level indicator */}
            {settings.microphone.enabled && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/50 rounded-lg p-2">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-green-400" />
                    <Progress value={audioLevel} className="flex-1 h-2" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant={settings.camera.enabled ? 'default' : 'secondary'}
                size="icon"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    camera: {
                      ...prev.camera,
                      enabled: !prev.camera.enabled,
                    },
                  }))
                }
              >
                {settings.camera.enabled ? (
                  <Camera className="w-4 h-4" />
                ) : (
                  <CameraOff className="w-4 h-4" />
                )}
              </Button>

              <Button
                variant={settings.microphone.enabled ? 'default' : 'secondary'}
                size="icon"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    microphone: {
                      ...prev.microphone,
                      enabled: !prev.microphone.enabled,
                    },
                  }))
                }
              >
                {settings.microphone.enabled ? (
                  <Mic className="w-4 h-4" />
                ) : (
                  <MicOff className="w-4 h-4" />
                )}
              </Button>

              <div className="flex-1">
                <Label className="text-white mb-2 block">Display Name</Label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block">Camera</Label>
                <Select
                  value={settings.camera.deviceId}
                  onValueChange={(value: string) =>
                    setSettings((prev) => ({
                      ...prev,
                      camera: { ...prev.camera, deviceId: value },
                    }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.cameras.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white mb-2 block">Quality</Label>
                <Select
                  value={settings.camera.resolution}
                  onValueChange={(value: string) =>
                    setSettings((prev) => ({
                      ...prev,
                      camera: { ...prev.camera, resolution: value },
                    }))
                  }
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">480p (Standard)</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
