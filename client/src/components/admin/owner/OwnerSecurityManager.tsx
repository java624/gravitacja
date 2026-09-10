import React, { useState } from 'react';
import { ShieldCheck, Key, Save, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import type { LocationPasswords } from '../../../types/auth';

export const OwnerSecurityManager: React.FC = () => {
  const { passwords, updatePassword } = useAdminAuth();

  const [editingTarget, setEditingTarget] = useState<keyof LocationPasswords | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const targets: { id: keyof LocationPasswords; label: string; desc: string; iconColor: string }[] = [
    {
      id: 'katowice',
      label: 'Hasło Recepcji Katowice',
      desc: 'Udostępnia dostęp tylko do danych centrum w Katowicach.',
      iconColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      id: 'jaworzno',
      label: 'Hasło Recepcji Jaworzno',
      desc: 'Udostępnia dostęp tylko do danych centrum w Jaworznie.',
      iconColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      id: 'poznan',
      label: 'Hasło Recepcji Poznań',
      desc: 'Udostępnia dostęp tylko do danych centrum w Poznaniu.',
      iconColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      id: 'owner',
      label: 'Master-Hasło Właściciela (Owner)',
      desc: 'Zapewnia pełny dostęp globalny do wszystkich centrów oraz ustawień systemowych.',
      iconColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
  ];

  const toggleShowPassword = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartEditing = (target: keyof LocationPasswords) => {
    setEditingTarget(target);
    setNewPasswordValue(passwords[target] || '');
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSave = (target: keyof LocationPasswords) => {
    if (!newPasswordValue.trim() || newPasswordValue.trim().length < 4) {
      setErrorMessage('Hasło musi zawierać co najmniej 4 znaki.');
      return;
    }

    const ok = updatePassword(target, newPasswordValue.trim());
    if (ok) {
      setSuccessMessage(`Hasło dla ${target.toUpperCase()} zostało pomyślnie zaktualizowane!`);
      setEditingTarget(null);
      setNewPasswordValue('');
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage('Nie udało się zapisać hasła. Spróbuj ponownie.');
    }
  };

  return (
    <div className="bg-slate-950/80 border border-white/15 rounded-3xl p-6 backdrop-blur-2xl space-y-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-white">
              Centrum Bezpieczeństwa i Haseł Dostępnych
            </h2>
            <p className="text-xs text-slate-400">
              Zarządzanie hasłami logowania dla recepcji każdej lokalizacji oraz master-hasłem Właściciela.
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Password List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {targets.map((item) => {
          const currentVal = passwords[item.id];
          const isEditing = editingTarget === item.id;
          const isVisible = !!showPasswords[item.id];

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-white/20 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${item.iconColor}`}>
                    <Key className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    {item.label}
                  </h3>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.desc}
              </p>

              {isEditing ? (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newPasswordValue}
                    onChange={(e) => setNewPasswordValue(e.target.value)}
                    placeholder="Nowe hasło..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/50 text-white font-mono text-xs focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSave(item.id)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-black uppercase flex items-center gap-1.5 hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Zapisz
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTarget(null)}
                    className="px-3 py-2 rounded-xl bg-white/5 text-slate-400 text-xs hover:text-white transition-colors cursor-pointer"
                  >
                    Anuluj
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-white/10 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {isVisible ? currentVal : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleShowPassword(item.id)}
                      className="text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                      title={isVisible ? 'Ukryj' : 'Pokaż'}
                    >
                      {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartEditing(item.id)}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Zmień hasło
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
