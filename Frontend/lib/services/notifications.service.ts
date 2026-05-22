// lib/services/notifications.service.ts — Push notifications service
import api from '../api';
import { AppNotification } from '../types';
import { PaginatedResponse } from './shared.types';

export const notificationService = {
    getAll: async (page: number = 1, limit: number = 15): Promise<PaginatedResponse<AppNotification>> => {
        const response = await api.get<{ notifications: AppNotification[]; pagination: any }>(`/notifications?page=${page}&limit=${limit}`);
        return {
            data: response.data?.notifications || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 15, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await api.get<{ count: number }>('/notifications/unread-count');
        return response.data?.count || 0;
    },

    markAsRead: async (id: string): Promise<void> => {
        await api.put(`/notifications/${id}/read`);
    },

    markAllAsRead: async (): Promise<void> => {
        await api.put('/notifications/read-all');
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/notifications/${id}`);
    },
};
