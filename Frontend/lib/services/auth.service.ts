// lib/services/auth.service.ts — Authentication service
import api, { saveToken, removeToken } from '../api';
import { User, LoginData, RegisterData } from '../types';

export const authService = {
    login: async (data: LoginData): Promise<User> => {
        const response = await api.post('/auth/login', data);
        const userData = response.data as User & { token?: string };
        if (userData?.token) {
            await saveToken(userData.token);
        }
        return userData;
    },

    register: async (data: RegisterData): Promise<User> => {
        const response = await api.post('/auth/register', data);
        const userData = response.data as User & { token?: string };
        if (userData?.token) {
            await saveToken(userData.token);
        }
        return userData;
    },

    getMe: async (): Promise<User> => {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    updateProfile: async (data: { name?: string; phone?: string; room?: string; year?: number }): Promise<User> => {
        const response = await api.put<User>('/auth/profile', data);
        return response.data;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await api.put('/auth/password', { currentPassword, newPassword });
    },

    updatePushToken: async (pushToken: string): Promise<void> => {
        await api.put('/auth/push-token', { pushToken });
    },

    logout: async () => {
        await removeToken();
    },
};
