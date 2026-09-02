import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, ArrowRight, CircleDot, Zap, Sparkles, Flame } from 'lucide-react';

import type { LocationItem } from '../types';
import BowlingPin from './ui/BowlingPin';

interface TiltCardProps {
  loc: LocationItem;
  onSelect: (id: string) => void;
}

export default function TiltCard({ loc, onSelect }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const mouseYSpring = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);
  const scale = useSpring(1, { stiffness: 300, damping: 20 });

  const mouseXPos = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const mouseYPos = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const shineAngle = useTransform(mouseXSpring, [-0.5, 0.5], ['-20deg', '20deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    if (!isMobile) scale.set(1.02);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const pinRows = [
    { count: 4 },
    { count: 3 },
    { count: 2 },
    { count: 1 },
  ];

  return (
    <div style={{ perspective: isMobile ? undefined : 1400 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          isMobile
            ? undefined
            : { rotateY, rotateX, scale, transformStyle: 'preserve-3d' }
        }
        onClick={() => onSelect(loc.id)}
        className="relative cursor-pointer rounded-3xl p-6 sm:p-8 bg-slate-950/90 md:bg-slate-950/70 border border-white/10 backdrop-blur-md md:backdrop-blur-2xl transition-colors duration-300 group flex flex-col justify-between overflow-hidden shadow-2xl hover:border-orange-500/60 active:scale-[0.98]"
      >
        {/* Анімована градієнтна рамка по периметру при наведенні */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              padding: '1.5px',
              background: 'linear-gradient(135deg, rgba(249,115,22,0.8), rgba(168,85,247,0.8), rgba(6,182,212,0.8))',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        </div>

        {/* Фоновий реактивний Glow-ефект */}
        <div
          className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10 hidden sm:block"
          style={{ background: `radial-gradient(circle at center, ${loc.glow || 'rgba(249,115,22,0.5)'}, transparent 70%)` }}
        />

        {/* Динамічне неонове світло за мишкою (Desktop only) */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl z-0"
            style={{
              background: useTransform(
                [mouseXPos, mouseYPos],
                ([px, py]) => `radial-gradient(480px circle at ${px} ${py}, rgba(168,85,247,0.2), transparent 80%)`,
              ),
            }}
          />
        )}

        {/* 10-PINS OVERLAY (Desktop only to keep mobile lightweight) */}
        <div className="absolute top-2 right-2 bottom-12 w-3/5 opacity-0 group-hover:opacity-100 scale-85 group-hover:scale-100 transition-all duration-500 ease-out pointer-events-none z-0 hidden lg:flex flex-col items-center justify-center gap-2">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/25 via-purple-600/35 to-pink-500/25 blur-3xl rounded-full" />
          <div className="absolute bottom-4 w-40 h-10 rounded-full bg-gradient-to-r from-orange-500/20 via-pink-500/30 to-purple-500/20 blur-md border border-pink-400/30" />

          <div className="relative flex flex-col items-center gap-2 transform -rotate-12 translate-x-4">
            {pinRows.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center justify-center gap-2.5">
                {[...Array(row.count)].map((_, pIdx) => (
                  <motion.div
                    key={pIdx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (rIdx * 4 + pIdx) * 0.04 }}
                    whileHover={{ scale: 1.3, y: -4, rotate: 10 }}
                    className="relative group/pin pointer-events-auto cursor-pointer"
                  >
                    <BowlingPin
                      width={28}
                      height={68}
                      glowColor={pIdx % 2 === 0 ? 'orange' : 'purple'}
                      showCrown={rIdx === 3}
                    />
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-2 px-3 py-1 rounded-full bg-slate-950/80 border border-orange-500/40 text-[9px] font-black tracking-widest text-orange-300 uppercase flex items-center gap-1.5 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <Flame className="w-3 h-3 text-orange-400 animate-pulse" />
            <span>10 PINS STRIKE DECK</span>
          </div>
        </div>

        {/* Ковзний діагональний блік (shine sweep - Desktop only) */}
        {!isMobile && (
          <motion.div
            className="absolute -inset-y-full inset-x-0 w-1/3 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none z-0"
            style={{
              rotate: shineAngle,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
            }}
          />
        )}

        {/* CARD CONTENT LAYER */}
        <div style={{ transform: isMobile ? undefined : 'translateZ(40px)' }} className="relative z-10 text-left">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-white/5 border border-white/10 tracking-widest uppercase text-slate-300 backdrop-blur-md group-hover:border-orange-500/40 group-hover:text-orange-400 transition-colors w-fit">
                {loc.mall}
              </span>
              <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-400/40 text-purple-300 tracking-wider uppercase flex items-center gap-1.5 w-fit group-hover:border-purple-400/70 group-hover:bg-purple-500/25 transition-all">
                <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" />
                {loc.uvLanes || loc.lanes}
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-300">
              <CircleDot className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black mb-1.5 text-white tracking-wider group-hover:bg-gradient-to-r group-hover:from-white via-orange-200 group-hover:to-orange-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {loc.name}
          </h3>

          <p className="text-xs text-orange-400 font-semibold flex items-center gap-1.5 mb-3 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            {loc.address}
          </p>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal group-hover:text-slate-200 transition-colors">
            {loc.desc}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {(loc.glowTags || ['10 Pins Deck', 'UV Lightshow', 'VIP Zone']).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 group-hover:border-purple-500/40 group-hover:text-purple-300 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Нижній блок з кнопкою */}
        <div
          style={{ transform: isMobile ? undefined : 'translateZ(30px)' }}
          className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-extrabold tracking-widest text-slate-300 group-hover:text-white transition-colors uppercase"
        >
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-orange-400 opacity-80 group-hover:opacity-100 transition-opacity" />
            Wejdź do lokalu
          </span>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

