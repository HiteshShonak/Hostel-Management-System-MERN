// lib/hooks/useNotifications.ts — Notification hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services';

export const useNotifications = (page: number = 1, limit: number = 15) => {
    return useQuery({
        queryKey: ['notifications', page, limit],
        queryFn: () => notificationService.getAll(page, limit),
    });
};

export const useUnreadNotificationCount = () => {
    return useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: notificationService.getUnreadCount,
        refetchInterval: 30000,
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};

export const useSendTestPush = () => {
    return useMutation({
        mutationFn: () => notificationService.sendTestPush(),
    });
};
