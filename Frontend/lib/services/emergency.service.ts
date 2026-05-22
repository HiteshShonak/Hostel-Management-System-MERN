// lib/services/emergency.service.ts — Emergency and SOS service
import api from '../api';
import { Emergency, EmergencyContact, EmergencyRequest, SOSResponse } from '../types';

export const emergencyService = {
    sendSOS: async (data: EmergencyRequest): Promise<SOSResponse> => {
        const response = await api.post<SOSResponse>('/emergency/sos', data);
        return response.data;
    },

    getContacts: async (): Promise<EmergencyContact[]> => {
        const response = await api.get<EmergencyContact[]>('/emergency/contacts');
        return response.data;
    },

    getActive: async (): Promise<Emergency[]> => {
        const response = await api.get<{ alerts: Emergency[]; pagination: any }>('/emergency/active');
        return response.data?.alerts || [];
    },

    getHistory: async (): Promise<Emergency[]> => {
        const response = await api.get<{ emergencies: Emergency[]; pagination: any }>('/emergency/history');
        return response.data?.emergencies || [];
    },

    acknowledge: async (id: string): Promise<Emergency> => {
        const response = await api.put<Emergency>(`/emergency/${id}/acknowledge`);
        return response.data;
    },

    resolve: async (id: string): Promise<Emergency> => {
        const response = await api.put<Emergency>(`/emergency/${id}/resolve`);
        return response.data;
    },
};
