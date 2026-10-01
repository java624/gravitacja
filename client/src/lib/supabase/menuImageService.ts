import { supabase } from './client';

/**
 * Zdjęcia potraw w Supabase Storage.
 *
 * Osobny moduł od `menuService.ts`, bo ma inne reguły: waliduje plik PRZED
 * wysłaniem (żeby użytkownik dostał czytelny komunikat zamiast HTTP 400) i
 * musi umieć usunąć plik, którego URL siedzi w bazie.
 *
 * ZASADA: bucket `menu-images` jest publiczny, więc klient renderuje zdjęcie
 * zwykłym <img src={image_url}> bez tokenu i bez pobierania przez API.
 * Sam skrypt SQL (bucket + polityki RLS) jest w ./create_menu_items.sql.
 */

/** Bucket trzymający zdjęcia potraw. */
export const MENU_IMAGE_BUCKET = 'menu-images';

/** Limity spójne z politykami bucketa ustawionymi w create_menu_items.sql. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

export interface ImageUploadResult {
  /** Publiczny URL do zapisania w menu_items.image_url. */
  url: string;
  /** Ścieżka w buckecie - używana przy usuwaniu. */
  path: string;
}

/**
 * Sprawdza plik przed wysłaniem, żeby użytkownik zobaczył czytelny komunikat
 * zamiast surowego błędu z Supabase.
 */
export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return `Nieobsługiwany format pliku (${file.type || 'nieznany'}). Dozwolone: JPG, PNG, WEBP, GIF, AVIF.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `Plik jest za duży (${sizeMb} MB). Maksymalnie 5 MB.`;
  }
  return null;
}

/** Losuje bezpieczną nazwę pliku - bez polskich znaków i spacji w nazwie. */
function buildFileName(file: File): string {
  const rawName = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  return `${rawName || 'menu-item'}-${stamp}.${extension}`;
}

/**
 * Ścieżka w buckecie: potrawy/<lokalizacja>/<id lub new>/<nazwa>-<znacznik>.<ext>
 * Rozdzielenie per lokalizacja porządkuje pliki i ułatwia sprzątanie.
 */
function buildStoragePath(file: File, locationSlug: string, itemId?: string): string {
  const scope = itemId ? `${locationSlug}/${itemId}` : `${locationSlug}/new`;
  return `${scope}/${buildFileName(file)}`;
}

/**
 * Wysyła zdjęcie do Supabase Storage i zwraca publiczny URL.
 *
 * Kolejność w AdminMenuManager jest świadoma: upload idzie PRZED zapisem do
 * menu_items. Jeśli zdjęcie się nie wyśle, pozycja w ogóle nie powstaje -
 * nie zostawiamy rekordu bez zdjęcia po nieudanym uploadzie.
 */
export async function uploadImage(
  file: File,
  locationSlug: string = 'katowice',
  itemId?: string
): Promise<ImageUploadResult> {
  if (!supabase) {
    throw new Error(
      'Supabase nie jest skonfigurowany - zdjęć nie można wysłać. Uzupełnij VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY.'
    );
  }

  const validationError = validateImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const path = buildStoragePath(file, locationSlug, itemId);

  const { error } = await supabase.storage
    .from(MENU_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error('Supabase image upload failed:', error);
    throw new Error(`Nie udało się wysłać zdjęcia: ${error.message}`);
  }

  return { url: getPublicUrl(path), path };
}

/** Publiczny URL obiektu z bucketa (bucket publiczny => bez tokenu). */
export function getPublicUrl(path: string): string {
  if (!supabase) return '';
  const { data } = supabase.storage.from(MENU_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Wyciąga ścieżkę w buckecie z publicznego URL.
 *
 * Dzięki temu usuwanie działa tak samo, czy podajemy URL z bazy
 * (.../storage/v1/object/public/menu-images/katowice/abc.jpg),
 * czy już samą ścieżkę (katowice/abc.jpg).
 */
export function extractStoragePath(urlOrPath: string | null | undefined): string | null {
  if (!urlOrPath) return null;
  const value = urlOrPath.trim();
  if (!value) return null;

  // Zwykła ścieżka, nie URL - używamy jej wprost.
  if (!value.startsWith('http')) {
    return value.replace(/^\/+/, '');
  }

  const marker = `/storage/v1/object/public/${MENU_IMAGE_BUCKET}/`;
  const index = value.indexOf(marker);
  if (index === -1) {
    // Obraz spoza naszego bucketa (np. statyczna mapa MENU_IMAGES) - nie ruszamy go.
    return null;
  }

  const path = value.slice(index + marker.length);
  return path ? decodeURIComponent(path) : null;
}

/**
 * Usuwa zdjęcie z bucketa. Zdjęcia spoza `menu-images` są pomijane -
 * nie wolno kasować plików, na które nie mamy prawa.
 */
export async function deleteImage(urlOrPath: string | null | undefined): Promise<void> {
  if (!supabase) return;

  const path = extractStoragePath(urlOrPath);
  if (!path) return;

  const { error } = await supabase.storage.from(MENU_IMAGE_BUCKET).remove([path]);
  if (error) {
    // Fotografia nie jest krytyczna dla zapisu pozycji - logujemy, ale nie rzucamy.
    console.warn('Could not delete menu image from storage:', error.message);
  }
}