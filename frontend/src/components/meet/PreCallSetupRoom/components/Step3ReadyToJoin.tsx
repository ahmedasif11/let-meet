import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { CheckCircle, Phone, AlertTriangle, Camera, Mic } from 'lucide-react';
import { CallSettings, DeviceAvailability } from '../types';

interface Step3ReadyToJoinProps {
  settings: CallSettings;
  onJoinCall: (settings: CallSettings) => void;
  deviceAvailability?: DeviceAvailability;
}

export const Step3ReadyToJoin: React.FC<Step3ReadyToJoinProps> = ({
  settings,
  onJoinCall,
  deviceAvailability,
}) => {
  const hasWarnings =
    deviceAvailability &&
    ((!deviceAvailability.hasCamera && settings.camera.enabled) ||
      (!deviceAvailability.hasMicrophone && settings.microphone.enabled));
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="bg-muted/50 border-border">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-foreground text-xl font-semibold mb-2">Ready to Join!</h3>
          <p className="text-muted-foreground mb-6">
            Your setup is complete and you&apos;re ready to join the meeting.
          </p>

          {hasWarnings && (
            <div className="bg-yellow-500/10 dark:bg-yellow-600/20 border border-yellow-600/40 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">
                    Device Warnings:
                  </p>
                  <ul className="space-y-1 text-yellow-700/90 dark:text-yellow-300">
                    {!deviceAvailability?.hasCamera &&
                      settings.camera.enabled && (
                        <li className="flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Camera is enabled but not available
                        </li>
                      )}
                    {!deviceAvailability?.hasMicrophone &&
                      settings.microphone.enabled && (
                        <li className="flex items-center gap-2">
                          <Mic className="w-4 h-4" />
                          Microphone is enabled but not available
                        </li>
                      )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="bg-muted rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium mb-3">Your Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{settings.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Camera:</span>
                <span>{settings.camera.enabled ? 'On' : 'Off'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Microphone:</span>
                <span>{settings.microphone.enabled ? 'On' : 'Off'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Background Blur:</span>
                <span>{settings.backgroundBlur ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onJoinCall(settings)}
            className="w-full"
            size="lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            Join Meeting Now
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
