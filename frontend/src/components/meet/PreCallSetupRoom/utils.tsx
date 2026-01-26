import React from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { TestResults } from './types';

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'good':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'error':
      return <X className="w-4 h-4 text-red-500" />;
    default:
      return <div className="w-4 h-4 rounded-full bg-gray-600 animate-pulse" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'good':
      return 'text-green-500';
    case 'warning':
      return 'text-yellow-500';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const canProceedToNextStep = (
  currentStep: number,
  isTestingDevices: boolean
) => {
  switch (currentStep) {
    case 0:
      return true; // Always can proceed from camera/mic setup
    case 1:
      return true; // Always can proceed from audio settings
    case 2:
      return !isTestingDevices; // Can proceed once testing is complete
    case 3:
      return true; // Ready to join
    default:
      return false;
  }
};

export const allTestsComplete = (testResults: TestResults) => {
  return Object.values(testResults).every((result) => result !== 'pending');
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
