import { motion } from 'framer-motion';

interface LaneDividerProps {
  label?: string;
  badge?: string;
  className?: string;
}

export default function LaneDivider({ label = 'GLOW BOWLING ZONE', badge, className = '' }: LaneDividerProps) {
  return (
    <div className={`relative py-6 w-full overflow-hidden select-none ${className}`}>
      {/* Background ambient glow pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-pink-500/10 to-purple-500/5 blur-xl pointer-events-none" />

      {/* Outer Lane Track Container */}
      <div className="relative flex items-center justify-between gap-4 max-w-7xl mx-auto px-4">
        
        {/* Left Parquet Lane Line with Animated Sweeping Light Beam */}
        <div className="relative flex-1 h-[3px] bg-gradient-to-r from-transparent via-cyan-500/20 to-pink-500/40 rounded-full overflow-hidden">
          {/* Animated Running Light Beam */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#06b6d4]"
          />
        </div>

        {/* Center Target & Glow Badge Unit */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-2 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.25)]">
          {/* Left Arrow Guide Dots */}
          <div className="flex gap-1.5 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          </div>

          {/* Lane Target Chevron SVG */}
          <svg className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_#06b6d4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17l5-5-5-5" />
            <path d="M13 17l5-5-5-5" />
          </svg>

          {/* Label Text */}
          <span className="text-xs font-black tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-400 to-purple-400">
            {label}
          </span>

          {badge && (
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
              {badge}
            </span>
          )}

          {/* Right Arrow Guide Dots */}
          <svg className="w-4 h-4 text-purple-400 drop-shadow-[0_0_8px_#a855f7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 17l-5-5 5-5" />
            <path d="M17 17l-5-5 5-5" />
          </svg>

          <div className="flex gap-1.5 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
        </div>

        {/* Right Parquet Lane Line with Animated Sweeping Light Beam */}
        <div className="relative flex-1 h-[3px] bg-gradient-to-r from-purple-500/40 via-pink-500/20 to-transparent rounded-full overflow-hidden">
          {/* Animated Running Light Beam */}
          <motion.div
            animate={{ x: ['200%', '-100%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_15px_#ec4899]"
          />
        </div>

      </div>

      {/* Decorative Bowling Lane Target Dots row underneath */}
      <div className="flex justify-center items-center gap-6 mt-2 opacity-50">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.9, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
            className="w-1 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 shadow-[0_0_6px_#06b6d4]"
          />
        ))}
      </div>
    </div>
  );
}
