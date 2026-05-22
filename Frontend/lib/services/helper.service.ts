// lib/services/helper.service.ts — Helper role service and types
import api from '../api';

export interface HelperRegisteredUser {
    _id: string;
    name: string;
    email: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    role: string;
    year?: number;
    avatar: string;
    createdAt: string;
    linkedData: any;
    registeredBy: { _id: string; name: string; email: string };
}

export interface HelperUserSearchResult {
    _id: string;
    name: string;
    email: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    role: string;
    year?: number;
    avatar: string;
    createdAt: string;
}

export const helperService = {
    registerUser: async (data: {
        name: string;
        email: string;
        password: string;
        rollNo: string;
        room: string;
        hostel: string;
        phone: string;
        role: string;
        year?: number;
        parentEmail?: string;
    }): Promise<HelperRegisteredUser> => {
        const response = await api.post<HelperRegisteredUser>('/helper/register', data);
        return response.data;
    },

    resetUserPassword: async (userId: string, newPassword: string): Promise<{ userId: string; name: string; email: string; role: string }> => {
        const response = await api.put(`/helper/users/${userId}/reset-password`, { newPassword });
        return response.data;
    },

    searchUsers: async (params?: { search?: string; role?: string; page?: number; limit?: number }): Promise<{ users: HelperUserSearchResult[]; pagination: any }> => {
        const qs = new URLSearchParams();
        if (params?.search) qs.append('search', params.search);
        if (params?.role) qs.append('role', params.role);
        if (params?.page) qs.append('page', String(params.page));
        if (params?.limit) qs.append('limit', String(params.limit));
        const response = await api.get(`/helper/users?${qs.toString()}`);
        return response.data || { users: [], pagination: {} };
    },

    getUser: async (userId: string): Promise<HelperUserSearchResult> => {
        const response = await api.get<HelperUserSearchResult>(`/helper/users/${userId}`);
        return response.data;
    },
};
