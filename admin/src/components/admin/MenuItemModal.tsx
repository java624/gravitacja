import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Save, Plus } from 'lucide-react';
import type { MenuItem } from '../../lib/supabase/menuService';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemData: Omit<MenuItem, 'id' | 'created_at'>) => Promise<void>;
  editingItem?: MenuItem | null;
  locationSlug?: string;
}

export const CATEGORY_OPTIONS = [
  { value: 'pizza', label: 'Pizza' },
  { value: 'snacki', label: 'Snacki (Chipsy, Paluszki itp.)' },
  { value: 'przekaski', label: 'Przekąski (Zapiekanki, Frytki, Nuggetsy)' },
  { value: 'napoje_zimne', label: 'Napoje Zimne' },
  { value: 'napoje_gorace', label: 'Napoje Gorące (Kawa, Herbata)' },
  { value: 'piwo', label: 'Piwo (Lane, Wieże, Butelki)' },
  { value: 'alkohole', label: 'Alkohole (Wódki, Whisky)' },
  { value: 'cocktails', label: 'Cocktails & Drinki' },
  { value: 'shots', label: 'Shots (Kieliszki)' },
  { value: 'zestawy', label: 'Zestawy Alkoholowe' },
];

export default function MenuItemModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
  locationSlug = 'katowice',
}: MenuItemModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('pizza');
  const [price, setPrice] = useState<string>('');
  const [priceMaxi, setPriceMaxi] = useState<string>('');
  const [volume, setVolume] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCategory(editingItem.category);
      setPrice(editingItem.price.toString());
      setPriceMaxi(editingItem.price_maxi ? editingItem.price_maxi.toString() : '');
      setVolume(editingItem.volume || '');
      setDescription(editingItem.description || '');
      setIsAvailable(editingItem.is_available);
      setIsBestseller(editingItem.is_bestseller);
    } else {
      resetForm();
    }
  }, [editingItem, isOpen]);

  const resetForm = () => {
    setTitle('');
    setCategory('pizza');
    setPrice('');
    setPriceMaxi('');
    setVolume('');
    setDescription('');
    setIsAvailable(true);
    setIsBestseller(false);
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Podaj nazwę pozycji');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMsg('Podaj prawidłową cenę podstawową');
      return;
    }

    const parsedPriceMaxi = priceMaxi.trim() ? parseFloat(priceMaxi) : undefined;

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        location_slug: locationSlug,
        category,
        title: title.trim(),
        description: description.trim() || undefined,
        price: parsedPrice,
        price_maxi: parsedPriceMaxi,
        volume: volume.trim() || undefined,
        is_available: isAvailable,
        is_bestseller: isBestseller,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Wystąpił błąd podczas zapisywania');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto cursor-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-slate-950/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(249,115,22,0.15)] z-10 text-white overflow-hidden my-auto text-left"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-orange-400 mb-1">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Gastro & Bar • Katowice</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {editingItem ? 'Edytuj Pozycję Menu' : 'Dodaj Nową Pozycję Menu'}
            </h2>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            {/* Title */}
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1 tracking-wider">
                Nazwa pozycji *
              </label>
              <input
                type="text"
                required
                placeholder="np. Margherita / Mojito / Chipsy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/50 text-white outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1 tracking-wider">
                Kategoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 focus:border-orange-500/50 text-white outline-none cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1 tracking-wider">
                  Cena Standard (zł) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="np. 48"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/50 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 uppercase font-bold mb-1 tracking-wider">
                  Cena Maxi / Opjonalna (zł)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="np. 66 (Maxi pizza / 3L wieża)"
                  value={priceMaxi}
                  onChange={(e) => setPriceMaxi(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/50 text-white outline-none"
                />
              </div>
            </div>

            {/* Volume / Weight */}
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1 tracking-wider">
                Objętość / Porcja
              </label>
              <input
                type="text"
                placeholder="np. 32cm / 0.5l / 40ml / 160g"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/50 text-white outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-400 uppercase font-bold mb-1 tracking-wider">
                Opis / Składniki
              </label>
              <textarea
                rows={3}
                placeholder="Opisz składniki lub szczegóły potrawy/drinka..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/50 text-white outline-none resize-none"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-orange-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-white font-bold">Dostępne w menu</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-amber-400 font-bold">Hit / Bestseller ★</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold uppercase cursor-pointer"
              >
                Anuluj
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black uppercase tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.5)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {editingItem ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isSubmitting ? 'Zapisywanie...' : editingItem ? 'Zapisz Zmiany' : 'Dodaj Pozycję'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
