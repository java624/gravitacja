import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Power, Star, Utensils, AlertCircle, ImageOff, X } from 'lucide-react';
import {
  fetchMenuItems,
  toggleMenuItemAvailability,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItem,
} from '../../lib/supabase/menuService';
import { uploadImage, deleteImage } from '../../lib/supabase/menuImageService';
import MenuItemModal, { CATEGORY_OPTIONS, type MenuItemDraft } from './MenuItemModal';

interface AdminMenuManagerProps {
  locationSlug?: string;
}

export default function AdminMenuManager({ locationSlug = 'katowice' }: AdminMenuManagerProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Confirm modal - natywny confirm() wyglądał jak błąd w panelu operatora
  const [itemPendingDelete, setItemPendingDelete] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, [locationSlug]);

  const loadMenuItems = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMenuItems(locationSlug);
      setItems(data);
    } catch (err) {
      console.error('Error loading admin menu items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const newStatus = !item.is_available;
    // Optimistic UI update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_available: newStatus } : i))
    );

    try {
      await toggleMenuItemAvailability(item.id, newStatus);
    } catch (err) {
      console.error('Failed to toggle availability:', err);
      // Revert on error
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: item.is_available } : i))
      );
    }
  };

  // Usunięcie pozycji idzie dopiero po potwierdzeniu w modalu (nie confirm()).
  const handleDeleteItem = async () => {
    if (!itemPendingDelete) return;

    const target = itemPendingDelete;
    setIsDeleting(true);

    setItems((prev) => prev.filter((i) => i.id !== target.id));
    try {
      await deleteMenuItem(target.id);
      // Zdjęcie kasujemy dopiero po usunięciu rekordu - gdyby zapis się nie udał,
      // nie zostalibyśmy ze pozycją bez zdjęcia.
      await deleteImage(target.image_url);
      setItemPendingDelete(null);
    } catch (err) {
      console.error('Failed to delete item:', err);
      loadMenuItems();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveModalItem = async (draft: MenuItemDraft) => {
    const { imageFile, ...itemData } = draft;

    // 1) Najpierw zdjęcie - jeśli wgranie padnie, nie zapisujemy pozycji.
    let imageUrl = itemData.image_url;
    let uploadedPath: string | null = null;

    if (imageFile) {
      const upload = await uploadImage(imageFile, locationSlug, editingItem?.id);
      imageUrl = upload.url;
      uploadedPath = upload.path;
    }

    // 2) Zapis do bazy (imageFile nie jest kolumną, więc nie leci do Supabase).
    const payload = { ...itemData, image_url: imageUrl ?? null };

    if (editingItem) {
      const updated = await updateMenuItem(editingItem.id, payload);
      setItems((prev) => prev.map((i) => (i.id === editingItem.id ? updated : i)));

      // 3) Stare zdjęcie sprzątamy dopiero po udanym zapisie.
      const oldUrl = editingItem.image_url;
      const replaced = !!uploadedPath && !!oldUrl && oldUrl !== imageUrl;
      if (replaced || imageUrl === null) {
        await deleteImage(oldUrl);
      }
    } else {
      const created = await createMenuItem(payload);
      setItems((prev) => [created, ...prev]);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Action & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/80 border border-white/15 rounded-3xl p-6 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-orange-400 mb-1">
            <Utensils className="w-4 h-4 text-orange-400" />
            <span>Zarządzanie Menu Gastro & Bar • Katowice</span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Karta Dań, Napojów i Alkoholi ({items.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Włączaj/wyłączaj potrawy w 1-klik (Stop-list) oraz edytuj ceny i pozycje.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_20px_rgba(249,115,22,0.5)] hover:from-orange-400 hover:to-red-500 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Dodaj Pozycję Do Menu</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Szukaj w panelu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/80 border border-white/10 text-xs text-white placeholder-slate-500 outline-none backdrop-blur-xl focus:border-orange-500/50"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Wszystkie ({items.length})
          </button>
          {CATEGORY_OPTIONS.map((cat) => {
            const count = items.filter((i) => i.category === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label.split(' ')[0]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Table / List */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs uppercase font-bold">Ładowanie menu...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center text-slate-400 rounded-3xl bg-slate-950/60 border border-white/10 p-8">
          <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-white">Brak pozycji spełniających kryteria</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/15 bg-slate-950/80 backdrop-blur-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                <tr>
                  <th className="px-5 py-3.5">Status (Stop-list)</th>
                  <th className="px-5 py-3.5">Zdjęcie</th>
                  <th className="px-5 py-3.5">Nazwa & Składniki</th>
                  <th className="px-5 py-3.5">Kategoria</th>
                  <th className="px-5 py-3.5">Porcja</th>
                  <th className="px-5 py-3.5">Cena (zł)</th>
                  <th className="px-5 py-3.5 text-right">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300 font-medium">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-white/5 transition-colors ${
                      !item.is_available ? 'bg-red-950/10' : ''
                    }`}
                  >
                    {/* 1-Click Stop List Toggle */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleAvailability(item)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                          item.is_available
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{item.is_available ? 'Dostępny' : 'Niedostępny'}</span>
                      </button>
                    </td>

                    {/* Photo */}
                    <td className="px-5 py-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          loading="lazy"
                          className="w-12 h-12 rounded-lg object-cover border border-white/10 bg-slate-800"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-lg border border-dashed border-white/15 bg-white/5 flex items-center justify-center"
                          title="Brak zdjęcia - klient pokaże ilustrację kategorii"
                        >
                          <ImageOff className="w-4 h-4 text-slate-600" />
                        </div>
                      )}
                    </td>

                    {/* Title & Ingredients */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-white text-sm uppercase">{item.title}</span>
                        {item.is_bestseller && (
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        )}
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                          {item.description}
                        </p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-slate-300">
                        {item.category}
                      </span>
                    </td>

                    {/* Volume */}
                    <td className="px-5 py-4 font-semibold text-slate-400">
                      {item.volume || '—'}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4 font-black text-sm text-white">
                      {item.price} zł
                      {item.price_maxi && (
                        <span className="text-xs text-orange-400 font-bold ml-1">
                          / {item.price_maxi} zł
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          title="Edytuj pozycję"
                          className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/20 text-slate-400 hover:text-orange-400 border border-white/10 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setItemPendingDelete(item)}
                          title="Usuń pozycję"
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSaveModalItem}
        editingItem={editingItem}
        locationSlug={locationSlug}
      />

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {itemPendingDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setItemPendingDelete(null)}
              className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-md bg-slate-900 border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
            >
              <div className="p-6 text-left">
                <div className="flex items-start gap-4">
                  {itemPendingDelete.image_url ? (
                    <img
                      src={itemPendingDelete.image_url}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl border border-dashed border-white/15 bg-white/5 flex items-center justify-center shrink-0">
                      <ImageOff className="w-5 h-5 text-slate-600" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-black uppercase tracking-wider text-red-300">
                        Usunąć pozycję?
                      </h3>
                      <button
                        type="button"
                        onClick={() => setItemPendingDelete(null)}
                        disabled={isDeleting}
                        className="text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                        title="Zamknij"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-white mt-1 truncate">
                      {itemPendingDelete.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                      Pozycja zniknie z menu klienta, a zdjęcie
                      {itemPendingDelete.image_url
                        ? ' zostanie skasowane w Supabase Storage.'
                        : ' nie ma - nic nie zostanie usunięte z magazynu.'}{' '}
                      Tej operacji nie można cofnąć.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setItemPendingDelete(null)}
                    disabled={isDeleting}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold uppercase text-xs cursor-pointer disabled:opacity-50"
                  >
                    Anuluj
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteItem}
                    disabled={isDeleting}
                    className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black uppercase text-xs tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Usuwanie...' : 'Usuń'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
