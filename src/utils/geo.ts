/**
 * Geographic distance calculations and coordinate mapping for Job Map View
 */

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export const KNOWN_CITY_COORDINATES: Record<string, GeoCoordinate> = {
  'San Francisco, CA': { latitude: 37.7749, longitude: -122.4194 },
  'San Jose, CA': { latitude: 37.3382, longitude: -121.8863 },
  'Oakland, CA': { latitude: 37.8044, longitude: -122.2712 },
  'Palo Alto, CA': { latitude: 37.4419, longitude: -122.1430 },
  'Mountain View, CA': { latitude: 37.3861, longitude: -122.0839 },
  'New York, NY': { latitude: 40.7128, longitude: -74.0060 },
  'Austin, TX': { latitude: 30.2672, longitude: -97.7431 },
  'Seattle, WA': { latitude: 47.6062, longitude: -122.3321 },
  'Boston, MA': { latitude: 42.3601, longitude: -71.0589 },
  'Chicago, IL': { latitude: 41.8781, longitude: -87.6298 },
  'Los Angeles, CA': { latitude: 34.0522, longitude: -118.2437 },
  'Denver, CO': { latitude: 39.7392, longitude: -104.9903 },
  'Toronto, Canada': { latitude: 43.6532, longitude: -79.3832 },
  'London, UK': { latitude: 51.5074, longitude: -0.1278 },
  'Berlin, Germany': { latitude: 52.5200, longitude: 13.4050 },
  'Remote': { latitude: 37.7749, longitude: -122.4194 } // Default anchor
};

export const USER_PRESET_LOCATIONS: { name: string; city: string; coords: GeoCoordinate }[] = [
  { name: 'San Francisco, CA (Downtown / SOMA)', city: 'San Francisco, CA', coords: { latitude: 37.7749, longitude: -122.4194 } },
  { name: 'San Jose, CA (Silicon Valley)', city: 'San Jose, CA', coords: { latitude: 37.3382, longitude: -121.8863 } },
  { name: 'Oakland, CA (East Bay)', city: 'Oakland, CA', coords: { latitude: 37.8044, longitude: -122.2712 } },
  { name: 'New York, NY (Manhattan)', city: 'New York, NY', coords: { latitude: 40.7128, longitude: -74.0060 } },
  { name: 'Austin, TX (Downtown Tech Corridor)', city: 'Austin, TX', coords: { latitude: 30.2672, longitude: -97.7431 } },
  { name: 'Seattle, WA (South Lake Union)', city: 'Seattle, WA', coords: { latitude: 47.6062, longitude: -122.3321 } },
  { name: 'Boston, MA (Seaport District)', city: 'Boston, MA', coords: { latitude: 42.3601, longitude: -71.0589 } },
  { name: 'London, UK (Tech City)', city: 'London, UK', coords: { latitude: 51.5074, longitude: -0.1278 } },
  { name: 'Toronto, Canada (Downtown Financial)', city: 'Toronto, Canada', coords: { latitude: 43.6532, longitude: -79.3832 } },
];

/**
 * Calculates Great-Circle distance between two coordinates in miles using Haversine formula
 */
export function calculateDistanceMiles(
  coord1: GeoCoordinate,
  coord2: GeoCoordinate
): number {
  const R = 3958.8; // Radius of Earth in miles
  const lat1Rad = (coord1.latitude * Math.PI) / 180;
  const lat2Rad = (coord2.latitude * Math.PI) / 180;
  const deltaLat = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const deltaLon = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Returns estimated commute time and mode based on distance in miles
 */
export function getCommuteEstimate(distanceMiles: number, workplaceType: string): string {
  if (workplaceType === 'Remote') {
    return '0 min • 100% Remote / No Commute';
  }
  if (distanceMiles <= 3) {
    return `~${Math.max(5, Math.round(distanceMiles * 3.5))} min drive / ~15 min bike`;
  }
  if (distanceMiles <= 15) {
    return `~${Math.round(distanceMiles * 2.2)} min drive / ~${Math.round(distanceMiles * 3)} min transit`;
  }
  if (distanceMiles <= 40) {
    return `~${Math.round(distanceMiles * 1.6)} min drive / ~${Math.round(distanceMiles * 2.2)} min train`;
  }
  if (distanceMiles <= 100) {
    return `~${Math.round((distanceMiles / 55) * 60)} min drive`;
  }
  return `${Math.round(distanceMiles).toLocaleString()} mi • Long distance (Relocation or Hybrid travel)`;
}

export type ProximityClassification = 'very_close' | 'nearby' | 'far' | 'remote';

export function classifyProximity(distanceMiles: number, workplaceType: string): ProximityClassification {
  if (workplaceType === 'Remote') {
    return 'remote';
  }
  if (distanceMiles <= 15) {
    return 'very_close';
  }
  if (distanceMiles <= 50) {
    return 'nearby';
  }
  return 'far';
}
