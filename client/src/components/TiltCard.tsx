import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, ArrowRight, CircleDot } from 'lucide-react';

import type { LocationItem } from '../data/locations';

interface TiltCardProps {
  loc: LocationItem;
  onSelect: (id: string) => void;
}

export default function TiltCard({ loc, onSelect }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Плавні пружини для 3D-нахилу
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-14deg', '14deg']);

  // Позиція світлової плями за мишкою (%)
  const mouseXPos = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const mouseYPos = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
      onClick={() => onSelect(loc.id)}
      className="relative cursor-pointer rounded-3xl p-8 bg-slate-950/50 border border-white/10 backdrop-blur-2xl transition-all duration-500 group flex flex-col justify-between overflow-hidden shadow-2xl hover:border-orange-500/40"
    >
      {/* Фоновий реактивний Glow-ефект */}
      <div 
        className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
        style={{ background: `radial-gradient(circle at center, ${loc.glow || 'rgba(249,115,22,0.4)'}, transparent 70%)` }}
      />

      {/* Динамічне світло за мишкою на поверхні картки */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl z-0"
        style={{
          background: useTransform(
            [mouseXPos, mouseYPos],
            ([px, py]) => `radial-gradient(500px circle at ${px} ${py}, rgba(255,107,0,0.15), transparent 80%)`
          ),
        }}
      />

      {/* Верхній та середній блок (3D Z-Layer 1) */}
      <div style={{ transform: 'translateZ(35px)' }} className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <span className="text-[10px] font-black px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 tracking-widest uppercase text-slate-300 backdrop-blur-md group-hover:border-orange-500/30 group-hover:text-orange-400 transition-colors">
            {loc.mall}
          </span>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all duration-300 shadow-inner">
            <CircleDot className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
          </div>

        </div>

        <h3 className="text-3xl font-black mb-1.5 text-white tracking-wider group-hover:bg-gradient-to-r group-hover:from-white via-orange-200 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {loc.name}
        </h3>
        
        <p className="text-xs text-orange-400 font-semibold flex items-center gap-1.5 mb-4 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          {loc.address}
        </p>

        <p className="text-sm text-slate-400 leading-relaxed font-normal group-hover:text-slate-300 transition-colors">
          {loc.desc}
        </p>
      </div>

      {/* Нижній блок з кнопкою (3D Z-Layer 2) */}
      <div 
        style={{ transform: 'translateZ(25px)' }}
        className="relative z-10 mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs font-extrabold tracking-widest text-slate-300 group-hover:text-white transition-colors uppercase"
      >
        <span>Wejdź do lokalu</span>
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-all duration-300">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}