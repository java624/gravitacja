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
    if (role === 'owner') return 'Logowanie: Właściciel / Zarząd';
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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Wstecz
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
          {role === 'owner' ? (
            <>
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Zarząd</span>
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase">{location}</span>
            </>
          )}
        </div>
      </div>

      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 mx-auto flex items-center justify-center mb-2.5">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold tracking-tight text-slate-100">
          {getRoleTitle()}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Wprowadź hasło pracownika, aby uzyskać dostęp.
        </p>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* Password Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wprowadź hasło..."
            autoFocus
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-slate-600 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!password.trim()}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-900 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Zaloguj się
        </button>

        <div className="text-center pt-1">
          <span className="text-[11px] text-slate-500 font-mono">
            {getDemoHint()}
          </span>
        </div>
      </form>
    </div>
  );
};
