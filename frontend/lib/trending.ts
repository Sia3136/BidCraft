export const TRENDING_IDS = [
  "593", "594", "595", "596",
  "597", "603", "604", "605",
  "606", "607", "608", "609"
];

import type { Listing } from './api';

export function filterTrendingListings(listings: Listing[]): Listing[] {
  return listings.filter(l => TRENDING_IDS.includes(String(l.numericId)) || TRENDING_IDS.includes(l.id));
}
