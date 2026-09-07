import type { Resource } from '../../types/booking';
import { supabase } from './client';
import { INITIAL_MOCK_RESOURCES } from './mockStore';
import { checkTimeCollision } from './reservationsService';

export async function fetchResources(location_slug?: string): Promise<Resource[]> {
  if (supabase) {
    try {
      let query = supabase.from('resources').select('*').eq('is_active', true);
      if (location_slug) {
        query = query.eq('location_slug', location_slug);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) return data as Resource[];
    } catch (err) {
      console.warn('Supabase fetchResources failed, using mock data:', err);
    }
  }

  if (location_slug) {
    return INITIAL_MOCK_RESOURCES.filter(r => r.location_slug === location_slug && r.is_active);
  }
  return INITIAL_MOCK_RESOURCES.filter(r => r.is_active);
}

export async function fetchAvailableResources(
  location_slug: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<{ resource: Resource; isAvailable: boolean }[]> {
  const allResources = await fetchResources(location_slug);

  const results = await Promise.all(
    allResources.map(async (resource) => {
      const hasCollision = await checkTimeCollision(resource.id, date, startTime, endTime);
      return {
        resource,
        isAvailable: !hasCollision,
      };
    })
  );

  return results;
}
