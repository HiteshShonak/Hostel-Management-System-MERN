// src/constants.ts
// Application-wide constants including geofencing configuration

/**
 * Hostel/Campus coordinates for geofencing.
 * To get your coordinates: Go to Google Maps, right-click on your location, 
 * and copy the coordinates.
 */
export const HOSTEL_COORDS = {
    latitude: 28.986701,  // Your hostel location
    longitude: 77.152050, // Your hostel location
    name: 'Main Hostel Building',
};

/**
 * Geofence radius in meters.
 * 50m is recommended for campus buildings.
 * Don't make this too small (<20m) as GPS can drift indoors.
 */
export const GEOFENCE_RADIUS_METERS = 50;

/**
 * Attendance time window configuration.
 * Students can only mark attendance during these hours.
 */
export const ATTENDANCE_WINDOW = {
    enabled: true,       // Set to false to allow marking anytime
    startHour: 19,       // 8 PM (24-hour format)
    endHour: 20,         // 10 PM
    timezone: 'Asia/Kolkata',
};

/**
 * Application configuration
 */
export const APP_CONFIG = {
    maxGatePassDays: 14,         // Maximum days for a gate pass
    maxPendingPasses: 3,         // Max pending passes per student
    attendanceGracePeriod: 5,    // Minutes after window closes
};
