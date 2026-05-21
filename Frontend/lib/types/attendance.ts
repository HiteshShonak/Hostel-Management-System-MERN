// lib/types/attendance.ts — Attendance types
export interface Attendance {
    _id: string;
    user: string;
    date: string;
    markedAt: string;
    location?: {
        distanceFromHostel?: number;
    };
}

export interface AttendanceStats {
    present: number;
    absent: number;
    total: number;
    percentage: number;
    month: string;
}
