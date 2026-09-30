import type { Resource } from '../../../types/booking';

/**
 * Shared naming helpers for the admin timeline so that the grid and the quick
 * booking modal always display a resource the exact same way ("Tor 3" / "Stół 2").
 */
export const extractNumber = (str: string): number => {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

// Formats display names strictly as "Tor X" or "Stół X"
export const formatResourceDisplayName = (resource: Resource): string => {
  const num = extractNumber(resource.name) || extractNumber(resource.id);
  if (resource.type === 'billiards') {
    return num ? `Stół ${num}` : 'Stół 1';
  }
  if (resource.type === 'bowling') {
    return num ? `Tor ${num}` : resource.name || 'Tor 1';
  }
  return resource.name;
};

/** Human readable category label used by the admin UI ("Kręgle" / "Bilard"). */
export const formatResourceTypeLabel = (resource: Resource): string => {
  if (resource.type === 'bowling') return 'Kręgle';
  if (resource.type === 'billiards') return 'Bilard';
  return resource.type;
};
