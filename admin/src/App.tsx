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
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-sm w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
          {/* Logo & Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl font-bold uppercase tracking-widest text-slate-100">
                GRAWITACJA
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Panel Administracyjny
            </div>
          </div>

          {/* Lock icon */}
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Strefa Pracownika
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Wewnętrzny system zarządzania rezerwacjami i obłożeniem.
            </p>
          </div>

          <button
            onClick={() => setIsLoginOpen(true)}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-white text-slate-900 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Zaloguj się do Panelu
          </button>

          <p className="text-[11px] text-slate-500">
            © 2026 Centrum Rozrywki Grawitacja
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Admin Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-3 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold uppercase tracking-wider text-slate-100">
              GRAWITACJA
            </span>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              {role === 'owner' ? 'Właściciel / Zarząd' : 'Recepcja'}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>System online</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Wyloguj</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
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
