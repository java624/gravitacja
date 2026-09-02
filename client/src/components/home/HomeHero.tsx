import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, Zap, Trophy, Play } from 'lucide-react';
import BowlingPin from '../ui/BowlingPin';

export default function HomeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isStriking, setIsStriking] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);

  // Motion values for interactive 3D tilt/rotation following mouse movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Rotation and transform mapping for 3D Neon Bowling Ball
  const ballRotateX = useTransform(smoothY, [-0.5, 0.5], ['25deg', '-25deg']);
  const ballRotateY = useTransform(smoothX, [-0.5, 0.5], ['-30deg', '30deg']);
  const shineTranslateX = useTransform(smoothX, [-0.5, 0.5], ['-35%', '35%']);
  const shineTranslateY = useTransform(smoothY, [-0.5, 0.5], ['-35%', '35%']);
  const glowX = useTransform(smoothX, [-0.5, 0.5], ['-25px', '25px']);
  const glowY = useTransform(smoothY, [-0.5, 0.5], ['-25px', '25px']);

  // Laser trajectory angle in lane perspective
  const laserAngle = useTransform(smoothX, [-0.5, 0.5], ['-20deg', '20deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
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

  // Trigger interactive Strike Animation!
  const triggerStrike = () => {
    if (isStriking) return;
    setIsStriking(true);
    setStrikeCount((prev) => prev + 1);
    setTimeout(() => {
      setIsStriking(false);
    }, 2200);
  };

  // 10 Pins Layout positions for the lane pin deck
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
      className="relative text-center max-w-6xl mx-auto flex flex-col justify-center items-center py-10 px-4 overflow-hidden select-none"
    >
      {/* ============================================================== */}
      {/* 1. STYLIZED NEON BOWLING LANES GUIDELINES & BACKGROUND PINS   */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center overflow-hidden">
        {/* Ambient Dark Neon Pulse Background */}
        <div className="absolute w-[900px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-600/15 via-purple-600/20 to-pink-600/15 blur-[120px] animate-pulse" />

        {/* BACKGROUND ATMOSPHERIC FLOATING PINS (LEFT & RIGHT) */}
        <div className="absolute inset-x-4 inset-y-12 hidden lg:flex justify-between items-center pointer-events-none z-0 opacity-45">
          {/* LEFT BACKGROUND FLOATING PINS */}
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

          {/* RIGHT BACKGROUND FLOATING PINS */}
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

        {/* 3D Perspective Bowling Lanes Guidelines Canvas Container */}
        <div
          className="relative w-full max-w-4xl h-[460px] opacity-50 hover:opacity-75 transition-opacity duration-700"
          style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        >
          <div
            className="w-full h-full flex justify-center items-end"
            style={{ transform: 'rotateX(68deg) translateY(-10px)' }}
          >
            {/* Lane Floor Parquet Grid & Lines */}
            <div className="relative w-full h-[650px] border-x-2 border-cyan-400/50 bg-gradient-to-t from-cyan-950/30 via-purple-950/20 to-transparent shadow-[0_0_40px_rgba(6,182,212,0.3)]">
              
              {/* Longitudinal Board Lines (Parquet guide lines) */}
              <div className="absolute inset-0 grid grid-cols-12 divide-x divide-cyan-500/20">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-full" />
                ))}
              </div>

              {/* Dynamic Interactive Aiming Laser Trajectory Line */}
              <motion.div
                style={{ rotate: laserAngle }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[3px] h-[450px] bg-gradient-to-t from-cyan-400 via-pink-500 to-yellow-300 shadow-[0_0_15px_#06b6d4] origin-bottom opacity-80"
              />

              {/* 10 REALISTIC PINS DECK AT THE END OF THE PERSPECTIVE LANE FLOOR */}
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
                {/* Pin Deck Spot Light Ring */}
                <div className="w-56 h-10 rounded-full border border-pink-500/40 bg-pink-500/10 blur-sm mt-1 animate-pulse" />
              </div>

              {/* Glowing Foul Line */}
              <div className="absolute bottom-16 left-0 right-0 h-[4px] bg-gradient-to-r from-red-500 via-orange-400 to-red-500 shadow-[0_0_20px_#f97316]" />

              {/* Bowling Lane Arrow Guides (Target arrows) */}
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

              {/* Approach Guide Dots Row */}
              <div className="absolute bottom-32 left-0 right-0 flex justify-around px-12">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]"
                  />
                ))}
              </div>

              {/* Side Gutter Glow Lines */}
              <div className="absolute top-0 bottom-0 left-0 w-[5px] bg-gradient-to-b from-transparent via-cyan-400 to-purple-500 shadow-[0_0_16px_#06b6d4]" />
              <div className="absolute top-0 bottom-0 right-0 w-[5px] bg-gradient-to-b from-transparent via-cyan-400 to-purple-500 shadow-[0_0_16px_#06b6d4]" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. FOREGROUND CONTENT & HERO BOWLING BALL                     */}
      {/* ============================================================== */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Top UV Glow Bowling Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-xs font-black tracking-[0.2em] uppercase text-cyan-300 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.35)]">
            <Flame className="w-4 h-4 text-pink-500 animate-pulse" />
            <span>NOWY WYMIAR ROZRYWKI • KRĘGLE • BILARD</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-500/15 border border-purple-400/40 text-xs font-black tracking-widest uppercase text-purple-300 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
            <span>14 UV-TORÓW</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-500/15 border border-pink-400/40 text-xs font-black tracking-widest uppercase text-pink-300 backdrop-blur-xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>GLOW BOWLING ZONE</span>
          </div>

          {strikeCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-xs font-black tracking-widest uppercase text-yellow-300 backdrop-blur-xl shadow-[0_0_25px_rgba(234,179,8,0.5)]"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>STRIKES: {strikeCount}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Dynamic Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-4 leading-none select-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]"
        >
          POCZUJ <br />
          <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_40px_rgba(236,72,153,0.5)]">
            NEONOWĄ GRAWITACJĘ
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-300 text-base md:text-xl max-w-2xl mb-8 font-light leading-relaxed drop-shadow-md"
        >
          Wybierz swoje miasto, aby zanurzyć się w kosmicznym klimacie i zarezerwować tor online z efektami Glow Bowling.
        </motion.p>

        {/* ============================================================== */}
        {/* CENTER 3D BOWLING BALL                                        */}
        {/* ============================================================== */}
        <div className="relative my-2 flex items-center justify-center">

          {/* CENTER 3D BOWLING BALL WITH STRIKE CLICK INTERACTION */}
          <div className="relative flex items-center justify-center cursor-pointer" onClick={triggerStrike} style={{ perspective: 1200 }}>
            
            {/* Reactive Backlight Glow Shadow reacting to mouse */}
            <motion.div
              style={{ x: glowX, y: glowY }}
              className="absolute w-60 h-60 rounded-full bg-gradient-to-tr from-cyan-500 via-pink-500 to-purple-600 blur-3xl opacity-75 animate-pulse pointer-events-none"
            />

            {/* Orbiting Neon Ring 1 */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
              className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-cyan-400/40 border-dashed pointer-events-none shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            />

            {/* Orbiting Neon Ring 2 */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
              className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-pink-500/35 border-dotted pointer-events-none shadow-[0_0_25px_rgba(236,72,153,0.35)]"
            />

            {/* STRIKE EXPLOSION FLASH ANIMATION OVERLAY */}
            <AnimatePresence>
              {isStriking && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 3.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute z-30 pointer-events-none flex flex-col items-center justify-center"
                >
                  <div className="w-48 h-48 rounded-full bg-gradient-to-r from-yellow-300 via-pink-500 to-cyan-400 blur-xl" />
                  <span className="absolute text-5xl font-black italic text-yellow-300 tracking-tighter drop-shadow-[0_0_30px_#facc15]">
                    STRIKE 300!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3D Bowling Ball Container */}
            <motion.div
              style={{ rotateX: ballRotateX, rotateY: ballRotateY, transformStyle: 'preserve-3d' }}
              animate={
                isStriking
                  ? { y: [-10, -180, -10], scale: [1, 0.4, 1] }
                  : { y: [-6, 6, -6] }
              }
              transition={
                isStriking
                  ? { duration: 1.2, ease: 'easeInOut' }
                  : { repeat: Infinity, duration: 4, ease: 'easeInOut' }
              }
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_70px_rgba(6,182,212,0.7)] border-2 border-cyan-300/40 transition-shadow duration-300 group/ball"
            >
              {/* Base Spherical Cosmic Neon Texture Layer */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 18%, #818cf8 42%, #c084fc 68%, #030712 95%)',
                }}
              />

              {/* Glowing Nebula Veins inside ball */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/60 via-purple-600/40 to-transparent mix-blend-color-dodge" />

              {/* Specular Light Reflection Sweep (moves with mouse) */}
              <motion.div
                style={{ x: shineTranslateX, y: shineTranslateY }}
                className="absolute inset-0 rounded-full pointer-events-none"
              >
                <div className="absolute top-5 left-7 w-24 h-12 bg-white/50 blur-md rounded-full transform -rotate-45" />
              </motion.div>

              {/* 3 Finger Holes (Indented Grips with glowing rims & depth shadow) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(35px)' }}>
                {/* Thumb Hole */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-slate-950 shadow-[inset_0_4px_8px_rgba(0,0,0,0.95),0_0_12px_#06b6d4] border border-cyan-400/80" />

                {/* Finger Hole 1 (Middle Finger) */}
                <div className="absolute top-20 left-[38%] -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 shadow-[inset_0_4px_8px_rgba(0,0,0,0.95),0_0_12px_#ec4899] border border-pink-400/80" />

                {/* Finger Hole 2 (Ring Finger) */}
                <div className="absolute top-20 left-[62%] -translate-x-1/2 w-6 h-6 rounded-full bg-slate-950 shadow-[inset_0_4px_8px_rgba(0,0,0,0.95),0_0_12px_#a855f7] border border-purple-400/80" />
              </div>

              {/* Click to Roll CTA Overlay on Ball */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover/ball:opacity-100 transition-opacity backdrop-blur-[2px]">
                <Play className="w-8 h-8 text-yellow-300 fill-yellow-300 animate-pulse drop-shadow-[0_0_10px_#facc15]" />
                <span className="text-[10px] font-black tracking-widest text-white uppercase mt-1">
                  KLIKNIJ • RZUĆ KUŁĄ!
                </span>
              </div>

              {/* Logo/Brand Engraving on Ball Surface */}
              <div className="absolute bottom-7 left-0 right-0 text-center pointer-events-none" style={{ transform: 'translateZ(25px)' }}>
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-cyan-200 opacity-90 drop-shadow-[0_0_6px_#06b6d4]">
                  GRAWITACJA
                </span>
              </div>
            </motion.div>
          </div>

          {/* Floor Shadow Reflection under ball */}
          <div className="w-48 h-5 rounded-full bg-black/90 blur-xl mx-auto transform scale-x-110" />
        </div>

        {/* Interactive Action Prompt below Ball */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={triggerStrike}
          className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 text-white text-xs font-black tracking-widest uppercase cursor-pointer shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:shadow-[0_0_45px_rgba(236,72,153,0.8)] transition-shadow"
        >
          <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          <span>{isStriking ? 'STRIKE W TOKU! 💥' : 'ZROB STRIKE! (KLIKNIJ KUŁĘ)'}</span>
        </motion.div>
      </div>
    </section>
  );
}
