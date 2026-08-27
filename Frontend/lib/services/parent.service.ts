// lib/services/parent.service.ts — Parent service and types
import api from '../api';

export interface ParentChild {
    _id: string;
    name: string;
    email: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    year?: number; // Academic year (1-4) — only for students
    relationship: string;
    linkedAt: string;
}

export interface PendingGatePass {
    _id: string;
    reason: string;
    fromDate: string;
    toDate: string;
    status: string;
    createdAt: string;
    student: {
        _id: string;
        name: string;
        rollNo: string;
        room: string;
        hostel: string;
        phone: string;
    };
}

export const parentService = {
    getChildren: async (): Promise<ParentChild[]> => {
        const response = await api.get<ParentChild[]>('/parent/children');
        return response.data || [];
    },

    getPendingPasses: async (): Promise<PendingGatePass[]> => {
        const response = await api.get<PendingGatePass[]>('/parent/pending-passes');
        return response.data || [];
    },

    getAllPasses: async (page: number = 1, limit: number = 20, studentId?: string): Promise<{ passes: any[]; pagination: any }> => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (studentId) params.append('studentId', studentId);
        const response = await api.get(`/parent/passes?${params.toString()}`);
        return response.data || { passes: [], pagination: {} };
    },

    approvePass: async (passId: string): Promise<any> => {
        const response = await api.put(`/parent/passes/${passId}/approve`);
        return response.data;
    },

    rejectPass: async (passId: string, reason?: string): Promise<any> => {
        const response = await api.put(`/parent/passes/${passId}/reject`, { reason });
        return response.data;
    },
};
