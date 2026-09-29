import { Loader2 } from 'lucide-react';
import type { Resource, ResourceType, LocationSlug } from '../../types/booking';

interface Step2LaneSelectionProps {
  date: string;
  startTime: string;
  endTime: string;
  selectedLocation: LocationSlug;
  resourceType: ResourceType;
  isLoadingLanes: boolean;
  availableResources: { resource: Resource; isAvailable: boolean }[];
  selectedResourceId: string | null;
  setSelectedResourceId: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step2LaneSelection({
  date,
  startTime,
  endTime,
  selectedLocation,
  resourceType,
  isLoadingLanes,
  availableResources,
  selectedResourceId,
  setSelectedResourceId,
  onBack,
  onNext,
}: Step2LaneSelectionProps) {
  return (
    <div className="space-y-5">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs flex justify-between items-center">
        <div>
          <span className="text-slate-400">Wybrany termin: </span>
          <span className="font-bold text-white font-mono">{date}</span>
          <span className="text-slate-400 ml-2">od {startTime} do {endTime}</span>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-orange-400 hover:underline font-bold text-[11px]"
        >
          Zmień
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
          Dostępne {resourceType === 'bowling' ? 'Tory' : 'Stoły'} w <span className="uppercase text-orange-400">{selectedLocation}</span>:
        </label>

        {isLoadingLanes ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Sprawdzanie wolnych torów...</span>
          </div>
        ) : availableResources.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs bg-white/5 rounded-2xl border border-white/10">
            Brak skonfigurowanych torów w tej lokalizacji.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableResources.map(({ resource, isAvailable }) => {
              const isSelected = selectedResourceId === resource.id;
              return (
                <button
                  key={resource.id}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setSelectedResourceId(resource.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex justify-between items-center ${
                    !isAvailable
                      ? 'border-red-500/20 bg-red-950/20 text-slate-500 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'border-orange-500 bg-orange-500/20 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:bg-white/10 cursor-pointer'
                  }`}
                >
                  <div>
                    <div className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                      <span>{resource.name}</span>
                    </div>
                    <div className="text-[10px] mt-1 text-slate-400">
                      {isAvailable ? 'Wolny w tym czasie' : 'Zajęty (Rezerwacja)'}
                    </div>
                  </div>

                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isAvailable
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}>
                    {isAvailable ? 'Wolny' : 'Zajęty'}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          ← Wstecz
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!selectedResourceId}
          className="px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 transition-all shadow-[0_0_20px_rgba(249,115,22,0.5)] cursor-pointer disabled:opacity-50"
        >
          Przejdź do Danych →
        </button>
      </div>
    </div>
  );
}
