// src/constants.ts
// global app settings and geofencing stuff

// where the hostel is located
// grab these from google maps by right clicking your location
export const HOSTEL_COORDS = {
    latitude: 28.986701,  // hostel lat
    longitude: 77.152050, // hostel long
    name: 'Main Hostel Building',
};

// how big the geofence circle should be (in meters)
// 50m is a good size, dont go too small or gps might glitch indoors
export const GEOFENCE_RADIUS_METERS = 50;

// when students can mark their attendance
export const ATTENDANCE_WINDOW = {
    enabled: true,       // if false, they can mark anytime
    startHour: 19,       // 8 pm
    endHour: 20,         // 10 pm
    timezone: 'Asia/Kolkata',
};

// general app config settings
export const APP_CONFIG = {
    maxGatePassDays: 14,         // max length for a pass
    maxPendingPasses: 3,         // can't have too many pending requests
    attendanceGracePeriod: 5,    // extra minutes allowed after deadline
};
