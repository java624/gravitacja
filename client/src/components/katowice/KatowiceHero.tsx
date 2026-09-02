import { Sparkles, ArrowUpRight, Phone } from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locationsData';
import KatowiceInfoCard from './KatowiceInfoCard';

export default function KatowiceHero() {
  const katowice = LOCATIONS_DATA.find((l) => l.id === 'katowice') || LOCATIONS_DATA[1];

  return (
    <section className="relative rounded-[24px] sm:rounded-[32px] p-5 sm:p-10 md:p-12 border border-white/10 bg-slate-950/90 md:bg-gradient-to-b md:from-slate-900/90 md:via-slate-950/80 md:to-black/90 backdrop-blur-md md:backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        
        {/* Ліва колонка: Заголовок та кнопки */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] sm:text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Centrum Katowice • {katowice.mall}
          </div>

          <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight leading-none">
            Grawitacja <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
              Katowice
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl font-medium">
            {katowice.desc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tory Kręglarskie</span>
              <span className="text-base sm:text-lg font-black text-white">{katowice.lanes}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Strefa Rozrywki</span>
              <span className="text-base sm:text-lg font-black text-white">{katowice.zones}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md col-span-2 sm:col-span-1">
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Telefon</span>
              <span className="text-xs sm:text-sm font-black text-orange-400">{katowice.phone}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-3 sm:pt-4">
            <button className="w-full sm:w-auto justify-center px-8 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_0_25px_rgba(249,115,22,0.5)] flex items-center gap-2 cursor-pointer active:scale-98">
              <span>Zarezerwuj Tor</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a 
              href={`tel:${katowice.phoneClean}`}
              className="w-full sm:w-auto justify-center px-6 py-3.5 sm:py-4 rounded-2xl text-xs font-black tracking-widest uppercase text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 active:scale-98"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              <span>Zadzwoń</span>
            </a>
          </div>
        </div>

        {/* Права колонка: Віджет годин та адреси */}
        <div className="lg:col-span-5 text-left">
          <KatowiceInfoCard />
        </div>

      </div>
    </section>
  );
}