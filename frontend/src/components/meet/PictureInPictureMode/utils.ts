import { PipPosition } from './types';

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getPositionStyles = (position: PipPosition) => {
  const baseStyles = 'fixed z-50 transition-all duration-300';

  switch (position) {
    case 'top-left':
      return `${baseStyles} top-4 left-4`;
    case 'top-right':
      return `${baseStyles} top-4 right-4`;
    case 'bottom-left':
      return `${baseStyles} bottom-4 left-4`;
    case 'bottom-right':
      return `${baseStyles} bottom-4 right-4`;
    default:
      return `${baseStyles} bottom-4 right-4`;
  }
};

export const calculatePipPosition = (x: number, y: number): PipPosition => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (x < windowWidth / 2 && y < windowHeight / 2) {
    return 'top-left';
  } else if (x >= windowWidth / 2 && y < windowHeight / 2) {
    return 'top-right';
  } else if (x < windowWidth / 2 && y >= windowHeight / 2) {
    return 'bottom-left';
  } else {
    return 'bottom-right';
  }
};
