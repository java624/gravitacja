import { supabase } from './client';
import { INITIAL_MENU_KATOWICE } from '../../data/initialMenuKatowice';

export interface MenuItem {
  id: string;
  location_slug: string;
  category: string;
  title: string;
  description?: string | null;
  price: number;
  price_maxi?: number | null;
  volume?: string | null;
  is_available: boolean;
  is_bestseller: boolean;
  created_at?: string;
}

const LOCAL_STORAGE_KEY = 'gravitacja_menu_items_v1';

function getLocalMenuItems(): MenuItem[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local menu items:', err);
  }
  // Initialize with initial data
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MENU_KATOWICE));
  return INITIAL_MENU_KATOWICE as MenuItem[];
}

function saveLocalMenuItems(items: MenuItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving local menu items:', err);
  }
}

/**
 * Fetch all menu items for a specific location (default 'katowice')
 */
export async function fetchMenuItems(locationSlug: string = 'katowice'): Promise<MenuItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('location_slug', locationSlug)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as MenuItem[];
      }
    } catch (err) {
      console.warn('Supabase fetchMenuItems warning, using local fallback:', err);
    }
  }

  // Local storage fallback
  const localItems = getLocalMenuItems();
  return localItems.filter((i) => i.location_slug === locationSlug);
}

/**
 * Toggle menu item availability (Stop-list toggle)
 */
export async function toggleMenuItemAvailability(id: string, isAvailable: boolean): Promise<MenuItem> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ is_available: isAvailable })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as MenuItem;
      }
    } catch (err) {
      console.warn('Supabase toggleMenuItemAvailability failed, applying local fallback:', err);
    }
  }

  const localItems = getLocalMenuItems();
  const index = localItems.findIndex((i) => i.id === id);
  if (index !== -1) {
    localItems[index].is_available = isAvailable;
    saveLocalMenuItems(localItems);
    return localItems[index];
  }
  throw new Error('Menu item not found');
}

/**
 * Create a new menu item
 */
export async function createMenuItem(item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();

      if (!error && data) {
        return data as MenuItem;
      }
    } catch (err) {
      console.warn('Supabase createMenuItem failed, applying local fallback:', err);
    }
  }

  const newItem: MenuItem = {
    ...item,
    id: `custom-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  const localItems = getLocalMenuItems();
  localItems.push(newItem);
  saveLocalMenuItems(localItems);
  return newItem;
}

/**
 * Update an existing menu item
 */
export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as MenuItem;
      }
    } catch (err) {
      console.warn('Supabase updateMenuItem failed, applying local fallback:', err);
    }
  }

  const localItems = getLocalMenuItems();
  const index = localItems.findIndex((i) => i.id === id);
  if (index !== -1) {
    localItems[index] = { ...localItems[index], ...updates };
    saveLocalMenuItems(localItems);
    return localItems[index];
  }
  throw new Error('Menu item not found');
}

/**
 * Delete a menu item
 */
export async function deleteMenuItem(id: string): Promise<void> {
  if (supabase) {
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (!error) return;
    } catch (err) {
      console.warn('Supabase deleteMenuItem failed, applying local fallback:', err);
    }
  }

  const localItems = getLocalMenuItems();
  const filtered = localItems.filter((i) => i.id !== id);
  saveLocalMenuItems(filtered);
}
