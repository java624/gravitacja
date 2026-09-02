import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Trophy, Play, Sparkles, RefreshCw } from 'lucide-react';
import BowlingPin from '../ui/BowlingPin';

export default function HomeHero() {
  const [isRolling, setIsRolling] = useState(false);
  const [hasHitPins, setHasHitPins] = useState(false);
  const [showStrikeOverlay, setShowStrikeOverlay] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const triggerStrike = () => {
    if (isRolling || hasHitPins) return;

    // Phase 1: Ball starts rolling up the lane
    setIsRolling(true);
    setHasHitPins(false);
    setShowStrikeOverlay(false);

    // Phase 2: Ball reaches pins deck & collides! (At 0.8s)
    setTimeout(() => {
      setHasHitPins(true);
      setStrikeCount((prev) => prev + 1);

      // Phase 3: Show STRIKE celebration AFTER pins fly apart! (At 0.9s)
      setTimeout(() => {
        setShowStrikeOverlay(true);
      }, 100);
    }, 800);

    // Phase 4: Reset everything back to normal (At 2.6s)
    setTimeout(() => {
      setIsRolling(false);
      setHasHitPins(false);
      setShowStrikeOverlay(false);
    }, 2600);
  };

  const pinRows = [
    { count: 4, rowIdx: 0 },
    { count: 3, rowIdx: 1 },
    { count: 2, rowIdx: 2 },
    { count: 1, rowIdx: 3 },
  ];

  return (
    <section className="relative text-center max-w-6xl mx-auto flex flex-col justify-center items-center py-6 sm:py-10 px-2 sm:px-6 select-none overflow-hidden">
      
      {/* Background Neon Atmosphere Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center overflow-hidden">
        <div className="absolute w-[400px] sm:w-[1000px] h-[400px] sm:h-[600px] rounded-full bg-gradient-to-tr from-cyan-600/20 via-purple-600/25 to-pink-600/20 blur-3xl sm:blur-[140px]" />
      </div>

      {/* 1. TOP BADGES */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[10px] sm:text-xs font-black tracking-widest uppercase text-cyan-300 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Flame className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
          <span>NOWY WYMIAR ROZRYWKI</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/15 border border-purple-400/30 text-[10px] sm:text-xs font-black tracking-widest uppercase text-purple-300 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.25)]">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>14 UV-TORÓW</span>
        </div>

        {strikeCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-[10px] sm:text-xs font-black tracking-widest uppercase text-yellow-300 backdrop-blur-md shadow-[0_0_25px_rgba(234,179,8,0.4)]"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <span>STRIKES: {strikeCount}</span>
          </motion.div>
        )}
      </motion.div>

      {/* 2. MAIN HEADLINE */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-3 sm:mb-4 leading-[1.05]"
      >
        POCZUJ <br />
        <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(236,72,153,0.4)]">
          NEONOWĄ GRAWITACJĘ
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 text-slate-300 text-xs sm:text-base md:text-lg max-w-xl mb-6 sm:mb-8 font-light leading-relaxed px-2 drop-shadow"
      >
        Wybierz swoje miasto, aby zanurzyć się w kosmicznym klimacie i zarezerwować tor online z efektami Glow Bowling.
      </motion.p>

      {/* ============================================================== */}
      {/* 3. WIDE REAL 3D PERSPECTIVE BOWLING LANE                       */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-between min-h-[460px] sm:min-h-[520px] pt-2 pb-4">
        
        {/* WIDE PERSPECTIVE TRAPEZOID LANE FLOOR (FULL WIDTH SPAN) */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-0">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 800 460"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wideLaneGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
                <stop offset="55%" stopColor="#0f172a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
              </linearGradient>

              <filter id="neonGlowWide" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* WIDE Trapezoid Perspective Lane Ground (Narrow top: 260->540, Wide bottom: 10->790) */}
            <polygon
              points="260,25 540,25 790,440 10,440"
              fill="url(#wideLaneGradient)"
              stroke="rgba(6, 182, 212, 0.3)"
              strokeWidth="2"
            />

            {/* Longitudinal Parquet Guide Lines (Perspective lines meeting towards horizon) */}
            <line x1="316" y1="25" x2="166" y2="440" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1.5" />
            <line x1="372" y1="25" x2="322" y2="440" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1.5" />
            <line x1="428" y1="25" x2="478" y2="440" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1.5" />
            <line x1="484" y1="25" x2="634" y2="440" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1.5" />

            {/* Left Glowing Neon Gutter Line */}
            <line
              x1="260"
              y1="25"
              x2="10"
              y2="440"
              stroke="#06b6d4"
              strokeWidth="5"
              filter="url(#neonGlowWide)"
            />

            {/* Right Glowing Neon Gutter Line */}
            <line
              x1="540"
              y1="25"
              x2="790"
              y2="440"
              stroke="#a855f7"
              strokeWidth="5"
              filter="url(#neonGlowWide)"
            />

            {/* Foul Line near bowler launcher */}
            <line
              x1="30"
              y1="400"
              x2="770"
              y2="400"
              stroke="#f97316"
              strokeWidth="3.5"
              strokeDasharray="8,5"
              filter="url(#neonGlowWide)"
            />

            {/* Perspective Aiming Arrows along the lane */}
            {[
              { x: 330, y: 220 },
              { x: 365, y: 220 },
              { x: 400, y: 220 },
              { x: 435, y: 220 },
              { x: 470, y: 220 },
            ].map((pt, i) => (
              <polygon
                key={i}
                points={`${pt.x},${pt.y} ${pt.x - 7},${pt.y + 16} ${pt.x + 7},${pt.y + 16}`}
                fill="#06b6d4"
                opacity="0.75"
              />
            ))}
          </svg>
        </div>

        {/* ============================================================== */}
        {/* TOP PIN DECK (10 PINS AT THE FAR END)                          */}
        {/* ============================================================== */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center pt-2">
          
          {/* Spotlight Backlight Glow under Pins */}
          <div className="absolute top-0 w-56 sm:w-80 h-24 rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/40 to-cyan-500/30 blur-xl pointer-events-none" />

          {/* 10 Pins Layout Pyramid (4-3-2-1) */}
          <div className="relative flex flex-col items-center gap-1.5 sm:gap-2 pt-2">
            {pinRows.map((row) => (
              <div key={row.rowIdx} className="flex items-center justify-center gap-2 sm:gap-3.5">
                {[...Array(row.count)].map((_, pIdx) => {
                  const globalIdx = row.rowIdx * 3 + pIdx;
                  return (
                    <motion.div
                      key={pIdx}
                      animate={
                        hasHitPins
                          ? {
                              x: (globalIdx % 2 === 0 ? 1 : -1) * (70 + Math.random() * 120),
                              y: -80 - Math.random() * 100,
                              rotate: (Math.random() - 0.5) * 800,
                              scale: [1, 1.4, 0],
                              opacity: [1, 1, 0],
                            }
                          : { y: [0, -3, 0], scale: 1, opacity: 1, rotate: 0 }
                      }
                      transition={
                        hasHitPins
                          ? { duration: 1.2, ease: 'easeOut' }
                          : { repeat: Infinity, duration: 2.5 + globalIdx * 0.2 }
                      }
                    >
                      <BowlingPin
                        width={isMobile ? 20 : 28}
                        height={isMobile ? 48 : 68}
                        glowColor={globalIdx % 2 === 0 ? 'cyan' : 'pink'}
                        showCrown={row.rowIdx === 3}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          <span className="mt-3 text-[9px] font-black tracking-widest text-cyan-300 uppercase px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-400/30 backdrop-blur-md shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            10 PINS UV STRIKE DECK
          </span>
        </div>

        {/* STRIKE CELEBRATION OVERLAY — SHOWS AFTER PINS ARE SCATTERED! */}
        <AnimatePresence>
          {showStrikeOverlay && (
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1.15, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring' }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{ scale: [1, 1.25, 1], rotate: [0, -6, 6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="flex flex-col items-center p-6 sm:p-8 rounded-3xl bg-slate-950/90 border border-yellow-400/50 backdrop-blur-md shadow-[0_0_80px_rgba(250,204,21,0.8)]"
              >
                <Sparkles className="w-12 sm:w-16 h-12 sm:h-16 text-yellow-300 animate-spin mb-2" />
                <span className="text-4xl sm:text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 drop-shadow-[0_0_30px_rgba(250,204,21,0.9)] tracking-tight uppercase">
                  💥 STRIKE 300! 💥
                </span>
                <span className="text-xs sm:text-sm font-black tracking-widest text-white mt-2 bg-gradient-to-r from-orange-500 via-red-600 to-purple-600 px-6 py-1.5 rounded-full shadow-lg">
                  PERFECT ROLL!
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================== */}
        {/* CENTERED BOWLING BALL (ROLLS IN PERSPECTIVE, THEN HITS PINS)   */}
        {/* ============================================================== */}
        <div className="relative z-20 flex flex-col items-center mt-auto pb-2">
          
          {/* 3D Bowling Ball */}
          <motion.div
            onClick={triggerStrike}
            animate={
              isRolling || hasHitPins
                ? {
                    y: [0, -(isMobile ? 260 : 330)],
                    scale: [1, 0.38],
                    rotate: [0, 1080],
                  }
                : { y: [0, -5, 0] }
            }
            transition={
              isRolling || hasHitPins
                ? { duration: 0.8, ease: 'easeIn' }
                : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
            }
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full cursor-pointer shadow-[0_15px_45px_rgba(0,0,0,0.95),0_0_55px_rgba(6,182,212,0.85)] border-2 border-cyan-300/60 group/ball overflow-hidden active:scale-95 transition-shadow"
          >
            {/* Spherical Cosmic Texture */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 20%, #818cf8 45%, #c084fc 70%, #030712 95%)',
              }}
            />

            <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/60 via-purple-600/40 to-transparent mix-blend-color-dodge" />

            {/* Finger Holes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute bottom-6 sm:bottom-9 left-1/2 -translate-x-1/2 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-slate-950 border border-cyan-400/80 shadow-inner" />
              <div className="absolute top-8 sm:top-11 left-[38%] -translate-x-1/2 w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 rounded-full bg-slate-950 border border-pink-400/80 shadow-inner" />
              <div className="absolute top-8 sm:top-11 left-[62%] -translate-x-1/2 w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 rounded-full bg-slate-950 border border-purple-400/80 shadow-inner" />
            </div>

            {/* Click Hover Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover/ball:opacity-100 transition-opacity backdrop-blur-[1px]">
              <Play className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
              <span className="text-[9px] font-black tracking-widest text-white uppercase mt-1">
                RZUĆ KULĄ!
              </span>
            </div>

            <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 text-center pointer-events-none">
              <span className="text-[8px] sm:text-[10px] font-black tracking-[0.2em] uppercase text-cyan-200 opacity-90 drop-shadow-[0_0_5px_#06b6d4]">
                GRAWITACJA
              </span>
            </div>
          </motion.div>

          {/* Floor Shadow under Ball */}
          <div className="w-28 sm:w-36 h-3 rounded-full bg-black/90 blur-md mx-auto transform scale-x-110 mt-1" />
        </div>

      </div>

      {/* 4. MAIN ACTION CTA BUTTON BELOW LANE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-20 mt-4 flex flex-col items-center w-full"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={triggerStrike}
          disabled={isRolling || hasHitPins}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 text-white text-xs sm:text-sm font-black tracking-widest uppercase cursor-pointer shadow-[0_0_35px_rgba(249,115,22,0.6)] hover:shadow-[0_0_50px_rgba(236,72,153,0.8)] transition-all flex items-center justify-center gap-2 border border-orange-400/30 active:scale-96"
        >
          {isRolling || hasHitPins ? (
            <>
              <RefreshCw className="w-4 h-4 text-yellow-300 animate-spin" />
              <span>RZUT W TOKU... 🎳</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>KLIKNIJ I RZUĆ KULĄ (STRIKE!)</span>
            </>
          )}
        </motion.button>
      </motion.div>

    </section>
  );
}
