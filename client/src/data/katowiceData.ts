import { LOCATIONS_DATA } from './locationsData';
import { PROMOTIONS_DATA } from './promotionsData';
import type { Promotion } from '../types';

export type { Promotion };

const katowiceLocation = LOCATIONS_DATA.find((l) => l.id === 'katowice')!;

export const KATOWICE_INFO = {
  name: katowiceLocation.name,
  mall: katowiceLocation.mall,
  address: katowiceLocation.address,
  phone: katowiceLocation.phone,
  phoneClean: katowiceLocation.phoneClean,
  lanes: katowiceLocation.lanes,
  zones: katowiceLocation.zones,
  description: katowiceLocation.desc,
  hours: katowiceLocation.hours.map((h) => ({
    day: h.day,
    time: h.time,
    highlight: h.highlight ?? false,
    color: h.color,
  })),
};

export const PROMOTIONS: Promotion[] = PROMOTIONS_DATA.filter(
  (p) => !p.locationId || p.locationId === 'katowice'
);