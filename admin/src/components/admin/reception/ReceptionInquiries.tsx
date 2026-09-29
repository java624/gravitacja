import React, { useState } from 'react';
import { Gift, Cake } from 'lucide-react';
import type { AdminLocation } from '../../../types/auth';
import CorporateInquiriesTable from '../CorporateInquiriesTable';
import KidsBirthdaysTable from '../KidsBirthdaysTable';

interface ReceptionInquiriesProps {
  location: AdminLocation;
}

export const ReceptionInquiries: React.FC<ReceptionInquiriesProps> = ({ location }) => {
  const [tab, setTab] = useState<'corporate' | 'birthdays'>('corporate');

  return (
    <div className="space-y-4">
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-white/10 w-fit">
        <button
          type="button"
          onClick={() => setTab('corporate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            tab === 'corporate'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Zapytania Firmowe ({location?.toUpperCase()})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('birthdays')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            tab === 'birthdays'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cake className="w-4 h-4" />
          <span>Urodziny Dzieci ({location?.toUpperCase()})</span>
        </button>
      </div>

      {tab === 'corporate' ? (
        <CorporateInquiriesTable />
      ) : (
        <KidsBirthdaysTable />
      )}
    </div>
  );
};
