// lib/hooks/useGuard.ts — Guard / entry-exit tracking hooks
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services';

export const useStudentsOut = () => {
    return useQuery({
        queryKey: ['gatepass', 'students-out'],
        queryFn: adminService.getStudentsOut,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60,
    });
};

export const useRecentEntries = () => {
    return useQuery({
        queryKey: ['gatepass', 'recent-entries'],
        queryFn: adminService.getRecentEntries,
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60,
    });
};

export const useActivityLogs = (page = 1, limit = 50) => {
    return useQuery({
        queryKey: ['gatepass', 'logs', page, limit],
        queryFn: () => adminService.getActivityLogs(page, limit),
        staleTime: 1000 * 30,
        refetchInterval: 1000 * 60,
    });
};
