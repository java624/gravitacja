import { motion } from 'framer-motion';
import CosmicBackground from '../CosmicBackground';
import CustomCursor from '../CustomCursor';

export default function BackgroundGlow() {
  return (
    <>
      {/* WebGL / Canvas background system */}
      <CosmicBackground />
      
      {/* Custom Neon Cursor */}
      <CustomCursor />

      {/* Floating 3D Graphic Props — Desktop only */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:flex absolute top-1/4 left-5 w-24 h-24 bg-gradient-to-tr from-pink-600/20 to-purple-600/30 rounded-full blur-sm border border-pink-500/20 items-center justify-center text-4xl shadow-[0_0_50px_rgba(236,72,153,0.3)] pointer-events-none z-0"
      >
        🎳
      </motion.div>

      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:flex absolute bottom-1/3 right-8 w-32 h-32 bg-gradient-to-tr from-cyan-600/20 to-blue-600/30 rounded-full blur-sm border border-cyan-500/20 items-center justify-center text-5xl shadow-[0_0_60px_rgba(6,182,212,0.3)] pointer-events-none z-0"
      >
        🎱
      </motion.div>
    </>
  );
}
