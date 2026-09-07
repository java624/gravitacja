import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Star, Pizza, Utensils, GlassWater, Beer, Wine, AlertCircle } from 'lucide-react';
import { fetchMenuItems, type MenuItem } from '../../lib/supabase/menuService';

interface MenuSectionProps {
  locationSlug?: string;
}

export const CATEGORIES = [
  { id: 'all', name: 'Wszystkie', icon: Sparkles },
  { id: 'pizza', name: 'Pizza', icon: Pizza },
  { id: 'przekaski', name: 'Snacki & Przekąski', icon: Utensils },
  { id: 'napoje', name: 'Napoje', icon: GlassWater },
  { id: 'piwo', name: 'Piwo', icon: Beer },
  { id: 'alkohole', name: 'Alkohole & Drinki', icon: Wine },
];

export default function MenuSection({ locationSlug = 'katowice' }: MenuSectionProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadMenu();
  }, [locationSlug]);

  const loadMenu = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMenuItems(locationSlug);
      setItems(data);
    } catch (err) {
      console.error('Error loading menu:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    // Search query filter
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    let matchesCategory = true;
    if (activeCategory === 'pizza') {
      matchesCategory = item.category === 'pizza';
    } else if (activeCategory === 'przekaski') {
      matchesCategory = item.category === 'snacki' || item.category === 'przekaski';
    } else if (activeCategory === 'napoje') {
      matchesCategory = item.category === 'napoje_zimne' || item.category === 'napoje_gorace';
    } else if (activeCategory === 'piwo') {
      matchesCategory = item.category === 'piwo';
    } else if (activeCategory === 'alkohole') {
      matchesCategory =
        item.category === 'alkohole' ||
        item.category === 'cocktails' ||
        item.category === 'shots' ||
        item.category === 'zestawy';
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="menu" className="space-y-8 text-left relative scroll-mt-28">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] sm:text-xs font-black tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <Utensils className="w-3.5 h-3.5 text-orange-400" />
            <span>Gastro & Bar Menu • Grawitacja</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Nasza <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-red-400">Oferta Menu</span>
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Szukaj dania, pizzy lub drinka..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-white/10 focus:border-orange-500/50 text-xs font-medium text-white placeholder-slate-500 outline-none backdrop-blur-xl transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 via-red-600 to-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] border border-orange-400/40'
                  : 'bg-slate-950/80 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 backdrop-blur-xl'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Menu Items Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-bold tracking-wider">Ładowanie pozycji menu...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-12 text-center text-slate-400 rounded-3xl bg-white/5 border border-white/10 p-8 space-y-3">
          <AlertCircle className="w-8 h-8 text-orange-400 mx-auto" />
          <h4 className="text-sm font-bold uppercase text-white">Menu Gastro dla tego lokalu</h4>
          <p className="text-xs max-w-md mx-auto">
            Pełne menu dań, przekąsek i koktajli serwowane jest bezpośrednio przy barze w obiekcie.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-3xl p-5 bg-slate-950/80 via-slate-900/70 to-slate-950/90 border backdrop-blur-xl flex flex-col justify-between transition-all duration-300 overflow-hidden shadow-lg ${
                  item.is_available
                    ? 'border-white/10 hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]'
                    : 'border-slate-800 opacity-60 grayscale'
                }`}
              >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />

                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                      {item.category.replace('_', ' ')}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.is_bestseller && (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          <span>Hit</span>
                        </span>
                      )}

                      {!item.is_available && (
                        <span className="text-[9px] font-black uppercase text-red-400 bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded-full">
                          Chwilowo Niedostępny
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Volume */}
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="text-base font-black uppercase text-white tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    {item.volume && (
                      <span className="text-[10px] font-bold uppercase text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg shrink-0">
                        {item.volume}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Price Display */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Cena {item.price_maxi ? '(Standard / Maxi)' : ''}:
                  </span>

                  <div className="text-right">
                    {item.price_maxi ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                          {item.price} zł
                        </span>
                        <span className="text-slate-500 font-bold">/</span>
                        <span className="text-lg font-black bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
                          {item.price_maxi} zł
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-black bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                        {item.price} zł
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
