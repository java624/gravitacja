import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 768;
    if (!isFinePointer) return;

    setEnabled(true);

    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          target.closest('.cursor-pointer'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Main neon cursor core with max z-index */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-cyan-400 pointer-events-none z-[99999] mix-blend-screen shadow-[0_0_20px_#06b6d4]"
        animate={{
          x: pos.x - 8,
          y: pos.y - 8,
          scale: isHovered ? 2.2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      />
      
      {/* Outer orbital ring with max z-index */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-purple-500/80 pointer-events-none z-[99998] blur-[1px]"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? '#f97316' : '#a855f7',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      />
    </>
  );
}