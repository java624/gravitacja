import type { LocationSlug, Resource, ResourceType, CreateReservationInput, Reservation } from '../../types/booking';
import { fetchAvailableResources, checkTimeCollision, createReservation } from '../../lib/supabase';

export interface ResourceAvailabilityItem {
  resource: Resource;
  isAvailable: boolean;
}

export class OverbookingConflictError extends Error {
  constructor(message = 'Ten termin lub tor/stół został właśnie zarezerwowany. Wybierz inny czas.') {
    super(message);
    this.name = 'OverbookingConflictError';
  }
}

/**
 * Fetch available resources for a specific location, date, time slot, and resource type.
 */
export async function getAvailableResourcesForSlot(
  location: LocationSlug,
  date: string,
  startTime: string,
  endTime: string,
  resourceType: ResourceType
): Promise<ResourceAvailabilityItem[]> {
  try {
    const allResources = await fetchAvailableResources(location, date, startTime, endTime);
    return allResources.filter((item) => item.resource.type === resourceType);
  } catch (error) {
    console.error('Error in getAvailableResourcesForSlot:', error);
    throw error;
  }
}

/**
 * Verify whether a specific resource slot is currently free.
 */
export async function verifySlotIsFree(
  resourceId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const hasCollision = await checkTimeCollision(resourceId, date, startTime, endTime);
  return !hasCollision;
}

/**
 * Atomic reservation creation with overbooking prevention.
 * Throws OverbookingConflictError if the slot is occupied at submission time.
 */
export async function verifyAndCreateReservation(input: CreateReservationInput): Promise<Reservation> {
  const isFree = await verifySlotIsFree(
    input.resource_id,
    input.reservation_date,
    input.start_time,
    input.end_time
  );

  if (!isFree) {
    throw new OverbookingConflictError(
      'Ten termin lub tor/stół został właśnie zarezerwowany przez innego klienta. Wybierz inny czas.'
    );
  }

  try {
    return await createReservation(input);
  } catch (error: any) {
    if (error.message?.includes('zarezerwowany') || error.message?.includes('collision')) {
      throw new OverbookingConflictError(
        'Ten termin lub tor/stół został właśnie zarezerwowany. Wybierz inny czas.'
      );
    }
    throw error;
  }
}
