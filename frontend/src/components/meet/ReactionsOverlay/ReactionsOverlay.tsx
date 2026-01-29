import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ReactionsOverlayProps, Reaction } from './types';
import { getRandomPosition } from './utils';

export function ReactionsOverlay({
  reactions,
  className = '',
}: ReactionsOverlayProps) {
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    // Update active reactions and remove old ones
    const now = Date.now();
    const filtered = reactions.filter((r) => now - r.timestamp < 3000); // Show for 3 seconds
    setActiveReactions(filtered);
  }, [reactions]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-40 ${className}`}>
      <AnimatePresence>
        {activeReactions.map((reaction) => {
          const position = getRandomPosition();
          return (
            <motion.div
              key={reaction.id}
              initial={{
                scale: 0,
                opacity: 0,
                x: `${position.x}vw`,
                y: `${position.y}vh`,
              }}
              animate={{
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1, 0],
                y: `${position.y - 20}vh`,
              }}
              exit={{
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 3,
                times: [0, 0.1, 0.2, 1],
                ease: 'easeOut',
              }}
              className="absolute"
            >
              <div className="flex flex-col items-center">
                <div className="text-4xl md:text-6xl mb-1">
                  {reaction.emoji}
                </div>
                <div className="bg-background/90 text-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm border border-border shadow-sm">
                  {reaction.userName}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
