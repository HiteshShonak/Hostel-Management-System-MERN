// lib/services/complaints.service.ts — Complaints service
import api from '../api';
import { Complaint, ComplaintRequest } from '../types';
import { PaginatedResponse } from './shared.types';

export const complaintService = {
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Complaint>> => {
        const response = await api.get<{ complaints: Complaint[]; pagination: any }>(`/complaints?page=${page}&limit=${limit}`);
        return {
            data: response.data?.complaints || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 10, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    create: async (data: ComplaintRequest): Promise<Complaint> => {
        const response = await api.post<Complaint>('/complaints', data);
        return response.data;
    },

    getAllForWarden: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<Complaint>> => {
        const response = await api.get<{ complaints: Complaint[]; pagination: any }>(`/complaints/all?page=${page}&limit=${limit}`);
        return {
            data: response.data?.complaints || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 20, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    resolve: async (id: string): Promise<Complaint> => {
        const response = await api.put<Complaint>(`/complaints/${id}/resolve`);
        return response.data;
    },

    updateStatus: async (id: string, status: string): Promise<Complaint> => {
        const response = await api.put<Complaint>(`/complaints/${id}/status`, { status });
        return response.data;
    },
};
