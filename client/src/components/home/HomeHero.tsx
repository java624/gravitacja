import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Flame, Zap, Trophy, Play } from 'lucide-react';
import BowlingPin from '../ui/BowlingPin';

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const ballRotateX = useTransform(smoothY, [-0.5, 0.5], ['20deg', '-20deg']);
  const ballRotateY = useTransform(smoothX, [-0.5, 0.5], ['-25deg', '25deg']);
  const shineTranslateX = useTransform(smoothX, [-0.5, 0.5], ['-35%', '35%']);
  const shineTranslateY = useTransform(smoothY, [-0.5, 0.5], ['-35%', '35%']);
  const glowX = useTransform(smoothX, [-0.5, 0.5], ['-20px', '20px']);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ['-20px', '20px']);

  const laserAngle = useTransform(smoothX, [-0.5, 0.5], ['-20deg', '20deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const triggerStrike = () => {
    if (isStriking) return;
    setIsStriking(true);
    setStrikeCount((prev) => prev + 1);
    setTimeout(() => {
      setIsStriking(false);
    }, 2200);
  };

  const pinDeckRows = [
    { count: 4 },
    { count: 3 },
    { count: 2 },
    { count: 1 },
  ];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative text-center max-w-6xl mx-auto flex flex-col justify-center items-center py-6 sm:py-10 px-3 sm:px-6 overflow-hidden select-none"
    >
      {/* 1. BACKGROUND NEON GLOW & OPTIONAL 3D LANES (Desktop Only) */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center overflow-hidden">
        <div className="absolute w-[300px] sm:w-[800px] h-[300px] sm:h-[450px] rounded-full bg-gradient-to-tr from-cyan-600/15 via-purple-600/20 to-pink-600/15 blur-2xl sm:blur-[100px]" />

        {/* Desktop Side Pins */}
        {!isMobile && (
          <div className="absolute inset-x-4 inset-y-12 hidden lg:flex justify-between items-center pointer-events-none z-0 opacity-45">
            <div className="flex flex-col gap-6 items-start pl-4 pointer-events-auto">
              {[
                { delay: 0, rot: -15, glow: 'cyan' as const, scale: 0.9 },
                { delay: 0.3, rot: 18, glow: 'pink' as const, scale: 1.05 },
                { delay: 0.6, rot: -12, glow: 'purple' as const, scale: 0.9 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  animate={{ y: [-12, 12, -12], rotate: [item.rot, item.rot + 8, item.rot] }}
                  transition={{ repeat: Infinity, duration: 4.5, delay: item.delay, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.2, rotate: 0 }}
                  onClick={triggerStrike}
                  className="cursor-pointer group/sidepin flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <BowlingPin
                    width={36 * item.scale}
                    height={85 * item.scale}
                    glowColor={item.glow}
                    className="blur-[0.4px] hover:blur-none"
                  />
                  <span className="text-[10px] font-black tracking-widest text-cyan-300 opacity-0 group-hover/sidepin:opacity-100 transition-opacity bg-slate-950/90 px-2.5 py-1 rounded-md border border-cyan-400/50 shadow-lg">
                    STRIKE!
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-6 items-end pr-4 pointer-events-auto">
              {[
                { delay: 0.2, rot: 15, glow: 'orange' as const, scale: 1.05 },
                { delay: 0.5, rot: -18, glow: 'purple' as const, scale: 0.9 },
                { delay: 0.8, rot: 14, glow: 'cyan' as const, scale: 1.0 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  animate={{ y: [12, -12, 12], rotate: [item.rot, item.rot - 8, item.rot] }}
                  transition={{ repeat: Infinity, duration: 5, delay: item.delay, ease: 'easeInOut' }}
                  whileHover={{ scale: 1.2, rotate: 0 }}
                  onClick={triggerStrike}
                  className="cursor-pointer group/sidepin flex items-center gap-3 flex-row-reverse opacity-60 hover:opacity-100 transition-opacity"
                >
                  <BowlingPin
                    width={36 * item.scale}
                    height={85 * item.scale}
                    glowColor={item.glow}
                    className="blur-[0.4px] hover:blur-none"
                  />
                  <span className="text-[10px] font-black tracking-widest text-purple-300 opacity-0 group-hover/sidepin:opacity-100 transition-opacity bg-slate-950/90 px-2.5 py-1 rounded-md border border-purple-400/50 shadow-lg">
                    GLOW PIN!
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* 3D Perspective Lanes Guidelines Canvas (Desktop Only) */}
        {!isMobile && (
          <div
            className="relative w-full max-w-4xl h-[460px] opacity-50 hover:opacity-75 transition-opacity duration-700 hidden md:block"
            style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
          >
            <div
              className="w-full h-full flex justify-center items-end"
              style={{ transform: 'rotateX(68deg) translateY(-10px)' }}
            >
              <div className="relative w-full h-[650px] border-x-2 border-cyan-400/50 bg-gradient-to-t from-cyan-950/30 via-purple-950/20 to-transparent shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                <div className="absolute inset-0 grid grid-cols-12 divide-x divide-cyan-500/20">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-full" />
                  ))}
                </div>

                <motion.div
                  style={{ rotate: laserAngle }}
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[3px] h-[450px] bg-gradient-to-t from-cyan-400 via-pink-500 to-yellow-300 shadow-[0_0_15px_#06b6d4] origin-bottom opacity-80"
                />

                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                  {pinDeckRows.map((row, rIdx) => (
                    <div key={rIdx} className="flex gap-2 items-center">
                      {[...Array(row.count)].map((_, pIdx) => (
                        <motion.div
                          key={pIdx}
                          animate={
                            isStriking
                              ? {
                                  x: (Math.random() - 0.5) * 260,
                                  y: -140 - Math.random() * 180,
                                  rotate: (Math.random() - 0.5) * 720,
                                  scale: [1, 1.4, 0],
                                  opacity: [1, 1, 0],
                                }
                              : { y: [0, -3, 0], opacity: 1, scale: 1, rotate: 0 }
                          }
                          transition={
                            isStriking
                              ? { duration: 1.2, ease: 'easeOut' }
                              : { repeat: Infinity, duration: 2 + pIdx * 0.3 }
                          }
                        >
                          <BowlingPin
                            width={24}
                            height={58}
                            glowColor={pIdx % 2 === 0 ? 'cyan' : 'pink'}
                            showCrown={rIdx === 3}
                          />
                        </motion.div>
                      ))}
                    </div>
                  ))}
                  <div className="w-56 h-10 rounded-full border border-pink-500/40 bg-pink-500/10 blur-sm mt-1 animate-pulse" />
                </div>

                <div className="absolute bottom-16 left-0 right-0 h-[4px] bg-gradient-to-r from-red-500 via-orange-400 to-red-500 shadow-[0_0_20px_#f97316]" />

                <div className="absolute bottom-48 left-0 right-0 flex justify-around px-8">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.2 }}
                      className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[22px] border-b-cyan-400 drop-shadow-[0_0_12px_#06b6d4]"
                    />
                  ))}
                </div>

                <div className="absolute bottom-32 left-0 right-0 flex justify-around px-12">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]"
                    />
                  ))}
                </div>

                <div className="absolute top-0 bottom-0 left-0 w-[5px] bg-gradient-to-b from-transparent via-cyan-400 to-purple-500 shadow-[0_0_16px_#06b6d4]" />
                <div className="absolute top-0 bottom-0 right-0 w-[5px] bg-gradient-to-b from-transparent via-cyan-400 to-purple-500 shadow-[0_0_16px_#06b6d4]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. FOREGROUND CONTENT & HERO BOWLING BALL */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Top Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-[10px] sm:text-xs font-black tracking-widest uppercase text-cyan-300 backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
            <span>NOWY WYMIAR ROZRYWKI</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-500/15 border border-purple-400/40 text-[10px] sm:text-xs font-black tracking-widest uppercase text-purple-300 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>14 UV-TORÓW</span>
          </div>

          {strikeCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-[10px] sm:text-xs font-black tracking-widest uppercase text-yellow-300 backdrop-blur-md"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>STRIKES: {strikeCount}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Dynamic Responsive Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-3 sm:mb-4 leading-[1.05] select-none"
        >
          POCZUJ <br />
          <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,72,153,0.4)]">
            NEONOWĄ GRAWITACJĘ
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-300 text-sm sm:text-base md:text-xl max-w-2xl mb-6 sm:mb-8 font-light leading-relaxed px-2"
        >
          Wybierz swoje miasto, aby zanurzyć się w kosmicznym klimacie i zarezerwować tor online z efektami Glow Bowling.
        </motion.p>

        {/* CENTER 3D BOWLING BALL */}
        <div className="relative my-2 flex items-center justify-center">
          <div
            className="relative flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            onClick={triggerStrike}
            style={{ perspective: isMobile ? undefined : 1200 }}
          >
            {/* Radial glow backdrop */}
            <motion.div
              style={isMobile ? undefined : { x: glowX, y: glowY }}
              className="absolute w-36 sm:w-60 h-36 sm:h-60 rounded-full bg-gradient-to-tr from-cyan-500 via-pink-500 to-purple-600 blur-xl sm:blur-3xl opacity-75 pointer-events-none"
            />

            {/* Orbiting Ring 1 (Desktop) */}
            {!isMobile && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
                className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-cyan-400/40 border-dashed pointer-events-none"
              />
            )}

            {/* STRIKE FLASH OVERLAY */}
            <AnimatePresence>
              {isStriking && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute z-30 pointer-events-none flex flex-col items-center justify-center"
                >
                  <div className="w-36 h-36 rounded-full bg-gradient-to-r from-yellow-300 via-pink-500 to-cyan-400 blur-lg" />
                  <span className="absolute text-3xl sm:text-5xl font-black italic text-yellow-300 tracking-tighter drop-shadow-[0_0_20px_#facc15]">
                    STRIKE 300!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3D Bowling Ball Container */}
            <motion.div
              style={
                isMobile
                  ? undefined
                  : { rotateX: ballRotateX, rotateY: ballRotateY, transformStyle: 'preserve-3d' }
              }
              animate={
                isStriking
                  ? { y: [-10, -120, -10], scale: [1, 0.5, 1] }
                  : { y: [-4, 4, -4] }
              }
              transition={
                isStriking
                  ? { duration: 1.2, ease: 'easeInOut' }
                  : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
              }
              className="relative w-36 h-36 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_50px_rgba(6,182,212,0.6)] border-2 border-cyan-300/40 group/ball"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 18%, #818cf8 42%, #c084fc 68%, #030712 95%)',
                }}
              />

              <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/60 via-purple-600/40 to-transparent mix-blend-color-dodge" />

              {!isMobile && (
                <motion.div
                  style={{ x: shineTranslateX, y: shineTranslateY }}
                  className="absolute inset-0 rounded-full pointer-events-none"
                >
                  <div className="absolute top-5 left-7 w-20 h-10 bg-white/50 blur-md rounded-full transform -rotate-45" />
                </motion.div>
              )}

              {/* 3 Finger Holes */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute bottom-10 sm:bottom-16 left-1/2 -translate-x-1/2 w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-slate-950 border border-cyan-400/80 shadow-inner" />
                <div className="absolute top-14 sm:top-20 left-[38%] -translate-x-1/2 w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-slate-950 border border-pink-400/80 shadow-inner" />
                <div className="absolute top-14 sm:top-20 left-[62%] -translate-x-1/2 w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-slate-950 border border-purple-400/80 shadow-inner" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover/ball:opacity-100 transition-opacity backdrop-blur-[2px]">
                <Play className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
                <span className="text-[9px] font-black tracking-widest text-white uppercase mt-1">
                  KLIKNIJ • RZUĆ!
                </span>
              </div>

              <div className="absolute bottom-4 sm:bottom-7 left-0 right-0 text-center pointer-events-none">
                <span className="text-[8px] sm:text-[10px] font-black tracking-[0.2em] uppercase text-cyan-200 opacity-90 drop-shadow-[0_0_6px_#06b6d4]">
                  GRAWITACJA
                </span>
              </div>
            </motion.div>
          </div>

          <div className="w-36 sm:w-48 h-4 rounded-full bg-black/80 blur-lg mx-auto transform scale-x-110" />
        </div>

        {/* Action Prompt Button */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={triggerStrike}
          className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 text-white text-xs font-black tracking-widest uppercase cursor-pointer shadow-[0_0_25px_rgba(249,115,22,0.5)] active:scale-95 transition-all"
        >
          <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          <span>{isStriking ? 'STRIKE W TOKU! 💥' : 'ZROB STRIKE! (KLIKNIJ KUŁĘ)'}</span>
        </motion.div>
      </div>
    </section>
  );
}
