// lib/services/gatepass.service.ts — Gate pass service
import api from '../api';
import { GatePass, GatePassRequest, GatePassValidation } from '../types';
import { PaginatedResponse } from './shared.types';

export const gatePassService = {
    getAll: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<GatePass>> => {
        const response = await api.get<{ passes: GatePass[]; pagination: any }>(`/gatepass?page=${page}&limit=${limit}`);
        return {
            data: response.data?.passes || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 10, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    getCurrent: async (): Promise<{ pass: GatePass | null; isCurrentlyOut: boolean }> => {
        const response = await api.get<{ pass: GatePass | null; isCurrentlyOut: boolean }>('/gatepass/current');
        return response.data;
    },

    request: async (data: GatePassRequest): Promise<GatePass> => {
        const response = await api.post<GatePass>('/gatepass', data);
        return response.data;
    },

    getPending: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/pending');
        return response.data;
    },

    getAllPasses: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/all');
        return response.data;
    },

    getAllPassesHistory: async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<GatePass>> => {
        const response = await api.get<{ passes: GatePass[]; pagination: any }>(`/gatepass/all?page=${page}&limit=${limit}`);
        return {
            data: response.data?.passes || [],
            pagination: response.data?.pagination || { total: 0, page: 1, limit: 20, pages: 0, hasNext: false, hasPrev: false },
        };
    },

    approve: async (id: string): Promise<GatePass> => {
        const response = await api.put<GatePass>(`/gatepass/${id}/approve`);
        return response.data;
    },

    reject: async (id: string): Promise<GatePass> => {
        const response = await api.put<GatePass>(`/gatepass/${id}/reject`);
        return response.data;
    },

    validate: async (qrValue: string): Promise<GatePassValidation> => {
        const response = await api.post<GatePassValidation>('/gatepass/validate', { qrValue });
        return response.data;
    },

    markExit: async (id: string): Promise<GatePass> => {
        const response = await api.put<GatePass>(`/gatepass/${id}/exit`);
        return response.data;
    },

    markEntry: async (id: string): Promise<GatePass> => {
        const response = await api.put<GatePass>(`/gatepass/${id}/entry`);
        return response.data;
    },
};
