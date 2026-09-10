import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, ShieldAlert, KeyRound, Eye, EyeOff, MapPin, Crown } from 'lucide-react';
import type { AdminRole, AdminLocation } from '../../../types/auth';

interface PasswordFormProps {
  role: AdminRole;
  location?: AdminLocation;
  errorMessage?: string | null;
  onBack: () => void;
  onSubmit: (password: string) => void;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  role,
  location,
  errorMessage,
  onBack,
  onSubmit,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password);
  };

  const getRoleTitle = () => {
    if (role === 'owner') return 'Logowanie do Panelu Właściciela';
    if (location) return `Recepcja: ${location.toUpperCase()}`;
    return 'Logowanie dla Recepcji';
  };

  const getDemoHint = () => {
    if (role === 'owner') return 'Domyślne hasło: owner2026 (lub 1234)';
    if (location === 'katowice') return 'Hasło Katowice: kat2026 (lub 1234)';
    if (location === 'jaworzno') return 'Hasło Jaworzno: jaw2026 (lub 1234)';
    if (location === 'poznan') return 'Hasło Poznań: poz2026 (lub 1234)';
    return 'Domyślne hasło: 1234';
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Wstecz
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-white/15 text-xs font-black uppercase text-white">
          {role === 'owner' ? (
            <>
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-300">Owner Access</span>
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300">{location}</span>
            </>
          )}
        </div>
      </div>

      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.25)] mb-3">
          <KeyRound className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight text-white">
          {getRoleTitle()}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Wprowadź hasło, aby potwierdzić uprawnienia dostępu.
        </p>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 shadow-md"
        >
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* Password Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło..."
            autoFocus
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-900/90 border border-white/20 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all shadow-inner"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!password.trim()}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 border border-amber-400/40 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-orange-500 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Zaloguj się do systemu
        </button>

        <div className="text-center pt-2">
          <span className="text-[11px] text-slate-500 font-mono">
            💡 {getDemoHint()}
          </span>
        </div>
      </form>
    </div>
  );
};
