// lib/services/notices.service.ts — Notices service
import api from '../api';
import { Notice, NoticeRequest } from '../types';
import { PaginatedResponse } from './shared.types';

export const noticeService = {
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Notice>> => {
        const response = await api.get<{ notices: Notice[]; pagination: any }>(`/notices?page=${page}&limit=${limit}`);
        return {
            data: response.data?.notices || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 10, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    getOne: async (id: string): Promise<Notice> => {
        const response = await api.get<Notice>(`/notices/${id}`);
        return response.data;
    },

    create: async (data: NoticeRequest): Promise<Notice> => {
        const response = await api.post<Notice>('/notices', data);
        return response.data;
    },

    update: async (id: string, data: NoticeRequest): Promise<Notice> => {
        const response = await api.put<Notice>(`/notices/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/notices/${id}`);
    },
};
