import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  onClick,
  href,
  className = '',
}: ButtonProps) {
  const variantStyles = {
    primary:
      'text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 bg-[length:200%_auto] hover:bg-right shadow-[0_0_30px_rgba(249,115,22,0.5)] border border-orange-400/30',
    secondary:
      'text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-xl',
    outline:
      'text-orange-400 bg-transparent border border-orange-500/40 hover:bg-orange-500/10 hover:border-orange-500',
    glass:
      'text-white bg-slate-900/60 border border-white/10 hover:border-orange-500/40 backdrop-blur-2xl shadow-inner',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-xs font-black',
  };

  const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl font-black tracking-widest uppercase transition-all duration-300 cursor-pointer ${
    sizeStyles[size]
  } ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        <span>{children}</span>
        {icon}
      </a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={baseClasses}
    >
      <span>{children}</span>
      {icon}
    </motion.button>
  );
}
