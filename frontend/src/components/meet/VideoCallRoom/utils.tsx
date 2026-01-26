import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { ConnectionStatus } from './types';

export const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getConnectionIcon = (status: ConnectionStatus) => {
  return status === 'disconnected' ? WifiOff : Wifi;
};

export const getConnectionColor = (status: ConnectionStatus) => {
  switch (status) {
    case 'connected':
      return 'text-green-500';
    case 'reconnecting':
      return 'text-yellow-500';
    case 'disconnected':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getConnectionStatusText = (status: ConnectionStatus) => {
  switch (status) {
    case 'connected':
      return 'Connected';
    case 'reconnecting':
      return 'Reconnecting...';
    case 'disconnected':
      return 'Disconnected';
    default:
      return 'Unknown';
  }
};
