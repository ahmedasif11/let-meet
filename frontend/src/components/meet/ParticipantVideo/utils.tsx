import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export const getConnectionColor = (connectionQuality: string) => {
  switch (connectionQuality) {
    case 'good':
      return 'text-green-500';
    case 'poor':
      return 'text-yellow-500';
    case 'disconnected':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getConnectionIcon = (connectionQuality: string) => {
  return connectionQuality === 'disconnected' ? WifiOff : Wifi;
};
