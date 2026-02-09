// src/utils/geometry.ts
// Geofencing utilities using the Haversine formula

/**
 * Calculates the distance between two geographic coordinates in meters.
 * Uses the Haversine formula - works on a spherical Earth model.
 * 
 * @param lat1 - Latitude of point 1 (degrees)
 * @param lon1 - Longitude of point 1 (degrees)
 * @param lat2 - Latitude of point 2 (degrees)
 * @param lon2 - Longitude of point 2 (degrees)
 * @returns Distance in meters
 */
export const getDistanceInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371e3; // Earth's radius in meters
    const toRad = (val: number) => (val * Math.PI) / 180;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
};

/**
 * Checks if a point is within a circular geofence.
 * 
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @param centerLat - Center of geofence (e.g., hostel)
 * @param centerLon - Center longitude
 * @param radiusMeters - Radius of geofence in meters
 * @returns Object with isInside boolean and distance in meters
 */
export const isInsideGeofence = (
    userLat: number,
    userLon: number,
    centerLat: number,
    centerLon: number,
    radiusMeters: number
): { isInside: boolean; distance: number } => {
    const distance = getDistanceInMeters(userLat, userLon, centerLat, centerLon);
    return {
        isInside: distance <= radiusMeters,
        distance: Math.round(distance),
    };
};

/**
 * Validates GPS coordinates are within valid ranges.
 */
export const isValidCoordinates = (lat: number, lon: number): boolean => {
    return (
        typeof lat === 'number' &&
        typeof lon === 'number' &&
        !isNaN(lat) &&
        !isNaN(lon) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180
    );
};
