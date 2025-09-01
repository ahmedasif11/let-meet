import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../ui/button';
import { Card, CardContent } from '../../../ui/card';
import { CheckCircle, Phone } from 'lucide-react';
import { CallSettings } from '../types';

interface Step3ReadyToJoinProps {
  settings: CallSettings;
  onJoinCall: (settings: CallSettings) => void;
}

export const Step3ReadyToJoin: React.FC<Step3ReadyToJoinProps> = ({
  settings,
  onJoinCall,
}) => {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-white text-xl mb-2">Ready to Join!</h3>
          <p className="text-gray-400 mb-6">
            Your setup is complete and you're ready to join the meeting.
          </p>

          {/* Final settings summary */}
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
            <h4 className="text-white mb-3">Your Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{settings.displayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Camera:</span>
                <span className="text-white">
                  {settings.camera.enabled ? 'On' : 'Off'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Microphone:</span>
                <span className="text-white">
                  {settings.microphone.enabled ? 'On' : 'Off'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Background Blur:</span>
                <span className="text-white">
                  {settings.backgroundBlur ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onJoinCall(settings)}
            className="w-full bg-blue-600 hover:bg-blue-700"
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
