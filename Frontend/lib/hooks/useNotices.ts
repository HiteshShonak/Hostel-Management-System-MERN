// lib/hooks/useNotices.ts — Notices hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noticeService } from '../services';
import { NoticeRequest } from '../types';

export const useNotices = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['notices', page, limit],
        queryFn: () => noticeService.getAll(page, limit),
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData: any) => previousData,
    });
};

export const useCreateNotice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: NoticeRequest) => noticeService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
        },
    });
};

export const useDeleteNotice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => noticeService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
        },
    });
};
