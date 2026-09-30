import type { LocationSlug, Resource } from '../../../types/booking';

/**
 * What the timeline grid hands over to the quick reception booking modal when the
 * operator clicks / click-&-drags one or more consecutive hour cells of a row.
 *
 * Everything the reception does NOT have to type is derived here: location comes
 * from the resource itself (never from a form field), the entertainment type is
 * derived from resource.type and the date + time range come from the grid.
 */
export interface TimelineQuickSelection {
  resource: Resource;
  locationSlug: LocationSlug;
  /** YYYY-MM-DD, taken from the timeline date navigator. */
  date: string;
  /** First selected hour (inclusive), e.g. 17 => 17:00. */
  startHour: number;
  /** Last selected hour + 1 (exclusive end), e.g. 19 => 19:00. */
  endHour: number;
}

/** 17 => "17:00", 24 => "24:00" (the grid ends at midnight). */
export const formatHourLabel = (hour: number): string =>
  `${String(hour).padStart(2, '0')}:00`;
