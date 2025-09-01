import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../ui/card';
import {
  CheckCircle,
  Settings,
  RefreshCw,
  Camera,
  Mic,
  Volume2,
  Monitor,
} from 'lucide-react';
import { TestResults } from '../types';
import { getStatusIcon, getStatusColor, allTestsComplete } from '../utils';

interface Step2DeviceTestingProps {
  testResults: TestResults;
  isTestingDevices: boolean;
  runDeviceTests: () => void;
}

export const Step2DeviceTesting: React.FC<Step2DeviceTestingProps> = ({
  testResults,
  isTestingDevices,
  runDeviceTests,
}) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Device & Connection Test
          </CardTitle>
          <CardDescription className="text-gray-400">
            Testing your devices and network connection for optimal call quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isTestingDevices && !allTestsComplete(testResults) && (
            <Button onClick={runDeviceTests} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Device Test
            </Button>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-gray-400" />
                <span className="text-white">Camera</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.camera)}
                <span
                  className={`text-sm ${getStatusColor(testResults.camera)}`}
                >
                  {testResults.camera === 'pending'
                    ? 'Pending'
                    : testResults.camera === 'good'
                      ? 'Working'
                      : testResults.camera === 'warning'
                        ? 'Disabled'
                        : 'Error'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-gray-400" />
                <span className="text-white">Microphone</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.microphone)}
                <span
                  className={`text-sm ${getStatusColor(testResults.microphone)}`}
                >
                  {testResults.microphone === 'pending'
                    ? 'Pending'
                    : testResults.microphone === 'good'
                      ? 'Working'
                      : testResults.microphone === 'warning'
                        ? 'Disabled'
                        : 'Error'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <span className="text-white">Speaker</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.speaker)}
                <span
                  className={`text-sm ${getStatusColor(testResults.speaker)}`}
                >
                  {testResults.speaker === 'pending'
                    ? 'Pending'
                    : testResults.speaker === 'good'
                      ? 'Working'
                      : 'Error'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-400" />
                <span className="text-white">Network Connection</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.network)}
                <span
                  className={`text-sm ${getStatusColor(testResults.network)}`}
                >
                  {testResults.network === 'pending'
                    ? 'Pending'
                    : testResults.network === 'good'
                      ? 'Excellent'
                      : testResults.network === 'warning'
                        ? 'Fair'
                        : 'Poor'}
                </span>
              </div>
            </div>
          </div>

          {allTestsComplete(testResults) && (
            <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="w-5 h-5" />
                <span>All tests completed successfully!</span>
              </div>
              <p className="text-gray-300 text-sm">
                Your devices and connection are ready for a high-quality call.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
