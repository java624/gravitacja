import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Logo({ size = 'md', onClick }: LogoProps) {
  const textSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl md:text-4xl',
    lg: 'text-3xl sm:text-4xl md:text-5xl',
  };

  const pulseSizes = {
    sm: 'w-3.5 h-5',
    md: 'w-4 sm:w-5 md:w-6 h-6 sm:h-7 md:h-8',
    lg: 'w-6 sm:w-7 md:w-8 h-8 sm:h-9 md:h-10',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="relative inline-flex items-center select-none cursor-pointer py-1 z-10 group"
    >
      {/* М'який підсвічувальний ареол на hover */}
      <div className="absolute -inset-2 bg-red-600/15 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full pointer-events-none" />

      <div className={`relative flex items-center font-black ${textSizes[size]} text-white tracking-widest leading-none`}>
        {/* GR */}
        <span>GR</span>

        {/* ЗНАК "А"-ПУЛЬСУ (Збалансований за висотою під текст) */}
        <div className={`relative mx-1 ${pulseSizes[size]} flex items-center justify-center self-center`}>
          <svg
            viewBox="0 0 60 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.7)]"
          >
            <path
              d="M 32 0 L 12 72 L 24 66 L 38 120 L 52 46 L 38 54 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* IT */}
        <span>IT</span>

        {/* Перша Л-подібна A */}
        <div className="relative mx-[0.04em] w-[0.58em] h-[0.72em] inline-flex items-center">
          <svg viewBox="0 0 40 50" fill="none" className="w-full h-full">
            <path d="M 20 0 L 40 50 H 28 L 20 20 L 12 50 H 0 L 20 0 Z" fill="currentColor" />
          </svg>
        </div>

        {/* CJ */}
        <span>CJ</span>

        {/* Друга Л-подібна A */}
        <div className="relative mx-[0.04em] w-[0.58em] h-[0.72em] inline-flex items-center">
          <svg viewBox="0 0 40 50" fill="none" className="w-full h-full">
            <path d="M 20 0 L 40 50 H 28 L 20 20 L 12 50 H 0 L 20 0 Z" fill="currentColor" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
