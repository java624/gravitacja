import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'orange' | 'red' | 'purple' | 'emerald' | 'gradient';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export default function Badge({
  children,
  variant = 'orange',
  size = 'md',
  className = '',
  icon,
}: BadgeProps) {
  const variantStyles = {
    cyan: 'bg-cyan-500/10 border-cyan-400/30 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)]',
    red: 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.25)]',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    gradient: 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-[0_0_25px_rgba(249,115,22,0.4)]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-[10px]',
    md: 'px-4 py-1.5 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-black tracking-[0.2em] uppercase backdrop-blur-xl transition-all ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}
