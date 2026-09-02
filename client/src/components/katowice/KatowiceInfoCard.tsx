import { MapPin, Clock } from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locationsData';

export default function KatowiceInfoCard() {
  const katowice = LOCATIONS_DATA.find((l) => l.id === 'katowice') || LOCATIONS_DATA[1];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-4 shadow-xl">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Lokalizacja</h4>
          <p className="text-sm font-bold text-white">{katowice.address} ({katowice.mall})</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-400" /> Godziny otwarcia
        </h4>

        <div className="space-y-2 text-xs font-medium">
          {katowice.hours.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between py-1.5 px-3 rounded-xl ${
                item.color === 'orange'
                  ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                  : item.color === 'purple'
                  ? 'bg-purple-500/10 border border-purple-500/20 text-purple-300'
                  : 'bg-white/5 text-slate-300'
              }`}
            >
              <span>{item.day}:</span>
              <span className="font-bold">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}