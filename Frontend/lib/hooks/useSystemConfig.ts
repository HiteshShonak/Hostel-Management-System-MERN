/**
 * Hook to fetch and cache system configuration
 * Provides dynamic admin settings to frontend components
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '../api';

export interface SystemConfig {
    _id: string;
    hostelCoords: {
        latitude: number;
        longitude: number;
        name: string;
    };
    geofenceRadiusMeters: number;
    attendanceWindow: {
        enabled: boolean;
        startHour: number;
        endHour: number;
        timezone: string;
    };
    appConfig: {
        maxGatePassDays: number;
        maxPendingPasses: number;
        attendanceGracePeriod: number;
    };
    updatedAt: string;
}

export const useSystemConfig = () => {
    return useQuery<SystemConfig>({
        queryKey: ['system-config'],
        queryFn: async () => {
            const response = await apiClient.get('/admin/config');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    });
};
