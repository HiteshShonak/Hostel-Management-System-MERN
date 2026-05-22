// lib/hooks/useMess.ts — Mess menu hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messMenuService } from '../services';
import { MessMenuUpdate } from '../types';

export const useMessMenu = () => {
    return useQuery({
        queryKey: ['messmenu'],
        queryFn: messMenuService.getFullMenu,
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60 * 24,
    });
};

export const useUpdateMessMenu = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ day, data }: { day: string; data: MessMenuUpdate }) =>
            messMenuService.updateDayMenu(day, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messmenu'] });
        },
    });
};

export const useUpdateTimings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (timings: any) => messMenuService.updateTimings(timings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messmenu'] });
            queryClient.invalidateQueries({ queryKey: ['notices'] });
        },
    });
};
