// lib/hooks/useAttendance.ts — Attendance hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '../services';

export const useAttendance = () => {
    return useQuery({
        queryKey: ['attendance'],
        queryFn: attendanceService.getAll,
        staleTime: 1000 * 60 * 10,
    });
};

export const useAttendanceHistory = () => {
    return useQuery({
        queryKey: ['attendance', 'history'],
        queryFn: attendanceService.getAll,
        staleTime: 1000 * 60 * 10,
    });
};

export const useAttendanceStats = () => {
    return useQuery({
        queryKey: ['attendance', 'stats'],
        queryFn: attendanceService.getStats,
        staleTime: 1000 * 60 * 10,
    });
};

export const useTodayAttendance = () => {
    return useQuery({
        queryKey: ['attendance', 'today'],
        queryFn: attendanceService.checkToday,
        staleTime: 1000 * 60,
        refetchOnMount: 'always',
    });
};

export const useMarkAttendance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (location: { latitude: number; longitude: number }) =>
            attendanceService.mark(location),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendance'] });
        },
    });
};
