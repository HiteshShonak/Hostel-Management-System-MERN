// lib/hooks/useSystem.ts — System config and stats hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services';

export const useSystemConfig = () => {
    return useQuery({
        queryKey: ['admin', 'config'],
        queryFn: adminService.getSystemConfig,
        staleTime: 1000 * 60 * 5,
    });
};

export const useUpdateSystemConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.updateSystemConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'config'] });
        },
    });
};

export const useSystemStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: adminService.getSystemStats,
        staleTime: 1000 * 60 * 2,
    });
};
