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
  Info,
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
            <div className="space-y-3">
              <Button onClick={runDeviceTests} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Device Test
              </Button>
              <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">What this test does:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Tests camera functionality and video quality</li>
                      <li>• Verifies microphone audio input</li>
                      <li>• Checks speaker/headphone output</li>
                      <li>• Measures network connection speed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-gray-400" />
                <span className="text-white">Camera</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.camera)}
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm ${getStatusColor(testResults.camera)}`}
                  >
                    {testResults.camera === 'pending'
                      ? 'Testing...'
                      : testResults.camera === 'good'
                        ? 'Working'
                        : testResults.camera === 'warning'
                          ? 'Disabled'
                          : 'Error'}
                  </span>
                  {testResults.camera === 'error' && (
                    <span className="text-xs text-red-400 mt-1">
                      Camera access failed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-gray-400" />
                <span className="text-white">Microphone</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.microphone)}
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm ${getStatusColor(testResults.microphone)}`}
                  >
                    {testResults.microphone === 'pending'
                      ? 'Testing...'
                      : testResults.microphone === 'good'
                        ? 'Working'
                        : testResults.microphone === 'warning'
                          ? 'Disabled'
                          : 'Error'}
                  </span>
                  {testResults.microphone === 'error' && (
                    <span className="text-xs text-red-400 mt-1">
                      Microphone access failed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <span className="text-white">Speaker</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.speaker)}
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm ${getStatusColor(testResults.speaker)}`}
                  >
                    {testResults.speaker === 'pending'
                      ? 'Testing...'
                      : testResults.speaker === 'good'
                        ? 'Working'
                        : 'Error'}
                  </span>
                  {testResults.speaker === 'error' && (
                    <span className="text-xs text-red-400 mt-1">
                      Speaker test failed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-400" />
                <span className="text-white">Network Connection</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.network)}
                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm ${getStatusColor(testResults.network)}`}
                  >
                    {testResults.network === 'pending'
                      ? 'Testing...'
                      : testResults.network === 'good'
                        ? 'Excellent'
                        : testResults.network === 'warning'
                          ? 'Fair'
                          : 'Poor'}
                  </span>
                  {testResults.network === 'error' && (
                    <span className="text-xs text-red-400 mt-1">
                      Network connection failed
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {allTestsComplete(testResults) && (
            <div className="space-y-3">
              <div className="bg-green-600/20 border border-green-600/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Device testing completed!</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Your devices and connection are ready for a high-quality call.
                </p>
              </div>

              <Button
                onClick={runDeviceTests}
                variant="outline"
                className="w-full"
                disabled={isTestingDevices}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Run Tests Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
