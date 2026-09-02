import { Sparkles, ArrowUpRight, Phone, MapPin, Clock } from 'lucide-react';
import { LOCATIONS_DATA } from '../data/locationsData';
import { PROMOTIONS_DATA } from '../data/promotionsData';
import PromotionCard from '../components/katowice/PromotionCard';
import LaneDivider from '../components/ui/LaneDivider';

export default function JaworznoPage() {
  const jaworzno = LOCATIONS_DATA.find((l) => l.id === 'jaworzno') || LOCATIONS_DATA[0];
  const promotions = PROMOTIONS_DATA.filter((p) => !p.locationId || p.locationId === 'jaworzno');

  return (
    <div className="space-y-12 py-4 text-left">
      {/* Hero Section */}
      <section className="relative rounded-[32px] p-6 sm:p-10 md:p-12 border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-black/90 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Centrum Jaworzno • {jaworzno.mall}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none">
              Grawitacja <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-red-500 to-amber-500">
                Jaworzno
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              {jaworzno.desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tory Kręglarskie</span>
                <span className="text-lg font-black text-white">{jaworzno.uvLanes || jaworzno.lanes}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Strefa Rozrywki</span>
                <span className="text-lg font-black text-white">{jaworzno.zones}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md col-span-2 sm:col-span-1">
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Telefon</span>
                <span className="text-sm font-black text-rose-400">{jaworzno.phone}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-rose-500 via-red-600 to-rose-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_30px_rgba(244,63,94,0.5)] flex items-center gap-2 cursor-pointer">
                <span>Zarezerwuj Tor</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${jaworzno.phoneClean}`}
                className="px-6 py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-rose-400" />
                <span>Zadzwoń</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Lokalizacja</h4>
                  <p className="text-sm font-bold text-white">{jaworzno.address} ({jaworzno.mall})</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-400" /> Godziny otwarcia
                </h4>
                <div className="space-y-2 text-xs font-medium">
                  {jaworzno.hours.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between py-1.5 px-3 rounded-xl ${
                        item.color === 'orange'
                          ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
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
          </div>
        </div>
      </section>

      <LaneDivider label="8 UV-TORÓW • GLOW BOWLING JAWORZNO" badge="JAWORZNO" />

      {/* Promocje */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black tracking-[0.2em] text-rose-400 uppercase">Oferty Specjalne</span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">Promocje Jaworzno</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((item) => (
            <PromotionCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
