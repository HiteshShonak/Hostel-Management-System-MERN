// lib/services/attendance.service.ts — Attendance service
import api from '../api';
import { Attendance, AttendanceStats } from '../types';

export interface LocationData {
    latitude: number;
    longitude: number;
}

export interface TodayAttendanceResponse {
    marked: boolean;
    attendance: Attendance | null;
    geofence?: {
        hostelName: string;
        radiusMeters: number;
        attendanceWindow: { start: number; end: number } | null;
    };
}

export const attendanceService = {
    getAll: async (): Promise<Attendance[]> => {
        const response = await api.get<{ attendance: Attendance[]; pagination: any }>('/attendance');
        return response.data?.attendance || [];
    },

    mark: async (location: LocationData): Promise<Attendance> => {
        const response = await api.post<Attendance>('/attendance/mark', location);
        return response.data;
    },

    getStats: async (): Promise<AttendanceStats> => {
        const response = await api.get<AttendanceStats>('/attendance/stats');
        return response.data;
    },

    checkToday: async (): Promise<TodayAttendanceResponse> => {
        const response = await api.get('/attendance/today');
        return response.data;
    },
};
