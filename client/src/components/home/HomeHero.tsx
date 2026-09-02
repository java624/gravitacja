import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Trophy, Play, Sparkles, RefreshCw } from 'lucide-react';
import BowlingPin from '../ui/BowlingPin';

export default function HomeHero() {
  const [isStriking, setIsStriking] = useState(false);
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
    if (isStriking) return;
    setIsStriking(true);
    setStrikeCount((prev) => prev + 1);

    setTimeout(() => {
      setIsStriking(false);
    }, 2400);
  };

  const pinRows = [
    { count: 4, rowIdx: 0 },
    { count: 3, rowIdx: 1 },
    { count: 2, rowIdx: 2 },
    { count: 1, rowIdx: 3 },
  ];

  return (
    <section className="relative text-center max-w-5xl mx-auto flex flex-col justify-center items-center py-6 sm:py-10 px-3 sm:px-6 select-none overflow-hidden">
      
      {/* 1. TOP BADGES */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
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
        className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-3 sm:mb-4 leading-[1.05]"
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
        className="text-slate-300 text-xs sm:text-base md:text-lg max-w-xl mb-6 sm:mb-8 font-light leading-relaxed px-2"
      >
        Wybierz swoje miasto, aby zanurzyć się w kosmicznym klimacie i zarezerwować tor online z efektami Glow Bowling.
      </motion.p>

      {/* ============================================================== */}
      {/* 3. CENTERED INTERACTIVE NEON BOWLING LANE                     */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-md sm:max-w-xl mx-auto rounded-[32px] border border-cyan-500/30 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 p-4 sm:p-6 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        
        {/* Ambient Top & Bottom Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-purple-600/20 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-t from-cyan-600/20 to-transparent blur-2xl pointer-events-none" />

        {/* Dynamic Neon Bowling Track Arena */}
        <div className="relative w-full h-[360px] sm:h-[440px] rounded-2xl bg-gradient-to-b from-purple-950/40 via-slate-950 to-cyan-950/40 border border-white/10 shadow-inner flex flex-col justify-between items-center py-4 px-2 overflow-hidden">
          
          {/* Parquet Lane Longitudinal Guide Lines */}
          <div className="absolute inset-0 grid grid-cols-8 divide-x divide-cyan-500/10 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-full" />
            ))}
          </div>

          {/* Left & Right Glowing Side Gutters */}
          <div className="absolute top-0 bottom-0 left-0 w-2 sm:w-3 bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_15px_#06b6d4]" />
          <div className="absolute top-0 bottom-0 right-0 w-2 sm:w-3 bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_15px_#06b6d4]" />

          {/* Target Arrows on Lane */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-around px-8 pointer-events-none opacity-60">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-0 h-0 border-l-[6px] sm:border-l-[8px] border-l-transparent border-r-[6px] sm:border-r-[8px] border-r-transparent border-b-[14px] sm:border-b-[18px] border-b-cyan-400 drop-shadow-[0_0_8px_#06b6d4]"
              />
            ))}
          </div>

          {/* Bottom Foul Line */}
          <div className="absolute bottom-20 left-3 right-3 h-[3px] bg-gradient-to-r from-red-500 via-orange-400 to-red-500 shadow-[0_0_12px_#f97316] pointer-events-none" />

          {/* ============================================================== */}
          {/* TOP PIN DECK (10 PINS)                                        */}
          {/* ============================================================== */}
          <div className="relative z-10 w-full flex flex-col items-center justify-center pt-2">
            
            {/* UV Pin Deck Spot Light Ring */}
            <div className="absolute top-3 w-40 sm:w-56 h-16 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/30 to-cyan-500/20 blur-md border border-pink-400/30 pointer-events-none" />

            {/* 10 Pins Layout Pyramid */}
            <div className="relative flex flex-col items-center gap-1 sm:gap-1.5 pt-1">
              {pinRows.map((row) => (
                <div key={row.rowIdx} className="flex items-center justify-center gap-2 sm:gap-3">
                  {[...Array(row.count)].map((_, pIdx) => {
                    const globalIdx = row.rowIdx * 3 + pIdx;
                    return (
                      <motion.div
                        key={pIdx}
                        animate={
                          isStriking
                            ? {
                                x: (globalIdx % 2 === 0 ? 1 : -1) * (40 + Math.random() * 90),
                                y: -60 - Math.random() * 80,
                                rotate: (Math.random() - 0.5) * 540,
                                scale: [1, 1.3, 0],
                                opacity: [1, 1, 0],
                              }
                            : { y: [0, -2, 0], scale: 1, opacity: 1, rotate: 0 }
                        }
                        transition={
                          isStriking
                            ? { duration: 1.1, ease: 'easeOut' }
                            : { repeat: Infinity, duration: 2.5 + globalIdx * 0.2 }
                        }
                      >
                        <BowlingPin
                          width={isMobile ? 20 : 26}
                          height={isMobile ? 50 : 64}
                          glowColor={globalIdx % 2 === 0 ? 'cyan' : 'pink'}
                          showCrown={row.rowIdx === 3}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Pin Deck Tag */}
            <span className="mt-2 text-[9px] font-black tracking-widest text-cyan-300 uppercase px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-cyan-400/40 backdrop-blur-md">
              10 PINS UV STRIKE ZONE
            </span>
          </div>

          {/* STRIKE CELEBRATION OVERLAY */}
          <AnimatePresence>
            {isStriking && (
              <motion.div
                initial={{ scale: 0.2, opacity: 0 }}
                animate={{ scale: 1.1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="flex flex-col items-center"
                >
                  <Sparkles className="w-10 h-10 text-yellow-300 animate-spin mb-1" />
                  <span className="text-3xl sm:text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 drop-shadow-[0_0_25px_rgba(250,204,21,0.8)] tracking-tight uppercase">
                    💥 STRIKE 300! 💥
                  </span>
                  <span className="text-xs font-black tracking-widest text-white mt-1 bg-gradient-to-r from-orange-500 to-red-600 px-4 py-1 rounded-full shadow-lg">
                    PERFECT ROLL!
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============================================================== */}
          {/* BOTTOM CENTERED BOWLING BALL & ROLL LAUNCHER                  */}
          {/* ============================================================== */}
          <div className="relative z-20 flex flex-col items-center pb-1">
            
            {/* Bowling Ball with Motion Trail on Throw */}
            <motion.div
              onClick={triggerStrike}
              animate={
                isStriking
                  ? {
                      y: [0, -(isMobile ? 220 : 280)],
                      scale: [1, 0.55],
                      rotate: [0, 720],
                    }
                  : { y: [0, -4, 0] }
              }
              transition={
                isStriking
                  ? { duration: 0.8, ease: 'easeIn' }
                  : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
              }
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full cursor-pointer shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.7)] border-2 border-cyan-300/50 group/ball overflow-hidden active:scale-95"
            >
              {/* Cosmic Ball Base Texture */}
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
                <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-slate-950 border border-cyan-400/80 shadow-inner" />
                <div className="absolute top-7 sm:top-10 left-[38%] -translate-x-1/2 w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 rounded-full bg-slate-950 border border-pink-400/80 shadow-inner" />
                <div className="absolute top-7 sm:top-10 left-[62%] -translate-x-1/2 w-3.5 sm:w-4.5 h-3.5 sm:h-4.5 rounded-full bg-slate-950 border border-purple-400/80 shadow-inner" />
              </div>

              {/* Roll Hover Prompt Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover/ball:opacity-100 transition-opacity backdrop-blur-[1px]">
                <Play className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-pulse" />
                <span className="text-[8px] font-black tracking-widest text-white uppercase mt-0.5">
                  RZUĆ!
                </span>
              </div>

              <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 text-center pointer-events-none">
                <span className="text-[7px] sm:text-[9px] font-black tracking-[0.2em] uppercase text-cyan-200 opacity-90 drop-shadow-[0_0_4px_#06b6d4]">
                  GRAWITACJA
                </span>
              </div>
            </motion.div>

            {/* Ball Shadow */}
            <div className="w-24 sm:w-32 h-2.5 rounded-full bg-black/90 blur-md mx-auto transform scale-x-110 mt-1" />
          </div>

        </div>

        {/* 4. MAIN ACTION BUTTON BELOW LANE */}
        <div className="mt-4 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={triggerStrike}
            disabled={isStriking}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 text-white text-xs sm:text-sm font-black tracking-widest uppercase cursor-pointer shadow-[0_0_30px_rgba(249,115,22,0.55)] hover:shadow-[0_0_45px_rgba(236,72,153,0.75)] transition-all flex items-center justify-center gap-2 border border-orange-400/30"
          >
            {isStriking ? (
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
        </div>

      </div>

    </section>
  );
}
