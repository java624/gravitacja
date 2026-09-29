import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLoginModal } from './components/admin/auth/AdminLoginModal';
import { ReceptionDashboard } from './components/admin/reception/ReceptionDashboard';
import { OwnerDashboard } from './components/admin/owner/OwnerDashboard';
import { Lock, ShieldCheck, LogOut } from 'lucide-react';
import './index.css';

function AdminApp() {
  const { isAuthenticated, role, logout } = useAdminAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(!isAuthenticated);

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020308] text-white flex flex-col items-center justify-center p-6">
        {/* Ambient background glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/8 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-md w-full">
          {/* Logo */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl font-black uppercase tracking-[0.3em] text-white">
                GRAVI<span className="text-orange-400">TACJA</span>
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5" />
              Panel Zarządzania
            </div>
          </div>

          {/* Lock icon */}
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)]">
            <Lock className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
              Strefa Pracownika
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              To jest wewnętrzny panel zarządzania Grawitacja.<br />
              Dostęp wyłącznie dla pracowników Recepcji i Właściciela.
            </p>
          </div>

          <button
            onClick={() => setIsLoginOpen(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 border border-amber-400/40 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer"
          >
            Zaloguj się do Panelu
          </button>

          <p className="text-[10px] text-slate-600">
            © 2026 Centrum Rozrywki Grawitacja • System Wewnętrzny
          </p>
        </div>

        <AdminLoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020308] text-white">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-orange-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Top Admin Bar */}
      <header className="relative z-20 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black uppercase tracking-widest text-white">
              GRAVI<span className="text-orange-400">TACJA</span>
            </span>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              {role === 'owner' ? 'Właściciel' : 'Recepcja'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>System online</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Wyloguj</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {role === 'reception' ? (
          <ReceptionDashboard />
        ) : (
          <OwnerDashboard />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AdminApp />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
