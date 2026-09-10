import { useAdminAuth } from '../context/AdminAuthContext';
import { ReceptionDashboard } from '../components/admin/reception/ReceptionDashboard';
import { OwnerDashboard } from '../components/admin/owner/OwnerDashboard';
import { Lock, Sparkles } from 'lucide-react';

interface AdminPageProps {
  onOpenAuthModal?: () => void;
}

export default function AdminPage({ onOpenAuthModal }: AdminPageProps) {
  const { isAuthenticated, role } = useAdminAuth();

  if (!isAuthenticated) {
    return (
      <div className="py-24 text-center space-y-5 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Strefa Chroniona
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Wymagana Autoryzacja
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Zaloguj się jako pracownik Recepcji lub Właściciel, aby uzyskać dostęp do panelu zarządzania.
          </p>
        </div>

        {onOpenAuthModal && (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 border border-amber-400/40 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-orange-500 transition-all cursor-pointer"
          >
            Wejdź do Panelu Zarządzania
          </button>
        )}
      </div>
    );
  }

  if (role === 'reception') {
    return <ReceptionDashboard />;
  }

  return <OwnerDashboard />;
}
