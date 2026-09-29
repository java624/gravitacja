import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hoverGlow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  glowColor = 'rgba(249, 115, 22, 0.3)',
  hoverGlow = true,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { y: -4 } : undefined}
      className={`relative rounded-3xl p-6 bg-slate-950/60 border border-white/10 backdrop-blur-2xl transition-all duration-300 overflow-hidden shadow-2xl ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* М'яка фонова підсвітка */}
      {hoverGlow && (
        <div
          className="absolute -inset-1 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10 pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)` }}
        />
      )}

      {children}
    </motion.div>
  );
}
