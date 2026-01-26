import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ConnectionStatus } from '../types';

interface ConnectionStatusOverlayProps {
  connectionStatus: ConnectionStatus;
}

export const ConnectionStatusOverlay: React.FC<
  ConnectionStatusOverlayProps
> = ({ connectionStatus }) => {
  return (
    <AnimatePresence>
      {connectionStatus === 'reconnecting' && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          Reconnecting to call...
        </motion.div>
      )}
    </AnimatePresence>
  );
};
