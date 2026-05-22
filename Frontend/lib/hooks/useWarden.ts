// lib/hooks/useWarden.ts — Warden hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services';

export const useWardenDashboardStats = () => {
    return useQuery({
        queryKey: ['warden', 'dashboard-stats'],
        queryFn: adminService.getWardenDashboardStats,
        staleTime: 1000 * 30,
        refetchInterval: 60000,
    });
};

export const useWardenStudents = (page: number = 1, limit: number = 20, search?: string) => {
    return useQuery({
        queryKey: ['warden', 'students', page, limit, search],
        queryFn: () => adminService.getWardenStudents(page, limit, search),
        staleTime: 1000 * 60,
    });
};

export const useStudentDetail = (studentId: string) => {
    return useQuery({
        queryKey: ['warden', 'student', studentId],
        queryFn: () => adminService.getStudentDetail(studentId),
        enabled: !!studentId,
        staleTime: 1000 * 60,
    });
};

export const useWardenMarkAttendance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (studentId: string) => adminService.wardenMarkAttendance(studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['warden'] });
        },
    });
};
