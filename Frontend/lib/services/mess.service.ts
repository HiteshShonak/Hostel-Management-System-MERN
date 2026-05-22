// lib/services/mess.service.ts — Mess menu service
import api from '../api';
import { MessMenuResponse, MessMenuUpdate, MessTimings } from '../types';

export const messMenuService = {
    getFullMenu: async (): Promise<MessMenuResponse> => {
        const response = await api.get<MessMenuResponse>('/messmenu');
        return response.data;
    },

    getDayMenu: async (day: string) => {
        const response = await api.get(`/messmenu/${day}`);
        return response.data;
    },

    updateDayMenu: async (day: string, data: MessMenuUpdate) => {
        const response = await api.put(`/messmenu/${day}`, data);
        return response.data;
    },

    updateTimings: async (timings: MessTimings) => {
        const response = await api.put('/messmenu/timings', { timings });
        return response.data;
    },
};
