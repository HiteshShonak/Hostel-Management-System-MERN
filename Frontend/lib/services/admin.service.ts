import api from '../api';
import { User, GatePass } from '../types';

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    rollNo: string;
    room: string;
    hostel: string;
    phone: string;
    role: string;
    year?: number; // Academic year (1-4) — only for students
    createdAt: string;
}

export interface ParentStudentLink {
    _id: string;
    parent: {
        _id: string;
        name: string;
        email: string;
    };
    student: {
        _id: string;
        name: string;
        rollNo: string;
        room: string;
        hostel: string;
    };
    relationship: string;
    linkedBy: {
        _id: string;
        name: string;
    };
    status: string;
    createdAt: string;
}

export const adminService = {
    getUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }): Promise<{ users: AdminUser[]; pagination: any; stats?: any }> => {
        const searchParams = new URLSearchParams();
        if (params?.role) searchParams.append('role', params.role);
        if (params?.search) searchParams.append('search', params.search);
        if (params?.page) searchParams.append('page', String(params.page));
        if (params?.limit) searchParams.append('limit', String(params.limit));
        const response = await api.get(`/admin/users?${searchParams.toString()}`);
        return response.data || { users: [], pagination: {} };
    },

    getUserRelations: async (userId: string): Promise<ParentStudentLink[]> => {
        const response = await api.get<ParentStudentLink[]>(`/admin/user/${userId}/relations`);
        return response.data || [];
    },

    updateUserRole: async (userId: string, role: string): Promise<AdminUser> => {
        const response = await api.put<AdminUser>(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    getParentLinks: async (page: number = 1, limit: number = 50): Promise<{ links: ParentStudentLink[]; pagination: any }> => {
        const response = await api.get(`/admin/parent-links?page=${page}&limit=${limit}`);
        return response.data || { links: [], pagination: {} };
    },

    linkParent: async (data: { parentId: string; studentId: string; relationship: 'Father' | 'Mother' | 'Guardian' }): Promise<ParentStudentLink> => {
        const response = await api.post<ParentStudentLink>('/admin/link-parent', data);
        return response.data;
    },

    unlinkParent: async (linkId: string): Promise<void> => {
        await api.delete(`/admin/link-parent/${linkId}`);
    },

    getWardenDashboardStats: async (): Promise<{
        totalStudents: number;
        studentsOut: number;
        studentsInside: number;
        pendingPasses: number;
    }> => {
        const response = await api.get('/admin/warden/dashboard-stats');
        return response.data;
    },

    getWardenStudents: async (page: number = 1, limit: number = 20, search?: string): Promise<{
        students: Array<{
            _id: string;
            name: string;
            email: string;
            rollNo: string;
            room: string;
            hostel: string;
            phone: string;
            avatar: string;
            year?: number;
            isOut: boolean;
        }>;
        pagination: { total: number; page: number; limit: number; pages: number };
    }> => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
        if (search) params.append('search', search);
        const response = await api.get(`/admin/warden/students?${params.toString()}`);
        return response.data;
    },

    getStudentDetail: async (studentId: string): Promise<{
        student: User;
        passes: {
            recent: GatePass[];
            isCurrentlyOut: boolean;
            activePass: GatePass | null;
        };
    }> => {
        const response = await api.get(`/admin/warden/students/${studentId}`);
        return response.data;
    },

    getSystemConfig: async (): Promise<{
        _id: string;
        hostelCoords: { latitude: number; longitude: number; name: string };
        geofenceRadiusMeters: number;
        appConfig: { maxGatePassDays: number; maxPendingPasses: number };
        updatedAt: string;
    }> => {
        const response = await api.get('/admin/config');
        return response.data;
    },

    updateSystemConfig: async (config: {
        hostelCoords?: { latitude?: number; longitude?: number; name?: string };
        geofenceRadiusMeters?: number;
        appConfig?: { maxGatePassDays?: number; maxPendingPasses?: number };
    }): Promise<void> => {
        await api.put('/admin/config', config);
    },

    getSystemStats: async (): Promise<{
        users: {
            total: number;
            students: number;
            byRole: { student: number; warden: number; parent: number; admin: number; guard: number; mess_staff: number; helper: number }
        };
        gatePasses: { total: number; approved: number; pending: number; rejected: number };
        notices: number;
        pendingComplaints: number;
    }> => {
        const response = await api.get('/admin/system-stats');
        return response.data;
    },

    getStudentsOut: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/students-out');
        return response.data || [];
    },

    getRecentEntries: async (): Promise<GatePass[]> => {
        const response = await api.get<GatePass[]>('/gatepass/recent-entries');
        return response.data || [];
    },

    getActivityLogs: async (page = 1, limit = 50): Promise<{
        logs: Array<{
            _id: string;
            gatePass: { _id: string; reason: string; fromDate: string; toDate: string; qrValue: string };
            user: { _id: string; name: string; rollNo: string; room: string; hostel: string; phone: string };
            action: 'EXIT' | 'ENTRY';
            timestamp: string;
            markedBy: { _id: string; name: string; role: string };
        }>;
        pagination: { total: number; page: number; limit: number; hasNext: boolean };
    }> => {
        const response = await api.get(`/gatepass/logs?page=${page}&limit=${limit}`);
        return response.data || { logs: [], pagination: { total: 0, page: 1, limit, hasNext: false } };
    },
};
